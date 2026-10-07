import type { SanityPublicConfig } from "./config";
import { nativeImageData, nativeRichTextData } from "./native-media";

/** Keep absent sections absent and an explicitly empty list empty. */
export function nativeAboutData(
  doc: Record<string, unknown>,
  config: SanityPublicConfig,
) {
  const data = { ...doc };
  if (doc.sections == null) {
    delete data.sections;
  } else if (Array.isArray(doc.sections)) {
    data.sections = doc.sections.map((section: unknown) => {
      if (!section || typeof section !== "object") return section;
      const item = section as Record<string, unknown>;
      return {
        ...item,
        image: nativeImageData(item.image, config),
        ...(item.body !== undefined
          ? { body: nativeRichTextData(item.body, config) }
          : {}),
        ...(item.leftBody !== undefined
          ? { leftBody: nativeRichTextData(item.leftBody, config) }
          : {}),
        ...(item.rightBody !== undefined
          ? { rightBody: nativeRichTextData(item.rightBody, config) }
          : {}),
      };
    });
  }
  return data;
}
