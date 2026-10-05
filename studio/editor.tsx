"use client";
import { NextStudio } from "next-sanity/studio";
import { createStudioConfig } from "./config";
import type { SanityPublicConfig } from "../content/config";

export function PublishingStudio({ config }: { config: SanityPublicConfig }) {
  return <NextStudio config={createStudioConfig(config)} />;
}
