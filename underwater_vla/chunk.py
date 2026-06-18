"""ACT-style action chunking with exponential smoothing."""
from __future__ import annotations

import math


def exponential_smooth(window: list[list[float]], alpha: float = 0.8) -> list[list[float]]:
    if not window:
        return []
    smoothed = [list(window[0])]
    for frame in window[1:]:
        prev = smoothed[-1]
        s = [alpha * f + (1 - alpha) * p for f, p in zip(frame, prev)]
        smoothed.append(s)
    return smoothed


def chunk_actions(rows: list[dict], k: int = 10, alpha: float = 0.8) -> list[dict]:
    chunks = []
    for i in range(0, len(rows) - k, k):
        window_rows = rows[i : i + k]
        window = [r["action"]["thruster_pwm"] for r in window_rows]
        smoothed = exponential_smooth(window, alpha)

        chunks.append(
            {
                "t_start": window_rows[0]["t"],
                "t_end": window_rows[-1]["t"],
                "trajectory_id": window_rows[0]["trajectory_id"],
                "action_chunk": smoothed,       # shape [k, 6]
                "obs_frame_b64": window_rows[0].get("frame_b64"),
                "sonar_frame_b64": window_rows[0].get("sonar_frame_b64"),  # Phase 4 cross-modal
                "sonar_boxes": window_rows[0].get("sonar_boxes", []),      # Phase 4 detections
                "hydro_label": window_rows[0].get("hydro_label", "nominal"),
                "drift_magnitude": window_rows[0].get("drift_magnitude", 0.0),
                "task_label": window_rows[0].get("task_label", "unknown"),
                "scenario": window_rows[0].get("scenario", "simulation"),
                "state_snapshot": window_rows[0].get("state", {}),
                "imu_series": [r["state"]["imu"] for r in window_rows],
                "depth_series": [r["state"]["depth_m"] for r in window_rows],
            }
        )
    return chunks
