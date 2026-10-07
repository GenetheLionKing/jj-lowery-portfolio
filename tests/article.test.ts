import { test } from "node:test";
import assert from "node:assert/strict";
import { seedCases, seedArticles } from "../content/seed";
import { legacyArticleBody, recentArticles } from "../content/article";
import { articleSchema, richTextSchema } from "../content/model";
import { nativePostData } from "../content/native-post";
import { decodePublishedContent } from "../content/read";
import { blogItems } from "../content/catalog";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReadingArticlePage } from "../components/reading-article";
import { caseArticle, postArticle } from "../content/article";
import { caseSchema } from "../content/model";
import { previewPost } from "../content/preview-post";

test("optional Post CTA survives published and draft adapters and rejects incomplete or unsafe settings", () => {
  const cta = { ctaText: "Visit Vector", ctaUrl: "https://vectorbudget.com" };
  const input = {
    ...seedArticles[0],
    ...cta,
    _type: "post",
    kind: "article",
    _id: "cta-example",
  };
  const published = decodePublishedContent([input]).articles[0];
  assert.equal(postArticle(published).ctaUrl, cta.ctaUrl);
  const preview = previewPost(
    { ...input, _id: "drafts.cta-example" },
    { projectId: "example", dataset: "portfolio" },
  );
  assert.equal(preview.ctaText, cta.ctaText);
  assert.equal(
    caseArticle(caseSchema.parse({ ...seedCases[0], ...cta })).ctaUrl,
    cta.ctaUrl,
  );
  for (const schema of [articleSchema, caseSchema]) {
    const base = schema === articleSchema ? seedArticles[0] : seedCases[0];
    assert.equal(schema.safeParse(base).success, true);
    assert.equal(
      schema.safeParse({ ...base, ctaText: " ", ctaUrl: null }).success,
      true,
    );
    for (const settings of [
      { ctaText: "Visit Vector" },
      { ctaUrl: cta.ctaUrl },
      { ...cta, ctaText: "x".repeat(81) },
      ...[
        "javascript:alert(1)",
        "http://example.com",
        "//example.com",
        "https://user:pass@example.com",
        "/\\example.com",
        "https://exa\nmple.com/",
      ].map((ctaUrl) => ({ ...cta, ctaUrl })),
    ])
      assert.equal(
        schema.safeParse({ ...base, ...settings }).success,
        false,
        JSON.stringify(settings),
      );
    assert.equal(
      schema.safeParse({ ...base, ctaText: "Contact", ctaUrl: "/contact/" })
        .success,
      true,
    );
  }
});

test("article CTA is a normal link after the body and before Recent articles; absent and malformed settings render no button", () => {
  const article = postArticle(seedArticles[0]);
  const render = (settings = {}) =>
    renderToStaticMarkup(
      createElement(ReadingArticlePage, {
        article: { ...article, ...settings },
        recent: [{ title: "Another article", href: "/blog/another/" }],
      }),
    );
  const html = render({
    ctaText: "Visit Vector",
    ctaUrl: "https://vectorbudget.com",
  });
  assert.match(
    html,
    /<a class="button button-dark" href="https:\/\/vectorbudget.com" target="_blank" rel="noopener noreferrer" aria-label="Visit Vector \(opens in a new tab\)">Visit Vector<\/a>/,
  );
  assert.ok(
    html.indexOf('class="reading-body"') < html.indexOf('class="reading-cta"'),
  );
  assert.ok(
    html.indexOf('class="reading-cta"') <
      html.indexOf('class="reading-recent"'),
  );
  assert.doesNotMatch(html, /role="button"/);
  for (const settings of [
    {},
    { ctaText: "Visit Vector" },
    { ctaUrl: "/contact/" },
    { ctaText: "Unsafe", ctaUrl: "javascript:alert(1)" },
  ])
    assert.doesNotMatch(render(settings), /reading-cta/);
});

