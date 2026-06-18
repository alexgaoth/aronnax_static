"""
Generate synthetic demo data for the dashboard without needing HuggingFace.
Run: python gen_demo.py
"""
import json
import math
import random
import shutil
from pathlib import Path

random.seed(42)
K = 10
N_CHUNKS = 40

def sin_noise(t, freq=0.3, amp=1.0, noise=0.05):
    return amp * math.sin(t * freq) + random.gauss(0, noise)

chunks = []
for ci in range(N_CHUNKS):
    t0 = ci * K * 0.1
    traj = f"traj_{ci // 10:02d}"
    is_fighting = (ci % 7 == 3) or (ci % 13 == 5)

    # Build K rows
    imu_series = []
    depth_series = []
    action_chunk = []

    for ki in range(K):
        t = t0 + ki * 0.1
        fwd_cmd = 0.6 if is_fighting else sin_noise(t, 0.2, 0.4, 0.05)
        fwd_accel = 0.01 if is_fighting else fwd_cmd * 0.9 + random.gauss(0, 0.03)

        pwm = [
            round(fwd_cmd, 4),
            round(fwd_cmd * 0.95 + random.gauss(0, 0.02), 4),
            round(-fwd_cmd * 0.1, 4),
            round(-fwd_cmd * 0.1, 4),
            round(sin_noise(t, 0.1, 0.15, 0.02), 4),
            round(sin_noise(t, 0.1, 0.15, 0.02), 4),
        ]
        action_chunk.append(pwm)

        imu = [
            round(fwd_accel, 4),
            round(random.gauss(0, 0.02), 4),
            round(random.gauss(0, 0.02), 4),
            round(sin_noise(t, 0.5, 0.05, 0.01), 4),
            round(sin_noise(t, 0.4, 0.04, 0.01), 4),
            round(sin_noise(t, 0.3, 0.03, 0.01), 4),
        ]
        imu_series.append(imu)
        depth_series.append(round(5.0 + sin_noise(t, 0.05, 0.5, 0.02), 3))

    drift = round(fwd_cmd - fwd_accel, 4) if is_fighting else 0.0

    scenario = random.choice(["seabed", "shipwreck", "open_water"])

    # Phase 4 — synthetic cross-modal sonar fan (None if numpy/PIL absent → JS fallback)
    from underwater_vla.sonar import synthetic_fan  # noqa: E402
    sonar_b64, sonar_boxes = synthetic_fan(
        depth_m=depth_series[0], drift_magnitude=drift, scenario=scenario, seed=ci,
    )

    chunks.append({
        "t_start": round(t0, 3),
        "t_end": round(t0 + (K - 1) * 0.1, 3),
        "trajectory_id": traj,
        "action_chunk": action_chunk,
        "obs_frame_b64": None,
        "sonar_frame_b64": sonar_b64,
        "sonar_boxes": sonar_boxes,
        "hydro_label": "fighting_current" if is_fighting else "nominal",
        "drift_magnitude": drift,
        "task_label": random.choice(["navigate_to_target", "inspect_pipeline", "hover_station"]),
        "scenario": scenario,
        "state_snapshot": {
            "imu": imu_series[0],
            "depth_m": depth_series[0],
            "roll_rad": round(sin_noise(t0, 0.1, 0.05, 0.005), 4),
            "pitch_rad": round(sin_noise(t0, 0.15, 0.04, 0.005), 4),
            "yaw_rad": round(t0 * 0.02 % (2 * math.pi), 4),
            "dvl_velocity": [
                round(fwd_cmd * 0.3, 4),
                round(random.gauss(0, 0.01), 4),
                round(random.gauss(0, 0.005), 4),
            ],
        },
        "imu_series": imu_series,
        "depth_series": depth_series,
    })

out = Path("outputs/chunks.json")
out.parent.mkdir(exist_ok=True)
with open(out, "w") as f:
    json.dump(chunks, f, indent=2)
print(f"Wrote {len(chunks)} chunks → {out}")

dest = Path("web/public/demo/chunks.json")
dest.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(out, dest)
print(f"Copied → {dest}")

# Phase 3 — also emit the training-ready Parquet (graceful no-op if pyarrow absent)
from underwater_vla.export import export_parquet  # noqa: E402

export_parquet(chunks)
