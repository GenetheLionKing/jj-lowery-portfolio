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
- The LinkedIn URL was supplied by the site owner. No invented professional profile or public-domain placeholder was added.
- No deployment, domain, hosting project, analytics, database, CMS, authentication, or external service was configured.

## Review items

1. The supplied portrait has now been integrated and reviewed; see the portrait integration follow-up below.
2. Review the BGM formula terminology against the original worksheet. The explanation distinguishes a projected shortfall (incremental increase) from total unspent budget (total daily target).
3. Review the résumé’s native print/PDF pagination in the preferred browser.
4. A canonical origin, sitemap, and absolute social image URLs remain deferred until a public URL is chosen.

## Tooling note

ESLint is pinned to 9.39.5 to match the React, import, and accessibility plugins included with `eslint-config-next` 16.3.4. ESLint 10 was incompatible with those rules during validation. The registry marks the ESLint 9 line deprecated; it is development tooling only. Upgrade the lint stack together when its plugins support the newer major version.

## Portrait integration follow-up

The current 1254 × 1254 smiling photograph at `public/images/profile_smile.jpg` replaces the fallback in the production export. The supplied JPEG is unchanged. The smiling portrait was checked in the existing desktop and mobile frame without changing the portrait treatment.

The photograph stays inside the established frame. The desktop/tablet ratio of 4:4.65 preserves the complete source height and crops approximately 7% at either side; the square mobile frame shows the complete source. Centered positioning preserves the hair, glasses, ears, chin, and natural shoulder line. The existing dark photographic background provides the contrast; no filters, image bleed, cutout, or typography overlap is needed.

The surrounding composition and labels remain intact. The index and registration mark now also render with the real photo, using warm-paper color. A fluid inset keeps the small index within the dark margin at narrower widths. Image alternative text and responsive sizing hints were updated.

Desktop (1440px), tablet (768px), mobile (390px), and narrow mobile (320px) hero layouts were visually inspected. The portrait loads at its expected intrinsic dimensions; no placeholder, distortion, or horizontal page overflow was observed. Lint, TypeScript, and the production build pass. No deployment or push was performed.

## Public contact removal follow-up

Email and phone fields were removed from the shared profile data, homepage, and résumé. The shared footer’s “Let’s connect” link was removed. A contact form is deferred.

The source and all 51 files in the production export were scanned: neither personal contact detail remains. The rendered homepage and résumé contain no email or telephone links. Desktop (1440px) and mobile (390px) contact and résumé layouts were visually reviewed with no horizontal overflow. Browser console review found no warnings or errors. Lint, TypeScript, production build, and whitespace checks pass. No deployment or push was performed.

## LinkedIn navigation follow-up

The supplied LinkedIn profile is linked from the shared main menu and footer using HTTPS. Both links open in a new tab with `noopener noreferrer` and an accessible new-tab label. Their URLs and attributes were verified in all five exported routes.

Desktop and mobile menu/footer layouts were visually inspected. Navigation moves below the wordmark at small tablet widths and uses two rows on narrow phones. Responsive checks from 320px to 1440px found no horizontal page overflow after adjustment. Lint, TypeScript, production build, and whitespace checks pass; browser logs contain no warnings or errors. No deployment or push was performed.
