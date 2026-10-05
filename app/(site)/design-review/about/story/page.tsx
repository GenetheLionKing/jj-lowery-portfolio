import { notFound } from "next/navigation";
import { getPublicContent } from "@/content/public";
import { aboutProposal } from "@/content/about-proposal";
import { EditorialPage } from "@/components/editorial-page";
export default async function StoryProposal() {
  const { about } = await getPublicContent();
  if (!about) notFound();
  const proposal = aboutProposal(about);
  return (
    <EditorialPage
      title={proposal.storyTitle}
      label="About restoration proposal"
      backHref="/design-review/about/"
      backLabel="About proposal"
    >
      {proposal.story.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </EditorialPage>
  );
}
