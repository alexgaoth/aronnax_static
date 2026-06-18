import ScrollReveal from "@/components/ScrollReveal";

const useCases = [
  {
    label: "Defense",
    title: "GPS-denied UUV navigation",
    body: "Low-cost underwater vehicles need policies that handle current, turbidity, and acoustic sensing — not just pre-programmed waypoints.",
  },
  {
    label: "Commercial",
    title: "Offshore inspection & IRM",
    body: "ROV day rates and pilot shortages push operators toward resident autonomy. Better training data is the bottleneck.",
  },
  {
    label: "Science",
    title: "Marine robotics research",
    body: "Labs need aligned multimodal traces — not just perception frames — to benchmark underwater policies.",
  },
];

export default function MarketsSection() {
  return (
    <section id="markets" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">04 · Applications</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Who needs this{" "}
            <span className="text-grv-aqua">data</span>
          </h2>
          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base mb-12 max-w-2xl leading-relaxed">
            The same aligned telemetry supports defense autonomy, commercial inspection, and
            academic benchmarking — any team training policies that must work underwater.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {useCases.map((item, i) => (
              <div key={item.label} className={`anim-fade-up anim-d${i + 2} lab-card p-7`}>
                <span className="section-label mb-4 inline-block">{item.label}</span>
                <h3 className="font-display font-semibold text-grv-fg text-lg mb-3">{item.title}</h3>
                <p className="text-grv-fg2 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
