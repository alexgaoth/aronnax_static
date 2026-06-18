"""Auto-labeling — derive VLA tokens from aligned rows with zero human input."""
from __future__ import annotations

ACCEL_THRESHOLD = 0.05


def label_hydrodynamic(row: dict) -> dict:
    """
    If pilot commands forward thrust but IMU shows near-zero forward acceleration,
    the vehicle is fighting a current. Derived purely from physics — no human annotation.
    """
    fwd_command = row["action"]["thruster_pwm"][0]
    fwd_accel = row["state"]["imu"][0]

    if abs(fwd_command) > 0.3 and abs(fwd_accel) < ACCEL_THRESHOLD:
        drift = fwd_command - fwd_accel
        return {"hydro_label": "fighting_current", "drift_magnitude": round(drift, 4)}
    return {"hydro_label": "nominal", "drift_magnitude": 0.0}


def apply_labels(rows: list[dict]) -> list[dict]:
    labeled = []
    for row in rows:
        hydro = label_hydrodynamic(row)
        labeled.append({**row, **hydro})
    return labeled
