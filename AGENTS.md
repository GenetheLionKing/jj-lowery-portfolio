# Portfolio working instructions

Use these instructions from any local or cloud checkout. Preserve existing project documentation and the user's current authorized scope; dated verification reports describe past checkpoints.

## Before UI changes

Read [the Portfolio UI skill](.agents/skills/portfolio-ui-design/SKILL.md) and consult the relevant sections of its [Practical UI reference](.agents/skills/portfolio-ui-design/references/practical-ui.md) before changing layout, styling, navigation, cards, articles, forms or Studio UI. Briefly identify the user task and the existing pattern to retain. This guidance supports JJ's approved direction; it does not authorize a redesign or CMS publication.

Preserve the simple editorial presentation, shared cards, centered article structure, rich-text Post editor, independent placement checkboxes and existing URLs. Retain JJ's identity, owner-approved portrait and factual qualifications, including conceptual work, AI assistance and helper-only measurements. Use the existing Next/React/TypeScript stack, plain CSS, system fonts and responsive assets; keep public reading available without JavaScript and Studio isolated from public pages.

## Verification and handback

For UI changes, inspect the rendered result at 320, 390, 768 and 1440 CSS pixels. Capture and actually review desktop and mobile screenshots of affected pages and themes; fix visible hierarchy, wrapping, crop and overflow defects before handback. Exercise affected controls and keyboard focus. Check contrast, reduced motion, 200% zoom, no-JavaScript reading and résumé print behavior where the change affects them. Report the routes, widths, screenshot paths and verification limits. Screenshots alone do not prove functional or accessibility correctness.

Run `pnpm check` and `git diff --check` before a PR handback; use the repository's Node/pnpm versions. Documentation-only changes need scope, skill-format and relative-link checks rather than fresh UI screenshots. Keep purchased source material, extracted pages and OCR outside commits.

Preserve dirty files and use an isolated branch/worktree when needed. Honor the existing [cloud-to-Mac synchronization requirement](docs/cloud-handoff.md#mandatory-cloud-to-mac-synchronization): verify local readiness and preserve local changes; never reset or merge an unapproved PR to complete sync. Follow the current task's authorization for pushes, CMS actions and releases.
