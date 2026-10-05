# Sanity Preview connection — 5 October 2026

JJ's deployed Preview Studio is connected and its owner draft/publish workflow was exercised. PR #5 stays draft. Production/main, jjlowery.com, the existing `production` dataset and Vector repositories were untouched.

## Scope and configuration

JJ confirmed project **JJ Lowery Portfolio**, organization **JJ Lowery**, project ID `hi61zp16`, public dataset `portfolio`. JJ created the dataset and saved credentialed CORS for the stable Preview origin. Existing localhost CORS was not expanded. The selected plan was not changed.

After JJ directly approved the exact settings, these two non-secret variables were saved in project `jj-lowery-portfolio`, team `genethelionkings-projects`, **Preview branch `publishing/sanity-preview` only**:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=hi61zp16`
- `NEXT_PUBLIC_SANITY_DATASET=portfolio`

API metadata confirmed both variables have only the `preview` target and the exact branch. Native CLI Google login succeeded after JJ completed browser authentication. No manually created API key, credential extraction, draft secret, hook, membership change or deployment-protection change was used.

Configured deployment `dpl_AkUG6YBUFFA1VwYpSnq5GCpHtcgJ` was READY at source `3f5489623bb04d54b569a556ba810f3d5faa3c6c`, with the stable [Preview Studio](https://jj-lowery-portfolio-git-publis-75a1eb-genethelionkings-projects.vercel.app/studio/) alias. Production remained deployment `dpl_486sZqKZcgjUCC6zfCa2dQvZvke3`, source `2b4ebd199182306a671f282c19a907b60bc46828`.

## Baseline import and cleanup

Authenticated legacy raw-perspective reads found 12 native system permission/retention records, **zero non-system content and zero drafts**. The generated NDJSON used committed `migrationDocuments()` filtered to IDs without a period. `decodePublishedContent` validated About, Résumé, four cases, **zero articles and zero resources**. Official import CLI reported six imported documents, with no replace/missing flags:

- `about`
- `resume`
- `case-vector-income-architecture`
- `case-vector-performance-investigation`
- `case-portfolio-design`
- `case-bgm-budget-pacing`

Expanded About, proposed articles and resources were not imported. The anonymous published reader returned the four original `/work/*` URLs. Original copy, benchmark qualifications and AI-assisted-development qualifications were preserved.

The lifecycle fixture used only `cms-verification-20261005`, its draft, and an already-public portrait derivative uploaded as a temporary Sanity image asset. Cleanup removed both fixture document IDs and the test asset document. Authenticated comparison before and after cleanup confirmed all six baseline documents exactly match the imported originals, excluding Sanity's revision/timestamp metadata. Exactly those six non-system records remained at `2026-10-05T03:37:09.048Z`. Asset-document removal is not a promise of immediate CDN erasure.

## Actual verification

- JJ's regular Chrome screenshot showed the deployed, signed-in Studio and singleton/Post editors. JJ confirmed changing the fixture title, saving, reloading and reopening it. A subsequent authenticated read confirmed the exact saved title. JJ then published it through Studio; the anonymous reader confirmed publication. Google's rejection of the automated browser was respected; regular native Chrome worked.
- JJ was the sole human member returned by the native membership listing, with the Administrator role. No membership change was made.
- While the fixture was a real draft, anonymous raw-perspective reads returned zero matching records; its configured site URL returned 404. Anonymous draft isolation also passed after unpublishing it.
- An anonymous dry-run create mutation returned **403**, requiring the `create` permission. No document was created by that probe. An independently authenticated non-member session was unavailable and was not claimed tested.
- Native CLI image upload succeeded; the public reader resolved native image URL, alt text and 320×320 dimensions. The real gallery image loaded through Sanity's CDN. At 390px it had an image-only canonical link, an accessible title and no visible caption or horizontal overflow. Upload through Studio's browser file-picker remains unverified.
- Owner-authorized native CLI operations then updated the temporary published record, removed all placement tags, unpublished it to a draft and restored it. These are backend lifecycle checks; they are not presented as additional owner UI interactions. No baseline record was edited.
- The canonical article URL stayed `/blog/cms-verification-20261005/`. Initially Blog, Portfolio, Learn and About linked to that same URL. Removing all tags kept it in Blog and at the URL while removing the three optional placements. Unpublishing removed every listing and returned the site's readable no-JS 404. Restoration recovered the same URL and Blog listing.
- Twenty CMS-backed page/width combinations (About, Blog, Portfolio, Learn, Résumé × 320/390/768/1440) had a main element, heading and no horizontal overflow or seed-writing notice. The actual CMS-backed résumé PDF contains one page. Earlier full keyboard, reduced-motion, zoom, dark/light, no-JS and axe evidence remains in the design review; this setup did not change public page components.
- Actual Studio-schema validation returned `[]` after recognizing two retained legacy metadata fields. This does not invent new public placement controls: tags still control placement.

## Cache observations and limits

These are the real `portfolio` dataset feeding the local compiled Next server at `127.0.0.1:3132`, with five-second polling and the existing 60-second revalidation. They are not the earlier mock transport exercise and do not measure Vercel edge/geographic caches or field performance.

| Transition                           |                               Observed completion | Result                                       |
| ------------------------------------ | ------------------------------------------------: | -------------------------------------------- |
| Initial owner publication            | 25.114 s after first published-reader observation | Canonical URL and all four listings present  |
| Title update and removal of all tags |                5.997 s from native mutation start | Updated URL/Blog; optional placements absent |
| Unpublish                            |               61.474 s from native mutation start | Readable 404; all listings absent            |
| Restore                              |               61.148 s from native mutation start | Same URL and Blog listing restored           |

Cache age affects these results. Publication time before the first observation is not included in the initial measurement. No instant-refresh guarantee or new field-performance score is inferred. The prior matched cold-cache Lighthouse measurements remain historical lab evidence; they were not rerun or relabeled as configured-CMS performance.

## Small fixes and review evidence

The route regression script now discovers generated article URLs from the build manifest instead of demanding an unimported proposed article. It still checks real HTTP/HTML, original case URLs, résumé, readable GET/HEAD 404s and navigation. The Post schema recognizes imported `featured`/`learn` booleans as hidden, read-only legacy metadata, eliminating unsupported-field warnings without changing tag-driven placement.

Final `pnpm check` passed zero-warning lint, type generation/TypeScript, all 16 content/Studio tests, configured production build and real HTTP route checks; `git diff --check` passed. [Check output](publishing-review/cms-connection/check.txt), [desktop homepage](publishing-review/cms-connection/home-light-1440.png), [mobile homepage](publishing-review/cms-connection/home-light-390.png) and [one-page résumé print](publishing-review/cms-connection/resume-print.pdf) are saved with the portable evidence. Raw observations and bounded NDJSON remain in ignored `review/`. No credential file or auth state is part of the deliverables. The checkpoint identity is recorded in the handoff.

Remaining limits: physical iPhone Safari, independent authenticated non-member rejection, Studio file-picker upload, exact deployed public-cache timing and human assistive-technology review. Production setup/release, personal content choices, contact delivery and analytics remain separate decisions. No merge or Production release is claimed.
