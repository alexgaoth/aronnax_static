"""Cross-modal sonar adapter (Phase 4).

Underwater, optical cameras die in turbidity past a few metres; forward-looking
sonar (FLS) is the see-through-murk channel. This module adds a second modality
to each aligned row — a `sonar_frame_b64` fan image keyed to the same instant `t`
as the optical frame — so the dashboard can show both side by side and the
training rows carry both observations.

Two backends behind one contract:

  * `from_oculus(path)`  — real Blueprint Oculus M-series ingest. The Sydney
    Harbour set (Zenodo 14087658) ships proprietary `.oman` that needs Blueprint's
    Oculus Viewer to convert; this is a typed stub documenting the field layout so
    a real trace slots in unchanged.
  * `synthetic_fan(...)` — procedural fan-beam FLS image so the cross-modal spine
    and viz run today without the GUI conversion.

`attach_sonar(rows)` is the align step: it stamps `sonar_frame_b64` onto each row.
Everything downstream treats the field as nullable, so USIM-only builds (no sonar)
keep working untouched.
"""
from __future__ import annotations

import base64
import hashlib
import io
import math
from typing import Iterator, Optional

# FLS fan geometry — Oculus M750d-ish: ~130° aperture, range bins up the image.
APERTURE_DEG = 130.0
SONAR_W = 220
SONAR_H = 180

# FLS detection taxonomy, scenario-driven. Mirrors the UATD/FSOD category spirit
# (idea.md:42-47) — the classes a real detector / human-verify pass would assign.
SCENARIO_CLASSES = {
    "shipwreck": ["hull_section", "debris", "debris", "anchor"],
    "seabed": ["pipeline", "boulder"],
    "open_water": ["fish_school"],
}


def _seed_from_row(row: dict) -> int:
    """Deterministic per-row seed so a trajectory renders the same sonar every run."""
    key = f"{row.get('trajectory_id', '')}:{row.get('t', 0.0):.3f}"
    return int(hashlib.md5(key.encode()).hexdigest()[:8], 16)


def synthetic_fan(
    *,
    depth_m: float = 5.0,
    drift_magnitude: float = 0.0,
    scenario: str = "seabed",
    seed: int = 0,
) -> tuple[Optional[str], list[dict]]:
    """Render a procedural forward-looking-sonar fan as a base64 PNG + ground-truth boxes.

    The geometry mimics a real FLS return: a bright seabed/structure arc at some
    range, a few target blobs, and range-dependent speckle inside a ±aperture/2
    wedge. `drift_magnitude` (the hydrodynamic current proxy) smears returns
    laterally, so a "fighting_current" instant visibly differs from a nominal one.

    Returns `(data:image/png;base64,…, boxes)` where boxes is a list of
    ground-truth detections (see below). Because we *place* the targets, the boxes
    are exact by construction — synthetic data is perfectly labeled, so this proves
    the pipeline carries detection annotations without any human or detector. The
    real-data path (from_oculus) is where a detector + human-verify tier slots in.

    Returns `(None, [])` if numpy/PIL are absent (build emits sonar_frame_b64=None
    and the dashboard falls back to its SVG renderer).
    """
    try:
        import numpy as np  # type: ignore
        from PIL import Image  # type: ignore
    except ImportError:
        return None, []

    boxes: list[dict] = []

    rng = np.random.default_rng(seed)
    h, w = SONAR_H, SONAR_W
    apex_x = w / 2.0
    apex_y = float(h)  # transducer at bottom-centre, fan opens upward
    half_ap = math.radians(APERTURE_DEG / 2.0)
    max_range = float(h)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    dx = xx - apex_x
    dy = apex_y - yy  # up is positive range
    rng_pix = np.sqrt(dx * dx + dy * dy)
    bearing = np.arctan2(dx, np.maximum(dy, 1e-6))  # 0 = straight ahead

    in_fan = (np.abs(bearing) <= half_ap) & (rng_pix <= max_range) & (rng_pix > 4)

    # Base speckle, attenuated with range (sound spreads + absorbs).
    atten = np.clip(1.0 - rng_pix / max_range, 0.0, 1.0)
    intensity = rng.random((h, w)) * 0.18 * atten

    # Seabed / structure return: a bright arc whose range tracks depth.
    band_r = np.clip(max_range * (0.45 + 0.05 * math.sin(depth_m)), 30, max_range - 10)
    band = np.exp(-((rng_pix - band_r) ** 2) / (2 * 9.0 ** 2))
    intensity += band * (0.55 + 0.2 * atten)

    # A couple of discrete targets (pipeline, wreck debris, fish). We know exactly
    # where each goes, so we emit a ground-truth bounding box for each.
    classes = SCENARIO_CLASSES.get(scenario, ["object", "object"])
    for ti in range(len(classes)):
        tb = rng.uniform(-half_ap * 0.8, half_ap * 0.8)
        tr = rng.uniform(0.3 * max_range, 0.85 * max_range)
        tx = apex_x + math.sin(tb) * tr
        ty = apex_y - math.cos(tb) * tr
        sigma = rng.uniform(5, 11)
        blob = np.exp(-(((xx - tx) ** 2 + (yy - ty) ** 2) / (2 * sigma ** 2)))
        intensity += blob * rng.uniform(0.5, 0.9)

        # Box spans ~2.5σ around the blob centre, clamped to image bounds (pixels).
        half = 2.5 * sigma
        x1 = float(max(0.0, tx - half))
        y1 = float(max(0.0, ty - half))
        x2 = float(min(w, tx + half))
        y2 = float(min(h, ty + half))
        boxes.append({
            "label": classes[ti],
            "bbox": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],  # xyxy, px @220×180
            "confidence": 1.0,        # synthetic ground truth
            "source": "synthetic_gt",  # real path → "detector" then "human_verified"
        })

    # Current smear: a fighting_current instant drags returns sideways.
    if drift_magnitude > 0.01:
        shift = int(np.clip(drift_magnitude * 18, 1, 14))
        intensity = 0.6 * intensity + 0.4 * np.roll(intensity, shift, axis=1)

    intensity = np.where(in_fan, intensity, 0.0)
    intensity = np.clip(intensity, 0.0, 1.0)

    # Grayscale colormap, inked-on-paper: light fan, dark returns (B&W theme).
    gray = np.clip(255 - intensity * 220, 35, 255).astype(np.uint8)
    img = np.stack([gray, gray, gray], axis=-1)
    img[~in_fan] = (250, 250, 250)  # dead water outside the wedge ≈ page white

    buf = io.BytesIO()
    Image.fromarray(img).save(buf, format="PNG")
    b64 = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    return b64, boxes


