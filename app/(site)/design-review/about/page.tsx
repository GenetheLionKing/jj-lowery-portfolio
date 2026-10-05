import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
import { aboutProposal } from "@/content/about-proposal";
import { AboutView } from "@/components/about-view";
export default async function Proposal() {
  const { about, cases, articles } = await getPublicContent();
  if (!about) notFound();
  return (
    <AboutView
      about={aboutProposal(about)}
      cases={cases}
      articles={articles}
      storyHref="/design-review/about/story/"
    />
  );
}
