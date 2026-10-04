# Publishing Preview review

This is a code and design Preview, not an operational CMS or a Production release. Sanity project/dataset setup, JJ's authenticated owner session, trusted origins and public environment identifiers remain separately gated. No project, account, membership, token, environment variable, deployment hook or Production setting was created or changed.

## Behavior and content

- About and Résumé are editable singleton schemas. Articles, Case Studies and Resources are separate types, with topics, order and optional search metadata. Native slug fields provide generation and uniqueness validation; the four existing case URLs are locked and canonicalized in the public reader.
- Learn groups writing, work examples and useful references. Topic/type links work without JavaScript. Blog lists articles independently of Learn curation. Portfolio and Home use the same featured case records.
- About adds a small linked work strip, evidence-based strengths and current-build sections, original lightweight systems/guitar line drawings and a longer-story link. Guitar interest comes from JJ's direct report; no duration or skill rating is claimed. Personal photo/video proposals remain for later review.
- Three original article proposals are visibly labeled Preview writing. No publication dates or history are invented. Their qualifications distinguish conceptual requirements, helper-only synthetic measurements and design principles from implemented features or end-to-end results.
- The generated NDJSON publishes only existing public About, Résumé and four cases. Expanded About, articles and curated resources use `drafts.*` IDs. Generation is local only; import is a separate authenticated, explicitly invoked action.

## Architecture and safety

The existing Next 16.3.4 / React 19.2.8 / TypeScript / pnpm 10.30.3 stack remains. Export-only output changes to cached Next pages with 60-second ISR, allowing new URLs and edits without a deployment hook. Filtered indexes render on request with a cached content fetch. Newly requested article/case URLs use static ISR generation. The owner should expect a revalidation interval plus a subsequent request, not instant publication propagation.

The server-only reader explicitly requests the published perspective, sends no API token and filters draft/release IDs defensively. Configured missing/unpublished content stays missing; failed configuration or transport does not switch to repository seed. Normal ISR may retain its last successful cache during an upstream outage. Studio uses Sanity's native authenticated session and project permissions. Only JJ's editing membership is intended; actual project membership and unauthenticated write rejection still require real setup verification.

Studio is loaded only when configured, on its own route. The unconfigured page honestly says editing is unavailable. Public pages and the setup screen make no external font or analytics requests in the verified browser runs. No website write API, private draft preview token or public robot token exists. Initial imagery is selected from already-public assets; standard Sanity asset URLs are public even for private drafts, so no private-media uploader is included. See [the setup bundle](publishing-setup.md) and [Sanity's security guidance](https://www.sanity.io/docs/content-lake/keeping-your-data-safe).

## Local verification

`pnpm check` includes zero-warning ESLint, TypeScript, eight meaningful content tests and a production build. Tests cover original case-field preservation, native-slug migration, draft/release exclusion, missing-record behavior, partial configuration, published/token-free transport, unsafe links/images and duplicate/reserved case anchors. Mock transport evidence is explicitly local; it is not a real CMS authorization test. Local Studio schema extraction passes with placeholder IDs and makes no real project write.

Chrome 154 rendered all 16 routes at 320, 390, 768 and 1440px in both themes (128 checks). Revised Learn, performance, Contact and Studio received another 32 targeted checks. There were no layout overflows, broken images, console exceptions or error overlays. Actual desktop/mobile screenshots were inspected, and Learn's resource rows were revised to avoid excessive blank card space.

Keyboard skip links pass on all 15 public routes. All 15 public routes pass 200% CSS zoom. All 16 routes remain readable with JavaScript disabled; ordinary navigation and the combined Learn topic/type filters work. Theme persistence, reduced motion and Portable Text numbered lists pass. Twenty axe scans (10 routes, both themes) report zero violations, including contrast checks. These automated checks do not replace an assistive-technology review.

The résumé button calls print, and the generated PDF contains one 612×792-point Letter page. [Print review PDF](publishing-review/resume-print.pdf).

The approved portrait source and derivatives are untouched. Source SHA-256 remains `efece57a797797c1229d196e8eb651d2b3ffd4515e93f61d6882538484abb083`.

The safe-area candidate adds viewport-fit coverage, the dark masthead canvas/theme color and inset padding. No Safari automation or OS permission change occurred. Physical iPhone Safari safe-area behavior remains unverified.

**Open release blocker:** nonexistent article/case URLs return HTTP 404 and a readable fallback with JavaScript, but their Next 16.3.4 runtime fallback currently has an empty HTML body without JavaScript. The global unmatched-route 404 has readable HTML. Moving unavailable-content boundaries and selecting static ISR did not resolve the dynamic fallback. This negative browser check remains failed; it must be fixed before claiming complete no-JavaScript unavailable-content behavior or releasing the CMS branch. Existing/published content, filters and ordinary navigation pass their no-JavaScript checks.

## Performance

Three alternating cold-cache Lighthouse 13.5 mobile runs per version used Chrome 154 on this Mac, the same system fonts and portrait, and matched gzip level 6 localhost delivery. Baseline is the released PR #4 export; the candidate is a snapshot of the production Next server's cached homepage HTML with its real assets. Default simulated mobile throttling uses 150 ms RTT, 1638.4 Kbps throughput and 4× CPU slowdown. One Chrome process ran at a time.

| Median                      | Released baseline | Publishing candidate |
| --------------------------- | ----------------: | -------------------: |
| Performance                 |                98 |                   97 |
| Accessibility               |               100 |                  100 |
| LCP                         |           2.320 s |              2.505 s |
| CLS                         |                 0 |                    0 |
| TBT                         |           13.5 ms |                14 ms |
| Initial transfer            |         239,187 B |            242,216 B |
| Initial JavaScript transfer |         144,656 B |            146,222 B |
| Hero image transfer         |          36,868 B |             36,868 B |

The 500 KB homepage, 150 KB hero and 200 KB initial-JS budgets pass. Added public application interaction code is zero; filters use normal links. Median LCP is about 5 ms above the proposed 2.5-second goal, and individual candidate runs ranged 2.495–2.510 seconds. Report this result as measured, not a guaranteed pass. Cached-page lab results do not measure live Sanity fetch latency, cache misses, real publication propagation, Vercel geography or field performance. The configured CMS and deployed Preview still need that verification.

## Review artifacts and remaining gate

- About: [desktop](publishing-review/about-light-1440.webp), [mobile](publishing-review/about-light-390.webp), [dark desktop](publishing-review/about-dark-1440.webp), [dark mobile](publishing-review/about-dark-390.webp).
- Learn: [desktop](publishing-review/learn-light-1440.webp), [mobile](publishing-review/learn-light-390.webp).
- Writing: [desktop](publishing-review/writing-light-1440.webp), [mobile](publishing-review/writing-light-390.webp).
- Article: [desktop](publishing-review/article-light-1440.webp), [mobile](publishing-review/article-light-390.webp).
- Setup screen: [desktop](publishing-review/studio-light-1440.webp), [mobile](publishing-review/studio-light-390.webp).

Local production preview: `http://127.0.0.1:3130/`. Raw local audit files, generated NDJSON and extracted schema are in ignored `review/`; portable screenshots/PDF and compact performance evidence are in `docs/publishing-review/`.

Real login, save/reopen, anonymous draft isolation, publish/update/unpublish, non-member write rejection and site-update timing remain **blocked by separately authorized CMS setup**. No mocked editor, empty “coming soon” page or local test is presented as proof that those actions work. Contact delivery and GA4 remain deferred. Vector repositories are untouched. This branch must remain a draft PR/Preview until setup, owner-workflow verification and explicit release authorization are complete.
