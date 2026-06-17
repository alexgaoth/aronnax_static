import { COMPANY_NAME } from "@/lib/config";

const footerLinks: Record<string, string[]> = {
  Research:   ["Overview", "Data Moat", "Methodology", "Annotation Pipeline"],
  Technology: ["VLA Model", "ACT Policy", "Sonar Fusion", "Hydrodynamics"],
  Markets:    ["Defense", "Offshore Wind", "Oil & Gas", "Oceanography"],
  Lab:        ["About", "Team", "StartBlue / UCSD", "Bow Capital"],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-grv-hard border-t border-grv-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="lg:grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 mb-10 lg:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-grv-aqua tracking-widest opacity-60">§</span>
              <span className="font-display font-bold text-base text-grv-fg tracking-tight">
                {COMPANY_NAME}
              </span>
            </div>
            <p className="text-grv-fg4 text-xs leading-relaxed max-w-[180px] font-mono">
              Marine autonomy foundation model. UCSD StartBlue · Bow Capital.
            </p>
            <div className="mt-5 flex gap-2">
              {["in", "𝕏"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={i === 0 ? "LinkedIn" : "Twitter / X"}
                  className="w-7 h-7 border border-grv-b flex items-center justify-center text-grv-fg4 hover:border-grv-aqua hover:text-grv-aqua transition-colors text-xs font-mono"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-grv-fg4 mb-4">
                {cat}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-grv-fg3 hover:text-grv-fg transition-colors duration-150">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lab-hr mb-5" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[0.62rem] text-grv-fg4">
          <p>© {year} {COMPANY_NAME}. La Jolla, CA.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-grv-aqua animate-glow-soft" />
            <span>Incubated at StartBlue × UC San Diego Scripps Institution of Oceanography</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
