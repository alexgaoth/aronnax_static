import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoNav from "@/components/demo/DemoNav";
import { COMPANY_NAME } from "@/lib/config";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-grv-hard pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-8">
            <Link
              href="/"
              className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4 hover:text-grv-aqua transition-colors"
            >
              ← {COMPANY_NAME}
            </Link>
          </div>

          <div className="mb-6">
            <span className="section-label">Demo</span>
          </div>

          <h1
            className="font-display font-bold text-grv-fg leading-[1.1] mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Interactive{" "}
            <span className="text-grv-aqua">replays</span>
          </h1>
          <p className="text-grv-fg3 text-sm max-w-xl mb-8 leading-relaxed">
            SLAM overlays on real footage, or the USIM VLA data pipeline from
            HuggingFace — pick a view below.
          </p>

          <DemoNav />
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
