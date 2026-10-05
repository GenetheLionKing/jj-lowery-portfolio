import type { Metadata } from "next";
import {
  CatalogGrid,
  PreviewWritingNote,
} from "@/components/publishing-catalog";
import { BlogFeature } from "@/components/blog-feature";
import { IndexHero, LearningArt } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { blogItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "JJ Lowery’s articles on systems, business rules, practical building and validation.",
};
export default async function BlogPage() {
  const content = await getPublicContent();
  const [featured, ...remaining] = blogItems(content.articles);
  return (
    <>
      {featured ? (
        <BlogFeature item={featured} preview={content.mode === "seed"} />
      ) : (
        <IndexHero
          id="blog-title"
          title="blog"
          lead="Small observations about how systems should work."
        >
          <LearningArt />
        </IndexHero>
      )}
      <section
        className="catalog-page index-content blog-tiles"
        aria-label="More posts"
      >
        <div className="container">
          {content.mode === "seed" && <PreviewWritingNote />}
          {remaining.length ? (
            <CatalogGrid items={remaining} />
          ) : !featured ? (
            <p className="catalog-empty">No published posts yet.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
