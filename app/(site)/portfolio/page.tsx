import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { getPublicContent } from "@/content/public";
import { portfolioItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected systems work on Vector and this site.",
};
export default async function PortfolioPage() {
  const { cases, articles } = await getPublicContent();
  const items = portfolioItems(cases, articles);
  return (
    <section className="portfolio-page" aria-labelledby="portfolio-title">
      <div className="container">
        <header className="page-intro">
          <h1 id="portfolio-title" className="page-title">
            portfolio
          </h1>
          <p>Selected systems work and this site.</p>
        </header>
        {items.length ? (
          <PortfolioGrid items={items} />
        ) : (
          <p className="catalog-empty">No published work yet.</p>
        )}
      </div>
    </section>
  );
}
