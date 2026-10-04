"use client";
import dynamic from "next/dynamic";
import type { SanityPublicConfig } from "../content/config";
const PublishingStudio = dynamic(
  () => import("./editor").then((module) => module.PublishingStudio),
  { ssr: false },
);
export function StudioLoader({ config }: { config: SanityPublicConfig }) {
  return <PublishingStudio config={config} />;
}
