import { defineCliConfig } from "sanity/cli";
import { getSanityPublicConfig } from "./content/config";
const config = getSanityPublicConfig();
if (!config)
  throw new Error(
    "Supply the approved public Sanity project and dataset identifiers before running CMS commands.",
  );
export default defineCliConfig({ api: config });
