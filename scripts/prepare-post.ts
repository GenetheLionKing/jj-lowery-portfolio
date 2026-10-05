import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { articleSchema } from "../content/model";
import { nativePostData } from "../content/native-post";

// One NEW unpublished Post only. No network calls, imports or live publication.
async function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output)
    throw Error(
      "Usage: node --import tsx scripts/prepare-post.ts input.json new-draft.ndjson",
    );
  const value: unknown = JSON.parse(await readFile(resolve(input), "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Supply one Post object");
  const source = value as Record<string, unknown>;
  if (Object.keys(source).some((key) => key.startsWith("_")))
    throw Error(
      "Existing document identities are not accepted; use a guarded edit for existing Posts",
    );
  const native = {
    ...source,
    kind: "article",
    destination: source.destination ?? "article",
    format: source.format ?? "article",
    tags: source.tags ?? [],
  };
  articleSchema.parse(
    nativePostData(native, { projectId: "validation", dataset: "portfolio" }),
  );
  const doc = {
    ...native,
    _type: "post",
    _id: `drafts.post-${randomUUID()}`,
    slug: {
      _type: "slug",
      current:
        typeof source.slug === "object" && source.slug
          ? (source.slug as { current?: unknown }).current
          : source.slug,
    },
  };
  const target = resolve(output);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(doc) + "\n", { flag: "wx" });
  console.log(
    `Prepared ${doc._id} at ${target}. Local file only; nothing saved to Sanity or published.`,
  );
}
main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Post preparation failed",
  );
  process.exitCode = 1;
});
