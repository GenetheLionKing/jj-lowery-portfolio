# Version 0.1 verification

Repository: `jj-lowery-portfolio`

Working branch: `v0.1-portfolio`

Review environment: local production export, Codex in-app Chromium browser

## Engineering checks

| Check | Result |
| --- | --- |
| `pnpm lint` | Pass, zero errors or warnings |
| `pnpm typecheck` | Pass, including generated App Router types |
| `pnpm build` | Pass, all five requested routes statically generated |
| `git diff --check` | Pass |
| Exported links and assets | 96 link occurrences checked; local pages, fragments, and assets resolve |
| Heading structure | One H1 per page; no skipped heading levels or duplicate IDs |
| Metadata | Unique page titles/descriptions and social metadata present |
| Remote assets | None referenced by the exported pages |
| Source scan | No credential files, secret patterns, lorem ipsum, or accidental placeholder text found |

## Browser review

All five pages were visually inspected on desktop and mobile. The homepage, case-study diagrams and reading layouts, income rules, performance investigation, and résumé received direct screenshot review.

Every route was checked at viewport widths of **320, 390, 768, 1024, and 1440 pixels**. Document scroll width equaled the available client width in all 25 combinations. No horizontal page scrolling was observed.

All navigation items were activated, including navigation from case studies and the résumé back to homepage sections. Case-study section links and the next-study links resolve to existing destinations. The skip link becomes visible on keyboard focus and moves focus to the main content. Ordinary links show a 3px focus outline during keyboard navigation.

Browser console review: **zero warnings or errors** on the five requested routes. The résumé print action accepted activation without console errors. The native OS print dialog and generated PDF pagination were not captured; review those in the browser used to export the résumé.

A rendered text contrast check against solid ancestor backgrounds identified several small diagram labels below 4.5:1. Their colors were corrected. The final check found no failures across the five routes, using 4.5:1 for normal text and 3:1 for large text, excluding decorative elements. This was a focused check, not a comprehensive assistive-technology certification. Reduced-motion rules were reviewed in the stylesheet.

## Content and privacy review

- Professional history, dates, education, contact information, project facts, and metrics were checked against the supplied brief.
- The income case is framed as domain modeling and behavioral requirements; it does not claim a completed rollout or measured financial outcome.
- The performance figures are explicitly helper measurements. No additional implementation details or production data were introduced.
- No private Vector source code or other project source code was accessed or copied.
- The résumé contains the supplied Pima Community College degree only.
- No LinkedIn URL, invented professional profile, or public-domain placeholder was added.
- No deployment, domain, hosting project, analytics, database, CMS, authentication, or external service was configured.

## Review items

1. Add the real portrait at `public/images/profile.jpg` and rebuild. The intentional neutral monogram is the only visible placeholder. Review the crop; adjust `--portrait-position` if needed.
2. Review the BGM formula terminology against the original worksheet. The explanation distinguishes a projected shortfall (incremental increase) from total unspent budget (total daily target).
3. Review the résumé’s native print/PDF pagination in the preferred browser.
4. A canonical origin, sitemap, and absolute social image URLs remain deferred until a public URL is chosen.

## Tooling note

ESLint is pinned to 9.39.5 to match the React, import, and accessibility plugins included with `eslint-config-next` 16.3.4. ESLint 10 was incompatible with those rules during validation. The registry marks the ESLint 9 line deprecated; it is development tooling only. Upgrade the lint stack together when its plugins support the newer major version.
