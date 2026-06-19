import type { BoundingBox } from "@/lib/demo";

export default function VideoOverlay({ boxes }: { boxes: BoundingBox[] }) {
  if (!boxes.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {boxes.map((box, index) => (
        <div
          key={`${box.label}-${index}`}
          className="absolute border-2 border-grv-aqua box-border"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.w * 100}%`,
            height: `${box.h * 100}%`,
          }}
        >
          <div className="absolute left-0 -top-5 bg-grv-aqua text-grv-hard text-[0.65rem] font-mono px-1.5 py-0.5 whitespace-nowrap">
            {box.label}
          </div>
        </div>
      ))}
    </div>
  );
}
