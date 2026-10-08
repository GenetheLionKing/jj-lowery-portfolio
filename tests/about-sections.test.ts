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
