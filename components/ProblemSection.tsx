import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  {
    value: "0",
    label: "Real-world underwater VLA datasets",
    sub: "The entire industry trains on 25 hrs of synthetic simulation",
  },
  {
    value: "$150K+",
    label: "Cost per day for a traditional ROV inspection",
    sub: "Vessel day rates for DP-class ships alone",
  },
  {
    value: "25 hrs",
    label: "Total synthetic training data, industry-wide",
    sub: "Versus millions of hours available for terrestrial AI",
  },
  {
    value: "70%",
    label: "Of Earth's surface unreachable by current AI",
    sub: "The ocean is the last domain without a foundation model",
  },
];

const datasetRows = [
  {
    name: "nuScenes / DROID",
    domain: "Terrestrial",
    modalities: "Vision, LiDAR, Control",
    size: "Hundreds of hours",
    actions: true,
    limit: "No fluid dynamics",
  },
  {
    name: "USIM",
    domain: "Underwater",
    modalities: "Vision, Control",
    size: "25 hrs · 905K frames",
    actions: true,
    limit: "100% synthetic — sim-to-real gap",
  },
  {
    name: "SOVIS",
    domain: "Underwater",
    modalities: "Vision, Sonar",
    size: "76,000 frames",
    actions: false,
    limit: "Perception only — no pilot telemetry",
  },
  {
    name: "Aronnax Lab Dataset",
    domain: "Underwater",
    modalities: "Vision · Sonar · IMU · Control",
    size: "Thousands of hours",
    actions: true,
    limit: "None — first real-world marine VLA dataset",
    highlight: true,
  },
];

export default function ProblemSection() {
  return (
    <section id="platform" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">§ 01 / Research Problem</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            The Marine{" "}
            <span className="text-grv-aqua">Data Famine</span>
          </h2>

          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base max-w-2xl mb-14 leading-relaxed">
            Terrestrial AI trains on millions of hours of internet video and massive open
            datasets. The underwater domain has none of this. The physics of the ocean —
            nonlinear hydrodynamics, wavelength-dependent light absorption, total radio
            attenuation — render every terrestrial model useless beneath the surface.
          </p>

          {/* Stats grid */}
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

          {/* Dataset table */}
          <div className="anim-fade-up anim-d4">
            <p className="font-mono text-[0.65rem] tracking-widest uppercase text-grv-fg4 mb-4">
              Table 1 — State of the art: underwater training datasets
            </p>
            <div className="overflow-x-auto border border-grv-b">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-grv-b bg-grv-base">
                    {["Dataset", "Domain", "Modalities", "Size", "Actions", "Limitation"].map((h) => (
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
                        row.highlight
                          ? "bg-grv-soft"
                          : "hover:bg-grv-base"
                      }`}
                    >
                      <td className={`px-4 py-3.5 font-medium ${row.highlight ? "text-grv-aqua" : "text-grv-fg"}`}>
                        {row.name}
                        {row.highlight && (
                          <span className="ml-2 font-mono text-[0.58rem] border border-grv-aqua/40 text-grv-aqua px-1.5 py-0.5 tracking-wider uppercase">
                            this work
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-grv-fg2">{row.domain}</td>
                      <td className="px-4 py-3.5 text-grv-fg2 font-mono text-xs">{row.modalities}</td>
                      <td className="px-4 py-3.5 text-grv-fg2 font-mono text-xs">{row.size}</td>
                      <td className="px-4 py-3.5 font-mono text-sm">
                        {row.actions
                          ? <span className="text-grv-aqua">✓</span>
                          : <span className="text-grv-fg4">✗</span>}
                      </td>
                      <td className={`px-4 py-3.5 text-xs leading-relaxed ${row.highlight ? "text-grv-aqua2 font-medium" : "text-grv-fg4"}`}>
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
