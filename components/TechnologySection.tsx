"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const pillars = [
  {
    id: "I",
    title: "Action chunking",
    subtitle: "Smooth control sequences",
    body: "Rather than one thruster command per frame, the pipeline exports ACT-style chunks of future actions with exponential smoothing — fixed [k, 6] tensors ready for imitation learning.",
    tags: ["ACT", "Chunking", "Imitation learning"],
    tooltips: {
      ACT: "Action Chunking with Transformers — predicts k future actions at once",
      Chunking: "Groups consecutive commands into fixed-length temporal windows",
      "Imitation learning": "Policy trained from expert pilot demonstrations",
    },
  },
  {
    id: "II",
    title: "Cross-modal sonar",
    subtitle: "Vision when you have it, sonar when you do not",
    body: "Camera frames pair with forward-looking sonar masks in a shared timeline. When optical visibility drops, the same row structure carries sonar frames through export.",
    tags: ["FLS sonar", "Multimodal", "Alignment"],
    tooltips: {
      "FLS sonar": "Forward-Looking Sonar — acoustic imaging for zero-visibility conditions",
      Multimodal: "Unified embedding space for camera and sonar inputs",
      Alignment: "Sub-millisecond timestamp sync across all sensor streams",
    },
  },
  {
    id: "III",
    title: "Physics-derived labels",
    subtitle: "No human annotator for hydrodynamics",
    body: "When a pilot commands forward thrust but IMU acceleration stays near zero, the pipeline tags fighting_current — a subjective pilot reaction turned into an objective training token from RC_IN vs SCALED_IMU.",
    tags: ["IMU", "Hydrodynamics", "Auto-label"],
    tooltips: {
      IMU: "Inertial Measurement Unit — acceleration and angular rate sensor",
      Hydrodynamics: "Fluid-body interaction modeled from RC_IN vs SCALED_IMU delta",
      "Auto-label": "fighting_current, station_keeping, etc. derived without annotation",
    },
  },
];

const pipelineStages = [
  "Ingest raw telemetry",
  "Align to uniform rows",
  "Derive VLA labels",
  "Chunk actions → JSON / Parquet",
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">04 · Pipeline</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-12">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              Ingest → align → label →{" "}
              <span className="text-grv-aqua">export</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              Turns raw ROV streams into training-ready chunks. Live demo runs on USIM today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            {pillars.map((p, i) => (
              <Card key={p.id} className={`anim-fade-up anim-d${i + 2} flex flex-col`}>
                <CardHeader className="pb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.65rem] text-grv-fg4 tracking-widest flex-shrink-0">
                      {p.id}
                    </span>
                    <div>
                      <CardTitle className="font-display font-semibold text-grv-fg text-base leading-snug">
                        {p.title}
                      </CardTitle>
                      <p className="font-mono text-[0.62rem] tracking-wide uppercase text-grv-aqua mt-0.5">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <p className="text-grv-fg2 text-sm leading-relaxed flex-1">{p.body}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Tooltip key={t}>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="font-mono text-[0.58rem] tracking-widest uppercase border-grv-b text-grv-fg4 h-auto py-0.5 px-2 cursor-default hover:border-grv-aqua hover:text-grv-aqua transition-colors"
                          >
                            {t}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-center bg-grv-card border border-grv-b text-grv-fg2">
                          {p.tooltips[t as keyof typeof p.tooltips]}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="anim-fade-up anim-d5 border border-grv-b bg-grv-base p-7 lg:flex lg:gap-12 lg:items-center">
            <div className="flex-1">
              <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-3">
                Build command
              </p>
              <div className="lab-code text-sm">
                python -m underwater_vla build --limit 200 --with-sonar
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-wrap gap-2">
              {pipelineStages.map((stage) => (
                <Badge
                  key={stage}
                  variant="outline"
                  className="font-mono text-[0.58rem] tracking-widest uppercase border-grv-b text-grv-fg3 h-auto py-1 px-2.5"
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
