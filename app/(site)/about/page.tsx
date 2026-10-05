import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
import { AboutView } from "@/components/about-view";
import { AboutReviewNote } from "@/components/about-review-note";
import {
  aboutProposal,
  isAboutEditorialReview,
} from "@/content/about-proposal";
export const metadata: Metadata = {
  title: "About",
  description:
    "JJ Lowery’s background, systems work, current builds and life outside the screen.",
  ...(isAboutEditorialReview()
    ? { robots: { index: false, follow: false } }
    : {}),
};
export default async function AboutPage() {
  const { about, cases, articles } = await getPublicContent();
  if (!about) notFound();
  const review = isAboutEditorialReview();
  return (
    <>
      {review && <AboutReviewNote />}
      <AboutView
        about={review ? aboutProposal(about) : about}
        cases={cases}
        articles={articles}
      />
    </>
  );
}
