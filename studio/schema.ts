import { defineField, defineType, type FieldDefinition } from "sanity";
import type { ZodType } from "zod";
import {
  aboutSchema,
  resumeSchema,
  articleSchema,
  caseSchema,
  resourceSchema,
} from "../content/model";
function validateModel(value: unknown, schema: ZodType) {
  const doc =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : null;
  const result = schema.safeParse(
    doc && doc.slug && typeof doc.slug === "object"
      ? { ...doc, slug: (doc.slug as Record<string, unknown>).current }
      : value,
  );
  return result.success
    ? true
    : result.error.issues
        .slice(0, 3)
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
}
import { mediaKeys, publicMedia, topicLabels } from "../content/media";
import { isSafeLink, isPublicImageAssetRef } from "../content/urls";

const string = (
  name: string,
  title: string,
  required = true,
  description?: string,
) =>
  defineField({
    name,
    title,
    description,
    type: "string",
    validation: (rule) =>
      required ? rule.required().max(12000) : rule.max(12000),
  });
const paragraph = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 3,
    validation: (rule) =>
      required ? rule.required().max(12000) : rule.max(12000),
  });
const textArray = (name: string, title: string, max = 100) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
        type: "text",
        rows: 3,
        validation: (rule) => rule.required().max(12000),
      },
    ],
    validation: (rule) => rule.max(max),
  });
const objects = (
  name: string,
  title: string,
  fields: FieldDefinition[],
  max = 30,
) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "object", name: `${name}Item`, fields }],
    validation: (rule) => rule.max(max),
  });
const pair = [string("label", "Label"), string("value", "Value")];
const toggle = (name: string, title: string) =>
  defineField({ name, title, type: "boolean", initialValue: false });
const media = (name: string, title: string, required = true) =>
  defineField({
    name,
    title,
    type: "string",
    description:
      "Already-public artwork only. Private media must not be uploaded to standard Sanity assets: their URLs are public.",
    options: {
      list: mediaKeys.map((value) => ({
        title: publicMedia[value].alt,
        value,
      })),
    },
    validation: (rule) => (required ? rule.required() : rule),
  });
const slug = defineField({
  name: "slug",
  title: "URL slug",
  type: "slug",
  options: { source: "title", maxLength: 100 },
  description:
    "Lowercase words separated by hyphens. Changing a published URL breaks incoming links; existing case URLs are locked.",
  readOnly: ({ document }) =>
    typeof document?._id === "string" &&
    /^(drafts\.)?case-(vector-income-architecture|vector-performance-investigation|portfolio-design|bgm-budget-pacing)$/.test(
      document._id,
    ),
  validation: (rule) =>
    rule
      .required()
      .custom((value) =>
        value?.current &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) &&
        value.current.length <= 100
          ? true
          : "Use up to 100 lowercase characters separated by hyphens",
      ),
});
const tags = defineField({
  name: "tags",
  title: "Tags & placement",
  description:
    "All ordinary posts appear in Blog. Add placement tags to also show the same post in Learn, Portfolio or the About photo strip. Removing a tag removes only that listing.",
  type: "array",
  of: [
    {
      type: "string",
      options: {
        list: Object.entries({
          "about-gallery": "Show under About hero (image only)",
          learn: "Show in Learn",
          portfolio: "Show in Portfolio",
          home: "Show on homepage (case studies)",
          ...topicLabels,
        }).map(([value, title]) => ({
          value,
          title,
        })),
      },
    },
  ],
  validation: (rule) => rule.max(12).unique(),
});
const editorial = [
  defineField({
    name: "order",
    title: "Display order",
    type: "number",
    description: "Lower numbers appear first.",
    initialValue: 10,
  }),
  tags,
  string("seoTitle", "Search title (optional)", false),
  paragraph("seoDescription", "Search description (optional)", false),
];
const diagram = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    options: { list: ["budget", "income", "performance"] },
  });
const discriminator = (value: string) =>
  defineField({
    name: "type",
    type: "string",
    hidden: true,
    readOnly: true,
    initialValue: value,
    validation: (rule) => rule.required(),
  });
const block = (name: string, title: string, fields: FieldDefinition[]) =>
  defineType({
    name: `case${name}`,
    title,
    type: "object",
    initialValue: { type: name.toLowerCase() },
    fields: [discriminator(name.toLowerCase()), ...fields],
  });
const comparison = (name: string) =>
  defineField({
    name,
    type: "object",
    fields: [string("title", "Title"), textArray("items", "Points")],
  });

