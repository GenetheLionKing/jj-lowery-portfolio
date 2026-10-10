import { z } from "zod";
import { isSafeLink } from "./urls";
import { postCtaFields, validatePostCta } from "./post-cta";
import { skillTreeIssue, skillTreeLimits } from "./about-skill-tree";
import {
  aboutCarouselImageLimit,
  aboutImageWidthBounds,
  textAlignments,
} from "./about-presentation";

const text = z.string().trim().min(1).max(12000);
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const texts = z.array(text).max(100).default([]);
const tags = z.array(slug).max(12).default([]);
const media = z.enum([
  "portrait",
  "vector-income",
  "vector-validation",
  "portfolio",
]);
const link = text.refine(isSafeLink, "Use a local path, anchor or HTTPS URL");
export const postImageSchema = z.object({
  src: link.refine(
    (value) =>
      /^\/images\/[a-z0-9/-]+\.(webp|jpg|png)$/.test(value) ||
      /^https:\/\/cdn\.sanity\.io\/images\/[a-z0-9]+\/[a-z0-9_-]+\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/.test(
        value,
      ),
    "Use public local or Sanity image assets",
  ),
  alt: text,
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
});
const imageFraction = z.number().min(0).max(1);
const imageCropSchema = z
  .object({
    top: imageFraction,
    right: imageFraction,
    bottom: imageFraction,
    left: imageFraction,
  })
  .refine(
    (crop) => crop.left + crop.right < 1 && crop.top + crop.bottom < 1,
    "The crop must retain part of the image",
  );
const imageHotspotSchema = z.object({
  x: imageFraction,
  y: imageFraction,
  width: imageFraction,
  height: imageFraction,
});
export const framedImageSchema = postImageSchema.extend({
  crop: imageCropSchema.nullish(),
  hotspot: imageHotspotSchema.nullish(),
});
const pair = z.object({ label: text, value: text });
const seo = { seoTitle: text.optional(), seoDescription: text.optional() };
const comparison = z.object({ title: text, items: texts });
const diagram = z.enum(["budget", "income", "performance"]);

export const caseBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), paragraphs: texts }),
  z.object({ type: z.literal("list"), items: texts }),
  z.object({ type: z.literal("principle"), text, label: text.optional() }),
  z.object({
    type: z.literal("flow"),
    steps: z
      .array(z.object({ title: text, description: text.optional() }))
      .max(30),
  }),
  z.object({
    type: z.literal("comparison"),
    before: comparison,
    after: comparison,
  }),
  z.object({ type: z.literal("diagram"), kind: diagram }),
  z.object({
    type: z.literal("rules"),
    items: z.array(z.object({ when: text, then: text })).max(50),
  }),
  z.object({
    type: z.literal("formulas"),
    items: z.array(z.object({ label: text, formula: text })).max(30),
    note: text,
  }),
  z.object({ type: z.literal("facts"), items: z.array(pair).max(30) }),
]);

const proseBlockSchema = z.object({
  _type: z.literal("block"),
  _key: text,
  style: z.enum(["normal", "h2", "h3", "blockquote"]).default("normal"),
  listItem: z.enum(["bullet", "number"]).optional(),
  level: z.number().int().min(1).max(4).optional(),
  children: z
    .array(
      z.object({
        _type: z.literal("span"),
        _key: text,
        text: z.string().max(12000),
        marks: z.array(text).default([]),
      }),
    )
    .max(200),
  markDefs: z
    .array(z.object({ _type: z.literal("link"), _key: text, href: link }))
    .max(50)
    .default([]),
});

const richImageSchema = postImageSchema.extend({
  _type: z.literal("image"),
  _key: text,
  caption: z.string().max(12000).nullish(),
});

export const richTextSchema = z
  .array(
    z.discriminatedUnion("_type", [
      proseBlockSchema,
      richImageSchema,
      z.object({
        _type: z.literal("systemDiagram"),
        _key: text,
        kind: diagram,
      }),
    ]),
  )
  .max(300);

// About uses the same Portable Text contract, with prose and images only.
const alignment = z.enum(textAlignments).optional();
export const aboutOptionalBodySchema = z
  .array(z.discriminatedUnion("_type", [proseBlockSchema, richImageSchema]))
  .max(300);
export const aboutBodySchema = aboutOptionalBodySchema
  .min(1)
  .refine(
    (body) =>
      body.some(
        (block) =>
          block._type === "image" ||
          block.children.some((span) => span.text.trim()),
      ),
    "Write the section body",
  );
const sectionFields = {
  _key: text,
  image: postImageSchema,
  imageWidth: z
    .number()
    .int()
    .min(aboutImageWidthBounds.min)
    .max(aboutImageWidthBounds.max)
    .optional(),
};
const blockAlignments = z
  .array(
    z.object({
      _type: z.literal("aboutTextAlignment"),
      _key: text,
      alignment: z.enum(textAlignments),
    }),
  )
  .max(300)
  .refine(
    (items) => new Set(items.map((item) => item._key)).size === items.length,
    "Paragraph alignment keys must be unique",
  )
  .optional();
