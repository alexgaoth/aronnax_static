import ScrollReveal from "@/components/ScrollReveal";
import { COMPANY_NAME } from "@/lib/config";

const audiences = [
  {
    id: "A",
    label: "Defense & UUV teams",
    desc: "Teams building attritable underwater platforms that need robust autonomy software.",
  },
  {
    id: "B",
    label: "Offshore operators",
    desc: "Inspection and IRM contractors looking to reduce vessel days and pilot load.",
  },
  {
    id: "C",
    label: "ROV fleet partners",
    desc: "Operators who can host passive capture hardware during routine missions.",
  },
  {
    id: "D",
    label: "Research labs",
    desc: "Oceanographic and marine robotics groups benchmarking underwater policies.",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">06 · Contact</span>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">
            <div>
              <h2
                className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
              >
                Work with{" "}
                <span className="text-grv-aqua">{COMPANY_NAME}</span>
              </h2>
              <p className="anim-fade-up anim-d3 text-grv-fg2 text-base leading-relaxed mb-10">
                We are incubating at UC San Diego with Scripps Institution of
                Oceanography. Reach out for pilot partnerships, data access, or research
                collaboration.
              </p>

              <div className="space-y-3">
                {audiences.map((a, i) => (
                  <div
                    key={a.id}
                    className={`anim-fade-up anim-d${i + 2} lab-card p-5 flex gap-4 items-start`}
                  >
                    <span className="font-mono text-[0.62rem] text-grv-fg4 tracking-widest pt-0.5 flex-shrink-0">
                      {a.id}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-grv-fg text-sm mb-1">{a.label}</h3>
                      <p className="text-grv-fg3 text-xs leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-fade-up anim-d3 mt-12 lg:mt-0">
              <div className="border border-grv-b bg-grv-hard p-8">
                <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-5">
                  {COMPANY_NAME} · UCSD Scripps
                </p>

                <a
                  href="mailto:contact@aronnaxlab.ai"
                  className="block w-full text-center px-8 py-3.5 bg-grv-aqua text-grv-hard text-xs font-mono font-bold tracking-[0.12em] uppercase hover:bg-grv-aqua2 transition-colors duration-200 mb-4"
                >
                  contact@aronnaxlab.ai
                </a>

                <div className="lab-hr mt-8 mb-6" />

                <div className="space-y-2.5">
                  {[
                    ["Location", "La Jolla, CA"],
                    ["Stage", "Seed · data collection"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[90px_1fr] gap-2 text-xs">
                      <span className="font-mono text-grv-fg4">{k}</span>
                      <span className="text-grv-fg2">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
