"use client";

import { useEffect, useRef } from "react";
import { nearestFrameIndex, type KeypointsData } from "@/lib/demo";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  keypoints: KeypointsData | null;
}

// Draws the master video frame, then overlays ORB keypoints (small crosses) for
// the nearest sampled frame — the "feature detection" view of the SLAM front end.
export default function FeatureCanvas({ videoRef, keypoints }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const draw = () => {
      const w = keypoints?.video.width || video.videoWidth;
      const h = keypoints?.video.height || video.videoHeight;
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }

      if (video.readyState >= 2 && canvas.width) {
        // Desaturate the footage so the (colored) features pop against the
        // otherwise-blue water instead of blending in.
        ctx.filter = "grayscale(1)";
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";

        if (keypoints && keypoints.frames.length) {
          const idx = nearestFrameIndex(keypoints.frames, video.currentTime);
          const pts = keypoints.frames[idx].pts;
          const r = Math.max(2.5, canvas.width / 360);
          ctx.strokeStyle = "#f6bd3b"; // bright amber — high contrast on grayscale
          ctx.lineWidth = Math.max(1, canvas.width / 1100);
          ctx.beginPath();
          for (const [x, y] of pts) {
            ctx.moveTo(x - r, y);
            ctx.lineTo(x + r, y);
            ctx.moveTo(x, y - r);
            ctx.lineTo(x, y + r);
          }
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [videoRef, keypoints]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
