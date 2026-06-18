import { readFile } from "node:fs/promises";
import path from "node:path";

import Viewer, { type AnnotationMap, type UsimClip } from "./viewer";

export const metadata = {
  title: "Dataset Explorer",
  description: "Interactive preview of the underwater VLA annotation pipeline on USIM simulation data.",
};

export default async function DemoPage() {
  const demoDir = path.join(process.cwd(), "public", "demo");
  const [clipsRaw, annotationsRaw] = await Promise.all([
    readFile(path.join(demoDir, "usim_clips.json"), "utf8"),
    readFile(path.join(demoDir, "annotations.json"), "utf8"),
  ]);

  const clips = JSON.parse(clipsRaw) as UsimClip[];
  const annotations = JSON.parse(annotationsRaw) as AnnotationMap;

  return <Viewer initialClips={clips} annotations={annotations} />;
}
