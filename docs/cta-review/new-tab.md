# CTA new-tab follow-up

The end-of-post anchor now uses `target="_blank"` and `rel="noopener noreferrer"`. Its accessible name adds “opens in a new tab” while keeping the visible authored label, URL and button appearance unchanged. Studio's destination hint describes the new behavior. No other navigation, CSS or CMS content changed.

Based on released main d86319a0d8b2bbb70079b5004c9a7bb6568669e3. `pnpm check` passed: all 31 tests, lint, types, production build and built HTTP routes. The focused rendering assertion verifies target, rel, accessible name and unchanged visible text. `git diff --check` passed.

Actual isolated Chrome verification covered 320, 390, 768 and 1440 CSS pixels in light/dark themes. The label and URL remained intact; no horizontal overflow appeared. All eight screenshots were visually reviewed. Selected [mobile](screenshots/new-tab-light-390.png) and [desktop](screenshots/new-tab-dark-1440.png) captures retain the existing appearance; the corner indicator is Next's local development overlay.

Keyboard focus had the existing 3px outline. Native Enter activation opened the real destination in a second tab at https://www.vectorbudget.com/, with `window.opener === null`; the original local article tab remained unchanged. The destination tab was closed after this read-only check. No page errors occurred.

No CMS document was edited or published, and no live deployment was performed for this follow-up. Native Studio save/reload, assistive technology and browser zoom were not repeated; they are unaffected by this narrow anchor change. The PR remains draft for review, with no merge authorized for this follow-up yet.
