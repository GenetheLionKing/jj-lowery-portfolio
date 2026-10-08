import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ArrayOfObjectsInputProps } from "sanity";
import { AboutView } from "../components/about-view";
import {
  aboutSchema,
  aboutSectionSchema,
  type AboutSection,
} from "../content/model";
import { nativeAboutData } from "../content/native-about";
import { decodePublishedContent, publishedQuery } from "../content/read";
import { seedAbout, seedCases, seedArticles } from "../content/seed";
import { aboutProposal } from "../content/about-proposal";
import { AboutSectionsInput } from "../studio/about-sections-input";
import { schemaTypes } from "../studio/schema";
import { createSchema, toMutationPatches, type Path } from "sanity";
import {
  AboutTextBlock,
  aboutAlignmentPath,
  aboutAlignmentPatches,
} from "../studio/about-text-block";
import { ArticleBody } from "../components/article-body";
import { aboutBodySchema, richTextSchema } from "../content/model";
import { blockAlignment } from "../content/about-presentation";

const config = { projectId: "validation", dataset: "portfolio" };
const image = {
  src: "/images/profile-shoulder-640.webp",
  alt: "Test portrait",
  width: 1640,
  height: 1294,
};
const nativeImage = {
  asset: { _ref: "image-test-1640x1294-webp" },
  alt: image.alt,
};
const paragraph = (text: string, key = "paragraph") => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  children: [
    { _type: "span" as const, _key: "span", text, marks: [] as string[] },
  ],
  markDefs: [],
});
const body = [paragraph("Test body")];
const sections: AboutSection[] = [
  {
    _type: "aboutImageLeft",
    _key: "left",
    image,
    headline: "First section",
    body,
  },
  {
    _type: "aboutCopyImageCopy",
    _key: "middle",
    image,
    leftHeadline: "Left copy",
    leftBody: [paragraph("Independent left")],
    rightHeadline: "Right copy",
    rightBody: [paragraph("Independent right")],
  },
  {
    _type: "aboutImageRight",
    _key: "right",
    image,
    headline: "Third section",
    body,
  },
  {
    _type: "aboutImageOnly",
    _key: "only",
    image,
    caption: "Optional image caption",
  },
];
const render = (value: unknown) =>
  renderToStaticMarkup(
    createElement(AboutView, {
      about: aboutSchema.parse(value),
      cases: seedCases,
      articles: [],
    }),
  );

test("absent sections preserve the existing page; explicit empty stays empty including editorial review", () => {
  const legacy = aboutSchema.parse(seedAbout);
  assert.equal(legacy.sections, undefined);
  const legacyHtml = render(legacy);
  assert.match(legacyHtml, /about-layout/);
  assert.match(legacyHtml, /profile-figure/);
  assert.match(legacyHtml, /What I’m building/);
  assert.match(legacyHtml, /href="\/about\/story\/?"/);
  const empty = aboutSchema.parse({ ...seedAbout, sections: [] });
  assert.deepEqual(empty.sections, []);
  const emptyHtml = render(aboutProposal(empty));
  assert.match(emptyHtml, /<h1/);
  assert.ok(
    emptyHtml.includes("about-layout") &&
      !emptyHtml.includes("What I’m building"),
  );
  assert.ok(!emptyHtml.includes("about-authored-section "));
  assert.deepEqual(
    empty.story,
    seedAbout.story,
    "Legacy story remains available to the story route",
  );
  assert.equal(aboutSchema.safeParse({ title: "About" }).success, false);
  assert.equal(
    aboutSchema.safeParse({ title: "About", sections }).success,
    true,
  );
});

test("hero title, introduction and portrait stay identical for absent, empty and authored sections", () => {
  const hero = (html: string) =>
    html.match(/<section class="info-page about-page"[\s\S]*?<\/section>/)?.[0];
  const original = structuredClone(seedAbout);
  const legacyHero = hero(render(seedAbout));
  assert.ok(legacyHero);
  for (const value of [undefined, [], sections]) {
    const about = {
      ...seedAbout,
      ...(value === undefined ? {} : { sections: value }),
    };
    const html = render(about);
    assert.equal(hero(html), legacyHero);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/class="profile-figure"/g) ?? []).length, 1);
    if (value?.length) {
      assert.ok(
        html.indexOf("</section>") <
          html.indexOf('class="about-authored-section '),
      );
      assert.ok(html.indexOf("profile-figure") < html.indexOf("First section"));
      assert.ok(
        !html.includes("What I’m building"),
        "Authored sections replace the legacy lower content only",
      );
    }
  }
  assert.deepEqual(seedAbout, original);
});

