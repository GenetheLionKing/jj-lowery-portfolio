# JJ Lowery · Systems portfolio

JJ’s portfolio connects a business background with practical systems analysis. The homepage is deliberately short: a central portrait with business/systems perspectives, two Vector work samples, and LinkedIn/résumé links. The selected work describes income modeling and a performance investigation. AI-assisted development, conceptual deliverables, and helper-only performance measurements remain explicit.

## Stack

Next.js 16.3.4, React 19.2.8, strict TypeScript, pnpm 10.30.3, Node >=22. Static export, plain CSS, system fonts. Runtime dependencies remain Next, React, and React DOM. No analytics, remote fonts, animation packages, video, or WebGL.

Pages, diagrams, and the portrait are Server Components. The existing theme toggle and résumé print button are the only application Client Components. Next includes its normal navigation runtime. Homepage links disable speculative prefetching. All reading and ordinary navigation work without JavaScript.

## Local review

```sh
pnpm install --frozen-lockfile
pnpm check
PORT=3107 pnpm preview
```

Open [127.0.0.1:3107](http://127.0.0.1:3107). Preview binds only to loopback and serves the production export in `out/`. `pnpm dev` remains available for development. `NEXT_TELEMETRY_DISABLED=1` disables Next build/development telemetry locally.

| Command               | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `pnpm lint`           | ESLint, zero warnings                          |
| `pnpm typecheck`      | App Router types and TypeScript                |
| `pnpm build`          | Production static export                       |
| `pnpm check`          | All three required checks                      |
| `pnpm preview`        | Local production-export preview                |
| `pnpm portrait:build` | Rebuild responsive portraits from the original |

## Routes and content

- `/`: selected Vector systems work
- `/work/vector-income-architecture/`
- `/work/vector-performance-investigation/`
- `/work/bgm-budget-pacing/`: retained historical URL, not promoted by the homepage or résumé
- `/resume/`: HTML résumé and one-page Letter print layout

Navigation is Work, About, LinkedIn, Résumé. About points to the concise closing introduction. Employment history stays in the résumé. The previously hardcoded education credential has been omitted because the current brief does not verify it; historical documentation is not evidence of formal training.

Professional facts live in `data/profile.ts`; case-study evidence lives in `data/case-studies.ts`. Preserve the distinction between requirements and completed outcomes, and between measured helper time and end-to-end application latency. No new employer, degree, certification, testimonial, or metric has been introduced.

## Portrait and visual system

`public/images/profile_smile.jpg` is the unchanged, owner-supplied 1254px source. Responsive WebP and JPEG derivatives at 320, 640, and 960px are checked in. `pnpm portrait:build` uses Sharp already supplied by Next; it adds no dependency. The browser selects the appropriate image with a native `picture`/`srcset`. The hero uses eager/high-priority loading with intrinsic dimensions.

The split treatment is original inline SVG routing linework and CSS overlays/masks. It does not modify the portrait bitmap. The design uses cool white, charcoal, and blue. Light is the default, with the existing `jj-lowery-theme` preference preserved. Dark colors are screen-only, so printing stays light. Container queries keep the hero and work layout readable when text is enlarged. CSS motion never hides hero content and is removed under reduced motion.

## Publication workflow

The repository is connected to the existing Vercel project `jj-lowery-portfolio` in `genethelionkings-projects`. `main` is the Git production branch. Feature branches receive preview deployments; merging a PR into `main` publishes through that integration. Production uses Vercel’s configured Node 24.x. Do not infer deployment status from this README; verify the GitHub commit status, Vercel deployment metadata, and the live domain.

The redesign began in an isolated local worktree. Subsequent owner authorization permits a PR and production publication. No hosting account, DNS, plan, permissions, environment variable, or other project settings need to change.

See `docs/redesign-verification.md` for measured results, review evidence, limitations, and rollback reference. `docs/verification.md` is a historical v0.1 record.