test("legacy article adapter retains every authored heading, paragraph, list, rule, formula and qualification", () => {
  const strings = (value: unknown): string[] =>
    typeof value === "string"
      ? [value]
      : Array.isArray(value)
        ? value.flatMap(strings)
        : value && typeof value === "object"
          ? Object.entries(value)
              .filter(([key]) => !["type", "kind", "id"].includes(key))
              .flatMap(([, value]) => strings(value))
          : [];
  for (const study of seedCases) {
    const before = JSON.stringify(study);
    const body = legacyArticleBody(study);
    const text = body
      .filter((block) => block._type === "block")
      .flatMap((block) => block.children.map((span) => span.text))
      .join("\n");
    for (const source of strings(study.sections))
      assert.ok(text.includes(source), `${study.slug}: ${source}`);
    if (study.company === "Vector")
      assert.match(text, /developed with AI assistance/);
    for (const fact of study.metadata.filter((fact) =>
      /conceptual|synthetic|benchmark|assistance/i.test(fact.value),
    ))
      assert.ok(text.includes(fact.value));
    assert.equal(JSON.stringify(study), before);
    assert.equal(richTextSchema.safeParse(body).success, true);
  }
});
test("inline native images have public URLs, meaningful alt text and optional captions; unsafe images fail", () => {
  const doc = {
    ...seedArticles[0],
    kind: "article",
    body: [
      ...seedArticles[0].body,
      {
        _type: "image",
        _key: "image-1",
        asset: { _ref: "image-abc-800x600-webp" },
        alt: "An income-planning screen",
        caption: "The current model.",
      },
    ],
  };
  const result = articleSchema.parse(
    nativePostData(doc, { projectId: "example", dataset: "portfolio" }),
  );
  const image = result.body.at(-1)!;
  assert.equal(image._type, "image");
  if (image._type !== "image") throw Error("Expected image");
  assert.equal(
    image.src,
    "https://cdn.sanity.io/images/example/portfolio/abc-800x600.webp",
  );
  assert.equal(image.caption, "The current model.");
  for (const extension of ["gif", "svg"])
    assert.throws(() =>
      nativePostData(
        {
          ...doc,
          body: [
            {
              ...doc.body.at(-1),
              asset: { _ref: `image-abc-800x600-${extension}` },
            },
          ],
        },
        { projectId: "example", dataset: "portfolio" },
      ),
    );
  assert.equal(
    articleSchema.safeParse({ ...result, body: [{ ...image, alt: "" }] })
      .success,
    false,
  );
});
test("explicit link destinations share placement without creating an ordinary article or inventing custom pages", () => {
  const external = articleSchema.parse({
    ...seedArticles[0],
    destination: "external",
    externalUrl: "https://www.w3.org/",
    body: [],
    tags: ["blog"],
  });
  assert.equal(blogItems([external])[0].href, "https://www.w3.org/");
  assert.equal(blogItems([external])[0].label, "External link");
  assert.deepEqual(recentArticles([], [external], "/work/example/"), []);
  assert.equal(
    articleSchema.safeParse({ ...external, externalUrl: "javascript:alert(1)" })
      .success,
    false,
  );
  assert.equal(
    articleSchema.safeParse({
      ...external,
      destination: "custom",
      customPage: "/fictional-download/",
    }).success,
    false,
  );
});
test("dates come from authored publication history or real published revision time, never migration creation or drafts", () => {
  const content = decodePublishedContent([
    {
      ...seedCases[0],
      _type: "post",
      kind: "caseStudy",
      _id: "post-example",
      _createdAt: "2020-01-01T00:00:00Z",
      _updatedAt: "2026-10-05T06:26:41Z",
    },
    {
      ...seedArticles[0],
      _type: "post",
      kind: "article",
      _id: "drafts.private",
      _updatedAt: "2027-01-01T00:00:00Z",
    },
  ]);
  assert.equal(content.cases[0].publishedAt, undefined);
  assert.equal(content.cases[0].updatedAt, "2026-10-05T06:26:41Z");
  assert.deepEqual(content.articles, []);
});

test("Studio preview reads the supplied draft state, retains published revision dates and leaves public reads draft-free", async () => {
  const { previewPost } = await import("../content/preview-post");
  const draft = {
    ...seedArticles[0],
    _id: "drafts.example",
    _updatedAt: "2027-01-01T00:00:00Z",
    kind: "article",
    title: "Unsaved local preview change",
  };
  const before = JSON.stringify(draft);
  const preview = previewPost(
    draft,
    { projectId: "example", dataset: "portfolio" },
    "2026-10-05T06:26:41Z",
  );
  assert.equal(preview.title, "Unsaved local preview change");
  assert.equal(preview.updatedAt, "2026-10-05T06:26:41Z");
  assert.equal(preview.publishedAt, undefined);
  assert.equal(
    previewPost(draft, { projectId: "example", dataset: "portfolio" })
      .updatedAt,
    undefined,
  );
  assert.equal(JSON.stringify(draft), before);
  assert.deepEqual(
    decodePublishedContent([{ ...draft, _type: "post" }]).articles,
    [],
  );
});
