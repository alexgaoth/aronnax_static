// ─── Demo data types & helpers ───────────────────────────────────────────────
// Shapes of the artifacts produced by the offline pipeline (see pipeline/).
// All artifacts live under /public/demo and are fetched once on the client.

export interface VideoMeta {
  width: number;
  height: number;
  fps: number;
  duration: number;
}

// ── Segmentation (masks.json) ────────────────────────────────────────────────
export interface SegInstance {
  id: number;
  color: string; // hex, assigned from the grv accent palette
}

export interface SegObject {
  id: number;
  // Each polygon is a flat [x0, y0, x1, y1, …] list in source-pixel coordinates.
  polygons: number[][];
}

export interface SegFrame {
  t: number; // seconds
  objects: SegObject[];
}

export interface MasksData {
  video: VideoMeta;
  sampleFps: number;
  instances: SegInstance[];
  frames: SegFrame[];
}

// ── SLAM keypoints (keypoints.json) ──────────────────────────────────────────
export interface KeypointFrame {
  t: number;
  pts: [number, number][]; // source-pixel coordinates
}

export interface KeypointsData {
  video: VideoMeta;
  frames: KeypointFrame[];
}

// ── Camera trajectory (poses.json) ───────────────────────────────────────────
export interface Intrinsics {
  fx: number;
  fy: number;
  cx: number;
  cy: number;
}

export interface PoseFrame {
  t: number;
  position: [number, number, number];
  quaternion: [number, number, number, number]; // x, y, z, w
}

export interface PosesData {
  intrinsics: Intrinsics;
  frames: PoseFrame[];
}

// ── Asset paths ──────────────────────────────────────────────────────────────
export const DEMO_ASSETS = {
  video: "/demo/raw.mp4",
  masks: "/demo/masks.json",
  keypoints: "/demo/keypoints.json",
  poses: "/demo/poses.json",
  pointcloud: "/demo/map.ply",
} as const;

// ── Frame lookup ─────────────────────────────────────────────────────────────
// Artifacts are sampled at a lower rate than the video. Given the master video's
// currentTime, find the most recent sampled frame (binary search over sorted `t`).
export function nearestFrameIndex<T extends { t: number }>(
  frames: T[],
  t: number,
): number {
  if (frames.length === 0) return -1;
  let lo = 0;
  let hi = frames.length - 1;
  if (t <= frames[0].t) return 0;
  if (t >= frames[hi].t) return hi;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (frames[mid].t <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return (await res.json()) as T;
}
