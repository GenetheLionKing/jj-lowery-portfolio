import { z } from "zod";
import { isSafeLink } from "./urls";

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      value == null || (typeof value === "string" && !value.trim())
        ? undefined
        : value,
    z.string().trim().min(1).max(max).optional(),
  );
export const postCtaFields = {
  ctaText: optionalText(80),
  ctaUrl: optionalText(2048).refine(
    (value) => !value || isSafeLink(value),
    "Use a local path, anchor or HTTPS URL without credentials",
  ),
};
export function validatePostCta(
  value: { ctaText?: string; ctaUrl?: string },
  ctx: z.RefinementCtx,
) {
  if (value.ctaText && !value.ctaUrl)
    ctx.addIssue({
      code: "custom",
      path: ["ctaUrl"],
      message: "Add a destination URL or clear the button text",
    });
  if (value.ctaUrl && !value.ctaText)
    ctx.addIssue({
      code: "custom",
      path: ["ctaText"],
      message: "Add button text or clear the destination URL",
    });
}
export const postCtaSchema = z
  .object(postCtaFields)
  .superRefine(validatePostCta);
