# Optional end-of-post button

Posts now have optional **End-of-post button text** and **Button destination URL** fields. Fill both to show one link styled with the existing site button, after the article body and before Recent articles. Example: Visit Vector → https://vectorbudget.com. Clear both to remove it. JJ chooses the Post and publishes it himself; this change performs no CMS mutation or migration and sets no default CTA.

The shared article and legacy-case models retain the fields through published reads and Studio Preview. Both fields are visible with nearby validation. Partial settings fail validation, unsafe schemes/credentials/protocol-relative URLs are rejected, and empty/null/whitespace values count as unset. Text is limited to 80 characters, URL to 2048. Destinations support existing safe local paths, anchors and HTTPS links. Navigation uses an ordinary anchor in a new tab with `rel="noopener noreferrer"` protection and a screen-reader indication, with no button role, extra heading, promotional panel or JavaScript click handler. The visible label is unchanged. A defensive renderer guard suppresses malformed CTAs. The renderer uses the existing lightweight URL utility rather than importing the authoring validator.

## Checks and review

The checks below document the original PR 12 implementation. The new-tab follow-up changes only link behavior, its accessible label, the Studio hint and the focused rendering assertion; see [its separate verification](new-tab.md).

- `pnpm check` passed: lint, TypeScript, 31 tests, production build and real built HTTP route checks. `git diff --check` passed.
- Regression coverage exercises actual Post field validators, partial/unsafe configuration, null/blank values, published and supplied-draft adapters, legacy cases, link semantics, optional omission and placement after body/before Recent articles.
- Actual local fixture `/design-review/article/` reviewed at 320, 390, 768 and 1440 CSS pixels in light and dark themes. Eight WCAG2/2.1/2.2 AA axe scans reported zero violations and zero incomplete results. Button height is about 49.6px, all labels fit without horizontal overflow, and long text wraps naturally.
- Keyboard Tab/Shift+Tab focus and Enter navigation passed. Native navigation reached the exact https://vectorbudget.com/ URL; its response was intercepted by the test rather than loading the external application. No-JavaScript link reading, reduced-motion behavior and equivalent 200% reflow at 720×500 passed. No page errors occurred. See [browser-results.json](browser-results.json).
- Desktop/mobile screenshots were actually inspected; selected files are in [screenshots/](screenshots/). Screenshots use a local development fixture with existing public artwork, not a CMS article or draft. The development indicator in the lower-left corner is Next's local overlay. `?cta=none` and `?cta=long` check omission and wrapping. The existing review route remains unavailable on Production (built route checks passed).
- Compiled initial Blog page JavaScript gzip comparison, using the same installed Node/zlib and unique `_app` plus `/blog/[slug]` build-manifest files: main baseline 133,884 bytes; candidate 134,097 bytes (9 files each, +213 bytes). This is a compiled bundle comparison, not HTTP transfer, a Lighthouse score or field performance. No dependencies, fonts, assets, tracking or interaction code were added.

## Scope and limits

No existing Post text, image, URL, placement, draft or published revision was edited. No Vector repository was changed. The canonical Mac checkout remains on main until the reviewed PR is merged, and the isolated worktree preserves all other local work.

Native signed-in Studio save/reload was not exercised, since doing so would require a CMS content edit. The actual schema validation and supplied-draft Preview data path are tested. Native browser zoom, Safari and assistive technology were not exercised; equivalent layout reflow was checked. Résumé print is unaffected and was not repeated. Final lightweight renderer changes leave the reviewed markup/style unchanged; its final server rendering is covered by the passing tests and production build.

PR handoff is for independent review before merge. After approved release, JJ can open a Post in Studio, enter the button text and URL, review Preview, and publish when ready.
