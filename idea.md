# Underwater VLA Annotation Pipeline — MVP Build Spec
### Bow Capital x UCSD StartBlue Application Blueprint

---

## Thesis in One Line

The first mover to deploy a plug-and-play black box on commercial ROV tether lines will own the
only real-world, human-pilot Vision-Sonar-Action dataset in existence — and therefore own the
foundation software layer for all marine autonomy.

The MVP demonstrates the ingestion → alignment → auto-labeling → training-ready token pipeline
on public data today, so the moment real black-box traces arrive, the pipeline already runs.

---

## The Datasets

### 1. USIM (Primary — use this first)
- **What:** Simulation-based underwater VLA dataset, BlueROV2 in Stonefish simulator
- **Size:** 905K frames, 2,275 trajectories, ~25 hours, 20 tasks, 9 scenarios
- **Action space:** Normalized thruster PWM signals + manipulator joint angles
- **Sensors:** Binocular vision, IMU, pressure/depth, DVL velocity
- **Access:** Public, HuggingFace
  - Dataset: `Vincent2025hello/usimcou`
  - Model weights: `Vincent2025hello/u0_final`
  - Model code: `github.com/VincentGu2000/u0model`
  - Sim environment: `github.com/VincentGu2000/u0env`
- **Limitation:** 100% simulated — sim-to-real gap is the exact problem your black box solves.
  Frame the fine-tune on USIM as "pipeline validation," not "the product."

### 2. Sydney Harbour Sonar+Optical (Cross-modal demo)
- **What:** Real ROV in Sydney Harbour — paired Oculus M-series FLS sonar + optical video
- **Access:** Zenodo record `14087658`, CC BY-NC-SA
- **Contents:** Sonar recordings (proprietary Oculus format), synchronized optical video, some
  bounding-box CSV annotations
- **Use in MVP:** The cross-modal alignment viz panel (sonar frame beside optical frame).
  Use second, after USIM spine is working.
- **Caveat:** Sonar files require Blueprint Subsea's Oculus Viewer for conversion — budget a
  format-conversion step before ingestion.

### 3. UATD / FSOD (Sonar perception bonus — optional for v1)
- **UATD:** 9,000+ multibeam FLS images, Tritech Gemini 1200ik, 10 annotated object categories,
  lake + shallow water
- **FSOD:** FLS object detection, Oculus M750d on ROV, Bohai Bay
- **Use:** Plug into the perception-labeling module to show sonar return classification.
  Not on the critical path for MVP.

### 4. Real BlueROV2 MAVLink Logs (Action telemetry, no large public repo)
- **Formats:** `.tlog` (QGroundControl/MAVProxy telemetry) and `.BIN` (ArduSub Dataflash)
- **Parsing tool:** `github.com/clydemcqueen/ardusub_log_tools`
- **Key MAVLink messages:**
  - `RC_CHANNELS` / `RC_CHANNELS_OVERRIDE` → joystick action vector
  - `SCALED_IMU` → accelerations, angular velocity
  - `SCALED_PRESSURE` → depth
  - `ATTITUDE` → roll, pitch, yaw
- **Source:** Sample `.tlog` files float on Blue Robotics forums; generate your own via
  ArduSub SITL + Gazebo for controlled test data.
- **Note:** The absence of a large public repo of real human-pilot traces IS the moat.
  Use SITL-generated logs for pipeline testing; real operator logs are the product.

---

## Pipeline Architecture

```
┌─────────────┐   ┌──────────────┐   ┌───────────────┐   ┌──────────────┐
│  STAGE 1    │ → │  STAGE 2     │ → │  STAGE 3      │ → │  STAGE 4     │
│  INGEST     │   │  ALIGN/SYNC  │   │  AUTO-LABEL   │   │  EXPORT/VIZ  │
│  parse raw  │   │  timestamp   │   │  derive VLA   │   │  training    │
│  streams    │   │  join        │   │  tokens       │   │  tokens + UI │
└─────────────┘   └──────────────┘   └───────────────┘   └──────────────┘
```

