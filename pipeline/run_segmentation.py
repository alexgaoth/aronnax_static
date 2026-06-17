"""Generate segmentation overlays for the demo (Quadrant 2) using SAM2.

Strategy (default): discover objects on the first sampled frame with the SAM2
automatic mask generator, then propagate those masklets through the clip with the
SAM2 video predictor so instance IDs / colors stay stable across frames.

Fallback (--per-frame): run the automatic mask generator independently on every
sampled frame (promptless; instance colors are not temporally stable).

Output: ../public/demo/masks.json

Usage:
    python run_segmentation.py \
        --video ../public/demo/raw.mp4 \
        --checkpoint checkpoints/sam2.1_hiera_tiny.pt \
        --model-cfg configs/sam2.1/sam2.1_hiera_t.yaml \
        --max-objects 6 --sample-fps 5
"""

from __future__ import annotations

import argparse
import os
import tempfile

import cv2
import numpy as np

from common import (
    DEFAULT_SAMPLE_FPS,
    DEFAULT_VIDEO,
    DEMO_DIR,
    GRV_PALETTE,
    iter_sampled_frames,
    mask_to_polygons,
    probe_video,
    write_json,
)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--video", default=DEFAULT_VIDEO)
    p.add_argument("--out", default=os.path.join(DEMO_DIR, "masks.json"))
    p.add_argument("--checkpoint", default="checkpoints/sam2.1_hiera_tiny.pt")
    p.add_argument("--model-cfg", default="configs/sam2.1/sam2.1_hiera_t.yaml")
    p.add_argument("--sample-fps", type=float, default=DEFAULT_SAMPLE_FPS)
    p.add_argument("--max-objects", type=int, default=6)
    p.add_argument("--device", default="cpu")
    p.add_argument(
        "--per-frame",
        action="store_true",
        help="Promptless per-frame masks (no temporal tracking).",
    )
    return p.parse_args()


def extract_frames_to_dir(video: str, sample_fps: float, out_dir: str) -> list[float]:
    """Write sampled frames as zero-padded JPEGs (required by SAM2 video predictor)."""
    times: list[float] = []
    for i, (t, frame) in enumerate(iter_sampled_frames(video, sample_fps)):
        cv2.imwrite(os.path.join(out_dir, f"{i:05d}.jpg"), frame)
        times.append(round(t, 3))
    return times


def discover_prompts(frame_bgr: np.ndarray, sam2, max_objects: int):
    """Run the automatic mask generator on one frame, return centroid point prompts."""
    from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator

    amg = SAM2AutomaticMaskGenerator(sam2)
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    masks = amg.generate(rgb)
    masks.sort(key=lambda m: m["area"], reverse=True)
    prompts = []
    for m in masks[:max_objects]:
        ys, xs = np.where(m["segmentation"])
        if len(xs) == 0:
            continue
        prompts.append((float(xs.mean()), float(ys.mean())))
    return prompts


def run_tracked(args, meta, times: list[float], frames_dir: str) -> dict:
    """Discover objects on frame 0, propagate with the video predictor."""
    from sam2.build_sam import build_sam2, build_sam2_video_predictor

    first = cv2.imread(os.path.join(frames_dir, "00000.jpg"))
    sam2 = build_sam2(args.model_cfg, args.checkpoint, device=args.device)
    prompts = discover_prompts(first, sam2, args.max_objects)
    print(f"  discovered {len(prompts)} objects on frame 0")

    predictor = build_sam2_video_predictor(
        args.model_cfg, args.checkpoint, device=args.device
    )
    state = predictor.init_state(video_path=frames_dir)
    for obj_id, (px, py) in enumerate(prompts):
        predictor.add_new_points_or_box(
            inference_state=state,
            frame_idx=0,
            obj_id=obj_id,
            points=np.array([[px, py]], dtype=np.float32),
            labels=np.array([1], dtype=np.int32),
        )

    # Collect propagated masks: frame_idx -> {obj_id: polygons}
    per_frame: dict[int, list[dict]] = {}
    for frame_idx, obj_ids, mask_logits in predictor.propagate_in_video(state):
        objects = []
        for j, oid in enumerate(obj_ids):
            mask = (mask_logits[j] > 0.0).cpu().numpy().squeeze()
            polys = mask_to_polygons(mask)
            if polys:
                objects.append({"id": int(oid), "polygons": polys})
        per_frame[frame_idx] = objects

    frames = [
        {"t": times[i], "objects": per_frame.get(i, [])} for i in range(len(times))
    ]
    instances = [
        {"id": i, "color": GRV_PALETTE[i % len(GRV_PALETTE)]}
        for i in range(len(prompts))
    ]
    return {
        "video": meta.to_json(),
        "sampleFps": args.sample_fps,
        "instances": instances,
        "frames": frames,
    }


def run_per_frame(args, meta) -> dict:
    """Promptless: automatic mask generator on every sampled frame."""
    from sam2.automatic_mask_generator import SAM2AutomaticMaskGenerator
    from sam2.build_sam import build_sam2

    sam2 = build_sam2(args.model_cfg, args.checkpoint, device=args.device)
    amg = SAM2AutomaticMaskGenerator(sam2)

    frames = []
    for t, frame in iter_sampled_frames(args.video, args.sample_fps):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        masks = sorted(amg.generate(rgb), key=lambda m: m["area"], reverse=True)
        objects = []
        for oid, m in enumerate(masks[: args.max_objects]):
            polys = mask_to_polygons(m["segmentation"])
            if polys:
                objects.append({"id": oid, "polygons": polys})
        frames.append({"t": round(t, 3), "objects": objects})
        print(f"  t={t:6.2f}s  {len(objects)} masks")

    instances = [
        {"id": i, "color": GRV_PALETTE[i % len(GRV_PALETTE)]}
        for i in range(args.max_objects)
    ]
    return {
        "video": meta.to_json(),
        "sampleFps": args.sample_fps,
        "instances": instances,
        "frames": frames,
    }


def main() -> None:
    args = parse_args()
    meta = probe_video(args.video)
    print(f"Segmentation · {args.video}  ({meta.width}x{meta.height}, {meta.duration:.1f}s)")

    if args.per_frame:
        data = run_per_frame(args, meta)
    else:
        with tempfile.TemporaryDirectory() as frames_dir:
            print("  extracting sampled frames…")
            times = extract_frames_to_dir(args.video, args.sample_fps, frames_dir)
            data = run_tracked(args, meta, times, frames_dir)

    write_json(args.out, data)
    print("done.")


if __name__ == "__main__":
    main()
