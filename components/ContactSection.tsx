import ScrollReveal from "@/components/ScrollReveal";
import { COMPANY_NAME } from "@/lib/config";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const audiences = [
  {
    id: "A",
    label: "Defense & UUV teams",
    desc: "Teams building attritable underwater platforms that need robust autonomy software.",
  },
  {
    id: "B",
    label: "Offshore operators",
    desc: "Inspection and IRM contractors looking to cut vessel days and pilot load.",
  },
  {
    id: "C",
    label: "ROV fleet partners",
    desc: "Operators who can host passive capture hardware during routine missions.",
  },
  {
    id: "D",
    label: "Research labs",
    desc: "Marine and oceanographic groups benchmarking underwater autonomy, not just mapping.",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-grv-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">07 · Contact</span>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">
            <div>
              <h2
                className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
              >
                Work with{" "}
                <span className="text-grv-aqua">{COMPANY_NAME}</span>
              </h2>
              <p className="anim-fade-up anim-d3 text-grv-fg2 text-base leading-relaxed mb-10">
                Built from the Bow Capital x UCSD StartBlue MVP blueprint. Open for
                pilot conversations and data access.
              </p>

              <div className="flex flex-col gap-2">
                {audiences.map((a, i) => (
                  <Card
                    key={a.id}
                    className={`anim-fade-up anim-d${i + 2}`}
                  >
                    <CardHeader className="pb-1">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-[0.62rem] text-grv-fg4 tracking-widest flex-shrink-0">
                          {a.id}
                        </span>
                        <CardTitle className="font-display font-semibold text-grv-fg text-sm">
                          {a.label}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-grv-fg3 text-xs leading-relaxed pl-7">{a.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="anim-fade-up anim-d3 mt-12 lg:mt-0">
              <div className="border border-grv-b bg-grv-hard p-8">
                <p className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 mb-5">
                  {COMPANY_NAME} · UCSD StartBlue
                </p>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full mb-4"
                  render={<a href="mailto:contact@aronnaxlab.ai" />}
                >
                  contact@aronnaxlab.ai
                </Button>

                <Separator className="my-6" />

                <div className="flex flex-col gap-2.5">
                  {[["Location", "La Jolla, CA"]].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[90px_1fr] gap-2 text-xs">
                      <span className="font-mono text-grv-fg4">{k}</span>
                      <span className="text-grv-fg2">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
