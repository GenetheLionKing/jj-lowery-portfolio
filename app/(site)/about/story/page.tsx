import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
export const metadata: Metadata = {
  title: "My story",
  description:
    "The business experience behind JJ Lowery’s approach to systems analysis.",
};
export default async function StoryPage() {
  const { about } = await getPublicContent();
  if (!about || !about.story.length) notFound();
  return (
    <article className="container article-page">
      <Link prefetch={false} href="/about/" className="text-link back-link">
        ← About JJ
      </Link>
      <header className="article-heading">
        <p className="eyebrow">My story</p>
        <h1>{about.storyTitle}</h1>
      </header>
      <div className="article-body">
        {about.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <Link className="text-link page-link" href="/portfolio/" prefetch={false}>
        Explore the work →
      </Link>
    </article>
  );
}
