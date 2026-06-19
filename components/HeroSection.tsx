"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { COMPANY_TAGLINE, DEMO_PATH } from "@/lib/config";
import { Button } from "@/components/ui/button";

const RovViewer = dynamic(() => import("@/components/RovViewer"), { ssr: false });

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
        <div className="lg:grid lg:gap-8 lg:items-start" style={{ gridTemplateColumns: "1fr 1.6fr" }}>
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
              {COMPANY_TAGLINE}. USIM video, IMU, depth, and control aligned for VLA training.
            </p>

            <div
              className="flex flex-wrap gap-6 mb-10 animate-fade-up"
              style={{ animationDelay: "0.67s" }}
            >
              {[
                { v: "0", l: "public real-world VLA datasets" },
                { v: "25h", l: "synthetic data (USIM, industry-wide)" },
                { v: "4", l: "USIM signals per timestep" },
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
              <Button
                variant="default"
                size="lg"
                render={<Link href={DEMO_PATH} />}
              >
                View Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="#platform" />}
              >
                The Problem
              </Button>
            </div>
          </div>

          <div
            className="hidden lg:flex animate-fade-in items-center justify-center"
            style={{ animationDelay: "0.5s", height: "70vh", minHeight: "520px", maxHeight: "800px" }}
          >
            <RovViewer />
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
