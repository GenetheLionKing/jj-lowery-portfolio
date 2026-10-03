# Split-portrait redesign: pre-merge verification

Review date: 2026-10-03. Base: `15e97b9275ade94688871ec83f66c9c9edd515e1`. Branch: `redesign/split-portrait-local`. The original checkout at `/Users/jameslowery/projects/jj-lowery-portfolio` was clean and remains unchanged; implementation used a separate worktree.

## Design and content

- Charcoal portrait stage, cool-white work section, bold flanking business/systems typography, one blue accent, system fonts.
- The central portrait is the existing owner-supplied image. Original SVG routing linework and CSS create the split treatment. No reference-site assets, code, portrait, or copy were copied.
- The homepage contains the hero, two selected Vector stories, and a short contact invitation. Repeated capabilities, process, supporting work, and experience sections were removed.
- Vector income work remains a conceptual model and behavioral requirements. The performance result remains a helper measurement from synthetic data, explicitly not end-to-end latency. AI assistance is disclosed on the homepage, both Vector studies, and résumé.
- Existing case-study URLs, LinkedIn target, employment history, skip link, focus styles, themes, reduced motion, and résumé print behavior remain. Historical BGM work has a working URL but is not promoted by the homepage, résumé, or Vector next-study navigation.
- The unverified education credential was omitted. No new degree, certification, employer, testimonial, metric, or hands-on claim was added. No Vector repository was accessed or edited.

## Required checks and browser review

`pnpm check` (lint, generated route types, TypeScript, production static export) passes. `git diff --check` passes. Package versions and the application dependency set are unchanged. Local verification used Node 26.7.0, meeting the >=22 engine; the existing Vercel build uses Node 24.x.

All five content routes were checked at 320, 390, 768, and 1440px: **20/20 pass** for no horizontal overflow, one H1, no duplicate IDs, loaded images, meaningful content, and no framework error overlay. Actual screenshots were inspected, and tablet spacing and enlarged-text clipping were corrected. All 173 internal exported link/asset occurrences resolve, including fragments. No remote asset requests were observed.

Axe 4.12.1 via agent-browser 0.38.2 reports **zero violations on all five routes in both themes**. This includes automated contrast checks; non-text symbols were separately checked against the same palette. This is a focused review, not a complete assistive-technology certification.

The skip link becomes visible on Tab and Enter moves focus to `main`. Links have visible outlines. Cross-page Work/About navigation works. Theme changes persist through navigation and retain the existing storage key. LinkedIn has its existing HTTPS target, new-tab label, and `noopener noreferrer`.

Reduced-motion emulation confirms no linework animation, no arrow transition, and automatic anchor scrolling. A separate Chrome session launched with `--blink-settings=scriptEnabled=false` renders the homepage and navigates to the income study using the normal HTML link.

200% CSS zoom and a 720px reflow viewport (equivalent available width to 200% browser zoom on a 1440px display) were visually checked. Container queries prevent clipped hero text and reflow the work. Native browser zoom remains a manual review item because headless Chrome did not respond to the normal zoom shortcut.

The résumé print button invokes `window.print()`. The final tagged Chromium PDF is one Letter page; it was rendered with Poppler and visually inspected. Navigation and toolbar are absent, content is readable, and no text is clipped. The native OS print dialog and other paper sizes remain manual checks.

## Cold-cache performance

Three sequential fresh-browser runs per variant, using the same Mac, Chrome 154.0.0.0 and Lighthouse 13.5.0. Mobile emulation: 412×823 CSS pixels, DPR 1.75, simulated slow 4G (150ms RTT, 1638.4Kbps), CPU multiplier 4. Storage reset remains enabled. No audit categories, code, or page content were removed for measurement.

Before editing, a production build of the clean baseline was saved. Initial baseline runs used the repository’s uncompressed loopback preview. After implementation, that identical preview was used for the direct uncompressed comparison. A second comparison served both saved baseline and redesigned exports with an identical local gzip level-6 server, matching realistic compressed hosting. The original baseline is still available independently of the redesigned build.

