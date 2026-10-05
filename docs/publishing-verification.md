# Publishing Preview review

This document records the code/seed review before CMS setup. The subsequent [Sanity connection review](sanity-connection-review.md) records the owner-approved Preview configuration, six-record import and real editing/lifecycle checks. PR #5 remains draft and Production remains unchanged.

## Result

Blog is in the shared desktop, mobile and footer navigation. Résumé is hidden there while retaining `/resume/`, its singleton editor and one-page print behavior. The four existing case-detail pages now use a split image-led hero, restrained reading typography and section hierarchy; their original evidence, AI-assisted development and helper-only benchmark qualifications remain intact. No credentials or metrics were invented.

One **Post** editor provides common fields plus an optional structured case layout. Placement tags distribute published posts to Portfolio, Learn and About's gallery; selected structured cases can also appear on Home. Ordinary articles remain in Blog without placement tags. Every entry keeps one canonical URL, including the original `/work/*` URLs. Visitor-facing topic/type filters and the isolated Writing link are removed.

About's gallery contains equal landscape image links with restrained framing, no visible captions or arrows. The source is each tagged published post's main image and canonical URL. Draft, unpublished and image-less posts are excluded. The default gallery is intentionally empty pending JJ's personal post/photo selection. **Gallery fixture screenshots show an existing portrait attached to a local mock post for layout verification only**; no childhood history or new personal media was invented. The live Adham About composition was visually inspected as a reference; no assets, copy or code were copied. The supplied Library reference could not be materialized locally; no Library attachment identity is claimed for deliverables.

## Architecture and security review

Next 16.3.4, React 19.2.8, TypeScript, pnpm, system fonts and plain CSS remain. Indexes use cached App Router rendering. Article/case detail routes use native Pages Router blocking ISR with 60-second revalidation. This targeted choice fixes the empty no-JavaScript missing/unpublished HTML regression: both GET and HEAD return correct 404 status, and GET contains readable navigation, main heading and recovery link. There is no separate existence gate or framework patch.

The published reader uses no API token and excludes draft/release IDs. Configured empty/unpublished records do not resurrect seed; failures do not fall back to seed. Missing Production configuration fails rather than publishing Preview seed. Normal ISR may preserve the last successful page during an upstream outage. Native main-image uploads validate public asset formats/dimensions and alternative text. The editor warns that Sanity asset URLs are public even on draft posts. Singleton UI controls are conveniences; actual access restrictions require backend membership configuration.

A fresh independent code/security review found no remaining blockers in the reviewed code after configuration, duplicate schema-field, native asset validation and nullable-image decoding fixes. It independently passed all 16 content/Studio tests and checked that public initial detail chunks do not contain the server query, reader or Production configuration guard. Real owner authentication, membership and mutation rejection are still untested.

## Verification

`pnpm check` passes zero-warning ESLint, TypeScript, 16 content/actual-Studio tests, production build and built HTTP route regression checks. Tests cover preservation of original public source fields, draft/release isolation, canonical URLs, tag add/remove behavior and ordinary Blog defaults, absent images, safe links/assets, native schema validators, migration and configuration/transport failures. Local Studio schema extraction passes using placeholder IDs without project access.

Chrome 154 checks cover 16 routes at 320, 390, 768 and 1440px in light/dark themes (128 combinations), with a subsequent targeted budget check after correcting crowded diagram labels. No overflow, broken image, external asset request, console exception or error overlay was found. Actual desktop/mobile screenshots were inspected. Keyboard skip/focus passes all 15 public routes; all pass 200% CSS zoom. All 16 routes remain readable without JavaScript, including unavailable article/case/global 404s. Theme persistence, reduced motion and Portable Text numbered lists pass. Thirty-eight axe scans across all 16 routes plus three 404 variants and both themes report zero violations, including contrast. Automated checks do not replace a human assistive-technology review.

The résumé print button works; [the generated PDF](publishing-review/resume-print.pdf) has one Letter page. Approved portrait source and derivatives remain untouched; source SHA-256 is `efece57a797797c1229d196e8eb651d2b3ffd4515e93f61d6882538484abb083`.

