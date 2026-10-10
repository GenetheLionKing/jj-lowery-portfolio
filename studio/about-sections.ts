import { defineField, defineType } from "sanity";
import {
  aboutBodySchema,
  aboutCarouselImagesSchema,
  aboutOptionalBodySchema,
  aboutSkillTreesSchema,
  postImageSchema,
} from "../content/model";
import { nativeImageData, nativeRichTextData } from "../content/native-media";
import { AboutSectionsInput } from "./about-sections-input";
import { AboutSectionInput } from "./about-text-block";
import { skillTreeLimits } from "../content/about-skill-tree";
import { nativeSkillTreeData } from "../content/native-about";
import { richTextField } from "./rich-text";
import {
  aboutImageWidthBounds,
  aboutCarouselImageLimit,
  isTextAlignment,
  textAlignments,
} from "../content/about-presentation";

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
const imageWidth = defineField({
  name: "imageWidth",
  title: "Image width (px)",
  type: "number",
  description:
    "Optional: 160–800 pixels. Leave blank for the existing layout. Wider images widen their column and can make the section taller. Narrow screens fit the available width; the full image and its aspect ratio stay intact.",
  validation: (rule) =>
    rule
      .integer()
      .min(aboutImageWidthBounds.min)
      .max(aboutImageWidthBounds.max),
});
const headlineAlignment = (
  name = "headlineAlignment",
  title = "Headline alignment",
) =>
  defineField({
    name,
    title,
    type: "string",
    description:
      "Independent of the body. Blank or Left keeps the existing alignment.",
    options: {
      layout: "radio",
      direction: "horizontal",
      list: textAlignments.map((value) => ({
        title:
          value === "left" ? "Left" : value === "center" ? "Center" : "Right",
        value,
      })),
    },
    validation: (rule) =>
      rule.custom((value) =>
        value == null || isTextAlignment(value)
          ? true
          : "Choose Left, Center or Right",
      ),
  });
