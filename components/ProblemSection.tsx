import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  {
    value: "0",
    label: "Public real-world VLA datasets",
    sub: "Terrestrial robotics has nuScenes, DROID, and more. Underwater has none.",
  },
  {
    value: "25 hrs",
    label: "Synthetic training data (USIM)",
    sub: "Useful for prototyping, but sim-to-real gaps remain large.",
  },
  {
    value: "$150K+",
    label: "Typical ROV inspection day rate",
    sub: "That makes real field data expensive to collect at scale.",
  },
  {
    value: "4",
    label: "Modalities we align per timestep",
    sub: "Video, sonar, IMU, and pilot control — timestamped together.",
  },
];

const datasetRows = [
  {
    name: "nuScenes / DROID",
    domain: "Terrestrial",
    modalities: "Vision, LiDAR, control",
    size: "Hundreds of hours",
    actions: true,
    limit: "No fluid dynamics",
  },
  {
    name: "USIM",
    domain: "Underwater",
    modalities: "Vision, control",
    size: "25 hrs · 905K frames",
    actions: true,
    limit: "Synthetic only",
  },
  {
    name: "SOVIS",
    domain: "Underwater",
    modalities: "Vision, sonar",
    size: "76K frames",
    actions: false,
    limit: "Perception only",
  },
  {
    name: "Aronnax (in progress)",
    domain: "Underwater",
    modalities: "Vision · sonar · IMU · control",
    size: "Pilot deployments",
    actions: true,
    limit: "Real ROV telemetry — pipeline live on USIM today",
    highlight: true,
  },
];

export default function ProblemSection() {
  return (
    <section id="platform" className="relative bg-grv-hard py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="anim-fade-up anim-d1 mb-7">
            <span className="section-label">02 · The gap</span>
          </div>

          <h2
            className="anim-fade-up anim-d2 font-display font-bold text-grv-fg leading-[1.1] mb-5"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)" }}
          >
            Underwater AI lacks{" "}
            <span className="text-grv-aqua">training data</span>
          </h2>

          <p className="anim-fade-up anim-d3 text-grv-fg2 text-base max-w-2xl mb-14 leading-relaxed">
            Underwater datasets are rare, grounded-only, and usually geo-referenced for mapping,
            not for policy training. That leaves marine autonomy mostly rule-based.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
            {stats.map((stat, i) => (
              <Card key={stat.value} className={`anim-fade-up anim-d${i + 2}`}>
                <CardHeader className="pb-2">
                  <div className="font-mono font-bold text-3xl text-grv-aqua mb-1">
                    {stat.value}
                  </div>
                  <CardTitle className="text-sm font-medium text-grv-fg leading-snug">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs text-grv-fg4 leading-relaxed">
                    {stat.sub}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="anim-fade-up anim-d4">
            <p className="font-mono text-[0.65rem] tracking-widest uppercase text-grv-fg4 mb-4">
              Underwater datasets today
            </p>
            <ScrollArea className="border border-grv-b">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-grv-b bg-grv-base hover:bg-grv-base">
                    {["Dataset", "Domain", "Modalities", "Size", "Actions", "Notes"].map((h) => (
                      <TableHead
                        key={h}
                        className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 h-10"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasetRows.map((row) => (
                    <TableRow
                      key={row.name}
                      className={`border-b border-grv-b transition-colors duration-150 ${
                        row.highlight ? "bg-grv-soft hover:bg-grv-soft" : "hover:bg-grv-base"
                      }`}
                    >
                      <TableCell className={`font-medium py-3.5 ${row.highlight ? "text-grv-aqua" : "text-grv-fg"}`}>
                        {row.name}
                      </TableCell>
                      <TableCell className="text-grv-fg2 py-3.5">{row.domain}</TableCell>
                      <TableCell className="text-grv-fg2 font-mono text-xs py-3.5">{row.modalities}</TableCell>
                      <TableCell className="text-grv-fg2 font-mono text-xs py-3.5">{row.size}</TableCell>
                      <TableCell className="py-3.5">
                        {row.actions ? (
                          <Badge variant="outline" className="border-grv-aqua text-grv-aqua font-mono text-xs">
                            ✓
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-grv-b text-grv-fg4 font-mono text-xs">
                            ✗
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className={`text-xs leading-relaxed py-3.5 ${row.highlight ? "text-grv-aqua2" : "text-grv-fg4"}`}>
                        {row.limit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
