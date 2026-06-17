"""Generate SLAM artifacts for the demo using OpenCV monocular visual odometry.

Single pass over the sampled video produces:
  - keypoints.json : per-frame ORB keypoints           (Quadrant 3 overlay)
  - poses.json     : chained camera trajectory          (Quadrant 4 fly-path)
  - map.ply        : sparse triangulated point cloud     (Quadrant 4 cloud)

Monocular VO recovers motion up to an unknown scale, so the trajectory and cloud
are normalized into a unit-ish box — fine for a visualization. Intrinsics are
guessed from frame size + a nominal FOV unless overridden.

Usage:
    python run_slam.py --video ../public/demo/raw.mp4 --sample-fps 5
"""

from __future__ import annotations

import argparse
import os

import cv2
import numpy as np

from common import (
    DEFAULT_SAMPLE_FPS,
    DEFAULT_VIDEO,
    DEMO_DIR,
    iter_sampled_frames,
    probe_video,
    write_json,
    write_ply,
)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--video", default=DEFAULT_VIDEO)
    p.add_argument("--sample-fps", type=float, default=DEFAULT_SAMPLE_FPS)
    p.add_argument("--orb-features", type=int, default=2000)
    p.add_argument("--draw-keypoints", type=int, default=400,
                   help="Max keypoints stored per frame for the overlay.")
    p.add_argument("--max-cloud", type=int, default=60000,
                   help="Cap on total points written to map.ply.")
    p.add_argument("--focal-frac", type=float, default=0.9,
                   help="Focal length as a fraction of frame width (nominal).")
    return p.parse_args()


def rot_to_quat(R: np.ndarray) -> list[float]:
    """Rotation matrix -> quaternion [x, y, z, w]."""
    t = np.trace(R)
    if t > 0:
        s = 0.5 / np.sqrt(t + 1.0)
        w = 0.25 / s
        x = (R[2, 1] - R[1, 2]) * s
        y = (R[0, 2] - R[2, 0]) * s
        z = (R[1, 0] - R[0, 1]) * s
    elif R[0, 0] > R[1, 1] and R[0, 0] > R[2, 2]:
        s = 2.0 * np.sqrt(1.0 + R[0, 0] - R[1, 1] - R[2, 2])
        w = (R[2, 1] - R[1, 2]) / s
        x = 0.25 * s
        y = (R[0, 1] + R[1, 0]) / s
        z = (R[0, 2] + R[2, 0]) / s
    elif R[1, 1] > R[2, 2]:
        s = 2.0 * np.sqrt(1.0 + R[1, 1] - R[0, 0] - R[2, 2])
        w = (R[0, 2] - R[2, 0]) / s
        x = (R[0, 1] + R[1, 0]) / s
        y = 0.25 * s
        z = (R[1, 2] + R[2, 1]) / s
    else:
        s = 2.0 * np.sqrt(1.0 + R[2, 2] - R[0, 0] - R[1, 1])
        w = (R[1, 0] - R[0, 1]) / s
        x = (R[0, 2] + R[2, 0]) / s
        y = (R[1, 2] + R[2, 1]) / s
        z = 0.25 * s
    return [float(x), float(y), float(z), float(w)]


