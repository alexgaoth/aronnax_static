"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEMO_SLAM_PATH } from "@/lib/config";

export default function DemoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(DEMO_SLAM_PATH);
  }, [router]);

  return (
    <p className="font-mono text-[0.65rem] text-grv-fg4 tracking-wide">
      <span className="text-grv-aqua">$</span> opening SLAM replay…
    </p>
  );
}
