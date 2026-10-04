import type { Article, PublishingCase, Resource } from "./model";

export function selectedCases(cases: PublishingCase[]) {
  return cases.filter((item) => item.featured);
}
export function contentHref(kind: "caseStudy" | "article", slug: string) {
  return `/${kind === "caseStudy" ? "work" : "blog"}/${slug}/`;
}
export type CatalogItem = {
  kind: "caseStudy" | "article" | "resource";
  slug: string;
  title: string;
  summary: string;
  href: string;
  image?: Article["image"];
  tags: string[];
  label: string;
};
export function learnItems(
  cases: PublishingCase[],
  articles: Article[],
  resources: Resource[],
): CatalogItem[] {
  return [
    ...articles
      .filter((item) => item.learn)
      .map((item) => ({
        kind: "article" as const,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        href: contentHref("article", item.slug),
        image: item.image,
        tags: item.tags,
        label: item.format === "guide" ? "Guide" : "Article",
      })),
    ...cases
      .filter((item) => item.learn)
      .map((item) => ({
        kind: "caseStudy" as const,
        slug: item.slug,
        title: item.cardTitle,
        summary: item.summary,
        href: contentHref("caseStudy", item.slug),
        image: item.thumbnail,
        tags: item.tags,
        label: "Case study",
      })),
    ...resources.map((item) => ({
      kind: "resource" as const,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      href: item.url,
      tags: item.tags,
      label: "Resource",
    })),
  ];
}
