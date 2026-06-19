"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEMO_ASSETS,
  fetchJSON,
  nearestUsimFrameIndex,
  type AnnotationMap,
  type BoundingBox,
  type UsimEpisode,
  type UsimFrame,
} from "@/lib/demo";
import VideoOverlay from "./VideoOverlay";

type LoadState = "loading" | "ready" | "error";

const THRUSTER_LABELS = ["F-P", "F-S", "V-F", "V-A", "H-P", "H-S"] as const;

function fmt(t: number): string {
  if (!isFinite(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function pwmBar(label: string, value: number) {
  const pct = Math.round(Math.abs(value) * 100);
  const isNeg = value < 0;
  return (
    <div key={label} className="flex items-center gap-2">
      <span className="font-mono text-[0.55rem] text-grv-fg4 w-7 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-grv-hard relative overflow-hidden">
        <div
          className={`absolute top-0 h-full ${isNeg ? "right-1/2 bg-grv-blue" : "left-1/2 bg-grv-aqua"}`}
          style={{ width: `${pct / 2}%` }}
        />
        <div className="absolute inset-y-0 left-1/2 w-px bg-grv-b2" />
      </div>
      <span className="font-mono text-[0.55rem] text-grv-fg3 tabular-nums w-8 text-right">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function ImuStrip({ frame }: { frame: UsimFrame }) {
  const rows = [
    { label: "ax", value: frame.imuLinearAcceleration[0] },
    { label: "ay", value: frame.imuLinearAcceleration[1] },
    { label: "az", value: frame.imuLinearAcceleration[2] },
    { label: "gx", value: frame.imuAngularVelocity[0] },
    { label: "gy", value: frame.imuAngularVelocity[1] },
    { label: "gz", value: frame.imuAngularVelocity[2] },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[0.55rem] text-grv-fg4">{label}</span>
          <span className="font-mono text-[0.6rem] text-grv-fg2 tabular-nums">
            {value.toFixed(3)}
          </span>
        </div>
      ))}
    </div>
  );
}

function frameAtTime(frames: UsimFrame[], t: number): UsimFrame {
  const idx = nearestUsimFrameIndex(frames, t);
  return frames[Math.max(0, idx)] ?? frames[0];
}

export default function PipelineView() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [state, setState] = useState<LoadState>("loading");
  const [errMsg, setErrMsg] = useState("");
  const [episodes, setEpisodes] = useState<UsimEpisode[]>([]);
  const [annotations, setAnnotations] = useState<AnnotationMap>({});
  const [episodeIdx, setEpisodeIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const episode = episodes[episodeIdx] ?? null;
  const frame = episode ? frameAtTime(episode.frames, current) : null;
  const boxes: BoundingBox[] =
    episode && frame
      ? (annotations[episode.id]?.frames?.[String(frame.frameIndex)] ?? [])
      : [];

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchJSON<UsimEpisode[]>(DEMO_ASSETS.usimClips),
      fetchJSON<AnnotationMap>(DEMO_ASSETS.annotations),
    ])
      .then(([clips, ann]) => {
        if (cancelled) return;
        setEpisodes(clips);
        setAnnotations(ann);
        setState("ready");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setErrMsg(e instanceof Error ? e.message : String(e));
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(isFinite(v.duration) ? v.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("durationchange", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    if (v.readyState >= 1) {
      onMeta();
      onTime();
    }
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("durationchange", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [episodeIdx, episode?.videoSrc]);

  const selectEpisode = (idx: number) => {
    setEpisodeIdx(idx);
    setCurrent(0);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const seek = (t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    setCurrent(t);
  };

  const actionVec = frame?.actionPwm.slice(0, 6) ?? [];

  return (
    <div>
      {state === "ready" && episodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {episodes.map((ep, i) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => selectEpisode(i)}
              className={`font-mono text-[0.62rem] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                i === episodeIdx
                  ? "border-grv-aqua text-grv-aqua bg-grv-soft"
                  : "border-grv-b text-grv-fg3 hover:border-grv-aqua/50"
              }`}
            >
              {ep.id.replace("episode_", "ep ")}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 lab-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-3 py-2 border-b border-grv-b bg-grv-base">
            <span className="font-mono text-[0.6rem] text-grv-fg4 tracking-widest">01</span>
            <span className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-grv-aqua">
              Optical · USIM / HuggingFace
            </span>
          </div>
          <div className="relative w-full aspect-video bg-grv-hard">
            {episode && (
              <video
                ref={videoRef}
                key={episode.videoSrc}
                src={episode.videoSrc}
                className="absolute inset-0 w-full h-full object-contain"
                playsInline
                muted
                loop
                preload="auto"
              />
            )}
            {state === "ready" && episode && frame && (
              <VideoOverlay boxes={boxes} />
            )}
            {state === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] text-grv-fg4">
                loading USIM clips…
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="lab-card p-4 flex-1">
            <span className="font-mono text-[0.58rem] tracking-widest uppercase text-grv-fg4 block mb-2">
              Task
            </span>
            <p className="font-display text-sm text-grv-fg leading-snug">
              {frame?.task ?? episode?.task ?? "—"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <span className="font-mono text-[0.55rem] text-grv-fg4 uppercase tracking-wider">
                  Depth (pressure)
                </span>
                <p className="font-mono text-sm text-grv-aqua tabular-nums mt-0.5">
                  {frame ? frame.pressure.toFixed(3) : "—"} bar
                </p>
              </div>
              <div>
                <span className="font-mono text-[0.55rem] text-grv-fg4 uppercase tracking-wider">
                  DVL altitude
                </span>
                <p className="font-mono text-sm text-grv-aqua tabular-nums mt-0.5">
                  {frame ? frame.dvlAltitude.toFixed(2) : "—"} m
                </p>
              </div>
            </div>
            {boxes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-grv-b">
                <span className="font-mono text-[0.55rem] text-grv-fg4 uppercase tracking-wider">
                  Detections
                </span>
                <ul className="mt-1.5 space-y-1">
                  {boxes.map((box, i) => (
                    <li
                      key={`${box.label}-${i}`}
                      className="font-mono text-[0.62rem] text-grv-aqua"
                    >
                      {box.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lab-card p-4">
            <span className="font-mono text-[0.58rem] tracking-widest uppercase text-grv-fg4 block mb-3">
              Action · 6 thrusters
            </span>
            <div className="space-y-1.5">
              {THRUSTER_LABELS.map((label, i) =>
                pwmBar(label, actionVec[i] ?? 0),
              )}
            </div>
          </div>

          <div className="lab-card p-4">
            <span className="font-mono text-[0.58rem] tracking-widest uppercase text-grv-fg4 block mb-3">
              IMU
            </span>
            {frame ? <ImuStrip frame={frame} /> : <span className="text-grv-fg4 text-sm">—</span>}
          </div>
        </div>
      </div>

      <div className="terminal mt-4 px-4 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          disabled={state !== "ready"}
          className="font-mono text-[0.7rem] tracking-widest uppercase text-grv-aqua hover:text-grv-aqua2 disabled:text-grv-fg4 disabled:cursor-not-allowed transition-colors w-14 text-left"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "▮▮ stop" : "▶ play"}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={current}
          onChange={(e) => seek(parseFloat(e.target.value))}
          disabled={state !== "ready"}
          className="demo-scrub flex-1"
          aria-label="Scrub timeline"
        />

        <span className="font-mono text-[0.7rem] text-grv-fg3 tabular-nums whitespace-nowrap">
          {fmt(current)} / {fmt(duration)}
        </span>
      </div>

      <div className="mt-2 font-mono text-[0.62rem] tracking-wide text-grv-fg4">
        {state === "loading" && (
          <span>
            <span className="text-grv-aqua">$</span> fetching Vincent2025hello/usimcou clips…
          </span>
        )}
        {state === "error" && (
          <span className="text-grv-amber">
            ! could not load pipeline demo — {errMsg}. Run{" "}
            <code className="text-grv-fg3">python -m underwater_vla build</code> or check{" "}
            <code className="text-grv-fg3">public/demo/usim_clips.json</code>.
          </span>
        )}
        {state === "ready" && frame && (
          <span>
            <span className="text-grv-teal">✓</span> frame {frame.frameIndex} ·{" "}
            {boxes.length} box{boxes.length === 1 ? "" : "es"} ·{" "}
            {episode?.frames.length} samples · dataset{" "}
            <span className="text-grv-fg3">Vincent2025hello/usimcou</span>
          </span>
        )}
      </div>
    </div>
  );
}
