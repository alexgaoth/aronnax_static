"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FrameRow {
  frameIndex: number;
  timestamp: number;
  task: string;
  jointPos: number[];
  statePwm: number[];
  dvlVelocity: number[];
  imuAngularVelocity: number[];
  imuLinearAcceleration: number[];
  pressure: number;
  dvlAltitude: number;
  actionPwm: number[];
}

interface BoundingBox {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AnnotationMap {
  [episodeId: string]: {
    frames?: {
      [frameIndex: string]: BoundingBox[];
    };
  };
}

export interface UsimClip {
  id: string;
  videoSrc: string;
  task: string;
  frames: FrameRow[];
}

function fmt(n: number, digits = 3) {
  return n.toFixed(digits);
}

function Sparkline({
  data,
  label,
  currentIndex,
}: {
  data: number[];
  label: string;
  currentIndex: number;
}) {
  const width = 220;
  const height = 48;
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(1, data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  const markerX =
    (Math.min(Math.max(currentIndex, 0), Math.max(0, data.length - 1)) /
      Math.max(1, data.length - 1)) *
    width;
  const markerValue = data[Math.min(Math.max(currentIndex, 0), data.length - 1)] ?? data[0];
  const markerY = height - ((markerValue - min) / range) * (height - 6) - 3;

  return (
    <div className="border border-grv-b bg-grv-base p-2">
      <div className="font-mono text-[0.62rem] uppercase tracking-wider text-grv-fg4 mb-1">{label}</div>
      <svg width={width} height={height} className="block w-full max-w-full">
        <polyline points={points} fill="none" stroke="#5f9ea8" strokeWidth={1.5} />
        <line
          x1={markerX}
          x2={markerX}
          y1={0}
          y2={height}
          stroke="#4e6070"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
        <circle cx={markerX} cy={markerY} r={3} fill="#78b4c0" />
      </svg>
      <div className="flex justify-between font-mono text-[0.6rem] text-grv-fg4">
        <span>{fmt(min, 2)}</span>
        <span>{fmt(max, 2)}</span>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-grv-b text-xs">
      <span className="text-grv-fg4 font-mono">{label}</span>
      <span className="text-grv-fg2 text-right">{value}</span>
    </div>
  );
}

function VideoOverlay({ boxes }: { boxes: BoundingBox[] }) {
  if (!boxes.length) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {boxes.map((box, index) => (
        <div
          key={`${box.label}-${index}`}
          className="absolute border-2 border-grv-aqua box-border"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.w * 100}%`,
            height: `${box.h * 100}%`,
          }}
        >
          <div className="absolute left-0 -top-5 bg-grv-aqua text-grv-hard text-[0.65rem] font-mono px-1.5 py-0.5 whitespace-nowrap">
            {box.label}
          </div>
        </div>
      ))}
    </div>
  );
}

const btnClass =
  "px-3 py-1.5 border border-grv-b text-xs font-mono uppercase tracking-wider text-grv-fg2 hover:border-grv-aqua hover:text-grv-fg transition-colors";

export default function Viewer({
  initialClips,
  annotations,
}: {
  initialClips: UsimClip[];
  annotations: AnnotationMap;
}) {
  const [clipIndex, setClipIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const clips = useMemo(() => initialClips.slice(0, 4), [initialClips]);
  const clip = clips[clipIndex] ?? null;
  const frame = clip?.frames[frameIndex] ?? null;

  useEffect(() => {
    setFrameIndex(0);
    setPlaying(false);
  }, [clipIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play();
    } else {
      video.pause();
    }
  }, [playing, clipIndex]);

  useEffect(() => {
    if (!videoRef.current || !frame) return;
    if (Math.abs(videoRef.current.currentTime - frame.timestamp) > 0.15) {
      videoRef.current.currentTime = frame.timestamp;
    }
  }, [frame]);

  if (!clips.length || !frame || !clip) {
    return (
      <main className="min-h-[60vh] grid place-items-center p-6">
        <p className="text-grv-fg3 text-sm">No demo clips found. Run the pipeline build first.</p>
      </main>
    );
  }

  const depthSeries = clip.frames.map((row) => row.pressure);
  const axSeries = clip.frames.map((row) => row.imuLinearAcceleration[0] ?? 0);
  const aySeries = clip.frames.map((row) => row.imuLinearAcceleration[1] ?? 0);
  const azSeries = clip.frames.map((row) => row.imuLinearAcceleration[2] ?? 0);
  const gxSeries = clip.frames.map((row) => row.imuAngularVelocity[0] ?? 0);
  const gySeries = clip.frames.map((row) => row.imuAngularVelocity[1] ?? 0);
  const gzSeries = clip.frames.map((row) => row.imuAngularVelocity[2] ?? 0);
  const boxes = annotations[clip.id]?.frames?.[String(frame.frameIndex)] ?? [];

  return (
    <main className="px-6 lg:px-10 py-8">
      <div className="max-w-[1400px] mx-auto grid gap-6">
        <div className="flex flex-wrap justify-between items-baseline gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-grv-fg">Dataset Explorer</h1>
            <p className="text-grv-fg3 text-sm mt-1 max-w-xl">
              USIM simulation clips with aligned video, pilot actions, IMU, and auto-derived labels.
              Scrub the timeline to inspect what the pipeline exports.
            </p>
          </div>
          <div className="font-mono text-[0.62rem] tracking-wider uppercase text-grv-fg4">
            clip {clipIndex + 1} / {clips.length} · frame {frameIndex + 1} / {clip.frames.length}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_300px] gap-4 items-start">
          <aside className="lab-card p-3 max-h-[75vh] overflow-auto">
            <div className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">Clips</div>
            <div className="grid gap-2">
              {clips.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setClipIndex(index)}
                  className={`text-left p-2.5 border transition-colors ${
                    index === clipIndex
                      ? "border-grv-aqua bg-grv-soft text-grv-fg"
                      : "border-grv-b text-grv-fg2 hover:border-grv-aqua/50"
                  }`}
                >
                  <div className="font-mono text-xs">{item.id}</div>
                  <div className="text-[0.65rem] text-grv-fg4 mt-0.5">{item.frames.length} frames</div>
                  <div className="text-[0.65rem] text-grv-fg3 mt-1 leading-snug">{item.task}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="grid gap-3">
            <div className="lab-card p-3">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <div className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4">Video</div>
                <div className="font-mono text-[0.62rem] text-grv-fg4">
                  frame {frameIndex + 1} at {fmt(frame.timestamp, 2)}s
                </div>
              </div>

              <div className="relative aspect-video bg-grv-hard overflow-hidden">
                <video
                  ref={videoRef}
                  src={clip.videoSrc}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  onTimeUpdate={(event) => {
                    if (!clip.frames.length) return;
                    const currentTime = event.currentTarget.currentTime;
                    let bestIndex = 0;
                    let bestDelta = Infinity;
                    for (let i = 0; i < clip.frames.length; i += 1) {
                      const delta = Math.abs(clip.frames[i].timestamp - currentTime);
                      if (delta < bestDelta) {
                        bestDelta = delta;
                        bestIndex = i;
                      }
                    }
                    setFrameIndex((current) => (current === bestIndex ? current : bestIndex));
                  }}
                  onEnded={() => setPlaying(false)}
                  className="w-full h-full object-contain"
                />
                <VideoOverlay boxes={boxes} />
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => {
                    setPlaying(false);
                    setFrameIndex(0);
                  }}
                  className={btnClass}
                >
                  First
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setFrameIndex((current) => Math.max(0, current - 1));
                  }}
                  className={btnClass}
                >
                  Prev
                </button>
                <button onClick={() => setPlaying((current) => !current)} className={btnClass}>
                  {playing ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setFrameIndex((current) => Math.min(clip.frames.length - 1, current + 1));
                  }}
                  className={btnClass}
                >
                  Next
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setFrameIndex(clip.frames.length - 1);
                  }}
                  className={btnClass}
                >
                  Last
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Sparkline data={depthSeries} label="pressure" currentIndex={frameIndex} />
              <div className="border border-grv-b bg-grv-base p-2">
                <div className="font-mono text-[0.62rem] uppercase tracking-wider text-grv-fg4 mb-1">
                  action pwm
                </div>
                {frame.actionPwm.map((value, index) => (
                  <DataRow key={index} label={`pwm ${index + 1}`} value={fmt(value)} />
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              <Sparkline data={axSeries} label="ax" currentIndex={frameIndex} />
              <Sparkline data={aySeries} label="ay" currentIndex={frameIndex} />
              <Sparkline data={azSeries} label="az" currentIndex={frameIndex} />
              <Sparkline data={gxSeries} label="gx" currentIndex={frameIndex} />
              <Sparkline data={gySeries} label="gy" currentIndex={frameIndex} />
              <Sparkline data={gzSeries} label="gz" currentIndex={frameIndex} />
            </div>
          </section>

          <aside className="lab-card p-3">
            <div className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">
              Frame data
            </div>
            <DataRow label="trajectory" value={clip.id} />
            <DataRow label="task" value={frame.task} />
            <DataRow label="timestamp" value={fmt(frame.timestamp, 2)} />
            <DataRow label="frame_index" value={String(frame.frameIndex)} />
            <DataRow label="pressure" value={fmt(frame.pressure)} />
            <DataRow label="dvl_altitude" value={fmt(frame.dvlAltitude)} />
            <DataRow label="dvl_velocity" value={frame.dvlVelocity.map((value) => fmt(value)).join(", ")} />
            <DataRow
              label="imu_av"
              value={frame.imuAngularVelocity.map((value) => fmt(value, 2)).join(", ")}
            />
            <DataRow
              label="imu_la"
              value={frame.imuLinearAcceleration.map((value) => fmt(value, 2)).join(", ")}
            />
            <DataRow label="joint_pos" value={frame.jointPos.map((value) => fmt(value, 2)).join(", ")} />
            <DataRow label="boxes" value={String(boxes.length)} />
          </aside>
        </div>
      </div>
    </main>
  );
}
