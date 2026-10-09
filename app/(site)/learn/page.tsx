import { AppPageAnalytics } from "@/components/app-analytics";
import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { IndexHero } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { learnItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Learn",
  description: "Notes and examples for understanding systems.",
};
export default async function Page() {
  const content = await getPublicContent();
  const items = learnItems(content.cases, content.articles);
  return (
    <>
      <AppPageAnalytics path="/learn/" />
      <IndexHero
        id="learn-title"
        title="learn"
        lead="Notes and examples for understanding systems."
      />
      <section
        className="portfolio-page index-content"
        aria-label="Learn posts"
      >
        <div className="container">
          {items.length ? (
            <PortfolioGrid items={items} />
          ) : (
            <p className="catalog-empty">No published items yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
