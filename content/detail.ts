import { getSanityPublicConfig } from "./config";
import { readPublishedContent } from "./read";
import { seedContent } from "./seed";

// Import only in getStaticPaths/getStaticProps. Next removes these imports
// from client bundles. Each regeneration reads published content once and
// returns either complete props or a native 404; no separate existence gate.
export async function loadDetailContent() {
  const config = getSanityPublicConfig();
  return config ? readPublishedContent(config) : seedContent;
}
export function serializableProps<T>(props: T): T {
  return JSON.parse(JSON.stringify(props)) as T;
}