---

## Stage 1 — Ingest

**Goal:** One adapter per source format. Everything downstream sees a uniform `(timestamp, value)`
stream regardless of origin.

### Adapters to build

| Adapter | Source | Library |
|---|---|---|
| `usim_loader.py` | HuggingFace USIM dataset | `datasets`, `PIL` |
| `mavlink_loader.py` | `.tlog` / `.BIN` files | `pymavlink.mavutil` |
| `sonar_video_loader.py` | Sydney Harbour Zenodo | OpenCV + Oculus converter |

### USIM adapter
```python
from datasets import load_dataset

ds = load_dataset("Vincent2025hello/usim")
# Each record has: left_image, right_image, action, imu, depth, task_label, trajectory_id
```

### MAVLink adapter — messages to extract
```python
from pymavlink import mavutil

mav = mavutil.mavlink_connection("flight.tlog")
while True:
    msg = mav.recv_match(
        type=["RC_CHANNELS", "SCALED_IMU", "SCALED_PRESSURE", "ATTITUDE"],
        blocking=True
    )
    # RC_CHANNELS  → chan1_raw .. chan8_raw (PWM 1100-1900 µs) = action vector
    # SCALED_IMU   → xacc, yacc, zacc, xgyro, ygyro, zgyro
    # SCALED_PRESSURE → press_abs, temperature → depth
    # ATTITUDE     → roll, pitch, yaw
```

---

## Stage 2 — Align / Sync

**Goal:** Emit time-ordered rows where every row is a complete snapshot: one instant in time has
vision + sonar + action + state all present. This is what makes it a dataset.

### The transformation

Raw streams arrive at different rates (camera 30Hz, IMU 100Hz, MAVLink telemetry ~10Hz).
Resample everything to a fixed rate (10Hz is a reasonable default). Forward-fill sparse signals.

### Output row schema

```python
{
  "t":              float,        # Unix timestamp seconds
  "trajectory_id":  str,          # which run/session
  "frame_left":     np.ndarray,   # H x W x 3, uint8
  "frame_right":    np.ndarray,   # H x W x 3, uint8 (None if monocular)
  "sonar_frame":    np.ndarray,   # H x W, float32 polar image (None if unavailable)
  "action": {
    "thruster_pwm": List[float],  # 6 values, normalized [-1, 1] from raw PWM
    "joint_angles": List[float],  # manipulator DOF, [] if no arm
  },
  "state": {
    "imu":          List[float],  # [ax, ay, az, gx, gy, gz]
    "depth_m":      float,
    "roll_rad":     float,
    "pitch_rad":    float,
    "yaw_rad":      float,
    "dvl_velocity": List[float],  # [vx, vy, vz] m/s, None if unavailable
  },
  "task_label":     str,          # e.g. "inspect_pipeline", "navigate_to_target"
  "scenario":       str,          # e.g. "seabed", "shipwreck"
}
```

### PWM normalization (critical — must be identical across sim and real)
```python
def normalize_pwm(raw_pwm: int) -> float:
    # BlueROV2 range: 1100 (full reverse) to 1900 (full forward), 1500 = neutral
    return (raw_pwm - 1500) / 400.0  # output: [-1.0, 1.0]
```

**This normalization is the single thing that makes sim and real data interchangeable.
Fix it now and never change it.**

---

## Stage 3 — Auto-Label

**Goal:** Derive labels from the aligned rows with zero human input. This is the investor
demo moment — the pipeline labels itself.

### Label A: Hydrodynamic inference (build this first, it's the core differentiator)

