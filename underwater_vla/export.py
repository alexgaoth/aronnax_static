"""Export pipeline output. JSON is the source of truth; Parquet is the training format."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

# Columns kept in the Parquet training file. The action_chunk [k, 6] tensor is the
# label target; obs_frame_b64 is the observation; the rest are derived conditioning.
TRAIN_COLUMNS = [
    "trajectory_id",
    "t_start",
    "t_end",
    "action_chunk",      # [k, 6] — π0 action head target
    "obs_frame_b64",     # optical observation at chunk start
    "sonar_frame_b64",   # Phase 4 — aligned FLS sonar observation (nullable)
    "sonar_boxes",       # Phase 4 — sonar detection boxes [{label,bbox,confidence,source}]
    "hydro_label",       # derived: nominal | fighting_current
    "drift_magnitude",
    "task_label",
    "scenario",
    "imu_series",        # [k, 6]
    "depth_series",      # [k]
]


def export_json(chunks: list[dict], out_path: str = "outputs/chunks.json") -> Path:
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(chunks, f, indent=2)
    print(f"Wrote {len(chunks)} chunks → {path}")
    return path


def export_parquet(chunks: list[dict], out_path: str = "outputs/chunks.parquet") -> Path | None:
    """Write the training-ready Parquet file. No-op (with a warning) if pyarrow is absent."""
    try:
        import pandas as pd  # type: ignore
    except ImportError:
        print("⚠ pandas/pyarrow not installed — skipping Parquet export (JSON still written).")
        return None

    rows = [{col: c.get(col) for col in TRAIN_COLUMNS} for c in chunks]
    df = pd.DataFrame(rows, columns=TRAIN_COLUMNS)

    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        df.to_parquet(path, index=False)
    except Exception as e:  # pragma: no cover — surfaces missing pyarrow engine clearly
        print(f"⚠ Parquet write failed ({e}) — install pyarrow. JSON still written.")
        return None

    k = len(chunks[0]["action_chunk"]) if chunks and chunks[0].get("action_chunk") else 0
    print(f"Wrote {len(df)} training samples → {path}  (action_chunk shape [{k}, 6])")
    return path


def copy_to_web(src: Path, web_path: str = "web/public/demo/chunks.json") -> None:
    dest = Path(web_path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    print(f"Copied → {dest}")