def from_oculus(path: str) -> Iterator[tuple[float, str]]:
    """Real Blueprint Oculus FLS ingest — yields (timestamp_s, sonar_frame_b64).

    Sydney Harbour (Zenodo 14087658) ships proprietary Oculus `.oman` recordings
    that require Blueprint Subsea's Oculus Viewer to export. Once converted to a
    frame sequence, each Oculus ping carries:

        OculusSimplePingResult:
          pingStartTime   double   # seconds — join key against the optical timeline
          bearings        int16[]  # beam angles, ×0.01 deg
          rangeResolution double   # metres per range bin
          nBeams, nRanges int      # polar image dims
          image           uint8[]  # nBeams × nRanges intensity (polar)

    The conversion is: scan-convert the polar (bearing × range) buffer to a
    Cartesian fan, apply the colormap, base64-encode — same output contract as
    `synthetic_fan`, so `attach_sonar` is backend-agnostic.

    Stubbed until a converted trace is available; raises so a caller that asks for
    real sonar without data fails loudly rather than silently faking it.
    """
    raise NotImplementedError(
        "Real Oculus ingest needs a converted Sydney Harbour trace "
        "(Zenodo 14087658 → Blueprint Oculus Viewer export). "
        "Use the synthetic backend until a .oman export is on disk."
    )


def attach_sonar(rows: list[dict], source: str = "synthetic") -> list[dict]:
    """Align step: stamp `sonar_frame_b64` onto each row (Phase 4 cross-modal join).

    source="synthetic" → one procedural fan per row, keyed to its state.
    source="oculus"    → nearest-timestamp join from a real Oculus trace (stub).
    """
    if source == "oculus":
        raise NotImplementedError(
            "Oculus join not wired — from_oculus() is a stub. See its docstring."
        )

    out = []
    for row in rows:
        state = row.get("state", {})
        frame, boxes = synthetic_fan(
            depth_m=float(state.get("depth_m", 5.0)),
            drift_magnitude=float(row.get("drift_magnitude", 0.0)),
            scenario=str(row.get("scenario", "seabed")),
            seed=_seed_from_row(row),
        )
        out.append({**row, "sonar_frame_b64": frame, "sonar_boxes": boxes})
    return out
