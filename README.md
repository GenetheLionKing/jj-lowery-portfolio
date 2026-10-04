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

| Command                  | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `pnpm lint`              | ESLint, zero warnings                                  |
| `pnpm typecheck`         | App Router types and TypeScript                        |
| `pnpm build`             | Production static export                               |
| `pnpm check`             | All three required checks                              |
| `pnpm preview`           | Local production-export preview                        |
| `pnpm assets:build`      | Rebuild retained second-pass portraits and work images |
| `pnpm portrait:build`    | Rebuild the retained first-pass portrait derivatives   |
| `pnpm portrait:shoulder` | Rebuild the approved complete-shoulder portrait        |

## Routes and content

- `/`: analyst/builder hero and selected work
- `/about/`: concise public-source background and résumé link (review draft)
- `/portfolio/`: the same three selected work cards (review draft)
- `/contact/`: owner-confirmed LinkedIn, X, and Instagram links (review draft)
- `/work/vector-income-architecture/`: conceptual income model and requirements
- `/work/vector-performance-investigation/`: investigation with qualified helper measurements
- `/work/portfolio-design/`: this portfolio's actual design and development
- `/work/bgm-budget-pacing/`: retained historical URL, not promoted by selected work or résumé
- `/resume/`: HTML résumé and one-page Letter print layout

The header and footer repeat About, Portfolio, Résumé, and Contact, linked to the local pages. The homepage anchors `/#about` and `/#work` remain usable. `data/selected-work.ts` and the shared Server Component keep the homepage and Portfolio cards consistent. Separate X, LinkedIn, and Instagram icons use the owner's confirmed public URLs. The existing light/dark preference remains.

Professional facts live in `data/profile.ts`; supporting evidence lives in `data/case-studies.ts`. No degree, certification, employer, testimonial, or metric was invented. Historical documentation does not verify formal training. Keep the distinction between requirements and completed outcomes, and between measured helper time and end-to-end latency.

## Images and design

`assets/portrait-shoulder-approved.png` is the owner-approved version 2 portrait, with expanded shoulder contours, genuine transparency and unchanged original head pixels. `pnpm portrait:shoulder` validates its exact fingerprint and creates uncropped 320/640/960/1280px WebP and lossless PNG derivatives using Sharp already supplied by Next. The native `picture`/`srcset` keeps the full 1640×1294 aspect ratio, intrinsic dimensions and high-priority loading. Framing retains the previous portrait height where space permits.

`public/images/profile_smile.jpg`, `profile_serious.jpg`, the original matte and prior derivatives remain as source/history. The retained `portrait:build` and `assets:build` commands reproduce the earlier versions, rather than the newly approved portrait. See [portrait verification](docs/portrait-verification.md) for asset provenance, responsive framing and checks.

The Vector envelope image and validation artwork are existing public project marketing assets, copied into `assets/`. The envelope thumbnail illustrates the project; it does not claim that the conceptual income proposal is implemented. The validation illustration is not a screenshot or benchmark result. The portfolio thumbnail is an actual rendered screenshot of this site. The pipeline produces 640×480 WebP work images.

The second pass takes the broad composition of the owner's Adham Dannaway reference: compact dark masthead, white portrait hero, pale-gray work strip, three rounded image-led cards, and repeated footer navigation. It uses JJ's identity, photograph, work, and copy. Public Practical UI guidance informed restrained hierarchy, neutral surfaces, spacing, and concise text. No reference-site assets, code, copy, or professional claims were copied. CSS motion never hides content and is removed under reduced motion. All directional symbols and social marks are inline SVG.

## Publication and evidence

The existing Vercel project is `jj-lowery-portfolio` in `genethelionkings-projects`. The Git production branch is `main`; feature branches receive previews. Verify the actual commit status, deployment metadata, and live domain for each release. The configured production runtime is Node 24.x.

The redesign and About / Portfolio / Contact expansion were reviewed, approved and published through PRs #2 and #3. The owner subsequently approved the corrected version 2 portrait and explicitly requested publication. Use a narrow PR with passing checks and normal merge. No hosting account, DNS, plan, permissions, or project settings need to change.

See [second-pass verification](docs/second-pass-verification.md) and the [desktop](docs/design-review/home-desktop.webp) / [mobile](docs/design-review/home-mobile.webp) review screenshots. `docs/redesign-verification.md` records the superseded first pass; `docs/verification.md` records historical v0.1 checks.

See [local page verification](docs/local-pages-verification.md) for this draft’s copy sources, checks, local screenshots, and review gaps.
