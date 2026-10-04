import { getSanityPublicConfig } from "./content/config";
import { createStudioConfig } from "./studio/config";
const config = getSanityPublicConfig();
// The CLI must never invent a project or dataset. Not used by the website build.
if (!config)
  throw new Error(
    "Set the approved public Sanity project and dataset identifiers before invoking the CMS CLI.",
  );
export default createStudioConfig(config);
