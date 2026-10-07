import type { SanityPublicConfig } from "./config";
import { isPublicImageAssetRef } from "./urls";

/** Resolve a native public image locally; no requests, tokens or draft reads. */
export function nativeImageData(value: unknown, config: SanityPublicConfig) {
  if (!value || typeof value !== "object") return value;
  const data = value as Record<string, unknown>;
  if (data.src) return data;
  const ref = (data.asset as { _ref?: unknown } | undefined)?._ref;
  if (!isPublicImageAssetRef(ref))
    throw new Error("Images require JPG, PNG or WebP up to 20000px");
  const [, hash, width, height, extension] =
    /^image-([a-zA-Z0-9]+)-([0-9]+)x([0-9]+)-(jpg|png|webp)$/.exec(
      String(ref),
    )!;
  return {
    ...data,
    src: `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${hash}-${width}x${height}.${extension}`,
    width: Number(width),
    height: Number(height),
  };
}

export function nativeRichTextData(value: unknown, config: SanityPublicConfig) {
  return Array.isArray(value)
    ? value.map((block) =>
        block?._type === "image" ? nativeImageData(block, config) : block,
      )
    : value;
}
