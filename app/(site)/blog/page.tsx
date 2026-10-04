import type { Metadata } from "next";
import {
  CatalogGrid,
  PreviewWritingNote,
  TopicFilters,
} from "@/components/publishing-catalog";
import { getPublicContent } from "@/content/public";
import { learnItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Writing",
  description:
    "JJ Lowery’s articles on systems, business rules, practical building and validation.",
};
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const content = await getPublicContent();
  const { topic = "" } = await searchParams;
  const items = learnItems(
    [],
    content.articles.map((item) => ({ ...item, learn: true })),
    [],
  );
  const topics = [...new Set(items.flatMap((item) => item.tags))];
  const results = items.filter((item) => !topic || item.tags.includes(topic));
  return (
    <section className="catalog-page" aria-labelledby="blog-title">
      <div className="container">
        <header className="page-intro">
          <h1 className="page-title" id="blog-title">
            writing
          </h1>
          <p>Small observations about how systems should work.</p>
        </header>
        {content.mode === "seed" && <PreviewWritingNote />}
        <TopicFilters base="/blog/" topics={topics} selected={topic} />
        {results.length ? (
          <CatalogGrid items={results} />
        ) : (
          <p className="catalog-empty">
            No published articles in this selection.
          </p>
        )}
      </div>
    </section>
  );
}