test("tagged gallery remains below the hero and before authored sections; untagged posts stay out", () => {
  const tagged = {
    ...seedArticles[0],
    title: "Tagged gallery story",
    mainImage: image,
    tags: ["about-gallery"],
  };
  const untagged = {
    ...seedArticles[0],
    slug: "untagged-gallery-story",
    title: "Untagged gallery story",
    mainImage: image,
    tags: [],
  };
  for (const value of [undefined, [], sections]) {
    const about = aboutSchema.parse({
      ...seedAbout,
      ...(value === undefined ? {} : { sections: value }),
    });
    const original = structuredClone(about);
    const html = renderToStaticMarkup(
      createElement(AboutView, {
        about,
        cases: seedCases,
        articles: [tagged, untagged],
      }),
    );
    const gallery = html.indexOf('aria-label="Personal stories"');
    assert.ok(gallery > html.indexOf('class="profile-figure"'));
    assert.ok(html.includes('aria-label="Tagged gallery story"'));
    assert.ok(!html.includes("Untagged gallery story"));
    if (value?.length)
      assert.ok(gallery < html.indexOf('class="about-authored-section '));
    assert.deepEqual(
      about,
      original,
      "Rendering must preserve the authored section and every legacy field",
    );
  }
});

test("dividers mark each authored boundary once with no trailing or empty-page divider", () => {
  for (const value of [undefined, [], sections.slice(0, 1), sections]) {
    const about = {
      ...seedAbout,
      ...(value === undefined ? {} : { sections: value }),
    };
    const original = structuredClone(about);
    const html = render(about);
    const divider = '<hr class="about-section-divider" aria-hidden="true"/>';
    const parts = html.split(divider);
    assert.equal(parts.length - 1, value?.length ?? 0);
    if (value?.length) {
      assert.ok(parts[0].includes("profile-figure"));
      assert.ok(parts[0].includes("</section>"));
      for (let index = 1; index < parts.length; index++) {
        assert.ok(
          parts[index].startsWith('<section class="about-authored-section '),
        );
        assert.equal(
          (parts[index].match(/class="about-authored-section /g) ?? []).length,
          1,
        );
      }
      assert.ok(
        parts.at(-1)?.endsWith("</section></div>"),
        "No divider follows the final section",
      );
    }
    assert.deepEqual(about, original);
  }
});

test("gallery separation stays independent before the first section divider and ordered rich content", () => {
  const article = {
    ...seedArticles[0],
    title: "Gallery story",
    mainImage: image,
    tags: ["about-gallery"],
  };
  const about = aboutSchema.parse({ ...seedAbout, sections });
  const original = structuredClone(about);
  const html = renderToStaticMarkup(
    createElement(AboutView, { about, cases: [], articles: [article] }),
  );
  const hero = html.indexOf("profile-figure");
  const gallery = html.indexOf('aria-label="Personal stories"');
  const divider = html.indexOf('class="about-section-divider"');
  const first = html.indexOf("First section");
  assert.ok(hero < gallery && gallery < divider && divider < first);
  assert.equal(
    (html.match(/class="about-section-divider"/g) ?? []).length,
    sections.length,
  );
  assert.ok(
    html.indexOf("Independent left") < html.indexOf("Independent right"),
  );
  assert.ok(
    html.indexOf("Third section") < html.indexOf("Optional image caption"),
  );
  assert.deepEqual(about, original);
});

test("layouts repeat beyond six with stable keys, stored order and unchanged source", () => {
  const repeated = Array.from({ length: 9 }, (_, index) => ({
    ...sections[0],
    _key: `item-${index}`,
    headline: `Section ${index}`,
  }));
  const original = structuredClone(repeated);
  const reversed = repeated.toReversed();
  const parsed = aboutSchema.parse({ ...seedAbout, sections: reversed });
  assert.deepEqual(
    parsed.sections?.map((section) => section._key),
    reversed.map((section) => section._key),
  );
  const html = render(parsed);
  let previous = -1;
  for (const section of reversed) {
    const position = html.indexOf(`>${section.headline}</h2>`);
    assert.ok(position > previous);
    previous = position;
  }
  assert.deepEqual(repeated, original);
  assert.equal(
    aboutSchema.safeParse({
      ...seedAbout,
      sections: [sections[0], sections[0]],
    }).success,
    false,
  );
});

test("all four layouts emit their source order, full images, alt and optional caption without hydration", () => {
  const html = render({ ...seedAbout, sections });
  const parts = html.split('<section class="about-authored-section ').slice(1);
  assert.equal(parts.length, 4);
  assert.ok(parts[0].indexOf("<img") < parts[0].indexOf("First section"));
  assert.ok(parts[1].indexOf("Independent left") < parts[1].indexOf("<img"));
  assert.ok(parts[1].indexOf("<img") < parts[1].indexOf("Independent right"));
  assert.ok(parts[2].indexOf("Third section") < parts[2].indexOf("<img"));
  assert.match(parts[3], /<figcaption>Optional image caption<\/figcaption>/);
  for (const part of parts) {
    assert.match(part, /alt="Test portrait"/);
    assert.match(part, /width="1640" height="1294"/);
  }
  assert.ok(!html.includes("<script"));
});

test("independent rich bodies preserve formatting, links, lists, quotes and inline images", () => {
  const rich = [
    {
      ...paragraph("Bold text", "bold"),
      children: [
        { _type: "span", _key: "span", text: "Bold text", marks: ["strong"] },
      ],
    },
    {
      ...paragraph("Emphasized text", "em"),
      children: [
        { _type: "span", _key: "span", text: "Emphasized text", marks: ["em"] },
      ],
    },
    {
      ...paragraph("Contact link", "link"),
      children: [
        {
          _type: "span",
          _key: "span",
          text: "Contact link",
          marks: ["contact"],
        },
      ],
      markDefs: [{ _type: "link", _key: "contact", href: "/contact/" }],
    },
    { ...paragraph("Bullet content", "list"), listItem: "bullet", level: 1 },
    { ...paragraph("Number content", "number"), listItem: "number", level: 1 },
    { ...paragraph("Quotation", "quote"), style: "blockquote" },
    { ...paragraph("Subheading", "heading"), style: "h3" },
    {
      ...image,
      _type: "image",
      _key: "inline",
      alt: "Inline test image",
      caption: "Inline caption",
    },
  ];
  const html = render({
    title: "About",
    sections: [{ ...sections[1], leftBody: rich }],
  });
  for (const expected of [
    "<strong>Bold text</strong>",
    "<em>Emphasized text</em>",
    '<a href="/contact/">Contact link</a>',
    "<ul>",
    "<ol>",
    "<blockquote>Quotation</blockquote>",
    "<h3>Subheading</h3>",
    'alt="Inline test image"',
    "<figcaption>Inline caption</figcaption>",
    "Independent right",
  ])
    assert.ok(html.includes(expected), expected);
});

test("sections reject incomplete copy, unsafe links/media, duplicate identities and unregistered components", () => {
  for (const section of [
    { ...sections[0], headline: " " },
    { ...sections[0], body: [] },
    { ...sections[0], body: [paragraph(" ")] },
    { ...sections[1], rightBody: [] },
    { ...sections[0], image: { ...image, alt: " " } },
    { ...sections[0], image: { ...image, width: 0 } },
    {
      ...sections[0],
      image: { ...image, src: "https://example.com/private.png" },
    },
    { ...sections[0], _type: "customCode", code: "alert(1)" },
    {
      ...sections[0],
      body: [
        {
          ...paragraph("Unsafe"),
          markDefs: [
            { _type: "link", _key: "unsafe", href: "javascript:alert(1)" },
          ],
        },
      ],
    },
    {
      ...sections[0],
      body: [{ _type: "systemDiagram", _key: "chart", kind: "budget" }],
    },
  ])
    assert.equal(aboutSectionSchema.safeParse(section).success, false);
  assert.equal(
    aboutSectionSchema.safeParse({ ...sections[3], caption: undefined })
      .success,
    true,
  );
});

test("native About adaptation resolves section and both body assets locally without mutating saved fields", () => {
  const doc = {
    ...seedAbout,
    sections: sections.map((section) => ({ ...section, image: nativeImage })),
    _id: "drafts.about",
    _rev: "preserve",
  };
  const dual = doc.sections[1] as Record<string, unknown>;
  dual.leftBody = [
    {
      ...nativeImage,
      _type: "image",
      _key: "left-image",
      caption: "Left caption",
    },
  ];
  dual.rightBody = [
    {
      ...nativeImage,
      _type: "image",
      _key: "right-image",
      caption: "Right caption",
    },
  ];
  const original = structuredClone(doc);
  const adapted = nativeAboutData(doc, config);
  const parsed = aboutSchema.parse(adapted);
  assert.deepEqual(doc, original);
  assert.equal(adapted._id, "drafts.about");
  assert.deepEqual(parsed.story, seedAbout.story);
  assert.equal(
    parsed.sections?.[0].image.src,
    "https://cdn.sanity.io/images/validation/portfolio/test-1640x1294.webp",
  );
  assert.equal(nativeAboutData(seedAbout, config).sections, undefined);
  assert.deepEqual(
    nativeAboutData({ ...seedAbout, sections: [] }, config).sections,
    [],
  );
  assert.throws(
    () =>
      nativeAboutData(
        {
          ...seedAbout,
          sections: [
            {
              ...sections[0],
              image: {
                asset: { _ref: "image-test-20001x600-jpg" },
                alt: "Test",
              },
            },
          ],
        },
        config,
      ),
    /Images require/,
  );
});

test("actual published GROQ resolves nested assets and rich copy, retains case sections and excludes drafts", async () => {
  // Exercise the parser/evaluator already pinned by Sanity, without a new dependency or CMS call.
  const localRequire = createRequire(import.meta.url);
  const groq = createRequire(localRequire.resolve("sanity/package.json"))(
    "groq-js",
  );
  const asset = {
    _id: nativeImage.asset._ref,
    _type: "sanity.imageAsset",
    url: "https://cdn.sanity.io/images/validation/portfolio/test-1640x1294.webp",
    metadata: { dimensions: { width: 1640, height: 1294 } },
  };
  const published = {
    ...seedAbout,
    _type: "about",
    _id: "about",
    sections: sections.map((section) => ({ ...section, image: nativeImage })),
  };
  const dataset = [
    asset,
    published,
    { ...published, _id: "drafts.about", title: "PRIVATE DRAFT" },
    { ...seedCases[0], _type: "post", kind: "caseStudy", _id: "case-test" },
  ];
  const queryResult = await (
    await groq.evaluate(groq.parse(publishedQuery), { dataset })
  ).get();
  const content = decodePublishedContent(queryResult);
  assert.deepEqual(
    content.about?.sections,
    sections.map((section) => ({
      ...section,
      image: { ...image, src: asset.url },
    })),
  );
  assert.deepEqual(content.cases[0].sections, seedCases[0].sections);
  assert.ok(!JSON.stringify(queryResult).includes("PRIVATE DRAFT"));
  for (const value of [undefined, []]) {
    const doc = {
      ...seedAbout,
      _type: "about",
      _id: "about",
      ...(value !== undefined ? { sections: value } : {}),
    };
    const result = await (
      await groq.evaluate(groq.parse(publishedQuery), { dataset: [doc] })
    ).get();
    assert.deepEqual(decodePublishedContent(result).about?.sections, value);
  }
  assert.throws(() =>
    decodePublishedContent([
      {
        ...published,
        sections: [{ ...sections[0], image: { ...image, alt: "" } }],
      },
    ]),
  );
});

test("native removal keeps intentional empty state and delegates ordinary removal, movement and add", () => {
  const changes: unknown[] = [];
  const removals: string[] = [];
  const move = () => {};
  const append = () => {};
  const mount = (value: { _key: string }[], readOnly = false) => {
    let captured: ArrayOfObjectsInputProps | undefined;
    AboutSectionsInput({
      value,
      readOnly,
      onChange: (patch: unknown) => changes.push(patch),
      onItemRemove: (key: string) => removals.push(key),
      onItemMove: move,
      onItemAppend: append,
      renderDefault: (props: ArrayOfObjectsInputProps) => {
        captured = props;
        return null;
      },
    } as unknown as ArrayOfObjectsInputProps);
    assert.equal(captured?.onItemMove, move);
    assert.equal(captured?.onItemAppend, append);
    return captured!;
  };
  mount([{ _key: "last" }]).onItemRemove("last");
  const patch = changes[0] as {
    type: string;
    path: unknown[];
    value: unknown[];
  };
  assert.equal(patch.type, "set");
  assert.deepEqual(patch.path, []);
  assert.deepEqual(patch.value, []);
  assert.deepEqual(
    aboutSchema.parse({ ...seedAbout, sections: patch.value }).sections,
    [],
  );
  mount([{ _key: "first" }, { _key: "second" }]).onItemRemove("first");
  mount([{ _key: "last" }]).onItemRemove("stale-key");
  assert.deepEqual(removals, ["first", "stale-key"]);
  mount([{ _key: "last" }], true).onItemRemove("last");
  assert.equal(changes.length, 1);
});

test("Studio validates native section documents and keeps editor/body contracts independent", () => {
  const about = schemaTypes.find((type) => type.name === "about")!;
  let validate: (value: unknown) => unknown = () => false;
  const rule = {
    custom(fn: typeof validate) {
      validate = fn;
      return rule;
    },
  };
  (about.validation as (rule: unknown) => unknown)(rule);
  assert.equal(validate(seedAbout), true);
  assert.equal(validate({ title: "About", sections: [] }), true);
  assert.equal(
    validate({
      title: "About",
      sections: sections.map((section) => ({ ...section, image: nativeImage })),
    }),
    true,
  );
  assert.notEqual(
    validate({ title: "About", sections: [{ ...sections[1], rightBody: [] }] }),
    true,
  );
  const array = about.fields!.find((field) => field.name === "sections")!;
  assert.equal(
    "initialValue" in array,
    false,
    "Old documents must not silently opt in",
  );
  assert.equal(
    "validation" in array,
    false,
    "No six-section maximum or layout uniqueness restriction",
  );
  const triple = schemaTypes.find(
    (type) => type.name === "aboutCopyImageCopy",
  )!;
  for (const name of ["leftBody", "rightBody"]) {
    const field = triple.fields!.find((item) => item.name === name)! as {
      type: string;
      components?: unknown;
      of: { type: string }[];
    };
    assert.equal(field.type, "array");
    assert.equal(
      field.components,
      undefined,
      "Retain the native Portable Text editor",
    );
    assert.deepEqual(
      field.of.map((item) => item.type),
      ["image", "block"],
    );
  }
  const postBody = schemaTypes
    .find((type) => type.name === "post")!
    .fields!.find((field) => field.name === "body")! as {
    of: { type: string }[];
  };
  assert.deepEqual(
    postBody.of.map((item) => item.type),
    ["image", "systemDiagram", "block"],
  );
});

test("About alignment survives native JSON and published adapters without changing rich text or section order", () => {
  const rich = [
    {
      ...paragraph("Formatted paragraph", "formatted"),
      children: [
        {
          _type: "span",
          _key: "span",
          text: "Formatted paragraph",
          marks: ["strong", "em", "contact"],
        },
      ],
      markDefs: [{ _type: "link", _key: "contact", href: "/contact/" }],
    },
    {
      ...paragraph("List heading", "list"),
      style: "h3",
      listItem: "bullet",
      level: 2,
    },
    { ...paragraph("Quote", "quote"), style: "blockquote" },
  ];
  const raw = {
    _id: "about",
    _type: "about",
    title: "About",
    introduction: [],
    sections: [
      {
        ...sections[1],
        image: nativeImage,
        imageWidth: 600,
        leftHeadlineAlignment: "center",
        rightHeadlineAlignment: "right",
        leftBody: rich,
        rightBody: [paragraph("Right paragraph", "right")],
        leftBodyAlignments: [
          {
            _type: "aboutTextAlignment",
            _key: "formatted",
            alignment: "center",
          },
          { _type: "aboutTextAlignment", _key: "quote", alignment: "right" },
        ],
        rightBodyAlignments: [
          { _type: "aboutTextAlignment", _key: "right", alignment: "right" },
        ],
      },
    ],
  };
  const original = structuredClone(raw);
  const serialized = JSON.parse(JSON.stringify(raw));
  const native = aboutSchema.parse(nativeAboutData(serialized, config));
  const published = decodePublishedContent([
    { ...native, _id: "about", _type: "about" },
  ]).about!;
  assert.deepEqual(published.sections, native.sections);
  const triple = published.sections![0];
  assert.equal(triple._type, "aboutCopyImageCopy");
  if (triple._type !== "aboutCopyImageCopy") return;
  assert.deepEqual(triple.leftBody, rich);
  assert.equal(triple.leftHeadlineAlignment, "center");
  assert.equal(triple.rightHeadlineAlignment, "right");
  assert.equal(triple.imageWidth, 600);
  assert.equal(
    blockAlignment(triple.leftBodyAlignments, "formatted"),
    "center",
  );
  assert.equal(blockAlignment(triple.rightBodyAlignments, "right"), "right");
  assert.equal(blockAlignment(triple.leftBodyAlignments, "list"), "left");
  assert.equal(blockAlignment(triple.leftBodyAlignments, "missing"), "left");
  assert.deepEqual(raw, original);
  assert.equal(
    publishedQuery.includes("sections[]{..."),
    true,
    "Presentation settings stay in the existing published-only projection",
  );
});

test("native alignment form patches touch only keyed About metadata and reset Left without replacing paragraphs", () => {
  const nativeRequire = createRequire(
    createRequire(import.meta.url).resolve("sanity"),
  );
  const { Mutation } = nativeRequire("@sanity/mutator");
  const sectionKey = "section",
    paragraphKey = "paragraph";
  const path: Path = [
    "sections",
    { _key: sectionKey },
    "leftBody",
    { _key: paragraphKey },
  ];
  const alignmentPath = aboutAlignmentPath(path)!;
  assert.deepEqual(alignmentPath, [
    "sections",
    { _key: sectionKey },
    "leftBodyAlignments",
  ]);
  assert.deepEqual(
    aboutAlignmentPath([
      "sections",
      { _key: sectionKey },
      "rightBody",
      { _key: paragraphKey },
    ]),
    ["sections", { _key: sectionKey }, "rightBodyAlignments"],
  );
  assert.deepEqual(
    aboutAlignmentPath([
      "sections",
      { _key: sectionKey },
      "body",
      { _key: paragraphKey },
    ]),
    ["sections", { _key: sectionKey }, "bodyAlignments"],
  );
  assert.equal(aboutAlignmentPath([]), undefined);
  assert.equal(
    aboutAlignmentPath(["body", { _key: paragraphKey }]),
    undefined,
    "Never patch Blog or a root body",
  );
  const rich = [
    {
      ...paragraph("Keep this linked list", paragraphKey),
      listItem: "number",
      level: 2,
      children: [
        {
          _type: "span",
          _key: "span",
          text: "Keep this linked list",
          marks: ["strong", "contact"],
        },
      ],
      markDefs: [{ _type: "link", _key: "contact", href: "/contact/" }],
    },
  ];
  let doc = {
    _id: "about",
    _type: "about",
    sections: [
      {
        _key: sectionKey,
        leftBody: rich,
        rightBody: [paragraph("Right", "other")],
      },
    ],
  };
  const original = structuredClone(doc);
  const apply = (
    alignment: "left" | "center" | "right",
    key = paragraphKey,
  ) => {
    const current =
      "leftBodyAlignments" in doc.sections[0]
        ? doc.sections[0].leftBodyAlignments
        : undefined;
    const patches = aboutAlignmentPatches(
      alignmentPath,
      key,
      alignment,
      current,
    );
    if (patches.length)
      doc = new Mutation({
        mutations: toMutationPatches(patches).map((patch) => ({
          patch: { id: "about", ...patch },
        })),
      }).apply(doc);
  };
  apply("center");
  apply("right", "unrelated");
  apply("right");
  const current = doc.sections[0] as (typeof doc.sections)[0] & {
    leftBodyAlignments: unknown;
  };
  assert.equal(
    blockAlignment(current.leftBodyAlignments, paragraphKey),
    "right",
  );
  apply("left");
  const restored = doc.sections[0] as (typeof doc.sections)[0] & {
    leftBodyAlignments: unknown;
  };
  assert.equal(
    blockAlignment(restored.leftBodyAlignments, paragraphKey),
    "left",
  );
  assert.equal(
    blockAlignment(restored.leftBodyAlignments, "unrelated"),
    "right",
  );
  assert.deepEqual(doc.sections[0].leftBody, original.sections[0].leftBody);
  assert.deepEqual(doc.sections[0].rightBody, original.sections[0].rightBody);
  assert.deepEqual(
    aboutAlignmentPatches(alignmentPath, paragraphKey, "left", undefined),
    [],
  );
  const cleanup = aboutAlignmentPatches(
    alignmentPath,
    paragraphKey,
    "center",
    [
      { _type: "aboutTextAlignment", _key: "removed", alignment: "right" },
      { _type: "aboutTextAlignment", _key: paragraphKey, alignment: "right" },
    ],
    new Set([paragraphKey]),
  );
  assert.equal(cleanup[0].type, "unset");
  assert.deepEqual(cleanup[0].path, [...alignmentPath, { _key: "removed" }]);
  assert.equal(cleanup[1].type, "set");
});

test("About renders independent alignment on paragraphs, headings, quotes and list items; Blog stays unchanged", () => {
  const rich = aboutBodySchema.parse([
    {
      ...paragraph("Linked bold", "p"),
      children: [
        {
          _type: "span",
          _key: "span",
          text: "Linked bold",
          marks: ["strong", "link"],
        },
      ],
      markDefs: [{ _type: "link", _key: "link", href: "/contact/" }],
    },
    { ...paragraph("Heading", "h"), style: "h2" },
    { ...paragraph("Quote", "q"), style: "blockquote" },
    { ...paragraph("Bullet", "b"), listItem: "bullet", level: 1 },
    {
      ...paragraph("Number heading", "n"),
      style: "h3",
      listItem: "number",
      level: 1,
    },
    paragraph("Default paragraph", "default"),
  ]);
  const metadata = rich
    .filter((block) => block._type === "block" && block._key !== "default")
    .map((block) => ({
      _type: "aboutTextAlignment" as const,
      _key: block._key,
      alignment: "center" as const,
    }));
  const triple = aboutSectionSchema.parse({
    ...sections[1],
    leftHeadlineAlignment: "right",
    rightHeadlineAlignment: "center",
    leftBody: rich,
    leftBodyAlignments: metadata,
  });
  const html = renderToStaticMarkup(
    createElement(AboutSectionsFixture, { section: triple }),
  );
  for (const snippet of [
    '<h2 style="text-align:right">Left copy</h2>',
    '<h2 style="text-align:center">Right copy</h2>',
    '<p style="text-align:center">',
    "<strong>Linked bold</strong>",
    '<a href="/contact/">',
    '<h2 style="text-align:center">Heading</h2>',
    '<blockquote style="text-align:center">Quote</blockquote>',
    '<li style="text-align:center">Bullet</li>',
    '<li style="text-align:center"><h3 style="text-align:center">Number heading</h3></li>',
    "<p>Default paragraph</p>",
  ])
    assert.ok(html.includes(snippet), snippet);
  const blog = renderToStaticMarkup(
    createElement(ArticleBody, {
      body: richTextSchema.parse(rich),
      blockAlignments: metadata,
    }),
  );
  const alignedBody = renderToStaticMarkup(
    createElement(ArticleBody, {
      body: rich,
      alignAboutBlocks: true,
      blockAlignments: metadata,
    }),
  );
  assert.equal(
    alignedBody.replace(/ style="text-align:(center|right)"/g, ""),
    blog,
    "Alignment retains identical native semantic markup",
  );
  assert.doesNotMatch(blog, /text-align/);
  assert.ok(blog.includes("<h2>Heading</h2>"));
  assert.ok(blog.includes("<li>Bullet</li>"));
  assert.equal(triple._type, "aboutCopyImageCopy");
  if (triple._type === "aboutCopyImageCopy")
    assert.deepEqual(triple.leftBody, rich);
});

function AboutSectionsFixture({ section }: { section: AboutSection }) {
  return createElement(AboutView, {
    about: aboutSchema.parse({ ...seedAbout, sections: [section] }),
    cases: [],
    articles: [],
  });
}

test("Studio compiles scoped native block controls, independent headline radios and optional image width", () => {
  const compiled = createSchema({
    name: "alignment-regression",
    types: schemaTypes,
  });
  const issues =
    (
      compiled as typeof compiled & {
        _validation?: { problems: { severity: string; message: string }[] }[];
      }
    )._validation ?? [];
  assert.deepEqual(
    issues
      .flatMap((group) => group.problems)
      .filter((problem) => problem.severity === "error"),
    [],
  );
  for (const name of [
    "aboutImageLeft",
    "aboutCopyImageCopy",
    "aboutImageRight",
    "aboutImageOnly",
  ]) {
    const type = schemaTypes.find((type) => type.name === name)!;
    const width = type.fields!.find((field) => field.name === "imageWidth")!;
    assert.equal(width.type, "number");
    assert.equal("initialValue" in width, false);
    for (const field of type.fields!.filter((field) =>
      ["body", "leftBody", "rightBody"].includes(field.name),
    )) {
      const rich = field as typeof field & {
        components?: unknown;
        of: {
          type: string;
          components?: { block?: unknown };
          fields?: unknown;
        }[];
      };
      assert.equal(
        rich.components,
        undefined,
        "Use native input, toolbar, resize and fullscreen",
      );
      const block = rich.of.find((member) => member.type === "block")!;
      assert.equal(block.components?.block, AboutTextBlock);
      assert.equal(
        block.fields,
        undefined,
        "Installed Sanity rejects block field extensions",
      );
      assert.ok(type.fields!.find((f) => f.name === `${field.name}Alignments`));
    }
  }
  const post = compiled.get("post") as {
    fields: {
      name: string;
      type: { of?: { name: string; components?: unknown }[] };
    }[];
  };
  const postBlock = post.fields
    .find((field) => field.name === "body")!
    .type.of!.find((type) => type.name === "block")!;
  assert.equal(postBlock.components, undefined);
});

test("optional image widths preserve intrinsic dimensions and reject unsafe sizes and presentation values", () => {
  for (const section of sections) {
    const legacy = aboutSectionSchema.parse(section);
    assert.equal(legacy.imageWidth, undefined);
    const base = renderToStaticMarkup(
      createElement(AboutSectionsFixture, { section: legacy }),
    );
    assert.doesNotMatch(
      base,
      /--about-image-width|about-authored-section--sized|text-align/,
    );
    for (const imageWidth of [160, 600, 800]) {
      const sized = aboutSectionSchema.parse({ ...section, imageWidth });
      const html = renderToStaticMarkup(
        createElement(AboutSectionsFixture, { section: sized }),
      );
      assert.ok(html.includes(`--about-image-width:${imageWidth}px`));
      assert.ok(html.includes("about-authored-section--sized"));
      assert.ok(html.includes('width="1640" height="1294"'));
      assert.deepEqual(sized.image, legacy.image);
    }
    for (const imageWidth of [0, 159, 801, 1.5, "600", Infinity])
      assert.equal(
        aboutSectionSchema.safeParse({ ...section, imageWidth }).success,
        false,
      );
  }
  for (const alignment of ["justify", "middle", "center;display:none"]) {
    assert.equal(
      aboutSectionSchema.safeParse({
        ...sections[0],
        headlineAlignment: alignment,
      }).success,
      false,
    );
    assert.equal(
      aboutSectionSchema.safeParse({
        ...sections[1],
        rightHeadlineAlignment: alignment,
      }).success,
      false,
    );
    assert.equal(
      aboutSectionSchema.safeParse({
        ...sections[0],
        bodyAlignments: [
          { _type: "aboutTextAlignment", _key: "paragraph", alignment },
        ],
      }).success,
      false,
    );
  }
});
