"use client";

import { useEffect, useRef } from "react";
import { nearestFrameIndex, type MasksData } from "@/lib/demo";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  masks: MasksData | null;
}

// Draws the master video frame, then overlays SAM2 mask polygons for the
// nearest sampled frame to the video's current time. Runs its own rAF loop but
// reads the shared video clock, so it stays in lockstep with every quadrant.
export default function SegmentationCanvas({ videoRef, masks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorById = new Map<number, string>(
      (masks?.instances ?? []).map((i) => [i.id, i.color]),
    );

    let raf = 0;
    const draw = () => {
      const w = masks?.video.width || video.videoWidth;
      const h = masks?.video.height || video.videoHeight;
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }

      if (video.readyState >= 2 && canvas.width) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (masks && masks.frames.length) {
          const idx = nearestFrameIndex(masks.frames, video.currentTime);
          const frame = masks.frames[idx];
          ctx.lineWidth = Math.max(2, canvas.width / 480);
          for (const obj of frame.objects) {
            const color = colorById.get(obj.id) ?? "#5f9ea8";
            for (const poly of obj.polygons) {
              if (poly.length < 6) continue;
              ctx.beginPath();
              ctx.moveTo(poly[0], poly[1]);
              for (let i = 2; i < poly.length; i += 2) {
                ctx.lineTo(poly[i], poly[i + 1]);
              }
              ctx.closePath();
              ctx.fillStyle = color + "33"; // ~20% translucent fill
              ctx.fill();
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [videoRef, masks]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
