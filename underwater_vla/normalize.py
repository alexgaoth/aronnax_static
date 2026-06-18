def normalize_pwm(raw_pwm: int) -> float:
    # BlueROV2 range: 1100 (full reverse) to 1900 (full forward), 1500 = neutral
    return (raw_pwm - 1500) / 400.0


def normalize_action_vector(action_dict: dict) -> list[float]:
    """Convert any action representation to a fixed 6-float thruster vector in [-1, 1]."""
    if isinstance(action_dict, list):
        vec = [float(v) for v in action_dict[:6]]
    elif isinstance(action_dict, dict):
        vec = action_dict.get("thruster_pwm", action_dict.get("actions", []))
        vec = [float(v) for v in vec[:6]]
    else:
        vec = []

    # Pad to 6 channels
    while len(vec) < 6:
        vec.append(0.0)

    # Clamp to [-1, 1] — USIM already normalized, but guard against drift
    return [max(-1.0, min(1.0, v)) for v in vec]
