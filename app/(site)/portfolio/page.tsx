import type { Metadata } from "next";
import { SelectedWorkGrid } from "@/components/selected-work-grid";
import { TopicFilters } from "@/components/publishing-catalog";
import { getPublicContent } from "@/content/public";
import { selectedCases } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected systems work on Vector and the design and development of JJ Lowery’s portfolio.",
};
export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { cases } = await getPublicContent();
  const { topic = "" } = await searchParams;
  const studies = selectedCases(cases);
  const topics = [...new Set(studies.flatMap((s) => s.tags))];
  const results = studies.filter((s) => !topic || s.tags.includes(topic));
  return (
    <section className="portfolio-page" aria-labelledby="portfolio-title">
      <div className="container">
        <header className="page-intro">
          <h1 id="portfolio-title" className="page-title">
            portfolio
          </h1>
          <p>Selected systems work and this site.</p>
        </header>
        <TopicFilters base="/portfolio/" topics={topics} selected={topic} />
        {results.length ? (
          <SelectedWorkGrid cases={results} headingLevel="h2" />
        ) : (
          <p className="catalog-empty">
            No published work in this selection. Choose another topic.
          </p>
        )}
      </div>
    </section>
  );
}
