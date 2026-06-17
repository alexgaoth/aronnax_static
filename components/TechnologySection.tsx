import ScrollReveal from "@/components/ScrollReveal";

const pillars = [
  {
    id: "I",
    title: "Action Chunking with Transformers",
    subtitle: "Smooth, inertia-aware motion policy",
    body: "Instead of predicting a single thruster command per frame — which compounds errors in fluid environments — our ACT policy uses a CVAE + transformer decoder to predict an entire chunk of future actions. The model commits to coherent, hydrodynamically smooth maneuvers. Temporal ensembling with exponential decay produces trajectories that mirror a master ROV pilot.",
    formula: "π_θ(aₜ, aₜ₊₁, …, aₜ₊ₖ₋₁ | sₜ)",
    tags: ["CVAE", "Transformer", "Imitation Learning", "ACT"],
  },
  {
    id: "II",
    title: "Cross-Modal Sonar–Vision Alignment",
    subtitle: "Navigation in zero optical visibility",
    body: "Turbidity can drop optical visibility to zero instantly. Our pipeline pairs synchronized camera frames with time-aligned polar sonar masks, learning a shared latent space. When visibility collapses, the model transitions to sonar-only navigation by mapping acoustic returns to visual representations learned in clear water. No separate re-training required.",
    formula: "z = Encoder(V_optical ‖ M_sonar)",
    tags: ["Multimodal Fusion", "FLS Sonar", "Latent Alignment"],
  },
  {
    id: "III",
    title: "Retroactive Hydrodynamic Inference",
    subtitle: "Physics-aware training tokens without CFD",
    body: "When a pilot pushes the joystick forward but the IMU registers zero acceleration, the pipeline infers the vehicle is fighting a current. By comparing RC_IN commands against SCALED_IMU responses, we automatically calculate drag coefficients and drift forces — converting subjective human reactions into objective physics-aware training tokens.",
    formula: "τ_env = Mν̇ + C(ν)ν + D(ν)ν − τ_thrust",
    tags: ["IMU Fusion", "Hydrodynamics", "Physics-Informed"],
  },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">§ 03 / Technical Architecture</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              The <span className="text-grv-aqua">VLA Foundation Model</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              Three technical pillars convert raw ROV telemetry into training-ready tokens for a
              marine autonomy foundation model.
            </p>
          </div>

          {/* Pillars */}
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

                <div className="lab-code mb-4">
                  {p.formula}
                </div>

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

          {/* Annotation callout */}
          <div className="anim-fade-up anim-d5 border border-grv-b bg-grv-base p-7 lg:flex lg:gap-12 lg:items-start">
            <div className="flex-1 mb-6 lg:mb-0">
              <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">
                Automated annotation pipeline
              </p>
              <h3 className="font-display font-semibold text-grv-fg text-xl mb-3">
                Physics-Based Color Restoration
              </h3>
              <p className="text-grv-fg2 text-sm leading-relaxed max-w-lg">
                Underwater imagery is degraded by wavelength-dependent absorption. Our pipeline
                uses physics-informed neural networks (PINNs) to estimate backscattering and
                transmission parameters per-pixel from depth and temperature telemetry —
                automatically restoring true color without manual image enhancement, based on
                the Jaffe-McGlamery image formation model.
              </p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-center">
              {[
                { v: "Jaffe-McGlamery", l: "image model" },
                { v: "SLURPP / PINN",   l: "restoration" },
                { v: "Auto",            l: "no labeling" },
                { v: "Per-pixel",       l: "depth-aware" },
              ].map((item) => (
                <div key={item.v} className="border border-grv-b px-4 py-3 bg-grv-hard">
                  <div className="font-mono text-xs font-semibold text-grv-aqua">{item.v}</div>
                  <div className="font-mono text-[0.6rem] text-grv-fg4 mt-1 uppercase tracking-wider">{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
