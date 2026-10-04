import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { migrationDocuments } from "../content/migration";

async function main() {
  const target = resolve(process.argv[2] ?? "review/content-seed.ndjson");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(
    target,
    migrationDocuments()
      .map((doc) => JSON.stringify(doc))
      .join("\n") + "\n",
    { flag: "wx" },
  );
  console.log(
    `Local content file created: ${target}. No CMS was contacted. Import requires JJ’s separate authorization and authenticated login.`,
  );
}
main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Seed generation failed",
  );
  process.exitCode = 1;
});
