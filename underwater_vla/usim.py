"""HuggingFace USIM adapter — loads BlueROV2 simulation trajectories."""
from __future__ import annotations

import time
from typing import Iterator

from .normalize import normalize_action_vector


def _to_float_list(val) -> list[float]:
    if val is None:
        return []
    if hasattr(val, "tolist"):
        return [float(v) for v in val.tolist()]
    if isinstance(val, (list, tuple)):
        return [float(v) for v in val]
    return [float(val)]


def load_usim(limit: int = 200) -> Iterator[dict]:
    """Yield aligned rows from the USIM HuggingFace dataset."""
    from datasets import load_dataset  # type: ignore

    print(f"Loading USIM dataset (limit={limit})…")
    ds = load_dataset("Vincent2025hello/usimcou", split="train", streaming=True)

    t0 = time.time()
    for i, record in enumerate(ds):
        if i >= limit:
            break

        raw_action = record.get("action", [])
        thruster_pwm = normalize_action_vector(raw_action)

        imu_raw = _to_float_list(record.get("imu", []))
        imu = (imu_raw + [0.0] * 6)[:6]  # guarantee 6 floats

        state_raw = _to_float_list(record.get("state", []))
        depth_m = float(record.get("depth", state_raw[0] if state_raw else 0.0))
        roll_rad = float(record.get("roll", 0.0))
        pitch_rad = float(record.get("pitch", 0.0))
        yaw_rad = float(record.get("yaw", 0.0))

        # Encode left image as base64 PNG for JSON transport
        left_image = record.get("left_image") or record.get("image")
        frame_b64 = _image_to_b64(left_image)

        yield {
            "t": t0 + i * 0.1,  # synthetic 10 Hz timestamps (sim has no wall clock)
            "trajectory_id": str(record.get("trajectory_id", f"traj_{i // 50}")),
            "frame_b64": frame_b64,
            "action": {
                "thruster_pwm": thruster_pwm,
                "joint_angles": _to_float_list(record.get("joint_angles", [])),
            },
            "state": {
                "imu": imu,
                "depth_m": depth_m,
                "roll_rad": roll_rad,
                "pitch_rad": pitch_rad,
                "yaw_rad": yaw_rad,
                "dvl_velocity": _to_float_list(record.get("dvl_velocity", [])),
            },
            "task_label": str(record.get("task_label", "unknown")),
            "scenario": str(record.get("scenario", "simulation")),
        }


def _image_to_b64(image) -> str | None:
    if image is None:
        return None
    try:
        import base64
        import io

        from PIL import Image  # type: ignore

        if not isinstance(image, Image.Image):
            return None
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    except Exception:
        return None
