# Outputs

Generated pipeline artifacts land here. **Not committed** (except this README).

- `chunks.json` — training-ready VLA chunks `(obs window, action chunk, derived labels)`.
  Mirror-copied to `web/public/demo/chunks.json` for the dashboard.
- `*.parquet` — added in Phase 3 once JSON export is solid.

Regenerate with:
```bash
python -m underwater_vla build --limit 200
```
