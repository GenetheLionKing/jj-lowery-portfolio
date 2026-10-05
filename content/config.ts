export type SanityPublicConfig = { projectId: string; dataset: string };
export function getSanityPublicConfig(
  env: Record<string, string | undefined> = process.env,
): SanityPublicConfig | null {
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  if (!projectId && !dataset) {
    if (env.VERCEL_ENV === "production") {
      throw new Error(
        "Production publishing requires Sanity project and dataset identifiers; review seed content is unavailable.",
      );
    }
    return null;
  }
  if (
    !projectId ||
    !dataset ||
    !/^[a-z0-9]{1,64}$/.test(projectId) ||
    !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(dataset)
  ) {
    throw new Error(
      "Set both valid public Sanity project and dataset identifiers; partial configuration cannot use seed fallback.",
    );
  }
  return { projectId, dataset };
}
