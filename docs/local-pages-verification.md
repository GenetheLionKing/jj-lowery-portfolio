# About, Portfolio and Contact: local draft

Date: 2026-10-04. Branch: `local/about-portfolio-contact`. Base: `e7675fe76d0a8ee18d7d2825cc5715e1d0309007`, the previously approved feature head merged as `a638c985`. The original checkout remains unchanged. No additional repository AGENTS or .agents/.codex instructions were found. The frontend composition skill informed restraint; the owner's approved visual direction takes precedence over its generic animation/card defaults.

**Local preparation only.** No fetch, push, PR, remote CI/Preview, deployment, merge, publication, account/settings change, or external upload was performed for this revision. A separate authorization is required for any future external publication. The existing local main checkout is historical; refresh/reconcile the remote base before a future authorized PR rather than assuming its tip.

## Scope and content sources

- `/about/`: existing clean portrait, three short public-source statements, and résumé link. The first-person wording below is a draft for review. Business/marketing leadership, executive operations and business ownership come from existing `data/profile.ts` summary/about and résumé experience. Systems-analysis areas come from the existing summary/about/skills. AI-assisted Vector development is already disclosed on the homepage, Vector studies and résumé. No new biography, motivation, degree, certification, employer, hands-on claim or metric was introduced.
- `/portfolio/`: exactly the current three selected cards, images, titles, subtitles and case URLs. The homepage and new page use `data/selected-work.ts` plus the shared Server Component; evidence is not duplicated or rewritten. Image crops remain the approved 4:3 format within equally sized rounded cards.
- `/contact/`: LinkedIn, X and Instagram using the existing confirmed URLs. LinkedIn is listed first. No form, backend, new email/phone, response-time promise or availability claim.
- Header/footer draft: About / Portfolio / Résumé / Contact, linking to their own local routes. Homepage `/#about`, `/#work`, all old routes, case-study back links, social targets, theme storage and résumé print behavior remain.

About draft copy:

> I’ve worked in business and marketing leadership, including executive operations and business ownership.
>
> Today I focus on systems analysis: requirements, business rules, workflows, root-cause analysis, and validation.
>
> I develop Vector, my personal-finance app, with AI assistance.

Portfolio: “Selected systems work and this site.” Contact: “Connect with me on LinkedIn.” The only displayed account handles are the previously confirmed public X/Instagram names. No private family or financial information was used. Learn/Blog is deferred because there is no approved content.

## Local checks

`pnpm check` passes: ESLint zero warnings, route/type generation, TypeScript and static export. Local runtime Node 26.7.0/pnpm 10.30.3 meets the engine requirement. New source files pass Prettier; `git diff --check` passes. Dependencies, lockfile, image assets, case-study evidence and résumé source are unchanged.

- **36/36 layout checks**: all nine content routes at 320/390/768/1440px. No horizontal overflow, broken images, duplicate IDs, blank pages, framework overlay or remote asset requests. Actual new-page screenshots were inspected at mobile, tablet and desktop widths.
- **18 light/dark Axe scans**, zero violations. This includes automated contrast; it is not a complete assistive-technology certification.
- All **333 internal link/asset occurrences** across 12 exported HTML files resolve, including fragments.
- The exported homepage `main` HTML is byte-identical to the approved baseline. Its hero/copy/cards are unchanged; only shared navigation destinations/label change.
- Tab reveals the skip link with 3px outline; Enter focuses `main` on all three new pages. Contact links retain visible 3px focus, accessible new-tab text, correct HTTPS targets and `noopener noreferrer`. About's résumé link works by keyboard.
- Theme preference persists from About to Contact using the existing storage key. Reduced-motion emulation yields automatic scrolling and 0s transition.
- CSS 200% zoom on all three pages has no horizontal overflow; actual screenshots were inspected. Native OS browser zoom remains a manual check.
- With author JavaScript disabled, all three new pages render meaningful content and images. Ordinary HTML navigation goes from About to Portfolio to the income case. No form/input/textarea or remote asset is present.
- The résumé print control invokes `window.print()`. Chromium's tagged PDF is **one Letter page**, rendered with Poppler and visually inspected without clipping. The native OS print dialog and other paper sizes remain manual checks.

## Local performance spot checks

One fresh-profile mobile Lighthouse run per new page, the same local gzip level-6 server. Lighthouse 13.5.0 / Chrome 154.0.0.0, 412×823 CSS pixels, DPR 1.75, simulated slow 4G (150ms RTT, 1638.4Kbps), CPU multiplier 4, storage reset enabled. These are single-run local observations, not a median, comparison, field result or production promise. No page content/code was removed for measurement.

| Route     | Performance / accessibility |    LCP | CLS |   TBT | Transfer | JS transfer |
| --------- | --------------------------: | -----: | --: | ----: | -------: | ----------: |
| About     |                    99 / 100 | 2.179s |   0 |  15ms | 209,655B |    138,850B |
| Portfolio |                    99 / 100 | 2.187s |   0 | 8.5ms | 201,747B |    144,656B |
| Contact   |                    99 / 100 | 2.027s |   0 |  23ms | 151,548B |    138,850B |

The new pages and work-grid extraction are Server Components. There are no new application Client Components, libraries, tracking, fonts, animation packages or network services. Only the existing theme and print controls require application JavaScript. Static export remains intact.

## Review screenshots and reproduction

| Page      | Desktop                                            | Mobile                                           |
| --------- | -------------------------------------------------- | ------------------------------------------------ |
| About     | [1440px](local-page-review/about-desktop.webp)     | [390px](local-page-review/about-mobile.webp)     |
| Portfolio | [1440px](local-page-review/portfolio-desktop.webp) | [390px](local-page-review/portfolio-mobile.webp) |
| Contact   | [1440px](local-page-review/contact-desktop.webp)   | [390px](local-page-review/contact-mobile.webp)   |

These images are actual local production-export captures, retained in the local commit for review. They have not been uploaded externally; no Library file IDs or cloud attachment delivery is claimed. Full PNGs, all 36 route screenshots, no-JS/zoom screenshots, résumé PDF, Axe/Lighthouse JSON and functional outputs live in ignored `review/` within the worktree. The adjacent isolated `review-tools/` holds the exact local scripts, not application dependencies.

Local preview: `http://127.0.0.1:3110/`; new routes append `/about/`, `/portfolio/`, `/contact/`. Rebuild with `pnpm check`, then `PORT=3110 pnpm preview`. The local benchmark server uses port 3111 and is stopped after measurements.

Review gaps: owner review of the new first-person copy and the “Portfolio” navigation label; real Learn/Blog content remains absent and deferred. There are no implementation blockers. This draft has not received publication approval, and no external write is part of the handoff.
