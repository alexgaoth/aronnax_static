"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import DemoView from "@/components/demo/DemoView";
import PipelineView from "@/components/demo/PipelineView";

type ActiveDemo = "slam" | "pipeline";

const demos: Array<{
  id: ActiveDemo;
  label: string;
  meta: string;
}> = [
  {
    id: "slam",
    label: "SLAM replay",
    meta: "Raw · SAM2 · ORB · VO",
  },
  {
    id: "pipeline",
    label: "Data pipeline",
    meta: "Video · PWM · IMU · depth",
  },
];

export default function DemoSection() {
  const [activeDemo, setActiveDemo] = useState<ActiveDemo>("slam");
  const currentDemo = demos.find((demo) => demo.id === activeDemo) ?? demos[0];

  return (
    <section id="demo" className="relative bg-grv-hard py-12 lg:py-16 border-t border-grv-b/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-4">
            <span className="section-label">01 · Demo</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-6">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              Two live{" "}
              <span className="text-grv-aqua">replays</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              SLAM plus the USIM training-data pipeline.
            </p>
          </div>

          <div className="anim-fade-up anim-d4 border border-grv-b bg-grv-base p-3 sm:p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-3 border-b border-grv-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-grv-fg">
                  {currentDemo.label}
                </h3>
                <span className="font-mono text-[0.58rem] tracking-widest uppercase text-grv-fg4">
                  {currentDemo.meta}
                </span>
              </div>

              <div
                className="inline-grid grid-cols-2 border border-grv-b bg-grv-hard p-1"
                role="tablist"
                aria-label="Homepage demo"
              >
                {demos.map((demo) => {
                  const selected = demo.id === activeDemo;
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveDemo(demo.id)}
                      className={`min-w-28 px-3 py-2 text-center font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
                        selected
                          ? "bg-grv-soft text-grv-aqua"
                          : "text-grv-fg4 hover:text-grv-fg2"
                      }`}
                    >
                      {demo.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              {activeDemo === "slam" ? <DemoView embedded /> : <PipelineView />}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
