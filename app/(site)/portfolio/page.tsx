import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { IndexHero } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { portfolioItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected systems work on Vector and this site.",
};
export default async function Page() {
  const content = await getPublicContent();
  const items = portfolioItems(content.cases, content.articles);
  return (
    <>
      <IndexHero
        id="portfolio-title"
        title="portfolio"
        lead="Selected systems work on Vector and this site."
      />
      <section
        className="portfolio-page index-content"
        aria-label="Portfolio posts"
      >
        <div className="container">
          {items.length ? (
            <PortfolioGrid items={items} />
          ) : (
            <p className="catalog-empty">No published work yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