A local mock published transport exercised the **actual built cache transitions**, using a new URL absent at build time and GROQ-like nullable main images. A missing article became readable after 65,980 ms; each warmed About/Learn/Portfolio/Blog view then included it after its own refresh request. Draft content stayed absent. Removing the article produced a readable no-JavaScript 404 after 49,222 ms from that step; removing a warmed case produced one after 3,006 ms. These are cache-age-dependent local observations, not instant propagation promises or real Sanity workflow evidence. [Transition evidence](publishing-review/cache-transitions.json).

No Safari automation or OS permission changes occurred. Physical iPhone Safari safe-area behavior remains unverified.

## Performance

| Median                      | Released baseline | Final Preview |
| --------------------------- | ----------------: | ------------: |
| Performance                 |                98 |            98 |
| Accessibility               |               100 |           100 |
| LCP                         |           2.328 s |       2.412 s |
| CLS                         |                 0 |             0 |
| TBT                         |           10.5 ms |        7.5 ms |
| Initial transfer            |         239,187 B |     242,924 B |
| Initial JavaScript transfer |         144,656 B |     146,673 B |
| Hero image transfer         |          36,868 B |      36,868 B |

Final median LCP is 2.412 seconds, within the proposed 2.5-second lab target; individual candidate runs span 2.406–2.476 seconds. CLS is zero and median TBT is 7.5 ms.

Three alternating cold-cache Lighthouse 13.5 mobile runs per version used Chrome 154 on this Mac, one browser at a time. The baseline is the released PR #4 export; the candidate is the final production server's cached homepage HTML and real assets. Both use matched gzip level 6 localhost delivery, default simulated mobile throttling (150 ms RTT, 1638.4 Kbps, 4× CPU slowdown) and the same portrait/system fonts. [Per-run evidence](publishing-review/performance-summary.json).

The 500 KB initial homepage, 150 KB hero and 200 KB initial-JS transfer budgets pass. Public placement links add no custom interaction code. These cached-homepage lab measurements do not cover new personal photos, live CMS latency, cache misses, Vercel geography, real publication timing or field performance. Report actual LCP results against the proposed 2.5-second target; do not treat them as a guarantee.

## Review artifacts and remaining work

- About: [desktop](publishing-review/about-light-1440.webp), [mobile](publishing-review/about-light-390.webp).
- Income case: [desktop hero](publishing-review/income-hero-light-1440.webp), [mobile hero](publishing-review/income-hero-light-390.webp), [full desktop](publishing-review/income-light-1440.webp).
- Performance case: [desktop](publishing-review/performance-hero-light-1440.webp), [mobile](publishing-review/performance-hero-light-390.webp).
- Portfolio case: [desktop](publishing-review/design-hero-light-1440.webp), [mobile](publishing-review/design-hero-light-390.webp).
- Budget case: [desktop](publishing-review/budget-hero-light-1440.webp), [mobile](publishing-review/budget-hero-light-390.webp).
- Learn: [desktop](publishing-review/learn-light-1440.webp), [mobile](publishing-review/learn-light-390.webp).
- Blog: [desktop](publishing-review/writing-light-1440.webp), [mobile](publishing-review/writing-light-390.webp).
- **Local mock gallery fixture only**: [desktop](publishing-review/gallery-local-fixture-light-1440.webp), [mobile](publishing-review/gallery-local-fixture-light-390.webp).

Dark-theme versions accompany these files. Verified local preview: `http://127.0.0.1:3130/`. Raw audits, generated NDJSON and extracted schema are in ignored `review/`; portable screenshots/PDF and compact audit evidence are in `docs/publishing-review/`.

Vercel Preview is access-protected; unauthenticated requests lead to sign-in. Exact-head deployment metadata can be verified without bypassing protection; JJ subsequently completed native owner sign-in in regular Chrome. See the connection review for completed CMS checks and precise remaining limits. Contact delivery and analytics remain deferred. Vector repositories and Production remain unchanged. Keep this PR draft until a separate release decision.

See the subsequent [whole-site design review](publishing-design-review.md) for the current split Portfolio/Learn heroes, featured Blog layout, removed About résumé CTA, latest screenshots and measurement summary. Earlier gallery screenshots remain explicitly local fixtures.