const caseBlocks = [
  block("Text", "Paragraphs", [textArray("paragraphs", "Paragraphs")]),
  block("List", "List", [textArray("items", "Items")]),
  block("Principle", "Key principle", [
    paragraph("text", "Principle"),
    string("label", "Label", false),
  ]),
  block("Flow", "Process flow", [
    objects("steps", "Steps", [
      string("title", "Title"),
      paragraph("description", "Description", false),
    ]),
  ]),
  block("Comparison", "Before / after", [
    comparison("before"),
    comparison("after"),
  ]),
  block("Diagram", "System diagram", [diagram("kind", "Diagram")]),
  block("Rules", "Business rules", [
    objects(
      "items",
      "Rules",
      [paragraph("when", "When"), paragraph("then", "Then")],
      50,
    ),
  ]),
  block("Formulas", "Formulas", [
    objects("items", "Formulas", [
      string("label", "Label"),
      paragraph("formula", "Formula"),
    ]),
    paragraph("note", "Qualification / note"),
  ]),
  block("Facts", "Facts with qualifications", [
    objects("items", "Facts", pair),
  ]),
];

const originalTypes = [
  ...caseBlocks,
  defineType({
    name: "about",
    validation: (rule) =>
      rule.custom((value) => validateModel(value, aboutSchema)),
    title: "About",
    type: "document",
    fields: [
      string("title", "Page title"),
      paragraph("lead", "Short introduction"),
      textArray("introduction", "Opening paragraphs"),
      string("storyTitle", "Story title"),
      textArray("story", "Longer story"),
      objects(
        "strengths",
        "Analysis and building",
        [
          string("title", "Title"),
          paragraph("summary", "Evidence / description"),
        ],
        8,
      ),
      objects("facts", "At a glance", pair, 8),
      objects(
        "life",
        "Outside the work",
        [string("title", "Title"), paragraph("copy", "Text")],
        6,
      ),
      textArray("builds", "Current builds — case-study URL slugs", 6),
      string("storyLinkLabel", "Story link label"),
    ],
  }),
  defineType({
    name: "resume",
    validation: (rule) =>
      rule.custom((value) => validateModel(value, resumeSchema)),
    title: "Résumé",
    type: "document",
    fields: [
      string("name", "Name"),
      string("role", "Role"),
      string("location", "Location"),
      paragraph("summary", "Summary"),
      objects(
        "skillGroups",
        "Skill groups",
        [string("title", "Group title"), textArray("skills", "Skills")],
        8,
      ),
      objects("experience", "Experience", [
        string("title", "Title"),
        string("company", "Company"),
        string("dates", "Dates"),
      ]),
      textArray(
        "selectedProjects",
        "Selected systems work — case-study URL slugs",
        12,
      ),
    ],
  }),
  defineType({
    name: "caseStudy",
    validation: (rule) =>
      rule.custom((value) => validateModel(value, caseSchema)),
    title: "Case study",
    type: "document",
    fields: [
      slug,
      string("title", "Title"),
      paragraph("subtitle", "Subtitle"),
      paragraph("summary", "Summary"),
      string("company", "Project / company"),
      string("number", "Case number"),
      string("category", "Category"),
      string("cardTitle", "Card title"),
      string("cardSubtitle", "Card subtitle"),
      media("thumbnail", "Card artwork", false),
      toggle("featured", "Show on Portfolio and homepage"),
      toggle("learn", "Include in Learn"),
      ...editorial,
      diagram("diagram", "Hero diagram (optional)"),
      defineField({
        name: "image",
        title: "Hero image (optional)",
        type: "object",
        description: "Existing public project artwork. Keep the URL local.",
        fields: [
          defineField({
            name: "src",
            type: "string",
            options: {
              list: mediaKeys
                .filter((key) => key !== "portrait")
                .map((key) => ({
                  value: publicMedia[key].src,
                  title: publicMedia[key].alt,
                })),
            },
          }),
          string("alt", "Alternative text"),
        ],
      }),
      objects("metadata", "Project facts", pair),
      textArray("skills", "Demonstrated skills"),
      objects("sections", "Case-study sections", [
        defineField({
          name: "id",
          title: "Section anchor",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
              .custom((value) =>
                value === "skills" ? "The skills anchor is reserved" : true,
              ),
        }),
        string("title", "Title"),
        paragraph("lead", "Introduction", false),
        defineField({
          name: "blocks",
          title: "Content",
          type: "array",
          of: caseBlocks.map((item) => ({ type: item.name })),
          validation: (rule) => rule.max(50),
        }),
      ]),
    ],
    preview: { select: { title: "title", subtitle: "category" } },
  }),
  defineType({
    name: "article",
    validation: (rule) =>
      rule.custom((value) => validateModel(value, articleSchema)),
    title: "Article / blog post",
    type: "document",
    fields: [
      slug,
      string("title", "Title"),
      paragraph("summary", "Short description"),
      media("image", "Card artwork"),
      defineField({
        name: "format",
        type: "string",
        title: "Format",
        initialValue: "article",
        options: { list: ["article", "guide"] },
        validation: (rule) => rule.required(),
      }),
      toggle("learn", "Include in Learn"),
      toggle("featured", "Featured article"),
      defineField({
        name: "publishedAt",
        title: "Publication date (optional)",
        type: "datetime",
        description: "Set when you publish. No invented history.",
      }),
      ...editorial,
      defineField({
        name: "body",
        title: "Article",
        type: "array",
        validation: (rule) => rule.required().max(300),
        of: [
          {
            type: "block",
            styles: [
              { title: "Paragraph", value: "normal" },
              { title: "Heading", value: "h2" },
              { title: "Subheading", value: "h3" },
              { title: "Quote", value: "blockquote" },
            ],
            marks: {
              decorators: [
                { title: "Strong", value: "strong" },
                { title: "Emphasis", value: "em" },
              ],
              annotations: [
                {
                  name: "link",
                  type: "object",
                  title: "Link",
                  fields: [
                    defineField({
                      name: "href",
                      title: "URL",
                      type: "string",
                      validation: (rule) =>
                        rule
                          .required()
                          .custom((value) =>
                            typeof value === "string" && isSafeLink(value)
                              ? true
                              : "Use a local path, anchor or HTTPS URL",
                          ),
                    }),
                  ],
                },
              ],
            },
          },
        ],
      }),
    ],
    preview: { select: { title: "title", subtitle: "format" } },
  }),
  defineType({
    name: "resource",
    validation: (rule) =>
      rule.custom((value) => validateModel(value, resourceSchema)),
    title: "Resource",
    type: "document",
    fields: [
      slug,
      string("title", "Title"),
      paragraph("summary", "Description"),
      defineField({
        name: "url",
        type: "url",
        validation: (rule) =>
          rule
            .required()
            .custom((value) =>
              typeof value === "string" &&
              value.startsWith("https://") &&
              isSafeLink(value)
                ? true
                : "Use an HTTPS resource URL",
            ),
      }),
      ...editorial,
    ],
  }),
];

