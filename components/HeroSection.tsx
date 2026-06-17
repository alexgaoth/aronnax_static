"use client";

import { useEffect, useRef } from "react";
import { COMPANY_TAGLINE } from "@/lib/config";

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
      {/* Graph-paper grid */}
      <div className="absolute inset-0 lab-grid" aria-hidden="true" />

      {/* Subtle depth gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 60%, rgba(47,60,78,0.55) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Particles */}
      <div ref={particleRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />

      {/* Top/bottom fades */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-grv-hard to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-grv-hard to-transparent pointer-events-none" aria-hidden="true" />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20 w-full">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Left — headline */}
          <div>
            <div className="mb-7 animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <span className="section-label">§ Research Lab · San Diego</span>
            </div>

            <h1
              className="font-display font-bold text-grv-fg leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 6vw, 5.2rem)" }}
            >
              <span className="block animate-fade-up" style={{ animationDelay: "0.15s" }}>
                The Last Frontier
              </span>
              <span className="block text-grv-aqua animate-fade-up" style={{ animationDelay: "0.28s" }}>
                for Autonomous AI
              </span>
              <span className="block animate-fade-up" style={{ animationDelay: "0.41s" }}>
                is Underwater.
              </span>
            </h1>

            <p
              className="text-grv-fg2 text-base lg:text-lg max-w-lg mb-8 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.54s" }}
            >
              {COMPANY_TAGLINE}. We are building the first real-world
              Vision-Language-Action dataset for marine autonomous systems.
            </p>

            {/* Stat row */}
            <div
              className="flex flex-wrap gap-6 mb-10 animate-fade-up"
              style={{ animationDelay: "0.67s" }}
            >
              {[
                { v: "0",     l: "real-world VLA datasets exist" },
                { v: "70%",   l: "of Earth’s surface" },
                { v: "$800M", l: "DoD Replicator budget" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-mono font-bold text-2xl text-grv-aqua">{s.v}</div>
                  <div className="font-mono text-[0.65rem] text-grv-fg4 mt-0.5 uppercase tracking-wider">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.78s" }}
            >
              <a
                href="#platform"
                className="px-7 py-3 bg-grv-aqua text-grv-hard text-xs font-mono font-bold tracking-[0.12em] uppercase hover:bg-grv-aqua2 transition-colors duration-200"
              >
                Explore Research
              </a>
              <a
                href="#contact"
                className="px-7 py-3 border border-grv-b text-grv-fg2 text-xs font-mono font-bold tracking-[0.12em] uppercase hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200"
              >
                Partner With Us
              </a>
            </div>
          </div>

          {/* Right — terminal panel */}
          <div
            className="hidden lg:block animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="terminal rounded-sm overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-grv-b bg-grv-base">
                <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                <span className="w-2.5 h-2.5 rounded-full bg-grv-b2" />
                <span className="font-mono text-[0.65rem] text-grv-fg4 ml-2 tracking-wider">
                  aronnax — data_capture.sh
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 space-y-1">
                <p>
                  <span className="terminal-prompt">$ </span>
                  <span className="text-grv-fg">aronnax ingest --live --all-streams</span>
                </p>
                <p className="pt-1 text-grv-fg4">Connecting to ROV telemetry bus…</p>
                <p>
                  <span className="terminal-prompt">▶ </span>
                  VISION (H.264 1080p)
                  {"  "}<span className="terminal-ok">OK</span>
                  {"  "}<span className="terminal-value">23.7 MB/s</span>
                </p>
                <p>
                  <span className="terminal-prompt">▶ </span>
                  SONAR (Oculus M750d)
                  {"  "}<span className="terminal-ok">OK</span>
                  {"  "}<span className="terminal-value">4.2 MB/s</span>
                </p>
                <p>
                  <span className="terminal-prompt">▶ </span>
                  IMU (SCALED_IMU)
                  {"     "}<span className="terminal-ok">OK</span>
                  {"  "}<span className="terminal-value">200 Hz</span>
                </p>
                <p>
                  <span className="terminal-prompt">▶ </span>
                  RC_IN (joystick)
                  {"     "}<span className="terminal-ok">OK</span>
                  {"  "}<span className="terminal-value">50 Hz</span>
                </p>
                <div className="border-t border-grv-b my-3" />
                <p className="text-grv-fg4">Session statistics</p>
                <p>
                  <span className="text-grv-fg3 w-28 inline-block">active streams</span>
                  <span className="terminal-value">847</span>
                </p>
                <p>
                  <span className="text-grv-fg3 w-28 inline-block">hours ingested</span>
                  <span className="terminal-value">2,341.7</span>
                </p>
                <p>
                  <span className="text-grv-fg3 w-28 inline-block">pilot operators</span>
                  <span className="terminal-value">23</span>
                </p>
                <p>
                  <span className="text-grv-fg3 w-28 inline-block">VLA tokens</span>
                  <span className="terminal-value">1.84 B</span>
                </p>
                <div className="border-t border-grv-b my-3" />
                <p>
                  <span className="terminal-prompt">$ </span>
                  <span className="animate-cursor-blink text-grv-aqua">▋</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-grv-b2 to-transparent" />
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-grv-fg4">scroll</span>
      </div>
    </section>
  );
}