def main() -> None:
    args = parse_args()
    meta = probe_video(args.video)
    print(f"SLAM (VO) · {args.video}  ({meta.width}x{meta.height}, {meta.duration:.1f}s)")

    # Nominal pinhole intrinsics from frame size.
    f = args.focal_frac * meta.width
    cx, cy = meta.width / 2.0, meta.height / 2.0
    K = np.array([[f, 0, cx], [0, f, cy], [0, 0, 1]], dtype=np.float64)

    orb = cv2.ORB_create(nfeatures=args.orb_features)
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    # Accumulated world pose of the current camera: X_world = R_wc @ X_cam + t_wc.
    R_wc = np.eye(3)
    t_wc = np.zeros((3, 1))

    keypoint_frames: list[dict] = []
    pose_frames: list[dict] = []
    cloud_pts: list[np.ndarray] = []
    cloud_cols: list[np.ndarray] = []

    prev_gray = None
    prev_kp = None
    prev_des = None

    for i, (t, frame) in enumerate(iter_sampled_frames(args.video, args.sample_fps)):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        kp, des = orb.detectAndCompute(gray, None)

        # Per-frame keypoints for the Q3 overlay (capped, strongest first).
        kp_sorted = sorted(kp, key=lambda k: k.response, reverse=True)
        pts = [[round(float(k.pt[0]), 1), round(float(k.pt[1]), 1)]
               for k in kp_sorted[: args.draw_keypoints]]
        keypoint_frames.append({"t": round(t, 3), "pts": pts})

        if i == 0:
            pose_frames.append({"t": round(t, 3),
                                "position": [0.0, 0.0, 0.0],
                                "quaternion": [0.0, 0.0, 0.0, 1.0]})
        elif prev_des is not None and des is not None:
            matches = matcher.match(prev_des, des)
            matches = sorted(matches, key=lambda m: m.distance)[:600]
            if len(matches) >= 8:
                pp = np.float32([prev_kp[m.queryIdx].pt for m in matches])
                cp = np.float32([kp[m.trainIdx].pt for m in matches])
                E, mask = cv2.findEssentialMat(
                    pp, cp, K, method=cv2.RANSAC, prob=0.999, threshold=1.0
                )
                if E is not None and E.shape == (3, 3):
                    _, R, tvec, mask_pose = cv2.recoverPose(E, pp, cp, K)

                    # Chain: cur_cam->world = prev_cam->world ∘ inv(relative).
                    t_wc = t_wc + R_wc @ (-R.T @ tvec)
                    R_wc = R_wc @ R.T

                    # Triangulate inliers (in prev-cam frame) -> world.
                    inl = (mask_pose.ravel() > 0)
                    if inl.sum() >= 8:
                        P0 = K @ np.hstack([np.eye(3), np.zeros((3, 1))])
                        P1 = K @ np.hstack([R, tvec])
                        X4 = cv2.triangulatePoints(P0, P1, pp[inl].T, cp[inl].T)
                        X = (X4[:3] / X4[3]).T  # (N,3) in prev-cam frame
                        # cheirality + sane depth
                        good = (X[:, 2] > 0) & (np.abs(X[:, 2]) < 50)
                        Xw = (R_wc_prev @ X[good].T + t_wc_prev).T
                        for p, src in zip(Xw, cp[inl][good]):
                            cloud_pts.append(p)
                            b, g, r = frame[
                                int(np.clip(src[1], 0, meta.height - 1)),
                                int(np.clip(src[0], 0, meta.width - 1)),
                            ]
                            cloud_cols.append(np.array([r, g, b], dtype=np.uint8))

            pose_frames.append({
                "t": round(t, 3),
                "position": [round(float(v), 5) for v in t_wc.ravel()],
                "quaternion": [round(v, 5) for v in rot_to_quat(R_wc)],
            })

        # Remember prev world pose before it advances (for next triangulation).
        R_wc_prev = R_wc.copy()
        t_wc_prev = t_wc.copy()
        prev_gray, prev_kp, prev_des = gray, kp, des
        if i % 20 == 0:
            print(f"  t={t:6.2f}s  kp={len(kp)}  cloud={len(cloud_pts)}")

    # ── Normalize trajectory + cloud into a unit-ish box centered at origin ────
    positions = np.array([p["position"] for p in pose_frames], dtype=np.float64)
    cloud = np.array(cloud_pts, dtype=np.float64) if cloud_pts else np.zeros((0, 3))
    allpts = np.vstack([positions, cloud]) if len(cloud) else positions
    center = allpts.mean(axis=0)
    scale = np.percentile(np.linalg.norm(allpts - center, axis=1), 95) or 1.0

    for p in pose_frames:
        p["position"] = [round((p["position"][k] - center[k]) / scale, 5) for k in range(3)]
    if len(cloud):
        cloud = (cloud - center) / scale
        if len(cloud) > args.max_cloud:
            sel = np.random.choice(len(cloud), args.max_cloud, replace=False)
            cloud = cloud[sel]
            cloud_cols = [cloud_cols[k] for k in sel]

    # ── Write artifacts ────────────────────────────────────────────────────────
    write_json(os.path.join(DEMO_DIR, "keypoints.json"),
               {"video": meta.to_json(), "frames": keypoint_frames})
    write_json(os.path.join(DEMO_DIR, "poses.json"), {
        "intrinsics": {"fx": f, "fy": f, "cx": cx, "cy": cy},
        "frames": pose_frames,
    })
    write_ply(
        os.path.join(DEMO_DIR, "map.ply"),
        cloud,
        np.array(cloud_cols, dtype=np.uint8) if cloud_cols else None,
    )
    print("done.")


if __name__ == "__main__":
    main()
