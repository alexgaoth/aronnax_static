import ScrollReveal from "@/components/ScrollReveal";
import DemoView from "@/components/demo/DemoView";

export default function DemoSection() {
  return (
    <section id="demo" className="relative bg-grv-hard py-24 lg:py-32">
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
              SLAM replay from{" "}
              <span className="text-grv-aqua">real footage</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              Raw stream, SAM2 segmentation, ORB features, and 3D trajectory —
              one shared clock drives all four views.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <DemoView />
    </section>
  );
}
