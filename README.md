# JJ Lowery · Systems portfolio

A compact portfolio with a clean central portrait, two plain-language roles, and three image-led work samples. The two Vector studies carry the systems-analysis evidence. The third describes this actual portfolio. AI-assisted development, conceptual deliverables, and helper-only performance measurements remain explicit.

## Stack

Next.js 16.3.4, React 19.2.8, strict TypeScript, pnpm 10.30.3, Node >=22. Static export, plain CSS, system fonts. No added application dependencies, tracking, remote fonts, animation package, video, or WebGL.

Pages, diagrams, and the portrait are Server Components. The existing theme toggle and résumé print button are the only application Client Components. Next includes its normal navigation runtime. Homepage links disable speculative prefetching. Reading and ordinary navigation work without JavaScript.

## Local review

```sh
pnpm install --frozen-lockfile
pnpm check
PORT=3110 pnpm preview
```

Open [127.0.0.1:3110](http://127.0.0.1:3110). Preview binds only to loopback and serves the production export in `out/`. `pnpm dev` remains available. Set `NEXT_TELEMETRY_DISABLED=1` to disable local Next build/development telemetry.

| Command | Purpose |
| --- | --- |
| `pnpm lint` | ESLint, zero warnings |
| `pnpm typecheck` | App Router types and TypeScript |
| `pnpm build` | Production static export |
| `pnpm check` | All three required checks |
| `pnpm preview` | Local production-export preview |
| `pnpm assets:build` | Rebuild the current portrait and work images |
| `pnpm portrait:build` | Rebuild the retained first-pass portrait derivatives |

## Routes and content

- `/`: analyst/builder hero and selected work
- `/about/`: concise public-source background and résumé link (local draft)
- `/portfolio/`: the same three selected work cards (local draft)
- `/contact/`: owner-confirmed LinkedIn, X, and Instagram links (local draft)
- `/work/vector-income-architecture/`: conceptual income model and requirements
- `/work/vector-performance-investigation/`: investigation with qualified helper measurements
- `/work/portfolio-design/`: this portfolio's actual design and development
- `/work/bgm-budget-pacing/`: retained historical URL, not promoted by selected work or résumé
- `/resume/`: HTML résumé and one-page Letter print layout

The header and footer repeat About, Portfolio, Résumé, and Contact, linked to the local pages. The homepage anchors `/#about` and `/#work` remain usable. `data/selected-work.ts` and the shared Server Component keep the homepage and Portfolio cards consistent. Separate X, LinkedIn, and Instagram icons use the owner's confirmed public URLs. The existing light/dark preference remains.

Professional facts live in `data/profile.ts`; supporting evidence lives in `data/case-studies.ts`. No degree, certification, employer, testimonial, or metric was invented. Historical documentation does not verify formal training. Keep the distinction between requirements and completed outcomes, and between measured helper time and end-to-end latency.

## Images and design

`public/images/profile_smile.jpg` is the unchanged 1254px owner photograph. `assets/portrait-matte.png` supplies only a background-removal mask; the pipeline combines it with the original photograph's RGB pixels. No generated face pixels or face-overlay artwork are used. `pnpm assets:build` uses Sharp already supplied by Next to create 320/640/960px transparent WebP and PNG derivatives. A native `picture`/`srcset` selects the portrait, with intrinsic dimensions and high-priority loading.

The Vector envelope image and validation artwork are existing public project marketing assets, copied into `assets/`. The envelope thumbnail illustrates the project; it does not claim that the conceptual income proposal is implemented. The validation illustration is not a screenshot or benchmark result. The portfolio thumbnail is an actual rendered screenshot of this site. The pipeline produces 640×480 WebP work images.

The second pass takes the broad composition of the owner's Adham Dannaway reference: compact dark masthead, white portrait hero, pale-gray work strip, three rounded image-led cards, and repeated footer navigation. It uses JJ's identity, photograph, work, and copy. Public Practical UI guidance informed restrained hierarchy, neutral surfaces, spacing, and concise text. No reference-site assets, code, copy, or professional claims were copied. CSS motion never hides content and is removed under reduced motion. All directional symbols and social marks are inline SVG.

## Publication and evidence

The existing Vercel project is `jj-lowery-portfolio` in `genethelionkings-projects`. The Git production branch is `main`; feature branches receive previews. Verify the actual commit status, deployment metadata, and live domain for each release. The configured production runtime is Node 24.x.

The published redesign was explicitly authorized and reviewed. **The About / Portfolio / Contact expansion is local preparation only.** Do not push this draft, open a PR, trigger external CI/Preview, deploy, merge, or publish under the current scope. Earlier release authorization does not authorize this new revision. No hosting account, DNS, plan, permissions, or project settings need to change.

See [second-pass verification](docs/second-pass-verification.md) and the [desktop](docs/design-review/home-desktop.webp) / [mobile](docs/design-review/home-mobile.webp) review screenshots. `docs/redesign-verification.md` records the superseded first pass; `docs/verification.md` records historical v0.1 checks.

See [local page verification](docs/local-pages-verification.md) for this draft’s copy sources, checks, local screenshots, and review gaps.
