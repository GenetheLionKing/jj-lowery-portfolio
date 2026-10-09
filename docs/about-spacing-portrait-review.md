# About spacing and portrait draft

This records the approved About spacing and portrait revision. JJ authorized publishing and merging this layout update on 2026-10-09. The verification below was completed before release; exact commit, PR and deployment evidence is retained in the local review directory.

The gallery's top border is the hero/gallery boundary. The first divider in the authored About sections supplies the lower gallery line. Previously, the row had 28px above it and a 64px bottom margin (40px on small screens), while the hero's inherited 96px bottom padding (48px on small screens) separated the portrait from the top line.

The draft gives the gallery equal 32px top/bottom padding, or 24px at widths up to 650px, and removes its bottom margin. The About hero alone loses its bottom padding. Its portrait aligns to the end of the automatic grid row; long introduction text can still grow that row without clipping or a fixed hero height.

| CSS viewport | Portrait before | Portrait draft | Tile-row padding above/below |
| --- | --- | --- | --- |
| 1440px | approximately 457 × 360px | 540 × 426px | 32px / 32px |
| 768px | approximately 355 × 280px | 380 × 300px | 32px / 32px |
| 390px | 280 × 221px | 350 × 276px | 24px / 24px |
| 320px | 280 × 221px | 288 × 227px | 24px / 24px |

The desktop hero uses the same 1080px content edge as the gallery, with a 48px column gap instead of 64px. Above 900px, the portrait grows with half the viewport width up to its 540px cap, avoiding a cramped fixed-width portrait just above the tablet breakpoint. The tablet gap remains 32px. At 750px and below it retains one column and a 28px gap, with copy first and the portrait second so the portrait can meet the divider. The portrait caps at 360px in that stacked layout and stays within the existing gutters. Desktop copy retains 40px of breathing room above the divider; that padding is removed in the stack, where the 28px gap separates copy and portrait. About-only responsive image `sizes` track these widths; the homepage and image assets are untouched.

The approved local portrait was inspected as pixels. Alpha bounds of every WebP derivative reach the last raster row at thresholds 0, 16 and 127; no transparent bottom gutter needs removal. The original face, shoulders, full image canvas and source assets remain intact. No crop, mask, translation or image generation is introduced.

The repository's [Practical UI guidance](../.agents/skills/portfolio-ui-design/references/practical-ui.md) informs the consistent content edge, spacing rhythm, intrinsic image ratio and responsive grouping. Adham's About HTML/CSS was read as inert text; his rendered appearance was not verified. The two newly supplied PNG references could not be materialized after the supported retry, so their pixels were not viewed.

Browser use and speed boost remain off. Full repository checks, in-memory gallery interaction tests, CSS/cascade arithmetic and independent review provide limited evidence. They do not replace browser visual QA at 320/390/768/1440, actual focus/screen-reader behavior or real 200% zoom review. No CMS, content, Analytics or unrelated Vector changes are part of this draft.

Validation completed: `pnpm check` passed lint, TypeScript, all 89 tests, production build and built HTTP route checks. Targeted About tests passed 29/29. Independent source review found no blocking issues and independently passed those 29 tests. The PostCSS cascade and arithmetic audit passed at 23 viewport widths, including breakpoint boundaries and narrow CSS widths. `git diff --check` passed. Canonical checkout remains clean at `5ee1985e97385f9f6c6dca53c7d2d193289e4036`.

Local review evidence is in the ignored `review/` directory: `about-spacing-check.log`, `about-spacing-verification.json`, `about-spacing-portrait-bounds.json` and `about-spacing-geometry-concept.png` (with SVG source). The concept uses labeled placeholder blocks, not actual reference photos or rendered page pixels. The source patch is `review/about-spacing-portrait.patch`. The release branch is `codex/about-spacing-portrait`, based on PR31 merge `3a3ba15bb6527da88a37a5c62187fd4c979178a7`.
