import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    id: "01",
    title: "Deploy the Black Box",
    body: "A hardware-agnostic Ethernet tap is installed inline at the ROV topside station, bridging the Fathom-X interface. No modifications to the ROV. No added latency. Zero pilot disruption.",
    tags: ["Fathom-X", "HomePlug AV", "IEEE-1901"],
  },
  {
    id: "02",
    title: "Passively Ingest Multi-Modal Telemetry",
    body: "The device sniffs all MAVLink traffic: 1080p video (H.264), sonar point clouds (Oculus M750d / Ping360), RC joystick inputs, IMU quaternions, depth, pressure, and battery state — hardware-timestamped to microsecond precision.",
    tags: ["MAVLink", "ArduSub", "pymavlink"],
  },
  {
    id: "03",
    title: "Scale via the Data Bounty Flywheel",
    body: "Commercial ROV operators receive the device free or subsidised. While they execute their everyday missions — harbor inspections, wind turbine surveys — the lab accumulates edge-case expert pilot data that would cost $150K/day to collect independently.",
    tags: ["Zero-cost", "Passive", "Flywheel"],
  },
];

export default function SolutionSection() {
  return (
    <section className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">§ 02 / Methodology</span>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <h2
                className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
              >
                The Zero-Hardware{" "}
                <span className="text-grv-aqua">Retrofit Wedge</span>
              </h2>

              <p className="anim-fade-up anim-d3 text-grv-fg2 text-base leading-relaxed mb-6">
                Building custom AUVs is a capital-intensive hardware trap. Instead, we deploy
                a plug-and-play telemetry &quot;black box&quot; that intercepts data already flowing
                through every ROV tether — invisibly, passively, continuously.
              </p>
              <p className="anim-fade-up anim-d4 text-grv-fg2 text-base leading-relaxed mb-8">
                The commercial ROV industry logs thousands of hours of complex, high-value
                operations daily. Every mission is a free data collection event.
              </p>

              {/* Tech spec block */}
              <div className="anim-fade-up anim-d5 border border-grv-b bg-grv-hard p-5">
                <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-4">
                  Technical specification
                </p>
                <div className="space-y-2">
                  {[
                    ["Protocol",   "MAVLink · ArduSub · BlueOS"],
                    ["Transport",  "HomePlug AV (IEEE-1901) · 80 Mbps"],
                    ["Interface",  "Fathom-X inline Ethernet bridge"],
                    ["Capture",    "pymavlink + passive packet sniff"],
                    ["Sync",       "Hardware-timestamped µs precision"],
                    ["Output",     "Vision · Sonar · IMU · RC_CHANNELS"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-2 text-sm">
                      <span className="font-mono text-xs text-grv-fg4">{k}</span>
                      <span className="text-grv-fg2">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — steps */}
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