```python
def label_hydrodynamic(row, accel_threshold=0.05):
    """
    If the pilot commands forward thrust but IMU shows near-zero forward acceleration,
    the vehicle is fighting a current. Derive the label automatically from paired data.
    """
    fwd_command = row["action"]["thruster_pwm"][0]   # channel 1 = forward
    fwd_accel   = row["state"]["imu"][0]              # ax

    if abs(fwd_command) > 0.3 and abs(fwd_accel) < accel_threshold:
        drift_estimate = fwd_command - fwd_accel      # proxy for current force
        return {"hydro_label": "fighting_current", "drift_magnitude": drift_estimate}
    return {"hydro_label": "nominal", "drift_magnitude": 0.0}
```

This converts a subjective human reaction into a physics-aware, objectively derived token.
No human annotator. No manual pass. This is section 4.3 of the thesis made real.

### Label B: Action chunking (ACT-style, no CVAE needed for MVP)

```python
def chunk_actions(rows, k=10, alpha=0.8):
    """
    Group k consecutive action rows into one chunk.
    Apply exponential smoothing to eliminate jitter.
    Output: one chunk token per k rows, ready for π0 fine-tuning.
    """
    chunks = []
    for i in range(0, len(rows) - k, k):
        window = [r["action"]["thruster_pwm"] for r in rows[i:i+k]]
        smoothed = exponential_smooth(window, alpha)
        chunks.append({
            "t_start":       rows[i]["t"],
            "t_end":         rows[i+k-1]["t"],
            "action_chunk":  smoothed,         # shape: [k, 6]
            "obs_frame":     rows[i]["frame_left"],
            "hydro_label":   rows[i]["hydro_label"],
            "task_label":    rows[i]["task_label"],
        })
    return chunks
```

### Label C: Perception labels (optional for v1)
Run a lightweight detector (YOLOv8 fine-tuned on UATD) on sonar frames.
Attach detected object categories as a `"scene_tags"` field on each row.
Not on the critical path — add after A and B are working.

---

## Stage 4 — Export + Next.js Viz

### Export format

```python
import pandas as pd

df = pd.DataFrame(chunks)
df.to_parquet("underwater_vla_chunks.parquet", index=False)
# Also write as JSON for human inspection
df.to_json("web/public/demo/chunks.json", orient="records", indent=2)
```

Each row in the output file is one training sample for the fine-tune:
`(visual observation window, action chunk, derived labels)`.

### React / Next.js dashboard (the demo that sells it)

A single-page Next.js app that reads static JSON from `web/public/demo/chunks.json`.
No backend for v1; the Python pipeline writes files, the web app renders them.

- **Timeline scrubber** — move through a trajectory second by second
- **Left panel** — optical frame at time `t`
- **Right panel** — action chunk + label metadata for v1; aligned sonar frame in Phase 4
- **Action overlay** — arrow vectors showing thruster direction/magnitude
- **IMU strip** — acceleration + angular rate time series
- **Label bar** — `fighting_current` lights up in orange when the hydrodynamic label fires
- **Chunk boundaries** — vertical lines showing where action chunk windows start/end

The viz makes the abstract pipeline concrete in 30 seconds for a non-technical audience.

---

## Fine-Tuning on π0

