/** Existing public assets only. No private draft-media uploader in this milestone. */
export const publicMedia = {
  portrait: {
    src: "/images/profile-shoulder-640.webp",
    alt: "James “JJ” Lowery",
    width: 1640,
    height: 1294,
  },
  "vector-income": {
    src: "/images/work/vector-income.webp",
    alt: "Vector’s envelope-planning interface",
    width: 640,
    height: 480,
  },
  "vector-validation": {
    src: "/images/work/vector-validation.webp",
    alt: "Vector’s review and validation artwork",
    width: 640,
    height: 480,
  },
  portfolio: {
    src: "/images/work/portfolio.webp",
    alt: "The design of JJ Lowery’s portfolio",
    width: 640,
    height: 480,
  },
} as const;

export type PublicMediaKey = keyof typeof publicMedia;
export const mediaKeys = Object.keys(publicMedia) as PublicMediaKey[];

export const topicLabels: Record<string, string> = {
  "business-rules": "Business rules",
  workflows: "Workflows",
  performance: "Performance",
  validation: "Validation",
  building: "Building",
  design: "Design",
  operations: "Operations",
};
export function topicLabel(topic: string) {
  return topicLabels[topic] ?? topic.replaceAll("-", " ");
}

export function sizedPublicImage(src: string, width: number) {
  if (!src.startsWith("https://cdn.sanity.io/images/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");
  url.searchParams.set("auto", "format");
  return url.toString();
}
