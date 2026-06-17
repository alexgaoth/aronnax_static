import type { ReactNode } from "react";

interface QuadrantProps {
  id: string;
  label: string;
  children: ReactNode;
}

// A single demo cell: a flat lab-card with a mono caption and a 16:9 stage.
export default function Quadrant({ id, label, children }: QuadrantProps) {
  return (
    <div className="lab-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-3 py-2 border-b border-grv-b bg-grv-base">
        <span className="font-mono text-[0.6rem] text-grv-fg4 tracking-widest">{id}</span>
        <span className="font-mono text-[0.6rem] tracking-[0.16em] uppercase text-grv-aqua">
          {label}
        </span>
      </div>
      <div className="relative w-full aspect-video bg-grv-hard">{children}</div>
    </div>
  );
}
