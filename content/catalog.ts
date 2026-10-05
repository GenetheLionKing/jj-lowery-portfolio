import type { Article, PublishingCase, Resource } from "./model";

export function selectedCases(cases: PublishingCase[]) {
  return cases.filter((item) => item.tags.includes("home"));
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
  mainImage?: Article["mainImage"];
  tags: string[];
  label: string;
  publishedAt?: string;
};
export function learnItems(
  cases: PublishingCase[],
  articles: Article[],
  resources: Resource[],
): CatalogItem[] {
  return [
    ...articles
      .filter((item) => item.tags.includes("learn"))
      .map((item) => ({
        kind: "article" as const,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        href: contentHref("article", item.slug),
        image: item.image,
        mainImage: item.mainImage,
        tags: item.tags,
        label: item.format === "guide" ? "Guide" : "Article",
      })),
    ...cases
      .filter((item) => item.tags.includes("learn"))
      .map((item) => ({
        kind: "caseStudy" as const,
        slug: item.slug,
        title: item.cardTitle,
        summary: item.summary,
        href: contentHref("caseStudy", item.slug),
        image: item.thumbnail,
        mainImage: item.mainImage,
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

export function portfolioItems(
  cases: PublishingCase[],
  articles: Article[],
): CatalogItem[] {
  return [
    ...cases
      .filter((item) => item.tags.includes("portfolio"))
      .map((item) => ({
        kind: "caseStudy" as const,
        slug: item.slug,
        title: item.cardTitle,
        summary: item.cardSubtitle,
        href: contentHref("caseStudy", item.slug),
        image: item.thumbnail,
        mainImage: item.mainImage,
        tags: item.tags,
        label: "Case study",
      })),
    ...articles
      .filter((item) => item.tags.includes("portfolio"))
      .map((item) => ({
        kind: "article" as const,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        href: contentHref("article", item.slug),
        image: item.image,
        mainImage: item.mainImage,
        tags: item.tags,
        label: item.format === "guide" ? "Guide" : "Article",
      })),
  ];
}
export function aboutGallery(
  articles: Article[],
  cases: PublishingCase[] = [],
) {
  return [
    ...articles.map((item) => ({ ...item, kind: "article" as const })),
    ...cases.map((item) => ({ ...item, kind: "caseStudy" as const })),
  ]
    .filter((item) => item.tags.includes("about-gallery") && item.mainImage)
    .map((item) => ({
      href: contentHref(item.kind, item.slug),
      title: item.title,
      image: item.mainImage!,
    }));
}

export function blogItems(articles: Article[]): CatalogItem[] {
  return [...articles]
    .sort((a, b) => {
      const date =
        (b.publishedAt ? Date.parse(b.publishedAt) : -Infinity) -
        (a.publishedAt ? Date.parse(a.publishedAt) : -Infinity);
      if (date && !Number.isNaN(date)) return date;
      const order = (a.order ?? Infinity) - (b.order ?? Infinity);
      if (order && !Number.isNaN(order)) return order;
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    })
    .map((item) => ({
      kind: "article" as const,
      publishedAt: item.publishedAt,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      href: contentHref("article", item.slug),
      image: item.image,
      mainImage: item.mainImage,
      tags: item.tags,
      label: item.format === "guide" ? "Guide" : "Article",
    }));
}
