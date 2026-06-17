"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEMO_ASSETS,
  fetchJSON,
  type KeypointsData,
  type MasksData,
  type PosesData,
} from "@/lib/demo";
import SegmentationCanvas from "./SegmentationCanvas";
import FeatureCanvas from "./FeatureCanvas";
import SlamMap from "./SlamMap";
import Quadrant from "./Quadrant";

type LoadState = "loading" | "ready" | "error";

function fmt(t: number): string {
  if (!isFinite(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function DemoView() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [state, setState] = useState<LoadState>("loading");
  const [errMsg, setErrMsg] = useState<string>("");
  const [masks, setMasks] = useState<MasksData | null>(null);
  const [keypoints, setKeypoints] = useState<KeypointsData | null>(null);
  const [poses, setPoses] = useState<PosesData | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load all artifacts once. The video itself loads via the <video> element.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchJSON<MasksData>(DEMO_ASSETS.masks),
      fetchJSON<KeypointsData>(DEMO_ASSETS.keypoints),
      fetchJSON<PosesData>(DEMO_ASSETS.poses),
    ])
      .then(([m, k, p]) => {
        if (cancelled) return;
        setMasks(m);
        setKeypoints(k);
        setPoses(p);
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

  // Mirror the master video's clock into React state for the controls readout.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrent(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      {/* Four-quadrant grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant id="01" label="Raw Stream">
          {/* The single master <video> — sole decoder + clock for all quadrants. */}
          <video
            ref={videoRef}
            src={DEMO_ASSETS.video}
            className="absolute inset-0 w-full h-full object-cover bg-black"
            playsInline
            muted
            loop
            preload="auto"
          />
        </Quadrant>

        <Quadrant id="02" label="Segmentation · SAM2">
          <SegmentationCanvas videoRef={videoRef} masks={masks} />
        </Quadrant>

        <Quadrant id="03" label="SLAM Features · ORB">
          <FeatureCanvas videoRef={videoRef} keypoints={keypoints} />
        </Quadrant>

        <Quadrant id="04" label="3D Map · Visual Odometry">
          <SlamMap videoRef={videoRef} poses={poses} />
        </Quadrant>
      </div>

      {/* Shared timeline controls */}
      <div className="terminal mt-4 px-4 py-3 flex items-center gap-4">
        <button
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

      {/* Status line */}
      <div className="mt-2 font-mono text-[0.62rem] tracking-wide text-grv-fg4">
        {state === "loading" && (
          <span>
            <span className="text-grv-aqua">$</span> loading replay artifacts…
          </span>
        )}
        {state === "error" && (
          <span className="text-grv-amber">
            ! could not load demo artifacts — {errMsg}. Run the pipeline (see
            pipeline/README.md) to generate /demo data.
          </span>
        )}
        {state === "ready" && (
          <span>
            <span className="text-grv-teal">✓</span> pre-generated replay · one shared
            clock drives all four quadrants
          </span>
        )}
      </div>
    </div>
  );
}
