import type { Article, PublishingCase, Resource } from "./model";

export function contentHref(kind: "caseStudy" | "article", slug: string) {
  return `/${kind === "caseStudy" ? "work" : "blog"}/${slug}/`;
}
export type CatalogItem = {
  kind: "caseStudy" | "article";
  slug: string;
  title: string;
  summary: string;
  href: string;
  image?: Article["image"];
  mainImage?: Article["mainImage"];
  tags: string[];
  label: string;
  order?: number;
  publishedAt?: string;
};
function postItems(
  cases: PublishingCase[],
  articles: Article[],
): CatalogItem[] {
  return [
    ...cases.map((item) => ({
      kind: "caseStudy" as const,
      slug: item.slug,
      title: item.cardTitle,
      summary: item.cardSubtitle,
      href: contentHref("caseStudy", item.slug),
      image: item.thumbnail,
      mainImage: item.mainImage,
      tags: item.tags,
      label: "Case study",
      order: item.order,
    })),
    ...articles.map((item) => ({
      kind: "article" as const,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      href: contentHref("article", item.slug),
      image: item.image,
      mainImage: item.mainImage,
      tags: item.tags,
      label: item.format === "guide" ? "Guide" : "Article",
      order: item.order,
      publishedAt: item.publishedAt,
    })),
  ];
}
function placement(cases: PublishingCase[], articles: Article[], tag: string) {
  return postItems(cases, articles)
    .filter((item) => item.tags.includes(tag))
    .sort((a, b) => {
      const order = (a.order ?? Infinity) - (b.order ?? Infinity);
      if (order && !Number.isNaN(order)) return order;
      const date =
        (b.publishedAt ? Date.parse(b.publishedAt) : -Infinity) -
        (a.publishedAt ? Date.parse(a.publishedAt) : -Infinity);
      if (date && !Number.isNaN(date)) return date;
      return a.slug.localeCompare(b.slug);
    });
}
export function homeItems(cases: PublishingCase[], articles: Article[]) {
  return placement(cases, articles, "home");
}
export function selectedCases(cases: PublishingCase[]) {
  return cases.filter((item) => item.tags.includes("home"));
}
export function portfolioItems(cases: PublishingCase[], articles: Article[]) {
  return placement(cases, articles, "portfolio");
}
export function learnItems(
  cases: PublishingCase[],
  articles: Article[],
  _resources: Resource[] = [],
) {
  // Resource records remain editable, but cannot bypass explicit Post placement.
  void _resources;
  return placement(cases, articles, "learn");
}
export function blogItems(articles: Article[], cases: PublishingCase[] = []) {
  return placement(cases, articles, "blog");
}
export function aboutGallery(
  articles: Article[],
  cases: PublishingCase[] = [],
) {
  return placement(cases, articles, "about-gallery")
    .filter((item) => item.mainImage)
    .map((item) => ({
      href: item.href,
      title: item.title,
      image: item.mainImage!,
    }));
}
