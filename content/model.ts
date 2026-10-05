import { z } from "zod";
import { isSafeLink } from "./urls";

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

export const caseSchema = z.object({
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
  mainImage: postImageSchema.optional(),
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
      (sections) => new Set(sections.map((s) => s.id)).size === sections.length,
      "Section anchors must be unique",
    ),
  cardTitle: text,
  cardSubtitle: text,
  thumbnail: media.optional(),
  featured: z.boolean().default(false),
  learn: z.boolean().default(false),
  tags,
  ...seo,
});

export const richTextSchema = z
  .array(
    z.object({
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
    }),
  )
  .max(300);

export const articleSchema = z.object({
  slug,
  title: text,
  summary: text,
  body: richTextSchema.min(1),
  image: media.optional(),
  mainImage: postImageSchema.optional(),
  tags,
  learn: z.boolean().default(true),
  featured: z.boolean().default(false),
  publishedAt: z.iso.datetime({ offset: true }).optional(),
  order: z.number().finite().optional(),
  format: z.enum(["article", "guide"]).default("article"),
  ...seo,
});
export const resourceSchema = z.object({
  slug,
  title: text,
  summary: text,
  url: link.refine((v) => v.startsWith("https://")),
  tags,
  ...seo,
});
export const aboutSchema = z.object({
  title: text,
  lead: text,
  introduction: texts,
  storyTitle: text,
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
  storyLinkLabel: text,
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
export type About = z.infer<typeof aboutSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type RichText = z.infer<typeof richTextSchema>;
export type PublicContent = {
  mode: "seed" | "sanity";
  about: About | null;
  resume: Resume | null;
  cases: PublishingCase[];
  articles: Article[];
  resources: Resource[];
};
