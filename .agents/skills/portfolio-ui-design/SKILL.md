---
name: portfolio-ui-design
description: Apply JJ Lowery's approved editorial Portfolio design using concise Practical UI guidance and rendered desktop/mobile review. Use before changing Portfolio layout, CSS, navigation, cards, articles, forms or Sanity Studio UI. Keep this skill scoped to this repository.
---

# Portfolio UI design

1. Read the root [working instructions](../../../AGENTS.md). State what a visitor or author needs to understand or do, and identify the affected existing pattern.
2. Consult the relevant section of [the Practical UI reference](references/practical-ui.md) before implementation. Use its page references for targeted private study when available; the purchased book is not a checkout dependency.
3. Improve the existing composition. Use hierarchy, spacing, readable type and purposeful imagery; retain shared cards when they represent distinct work. Keep article reading centered and uncomplicated. Preserve meaningful copy and source qualifications while removing duplication within the authorized scope.
4. Reuse the system before adding variants. Start with semantic colors in [globals.css](../../../app/globals.css) and the existing [Portfolio cards](../../../components/portfolio-grid.tsx), [selected-work cards](../../../components/selected-work-grid.tsx), [article template](../../../components/reading-article.tsx) and [rich-text renderer](../../../components/article-body.tsx). Keep interactions, images and theme behavior consistent across surfaces.
5. Preserve the authoring contract. Follow [the established writing workflow](../../../docs/article-review/README.md#atlas-writing-workflow). Keep native rich text, optional images with alt text, independent placement, truthful dates, authenticated Form/Preview and published-only public reads. Present useful validation next to the relevant field; changing a visual layout must not silently convert, publish or overwrite CMS content.
6. Verify the implementation using the root instructions. View actual desktop/mobile screenshots, check realistic long and empty content, and exercise relevant controls, focus and recovery. Recheck performance when assets or client code change; compare equivalent runs and report measurements rather than promises. Keep content visible without animation or hydration prerequisites.
7. Hand back the original design decisions, changed routes/components, checks, reviewed screenshots and any remaining limitations. For documentation-only work, verify the instructions and links without claiming a new visual review.
