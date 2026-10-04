import {
  aboutSchema,
  articleSchema,
  caseSchema,
  resourceSchema,
  resumeSchema,
  type PublicContent,
} from "./model";
import type { SanityPublicConfig } from "./config";

export const publishedQuery =
  '*[_type in ["about", "resume", "caseStudy", "article", "resource"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(order asc, publishedAt desc, _id asc)';

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
    const data = {
      ...doc,
      slug:
        typeof doc.slug === "object" && doc.slug
          ? (doc.slug as Record<string, unknown>).current
          : doc.slug,
    };
    if (doc._type === "about" && doc._id === "about")
      content.about = aboutSchema.parse(data);
    if (doc._type === "resume" && doc._id === "resume")
      content.resume = resumeSchema.parse(data);
    if (doc._type === "caseStudy") {
      const study = caseSchema.parse({
        ...data,
        slug: permanentCaseSlugs[doc._id] ?? data.slug,
      });
      if (seen.has(`case:${study.slug}`))
        throw new Error("Duplicate published case URL");
      seen.add(`case:${study.slug}`);
      content.cases.push(study);
    }
    if (doc._type === "article") {
      const article = articleSchema.parse(data);
      if (seen.has(`article:${article.slug}`))
        throw new Error("Duplicate published article URL");
      seen.add(`article:${article.slug}`);
      content.articles.push(article);
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
