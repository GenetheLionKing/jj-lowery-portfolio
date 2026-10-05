# Cloud coding handoff and Mac sync

The portfolio is a low-friction cloud candidate: all source, lockfile, approved image derivatives and review artifacts are in Git. It uses Next/React/TypeScript, plain CSS and system fonts, with no native Mac build requirement, Docker or mandatory CMS credentials for local/Preview review. This document prepares migration; it does not create an environment, account, credential or permission.

## Repository and review checkpoint

Repository: `GenetheLionKing/jj-lowery-portfolio`. Continue draft PR #5 on `publishing/sanity-preview`; do not merge or change Production. The final handoff reports the exact pushed/local SHA; resolve it again with `git rev-parse HEAD` and PR metadata before starting. Main/Production remain on `2b4ebd199182306a671f282c19a907b60bc46828`.

Canonical Mac repository: `/Users/jameslowery/projects/jj-lowery-portfolio`. Current review worktree: `/Users/jameslowery/Documents/Codex/2026-10-02/task-5/portfolio-publishing`, branch `publishing/sanity-preview`. The canonical main checkout remains at its earlier local commit and is not reset or switched to satisfy review synchronization.

All app assets needed for this revision, compact test/audit evidence, desktop/mobile/theme screenshots and résumé PDF are committed. Local-only material includes ignored `review/` build/fixture/raw Lighthouse outputs, `.next/`, `node_modules/`, sibling `review-tools/` browser tooling/drivers and saved reference screenshots outside this repository. Those are not prerequisites for restoring the app; preserve them if the Mac workspace is retained. Saved reference reasoning is linked from [the design review](publishing-design-review.md). No uncommitted app change is intended at handback; verify Git status.

## Tools and checks

Use Node >=22.12 (this Mac uses 26.7.0), pnpm 10.30.3, Git and the existing lockfile:

```sh
pnpm install --frozen-lockfile
NEXT_TELEMETRY_DISABLED=1 pnpm check
NEXT_TELEMETRY_DISABLED=1 pnpm exec next start --hostname 127.0.0.1 --port 3130
```

`pnpm check` runs lint, type generation/TypeScript, content/native Studio tests, production build and real built HTTP regressions on an isolated loopback port. Run the server once per workspace; do not start parallel browsers. `node --import tsx scripts/verify-publishing-transitions.ts` is the optional local mock cache-transition exercise; it creates isolated fixtures and does not access a real Sanity project. `pnpm content:seed` only generates NDJSON and never imports or publishes it.

Browser verification additionally needs Chromium/Chrome and the executor's supported browser automation. This Mac's separate tooling uses Puppeteer Core 25.12.0, agent-browser 0.38.2, axe and Lighthouse 13.5.0 with `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Existing sibling drivers contain Mac-specific paths and need adapting to a cloud executor; they are not claimed portable tests. Keep browser tooling separate from app dependencies, use system fonts, and rerun responsive/light-dark/keyboard/reduced-motion/200% zoom/no-JS/print and screenshot review. A fresh cloud run is needed before comparing performance across different machines.

For an isolated code-only seed review, leave both Sanity public identifiers unset. The owner-approved deployed Preview now uses project `hi61zp16`, dataset `portfolio`; see [the connection review](sanity-connection-review.md) for scope and evidence. Do not connect another project or change Production settings. Preview seed is labeled; unconfigured Vercel Production intentionally fails rather than exposing it.

Minimum access: repo clone/network package installation and writable isolated checkout for coding; existing scoped repo push/PR access for authorized draft updates. Git integration already builds Preview after a push. Existing read-only deployment metadata access is useful for exact-head verification; protected rendered Preview review needs the owner's authorized Vercel session. No new token, secret, broad account access, Production settings, CMS membership or infrastructure is required for a code-only pass.

## Mandatory cloud-to-Mac synchronization

JJ requires **every future cloud work pass** to sync its resulting branch/commits back to his Mac and verify local readiness unless he explicitly overrides this requirement. A remote push alone is not a completed handback.

1. Report cloud branch and exact pushed SHA, then verify Mac is connected and inspect the canonical repo plus intended review worktree's branch, remote and `git status`.
2. Preserve every local modification. If changes/conflicts/divergence exist, report them and leave sync unfinished; never force-reset, force-push, silently stash, overwrite or merge an unapproved PR to satisfy sync.
3. Fetch authorized remote refs into the canonical repository. Use the existing isolated `publishing/sanity-preview` worktree when appropriate; check whether that branch is already checked out before creating another. With a clean worktree and compatible ancestry, fast-forward only (`git merge --ff-only origin/publishing/sanity-preview`). Do not update or merge main/Production for a Preview pass.
4. Compare the local worktree HEAD with the exact cloud pushed SHA, run appropriate local dependency/build/check commands, verify the local preview and relevant rendered behavior, and report local status/check results and review paths.
5. If Mac is offline, permissions/access are unavailable, checks fail or conflicts prevent safe fast-forward, explicitly say **local sync unfinished** and do not call handback complete. Atlas coordinates recovery/setup; migration does not override the Production or CMS gates.

Current work was completed on the Mac, so no executor transfer or cloud-to-Mac sync was performed in this pass.
