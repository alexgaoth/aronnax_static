# Demo Generation Pipeline

Runs **segmentation (SAM2)** and **SLAM (OpenCV visual odometry)** on a single
video, once, offline, and writes the replay artifacts the `/demo` page loads:

| Artifact | Produced by | Used by |
|----------|-------------|---------|
| `public/demo/raw.mp4` | _you provide_ | Q1 raw video + Q2/Q3 canvas source |
| `public/demo/masks.json` | `run_segmentation.py` | Q2 segmentation overlay |
| `public/demo/keypoints.json` | `run_slam.py` | Q3 ORB feature overlay |
| `public/demo/poses.json` | `run_slam.py` | Q4 camera fly-path |
| `public/demo/map.ply` | `run_slam.py` | Q4 point cloud |

Everything is **CPU-runnable** (it does not need to be real time — one video).
For a faster run, use the Colab notes below.

## 1. Setup

```bash
cd pipeline
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# SAM2 itself (from source):
pip install "git+https://github.com/facebookresearch/sam2.git"

# Download a small SAM2.1 checkpoint (tiny = lightest for CPU):
mkdir -p checkpoints
curl -L -o checkpoints/sam2.1_hiera_tiny.pt \
  https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_tiny.pt
```

> The matching model config (`configs/sam2.1/sam2.1_hiera_t.yaml`) ships inside the
> `sam2` package, so `--model-cfg configs/sam2.1/sam2.1_hiera_t.yaml` resolves
> without extra downloads.

## 2. Put the video in place

```bash
cp /path/to/your/clip.mp4 ../public/demo/raw.mp4
```

## 3. Run

```bash
# SLAM (fast, pure OpenCV) — keypoints.json, poses.json, map.ply
python run_slam.py --sample-fps 5

# Segmentation (SAM2). Tracked instances (recommended):
python run_segmentation.py --sample-fps 5 --max-objects 6

# ...or promptless per-frame fallback if propagation is too heavy on CPU:
python run_segmentation.py --per-frame --max-objects 6
```

All outputs land in `../public/demo/`. Re-run `npm run dev` and open `/demo`.

## Tuning

- `--sample-fps` — lower (3–4) = smaller JSON + faster CPU run; higher (8–10) =
  smoother overlays. The video still plays at native fps; overlays snap to the
  nearest sampled frame.
- `run_slam.py --focal-frac` — nominal focal length as a fraction of width; only
  affects 3D shape, not the synced playback.
- `run_segmentation.py --max-objects` — how many instances to track/color.

## Google Colab fallback (GPU)

If CPU is too slow (mainly SAM2):

1. Upload `pipeline/` and `raw.mp4` to Colab (Runtime → GPU).
2. Install CUDA torch instead of CPU wheels:
   `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121`
3. `pip install opencv-python "git+https://github.com/facebookresearch/sam2.git"`
4. Run the same two scripts with `--device cuda` on `run_segmentation.py`.
5. Download the generated `masks.json`, `keypoints.json`, `poses.json`, `map.ply`
   and drop them into `public/demo/`.

A ready-to-run `colab_demo.ipynb` mirrors these steps.
