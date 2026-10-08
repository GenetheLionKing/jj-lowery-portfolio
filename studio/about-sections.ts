import { defineField, defineType } from "sanity";
import { aboutBodySchema, postImageSchema } from "../content/model";
import { nativeImageData, nativeRichTextData } from "../content/native-media";
import { AboutSectionsInput } from "./about-sections-input";
import { richTextField } from "./rich-text";

const headline = (name = "headline", title = "Headline") =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required().max(12000),
  });
const image = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { accept: "image/jpeg,image/png,image/webp" },
  description:
    "Add a public image with alternative text. The page shows the whole image.",
  fields: [headline("alt", "Alternative text")],
  validation: (rule) =>
    rule.required().custom((value) => {
      if (!value) return true; // The required rule reports the missing field.
      try {
        const result = postImageSchema.safeParse(
          nativeImageData(value, {
            projectId: "validation",
            dataset: "portfolio",
          }),
        );
        return result.success ? true : "Add a valid image and alternative text";
      } catch (error) {
        return error instanceof Error ? error.message : "Invalid image";
      }
    }),
});
const body = (name = "body", title = "Body") => ({
  ...richTextField(name, title, false),
  description:
    "Rich text. Resize vertically or expand the native editor for more writing space; this does not change the page layout.",
  validation: (rule: import("sanity").Rule) =>
    rule
      .required()
      .max(300)
      .custom((value) => {
        if (!value) return true;
        try {
          const result = aboutBodySchema.safeParse(
            nativeRichTextData(value, {
              projectId: "validation",
              dataset: "portfolio",
            }),
          );
          return result.success ? true : result.error.issues[0].message;
        } catch (error) {
          return error instanceof Error ? error.message : "Invalid body image";
        }
      }),
});

export const aboutSectionTypes = [
  defineType({
    name: "aboutImageLeft",
    title: "Image left / copy right",
    type: "object",
    fields: [image, headline(), body()],
    preview: {
      select: { title: "headline", media: "image" },
      prepare: ({ title, media }) => ({
        title: title || "Untitled section",
        subtitle: "Image left / copy right",
        media,
      }),
    },
  }),
  defineType({
    name: "aboutCopyImageCopy",
    title: "Copy left / image / copy right",
    type: "object",
    fields: [
      headline("leftHeadline", "Left headline"),
      body("leftBody", "Left body"),
      image,
      headline("rightHeadline", "Right headline"),
      body("rightBody", "Right body"),
    ],
    preview: {
      select: { title: "leftHeadline", media: "image" },
      prepare: ({ title, media }) => ({
        title: title || "Untitled section",
        subtitle: "Copy left / image / copy right",
        media,
      }),
    },
  }),
  defineType({
    name: "aboutImageRight",
    title: "Copy left / image right",
    type: "object",
    fields: [headline(), body(), image],
    preview: {
      select: { title: "headline", media: "image" },
      prepare: ({ title, media }) => ({
        title: title || "Untitled section",
        subtitle: "Copy left / image right",
        media,
      }),
    },
  }),
  defineType({
    name: "aboutImageOnly",
    title: "Image only",
    type: "object",
    fields: [
      image,
      defineField({
        name: "caption",
        title: "Caption (optional)",
        type: "text",
        rows: 2,
        validation: (rule) => rule.max(12000),
      }),
    ],
    preview: {
      select: { title: "caption", media: "image" },
      prepare: ({ title, media }) => ({ title: title || "Image only", media }),
    },
  }),
];

export const aboutSectionsField = defineField({
  name: "sections",
  title: "About sections",
  type: "array",
  description:
    "Sections appear below the existing About hero and gallery. Use Add item below to choose a layout, repeat it and drag sections into order. Removing the last section leaves that lower content empty. Unset this field to restore the existing lower content.",
  of: aboutSectionTypes.map((type) => ({ type: type.name })),
  options: {
    sortable: true,
    layout: "list",
    insertMenu: { views: [{ name: "list" }] },
  },
  components: { input: AboutSectionsInput },
});

/** Hidden/collapsed legacy fields must not block a newly authored section page. */
export const legacyAboutField = (
  name: string,
  title: string,
  type = "string",
) =>
  defineField({
    name,
    title,
    type,
    validation: (rule) =>
      rule
        .max(12000)
        .custom((value, context) =>
          context.document?.sections == null &&
          !(typeof value === "string" && value.trim())
            ? "Required for the existing About layout"
            : true,
        ),
  });
