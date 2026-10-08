import {
  aboutSchema,
  articleSchema,
  caseSchema,
  resourceSchema,
  resumeSchema,
  type PublicContent,
} from "./model";
import type { SanityPublicConfig } from "./config";

const imageProjection = `"src": asset->url, "alt": alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height`;
const bodyProjection = `[]{..., _type == "image" => {${imageProjection}, "caption": caption}}`;
export const publishedQuery = `*[_type in ["about", "resume", "post", "resource"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(order asc, publishedAt desc, _id asc){...,
    "mainImage": select(defined(mainImage.asset) => {"src": mainImage.asset->url, "alt": mainImage.alt, "width": mainImage.asset->metadata.dimensions.width, "height": mainImage.asset->metadata.dimensions.height}, defined(mainImage.src) => mainImage),
    "body": body${bodyProjection},
    _type == "about" && defined(gallery) => {"gallery": gallery[]{..., defined(asset) => {${imageProjection}}}},
    _type == "about" && defined(sections) => {"sections": sections[]{...,
      "image": select(defined(image.asset) => image{${imageProjection}}, defined(image.src) => image),
      "body": body${bodyProjection}, "leftBody": leftBody${bodyProjection}, "rightBody": rightBody${bodyProjection}
    }}
  }`;

const permanentCaseSlugs: Record<string, string> = {
  "case-vector-income-architecture": "vector-income-architecture",
  "case-vector-performance-investigation": "vector-performance-investigation",
  "case-portfolio-design": "portfolio-design",
  "case-bgm-budget-pacing": "bgm-budget-pacing",
};

/** Fail closed: malformed published records are an error, never repository fallback. */
export function decodePublishedContent(input: unknown): PublicContent {
  if (!Array.isArray(input))
    throw new Error("Invalid published content response");
  const content: PublicContent = {
    mode: "sanity",
    about: null,
    resume: null,
    cases: [],
    articles: [],
    resources: [],
  };
  const seen = new Set<string>();
  for (const value of input) {
    if (!value || typeof value !== "object")
      throw new Error("Invalid published record");
    const doc = value as Record<string, unknown>;
    if (typeof doc._id !== "string" || doc._id.includes(".")) continue;
    const data: Record<string, unknown> = {
      ...doc,
      ...(typeof doc._updatedAt === "string"
        ? { updatedAt: doc._updatedAt }
        : {}),
      slug:
        typeof doc.slug === "object" && doc.slug
          ? (doc.slug as Record<string, unknown>).current
          : doc.slug,
    };
    if (data.mainImage == null) delete data.mainImage;
    if (data.body == null) delete data.body;
    if (doc._type === "about" && data.sections == null) delete data.sections;
    if (doc._type === "about" && data.gallery == null) delete data.gallery;
    if (
      doc._type === "post" &&
      doc.kind !== "article" &&
      doc.kind !== "caseStudy"
    )
      throw new Error("Invalid published post layout");
    if (doc._type === "about" && doc._id === "about")
      content.about = aboutSchema.parse(data);
    if (doc._type === "resume" && doc._id === "resume")
      content.resume = resumeSchema.parse(data);
    if (
      doc._type === "caseStudy" ||
      (doc._type === "post" && doc.kind === "caseStudy")
    ) {
      const study = caseSchema.parse({
        ...data,
        slug: permanentCaseSlugs[doc._id] ?? data.slug,
      });
      if (seen.has(`case:${study.slug}`))
        throw new Error("Duplicate published case URL");
      seen.add(`case:${study.slug}`);
      if (doc._type === "post") content.cases.push(study);
    }
    if (
      doc._type === "article" ||
      (doc._type === "post" && doc.kind === "article")
    ) {
      const article = articleSchema.parse({
        ...data,
        image: data.artwork ?? data.image,
      });
      if (seen.has(`article:${article.slug}`))
        throw new Error("Duplicate published article URL");
      seen.add(`article:${article.slug}`);
      if (doc._type === "post") content.articles.push(article);
    }
    if (doc._type === "resource")
      content.resources.push(resourceSchema.parse(data));
  }
  return content;
}

export async function readPublishedContent(
  config: SanityPublicConfig,
  transport: typeof fetch = fetch,
): Promise<PublicContent> {
  const url = new URL(
    `https://${config.projectId}.api.sanity.io/v2026-10-01/data/query/${config.dataset}`,
  );
  url.searchParams.set("query", publishedQuery);
  url.searchParams.set("perspective", "published");
  const response = await transport(url, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Published content is unavailable");
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("result" in payload))
    throw new Error("Invalid published content response");
  return decodePublishedContent(payload.result);
}
