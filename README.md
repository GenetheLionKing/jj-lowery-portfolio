# JJ Lowery · Systems portfolio

A compact portfolio with a clean central portrait, two plain-language roles, and three image-led work samples. The two Vector studies carry the systems-analysis evidence. The third describes this actual portfolio. AI-assisted development, conceptual deliverables, and helper-only performance measurements remain explicit.

## Codex UI guidance

[Project instructions](AGENTS.md) require consultation of the [Portfolio UI skill](.agents/skills/portfolio-ui-design/SKILL.md) before UI changes and actual desktop/mobile screenshot review. Its concise original reference includes private-book page pointers; the purchased book is not included or required for a checkout.

## Stack

Next.js 16.3.4, React 19.2.8, strict TypeScript, pnpm 10.30.3, Node >=22.12, plain CSS and system fonts. This publishing Preview changes export-only output to cached Next rendering with 60-second incremental static regeneration. New published URLs and edits can appear without a rebuild hook. Indexes use published content and author placement tags; there are no visitor tag filters.

Sanity Studio 6.17.0 provides editing on its own route; next-sanity 13.3.4 embeds it. The public pages use validated, published-only, token-free server reads. Portable Text renders article content on the server. Public production pages collect automatic GA4 page views for the owner-approved destination, with no opt-in prompt; Studio, previews and local development are excluded. See [Analytics scope and verification](docs/analytics.md). No remote fonts, animation package, video or WebGL is added.

The homepage, indexes, About and résumé use App Router Server Components. Article and case-detail routes use Next Pages blocking ISR so missing/unpublished content returns a readable native 404 without JavaScript. Their content renders into initial HTML and uses normal Next hydration. The existing theme toggle and résumé print button remain. The CMS editor is isolated under `/studio/`; its runtime is not imported by public pages. Next includes its normal navigation runtime. Links disable speculative prefetching. Reading and ordinary navigation work without JavaScript.

## Local review

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:content
PORT=3130 pnpm preview
```

Open [127.0.0.1:3130](http://127.0.0.1:3130). Preview binds only to loopback and serves the production build in `.next/`. `pnpm dev` remains available. Set `NEXT_TELEMETRY_DISABLED=1` to disable local Next build/development telemetry.

With both public Sanity identifiers unset, local and Preview builds use repository content and explicitly label proposed writing. `/studio/` explains that editing is not connected. Unconfigured Vercel Production rejects seed content. Partial or malformed configuration fails closed; a configured CMS never falls back to seed content when a record is unpublished. This is not an operational CMS until separately authorized setup and real owner workflow verification are complete. See [the exact setup bundle](docs/publishing-setup.md).

See [publishing verification](docs/publishing-verification.md) for screenshots, measured performance, fresh code review and no-JavaScript/cache-transition regression evidence. This draft is for review and must not be merged into Production yet.

| Command                  | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `pnpm lint`              | ESLint, zero warnings                                      |
| `pnpm typecheck`         | App Router types and TypeScript                            |
| `pnpm build`             | Production Next build                                      |
| `pnpm check`             | Lint, types, content/Studio tests, build and HTTP routes   |
| `pnpm preview`           | Local production preview                                   |
| `pnpm test:content`      | Content boundaries, migration and native Studio validation |
| `pnpm test:routes`       | Built HTML/HTTP status and missing-route HTML regressions  |
| `pnpm content:seed`      | Generate local NDJSON only; does not import or publish     |
| `pnpm assets:build`      | Rebuild retained second-pass portraits and work images     |
| `pnpm portrait:build`    | Rebuild the retained first-pass portrait derivatives       |
| `pnpm portrait:shoulder` | Rebuild the approved complete-shoulder portrait            |

## Routes and content

- `/`: analyst/builder hero and selected work
- `/about/`: editable background, strengths, guitar interest and builds; tagged post main images supply the photo strip
- `/about/story/`: longer background from the About singleton
- `/portfolio/`: published posts tagged Portfolio, including original cases
- `/learn/`: curated educational articles, cases and external resources
- `/blog/` and `/blog/[slug]/`: articles, guides and individual posts
- `/studio/`: authenticated Sanity editor after authorized setup; honest setup screen beforehand
- `/contact/`: owner-confirmed LinkedIn, X, and Instagram links
- `/work/vector-income-architecture/`: conceptual income model and requirements
- `/work/vector-performance-investigation/`: investigation with qualified helper measurements
- `/work/portfolio-design/`: this portfolio's actual design and development
- `/work/bgm-budget-pacing/`: retained historical URL, not promoted by selected work or résumé
- `/resume/`: HTML résumé and one-page Letter print layout
- `/privacy/`: factual Analytics disclosure, linked from the shared footer

The header and footer repeat About, Portfolio, Learn, Blog and Contact. Résumé navigation is hidden by request; the direct page, singleton editor and print layout remain. Homepage anchors `/#about` and `/#work` remain usable. `content/public.ts` supplies published content to App pages; `content/detail.ts` supplies server-only static props for detail routes. Separate X, LinkedIn and Instagram icons use the owner's confirmed public URLs. The existing light/dark preference remains.