const caseFields = originalTypes.find(
  (item) => item.name === "caseStudy",
)!.fields!;
const articleFields = originalTypes.find(
  (item) => item.name === "article",
)!.fields!;
const commonNames = new Set([
  "slug",
  "title",
  "summary",
  "order",
  "tags",
  "seoTitle",
  "seoDescription",
]);
const caseOnly = caseFields.filter(
  (field) =>
    !commonNames.has(field.name) &&
    field.name !== "featured" &&
    field.name !== "learn",
);
const articleOnly = articleFields.filter(
  (field) =>
    !commonNames.has(field.name) &&
    field.name !== "featured" &&
    field.name !== "learn",
);
export const schemaTypes = [
  ...originalTypes.filter(
    (item) => item.name !== "article" && item.name !== "caseStudy",
  ),
  defineType({
    name: "post",
    title: "Post",
    type: "document",
    initialValue: { kind: "article", format: "article", tags: [] },
    validation: (rule) =>
      rule.custom((value) => {
        const doc = value as Record<string, unknown> | undefined;
        if (doc?.kind !== "article" && doc?.kind !== "caseStudy")
          return "Choose a post layout";
        // Asset URLs are resolved by the public query; native upload shape is validated here.
        const image = doc.mainImage as
          { asset?: { _ref?: string }; alt?: string } | undefined;
        if (
          image &&
          (!isPublicImageAssetRef(image.asset?._ref) || !image.alt?.trim())
        )
          return "Main image requires JPG, PNG or WebP up to 20000px and alternative text";
        return validateModel(
          {
            ...doc,
            mainImage: undefined,
            image: doc.kind === "article" ? doc.artwork : doc.image,
          },
          doc.kind === "caseStudy" ? caseSchema : articleSchema,
        );
      }),
    fields: [
      defineField({
        name: "kind",
        title: "Post layout",
        type: "string",
        options: {
          list: [
            { title: "Blog post", value: "article" },
            { title: "Structured case study", value: "caseStudy" },
          ],
        },
        initialValue: "article",
        description:
          "A blog post can appear in Portfolio using its tags; the case layout is optional. Existing cases retain their /work/ URLs. Choose before publishing and keep the layout to preserve the URL.",
        readOnly: ({ document }) =>
          /^(drafts\.)?case-/.test(String(document?._id)),
        validation: (rule) => rule.required(),
      }),
      slug,
      string("title", "Title"),
      paragraph("summary", "Short description"),
      defineField({
        name: "mainImage",
        title: "Main image",
        type: "image",
        options: { accept: "image/jpeg,image/png,image/webp" },
        description:
          "Public images only. Standard Sanity image URLs are public, including images attached to drafts. About gallery displays this image and links to the post; no visible caption.",
        fields: [string("alt", "Alternative text")],
      }),
      ...editorial,
      ...articleOnly.map((field) => ({
        ...field,
        ...(field.name === "image"
          ? { name: "artwork", title: "Existing card artwork (optional)" }
          : {}),
        validation: undefined,
        hidden: ({ document }: { document?: Record<string, unknown> }) =>
          document?.kind === "caseStudy",
      })),
      ...caseOnly.map((field) => ({
        ...field,
        validation: undefined,
        hidden: ({ document }: { document?: Record<string, unknown> }) =>
          document?.kind !== "caseStudy",
      })),
    ],
    preview: {
      select: { title: "title", subtitle: "kind", media: "mainImage" },
    },
  }),
];
