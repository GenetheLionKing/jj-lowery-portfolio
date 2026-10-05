import type { Metadata } from "next";
import {
  CatalogGrid,
  PreviewWritingNote,
} from "@/components/publishing-catalog";
import { IndexHero, LearningArt } from "@/components/index-hero";
import { getPublicContent } from "@/content/public";
import { learnItems } from "@/content/catalog";
export const metadata: Metadata = {
  title: "Learn",
  description:
    "Articles, systems case studies and useful resources on business rules, workflows, building and validation.",
};
export default async function LearnPage() {
  const content = await getPublicContent();
  const items = learnItems(content.cases, content.articles, content.resources);
  return (
    <>
      <IndexHero
        id="learn-title"
        title="learn"
        lead="Notes, examples and useful references for understanding systems."
      >
        <LearningArt />
      </IndexHero>
      <section
        className="catalog-page index-content"
        aria-label="Learning library"
      >
        <div className="container">
          {content.mode === "seed" && <PreviewWritingNote />}
          {items.length ? (
            <CatalogGrid items={items} />
          ) : (
            <p className="catalog-empty">No published items yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
