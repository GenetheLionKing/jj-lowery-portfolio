import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { SanityPublicConfig } from "../content/config";
import { schemaTypes } from "./schema";

const singletonTypes = new Set(["about", "resume"]);
export function createStudioConfig(config: SanityPublicConfig) {
  return defineConfig({
    ...config,
    name: "jj-lowery",
    title: "JJ Lowery · Publishing",
    basePath: "/studio",
    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title("Publish")
            .items([
              S.listItem()
                .title("About")
                .child(S.document().schemaType("about").documentId("about")),
              S.listItem()
                .title("Résumé")
                .child(S.document().schemaType("resume").documentId("resume")),
              S.divider(),
              S.documentTypeListItem("post").title(
                "Posts — Blog, Learn & Portfolio",
              ),
              S.documentTypeListItem("resource").title("Resources / Learn"),
            ]),
      }),
    ],
    schema: {
      types: schemaTypes,
      templates: (templates) =>
        templates.filter(
          (template) => !singletonTypes.has(template.schemaType),
        ),
    },
    document: {
      newDocumentOptions: (options) =>
        options.filter((option) => !singletonTypes.has(option.templateId)),
      actions: (actions, context) =>
        singletonTypes.has(context.schemaType)
          ? actions.filter(
              ({ action }) => action !== "duplicate" && action !== "delete",
            )
          : actions,
    },
  });
}
