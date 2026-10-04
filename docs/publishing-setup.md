# Publishing Preview: setup and verification boundary

The authorized milestone is code, local verification, draft PR and Preview review. No CMS account/project/dataset, role or access grant, API token, environment secret, hook, Production merge or publication is authorized in this task. None is created by the application or its build.

## Proposed architecture

The existing Next 16 / React 19 / TypeScript / pnpm / plain CSS / system-font site remains. Export-only output must become cached Next rendering with incremental static regeneration so newly published posts and edits can appear without rebuilding or creating deployment hooks. The public routes remain server-rendered/cacheable HTML with no CMS runtime in their browser bundle. Content refresh is a 60-second revalidation interval plus a subsequent request, not an instant update promise.

Sanity Studio supplies authenticated owner editing at `/studio/`. About and Résumé are singleton documents; Article, Case Study and Resource are separate structured types with shared editorial/card/taxonomy fields. Learn curates educational articles/resources/cases, Blog lists articles, Portfolio lists cases. Existing case URLs, public qualifications, print behavior and approved portrait are preserved.

Public Sanity reads use the published perspective without any token. A public dataset's unauthenticated requests cannot read draft/release IDs. Studio uses the editor's normal Sanity login session; no robot read/write token is embedded or required by this design. Only JJ should have editing membership. No website mutation API is created.

## Exact setup bundle, for separate approval

1. JJ selects/creates a Sanity account, project and public dataset (suggested name `portfolio`). Review the chosen plan/terms; do not assume or authorize a paid plan.
2. Confirm JJ is the sole editing member; no anonymous writes, invitation or access grant is performed by code. Do not add broad custom roles or shared tokens.
3. Add only actual trusted local/Preview Studio origins to Sanity CORS with authenticated sessions enabled. Preview's stable alias is preferable to per-deployment URLs. No wildcard credential origin.
4. Supply **non-secret** `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to the local/Preview environment. No read/write API token, draft secret or deployment hook is needed for the proposed model.
5. With JJ's authorized Sanity login, import the prepared existing-public-content seed. Import proposed original articles as drafts for review; publishing them is a separate editorial action. The migration command must be explicitly invoked, never run by build/deploy.
6. Verify the real owner workflow: login; save and reopen draft; anonymous draft isolation; publish/update/unpublish; observe actual site update and cache timing. Also verify a non-member/unauthenticated user cannot mutate content. Only then describe publishing as operational.

Until that setup is authorized and completed, Preview shows repository seed content and the Studio route explicitly reports setup is required. Local model/parser/render tests and mocked transport evidence are not authenticated CMS workflow evidence. Configuration failures must not silently switch back to seed or resurrect unpublished content.

## Privacy and assets

Text drafts remain inside authenticated Studio. Standard Sanity asset URLs are publicly accessible, including assets attached to private drafts or private datasets. Initial imagery reuses the already-public approved portrait and project artwork; do not upload private media. This asset limitation must remain visible in editor guidance if uploads are later enabled.

No Production setup, contact delivery, GA4, other tracking, Pages tracker duplication, or Vector changes are part of this work.

Official sources: [Sanity data security](https://www.sanity.io/docs/content-lake/keeping-your-data-safe), [published/draft perspectives](https://www.sanity.io/docs/content-lake/perspectives), [embedded Studio](https://www.sanity.io/docs/studio/embedding-sanity-studio), [Next ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration). These establish the proposed boundaries; real project configuration remains to be verified.