Original professional facts live in `data/profile.ts`; supporting evidence lives in `data/case-studies.ts`. A single Post editor supports ordinary writing and optional structured case layouts. Placement tags (`about-gallery`, `learn`, `portfolio`, `home`) control listings without duplicating a post or changing its URL. Topic tags are editorial metadata. About thumbnails use the post's main image and link to its canonical detail page; missing images and drafts are omitted. No personal-story posts/photos have been selected yet, so this Preview does not fabricate a gallery.

Structured repository seeds are in `content/seed.ts`; schemas and validation are in `studio/` and `content/model.ts`. The migration preserves every existing case-study field. Proposed original articles, curated resources and expanded About are draft IDs in the generated import. No degree, certification, employer, testimonial, publication date or metric was invented. Guitar interest is supported by JJ's direct report, with no invented duration or ability rating. Historical documentation does not verify formal training. Keep the distinction between requirements and completed outcomes, and between measured helper time and end-to-end latency.

## Images and design

`assets/portrait-shoulder-approved.png` is the owner-approved version 2 portrait, with expanded shoulder contours, genuine transparency and unchanged original head pixels. `pnpm portrait:shoulder` validates its exact fingerprint and creates uncropped 320/640/960/1280px WebP and lossless PNG derivatives using Sharp already supplied by Next. The native `picture`/`srcset` keeps the full 1640×1294 aspect ratio, intrinsic dimensions and high-priority loading. Framing retains the previous portrait height where space permits.

`public/images/profile_smile.jpg`, `profile_serious.jpg`, the original matte and prior derivatives remain as source/history. The retained `portrait:build` and `assets:build` commands reproduce the earlier versions, rather than the newly approved portrait. See [portrait verification](docs/portrait-verification.md) for asset provenance, responsive framing and checks.

The Vector envelope image and validation artwork are existing public project marketing assets, copied into `assets/`. The envelope thumbnail illustrates the project; it does not claim that the conceptual income proposal is implemented. The validation illustration is not a screenshot or benchmark result. The portfolio thumbnail is an actual rendered screenshot of this site. The pipeline produces 640×480 WebP work images.

The second pass takes the broad composition of the owner's Adham Dannaway reference: compact dark masthead, white portrait hero, pale-gray work strip, three rounded image-led cards, and repeated footer navigation. It uses JJ's identity, photograph, work, and copy. Public Practical UI guidance informed restrained hierarchy, neutral surfaces, spacing, and concise text. No reference-site assets, code, copy, or professional claims were copied. CSS motion never hides content and is removed under reduced motion. All directional symbols and social marks are inline SVG.

## Publication and evidence

The existing Vercel project is `jj-lowery-portfolio` in `genethelionkings-projects`. The Git production branch is `main`; feature branches receive previews. Verify the actual commit status, deployment metadata, and live domain for each release. The configured production runtime is Node 24.x.

The redesign, About / Portfolio / Contact expansion and corrected version 2 portrait were reviewed, approved and published through PRs #2, #3 and #4. This publishing branch is authorized for a draft PR and Preview only. It must not merge or publish to Production before explicit release authorization, CMS setup and actual owner-workflow verification. Code/builds do not provision a Sanity project, grant access, create tokens, change environment variables or create deployment hooks.

See [second-pass verification](docs/second-pass-verification.md) and the [desktop](docs/design-review/home-desktop.webp) / [mobile](docs/design-review/home-mobile.webp) review screenshots. `docs/redesign-verification.md` records the superseded first pass; `docs/verification.md` records historical v0.1 checks.

See [local page verification](docs/local-pages-verification.md) for this draft’s copy sources, checks, local screenshots, and review gaps.

The latest [whole-site design review](docs/publishing-design-review.md) covers the split index heroes, featured Blog layout and About résumé CTA removal. [Cloud handoff](docs/cloud-handoff.md) records tools, access and mandatory safe Mac synchronization.
