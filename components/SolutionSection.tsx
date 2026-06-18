import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { DEMO_PATH } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: "01",
    title: "Passive capture",
    body: "A hardware tap on the ROV topside Ethernet bridge records MAVLink traffic — video, sonar, joystick input, IMU, depth, and pressure — without modifying the vehicle or interrupting the pilot.",
    tags: ["MAVLink", "ArduSub", "Fathom-X"],
  },
  {
    id: "02",
    title: "Align and normalize",
    body: "Streams are timestamped and normalized into uniform rows. PWM commands are scaled to a fixed contract so training code sees consistent action vectors across vehicles.",
    tags: ["Sync", "Normalize", "Parquet"],
  },
  {
    id: "03",
    title: "Auto-label and chunk",
    body: "Physics-derived labels (e.g. fighting_current when thrust does not match IMU response) and ACT-style action chunks produce export-ready JSON and Parquet for model training.",
    tags: ["Hydrodynamics", "ACT", "Export"],
  },
];

export default function SolutionSection() {
  return (
    <section id="approach" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">03 · Approach</span>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">
            <div>
              <h2
                className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
              >
                Capture what pilots{" "}
                <span className="text-grv-aqua">already do</span>
              </h2>

              <p className="anim-fade-up anim-d3 text-grv-fg2 text-base leading-relaxed mb-6">
                We record telemetry from commercial ROV missions — inspections, surveys,
                and maintenance — and turn it into training-ready chunks through one pipeline.
              </p>
              <p className="anim-fade-up anim-d4 text-grv-fg2 text-base leading-relaxed mb-8">
                Live today on USIM. Designed to run unchanged when real ROV traces arrive.
              </p>

              <Button
                variant="default"
                size="lg"
                className="anim-fade-up anim-d5"
                render={<Link href={DEMO_PATH} />}
              >
                View SLAM replay
              </Button>
            </div>

            <div className="mt-12 lg:mt-0 flex flex-col gap-3">
              {steps.map((step, i) => (
                <Card key={step.id} className={`anim-fade-up anim-d${i + 2}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[0.65rem] tracking-widest text-grv-fg4 flex-shrink-0">
                        {step.id}
                      </span>
                      <CardTitle className="font-display font-semibold text-grv-fg text-base">
                        {step.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-grv-fg2 text-sm leading-relaxed">{step.body}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="font-mono text-[0.58rem] tracking-widest uppercase border-grv-b text-grv-fg4 h-auto py-0.5 px-2"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
