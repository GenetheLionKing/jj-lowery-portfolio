import type { SanityPublicConfig } from "./config";
import { isPublicImageAssetRef } from "./urls";

/** Resolve already-public native assets without a token or a draft query. */
export function nativePostData(
  doc: Record<string, unknown>,
  config: SanityPublicConfig,
) {
  const image = (value: unknown) => {
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
  };
  return {
    ...doc,
    slug:
      typeof doc.slug === "object" && doc.slug
        ? (doc.slug as { current?: unknown }).current
        : doc.slug,
    mainImage: doc.mainImage ? image(doc.mainImage) : undefined,
    body: Array.isArray(doc.body)
      ? doc.body.map((block) =>
          block?._type === "image" ? image(block) : block,
        )
      : undefined,
    image: doc.kind === "article" ? doc.artwork : doc.image,
  };
}
