# Green accent comparison

Review assets only, based on merged main `52d728b5437dc7598310af62113fdc2b3b939ee7`. Site source styles, favicon, configuration and CMS content are unchanged in this branch. The published site remains blue.

Open `index.html` through the branch’s Vercel Preview for the interactive gallery. It compares Forest, Emerald and Sage across Home, About, Portfolio, Learn, Blog, Contact and Résumé in light/dark modes. Form focus captures are available at 320, 390, 768 and 1440 CSS pixels. Button focus and hover views are desktop captures.

- [Exact colors and checked contrast pairs](palettes.json)
- [Verification, screenshots and limits](verification.json)
- [Published contact page after removing the direct-email option](published-contact-dark-1009.jpg)

`pnpm check` passed: ESLint with zero warnings, TypeScript, 39 tests, production build, built route checks and real no-JavaScript contact POST recovery with mail delivery disabled. Exactly one previous production form test was sent, and the owner confirmed Gmail receipt. No additional mail was sent for these comparisons.

Local previews were captured using the user’s Codex In-app Browser. Screenshots include the Next development indicator. Actual 200% browser zoom and changed OS reduced-motion preference were unavailable; narrow reflow and existing reduced-motion CSS were inspected. Existing print and neutral article treatment is retained. Current CMS placement leaves Portfolio and Learn empty; no content was published or changed.

Native Library upload was unavailable, so these existing-repository artifact links provide the review material without changing access permissions.
