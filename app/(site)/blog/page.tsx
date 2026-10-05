import type { Metadata } from "next";
import {
  CatalogGrid,
  PreviewWritingNote,
} from "@/components/publishing-catalog";
import { getPublicContent } from "@/content/public";
import { blogItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "JJ Lowery’s articles on systems, business rules, practical building and validation.",
};
export default async function BlogPage() {
  const content = await getPublicContent();
  const items = blogItems(content.articles);
  return (
    <section className="catalog-page" aria-labelledby="blog-title">
      <div className="container">
        <header className="page-intro">
          <h1 className="page-title" id="blog-title">
            blog
          </h1>
          <p>Small observations about how systems should work.</p>
        </header>
        {content.mode === "seed" && <PreviewWritingNote />}
        {items.length ? (
          <CatalogGrid items={items} />
        ) : (
          <p className="catalog-empty">No published posts yet.</p>
        )}
      </div>
    </section>
  );
}
