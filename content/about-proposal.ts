import { seedAbout } from "./seed";
import type { About } from "./model";
/** Editorial proposal only. Never read by the public About route or imported into CMS. */
export function aboutProposal(current: About): About {
  return {
    ...current,
    lead: seedAbout.lead,
    storyTitle: seedAbout.storyTitle,
    story: seedAbout.story,
    strengths: seedAbout.strengths,
    life: seedAbout.life,
    builds: seedAbout.builds,
    storyLinkLabel: seedAbout.storyLinkLabel,
    facts: current.facts,
  };
}
