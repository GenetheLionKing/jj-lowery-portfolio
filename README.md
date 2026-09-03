# JJ Lowery · Systems portfolio

Version 0.1 of James “JJ” Lowery’s professional Systems Analyst / Business Systems Analyst portfolio. The site presents systems analysis as proof of work: investigation, domain modeling, explicit rules, workflow design, and validation.

## Stack

- Next.js 16 with App Router and static HTML export
- React 19 and strict TypeScript
- Plain CSS with shared design tokens and focused stylesheets
- ESLint with Next.js accessibility, Core Web Vitals, and TypeScript rules
- System sans-serif and monospace fonts; no font service or remote assets

Only Next.js, React, and React DOM are runtime dependencies. Pages and diagrams are Server Components. The résumé’s print button is the only authored Client Component. Next.js includes its normal routing runtime; no animation or UI library is used.

## Local setup

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000). No environment variables or credentials are required. To disable Next.js development/build telemetry locally, set `NEXT_TELEMETRY_DISABLED=1` in your shell.

## Commands

| Command          | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `pnpm dev`       | Start local Next.js development                                |
| `pnpm lint`      | Run ESLint; warnings fail the check                            |
| `pnpm typecheck` | Generate route types and run TypeScript without emitting files |
| `pnpm build`     | Build every route and export static files to `out/`            |
| `pnpm check`     | Run lint, type checks, and a production build                  |
| `pnpm preview`   | Serve `out/` on loopback for local production inspection       |

`PORT=3007 pnpm preview` selects an alternate local port. The preview server binds only to `127.0.0.1` and is intended for local review. Run `pnpm build` before previewing changes. No `next start` server is needed for the static export.

## Project architecture

```text
app/
  layout.tsx              Shared document, metadata, header, and footer
  page.tsx                Homepage composition
  work/[slug]/page.tsx     Three case studies generated from content
  resume/page.tsx          HTML résumé with print layout
  not-found.tsx           Custom 404
  globals.css             Tokens, base styles, homepage, responsive rules
  icon.svg                Local favicon
components/
  case-study.tsx          Shared eight-part case-study template
  diagrams.tsx            Flows, models, metrics, principles, and skill tags
  profile-image.tsx       Build-time portrait selection and fallback
  print-button.tsx        Small client boundary for native browser printing
  site-header.tsx
  site-footer.tsx
data/
  case-studies.ts         Typed case studies and structured content blocks
  profile.ts              Profile, contact, experience, skills, supporting work
styles/
  case-study.css
  diagrams.css
  resume.css              Screen and print résumé styles
public/images/           Drop the professional portrait here
scripts/preview.mjs       Dependency-free local export preview
docs/verification.md      Version 0.1 review record
```

## Routes

- `/`
- `/work/bgm-budget-pacing/`
- `/work/vector-income-architecture/`
- `/work/vector-performance-investigation/`
- `/resume/`

Trailing slashes allow direct static directory routing. The Work, Capabilities, Experience, and About navigation links point to homepage sections from every route. Unknown case-study slugs are not generated.

## Content architecture

Update professional details in `data/profile.ts`. Case-study summaries, metadata, skills, and the seven narrative sections live in `data/case-studies.ts`; the shared template renders Skills Demonstrated as section eight. Content blocks support prose, evidence lists, decision rules, comparisons, formulas, process flows, metric callouts, and semantic system diagrams.

Content uses only the professional facts supplied for this project. No private Vector repository or source code was accessed or copied. The diagrams were authored specifically for this public portfolio. Income modeling is presented as requirements and acceptance criteria, without claiming a completed rollout. Performance timings are helper measurements, not end-to-end request latency. Company-wide BGM use is evidence of adoption, not proof of an unprovided ROI metric.

The BGM formula explanation distinguishes a projected shortfall from total unspent budget: a shortfall produces an incremental correction; total remaining budget divided by days left produces a total daily target. Review this terminology against the original worksheet before publishing.

## Adding the profile photograph

Add **`public/images/profile.jpg`**, then restart development or rebuild. `ProfileImage` detects the file at build/render time and replaces the neutral monogram composition automatically. There is no request for a missing image and no third-party portrait source.

Use a professional portrait with enough room around the face for the responsive crop, ideally at least 1000 pixels wide. The shared frame uses `object-fit: cover`; adjust `--portrait-position` in `app/globals.css` if the subject needs a different focal point. The default is `50% 35%`. The image has descriptive alternative text and adapts to desktop and mobile. Strip any private EXIF/location metadata from the photograph before placing it in this public repository.

## Accessibility and design

The site uses semantic landmarks, a skip link, one H1 per page, visible keyboard focus, real navigation links, text-based diagrams, responsive grids, and reduced-motion support. All content is readable without JavaScript. Navigation remains visible on small screens. The résumé supports the browser’s Print / Save as PDF flow with a dedicated print stylesheet.

## Deployment status

**Deployment is intentionally not configured.** No deployment, hosting project, Vercel configuration, domain, analytics, database, CMS, authentication, or external service integration is included.

Page titles, descriptions, Open Graph text, Twitter summary metadata, language, and a favicon are included. A canonical origin, sitemap, and absolute social image URLs are intentionally deferred until a real public URL is chosen; there are no fabricated domain or LinkedIn placeholders. `out/` contains local build artifacts and is ignored by Git.
