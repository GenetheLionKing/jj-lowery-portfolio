import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { IndexHero } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { blogItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Blog",
  description: "Small observations about how systems should work.",
};
export default async function Page() {
  const content = await getPublicContent();
  const items = blogItems(content.articles, content.cases);
  return (
    <>
      <IndexHero
        id="blog-title"
        title="blog"
        lead="Small observations about how systems should work."
      />
      <section className="portfolio-page index-content" aria-label="Blog posts">
        <div className="container">
          {items.length ? (
            <PortfolioGrid items={items} />
          ) : (
            <p className="catalog-empty">No published posts yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
