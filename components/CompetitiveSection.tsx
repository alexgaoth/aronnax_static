import ScrollReveal from "@/components/ScrollReveal";

const notes = [
  {
    name: "Greensea IQ · OPENSEA",
    body: "Rules-based navigation OS and sensor integration layer. A VLA policy could sit on top of their edge stack as a behavioral layer.",
  },
  {
    name: "SeeByte · SeeTrack",
    body: "Mission planning and fleet C2. They handle where to go; a trained policy handles how to move moment-to-moment.",
  },
  {
    name: "Classical CV stacks",
    body: "ATR and rule-based obstacle avoidance break on novel debris and zero visibility. Learned policies from pilot data address edge cases rules miss.",
  },
];

export default function CompetitiveSection() {
  return (
    <section id="company" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">06 · Position</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Data and policy,{" "}
            <span className="text-grv-aqua">not another OS</span>
          </h2>
          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base mb-12 max-w-2xl leading-relaxed">
            Incumbents sell integration software and mission tools. We focus on the missing
            layer: aligned training data and learned control policies for underwater vehicles.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {notes.map((item, i) => (
              <div key={item.name} className={`anim-fade-up anim-d${i + 2} lab-card p-6`}>
                <h3 className="font-display font-semibold text-grv-fg text-sm mb-3">{item.name}</h3>
                <p className="text-grv-fg3 text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
