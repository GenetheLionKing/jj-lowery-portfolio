import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
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
    <div className="blog-index">
      <section className="blog-latest" aria-labelledby="blog-title">
        <h1 id="blog-title">blog</h1>
        {featured && <BlogFeature item={featured} />}
        {!featured && <p className="catalog-empty">No published posts yet.</p>}
      </section>
      {remaining.length > 0 && (
        <section className="blog-archive" aria-labelledby="blog-archive-title">
          <h2 id="blog-archive-title">More posts</h2>
          <PortfolioGrid
            items={remaining}
            headingLevel="h3"
            imageFrame="blog"
          />
        </section>
      )}
    </div>
  );
}
