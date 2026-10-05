import type { Article, PublishingCase, RichText } from "./model";
import { publicMedia } from "./media";

export type ReadingArticle = {
  title: string;
  subtitle: string;
  body: RichText;
  image?: Article["mainImage"];
  publishedAt?: string;
  updatedAt?: string;
};
export type RecentArticle = { title: string; href: string };

/** Read-time adapter. It never mutates the archived CMS source. */
export function legacyArticleBody(study: PublishingCase): RichText {
  const body: RichText = [];
  let index = 0;
  const prose = (
    text: string,
    style: "normal" | "h2" | "h3" | "blockquote" = "normal",
    listItem?: "bullet" | "number",
  ) => {
    const key = `legacy-${index++}`;
    body.push({
      _type: "block",
      _key: key,
      style,
      ...(listItem ? { listItem, level: 1 } : {}),
      children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
      markDefs: [],
    });
  };
  // These qualifications previously lived only in the removed template chrome.
  if (study.company === "Vector")
    prose("My personal-finance app, developed with AI assistance.");
  for (const fact of study.metadata) {
    if (/conceptual|synthetic|benchmark|assistance/i.test(fact.value))
      prose(`${fact.label}: ${fact.value}`);
  }
  for (const section of study.sections) {
    prose(section.title, "h2");
    if (section.lead) prose(section.lead);
    for (const block of section.blocks) {
      switch (block.type) {
        case "text":
          block.paragraphs.forEach((text) => prose(text));
          break;
        case "list":
          block.items.forEach((text) => prose(text, "normal", "bullet"));
          break;
        case "principle":
          if (block.label) prose(block.label, "h3");
          prose(block.text, "blockquote");
          break;
        case "flow":
          block.steps.forEach((step) =>
            prose(
              step.description
                ? `${step.title}: ${step.description}`
                : step.title,
              "normal",
              "number",
            ),
          );
          break;
        case "comparison":
          for (const side of [block.before, block.after]) {
            prose(side.title, "h3");
            side.items.forEach((text) => prose(text, "normal", "bullet"));
          }
          break;
        case "facts":
          block.items.forEach((item) =>
            prose(`${item.label}: ${item.value}`, "normal", "bullet"),
          );
          break;
        case "rules":
          block.items.forEach((item) =>
            prose(`${item.when} → ${item.then}`, "normal", "bullet"),
          );
          break;
        case "formulas":
          block.items.forEach((item) => {
            prose(item.label, "h3");
            prose(item.formula);
          });
          prose(block.note);
          break;
        case "diagram":
          body.push({
            _type: "systemDiagram",
            _key: `legacy-${index++}`,
            kind: block.kind,
          });
          break;
      }
    }
  }
  return body;
}

export function caseArticle(study: PublishingCase): ReadingArticle {
  return {
    title: study.title,
    subtitle: study.subtitle,
    body: study.body ?? legacyArticleBody(study),
    image:
      study.mainImage ??
      (study.thumbnail && study.thumbnail !== "vector-validation"
        ? publicMedia[study.thumbnail]
        : study.image
          ? { ...study.image, width: 640, height: 480 }
          : undefined),
    publishedAt: study.publishedAt,
    updatedAt: study.updatedAt,
  };
}
export function postArticle(article: Article): ReadingArticle {
  return {
    ...article,
    subtitle: article.summary,
    image:
      article.mainImage ??
      (article.image ? publicMedia[article.image] : undefined),
  };
}
export function recentArticles(
  cases: PublishingCase[],
  articles: Article[],
  currentHref: string,
): RecentArticle[] {
  const selected = (tags: string[]) =>
    tags.some((tag) => ["home", "portfolio", "learn", "blog"].includes(tag));
  return [
    ...cases
      .filter((item) => selected(item.tags))
      .map((item) => ({
        title: item.title,
        href: `/work/${item.slug}/`,
        date: item.publishedAt ?? item.updatedAt,
        order: item.order,
      })),
    ...articles
      .filter((item) => item.destination === "article" && selected(item.tags))
      .map((item) => ({
        title: item.title,
        href: `/blog/${item.slug}/`,
        date: item.publishedAt ?? item.updatedAt,
        order: item.order,
      })),
  ]
    .filter((item) => item.href !== currentHref)
    .sort((a, b) => {
      const date =
        (b.date ? Date.parse(b.date) : -Infinity) -
        (a.date ? Date.parse(a.date) : -Infinity);
      if (date && !Number.isNaN(date)) return date;
      const order = (a.order ?? Infinity) - (b.order ?? Infinity);
      return order && !Number.isNaN(order)
        ? order
        : a.href.localeCompare(b.href);
    })
    .slice(0, 5)
    .map(({ title, href }) => ({ title, href }));
}
