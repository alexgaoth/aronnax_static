import ScrollReveal from "@/components/ScrollReveal";

const competitors = [
  {
    name: "Greensea IQ",
    product: "OPENSEA Platform",
    what: "Rules-based navigation OS + Automatic Target Recognition via classical computer vision. Open architecture for sensor integration.",
    position: "Integration partner",
    note: "They are an operating system and hardware module. Our VLA model deploys on top of OPENSEA Edge via their open API — making them a distribution channel, not a competitor.",
  },
  {
    name: "SeeByte",
    product: "SeeTrack / Neptune",
    what: "Mission planning, post-mission analysis, and rule-based swarm C2 software. Neptune handles fleet-level goal orchestration.",
    position: "Integration partner",
    note: "Neptune tells vehicles where to go. Our model tells the vehicle how to physically navigate moment-to-moment. Different layers of the autonomy stack.",
  },
  {
    name: "Nauticus Robotics",
    product: "ToolKITT / Aquanaut",
    what: "End-to-end autonomy software + custom dual-mode AUV hardware manufacturer. Vertically integrated.",
    position: "Cautionary tale",
    note: "$40.8M net loss in 2025. 1-for-8 reverse stock split. The hardware trap in action — R&D costs consumed the company before product-market fit.",
    warn: true,
  },
];

const pivots = [
  {
    id: "A",
    title: "Cross-Modal Perception API",
    body: "License a Sonar-to-Vision translation layer to human pilots operating in zero-visibility conditions. The dataset enables this without a full VLA model.",
  },
  {
    id: "B",
    title: "Subsea Digital Twins & Anomaly Detection",
    body: "Parse inspection footage to build 3D photogrammetry models and auto-flag structural corrosion, marine growth, and scour. Data-as-a-Service model.",
  },
  {
    id: "C",
    title: "Marine Physics Simulator",
    body: "License the world's most accurate underwater physics simulator to defense contractors and academic institutions bridging the sim-to-real gap.",
  },
];

export default function CompetitiveSection() {
  return (
    <section id="company" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">§ 05 / Competitive Landscape</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Operating in a{" "}
            <span className="text-grv-aqua">Blue Ocean</span>
          </h2>
          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base mb-12 max-w-2xl leading-relaxed">
            Every incumbent relies on explicit rules and classical computer vision. We operate at
            a different layer — generative behavioral AI — which makes incumbents potential
            customers or distribution partners rather than direct competitors.
          </p>

          {/* Competitor cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-14">
            {competitors.map((c, i) => (
              <div key={c.name} className={`anim-fade-up anim-d${i + 2} lab-card p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-grv-fg text-base">{c.name}</h3>
                    <p className="font-mono text-[0.6rem] text-grv-fg4 mt-0.5 tracking-wide">{c.product}</p>
                  </div>
                  <span className={`font-mono text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border ${
                    c.warn
                      ? "border-grv-amber/30 text-grv-amber"
                      : "border-grv-aqua/30 text-grv-aqua"
                  }`}>
                    {c.position}
                  </span>
                </div>
                <p className="text-grv-fg2 text-xs leading-relaxed mb-4">{c.what}</p>
                <div className="border-l-2 border-grv-b pl-3">
                  <p className="text-grv-fg3 text-xs leading-relaxed">{c.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key differentiator */}
          <div className="anim-fade-up anim-d4 border border-grv-b bg-grv-base p-7 mb-14">
            <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">
              Core differentiator
            </p>
            <h3 className="font-display font-semibold text-grv-fg text-xl mb-3">
              Deterministic Rules →{" "}
              <span className="text-grv-aqua">Learned Behavioral Policy</span>
            </h3>
            <p className="text-grv-fg2 text-sm leading-relaxed max-w-3xl">
              Incumbents require pre-programmed mathematical rules for every scenario. If a
              turbine pylon is deformed by marine growth and draped in fishing nets, classical
              algorithms abort the mission. Our model has seen human pilots navigate identical
              scenarios in the training data — it outputs the same avoidance behavior
              intuitively, without a single explicit rule.
            </p>
          </div>

          {/* Strategic optionality */}
          <div className="anim-fade-up anim-d3 mb-6">
            <span className="section-label">§ 05b / Strategic Optionality</span>
          </div>
          <h3 className="anim-fade-up anim-d4 font-display font-semibold text-grv-fg text-2xl mb-6">
            The Dataset Has Value Independent of the End Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pivots.map((p, i) => (
              <div key={p.id} className={`anim-fade-up anim-d${i + 2} lab-card p-5`}>
                <span className="font-mono text-[0.6rem] tracking-widest uppercase text-grv-fg4 mb-3 block">
                  Pivot {p.id}
                </span>
                <h4 className="font-display font-semibold text-grv-fg text-sm mb-2">{p.title}</h4>
                <p className="text-grv-fg3 text-xs leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
