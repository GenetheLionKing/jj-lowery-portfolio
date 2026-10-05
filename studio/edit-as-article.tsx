import { useDocumentOperation, type DocumentActionComponent } from "sanity";
import { caseSchema } from "../content/model";
import { legacyArticleBody } from "../content/article";

/** Explicit editor action. Original structured fields stay in the document. */
export const EditAsArticle: DocumentActionComponent = ({
  id,
  type,
  draft,
  published,
  onComplete,
}) => {
  const operation = useDocumentOperation(id, type);
  const doc = draft ?? published;
  if (type !== "post" || doc?.kind !== "caseStudy" || doc.body) return null;
  const source = caseSchema.safeParse({
    ...doc,
    slug:
      typeof doc.slug === "object" && doc.slug
        ? (doc.slug as { current?: string }).current
        : doc.slug,
    mainImage: undefined,
  });
  return {
    label: "Edit as article",
    disabled: !!operation.patch.disabled || !source.success,
    onHandle: () => {
      if (source.success)
        operation.patch.execute([
          { set: { body: legacyArticleBody(source.data) } },
        ]);
      onComplete();
    },
  };
};