### Why π0
π0.5 was already benchmarked on USIM in the U0 paper (37.6% overall success rate vs U0's 43.1%).
The combination is proven. Your pipeline output format is designed to match π0's expected input.

### Action space mapping
π0 expects action chunks via flow matching. Your Stage 3 output already produces these.
The critical constraint: **action dimension and normalization must be fixed and consistent.**

```
π0 action head input: Tensor [batch, k, action_dim]
Your output:          action_chunk shape [k, 6]  (6 thruster channels)
                      + joint_angles if arm present
```

Fix `action_dim = 6` (thrusters only) for the MVP. Extend to include joint angles in v2.

### Fine-tune strategy for MVP

1. Load π0 base weights
2. Freeze vision encoder — only fine-tune action head + cross-attention layers (LoRA)
3. Train on USIM chunks from Stage 4 output
4. Evaluate on held-out USIM trajectories
5. Report: task success rate on navigation tasks (benchmark exists from U0 paper to compare against)

**Frame this as:** "Pipeline validation — proves our tokenization produces learnable training
signal. Real-data fine-tune is the roadmap unlock that arrives with the black box."

---

## Phased Execution Plan

### Phase 0 — Repo skeleton
- Create a minimal Python package for the pipeline and a minimal Next.js app in `web/`.
- Add `data/README.md` and `outputs/README.md`; do not commit raw datasets.
- Add one CLI command: `python -m underwater_vla build --limit 200`.

### Phase 1 — USIM spine
- Load a small USIM slice from HuggingFace.
- Normalize actions to fixed 6-thruster vectors.
- Emit aligned rows using USIM native record order; skip generic timestamp resampling until real logs arrive.
- Apply hydrodynamic labels.
- Export `outputs/chunks.json` and copy the same file to `web/public/demo/chunks.json`.

### Phase 2 — Next.js dashboard
- Render `web/public/demo/chunks.json` in a single dashboard route.
- Include the timeline scrubber, optical frame, action vector view, IMU/depth strip, label bar, and chunk boundaries.
- Keep all data static for v1 so the demo runs with `npm run dev` and no server wiring.

### Phase 3 — Training-ready chunks
- Add ACT-style action chunking with exponential smoothing.
- Keep output shape fixed at `[k, 6]`.
- Add Parquet export only after JSON works.

### Phase 4 — Cross-modal upgrade
- Add Sydney Harbour conversion/ingest after the USIM demo is working.
- Add sonar panel beside the optical frame.
- Keep MAVLink and real BlueROV2 logs separate until a real trace is available.

### Phase 5 — Fine-tune validation
- Load π0 base weights.
- Freeze vision encoder.
- Fine-tune action head + cross-attention with LoRA on exported USIM chunks.
- Evaluate on held-out USIM trajectories.

### Cut from v1 entirely
- Physics-based color restoration (section 4.2 of thesis) — preprocessing nicety, not load-bearing
- Sonar object detection (UATD/FSOD labels) — good roadmap item, not MVP
- CVAE for action chunking — exponential smoothing is sufficient for demo
- API server — static files are enough for the first dashboard

---

## Repo Layout

```
underwater-vla/
├── underwater_vla/
│   ├── __main__.py             # `python -m underwater_vla build --limit 200`
│   ├── usim.py                 # HuggingFace USIM adapter
│   ├── normalize.py            # PWM normalization contract
│   ├── label.py                # hydrodynamic label
│   ├── chunk.py                # action chunking + smoothing
│   └── export.py               # JSON first, Parquet later
├── web/
│   ├── app/
│   │   └── page.tsx            # Next.js dashboard
│   ├── public/
│   │   └── demo/
│   │       └── chunks.json     # generated demo data
│   └── package.json
├── outputs/
│   └── README.md               # generated chunks go here
└── data/
    └── README.md               # where to put raw dataset files
```

---

## Key Numbers for the Bow Application

| Claim | Source |
|---|---|
| Only public underwater VLA dataset is 100% simulated | USIM paper (Oct 2025) |
| No public dataset has real human-pilot action traces paired with vision | Gap between USIM (sim) and Sydney Harbour (no actions) |
| π0.5 on USIM out-of-the-box: 37.6% success | U0 benchmark table |
| U0 fine-tuned on USIM: 43.1% success | U0 benchmark table |
| Your pipeline improves on both by adding real-world hydrodynamic context | Your thesis |
| Subsea IRM market: $7.1B (2025) → $13.7B (2034) | Cited in thesis doc |
| DoD Replicator budget: $400M–$800M | Cited in thesis doc |

---

## The One-Sentence Pitch

> The ocean is the only domain where AI cannot learn from the internet —
> we built the pipeline that turns commercial ROV operators into unwitting
> data generators, and the black box that captures everything they know.