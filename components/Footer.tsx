import { COMPANY_TAGLINE, COMPANY_NAME, DEMO_PATH } from "@/lib/config";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "The gap", href: "#platform" },
  { label: "Approach", href: "#approach" },
  { label: "Pipeline", href: "#technology" },
  { label: "Demo", href: DEMO_PATH },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-grv-hard border-t border-grv-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-grv-aqua tracking-widest opacity-60">
                §
              </span>
              <span className="font-display font-bold text-base text-grv-fg tracking-tight">
                {COMPANY_NAME}
              </span>
            </div>
            <p className="text-grv-fg4 text-xs leading-relaxed max-w-xs">
              {COMPANY_TAGLINE}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[0.65rem] tracking-widest uppercase text-grv-fg3 hover:text-grv-fg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <Separator className="mb-5" />
        <p className="font-mono text-[0.62rem] text-grv-fg4">
          © {year} {COMPANY_NAME}.
        </p>
      </div>
    </footer>
  );
}