const body = (name = "body", title = "Body") => ({
  ...richTextField(name, title, false, true),
  description:
    "Click a paragraph, heading, quote or list item to show Left / Center / Right alignment. Formatting stays in the native editor; resize or expand it for more writing space.",
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
const bodyAlignments = (bodyName = "body") =>
  defineField({
    name: `${bodyName}Alignments`,
    title: "Paragraph alignment settings",
    type: "array",
    hidden: true,
    description:
      "Managed by the native editor's per-paragraph alignment controls.",
    of: [
      {
        name: "aboutTextAlignment",
        type: "object",
        fields: [
          defineField({
            name: "alignment",
            title: "Alignment",
            type: "string",
            options: {
              list: textAlignments.map((value) => ({ title: value, value })),
            },
            validation: (rule) =>
              rule
                .required()
                .custom((value) =>
                  isTextAlignment(value)
                    ? true
                    : "Choose Left, Center or Right",
                ),
          }),
        ],
      },
    ],
    validation: (rule) =>
      rule.max(300).custom((value) => {
        if (!Array.isArray(value)) return true;
        // Sanity's unique() ignores _key, but separate paragraphs can share alignment.
        const keys = value.map((item) =>
          item && typeof item === "object" && "_key" in item
            ? item._key
            : undefined,
        );
        return new Set(keys).size === keys.length
          ? true
          : "Paragraph alignment keys must be unique";
      }),
  });

export const aboutSectionTypes = [
  defineType({
    name: "aboutImageLeft",
    title: "Image left / copy right",
    type: "object",
    components: { input: AboutSectionInput },
    fields: [
      image,
      imageWidth,
      headline(),
      headlineAlignment(),
      body(),
      bodyAlignments(),
    ],
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
    components: { input: AboutSectionInput },
    fields: [
      headline("leftHeadline", "Left headline"),
      headlineAlignment("leftHeadlineAlignment", "Left headline alignment"),
      body("leftBody", "Left body"),
      bodyAlignments("leftBody"),
      image,
      imageWidth,
      headline("rightHeadline", "Right headline"),
      headlineAlignment("rightHeadlineAlignment", "Right headline alignment"),
      body("rightBody", "Right body"),
      bodyAlignments("rightBody"),
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
    components: { input: AboutSectionInput },
    fields: [
      headline(),
      headlineAlignment(),
      body(),
      bodyAlignments(),
      image,
      imageWidth,
    ],
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
      imageWidth,
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
  defineType({
    name: "aboutImageCarousel",
    title: "Image carousel",
    type: "object",
    components: { input: AboutSectionInput },
    fields: [
      defineField({
        name: "headline",
        title: "Headline (optional)",
        type: "string",
        validation: (rule) => rule.max(12000),
      }),
      headlineAlignment(),
      {
        ...richTextField("body", "Body (optional)", false, true),
        validation: (rule: import("sanity").Rule) =>
          rule.max(300).custom((value) => {
            if (value == null) return true;
            try {
              const result = aboutOptionalBodySchema.safeParse(
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
      },
      bodyAlignments(),
      defineField({
        name: "images",
        title: "Carousel images",
        type: "array",
        description:
          "Add up to 18 infographic or other images, then drag to reorder. Each image is shown whole, without cropping, and can be enlarged. Empty carousels are hidden. Upload only images intended to be public; draft attachments are also public assets.",
        options: { layout: "grid", sortable: true },
        of: [
          {
            type: "image",
            title: "Carousel image",
            options: { accept: "image/jpeg,image/png,image/webp" },
            fields: [
              headline("alt", "Alternative text"),
              defineField({
                name: "caption",
                title: "Caption (optional)",
                type: "text",
                rows: 2,
                validation: (rule) => rule.max(12000),
              }),
            ],
            preview: {
              select: { title: "alt", subtitle: "caption", media: "asset" },
            },
          },
        ],
        validation: (rule) =>
          rule.max(aboutCarouselImageLimit).custom((value) => {
            if (!Array.isArray(value)) return true;
            try {
              const result = aboutCarouselImagesSchema.safeParse(
                value.map((item) =>
                  nativeImageData(item, {
                    projectId: "validation",
                    dataset: "portfolio",
                  }),
                ),
              );
              return result.success ? true : result.error.issues[0].message;
            } catch (error) {
              return error instanceof Error ? error.message : "Invalid carousel image";
            }
          }),
      }),
    ],
    preview: {
      select: { title: "headline", media: "images.0" },
      prepare: ({ title, media }) => ({
        title: title || "Image carousel",
        subtitle: "Full images / manual navigation",
        media,
      }),
    },
  }),
  defineType({
    name: "aboutSkillsCarousel",
    title: "Interactive skills carousel",
    type: "object",
    components: { input: AboutSectionInput },
    initialValue: { headline: "My skills" },
    fields: [
      defineField({ name: "headline", title: "Headline", type: "string", initialValue: "My skills", validation: (rule) => rule.max(12000) }),
      headlineAlignment(),
      {
        ...richTextField("body", "Body (optional)", false, true),
        validation: (rule: import("sanity").Rule) => rule.max(300).custom((value) => {
          if (value == null) return true;
          try { const result = aboutOptionalBodySchema.safeParse(nativeRichTextData(value, { projectId: "validation", dataset: "portfolio" })); return result.success ? true : result.error.issues[0].message; }
          catch (error) { return error instanceof Error ? error.message : "Invalid body image"; }
        }),
      },
      bodyAlignments(),
      defineField({ name: "trees", title: "Skill trees / categories", type: "array", of: [{ type: "aboutSkillTree" }], options: { sortable: true, layout: "list" }, description: "Add up to 8 trees and drag to order the slides. Each tree groups related skills. Empty trees and an empty carousel are hidden.",
        validation: (rule) => rule.max(skillTreeLimits.trees).custom((value) => {
          if (!Array.isArray(value)) return true;
          try { const result = aboutSkillTreesSchema.safeParse(value.map((tree) => nativeSkillTreeData(tree, { projectId: "validation", dataset: "portfolio" }))); return result.success ? true : result.error.issues[0].message; }
          catch (error) { return error instanceof Error ? error.message : "Invalid skill tree"; }
        }),
      }),
    ],
    preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: title || "My skills", subtitle: "Selectable badges / manual navigation" }) },
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