export const aboutCarouselImageSchema = postImageSchema.extend({
  _key: text,
  caption: z.string().max(12000).nullish(),
});
export const aboutCarouselImagesSchema = z
  .array(aboutCarouselImageSchema)
  .max(aboutCarouselImageLimit)
  .refine(
    (images) => new Set(images.map((item) => item._key)).size === images.length,
    "Carousel image keys must be unique",
  );
export const aboutSkillNodeSchema = z.object({
  _key: text,
  _type: z.literal("aboutSkillNode"),
  name: z.string().trim().min(1).max(skillTreeLimits.name),
  tier: z.number().int().min(1).max(skillTreeLimits.tiers).default(1),
  status: z.enum(["locked", "unlocked"]),
  currentRank: z.number().int().min(1).max(4).optional(),
  badge: postImageSchema,
  body: aboutBodySchema,
  ranks: z.object({
    _type: z.literal("aboutSkillRanks"),
    rank1: aboutBodySchema,
    rank2: aboutBodySchema,
    rank3: aboutBodySchema,
    rank4: aboutBodySchema,
  }),
  prerequisite: z.string().trim().max(12000).nullish(),
});
export const aboutSkillTreeSchema = z.object({
  _key: text,
  _type: z.literal("aboutSkillTree"),
  title: z.string().trim().min(1).max(120),
  headerColor: z.enum(["emerald", "indigo", "amber", "rose"]).default("emerald"),
  nodes: z.array(aboutSkillNodeSchema).max(skillTreeLimits.nodes).nullish().transform((nodes) => nodes ?? []),
}).superRefine((tree, context) => {
  const issue = skillTreeIssue(tree.nodes);
  if (issue) context.addIssue({ code: "custom", path: ["nodes"], message: issue });
});
export const aboutSkillTreesSchema = z.array(aboutSkillTreeSchema).max(skillTreeLimits.trees).refine(
  (trees) => new Set(trees.map((tree) => tree._key)).size === trees.length,
  "Skill tree keys must be unique",
);
export const aboutSectionSchema = z.discriminatedUnion("_type", [
  z.object({
    ...sectionFields,
    _type: z.literal("aboutImageLeft"),
    headline: text,
    headlineAlignment: alignment,
    body: aboutBodySchema,
    bodyAlignments: blockAlignments,
  }),
  z.object({
    ...sectionFields,
    _type: z.literal("aboutCopyImageCopy"),
    leftHeadline: text,
    leftHeadlineAlignment: alignment,
    leftBody: aboutBodySchema,
    leftBodyAlignments: blockAlignments,
    rightHeadline: text,
    rightHeadlineAlignment: alignment,
    rightBody: aboutBodySchema,
    rightBodyAlignments: blockAlignments,
  }),
  z.object({
    ...sectionFields,
    _type: z.literal("aboutImageRight"),
    headline: text,
    headlineAlignment: alignment,
    body: aboutBodySchema,
    bodyAlignments: blockAlignments,
  }),
  z.object({
    ...sectionFields,
    _type: z.literal("aboutImageOnly"),
    caption: z.string().max(12000).nullish(),
  }),
  z.object({
    _type: z.literal("aboutImageCarousel"),
    _key: text,
    headline: z.string().trim().max(12000).nullish(),
    headlineAlignment: alignment,
    body: aboutOptionalBodySchema.nullish(),
    bodyAlignments: blockAlignments,
    images: aboutCarouselImagesSchema
      .nullish()
      .transform((images) => images ?? []),
  }),
  z.object({
    _type: z.literal("aboutSkillsCarousel"),
    _key: text,
    headline: z.string().trim().max(12000).nullish(),
    headlineAlignment: alignment,
    body: aboutOptionalBodySchema.nullish(),
    bodyAlignments: blockAlignments,
    trees: aboutSkillTreesSchema.nullish().transform((trees) => trees ?? []),
  }),
]);

export const caseSchema = z
  .object({
    ...postCtaFields,
    slug,
    number: text,
    company: text,
    title: text,
    subtitle: text,
    summary: text,
    category: text,
    diagram: diagram.optional(),
    image: z
      .object({
        src: link.refine((value) =>
          /^\/images\/work\/[a-z0-9-]+\.webp$/.test(value),
        ),
        alt: text,
      })
      .optional(),
    mainImage: framedImageSchema.optional(),
    body: richTextSchema.min(1).optional(),
    publishedAt: z.iso.datetime({ offset: true }).optional(),
    updatedAt: z.iso.datetime({ offset: true }).optional(),
    metadata: z.array(pair).max(30).default([]),
    skills: texts,
    sections: z
      .array(
        z.object({
          id: slug.refine((value) => value !== "skills"),
          title: text,
          lead: text.optional(),
          blocks: z.array(caseBlockSchema).min(1).max(50),
        }),
      )
      .min(1)
      .max(30)
      .refine(
        (sections) =>
          new Set(sections.map((s) => s.id)).size === sections.length,
        "Section anchors must be unique",
      ),
    order: z.number().finite().optional(),
    cardTitle: text,
    cardSubtitle: text,
    thumbnail: media.optional(),
    featured: z.boolean().default(false),
    learn: z.boolean().default(false),
    tags,
    ...seo,
  })
  .superRefine(validatePostCta);

