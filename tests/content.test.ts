import { test } from "node:test";
import assert from "node:assert/strict";
import { caseStudies } from "../data/case-studies";
import { getSanityPublicConfig } from "../content/config";
import { decodePublishedContent, readPublishedContent } from "../content/read";
import {
  seedAbout,
  seedArticles,
  seedCases,
  seedContent,
  seedResume,
} from "../content/seed";
import { migrationDocuments } from "../content/migration";
import { isSafeLink } from "../content/urls";
import { articleSchema, caseSchema } from "../content/model";
import { learnItems } from "../content/catalog";

test("case migration preserves every original public field and qualification", () => {
  for (const original of caseStudies) {
    const migrated = seedCases.find((study) => study.slug === original.slug)!;
    assert.deepEqual(
      Object.fromEntries(
        Object.keys(original).map((key) => [
          key,
          migrated[key as keyof typeof migrated],
        ]),
      ),
      original,
    );
  }
  assert.match(JSON.stringify(seedCases), /helper/i);
  assert.match(JSON.stringify(seedCases), /synthetic/i);
  assert.match(JSON.stringify(seedCases), /conceptual/i);
});

test("draft and release records cannot enter the public model, even in an unexpected transport response", () => {
  const result = decodePublishedContent([
    { ...seedAbout, _type: "about", _id: "drafts.about" },
    { ...seedResume, _type: "resume", _id: "versions.release.resume" },
    {
      ...seedArticles[0],
      _type: "article",
      _id: "drafts.secret",
      title: "PRIVATE DRAFT",
    },
    {
      ...seedCases[0],
      _type: "caseStudy",
      _id: "case-vector-income-architecture",
      slug: "unexpected-new-url",
    },
  ]);
  assert.equal(result.about, null);
  assert.equal(result.resume, null);
  assert.deepEqual(result.articles, []);
  assert.equal(result.cases[0].slug, "vector-income-architecture");
  assert.ok(!JSON.stringify(result).includes("PRIVATE DRAFT"));
});

test("configured empty/unpublished content remains empty rather than resurrecting seed", () => {
  assert.deepEqual(decodePublishedContent([]), {
    mode: "sanity",
    about: null,
    resume: null,
    cases: [],
    articles: [],
    resources: [],
  });
  assert.deepEqual(learnItems([], [], []), []);
});

test("partial or unsafe configuration cannot switch to repository fallback", () => {
  assert.equal(getSanityPublicConfig({}), null);
  assert.throws(() =>
    getSanityPublicConfig({ NEXT_PUBLIC_SANITY_PROJECT_ID: "example" }),
  );
  assert.throws(() =>
    getSanityPublicConfig({
      NEXT_PUBLIC_SANITY_PROJECT_ID: "example.evil.test",
      NEXT_PUBLIC_SANITY_DATASET: "portfolio",
    }),
  );
  assert.throws(() =>
    getSanityPublicConfig({
      NEXT_PUBLIC_SANITY_PROJECT_ID: "example",
      NEXT_PUBLIC_SANITY_DATASET: "../private",
    }),
  );
});

test("mock transport observes token-free published reads, and errors fail closed", async () => {
  const config = { projectId: "example", dataset: "portfolio" };
  const transport: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.origin, "https://example.api.sanity.io");
    assert.equal(url.searchParams.get("perspective"), "published");
    assert.ok(url.searchParams.get("query")!.includes("drafts.**"));
    assert.equal(init?.headers, undefined);
    assert.equal(init?.method, undefined);
    assert.equal(
      (init as RequestInit & { next: { revalidate: number } }).next.revalidate,
      60,
    );
    return Response.json({
      result: [{ ...seedArticles[0], _type: "article", _id: "article-one" }],
    });
  };
  assert.equal(
    (await readPublishedContent(config, transport)).articles.length,
    1,
  );
  await assert.rejects(
    readPublishedContent(
      config,
      async () => new Response("blocked", { status: 403 }),
    ),
    /unavailable/,
  );
  await assert.rejects(
    readPublishedContent(config, async () =>
      Response.json({ error: "wrong shape" }),
    ),
    /Invalid/,
  );
});

test("migration publishes only existing public records; proposed writing/resources/About are drafts", () => {
  const docs = migrationDocuments();
  const published = decodePublishedContent(docs);
  assert.equal(published.cases.length, 4);
  assert.equal(published.articles.length, 0);
  assert.equal(published.resources.length, 0);
  assert.deepEqual(published.resume, seedResume);
  assert.deepEqual(published.about!.life, []);
  assert.ok(docs.some((doc) => doc._id === "drafts.about"));
  assert.ok(
    seedArticles.every((article) =>
      docs.some((doc) => doc._id === `drafts.article-${article.slug}`),
    ),
  );
  assert.equal(new Set(docs.map((doc) => doc._id)).size, docs.length);
});

test("unsafe rich text links, foreign images and duplicate/reserved section anchors are rejected", () => {
  for (const href of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.test",
    "/\\evil.test",
    "https://user:password@evil.test",
    "\nhttps://evil.test",
  ])
    assert.equal(isSafeLink(href), false, href);
  for (const href of [
    "/work/vector-income-architecture/",
    "#proof",
    "https://www.w3.org/",
  ])
    assert.equal(isSafeLink(href), true);
  const article = structuredClone(seedArticles[0]);
  article.body[0].markDefs = [
    { _type: "link", _key: "bad", href: "javascript:alert(1)" },
  ];
  assert.equal(articleSchema.safeParse(article).success, false);
  assert.equal(
    caseSchema.safeParse({
      ...seedCases[0],
      image: { src: "https://tracker.test/pixel", alt: "x" },
    }).success,
    false,
  );
  assert.equal(
    caseSchema.safeParse({
      ...seedCases[0],
      sections: [...seedCases[0].sections, seedCases[0].sections[0]],
    }).success,
    false,
  );
  assert.equal(
    caseSchema.safeParse({
      ...seedCases[0],
      sections: [{ ...seedCases[0].sections[0], id: "skills" }],
    }).success,
    false,
  );
});

test("Learn is a distinct curated mix and does not feature the advertising case", () => {
  const items = learnItems(
    seedContent.cases,
    seedContent.articles,
    seedContent.resources,
  );
  assert.equal(items.length, 8);
  assert.equal(new Set(items.map((item) => item.kind)).size, 3);
  assert.ok(!items.some((item) => item.slug === "bgm-budget-pacing"));
  assert.ok(seedArticles.every((article) => !article.publishedAt));
});
