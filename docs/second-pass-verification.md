# Portrait and selected work: second-pass verification

Review date: 2026-10-03. Branch: `redesign/portrait-and-work`. Base: `9f426f6d6fa5d77c9a4a556d387fbc959b06784a` (PR #1). Implementation is isolated at `portfolio-round-two`; the owner's original checkout is preserved. The owner authorized the PR and publication after successful checks and Atlas's independent readiness confirmation. This is the pre-merge record.

## Design evidence

The first pass was rejected. This pass follows the owner's actual supplied reference screenshot and the broad layout of [Adham Dannaway's portfolio](https://www.adhamdannaway.com/): a compact dark masthead, spacious white central-portrait hero, flanking competency headings and literal paragraphs, a pale-gray strip with three equally sized image-led cards, and repeated footer navigation. Public guidance on [Practical UI](https://www.practical-ui.com/) and the [book's public project page](https://www.adhamdannaway.com/portfolio/ui-design-book) informed hierarchy, spacing, neutral surfaces, concise text, and clear links. No purchase or gated book access was used.

No greeting, location/open-to-work row, face overlay, vague slogan, work-card metric/eyebrow/button, or extra contact section remains. Mobile places a compact portrait above two aligned role/description columns and stacks the work cards. No hover or drag is needed. The theme preference remains; all directional symbols and social marks are inline SVG.

Homepage copy:

- **analyst** — I turn business problems into clear requirements, workflows, and rules.
- **builder** — I build and improve software with AI assistance, then test that it works.
- **Vector income planning** — Conceptual model & requirements
- **Vector performance** — Investigation & validation
- **Personal portfolio** — Website design & development

The header/footer use About, Work, Résumé, Contact, and separate X/LinkedIn/Instagram icons. Owner-confirmed targets are `https://x.com/JJ_incredible`, `https://www.linkedin.com/in/jamesjoelowery/`, and `https://www.instagram.com/jj_incredible/`. Contact retains the existing LinkedIn destination. External links have accessible new-tab labels and `noopener noreferrer`.

Review screenshots: [desktop](design-review/home-desktop.webp) and [mobile](design-review/home-mobile.webp). These are actual final local production-export captures, compressed for PR review. Original PNGs and all other review artifacts remain in the ignored local `review/` folder. No Library upload identity is claimed.

## Assets and claims

The original owner photograph remains unchanged (SHA-256 `e5f76bbc02152381364038aeb09788aac9c9d57cb957b88b090e36d44e37bd27`). AI background removal supplied only the silhouette alpha mask in `assets/portrait-matte.png`; the asset pipeline takes all RGB pixels from the original photo. It does not use generated facial pixels. `pnpm assets:build` is reproducible with Sharp already provided by Next.

| Portrait width | WebP bytes | PNG fallback bytes |
| --- | ---: | ---: |
| 320 | 16,384 | 47,325 |
| 640 | 57,704 | 174,157 |
| 960 | 114,212 | 374,909 |

WebP-capable browsers select the compressed format; the larger transparent PNGs are fallbacks. Intrinsic dimensions reserve the image space. The source photo and old derivatives remain retained and are not initial homepage requests.

The Vector envelope image and purple validation illustration are existing public Vector marketing assets copied read-only into this portfolio's `assets/`. The envelope image illustrates the project, not completion of the conceptual income proposal. The validation artwork is an illustration, not a benchmark chart or performance-interface screenshot. The third card shows an actual screenshot of this portfolio and links to a short new case study with explicit AI assistance. No Vector implementation or tests were run during this task.

Existing Vector source qualifications remain: the income work is a conceptual model and behavioral requirements; the timing result is a helper measurement with synthetic data, not end-to-end latency. Existing case URLs and résumé facts remain. Historical BGM work is retained at its URL but excluded from the homepage, résumé selected work, and selected-work cycle. No degree, certification, employer, testimonial, metric, or unsupported hands-on claim was introduced.

## Checks and visual review

- `pnpm check`: lint (zero warnings), route/type generation, TypeScript, and production static export pass. `git diff --check` passes. Dependencies and lockfile are unchanged. Local checks used Node 26.7.0/pnpm 10.30.3; configured Vercel runtime remains Node 24.x.
- All six content routes at 320/390/768/1440px: **24/24 pass** for document width, one H1, duplicate IDs, loaded images, meaningful content, no framework error overlay, and no external asset requests. Actual screenshots were inspected; mobile heading alignment was corrected.
- All **237 internal link/asset occurrences** in nine exported HTML files resolve, including fragments.
- Axe 4.12.1 through agent-browser 0.38.2: **12 scans, zero violations**, all six routes in light and dark. This includes automated contrast checks; it is not a full assistive-technology certification.
- Keyboard Tab reveals the skip link with a visible outline; Enter focuses `main`. Navigation and external social targets are verified. Dark preference persists through actual case-page navigation.
- Reduced-motion emulation removes transitions/animation and uses automatic scrolling. Content is never hidden until an animation or JavaScript runs.
- A fresh Chrome session with `--blink-settings=scriptEnabled=false` renders the final homepage and follows its ordinary HTML link to the income case study.
- 200% CSS zoom and equivalent 720px reflow at 1440px were inspected without horizontal overflow or clipped hero copy. Native browser zoom remains a manual check because the headless shortcut did not alter Chrome's zoom.
- The résumé button invokes `window.print()`. A tagged Chromium PDF was rendered with Poppler and visually inspected: **one Letter page**, readable, no clipped text, navigation/toolbar omitted. Native OS print dialog and other paper sizes remain manual checks.

## Consistent cold-cache comparison

Three sequential fresh-profile Lighthouse runs for each saved production export, identical loopback gzip level-6 server and Mac. Lighthouse 13.5.0, Chrome 154.0.0.0; mobile 412×823 CSS pixels, DPR 1.75, simulated slow 4G (150ms RTT, 1638.4Kbps), CPU multiplier 4. Storage reset stays enabled. Performance and accessibility categories were selected consistently; page content/code was not removed for measurement. The saved first-pass export has the same tree as the base merge commit.

Medians (KB = 1,000 bytes, transfer includes response headers):

| Version | Performance | Accessibility | LCP | CLS | TBT | Total transfer | JS transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| First pass / base | 99 | 100 | 2.190s | 0 | 33ms | 193.698KB | 138.842KB |
| Second pass | 98 | 100 | 2.491s | 0 | 9ms | 259.718KB | 144.656KB |

The second pass carries a larger transparent portrait and three project images, increasing transfer by 66,020 bytes (34.1%) and median LCP by 0.302 seconds. All three second-pass runs scored 98; LCP ranged 2.488–2.495s. This meets the proposed 2.5s lab goal with little margin. It is not evidence of faster LCP than the first pass or real-user Core Web Vitals. Hosting and other devices can differ.

| Proposed budget | Observed second pass | Result |
| --- | ---: | --- |
| Initial compressed homepage <=500KB | 259,718 bytes | Pass |
| Hero <=150KB | 57,904 transferred bytes in mobile; largest WebP asset 114,212 bytes | Pass for WebP |
| Initial JS <=200KB | 144,656 transferred bytes | Pass |
| Additional interaction JS <=10KB | 0 bytes for hover/theme/work-anchor actions | Pass |
| LCP <=2.5s / CLS <=0.1 / TBT <=200ms / score >=95 | 2.491s / 0 / 9ms / 98 | Pass in these local runs |

Interaction resource review observed one normal Next RSC fetch of 14,465 uncompressed bytes after the Work anchor; it was data, not additional JavaScript. Hover and theme actions did not add a script request. Uncompressed local preview is not representative of gzip hosting. No remote fonts, tracking, hero content gate, animation package, WebGL, or video were added.

## Reproduction, publication and rollback

Local production preview: `http://127.0.0.1:3106/`. The adjacent isolated `review-tools/` contains exact layout/accessibility/functional scripts, the same-compression server, and the three-run benchmark driver. Outputs are in `review/layout-results.json`, `accessibility-results.json`, `functional-checks.json`, `internal-links.json`, `interaction-requests.json`, `baseline-compressed/`, and `after-compressed/`, plus screenshots and `resume-print.pdf`. Tools are not application dependencies.

The authorized PR must receive successful Vercel status for its exact head and Atlas's readiness confirmation before merge. Keep the existing Git-to-Vercel production integration; do not change accounts, DNS, project protection, settings, permissions, or environment variables. Protected preview authentication remains in place.

Rollback baseline: commit `9f426f6d6fa5d77c9a4a556d387fbc959b06784a`, production deployment `dpl_BM4sLuFBPGuR2eKra9TeSL4JFG9x`. A release can be reverted through the same PR/main workflow or the retained deployment restored through the existing project process. No rollback has been performed. Exact publication and live checks belong in the subsequent release handoff.
