import Link from "next/link";
import { COMPANY_NAME } from "@/lib/config";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-grv-hard text-grv-fg">
      <header className="border-b border-grv-b bg-grv-hard/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-display font-bold text-sm text-grv-fg hover:text-white transition-colors">
            ← {COMPANY_NAME}
          </Link>
          <span className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4">
            Pipeline demo · USIM
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