Values below are medians of three runs. Transfer counts include response headers and any observed speculative requests. KB means 1,000 bytes.

| Hosting / version       | Performance |    LCP | CLS |  TBT | Total transfer | JS transfer |
| ----------------------- | ----------: | -----: | --: | ---: | -------------: | ----------: |
| Uncompressed baseline   |          80 | 5.266s |   0 | 18ms |        1,100KB |       479KB |
| Uncompressed redesign   |          86 | 4.281s |   0 | 28ms |          565KB |       464KB |
| Identical gzip baseline |          99 | 2.176s |   0 | 10ms |          645KB |       145KB |
| Identical gzip redesign |          99 | 2.179s |   0 | 23ms |          194KB |       139KB |

Compressed transfer is **70% lower**. The compressed baseline and redesign both score 99; these runs do not establish a compressed LCP improvement. The uncompressed preview remains slower than the proposed mobile LCP/score goals because it sends the normal Next runtime without compression. Real hosting results and field performance must be reported separately.

| Proposed budget                                   |                                                  Observed gzip redesign | Result                 |
| ------------------------------------------------- | ----------------------------------------------------------------------: | ---------------------- |
| Initial homepage <=500KB                          |                                                           193,698 bytes | Pass                   |
| Hero <=150KB                                      | 40,618 transferred bytes in mobile run; largest WebP asset 82,792 bytes | Pass                   |
| Initial JS <=200KB                                |                                               138,842 transferred bytes | Pass                   |
| Extra interaction JS <=10KB                       |         0 bytes observed for hover, theme, and work-anchor interactions | Pass                   |
| LCP <=2.5s / CLS <=0.1 / TBT <=200ms / score >=95 |                                                  2.179s / 0 / 23ms / 99 | Pass with gzip hosting |

The unchanged source portrait is 465,813 bytes. Derivatives are 9,552 / 40,418 / 82,792 bytes in WebP; JPEG fallbacks are 10,445 / 41,096 / 89,873 bytes. Intrinsic dimensions reserve the image space. The original SHA-256 remains `e5f76bbc02152381364038aeb09788aac9c9d57cb957b88b090e36d44e37bd27`.

These are local lab results, not a claim about every device, real-user Core Web Vitals, or the reference designer’s site. System fonts, static export, and no new tracking/animation dependency remain.

## Evidence and reproduction

The execution worktree contains ignored `review/` artifacts: all route screenshots, original and compressed Lighthouse JSON, accessibility JSON, layout results, enlarged-text/no-JS screenshots, and the résumé PDF proof. The adjacent `review-tools/` directory contains the isolated official review tools and the exact gzip server, layout verifier, and benchmark runner. These are review artifacts, not application dependencies or production uploads.

Main screenshots: `review/home-1440.png` and `review/home-390.png`. Local preview: `http://127.0.0.1:3107/`.

## Verified publication workflow and rollback

GitHub repository: `GenetheLionKing/jj-lowery-portfolio`; default branch `main`. On inspection, `main` has no protection rules and no GitHub Actions workflows. The existing Vercel Git integration publishes `main` to production and reports a Vercel commit status. Use a PR and wait for a successful preview build before merging; do not bypass a failed check or protection rule.

Owner authorization was expanded during the task to include a PR and production publication. No new project, hosting plan, DNS, environment, credential, tracking, or access setting is required.

Local rollback tag: `portfolio/pre-split-2026-10-03`. Safe pre-change reference: commit `15e97b9275ade94688871ec83f66c9c9edd515e1`, production deployment `dpl_7EyV4L99REJr2fBfezZxbA9VRkoJ`, URL `jj-lowery-portfolio-i9zv605ke-genethelionkings-projects.vercel.app`. A rollback can revert the merged PR through the same repository process, or restore that retained production deployment using the existing project workflow. No rollback has been performed.

Production commit/PR confirmation and live desktop/mobile inspection belong in the release handoff after the merge; this file is the pre-merge verification snapshot.
