"use client";

import { useState } from "react";
import DemoView from "@/components/demo/DemoView";
import Viewer, { type AnnotationMap, type UsimClip } from "./viewer";

export default function DemoTabs({
  initialClips,
  annotations,
}: {
  initialClips: UsimClip[];
  annotations: AnnotationMap;
}) {
  const [tab, setTab] = useState<"dataset" | "slam">("dataset");

  return (
    <>
      <div className="px-6 lg:px-10 pt-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-grv-b pb-4">
          <div>
            <div className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-aqua">
              Demo
            </div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-grv-fg mt-1">
              Pipeline Workspace
            </h1>
          </div>
          <div className="inline-flex border border-grv-b bg-grv-base p-1">
            {[
              ["dataset", "Dataset Explorer"],
              ["slam", "SLAM Replay"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as "dataset" | "slam")}
                className={`px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider transition-colors ${
                  tab === id
                    ? "bg-grv-aqua text-grv-hard"
                    : "text-grv-fg3 hover:text-grv-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "dataset" ? (
        <Viewer initialClips={initialClips} annotations={annotations} />
      ) : (
        <main className="px-6 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto mb-6">
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-grv-fg">
              Four-View SLAM Replay
            </h2>
            <p className="text-grv-fg3 text-sm mt-1 max-w-2xl">
              Raw stream, SAM2 segmentation, ORB features, and the 3D point-cloud
              trajectory from the perception replay artifacts.
            </p>
          </div>
          <DemoView />
        </main>
      )}
    </>
  );
}
