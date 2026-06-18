import ScrollReveal from "@/components/ScrollReveal";
import { DEMO_PATH } from "@/lib/config";

const steps = [
  {
    id: "01",
    title: "Passive capture",
    body: "A hardware tap on the ROV topside Ethernet bridge records MAVLink traffic — video, sonar, joystick input, IMU, depth, and pressure — without modifying the vehicle or interrupting the pilot.",
    tags: ["MAVLink", "ArduSub", "Fathom-X"],
  },
  {
    id: "02",
    title: "Align and normalize",
    body: "Streams are timestamped and normalized into uniform rows. PWM commands are scaled to a fixed contract so training code sees consistent action vectors across vehicles.",
    tags: ["Sync", "Normalize", "Parquet"],
  },
  {
    id: "03",
    title: "Auto-label and chunk",
    body: "Physics-derived labels (e.g. fighting_current when thrust does not match IMU response) and ACT-style action chunks produce export-ready JSON and Parquet for model training.",
    tags: ["Hydrodynamics", "ACT", "Export"],
  },
];

export default function SolutionSection() {
  return (
    <section id="approach" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">03 · Approach</span>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">
            <div>
              <h2
                className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
              >
                Capture what pilots{" "}
                <span className="text-grv-aqua">already do</span>
              </h2>

              <p className="anim-fade-up anim-d3 text-grv-fg2 text-base leading-relaxed mb-6">
                Instead of building new vehicles, we record telemetry from commercial ROV
                missions — inspections, surveys, and maintenance — and process it through a
                single annotation pipeline.
              </p>
              <p className="anim-fade-up anim-d4 text-grv-fg2 text-base leading-relaxed mb-8">
                The pipeline is validated on public USIM simulation data today and designed
                to run unchanged when real black-box ROV traces arrive.
              </p>

              <a
                href={DEMO_PATH}
                className="anim-fade-up anim-d5 inline-block px-7 py-3 bg-grv-aqua text-grv-hard text-xs font-mono font-bold tracking-[0.12em] uppercase hover:bg-grv-aqua2 transition-colors duration-200"
              >
                View SLAM replay
              </a>
            </div>

            <div className="mt-12 lg:mt-0 space-y-4">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`anim-fade-up anim-d${i + 2} lab-card p-6`}
                >
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-mono text-[0.65rem] tracking-widest text-grv-fg4">{step.id}</span>
                    <h3 className="font-display font-semibold text-grv-fg text-base">{step.title}</h3>
                  </div>
                  <p className="text-grv-fg2 text-sm leading-relaxed mb-4">{step.body}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {step.tags.map((t) => (
                      <span key={t} className="font-mono text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border border-grv-b text-grv-fg4">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
