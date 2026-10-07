import type { SanityPublicConfig } from "./config";
import { nativeImageData, nativeRichTextData } from "./native-media";

/** Resolve already-public native assets without a token or a draft query. */
export function nativePostData(
  doc: Record<string, unknown>,
  config: SanityPublicConfig,
) {
  return {
    ...doc,
    slug:
      typeof doc.slug === "object" && doc.slug
        ? (doc.slug as { current?: unknown }).current
        : doc.slug,
    mainImage: doc.mainImage
      ? nativeImageData(doc.mainImage, config)
      : undefined,
    body: nativeRichTextData(doc.body, config),
    image: doc.kind === "article" ? doc.artwork : doc.image,
  };
}
