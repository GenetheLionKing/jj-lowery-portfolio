import { defineField, defineType } from "sanity";
import { aboutBodySchema, aboutSkillTreeSchema, postImageSchema } from "../content/model";
import { skillTreeLimits } from "../content/about-skill-tree";
import { nativeImageData, nativeRichTextData } from "../content/native-media";
import { nativeSkillTreeData } from "../content/native-about";
import { richTextField } from "./rich-text";
import { SkillPrerequisiteInput } from "./skill-prerequisite-input";

const skillBody = (name: string, title: string) => ({
  ...richTextField(name, title, false),
  validation: (rule: import("sanity").Rule) => rule.required().max(300).custom((value) => {
    if (value == null) return true;
    try {
      const result = aboutBodySchema.safeParse(nativeRichTextData(value, { projectId: "validation", dataset: "portfolio" }));
      return result.success ? true : `Write ${title.toLowerCase()} with valid text or images`;
    } catch (error) { return error instanceof Error ? error.message : "Invalid description image"; }
  }),
});

export const aboutSkillTypes = [
  defineType({
    name: "aboutSkillRanks",
    title: "Rank descriptions",
    type: "object",
    fields: [1, 2, 3, 4].map((rank) => skillBody(`rank${rank}`, `Rank ${rank}`)),
  }),
  defineType({
    name: "aboutSkillNode",
    title: "Skill",
    type: "object",
    fields: [
      defineField({
        name: "name", title: "Skill name", type: "string",
        description: "Use up to 32 characters for the visible badge name. Put the explanation in Skill description.",
        validation: (rule) => rule.required().max(skillTreeLimits.name),
      }),
      defineField({
        name: "tier", title: "Tier / badge row", type: "number", initialValue: 1,
        options: { list: [1, 2, 3, 4].map((value) => ({ title: `Tier ${value}`, value })) },
        description: "Place up to five skills in each tier. Row placement is independent of a skill’s rank. A prerequisite must come from an earlier tier.",
        validation: (rule) => rule.integer().min(1).max(skillTreeLimits.tiers),
      }),
      defineField({
        name: "status", title: "Badge state", type: "string",
        options: { layout: "radio", list: [{ title: "Locked", value: "locked" }, { title: "Unlocked", value: "unlocked" }] },
        description: "Choose JJ’s authored badge state. Locked badges remain selectable and all details stay readable. No state is inferred.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "badge", title: "Badge image", type: "image",
        options: { accept: "image/jpeg,image/png,image/webp" },
        description: "Upload distinct artwork for this badge. The full artwork appears inside a consistent shield frame. Upload only artwork intended to be public, including on drafts.",
        fields: [defineField({ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required().max(12000) })],
        validation: (rule) => rule.required().custom((value) => {
          if (!value) return true;
          try {
            return postImageSchema.safeParse(nativeImageData(value, { projectId: "validation", dataset: "portfolio" })).success ? true : "Add a valid badge image and alternative text";
          } catch (error) { return error instanceof Error ? error.message : "Invalid badge image"; }
        }),
      }),
      skillBody("body", "Skill description"),
      defineField({ name: "ranks", title: "Ranks 1–4", type: "aboutSkillRanks", description: "Write a separate description for each rank. Every rank remains readable regardless of badge state or current rank.", validation: (rule) => rule.required() }),
      defineField({
        name: "currentRank", title: "Current rank (optional)", type: "number",
        options: { list: [1, 2, 3, 4].map((value) => ({ title: `Rank ${value}`, value })) },
        description: "Only shown when JJ explicitly chooses a rank. Leave blank to make no claim. This does not set the tier or locked/unlocked state.",
        validation: (rule) => rule.integer().min(1).max(4),
      }),
      defineField({
        name: "prerequisite", title: "Prerequisite (optional)", type: "string",
        description: "Choose the skill this builds on, or leave it independent. Relationships describe JJ’s skills; visitors can read every badge.",
        components: { input: SkillPrerequisiteInput },
      }),
    ],
    preview: { select: { title: "name", media: "badge", subtitle: "status" } },
  }),
  defineType({
    name: "aboutSkillTree", title: "Skill tree / category", type: "object",
    fields: [
      defineField({ name: "title", title: "Category title", type: "string", validation: (rule) => rule.required().max(120) }),
      defineField({
        name: "headerColor", title: "Category header color", type: "string", initialValue: "emerald",
        options: { list: [{ title: "Emerald", value: "emerald" }, { title: "Indigo", value: "indigo" }, { title: "Amber", value: "amber" }, { title: "Rose", value: "rose" }] },
        description: "Changes only this category’s shallow header. The four tier background colors stay consistent across every category and adapt to the site theme.",
      }),
      defineField({
        name: "nodes", title: "Skills", type: "array", of: [{ type: "aboutSkillNode" }],
        options: { sortable: true, layout: "list" },
        description: "Add up to 20 skills across four tiers, with up to five skills per tier. Drag to change the order within each tier. Prerequisites are optional.",
        validation: (rule) => rule.max(skillTreeLimits.nodes),
      }),
    ],
    validation: (rule) => rule.custom((value) => {
      if (!value) return true;
      try {
        const result = aboutSkillTreeSchema.safeParse(nativeSkillTreeData(value, { projectId: "validation", dataset: "portfolio" }));
        return result.success ? true : result.error.issues[0].message;
      } catch (error) { return error instanceof Error ? error.message : "Invalid skill tree"; }
    }),
    preview: { select: { title: "title", media: "nodes.0.badge" } },
  }),
];
