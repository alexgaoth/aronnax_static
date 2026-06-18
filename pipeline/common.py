"""Shared helpers for the demo generation pipeline.

Both run_segmentation.py and run_slam.py read the same source video and emit
artifacts into ../public/demo so the Next.js demo page can replay them.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Iterator

import cv2
import numpy as np

# ── Paths ─────────────────────────────────────────────────────────────────────
PIPELINE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(PIPELINE_DIR)
DEMO_DIR = os.path.join(PROJECT_ROOT, "public", "demo")
DEFAULT_VIDEO = os.path.join(DEMO_DIR, "raw.mp4")

# Default sampling rate for the artifacts (frames/second). The video plays at its
# native fps; overlays just snap to the nearest sampled frame.
DEFAULT_SAMPLE_FPS = 5.0

# Instance colors. The first six are the grv accents (matches tailwind.config.ts);
# the rest extend the set with distinct hues so high --max-objects runs stay legible.
GRV_PALETTE = [
    "#5f9ea8",  # aqua
    "#78b4c0",  # aqua2
    "#476f82",  # blue
    "#4d8870",  # teal
    "#c89a3c",  # amber
    "#b8b0a0",  # fg2
    "#a8dadc", "#e07a5f", "#81b29a", "#f2cc8f",
    "#9d8df1", "#e9c46a", "#2a9d8f", "#e76f51",
    "#8ecae6", "#ffb4a2", "#bdb2ff", "#90be6d",
]


@dataclass
class VideoMeta:
    width: int
    height: int
    fps: float
    duration: float
    frame_count: int

    def to_json(self) -> dict:
        return {
            "width": self.width,
            "height": self.height,
            "fps": round(self.fps, 3),
            "duration": round(self.duration, 3),
        }


def probe_video(path: str) -> VideoMeta:
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Could not open video: {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    duration = frame_count / fps if fps else 0.0
    return VideoMeta(width, height, fps, duration, frame_count)


def iter_sampled_frames(
    path: str, sample_fps: float = DEFAULT_SAMPLE_FPS
) -> Iterator[tuple[float, np.ndarray]]:
    """Yield (timestamp_seconds, BGR frame) at approximately `sample_fps`."""
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Could not open video: {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    stride = max(1, round(fps / sample_fps))
    idx = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % stride == 0:
            yield idx / fps, frame
        idx += 1
    cap.release()


def mask_to_polygons(mask: np.ndarray, epsilon_frac: float = 0.004) -> list[list[float]]:
    """Convert a boolean/uint8 mask to simplified polygon contours.

    Returns a list of flat [x0, y0, x1, y1, ...] polygons in pixel coordinates.
    """
    m = (mask > 0).astype(np.uint8)
    contours, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    polys: list[list[float]] = []
    for c in contours:
        if cv2.contourArea(c) < 80:  # drop specks
            continue
        eps = epsilon_frac * cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, eps, True)
        if len(approx) < 3:
            continue
        polys.append([round(float(v), 1) for v in approx.reshape(-1)])
    return polys


def write_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    size_kb = os.path.getsize(path) / 1024
    print(f"  wrote {path}  ({size_kb:.1f} KB)")


def write_ply(path: str, points: np.ndarray, colors: np.ndarray | None = None) -> None:
    """Write an ASCII PLY point cloud. points: (N,3) float, colors: (N,3) uint8."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    n = len(points)
    has_color = colors is not None and len(colors) == n
    with open(path, "w") as f:
        f.write("ply\nformat ascii 1.0\n")
        f.write(f"element vertex {n}\n")
        f.write("property float x\nproperty float y\nproperty float z\n")
        if has_color:
            f.write("property uchar red\nproperty uchar green\nproperty uchar blue\n")
        f.write("end_header\n")
        for i in range(n):
            x, y, z = points[i]
            if has_color:
                r, g, b = colors[i]
                f.write(f"{x:.5f} {y:.5f} {z:.5f} {int(r)} {int(g)} {int(b)}\n")
            else:
                f.write(f"{x:.5f} {y:.5f} {z:.5f}\n")
    print(f"  wrote {path}  ({n} points)")
