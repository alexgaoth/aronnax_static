"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPANY_NAME, DEMO_PATH } from "@/lib/config";

const navLinks = [
  { label: "Problem", href: "/#platform" },
  { label: "Approach", href: "/#approach" },
  { label: "Pipeline", href: "/#technology" },
  { label: "Demo", href: DEMO_PATH },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-grv-hard/95 backdrop-blur-sm border-b border-grv-b"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-14 lg:h-16">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label={COMPANY_NAME}>
          <span className="font-mono text-[10px] text-grv-aqua tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            §
          </span>
          <span className="font-display font-bold text-base tracking-tight text-grv-fg group-hover:text-white transition-colors">
            {COMPANY_NAME}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.7rem] tracking-widest uppercase text-grv-fg3 hover:text-grv-fg transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={DEMO_PATH}
            className="px-5 py-2 text-[0.65rem] font-mono font-bold tracking-[0.14em] uppercase bg-grv-aqua text-grv-hard hover:bg-grv-aqua2 transition-colors duration-200"
          >
            View Demo
          </Link>
          <Link
            href="/#contact"
            className="px-5 py-2 text-[0.65rem] font-mono font-bold tracking-[0.14em] uppercase border border-grv-b text-grv-fg2 hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-px bg-grv-fg3 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-5 h-px bg-grv-fg3 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-grv-fg3 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80" : "max-h-0"
        } bg-grv-base border-b border-grv-b`}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[0.7rem] tracking-widest uppercase text-grv-fg3 hover:text-grv-fg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={DEMO_PATH}
            onClick={() => setMenuOpen(false)}
            className="mt-1 px-5 py-2.5 text-[0.65rem] font-mono font-bold tracking-[0.14em] uppercase bg-grv-aqua text-grv-hard text-center hover:bg-grv-aqua2 transition-colors duration-200"
          >
            View Demo
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-2.5 text-[0.65rem] font-mono font-bold tracking-[0.14em] uppercase border border-grv-b text-grv-fg2 text-center hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
