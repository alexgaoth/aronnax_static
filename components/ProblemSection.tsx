import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  {
    value: "0",
    label: "Public real-world VLA datasets",
    sub: "Terrestrial robotics has nuScenes, DROID, and more. Underwater has none.",
  },
  {
    value: "25 hrs",
    label: "Synthetic training data (USIM)",
    sub: "Useful for prototyping, but sim-to-real gaps remain large.",
  },
  {
    value: "$150K+",
    label: "Typical ROV inspection day rate",
    sub: "DP vessel + crew makes field data expensive to collect at scale.",
  },
  {
    value: "4",
    label: "Modalities we align per timestep",
    sub: "Video, sonar, IMU, and pilot control — timestamped together.",
  },
];

const datasetRows = [
  {
    name: "nuScenes / DROID",
    domain: "Terrestrial",
    modalities: "Vision, LiDAR, control",
    size: "Hundreds of hours",
    actions: true,
    limit: "No fluid dynamics",
  },
  {
    name: "USIM",
    domain: "Underwater",
    modalities: "Vision, control",
    size: "25 hrs · 905K frames",
    actions: true,
    limit: "Synthetic only",
  },
  {
    name: "SOVIS",
    domain: "Underwater",
    modalities: "Vision, sonar",
    size: "76K frames",
    actions: false,
    limit: "Perception only",
  },
  {
    name: "Aronnax (in progress)",
    domain: "Underwater",
    modalities: "Vision · sonar · IMU · control",
    size: "Pilot deployments",
    actions: true,
    limit: "Real ROV telemetry — pipeline live on USIM today",
    highlight: true,
  },
];

export default function ProblemSection() {
  return (
    <section id="platform" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">01 · The gap</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Underwater AI lacks{" "}
            <span className="text-grv-aqua">training data</span>
          </h2>

          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base max-w-2xl mb-14 leading-relaxed">
            Models trained on land or in simulation struggle underwater. Current, turbidity,
            and radio blackout change the sensing problem entirely. Without aligned
            vision-action-telemetry datasets, marine autonomy stays rule-based.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
            {stats.map((stat, i) => (
              <div
                key={stat.value}
                className={`anim-fade-up anim-d${i + 2} lab-card p-5`}
              >
                <div className="font-mono font-bold text-3xl text-grv-aqua mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-grv-fg mb-1.5 leading-snug">
                  {stat.label}
                </div>
                <div className="text-xs text-grv-fg4 leading-relaxed">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="anim-fade-up anim-d4">
            <p className="font-mono text-[0.65rem] tracking-widest uppercase text-grv-fg4 mb-4">
              Underwater datasets today
            </p>
            <div className="overflow-x-auto border border-grv-b">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-grv-b bg-grv-base">
                    {["Dataset", "Domain", "Modalities", "Size", "Actions", "Notes"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datasetRows.map((row) => (
                    <tr
                      key={row.name}
                      className={`border-b border-grv-b transition-colors duration-150 ${
                        row.highlight ? "bg-grv-soft" : "hover:bg-grv-base"
                      }`}
                    >
                      <td className={`px-4 py-3.5 font-medium ${row.highlight ? "text-grv-aqua" : "text-grv-fg"}`}>
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-grv-fg2">{row.domain}</td>
                      <td className="px-4 py-3.5 text-grv-fg2 font-mono text-xs">{row.modalities}</td>
                      <td className="px-4 py-3.5 text-grv-fg2 font-mono text-xs">{row.size}</td>
                      <td className="px-4 py-3.5 font-mono text-sm">
                        {row.actions
                          ? <span className="text-grv-aqua">✓</span>
                          : <span className="text-grv-fg4">✗</span>}
                      </td>
                      <td className={`px-4 py-3.5 text-xs leading-relaxed ${row.highlight ? "text-grv-aqua2" : "text-grv-fg4"}`}>
                        {row.limit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
