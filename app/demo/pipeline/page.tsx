import type { Metadata } from "next";
import PipelineView from "@/components/demo/PipelineView";

export const metadata: Metadata = {
  title: "Data Pipeline",
  description:
    "USIM simulation trajectories from HuggingFace — optical video, thruster actions, IMU, and depth.",
};

export default function PipelineDemoPage() {
  return (
    <>
      <p className="text-grv-fg3 text-sm mb-8 max-w-2xl leading-relaxed">
        BlueROV2 simulation clips from{" "}
        <span className="text-grv-fg2">Vincent2025hello/usimcou</span> — aligned
        video, thruster commands, IMU, and depth at 10 Hz.
      </p>
      <PipelineView />
    </>
  );
}
