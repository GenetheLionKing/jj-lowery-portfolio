import { test } from "node:test";
import assert from "node:assert/strict";
import { schemaTypes } from "../studio/schema";
import { migrationDocuments } from "../content/migration";

test("one Post editor has unique fields and no separate article/case authoring types", () => {
  const post = schemaTypes.find((type) => type.name === "post")!;
  const names = post.fields!.map((field) => field.name);
  assert.equal(names.length, new Set(names).size);
  assert.ok(
    !schemaTypes.some(
      (type) => type.name === "article" || type.name === "caseStudy",
    ),
  );
  assert.ok(
    names.includes("mainImage") &&
      names.includes("tags") &&
      names.includes("body") &&
      names.includes("sections"),
  );
});

test("actual Post validator accepts imported records and rejects unsafe native images", () => {
  const post = schemaTypes.find((type) => type.name === "post")!;
  let validate: (value: unknown) => unknown = () => false;
  const rule = {
    custom(fn: typeof validate) {
      validate = fn;
      return rule;
    },
  };
  // Sanity supplies the rule builder; capture the actual document validator.
  (post.validation as (rule: unknown) => unknown)(rule);
  const docs = migrationDocuments().filter((doc) => doc._type === "post");
  for (const doc of docs) assert.equal(validate(doc), true, String(doc._id));
  const article = docs.find((doc) => doc.kind === "article")!;
  for (const extension of ["jpg", "png", "webp"]) {
    assert.equal(
      validate({
        ...article,
        mainImage: {
          asset: { _ref: `image-abc-800x600-${extension}` },
          alt: "Public portrait",
        },
      }),
      true,
    );
  }
  for (const ref of [
    "image-abc-800x600-gif",
    "image-abc-800x600-svg",
    "image-abc-20001x600-jpg",
  ]) {
    assert.notEqual(
      validate({
        ...article,
        mainImage: { asset: { _ref: ref }, alt: "Public portrait" },
      }),
      true,
    );
  }
});

test("hidden legacy subtitle cannot block an Article's visible summary; cases still require their subtitle", () => {
  const post = schemaTypes.find((type) => type.name === "post")!;
  const subtitle = post.fields!.find((field) => field.name === "subtitle")! as {
    hidden: (context: { document: { kind: string } }) => boolean;
    validation?: unknown;
  };
  const hidden = subtitle.hidden;
  assert.equal(hidden({ document: { kind: "article" } }), true);
  assert.equal(hidden({ document: { kind: "caseStudy" } }), false);
  assert.equal(
    subtitle.validation,
    undefined,
    "The hidden legacy field must not carry an unconditional required rule",
  );
  let validate: (value: unknown) => unknown = () => false;
  const rule = {
    custom(fn: typeof validate) {
      validate = fn;
      return rule;
    },
  };
  (post.validation as (rule: unknown) => unknown)(rule);
  const docs = migrationDocuments().filter((doc) => doc._type === "post");
  const article = docs.find((doc) => doc.kind === "article")!;
  assert.ok(article.summary);
  assert.equal(article.subtitle, undefined);
  assert.equal(validate(article), true);
  assert.notEqual(validate({ ...article, summary: undefined }), true);
  const study = docs.find((doc) => doc.kind === "caseStudy")!;
  assert.equal(validate(study), true);
  assert.notEqual(validate({ ...study, subtitle: undefined }), true);
});
