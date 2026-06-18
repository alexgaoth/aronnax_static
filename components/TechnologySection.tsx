import ScrollReveal from "@/components/ScrollReveal";

const pillars = [
  {
    id: "I",
    title: "Action chunking",
    subtitle: "Smooth control sequences",
    body: "Rather than one thruster command per frame, the pipeline exports ACT-style chunks of future actions with exponential smoothing — fixed [k, 6] tensors ready for imitation learning.",
    tags: ["ACT", "Chunking", "Imitation learning"],
  },
  {
    id: "II",
    title: "Cross-modal sonar",
    subtitle: "Vision when you have it, sonar when you do not",
    body: "Camera frames pair with forward-looking sonar masks in a shared timeline. When optical visibility drops, the same row structure carries sonar frames and detection boxes through export.",
    tags: ["FLS sonar", "Multimodal", "Alignment"],
  },
  {
    id: "III",
    title: "Physics-derived labels",
    subtitle: "No human annotator for hydrodynamics",
    body: "When a pilot commands forward thrust but IMU acceleration stays near zero, the pipeline tags fighting_current — a subjective pilot reaction turned into an objective training token from RC_IN vs SCALED_IMU.",
    tags: ["IMU", "Hydrodynamics", "Auto-label"],
  },
];

const pipelineStages = [
  "Ingest raw telemetry",
  "Align to uniform rows",
  "Derive VLA labels",
  "Chunk actions → JSON / Parquet",
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">04 · Pipeline</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              Ingest → align → label →{" "}
              <span className="text-grv-aqua">export</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              Four stages turn raw ROV streams into training-ready chunks. Live demo runs on USIM today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            {pillars.map((p, i) => (
              <div
                key={p.id}
                className={`anim-fade-up anim-d${i + 2} lab-card p-7 flex flex-col`}
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[0.65rem] text-grv-fg4 tracking-widest">{p.id}</span>
                  <div>
                    <h3 className="font-display font-semibold text-grv-fg text-base leading-snug">{p.title}</h3>
                    <p className="font-mono text-[0.62rem] tracking-wide uppercase text-grv-aqua mt-0.5">{p.subtitle}</p>
                  </div>
                </div>

                <p className="text-grv-fg2 text-sm leading-relaxed mb-5 flex-1">{p.body}</p>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border border-grv-b text-grv-fg4">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="anim-fade-up anim-d5 border border-grv-b bg-grv-base p-7 lg:flex lg:gap-12 lg:items-center">
            <div className="flex-1">
              <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">
                Build command
              </p>
              <div className="lab-code text-sm">
                python -m underwater_vla build --limit 200 --with-sonar
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-wrap gap-2">
              {pipelineStages.map((stage) => (
                <span
                  key={stage}
                  className="font-mono text-[0.58rem] tracking-widest uppercase px-2.5 py-1 border border-grv-b text-grv-fg3"
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
