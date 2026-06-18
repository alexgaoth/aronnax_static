from __future__ import annotations

import json
from pathlib import Path

import cv2


ROOT = Path(__file__).resolve().parents[1]
VIDEOS = ROOT / "web/public/demo/videos"
OUT = ROOT / "web/public/demo/annotations.json"

# ponytail: one seed box per clip is enough for a useful demo; replace with a learned detector if scale matters.
SEEDS: dict[str, tuple[int, tuple[int, int, int, int]]] = {
    "episode_000000": (30, (72, 88, 92, 48)),
    "episode_000001": (30, (34, 58, 248, 112)),
    "episode_000002": (30, (182, 86, 98, 52)),
    "episode_000003": (30, (26, 54, 258, 118)),
}


def read_frame(cap: cv2.VideoCapture, frame_index: int):
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
    ok, frame = cap.read()
    return frame if ok else None


def clamp_box(x: int, y: int, w: int, h: int, width: int, height: int):
    x = max(0, min(x, width - 1))
    y = max(0, min(y, height - 1))
    w = max(1, min(w, width - x))
    h = max(1, min(h, height - y))
    return x, y, w, h


def match_step(gray, template, prev_box):
    x, y, w, h = prev_box
    pad_x = max(20, w // 3)
    pad_y = max(20, h // 3)
    rx0 = max(0, x - pad_x)
    ry0 = max(0, y - pad_y)
    rx1 = min(gray.shape[1], x + w + pad_x)
    ry1 = min(gray.shape[0], y + h + pad_y)
    roi = gray[ry0:ry1, rx0:rx1]
    if roi.shape[0] < template.shape[0] or roi.shape[1] < template.shape[1]:
        return prev_box
    result = cv2.matchTemplate(roi, template, cv2.TM_CCOEFF_NORMED)
    _, _, _, max_loc = cv2.minMaxLoc(result)
    nx = rx0 + max_loc[0]
    ny = ry0 + max_loc[1]
    return nx, ny, w, h


def normalize_box(box, width: int, height: int):
    x, y, w, h = box
    return {
        "label": "charge_station",
        "x": round(x / width, 6),
        "y": round(y / height, 6),
        "w": round(w / width, 6),
        "h": round(h / height, 6),
    }


def track_episode(name: str, seed_frame_index: int, seed_box):
    cap = cv2.VideoCapture(str(VIDEOS / f"{name}.mp4"))
    if not cap.isOpened():
      raise RuntimeError(f"could not open video for {name}")
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    seed_frame = read_frame(cap, seed_frame_index)
    if seed_frame is None:
        raise RuntimeError(f"could not read seed frame for {name}")
    seed_gray = cv2.cvtColor(seed_frame, cv2.COLOR_BGR2GRAY)
    x, y, w, h = clamp_box(*seed_box, width, height)
    template = seed_gray[y : y + h, x : x + w]

    boxes: dict[int, tuple[int, int, int, int]] = {seed_frame_index: (x, y, w, h)}

    prev = (x, y, w, h)
    for index in range(seed_frame_index + 1, frame_count):
        frame = read_frame(cap, index)
        if frame is None:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        prev = clamp_box(*match_step(gray, template, prev), width, height)
        boxes[index] = prev

    prev = (x, y, w, h)
    for index in range(seed_frame_index - 1, -1, -1):
        frame = read_frame(cap, index)
        if frame is None:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        prev = clamp_box(*match_step(gray, template, prev), width, height)
        boxes[index] = prev

    cap.release()
    return {
        "frames": {
            str(index): [normalize_box(box, width, height)]
            for index, box in sorted(boxes.items())
        }
    }


def main():
    annotations = {
        episode: track_episode(episode, seed_frame_index, seed_box)
        for episode, (seed_frame_index, seed_box) in SEEDS.items()
    }
    OUT.write_text(json.dumps(annotations, indent=2))
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
