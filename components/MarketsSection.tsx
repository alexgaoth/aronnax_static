import ScrollReveal from "@/components/ScrollReveal";

const militaryMetrics = [
  { label: "DoD Replicator budget",             value: "$400M – $800M" },
  { label: "Target: attritable UUVs at scale",  value: "1,000s" },
  { label: "DIU ACT contract",                  value: "Active" },
];

const commercialMetrics = [
  { label: "Subsea IRM market (2025)",   value: "$7.1 B" },
  { label: "Projected market (2034)",    value: "$13.7 B" },
  { label: "Offshore wind turbines",     value: "100,000s" },
];

const comparisonRows = [
  {
    metric: "Vessel requirement",
    traditional: "Dynamic Positioning (DP) support vessel",
    autonomous:  "Uncrewed Surface Vessel or resident dock",
  },
  {
    metric: "Day rate",
    traditional: "$45,000 – $150,000+",
    autonomous:  "$0 – $5,000 (USV deployment)",
  },
  {
    metric: "Personnel",
    traditional: "3 — Pilot, Co-Pilot, Supervisor",
    autonomous:  "0 — Remote monitoring only",
  },
  {
    metric: "Labor cost / day",
    traditional: "$1,050 – $2,100",
    autonomous:  "$0 (edge-compute autonomy)",
  },
  {
    metric: "Zero-visibility ops",
    traditional: "Pilot halts / diver required",
    autonomous:  "VLA cross-modal sonar navigation",
  },
];

export default function MarketsSection() {
  return (
    <section id="markets" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">§ 04 / Market Verticals</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Dual-Use <span className="text-grv-aqua">Platform</span>
          </h2>
          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base mb-12 max-w-2xl leading-relaxed">
            One foundation model. Two independently addressable markets with acute,
            high-value pain points the dataset directly resolves.
          </p>

          {/* Market panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-14">
            {/* Defense */}
            <div className="anim-fade-up anim-d2 lab-card p-7">
              <div className="flex items-center justify-between mb-5">
                <span className="section-label">Defense</span>
                <span className="font-mono text-[0.6rem] tracking-widest uppercase text-grv-fg4 border border-grv-b px-2 py-0.5">
                  Vertical A
                </span>
              </div>

              <h3 className="font-display font-semibold text-grv-fg text-xl mb-3">
                Seabed Warfare & the Replicator Initiative
              </h3>
              <p className="text-grv-fg2 text-sm leading-relaxed mb-4">
                The Pentagon is scaling procurement of Large Displacement UUVs — Anduril
                Dive-LD, HII Lionfish — but these systems are bottlenecked by software.
                In GPS-denied environments they execute rigid, pre-programmed waypoints.
                When currents push them off course, they go deaf, dumb, and blind.
              </p>
              <p className="text-grv-fg2 text-sm leading-relaxed mb-6">
                Our foundation model gives a low-cost, attritable UUV the navigational
                intuition of an operator with decades of experience — enabling autonomous
                Mine Countermeasures (MCM) and GPS-denied collaborative teaming.
              </p>

              <div className="border-t border-grv-b pt-5 space-y-3">
                {militaryMetrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-xs text-grv-fg3">{m.label}</span>
                    <span className="font-mono text-sm font-semibold text-grv-aqua">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {["UUVGRU 1", "UUVRON-1", "DIU ACT Contract", "Replicator"].map((t) => (
                  <span key={t} className="font-mono text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border border-grv-b text-grv-fg4">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Commercial */}
            <div className="anim-fade-up anim-d3 lab-card p-7">
              <div className="flex items-center justify-between mb-5">
                <span className="section-label">Commercial</span>
                <span className="font-mono text-[0.6rem] tracking-widest uppercase text-grv-fg4 border border-grv-b px-2 py-0.5">
                  Vertical B
                </span>
              </div>

              <h3 className="font-display font-semibold text-grv-fg text-xl mb-3">
                Offshore Inspection, Repair & Maintenance
              </h3>
              <p className="text-grv-fg2 text-sm leading-relaxed mb-4">
                Subsea IRM campaigns are prohibitively expensive. DP-class vessels cost
                $150K/day. The industry suffers a chronic ROV pilot shortage — a brain drain
                from the 2015-2020 oil downturn that caps concurrent inspection campaigns.
              </p>
              <p className="text-grv-fg2 text-sm leading-relaxed mb-6">
                By licensing our VLA model, operators transition from a 3-person ROV crew
                on a DP vessel to a fleet of autonomous &quot;resident&quot; AUVs deployed directly
                from turbine foundations — zero-person workflows that eliminate vessel OPEX.
              </p>

              <div className="border-t border-grv-b pt-5 space-y-3">
                {commercialMetrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between">
                    <span className="text-xs text-grv-fg3">{m.label}</span>
                    <span className="font-mono text-sm font-semibold text-grv-aqua">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {["Oceaneering", "Subsea7", "Ørsted", "Offshore Wind IRM"].map((t) => (
                  <span key={t} className="font-mono text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border border-grv-b text-grv-fg4">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ops comparison */}
          <div className="anim-fade-up anim-d4">
            <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-4">
              Table 2 — Operational impact: zero-person autonomous workflow
            </p>
            <div className="overflow-x-auto border border-grv-b">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-grv-b bg-grv-hard">
                    <th className="text-left px-4 py-3 font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 w-44">Metric</th>
                    <th className="text-left px-4 py-3 font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4">Traditional ROV Crew</th>
                    <th className="text-left px-4 py-3 font-mono text-[0.62rem] tracking-widest uppercase text-grv-aqua">VLA Autonomous Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.metric} className={`border-b border-grv-b ${i % 2 === 0 ? "bg-grv-base/40" : ""}`}>
                      <td className="px-4 py-3 font-mono text-xs text-grv-fg4 uppercase tracking-wide">{row.metric}</td>
                      <td className="px-4 py-3 text-grv-fg2 text-xs">{row.traditional}</td>
                      <td className="px-4 py-3 text-grv-aqua text-xs font-medium">{row.autonomous}</td>
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
