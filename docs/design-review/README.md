# Content and layout review

This draft changes the page layouts and Post placement controls. It does not publish, unpublish, import or overwrite CMS content. The approved portrait and card geometry remain unchanged.

## Review routes

- `/portfolio/`, `/learn/`, `/blog/`: real published CMS content, with an explicit placement tag required for each collection.
- `/`: real published Posts tagged `home`, in Display order, under **Some of my work**. Both Post layouts are eligible. No eligible Posts means no work section. There is no three-card cap or repository fallback.
- `/work/vector-income-architecture/`, `/work/vector-performance-investigation/`, `/work/portfolio-design/`, `/work/bgm-budget-pacing/`: the existing canonical case-study URLs and full qualified source content.
- `/design-review/about/` and `/design-review/about/story/`: separately labeled, unpublished About restoration proposals.
- `/design-review/article/`: a neutral article-layout fixture. It is not one of the three proposed articles and is never listed as a Post.

All `/design-review/` routes carry `noindex, nofollow` and return GET/HEAD 404 in Production. They do not replace the real About page or write to Sanity.

## Concrete design changes

Learn, Portfolio, Blog and the homepage use the same `PortfolioGrid`. Learn retains Portfolio's image ratio, padding, border, radius, title/subtitle styling and grid gap. The separate CASE STUDY label, long excerpt and Read arrow are removed. Collection headings are compact; the CSS monitor and book/flowchart decoration are removed.

Case-study bodies use one 780px reading column, clear section headings and visible evidence. Existing interface screenshots remain direct project artifacts. The abstract validation shield is retained as existing card artwork, but is omitted from the performance detail hero. Explanatory diagrams remain in the body; benchmark qualifications are easier to read. Source claims, numbers, AI-assistance qualifications and conceptual-model boundaries are unchanged. Article and About-story pages use the same editorial component.

