# Simple article review

New draft PR on `publishing/simple-articles`. No CMS content is changed by this branch. Existing `/work/` and `/blog/` URLs use one centered article template: title, subtitle, JJ's existing portrait/name, truthful dates, optional existing artwork, rich body and a short Recent articles list. No company/category eyebrow, project metadata strip, generated contents/section numbering, skills promotion or next-case footer.

The existing structured cases are adapted at read time. All authored headings, paragraphs, facts, formulas, rules, comparisons and benchmark qualifications remain. Vector's AI assistance and the income work's conceptual qualification previously in template chrome are included in the prose. The archived CMS fields are retained. The performance article has no approved hero photograph; its original qualified measurement diagram remains in the body. A hero upload is optional rather than an invented asset.

New Posts default to Article. The native editor supports paragraphs, H2/H3 headings, quotes, lists, strong/emphasis, safe links, inline JPG/PNG/WebP images with required alternative text and optional captions, and existing system illustrations. Placement checkboxes remain independent. Display/search options and legacy source are collapsed. Explicit External link and Existing custom page destinations create link cards, not invented pages or downloads. Custom page choices are limited to the existing homepage, About, Résumé and Contact.

Signed-in Studio has Form and Preview views. Preview renders the supplied Studio document state; it makes no draft query and requires no public draft token or additional grants. New draft edits do not acquire fictitious publication or update history. For a legacy Post, the explicit **Edit as article** action copies its preserved source into the rich editor and leaves the archive intact. The action does not publish.

## Atlas writing workflow

1. Write concise prose with meaningful headings, preserving the actual source and qualifications. Choose Article unless an explicit external or custom destination is intended.
2. Create one unpublished Post in Studio, or prepare one local draft from a reviewed JSON object with `node --import tsx scripts/prepare-post.ts input.json new-draft.ndjson`. The helper validates one new Post, assigns a new `drafts.post-…` identity, refuses existing identities/overwrites and contacts no CMS. Importing or editing a CMS draft is a separate authorized action; do not import the repository-wide seed or overwrite another draft.
3. Review the **Preview** tab while signed in. Check title/subtitle/body, inline images/captions/alt, real dates and mobile reading. For older work, use **Edit as article** only when editing its rich body is intended.
4. Select Homepage, Portfolio, Learn and/or Blog independently. Topic tags do not publish or place a Post. The old About-gallery selection is retained as legacy data; the dedicated [About image gallery](../about-image-gallery.md) is managed in About and no longer uses Post placement or main images.
5. After JJ approves that concrete article and its destinations, publish that one Post. Public content regenerates on request on the existing 60-second interval. Verify its canonical URL and every selected listing; removing a placement removes that listing only, and unpublishing removes its public article/listings.

No article drafts, About restoration, placement restorations or case unpublishing are included in this code PR. The current CMS has zero ordinary published articles; Blog, Portfolio and Learn are empty because their current placement boxes are unchecked. Three existing cases remain homepage-selected. The private temporary draft remains private.

## Review routes

Local server: `http://localhost:3333/`.

- `/work/vector-income-architecture/`
- `/work/vector-performance-investigation/`
- `/work/portfolio-design/`
- `/work/bgm-budget-pacing/` (retained canonical archive; not promoted)
- `/blog/`, `/portfolio/`, `/learn/` (actual empty states)
- `/design-review/article/` (neutral Portable Text/inline-image fixture; no CMS record; Production GET/HEAD404)
- `/studio/` (existing trusted local origin; native login required)

Screenshots and measured verification are in this directory. Reference anatomy: [Adham's ordinary article](https://www.adhamdannaway.com/blog/ui-design/ui-design-tips-14). His custom case/product pages were reference research, not the ordinary article template. No WordPress/Elementor migration, reference artwork/code/copy, new fonts, animation package, analytics or dependencies were added.

## Verification and measured results

- `pnpm check` passes against the configured Production scope: ESLint, generated route types/TypeScript, 27 content/Studio tests, production build and built HTTP route checks. Final Preview build also passes. `git diff --check` passes.
- 72 actual rendered layouts: 9 routes × 320/390/768/1440 × dark/light. No horizontal overflow, broken images, duplicate IDs, hydration errors or case scaffolding. 18 WCAG2/2.1/2.2 AA axe runs report zero violations. All 9 routes read without JavaScript. Keyboard skip link/focus and reduced motion pass. The 720×500 CSS viewport checks layout equivalent to 1440×1000 at 200%; native browser zoom controls were not exercised. Résumé print generation was checked locally; its PDF remains in ignored `review/resume-print.pdf`.
- [Measured runs](performance.json): Lighthouse13.5/Chrome154, default mobile simulated throttling, fresh profile/cold cache each run, three sequential runs per route/version. Same actual published CMS and local built servers. Baseline is main `c9bc86c` (identical source tree to the previous built PR6 head); candidate is code `0122460`. Baseline phase precedes candidate phase; runs were not interleaved. No concurrent build or automated browser during timing. These are local lab results, not deployed field measurements.

| Median                 | Baseline home | Candidate home | Baseline income article | Candidate income article |
| ---------------------- | ------------: | -------------: | ----------------------: | -----------------------: |
| Lighthouse performance |            98 |             98 |                      99 |                       99 |
| LCP                    |        2.480s |         2.491s |                  2.183s |                   2.183s |
| CLS                    |             0 |              0 |                       0 |                        0 |
| TBT                    |          12ms |         16.5ms |                     0ms |                      0ms |
| Initial transfer       |      245,788B |       246,575B |                172,302B |                 188,178B |
| Initial JS transfer    |      148,119B |       148,125B |                135,080B |                 139,498B |

Homepage portrait transfer is36,950B. Homepage meets the proposed500KB total/200KB JS/150KB hero budgets; the article also remains below200KB JS. The article's richer renderer adds4,418B of initial JS; new interaction JS is0. LCP is close to the2.5s target on the homepage, so the local result does not guarantee slower-device/network or deployed field performance.

- [CMS preservation](cms-preservation.json): authenticated read-only audit found no revision or field changes across the four published Posts, existing private temporary Post draft, published About and About draft. No agent content writes. Public queries still exclude draft/release IDs; no new public draft token or grant. Date labels consistently use UTC; no original publication date is inferred from migration creation. An Updated label is the published record's real revision date, including placement edits.
- Native regular Chrome's already-signed-in local Studio opens the existing performance Post with its document title. The new Form/Preview schema and supplied-draft rendering logic are type-checked/tested, but **native Form→Preview rendering and rich-editor save/reload still require an owner browser check**. Automated Google sign-in/native form inspection are unavailable; executor native screen capture returned “could not create image from rect.” No permissions were granted to work around this.
- Library delivery was attempted with the current consumer-local prepared upload workflow and all44 confirmed local screenshots. It failed before upload because prepared uploads are unavailable in this executor. **No screenshot was saved to Library; no output Library file IDs exist.** Verified screenshots are committed here instead. Do not claim attachments were delivered.

The draft PR requires visual/native editor review before it is ready to merge. Any later article publication needs approval of that concrete article and its placement choices. About restoration and case unpublishing remain separate, unapplied decisions.
