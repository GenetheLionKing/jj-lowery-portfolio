import type { SanityPublicConfig } from "./config";
import { nativeImageData, nativeRichTextData } from "./native-media";

export function nativeSkillTreeData(value: unknown, config: SanityPublicConfig) {
  if (!value || typeof value !== "object") return value;
  const tree = value as Record<string, unknown>;
  return {
    ...tree,
    nodes: Array.isArray(tree.nodes) ? tree.nodes.map((value: unknown) => {
      if (!value || typeof value !== "object") return value;
      const node = value as Record<string, unknown>;
      const ranks = node.ranks && typeof node.ranks === "object" ? node.ranks as Record<string, unknown> : undefined;
      return { ...node, badge: nativeImageData(node.badge, config), body: nativeRichTextData(node.body, config), ranks: ranks ? {
        ...ranks,
        ...Object.fromEntries(["rank1", "rank2", "rank3", "rank4"].map((field) => [field, nativeRichTextData(ranks[field], config)])),
      } : node.ranks };
    }) : (tree.nodes ?? []),
  };
}

/** Keep absent sections absent and an explicitly empty list empty. */
export function nativeAboutData(
  doc: Record<string, unknown>,
  config: SanityPublicConfig,
) {
  const data = { ...doc };
  data.gallery = Array.isArray(doc.gallery)
    ? doc.gallery.map((image) => nativeImageData(image, config))
    : (doc.gallery ?? []);
  if (doc.sections == null) {
    delete data.sections;
  } else if (Array.isArray(doc.sections)) {
    data.sections = doc.sections.map((section: unknown) => {
      if (!section || typeof section !== "object") return section;
      const item = section as Record<string, unknown>;
      return {
        ...item,
        image: nativeImageData(item.image, config),
        ...(item._type === "aboutImageCarousel"
          ? {
              images: Array.isArray(item.images)
                ? item.images.map((image) => nativeImageData(image, config))
                : (item.images ?? []),
            }
          : {}),
        ...(item._type === "aboutSkillsCarousel"
          ? { trees: Array.isArray(item.trees) ? item.trees.map((tree) => nativeSkillTreeData(tree, config)) : (item.trees ?? []) }
          : {}),
        ...(item.body !== undefined
          ? { body: nativeRichTextData(item.body, config) }
          : {}),
        ...(item.leftBody !== undefined
          ? { leftBody: nativeRichTextData(item.leftBody, config) }
          : {}),
        ...(item.rightBody !== undefined
          ? { rightBody: nativeRichTextData(item.rightBody, config) }
          : {}),
      };
    });
  }
  return data;
}
