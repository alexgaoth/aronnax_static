"""CLI entry point: python -m underwater_vla build --limit 200"""
from __future__ import annotations

import argparse
import sys


def build(limit: int, k: int = 10, parquet: bool = True, with_sonar: bool = False) -> None:
    from .usim import load_usim
    from .label import apply_labels
    from .chunk import chunk_actions
    from .export import export_json, export_parquet, copy_to_web

    print(f"=== Underwater VLA Pipeline — limit={limit}, k={k}, sonar={with_sonar} ===")

    rows = list(load_usim(limit=limit))
    print(f"Loaded {len(rows)} rows from USIM")

    labeled = apply_labels(rows)
    fighting = sum(1 for r in labeled if r.get("hydro_label") == "fighting_current")
    print(f"Labels applied — fighting_current: {fighting}/{len(labeled)}")

    if with_sonar:
        from .sonar import attach_sonar

        labeled = attach_sonar(labeled, source="synthetic")
        have = sum(1 for r in labeled if r.get("sonar_frame_b64"))
        print(f"Cross-modal sonar attached — {have}/{len(labeled)} rows (Phase 4)")

    chunks = chunk_actions(labeled, k=k)
    print(f"Chunked → {len(chunks)} training samples")

    out = export_json(chunks)
    copy_to_web(out)
    if parquet:
        export_parquet(chunks)
    print("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(prog="underwater_vla")
    sub = parser.add_subparsers(dest="cmd")

    build_cmd = sub.add_parser("build", help="Run the full pipeline")
    build_cmd.add_argument("--limit", type=int, default=200, help="Max rows to load from USIM")
    build_cmd.add_argument("--k", type=int, default=10, help="Action chunk size (rows per chunk)")
    build_cmd.add_argument("--no-parquet", action="store_true", help="Skip Parquet export")
    build_cmd.add_argument("--with-sonar", action="store_true", help="Attach cross-modal sonar frames (Phase 4)")

    args = parser.parse_args()
    if args.cmd == "build":
        build(args.limit, k=args.k, parquet=not args.no_parquet, with_sonar=args.with_sonar)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
