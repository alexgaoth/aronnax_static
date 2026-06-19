import type { Metadata } from "next";
import DemoView from "@/components/demo/DemoView";

export const metadata: Metadata = {
  title: "SLAM Replay",
  description:
    "Four-quadrant replay: raw stream, SAM2 segmentation, ORB features, and 3D visual odometry.",
};

export default function SlamDemoPage() {
  return (
    <>
      <p className="text-grv-fg3 text-sm mb-8 max-w-2xl leading-relaxed">
        Raw stream, SAM2 segmentation, ORB features, and 3D trajectory — one
        shared clock drives all four quadrants.
      </p>
      <DemoView embedded />
    </>
  );
}
