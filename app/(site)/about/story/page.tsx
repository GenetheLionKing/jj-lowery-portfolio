import { AppPageAnalytics } from "@/components/app-analytics";
import { EditorialPage } from "@/components/editorial-page";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
import {
  aboutProposal,
  isAboutEditorialReview,
} from "@/content/about-proposal";
import { AboutReviewNote } from "@/components/about-review-note";
export const metadata: Metadata = {
  title: "My story",
  description:
    "The business experience behind JJ Lowery’s approach to systems analysis.",
  ...(isAboutEditorialReview()
    ? { robots: { index: false, follow: false } }
    : {}),
};
export default async function StoryPage() {
  const { about: published } = await getPublicContent();
  if (!published) notFound();
  const review = isAboutEditorialReview();
  const about = review ? aboutProposal(published) : published;
  if (!about.story.length) notFound();
  return (
    <>
      <AppPageAnalytics path="/about/story/" />
      {review && <AboutReviewNote />}
      <EditorialPage
        title={about.storyTitle}
        label="My story"
        backHref="/about/"
        backLabel="About JJ"
      >
        {about.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link
          className="text-link page-link"
          href="/portfolio/"
          prefetch={false}
        >
          Explore the work →
        </Link>
      </EditorialPage>
    </>
  );
}