export const articleSchema = z
  .object({
    ...postCtaFields,
    slug,
    title: text,
    summary: text,
    body: richTextSchema.default([]),
    destination: z.enum(["article", "external", "custom"]).default("article"),
    externalUrl: link.refine((v) => v.startsWith("https://")).optional(),
    customPage: z.enum(["/", "/about/", "/resume/", "/contact/"]).optional(),
    image: media.optional(),
    mainImage: framedImageSchema.optional(),
    tags,
    learn: z.boolean().default(true),
    featured: z.boolean().default(false),
    publishedAt: z.iso.datetime({ offset: true }).optional(),
    updatedAt: z.iso.datetime({ offset: true }).optional(),
    order: z.number().finite().optional(),
    format: z.enum(["article", "guide"]).default("article"),
    ...seo,
  })
  .superRefine((value, ctx) => {
    validatePostCta(value, ctx);
    if (value.destination === "article" && !value.body.length)
      ctx.addIssue({
        code: "custom",
        path: ["body"],
        message: "Write the article body",
      });
    if (value.destination === "external" && !value.externalUrl)
      ctx.addIssue({
        code: "custom",
        path: ["externalUrl"],
        message: "Choose the external HTTPS destination",
      });
    if (value.destination === "custom" && !value.customPage)
      ctx.addIssue({
        code: "custom",
        path: ["customPage"],
        message: "Choose an existing custom page",
      });
  });
export const resourceSchema = z.object({
  slug,
  title: text,
  summary: text,
  url: link.refine((v) => v.startsWith("https://")),
  tags,
  ...seo,
});
const legacyAboutText = z.string().trim().max(12000).default("");
export const aboutGalleryImageSchema = framedImageSchema.extend({
  _key: text,
  caption: z.string().max(12000).nullish(),
});
export const aboutGallerySchema = z
  .array(aboutGalleryImageSchema)
  .max(6)
  .refine(
    (images) =>
      new Set(images.map((image) => image._key)).size === images.length,
    "Gallery image keys must be unique",
  );
export const aboutSchema = z
  .object({
    title: text,
    lead: legacyAboutText,
    introduction: texts,
    gallery: aboutGallerySchema.default([]),
    storyTitle: legacyAboutText,
    story: texts,
    strengths: z
      .array(z.object({ title: text, summary: text }))
      .max(8)
      .default([]),
    facts: z.array(pair).max(8).default([]),
    life: z
      .array(z.object({ title: text, copy: text }))
      .max(6)
      .default([]),
    builds: z.array(slug).max(6).default([]),
    storyLinkLabel: legacyAboutText,
    sections: z
      .array(aboutSectionSchema)
      .refine(
        (sections) =>
          new Set(sections.map((section) => section._key)).size ===
          sections.length,
        "Section keys must be unique",
      )
      .optional(),
  })
  .superRefine((about, ctx) => {
    if (about.sections !== undefined) return;
    for (const name of ["lead", "storyTitle", "storyLinkLabel"] as const) {
      if (!about[name])
        ctx.addIssue({
          code: "custom",
          path: [name],
          message: "Required for the existing About layout",
        });
    }
  });
export const resumeSchema = z.object({
  name: text,
  role: text,
  location: text,
  summary: text,
  skillGroups: z
    .array(z.object({ title: text, skills: texts }))
    .max(8)
    .default([]),
  experience: z
    .array(z.object({ title: text, company: text, dates: text }))
    .max(30)
    .default([]),
  selectedProjects: z.array(slug).max(12).default([]),
});

export type PublishingCase = z.infer<typeof caseSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type About = z.infer<typeof aboutSchema>;
export type AboutGalleryImage = z.infer<typeof aboutGalleryImageSchema>;
export type AboutCarouselImage = z.infer<typeof aboutCarouselImageSchema>;
export type PublicImage = z.infer<typeof postImageSchema>;
export type AboutSkillNode = z.infer<typeof aboutSkillNodeSchema>;
export type AboutSkillTree = z.infer<typeof aboutSkillTreeSchema>;
export type FramedImage = z.infer<typeof framedImageSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type RichText = z.infer<typeof richTextSchema>;
export type AboutBody = z.infer<typeof aboutBodySchema>;
export type PublicContent = {
  mode: "seed" | "sanity";
  about: About | null;
  resume: Resume | null;
  cases: PublishingCase[];
  articles: Article[];
  resources: Resource[];
};
