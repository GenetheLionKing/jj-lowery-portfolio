import type { Metadata } from "next";
import Link from "next/link";
import {
  CatalogGrid,
  PreviewWritingNote,
  TopicFilters,
} from "@/components/publishing-catalog";
import { getPublicContent } from "@/content/public";
import { learnItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Learn",
  description:
    "Articles, systems case studies and useful resources on business rules, workflows, building and validation.",
};
export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; kind?: string }>;
}) {
  const content = await getPublicContent();
  const { topic = "", kind = "" } = await searchParams;
  const items = learnItems(content.cases, content.articles, content.resources);
  const topics = [...new Set(items.flatMap((item) => item.tags))];
  const results = items.filter(
    (item) =>
      (!topic || item.tags.includes(topic)) && (!kind || item.kind === kind),
  );
  return (
    <section className="catalog-page" aria-labelledby="learn-title">
      <div className="container">
        <header className="page-intro">
          <h1 className="page-title" id="learn-title">
            learn
          </h1>
          <p>Notes, examples and useful references.</p>
          <Link className="text-link page-link" prefetch={false} href="/blog/">
            All writing →
          </Link>
        </header>
        {content.mode === "seed" && <PreviewWritingNote />}
        <TopicFilters
          base="/learn/"
          topics={topics}
          selected={topic}
          kind={kind}
          kinds
        />
        {results.length ? (
          kind ? (
            <CatalogGrid items={results} />
          ) : (
            <>
              {(
                [
                  ["article", "Writing"],
                  ["caseStudy", "From the work"],
                  ["resource", "Useful references"],
                ] as const
              ).map(([type, title]) => {
                const group = results.filter((item) => item.kind === type);
                return group.length ? (
                  <section
                    className={`catalog-group catalog-group-${type}`}
                    key={type}
                    aria-labelledby={`learn-${type}`}
                  >
                    <h2 id={`learn-${type}`} className="catalog-group-title">
                      {title}
                    </h2>
                    <CatalogGrid items={group} headingLevel="h3" />
                  </section>
                ) : null;
              })}
            </>
          )
        ) : (
          <p className="catalog-empty">
            No published items in this selection. Choose another topic or type.
          </p>
        )}
      </div>
    </section>
  );
}
