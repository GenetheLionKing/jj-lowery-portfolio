import { defineField } from "sanity";
import { isSafeLink } from "../content/urls";
import { AboutTextBlock } from "./about-text-block";

const string = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required().max(12000),
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

/** Retain Sanity's native Portable Text input, resizing and fullscreen controls. */
export function richTextField(
  name: string,
  title: string,
  diagrams = true,
  aboutAlignment = false,
) {
  return defineField({
    name,
    title,
    type: "array",
    validation: (rule) => rule.required().max(300),
    of: [
      {
        type: "image",
        title: "Image",
        options: { accept: "image/jpeg,image/png,image/webp" },
        fields: [
          string("alt", "Alternative text"),
          paragraph("caption", "Caption (optional)", false),
        ],
      },
      ...(diagrams ? [{ type: "systemDiagram" }] : []),
      {
        type: "block",
        ...(aboutAlignment
          ? {
              components: { block: AboutTextBlock },
            }
          : {}),
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
  });
}
