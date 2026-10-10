# About carousel sections

About → About sections now supports two additional, reusable section types. This change adds editor capabilities and renderers; it does not insert or publish content.

## Image carousel

Choose **Image carousel** for landscape skill-tree infographics or other complete images. Add up to **18 images**, each with required alternative text and an optional caption. The headline and native rich-text body are optional. Drag images to reorder them, remove an image, or drag the whole section within About sections.

Images retain their intrinsic aspect ratio and are never cropped by this renderer. Select an image to enlarge it in the existing native dialog pattern; **Open full-size image** opens the original asset for fine detail. Modified clicks and environments without dialog support retain normal image links. Previous/Next, a position indicator, native swipe/scroll, and viewport Left/Right/Home/End keys provide manual navigation. There is no autoplay or animated transition. An empty carousel is hidden.

A suggested four-slide set is **Marketing & Strategy**, **Systems & Building**, **Creative Work**, and **Side Quests**. These are recommendations, not seeded CMS records. Confirm JJ’s actual skills before authoring content.

## Interactive skills carousel

Choose **Interactive skills carousel** for individually selectable badges. The default editable headline is **My skills**; a native rich-text introduction is optional. Add up to **8 trees/categories** and drag them to set slide order.

Each tree has a shallow category header, an author-selectable header color (Emerald, Indigo, Amber, or Rose), and up to **20 skills** across **four editable tiers**, with at most **five skills per tier**. Counts can vary: 5 / 4 / 5 / 3 is valid. A tree can have fewer badges or empty tiers; every nonempty tree retains four visually distinct tier bands. The four tier colors remain the same across categories, with separate light and dark theme palettes. Each skill has:

- A visible name of up to 32 characters.
- A tier (1–4; unset uses 1).
- A required distinct badge image and alternative text.
- An explicitly selected Locked/Unlocked badge state. Neither is inferred.
- A required native rich-text skill description, including normal formatting, lists, links, quotes, and images.
- Four separate required native rich-text rank descriptions, labeled Rank 1 through Rank 4.
- An optional authored current rank (1–4), unset by default.
- One optional prerequisite, chosen by name from an earlier tier in the same tree.

The prerequisite picker stores the other skill’s stable native key. It omits self, same/later-tier, and invalid choices. Validation reports missing prerequisites, cycles, duplicate keys, excessive tier counts, or a prerequisite moved into a later tier. Removing a referenced skill requires choosing another prerequisite or clearing that field. Tier placement is independent from prerequisite count: a skill in a later tier can have no prerequisite. Dragging skills changes their order within their tier.

On the page, emerald elongated six-sided shield frames give every badge a consistent shape. Uploaded artwork is contained inside the frame. Visible skill names stay outside the artwork. Foundational tiers appear above advanced tiers; only explicitly authored prerequisites draw connectors. Locked artwork is darker and desaturated; unlocked artwork has a visible outline. Visible Locked/Unlocked labels and accessible state keep the distinction understandable beyond color. Both states remain selectable. Selecting a badge focuses its details below the tree and scrolls the page directly to them; Back to badges returns to the selected badge. All four rank descriptions remain readable. Current rank, badge state, and tier are independent authored values; none is inferred or used to gate content.

Tab reaches every badge and rich-text link. Left/Right move between badges; Up/Down move to the closest badge in the next/previous displayed row; Home/End reach the first/last badge. Tree slide navigation uses separate controls. Five columns fit the wide layout; narrower screens wrap tiers into two columns, or one at 360px and below. The selected node has a distinct surface, an outline, an accessible pressed state, and a labeled details panel. Navigation controls remain before the viewport; its enhanced height follows the active slide with scrollbar allowance so taller inactive categories do not reserve blank space or a vertical scroll area.

Without JavaScript, all categories remain horizontally scrollable and every skill’s rich details remain available in native expandable rows, including its prerequisite name, authored state, and all rank descriptions. Empty trees are skipped and an entirely empty carousel is hidden.

## Feature typography

The two new carousel section types use **Oxanium**, a square technology-style variable font by Severin Meyer. The unmodified 43,536-byte font is self-hosted with `font-display: swap`, weights 200–800, and the existing system-font fallback. It is fetched only when used; no remote font service or global font replacement is introduced. The SIL Open Font License 1.1 and copyright are included in `public/fonts/Oxanium-OFL.txt`.

Sources: [official Google Fonts source](https://github.com/google/fonts/tree/main/ofl/oxanium), [Oxanium project](https://github.com/sevmeyer/oxanium). The locally recorded SHA-256 is `2ce01d946e1e1ffc8d7eecfffbda8623bedd63eaf811a20488c4b69af45babb0`.

## Preservation and verification

The four existing section layouts, About hero, gallery framing, story link, published-only queries, Post editor, and existing content remain intact. Section arrays still distinguish absent legacy layout from explicitly empty authored layout. Media remains public Sanity media; this implementation does not upload assets or mutate CMS records.

Automated non-browser coverage exercises native Sanity validation, GROQ parsing/evaluation, immutable native adapters, server output without JavaScript, actual React handlers with plain in-memory node models, keyboard navigation, scrolling/focus synchronization, image enlargement, and reorder/removal recovery. The standard repository checks include this coverage.

The user prohibited all browser use. Consequently no browser, webview, headless renderer, visual screenshot, actual touch device, screen reader, or rendered 200% zoom review was used. Source/CSS geometry and in-memory handlers are evidence with that limitation, not a visual or accessibility certification. Selected Library references were resolved, but the supported local materialization helper failed to download their bytes. The shield and panel direction follows the parent’s supplied description; exact reference appearance was not visually verified. No public image upload or alternate transfer workaround was used.

This feature is prepared locally on `codex/about-image-carousel`. Release and CMS publication require the parent/user’s authorization. No speculative skills or unapproved badge assets are inserted.
