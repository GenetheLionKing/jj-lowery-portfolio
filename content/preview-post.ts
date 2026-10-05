import type { SanityPublicConfig } from "./config";
import { articleSchema, caseSchema } from "./model";
import { nativePostData } from "./native-post";

/** Only Studio's authenticated document state supplies the input. No fetching. */
export function previewPost(
  doc: Record<string, unknown>,
  config: SanityPublicConfig,
  publishedUpdatedAt?: string,
) {
  const data = nativePostData(doc, config);
  return doc.kind === "caseStudy"
    ? caseSchema.parse({ ...data, updatedAt: publishedUpdatedAt })
    : articleSchema.parse({ ...data, updatedAt: publishedUpdatedAt });
}
