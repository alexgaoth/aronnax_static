"""Generate small SYNTHETIC demo artifacts for previewing the /demo layout
before you have a real video + the SAM2/VO pipeline output.

Stdlib only (no numpy/opencv needed). Writes the same files the real pipeline
does, so the page renders end-to-end — Q4 shows a helix trajectory through a
synthetic cloud; Q2/Q3 overlays animate over whatever (or no) raw.mp4 is present.
The real `run_segmentation.py` / `run_slam.py` overwrite these.

    python make_sample_data.py
"""

from __future__ import annotations

import json
import math
import os
import random

DEMO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "public", "demo")
W, H, FPS, DUR, SAMPLE_FPS = 1280, 720, 30.0, 12.0, 5.0
N = int(DUR * SAMPLE_FPS)
PALETTE = ["#5f9ea8", "#78b4c0", "#476f82", "#4d8870", "#c89a3c", "#b8b0a0"]


def video_meta() -> dict:
    return {"width": W, "height": H, "fps": FPS, "duration": DUR}


def write(name: str, data: dict) -> None:
    os.makedirs(DEMO_DIR, exist_ok=True)
    with open(os.path.join(DEMO_DIR, name), "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print("wrote", name)


def make_masks() -> None:
    frames = []
    for i in range(N):
        t = i / SAMPLE_FPS
        cx = W * (0.3 + 0.4 * (0.5 + 0.5 * math.sin(t)))
        cy = H * 0.55
        r = 120
        poly = []
        for a in range(0, 360, 30):
            rad = math.radians(a)
            jitter = 1 + 0.15 * math.sin(rad * 3 + t)
            poly += [round(cx + r * jitter * math.cos(rad), 1),
                     round(cy + r * jitter * math.sin(rad), 1)]
        frames.append({"t": round(t, 3), "objects": [{"id": 0, "polygons": [poly]}]})
    write("masks.json", {"video": video_meta(), "sampleFps": SAMPLE_FPS,
                         "instances": [{"id": 0, "color": PALETTE[0]}], "frames": frames})


def make_keypoints() -> None:
    random.seed(1)
    base = [(random.uniform(0, W), random.uniform(0, H)) for _ in range(300)]
    frames = []
    for i in range(N):
        t = i / SAMPLE_FPS
        pts = [[round((x + 8 * math.sin(t + x)) % W, 1),
                round((y + 6 * math.cos(t + y)) % H, 1)] for x, y in base]
        frames.append({"t": round(t, 3), "pts": pts})
    write("keypoints.json", {"video": video_meta(), "frames": frames})


def make_poses_and_cloud() -> None:
    frames = []
    for i in range(N):
        t = i / SAMPLE_FPS
        ang = t * 0.7
        pos = [round(0.6 * math.cos(ang), 5), round(0.15 * math.sin(t * 2), 5),
               round(0.6 * math.sin(ang), 5)]
        # face roughly toward origin (yaw only)
        qy = math.sin(-ang / 2)
        qw = math.cos(-ang / 2)
        frames.append({"t": round(t, 3), "position": pos,
                       "quaternion": [0.0, round(qy, 5), 0.0, round(qw, 5)]})
    write("poses.json", {"intrinsics": {"fx": W * 0.9, "fy": W * 0.9,
                                        "cx": W / 2, "cy": H / 2}, "frames": frames})

    # Synthetic cloud: a wavy seabed plane + scattered structure.
    random.seed(2)
    lines = ["ply", "format ascii 1.0"]
    pts = []
    for _ in range(8000):
        x = random.uniform(-1, 1)
        z = random.uniform(-1, 1)
        y = -0.4 + 0.12 * math.sin(x * 4) * math.cos(z * 4) + random.uniform(-0.02, 0.02)
        shade = int(120 + 80 * (y + 0.4))
        pts.append((x, y, z, shade // 2, shade, shade))
    body = [f"{x:.5f} {y:.5f} {z:.5f} {r} {g} {b}" for x, y, z, r, g, b in pts]
    header = (lines + [f"element vertex {len(pts)}",
                       "property float x", "property float y", "property float z",
                       "property uchar red", "property uchar green", "property uchar blue",
                       "end_header"])
    os.makedirs(DEMO_DIR, exist_ok=True)
    with open(os.path.join(DEMO_DIR, "map.ply"), "w") as f:
        f.write("\n".join(header + body) + "\n")
    print("wrote map.ply", f"({len(pts)} points)")


if __name__ == "__main__":
    make_masks()
    make_keypoints()
    make_poses_and_cloud()
    print("Sample data ready in public/demo/. Add a raw.mp4 to populate Q1–Q3 video.")
