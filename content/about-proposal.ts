import { seedAbout } from "./seed";
import type { About } from "./model";
/** Fill missing expansion fields for editorial review; retain existing copy and cleared facts. */
export function aboutProposal(current: About): About {
  return {
    ...current,
    story: current.story.length ? current.story : seedAbout.story,
    strengths: current.strengths.length
      ? current.strengths
      : seedAbout.strengths,
    life: current.life.length ? current.life : seedAbout.life,
    builds: current.builds.length ? current.builds : seedAbout.builds,
    facts: current.facts,
  };
}

/** Production always reads published CMS. Local review uses explicit Preview mode. */
export function isAboutEditorialReview(env: NodeJS.ProcessEnv = process.env) {
  return (
    env.VERCEL_ENV === "preview" ||
    (env.VERCEL_ENV !== "production" && env.NODE_ENV === "development")
  );
}