The reference was inspected at [Adham's Portfolio](https://www.adhamdannaway.com/portfolio) and [Creating a lean design system](https://www.adhamdannaway.com/portfolio/creating-a-lean-design-system). The transferred principles are a quiet black/white frame, clear hierarchy, restrained supporting text and imagery that shows the actual work. JJ's existing bordered cards are deliberately preserved, as requested. No reference portrait, illustration, code, copy or professional claim is copied.

## Publishing controls

Tags & placement now uses Sanity's [native checkbox array](https://www.sanity.io/docs/studio/array-type). Select Homepage, Portfolio, Learn, Blog and About gallery independently. Topic tags do not place a Post. Changes save to the draft; publish to update public pages. Unchecking one page preserves other placements and the canonical URL. Display order applies across selected pages; ties use date where supplied, then slug. Resources remain editable, but cannot create collection cards outside the unified Post model.

JJ confirmed in native Chrome that homepage/Blog checkbox additions and Blog removal save and remain after reopening a new temporary draft. A subsequent read-only CMS audit confirms that draft has only `home`, is unpublished, and all seven pre-existing document revisions are unchanged. The owner-created temporary draft remains unpublished; no agent CMS writes occurred. The exact cause of the old control's reported failure was not independently reproduced in the authenticated live form; the replacement's real save/reopen workflow is verified.

The CMS currently contains four published structured-case Posts, not three published ordinary articles. Blog is empty because none has the explicit `blog` tag. A published document can also have a working draft; viewing the Draft perspective does not unpublish it. No permission to unpublish the four cases has been assumed.

## About restoration decision

The original expansion survives in `content/seed.ts` and the migration's proposed About draft. The baseline import deliberately published the compact About record; the proposed expansion was not imported. It was not deleted by cleanup of the previous temporary CMS verification Post.

The review proposal keeps the current published title and introduction, and restores these source-backed fields for editorial review: lead, story title, longer story, three strengths, music note, two current-build references and story-link label. It preserves the cleared facts/At a glance field. The three original optional facts can be considered separately; they are not silently restored. The existing About draft is untouched. Any future restoration must merge only approved fields into the latest draft with a revision guard, preserving edits made since this review.

No proposed article/resource drafts are imported. The identity of the user's requested "three articles" remains unresolved; this PR does not assume the three repository proposals are the intended pieces.

## Images and existing content

The three selected cases currently use the existing `thumbnail` keys: Vector income interface, validation artwork and portfolio screenshot. Their native Main image fields are empty. The advertising case has no thumbnail and remains unselected. Existing local artwork and case URLs are preserved. A new native Main image overrides legacy artwork and enables the About gallery. Migrating those assets into native Main image fields is a separate CMS edit, not performed here.

## Validation and limits

See `browser-checks.json`, `tag-ui-check.json`, performance results and the screenshots below. The complete required `pnpm check` passed with the actual published CMS and Production configuration; 19 meaningful content/Studio tests passed, along with lint, types, build and built HTTP route checks. `git diff --check` passed. The Production proposal gate returned 404 for all three routes with both GET and HEAD.

The 12 actual/review templates were inspected at 320/390/768/1440 in both themes (96 layouts), with no overflow, duplicate IDs, broken images or browser exceptions. Twenty-four axe checks found zero WCAG A/AA violations. All 12 templates remain readable without JavaScript. Reduced-motion scrolling is `auto`; the keyboard skip link has a visible outline. A 720x500 CSS viewport checks reflow equivalent to a 1440x1000 viewport at 200%; native browser zoom UI was not exercised. The résumé PDF remains one Letter page. Physical mobile Safari, human assistive-technology review, full manual keyboard traversal and new Preview Studio CORS/login have not been verified.

The native owner Studio test used the already trusted `http://localhost:3333` origin. No new Sanity CORS origin or permission grant was added. The Preview reads the real public CMS; editor login on its new origin is a separate unverified configuration.

## Screenshots

| Template | Before desktop / mobile | After desktop / mobile |
| --- | --- | --- |
| Portfolio | [desktop](screenshots/before-portfolio-1440.webp) / [mobile](screenshots/before-portfolio-390.webp) | [desktop](screenshots/after-portfolio-1440.webp) / [mobile](screenshots/after-portfolio-390.webp) |
| Learn | [desktop](screenshots/before-learn-1440.webp) / [mobile](screenshots/before-learn-390.webp) | [desktop](screenshots/after-learn-1440.webp) / [mobile](screenshots/after-learn-390.webp) |
| Blog | [desktop](screenshots/before-blog-1440.webp) / [mobile](screenshots/before-blog-390.webp) | [desktop](screenshots/after-blog-1440.webp) / [mobile](screenshots/after-blog-390.webp) |
| Income case | [desktop](screenshots/before-income-1440.webp) / [mobile](screenshots/before-income-390.webp) | [full desktop](screenshots/after-income-1440-full.webp) / [full mobile](screenshots/after-income-390-full.webp) |
| Performance case | [desktop](screenshots/before-performance-1440.webp) / [mobile](screenshots/before-performance-390.webp) | [full desktop](screenshots/after-performance-1440-full.webp) / [full mobile](screenshots/after-performance-390-full.webp) |
| Portfolio design case | [desktop](screenshots/before-site-1440.webp) / [mobile](screenshots/before-site-390.webp) | [full desktop](screenshots/after-site-1440-full.webp) / [full mobile](screenshots/after-site-390-full.webp) |
| Budget case | [desktop](screenshots/before-budget-1440.webp) / [mobile](screenshots/before-budget-390.webp) | [full desktop](screenshots/after-budget-1440-full.webp) / [full mobile](screenshots/after-budget-390-full.webp) |
| About | [desktop](screenshots/before-about-1440.webp) / [mobile](screenshots/before-about-390.webp) | [restoration proposal desktop](screenshots/after-about-proposal-1440-full.webp) / [restoration proposal mobile](screenshots/after-about-proposal-390-full.webp) |
| About story proposal | Not published | [desktop](screenshots/after-story-proposal-1440-full.webp) / [mobile](screenshots/after-story-proposal-390-full.webp) |
| Article template fixture | No ordinary article currently published | [desktop](screenshots/after-article-layout-1440-full.webp) / [mobile](screenshots/after-article-layout-390-full.webp) |

Additional homepage and dark-theme screenshots are in `screenshots/`; [résumé print](resume-print.pdf) is included. Public screenshots and summarized evidence are committed; private CMS audits and credentials are excluded.

## Final matched mobile lab performance

| Metric | Released build | Candidate |
| --- | ---: | ---: |
| Lighthouse performance | 98 | 98 |
| LCP | 2.483 s | 2.481 s |
| CLS | 0 | 0 |
| TBT | 13.5 ms | 13 ms |
| Initial transfer | 245,971 bytes | 245,713 bytes |
| Initial JavaScript transfer | 148,119 bytes | 148,119 bytes |

Candidate hero transfer: 36,950 bytes. No new public client components or interaction packages. These meet the proposed local budgets in this run set; LCP is close to the 2.5s target and is not a field-performance guarantee. The small before/after difference is measurement noise, not evidence of a meaningful speed improvement.

Lighthouse 13.5 default mobile simulated throttling; Chrome 154; fresh Chrome profile per run; cold cache; sequential alternating released and candidate local production servers; configured same published CMS; 3 runs each. No browser or build concurrent with timing. Local lab results, not deployed field data. Full runs and medians are in [performance.json](performance.json).

Library attachment saving is unavailable in this Mac execution context. No output Library file identities are claimed; the verified files are available in this review folder and the draft PR.
