import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const notes = [
  {
    name: "Greensea IQ · OPENSEA",
    body: "Navigation OS and sensor integration. A VLA policy can sit above it.",
  },
  {
    name: "SeeByte · SeeTrack",
    body: "Mission planning says where to go. Policies handle how to move.",
  },
  {
    name: "Classical CV stacks",
    body: "Rules miss edge cases; pilot data captures them.",
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
            Incumbents sell tools. We build the missing training layer.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {notes.map((item, i) => (
              <Card key={item.name} className={`anim-fade-up anim-d${i + 2}`}>
                <CardHeader className="pb-1">
                  <CardTitle className="font-display font-semibold text-grv-fg text-sm">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-grv-fg3 text-xs leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
