# Simple article review

New draft PR on `publishing/simple-articles`. No CMS content is changed by this branch. Existing `/work/` and `/blog/` URLs use one centered article template: title, subtitle, JJ's existing portrait/name, truthful dates, optional existing artwork, rich body and a short Recent articles list. No company/category eyebrow, project metadata strip, generated contents/section numbering, skills promotion or next-case footer.

The existing structured cases are adapted at read time. All authored headings, paragraphs, facts, formulas, rules, comparisons and benchmark qualifications remain. Vector's AI assistance and the income work's conceptual qualification previously in template chrome are included in the prose. The archived CMS fields are retained. The performance article has no approved hero photograph; its original qualified measurement diagram remains in the body. A hero upload is optional rather than an invented asset.

New Posts default to Article. The native editor supports paragraphs, H2/H3 headings, quotes, lists, strong/emphasis, safe links, inline JPG/PNG/WebP images with required alternative text and optional captions, and existing system illustrations. Placement checkboxes remain independent. Display/search options and legacy source are collapsed. Explicit External link and Existing custom page destinations create link cards, not invented pages or downloads. Custom page choices are limited to the existing homepage, About, Résumé and Contact.

Signed-in Studio has Form and Preview views. Preview renders the supplied Studio document state; it makes no draft query and requires no public draft token or additional grants. New draft edits do not acquire fictitious publication or update history. For a legacy Post, the explicit **Edit as article** action copies its preserved source into the rich editor and leaves the archive intact. The action does not publish.

## Atlas writing workflow

1. Write concise prose with meaningful headings, preserving the actual source and qualifications. Choose Article unless an explicit external or custom destination is intended.
2. Create one unpublished Post in Studio, or prepare one local draft from a reviewed JSON object with `node --import tsx scripts/prepare-post.ts input.json new-draft.ndjson`. The helper validates one new Post, assigns a new `drafts.post-…` identity, refuses existing identities/overwrites and contacts no CMS. Importing or editing a CMS draft is a separate authorized action; do not import the repository-wide seed or overwrite another draft.
3. Review the **Preview** tab while signed in. Check title/subtitle/body, inline images/captions/alt, real dates and mobile reading. For older work, use **Edit as article** only when editing its rich body is intended.
4. Select Homepage, Portfolio, Learn, Blog and/or About-gallery independently. Topic tags do not publish or place a Post. About-gallery requires a main image.
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
