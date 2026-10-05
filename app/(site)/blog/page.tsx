import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { IndexHero } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { blogItems } from "@/content/catalog";
import { BlogFeature } from "@/components/blog-feature";
export const metadata: Metadata = {
  title: "Blog",
  description: "Small observations about how systems should work.",
};
export default async function Page() {
  const content = await getPublicContent();
  const [featured, ...remaining] = blogItems(content.articles, content.cases);
  return (
    <>
      <IndexHero
        id="blog-title"
        title="blog"
        lead="Small observations about how systems should work."
      >
        {featured && <BlogFeature item={featured} />}
      </IndexHero>
      <section className="portfolio-page index-content" aria-label="Blog posts">
        <div className="container">
          {remaining.length ? (
            <PortfolioGrid items={remaining} />
          ) : !featured ? (
            <p className="catalog-empty">No published posts yet.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
