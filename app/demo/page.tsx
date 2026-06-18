import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoView from "@/components/demo/DemoView";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Live four-quadrant replay: raw ROV video stream with SAM2 segmentation, ORB SLAM feature tracking, and a 3D visual-odometry map — all from a single underwater pass.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="lab-grid min-h-screen pt-24 lg:pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
          <div className="mb-5">
            <span className="section-label">§ Demo / Perception Stack</span>
          </div>
          <h1
            className="font-display font-bold text-grv-fg leading-[1.1] mb-4"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)" }}
          >
            One Pass, <span className="text-grv-aqua">Four Views</span>
          </h1>
          <p className="text-grv-fg3 text-sm max-w-2xl leading-relaxed">
            A single underwater stream, processed once offline and replayed here in
            lockstep: the raw feed, class-agnostic{" "}
            <span className="text-grv-fg2">SAM2 segmentation</span>, real-time{" "}
            <span className="text-grv-fg2">ORB feature tracking</span>, and a 3D{" "}
            <span className="text-grv-fg2">visual-odometry map</span> the camera flies
            as the video plays.
          </p>
        </div>

        <DemoView />
      </main>
      <Footer />
    </>
  );
}
