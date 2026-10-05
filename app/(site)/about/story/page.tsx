import { EditorialPage } from "@/components/editorial-page";
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
    <EditorialPage
      title={about.storyTitle}
      label="My story"
      backHref="/about/"
      backLabel="About JJ"
    >
      {about.story.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <Link className="text-link page-link" href="/portfolio/" prefetch={false}>
        Explore the work →
      </Link>
    </EditorialPage>
  );
}
