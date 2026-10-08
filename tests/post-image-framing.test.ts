import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createClient } from "@sanity/client";
import { createSchema } from "sanity";
import { articleSchema, caseSchema, type FramedImage } from "../content/model";
import { seedArticles, seedCases } from "../content/seed";
import { nativePostData } from "../content/native-post";
import { previewPost } from "../content/preview-post";
import { decodePublishedContent, publishedQuery } from "../content/read";
import { blogItems } from "../content/catalog";
import { postArticle } from "../content/article";
import {
  imageThumbnail,
  postThumbnailSizes,
  postThumbnailPreviews,
} from "../content/image-thumbnail";
import { BlogFeature } from "../components/blog-feature";
import { PortfolioGrid } from "../components/portfolio-grid";
import { ReadingArticlePage } from "../components/reading-article";
import { schemaTypes } from "../studio/schema";

const config = { projectId: "validation", dataset: "portfolio" };
const crop = { top: 0.1, right: 0, bottom: 0.2, left: 0 };
const hotspot = { x: 0.5, y: 0.2, width: 0.2, height: 0.1 };
const image: FramedImage = {
  src: "https://cdn.sanity.io/images/validation/portfolio/abc-1000x2000.jpg",
  alt: "Framing fixture",
  width: 1000,
  height: 2000,
  crop,
  hotspot,
};
const nativeImage = {
  _type: "image",
  asset: { _type: "reference", _ref: "image-abc-1000x2000-jpg" },
  alt: image.alt,
  crop: { _type: "sanity.imageCrop", ...crop },
  hotspot: { _type: "sanity.imageHotspot", ...hotspot },
};
const nativeRequire = createRequire(
  createRequire(import.meta.url).resolve("sanity"),
);
const imgAttributes = (html: string) =>
  [...html.matchAll(/<img\b([^>]*)>/g)].map((match) =>
    Object.fromEntries(
      [...match[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map((attribute) => [
        attribute[1],
        attribute[2].replaceAll("&amp;", "&"),
      ]),
    ),
  );

test("Post framing survives native, Studio Preview, published and catalog adapters without mutating source", () => {
  for (const kind of ["article", "caseStudy"] as const) {
    const source = {
      ...(kind === "article" ? seedArticles[0] : seedCases[0]),
      _id: `framing-${kind}`,
      _type: "post",
      kind,
      mainImage: nativeImage,
      tags: ["blog"],
    };
    const original = structuredClone(source);
    const native = (kind === "article" ? articleSchema : caseSchema).parse(
      nativePostData(source, config),
    );
    const preview = previewPost(
      { ...source, _id: `drafts.${source._id}` },
      config,
    );
    const published = decodePublishedContent([
      { ...native, _id: source._id, _type: "post", kind },
    ]);
    const item = blogItems(published.articles, published.cases)[0];
    for (const value of [native.mainImage, preview.mainImage, item.mainImage]) {
      assert.deepEqual(value?.crop, crop);
      assert.deepEqual(value?.hotspot, hotspot);
      assert.equal(value?.src, image.src);
    }
    assert.deepEqual(source, original);
  }
  for (const metadata of [undefined, null]) {
    const old = articleSchema.parse({
      ...seedArticles[0],
      mainImage: { ...image, crop: metadata, hotspot: metadata },
    });
    assert.equal(
      imageThumbnail(old.mainImage!, postThumbnailSizes.blog).includes("h=360"),
      true,
    );
  }
});

test("actual published GROQ retains Main image crop/hotspot and asset dimensions while excluding drafts/releases", async () => {
  const { parse, evaluate } = nativeRequire("groq-js");
  const source = {
    ...seedArticles[0],
    _id: "framing-public",
    _type: "post",
    kind: "article",
    tags: ["blog"],
    mainImage: nativeImage,
  };
  const dataset = [
    source,
    { ...source, _id: "drafts.framing-private" },
    { ...source, _id: "versions.release.framing-private" },
    {
      _id: nativeImage.asset._ref,
      _type: "sanity.imageAsset",
      url: image.src,
      metadata: { dimensions: { width: image.width, height: image.height } },
    },
  ];
  const original = structuredClone(dataset);
  const projected = await (
    await evaluate(parse(publishedQuery), { dataset })
  ).get();
  const published = decodePublishedContent(projected);
  assert.equal(published.articles.length, 1);
  assert.deepEqual(published.articles[0].mainImage, image);
  assert.deepEqual(dataset, original);
});

test("featured/archive 16:9 crops and existing 4:3 cards retain chosen hotspots for portrait, landscape and square images", () => {
  const fixtures = [
    {
      width: 1000,
      height: 2000,
      hotspot: { x: 0.5, y: 0.15, width: 0.2, height: 0.1 },
    },
    { width: 1000, height: 2000, crop, hotspot },
    {
      width: 2400,
      height: 1000,
      hotspot: { x: 0.85, y: 0.5, width: 0.1, height: 0.2 },
    },
    {
      width: 2400,
      height: 1000,
      hotspot: { x: 0.15, y: 0.5, width: 0.1, height: 0.2 },
    },
    {
      width: 1000,
      height: 1000,
      hotspot: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
    },
    {
      width: 1600,
      height: 900,
      hotspot: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 },
    },
  ];
  for (const fixture of fixtures) {
    const value = {
      ...image,
      crop: undefined,
      ...fixture,
      src: `https://cdn.sanity.io/images/validation/portfolio/abc-${fixture.width}x${fixture.height}.jpg`,
    };
    const original = structuredClone(value);
    for (const size of Object.values(postThumbnailSizes)) {
      const url = new URL(imageThumbnail(value, size));
      assert.equal(url.searchParams.get("w"), String(size.width));
      assert.equal(url.searchParams.get("h"), String(size.height));
      assert.equal(url.searchParams.get("fit"), "crop");
      assert.equal(url.searchParams.has("crop"), false);
      const [left, top, width, height] = (
        url.searchParams.get("rect") ?? `0,0,${value.width},${value.height}`
      )
        .split(",")
        .map(Number);
      assert.ok(Math.abs(width / height - size.width / size.height) < 0.004);
      assert.ok(
        left >= 0 &&
          top >= 0 &&
          left + width <= value.width &&
          top + height <= value.height,
      );
      const point = value.hotspot;
      assert.ok(left <= (point.x - point.width / 2) * value.width);
      assert.ok(left + width >= (point.x + point.width / 2) * value.width);
      assert.ok(top <= (point.y - point.height / 2) * value.height);
      assert.ok(top + height >= (point.y + point.height / 2) * value.height);
      if (value.crop) {
        assert.ok(top >= value.crop.top * value.height);
        assert.ok(top + height <= (1 - value.crop.bottom) * value.height);
      }
    }
    assert.deepEqual(value, original);
  }
});

test("Blog feature/archive markup use matching 16:9 thumbnails; shared cards keep 4:3, fallback and image-less behavior", () => {
  const article = articleSchema.parse({
    ...seedArticles[0],
    mainImage: image,
    tags: ["blog"],
  });
  const item = blogItems([article])[0];
  const original = structuredClone(item);
  const feature = renderToStaticMarkup(createElement(BlogFeature, { item }));
  const archive = renderToStaticMarkup(
    createElement(PortfolioGrid, {
      items: [item],
      imageFrame: "blog",
      headingLevel: "h3",
    }),
  );
  const shared = renderToStaticMarkup(
    createElement(PortfolioGrid, { items: [item] }),
  );
  for (const [html, size] of [
    [feature, postThumbnailSizes.featured],
    [archive, postThumbnailSizes.blog],
    [shared, postThumbnailSizes.card],
  ] as const) {
    const picture = imgAttributes(html).find((img) => img.alt === image.alt)!;
    assert.equal(picture.src, imageThumbnail(image, size));
    assert.equal(picture.width, String(size.width));
    assert.equal(picture.height, String(size.height));
    assert.ok(html.includes(item.href.replace(/\/$/, "")));
    assert.ok(html.includes(item.title));
  }
  assert.match(archive, /work-image--blog/);
  assert.doesNotMatch(shared, /work-image--blog/);
  const fallback = {
    ...item,
    mainImage: undefined,
    image: "portfolio" as const,
  };
  const fallbackHtml = renderToStaticMarkup(
    createElement(BlogFeature, { item: fallback }),
  );
  assert.ok(fallbackHtml.includes("/images/work/portfolio.webp"));
  const empty = { ...item, mainImage: undefined, image: undefined };
  assert.doesNotMatch(
    renderToStaticMarkup(createElement(BlogFeature, { item: empty })),
    /blog-feature-image/,
  );
  assert.doesNotMatch(
    renderToStaticMarkup(
      createElement(PortfolioGrid, { items: [empty], imageFrame: "blog" }),
    ),
    /work-image/,
  );
  assert.deepEqual(item, original);
});

test("article cover and inline images retain original URL framing and dimensions with thumbnail metadata present", () => {
  const article = articleSchema.parse({
    ...seedArticles[0],
    mainImage: image,
    body: [
      ...seedArticles[0].body!,
      {
        ...image,
        _type: "image",
        _key: "inline-fixture",
        caption: "Inline fixture caption",
      },
    ],
  });
  const original = structuredClone(article);
  const html = renderToStaticMarkup(
    createElement(ReadingArticlePage, { article: postArticle(article) }),
  );
  const pictures = imgAttributes(html).filter((img) => img.alt === image.alt);
  assert.equal(pictures.length, 2);
  for (const picture of pictures) {
    const url = new URL(picture.src);
    assert.equal(url.pathname, new URL(image.src).pathname);
    assert.equal(url.searchParams.get("w"), "960");
    for (const parameter of ["h", "rect", "fit", "crop", "fp-x", "fp-y"])
      assert.equal(url.searchParams.has(parameter), false);
    assert.equal(picture.width, String(image.width));
    assert.equal(picture.height, String(image.height));
  }
  assert.ok(html.includes("Inline fixture caption"));
  assert.deepEqual(article, original);
});

test("native Main image offers previews matching public frame ratios and validates old/new framing", async () => {
  const { validateDocument } = nativeRequire("@sanity/validation");
  const schema = createSchema({
    name: "post-framing-native",
    types: schemaTypes.map((type) => {
      if (type.name !== "post" || !("fields" in type)) return type;
      return {
        ...type,
        fields: type.fields.map((field) =>
          field.name === "slug"
            ? {
                ...field,
                // Slug uniqueness is unrelated to image framing; keep validation local.
                options: {
                  ...("options" in field &&
                  typeof field.options === "object" &&
                  field.options !== null
                    ? field.options
                    : {}),
                  isUnique: () => true,
                },
              }
            : field,
        ),
      };
    }),
  });
  const post = schema.get("post");
  assert.ok(post && "fields" in post);
  const mainImage = post.fields.find((field) => field.name === "mainImage")!;
  assert.equal(mainImage.fieldset, undefined);
  const options = mainImage.type.options;
  assert.ok(options && "hotspot" in options);
  assert.deepEqual(options.hotspot, { previews: postThumbnailPreviews });
  for (const main of [
    undefined,
    nativeImage,
    { ...nativeImage, crop: null, hotspot: null },
    { ...nativeImage, crop: undefined, hotspot: undefined },
  ]) {
    const result = await validateDocument({
      document: {
        ...seedArticles[0],
        _id: "drafts.framing-test",
        _type: "post",
        kind: "article",
        slug: { _type: "slug", current: seedArticles[0].slug },
        artwork: seedArticles[0].image,
        image: undefined,
        mainImage: main,
      },
      schema,
      client: createClient({
        ...config,
        apiVersion: "2026-10-01",
        useCdn: false,
        requestHandler: async () => {
          throw Error("Local validation must not contact CMS");
        },
      }),
      customValidation: true,
      getDocumentExists: async () => true,
    });
    assert.equal(result.status, "passed", JSON.stringify(result.markers));
  }
  for (const framing of [
    { crop: { ...crop, top: -0.1 } },
    { crop: { ...crop, left: 0.5, right: 0.5 } },
    { hotspot: { ...hotspot, x: 1.1 } },
  ])
    assert.equal(
      articleSchema.safeParse({
        ...seedArticles[0],
        mainImage: { ...image, ...framing },
      }).success,
      false,
    );
});
