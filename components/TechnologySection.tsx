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
    body: "Exports smoothed future-action chunks as fixed [k, 6] tensors.",
    tags: ["ACT", "Chunking", "Imitation learning"],
    tooltips: {
      ACT: "Action Chunking with Transformers — predicts k future actions at once",
      Chunking: "Groups consecutive commands into fixed-length temporal windows",
      "Imitation learning": "Policy trained from expert pilot demonstrations",
    },
  },
  {
    id: "II",
    title: "Cross-modal roadmap",
    subtitle: "Sydney Harbour after the USIM spine",
    body: "Add paired optical and Oculus FLS sonar after the static USIM demo works.",
    tags: ["FLS sonar", "Zenodo", "Phase 4"],
    tooltips: {
      "FLS sonar": "Forward-Looking Sonar — acoustic imaging for low-visibility conditions",
      Zenodo: "Sydney Harbour sonar and optical dataset referenced in the MVP spec",
      "Phase 4": "Roadmap phase after the USIM dashboard is working",
    },
  },
  {
    id: "III",
    title: "Physics-derived labels",
    subtitle: "No human annotator for hydrodynamics",
    body: "Derives labels like fighting_current from command vs. IMU response.",
    tags: ["IMU", "Hydrodynamics", "Auto-label"],
    tooltips: {
      IMU: "Inertial Measurement Unit — acceleration and angular rate sensor",
      Hydrodynamics: "Fluid-body interaction modeled from RC_IN vs SCALED_IMU delta",
      "Auto-label": "fighting_current, station_keeping, etc. derived without annotation",
    },
  },
];

const pipelineStages = [
  "USIM spine",
  "Static dashboard",
  "Action chunks",
  "Sonar later",
];

const phaseNotes = [
  "No backend for v1",
  "JSON before Parquet",
  "Real logs are the product",
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative bg-grv-hard py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-4">
            <span className="section-label">04 · Pipeline</span>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between mb-6">
            <h2
              className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1]"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
            >
              Ingest → align → label →{" "}
              <span className="text-grv-aqua">export</span>
            </h2>
            <p className="anim-fade-up anim-d3 text-grv-fg3 text-sm max-w-xs mt-4 lg:mt-0 leading-relaxed">
              Raw ROV streams in. Model-ready chunks out.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                MVP scope from idea.md
              </p>
              <p className="text-sm leading-relaxed text-grv-fg2">
                Prove the tokenization path on public USIM data. Keep the dashboard static.
                Add real MAVLink and sonar only when the source traces exist.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
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
              <div className="flex flex-wrap gap-2">
                {phaseNotes.map((note) => (
                <Badge
                  key={note}
                  variant="outline"
                  className="font-mono text-[0.58rem] tracking-widest uppercase border-grv-aqua/40 text-grv-aqua h-auto py-1 px-2.5"
                >
                  {note}
                </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
