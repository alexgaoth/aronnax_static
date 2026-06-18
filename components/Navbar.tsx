"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { COMPANY_NAME, DEMO_PATH } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Problem", href: "/#platform" },
  { label: "Approach", href: "/#approach" },
  { label: "Pipeline", href: "/#technology" },
  { label: "Demo", href: DEMO_PATH },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-grv-hard/95 backdrop-blur-sm border-b border-grv-b"
          : "bg-transparent"
      )}
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

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            render={<Link href={DEMO_PATH} />}
          >
            View Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/#contact" />}
          >
            Contact
          </Button>
        </div>

        {/* Mobile nav — Sheet slide-in */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-grv-fg3 hover:text-grv-fg hover:bg-grv-soft"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-72 border-l border-grv-b bg-grv-base p-0"
            showCloseButton={false}
          >
            <SheetHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2 font-display font-bold text-grv-fg text-base">
                  <span className="font-mono text-[10px] text-grv-aqua tracking-widest opacity-60">§</span>
                  {COMPANY_NAME}
                </SheetTitle>
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-grv-fg3 hover:text-grv-fg hover:bg-grv-soft"
                    />
                  }
                >
                  <span aria-hidden>✕</span>
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
            </SheetHeader>

            <Separator />

            <nav className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="font-mono text-[0.7rem] tracking-widest uppercase text-grv-fg3 hover:text-grv-fg transition-colors py-2.5 border-b border-grv-b/40 last:border-0"
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>

            <div className="px-6 py-4 flex flex-col gap-2 mt-auto border-t border-grv-b">
              <Button
                variant="default"
                className="w-full"
                render={<Link href={DEMO_PATH} />}
              >
                View Demo
              </Button>
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/#contact" />}
              >
                Contact
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
