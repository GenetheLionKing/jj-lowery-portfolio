import {
  seedAbout,
  seedArticles,
  seedCases,
  seedResources,
  seedResume,
} from "./seed";
type Document = Record<string, unknown>;

// Adds Sanity array keys/object types without changing public text or measurements.
function decorate(value: unknown, field = "root"): unknown {
  if (Array.isArray(value))
    return value.map((item, index) => {
      const decorated = decorate(item, field);
      if (
        !decorated ||
        typeof decorated !== "object" ||
        Array.isArray(decorated)
      )
        return decorated;
      const object = decorated as Record<string, unknown>;
      const type =
        field === "blocks" && typeof object.type === "string"
          ? `case${object.type[0].toUpperCase()}${object.type.slice(1)}`
          : `${field}Item`;
      return { _type: type, _key: `${field}-${index}`, ...object };
    });
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, decorate(item, key)]),
    );
  return value;
}

/** Local generation only. Import is deliberately a separate owner-authorized action. */
export function migrationDocuments(): Document[] {
  const existingAbout = {
    ...seedAbout,
    lead: seedAbout.introduction[1],
    story: [],
    strengths: [],
    facts: [],
    life: [],
    builds: [],
  };
  const doc = (id: string, type: string, content: object): Document => {
    const data = decorate(content) as Document;
    return {
      ...data,
      ...(typeof data.slug === "string"
        ? { slug: { _type: "slug", current: data.slug } }
        : {}),
      _id: id,
      _type: type,
    };
  };
  return [
    doc("about", "about", existingAbout),
    doc("resume", "resume", seedResume),
    ...seedCases.map((study, order) =>
      doc(`case-${study.slug}`, "post", { ...study, kind: "caseStudy", order }),
    ),
    doc("drafts.about", "about", seedAbout),
    ...seedArticles.map((article, order) =>
      doc(`drafts.article-${article.slug}`, "post", {
        ...article,
        artwork: article.image,
        image: undefined,
        kind: "article",
        order,
      }),
    ),
    // Curated resource selections are also review proposals, not auto-published imports.
    ...seedResources.map((resource, order) =>
      doc(`drafts.resource-${resource.slug}`, "resource", {
        ...resource,
        order,
      }),
    ),
  ];
}
