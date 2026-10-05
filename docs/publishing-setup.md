# Publishing Preview: setup and owner workflow

This milestone supplies code, local verification and a draft PR/Preview. CMS account setup and Production release remain separate actions. No account, project, dataset, membership, token, environment setting, hook or Production deployment was changed.

## Authoring model

One **Post** editor handles ordinary articles and optional structured case studies. Every post has one canonical URL. The four original case URLs remain `/work/*`; ordinary posts use `/blog/*`. Placement does not change the URL or duplicate the content.

The **Tags & placement** field controls distribution:

| Tag             | Public placement                                            |
| --------------- | ----------------------------------------------------------- |
| `portfolio`     | Portfolio                                                   |
| `learn`         | Learn                                                       |
| `about-gallery` | About's linked image-only gallery, when a main image exists |
| `home`          | Selected structured cases on Home                           |

Published ordinary articles remain in Blog when placement tags are removed. Visitor-facing topic/type filters are absent. Resources remain a separate optional reference type. About and Résumé have dedicated singleton editors; Résumé is hidden from shared navigation but keeps its direct URL, About link and print behavior.

The About gallery uses a tagged published post's main image, title as its accessible link label and canonical URL. It contains no visible captions or arrows. Draft, unpublished and image-less posts do not appear. JJ still needs to choose personal posts/photos; no childhood history or new personal assets were invented. The gallery fixture screenshots use an existing portrait and a clearly labeled local mock post only.

## Exact setup bundle, for separate approval

1. JJ selects or creates a Sanity account, project and **public** dataset. Review the selected plan and terms; no paid plan is assumed or authorized.
2. Confirm JJ is the sole editing member using real backend membership permissions. Studio's singleton menus and hidden duplicate/delete controls are conveniences, not access controls. No invitation, broad role or shared token is needed.
3. Configure only actual trusted localhost and stable Preview Studio origins for credentialed CORS. Avoid wildcard credential origins.
4. Add the non-secret `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to local/Preview configuration. No public read/write token, draft secret or deployment hook is required.
5. With JJ's explicitly authorized authenticated session, import the locally generated baseline. Existing public About, Résumé and four cases are published records; expanded About, proposed articles and resources are drafts. Build/deploy never imports or publishes content.
6. Verify owner login; draft save/reopen; image upload; placement tag add/remove; publish/update/unpublish; canonical URLs and all affected views; singleton editing and résumé print. Separately verify anonymous draft isolation and unauthenticated/non-member write rejection. Measure actual site-refresh timing before describing the editor as operational.

The owner actions are account/plan selection, login, personal photo/post choices and editorial review. Allow roughly 15–30 minutes for those decisions and 30–60 minutes for joint workflow verification once setup is available; these are working estimates, not delivery guarantees. No live editor workflow has been claimed or tested.

## Architecture and privacy

The existing Next 16.3.4 / React 19.2.8 / TypeScript / pnpm stack, system fonts and plain CSS remain. Indexes use cached server rendering. Article/case details use native Pages Router blocking ISR with a 60-second revalidation interval, including cached missing pages. This targeted routing choice provides full readable HTML for missing/unpublished URLs without JavaScript. Updates require cache expiry and a subsequent request; publication is not instant.

Public reads explicitly request published content without an API token and exclude draft/release IDs defensively. Configured empty/unpublished content does not resurrect repository seed. Missing Production configuration fails instead of publishing Preview seed; local/unconfigured Preview remains clearly a seed review. Failed transport/configuration does not fall back to seed, although normal ISR can retain the last successful page during an upstream outage. Server reader/configuration code is removed from public detail bundles by Next.

Studio uses native Sanity owner authentication. Its setup screen says editing is unavailable until configured. Main-image upload accepts JPEG, PNG and WebP with validated dimensions and alternative text. Standard Sanity asset URLs are **public even when attached to draft posts**. The editor warns about this; use only images intended for public access. There are no crop/hotspot controls or private-asset promises.

No Production setup, contact delivery, analytics or Vector work is included. Real account configuration, authenticated Preview rendering and physical iPhone Safari safe-area checks remain outstanding.

Official references: [Sanity data security](https://www.sanity.io/docs/content-lake/keeping-your-data-safe), [published perspectives](https://www.sanity.io/docs/content-lake/perspectives), [embedded Studio](https://www.sanity.io/docs/studio/embedding-sanity-studio), [Pages Router ISR](https://nextjs.org/docs/pages/guides/incremental-static-regeneration).
