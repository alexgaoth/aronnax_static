"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_PIPELINE_PATH, DEMO_SLAM_PATH } from "@/lib/config";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "SLAM Replay",
    href: DEMO_SLAM_PATH,
    description: "Raw footage · SAM2 · ORB · 3D map",
  },
  {
    label: "Data Pipeline",
    href: DEMO_PIPELINE_PATH,
    description: "USIM · HuggingFace · VLA chunks",
  },
] as const;

export default function DemoNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-10"
      aria-label="Demo sections"
    >
      {tabs.map((tab) => {
        const active =
          pathname === tab.href ||
          pathname === tab.href.replace(/\/$/, "") ||
          (tab.href === DEMO_SLAM_PATH &&
            (pathname === "/demo" || pathname === "/demo/"));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "lab-card flex-1 px-4 py-3 transition-colors",
              active
                ? "border-grv-aqua bg-grv-soft"
                : "hover:border-grv-aqua/60 hover:bg-grv-soft/50",
            )}
          >
            <span
              className={cn(
                "font-mono text-[0.65rem] tracking-widest uppercase block mb-0.5",
                active ? "text-grv-aqua" : "text-grv-fg3",
              )}
            >
              {tab.label}
            </span>
            <span className="font-mono text-[0.58rem] text-grv-fg4 tracking-wide">
              {tab.description}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
