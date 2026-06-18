"use client";

import { useEffect, useRef } from "react";
import { COMPANY_TAGLINE, DEMO_PATH } from "@/lib/config";

export default function HeroSection() {
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;

    const els: HTMLDivElement[] = [];
    const COUNT = 35;

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("div");
      const size = 1 + Math.random() * 1.5;
      const duration = 18 + Math.random() * 22;
      const delay = Math.random() * 25;
      const opacity = 0.08 + Math.random() * 0.22;
      const drift = (Math.random() - 0.5) * 80;

      el.className = "lab-particle";
      el.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -8px;
        opacity: 0;
        --po: ${opacity};
        --pd: ${drift}px;
        animation: particleDrift ${duration}s ${delay}s linear infinite;
      `;
      container.appendChild(el);
      els.push(el);
    }

    return () => els.forEach((e) => e.remove());
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grv-hard">
      <div className="absolute inset-0 lab-grid" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 60%, rgba(47,60,78,0.55) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div ref={particleRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-grv-hard to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-grv-hard to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20 w-full">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <div className="mb-7 animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <span className="section-label">Research lab · San Diego</span>
            </div>

            <h1
              className="font-display font-bold text-grv-fg leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 6vw, 5.2rem)" }}
            >
              <span className="block animate-fade-up" style={{ animationDelay: "0.15s" }}>
                Training data
              </span>
              <span className="block text-grv-aqua animate-fade-up" style={{ animationDelay: "0.28s" }}>
                for underwater
              </span>
              <span className="block animate-fade-up" style={{ animationDelay: "0.41s" }}>
                autonomy
              </span>
            </h1>

            <p
              className="text-grv-fg2 text-base lg:text-lg max-w-lg mb-8 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.54s" }}
            >
              {COMPANY_TAGLINE}. We capture aligned video, sonar, IMU, and pilot control
              from ROV operations and turn it into training-ready VLA chunks.
            </p>

            <div
              className="flex flex-wrap gap-6 mb-10 animate-fade-up"
              style={{ animationDelay: "0.67s" }}
            >
              {[
                { v: "0", l: "public real-world VLA datasets" },
                { v: "25h", l: "synthetic data (USIM, industry-wide)" },
                { v: "4", l: "modalities per timestep" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-mono font-bold text-2xl text-grv-aqua">{s.v}</div>
                  <div className="font-mono text-[0.65rem] text-grv-fg4 mt-0.5 uppercase tracking-wider">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.78s" }}
            >
              <a
                href={DEMO_PATH}
                className="px-7 py-3 bg-grv-aqua text-grv-hard text-xs font-mono font-bold tracking-[0.12em] uppercase hover:bg-grv-aqua2 transition-colors duration-200"
              >
                View Demo
              </a>
              <a
                href="#platform"
                className="px-7 py-3 border border-grv-b text-grv-fg2 text-xs font-mono font-bold tracking-[0.12em] uppercase hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200"
              >
                The Problem
              </a>
            </div>
          </div>

          <div
            className="hidden lg:block animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <a href={DEMO_PATH} className="block group">
              <div className="terminal rounded-sm overflow-hidden border border-grv-b group-hover:border-grv-aqua transition-colors">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-grv-b bg-grv-base">
                  <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                  <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                  <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                  <span className="font-mono text-[0.65rem] text-grv-fg4 ml-2 tracking-wider">
                    pipeline demo · usim_clips.json
                  </span>
                </div>
                <div className="p-5 space-y-1 text-sm">
                  <p>
                    <span className="terminal-prompt">$ </span>
                    <span className="text-grv-fg">underwater_vla build --limit 200</span>
                  </p>
                  <p className="pt-1 text-grv-fg4">ingest → align → label → export</p>
                  <p>
                    <span className="terminal-prompt">▶ </span>
                    vision + pwm + imu
                    {"  "}<span className="terminal-ok">OK</span>
                  </p>
                  <p>
                    <span className="terminal-prompt">▶ </span>
                    fighting_current labels
                    {"  "}<span className="terminal-ok">OK</span>
                  </p>
                  <p>
                    <span className="terminal-prompt">▶ </span>
                    action chunks [k, 6]
                    {"  "}<span className="terminal-ok">OK</span>
                  </p>
                  <div className="border-t border-grv-b my-3" />
                  <p className="text-grv-fg4">4 USIM clips · synced telemetry · open the explorer →</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-grv-b2 to-transparent" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-grv-fg4">scroll</span>
      </div>
    </section>
  );
}
