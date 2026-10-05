import "server-only";
import { cache } from "react";
import { getSanityPublicConfig } from "./config";
import { readPublishedContent } from "./read";
import { seedContent } from "./seed";

// Server components only. No token, draft query or browser CMS client.
export const getPublicContent = cache(async () => {
  const config = getSanityPublicConfig();
  return config ? readPublishedContent(config) : seedContent;
});
