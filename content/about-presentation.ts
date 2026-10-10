export const textAlignments = ["left", "center", "right"] as const;
export type TextAlignment = (typeof textAlignments)[number];
export type AboutBlockAlignment = {
  _type: "aboutTextAlignment";
  _key: string;
  alignment: TextAlignment;
};

export function blockAlignment(value: unknown, key: string): TextAlignment {
  if (!Array.isArray(value)) return "left";
  const match = value.find((item) => item && item._key === key);
  return isTextAlignment(match?.alignment) ? match.alignment : "left";
}

/** Only authored, supported values can become a text-align style. */
export function alignmentStyle(
  value: unknown,
): { textAlign: "center" | "right" } | undefined {
  return value === "center" || value === "right"
    ? { textAlign: value }
    : undefined;
}

export function isTextAlignment(value: unknown): value is TextAlignment {
  return value === "left" || value === "center" || value === "right";
}

export const aboutImageWidthBounds = { min: 160, max: 800 } as const;
export const aboutCarouselImageLimit = 18;
