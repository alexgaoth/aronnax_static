import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { DEMO_PIPELINE_PATH, DEMO_SLAM_PATH } from "@/lib/config";
import { Button } from "@/components/ui/button";

export default function DemoSection() {
  return (
    <section id="demo" className="relative bg-grv-hard py-24 lg:py-32 border-t border-grv-b/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">01 · Demo</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              Two live{" "}
              <span className="text-grv-aqua">replays</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              SLAM on real footage, or the USIM data pipeline from HuggingFace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 anim-fade-up anim-d4">
            <Link href={DEMO_SLAM_PATH} className="lab-card p-6 group block">
              <span className="font-mono text-[0.6rem] text-grv-fg4 tracking-widest">
                01
              </span>
              <h3 className="font-display font-bold text-lg text-grv-fg mt-2 group-hover:text-white transition-colors">
                SLAM Replay
              </h3>
              <p className="text-grv-fg3 text-sm mt-2 leading-relaxed">
                Raw stream, SAM2 segmentation, ORB features, and 3D trajectory —
                one clock.
              </p>
              <span className="font-mono text-[0.62rem] text-grv-aqua mt-4 inline-block tracking-widest uppercase">
                Open replay →
              </span>
            </Link>

            <Link href={DEMO_PIPELINE_PATH} className="lab-card p-6 group block">
              <span className="font-mono text-[0.6rem] text-grv-fg4 tracking-widest">
                02
              </span>
              <h3 className="font-display font-bold text-lg text-grv-fg mt-2 group-hover:text-white transition-colors">
                Data Pipeline
              </h3>
              <p className="text-grv-fg3 text-sm mt-2 leading-relaxed">
                USIM simulation trajectories — video, thruster PWM, IMU, and depth
                aligned for VLA training.
              </p>
              <span className="font-mono text-[0.62rem] text-grv-aqua mt-4 inline-block tracking-widest uppercase">
                Open pipeline →
              </span>
            </Link>
          </div>

          <div className="mt-10 anim-fade-up anim-d5">
            <Button size="lg" render={<Link href={DEMO_SLAM_PATH} />}>
              View Demo
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
