# Emerald accent release review

Apply the owner-selected Emerald palette throughout the shared site accents: light `#087F5B`, dark/header `#64DAB1`, selection `#D8F3E8`. Existing links, social icons, hover and focus inherit the semantic tokens; the brand period and favicon use the matching highlight.

`pnpm check` passed with zero lint warnings, TypeScript, all 39 tests, production build and real built HTTP regressions. Mail environment variables were blank during verification, and no live email test was repeated.

- [Verification and exact review limits](verification.json)
- [Rendered browser measurements](browser-results.json)
- [Contrast measurements](contrast.json)
- [Button hover measurements](interactions.json)
- [Light desktop](screenshots/contact-light-1440.jpg)
- [Dark desktop](screenshots/contact-dark-1440.jpg)
- [Light mobile form focus](screenshots/form-focus-light-390.jpg)
- [Dark mobile form focus](screenshots/form-focus-dark-390.jpg)

Nine routes captured in both themes at desktop, plus mobile Home/Contact/Résumé and form focus at 320/390/768/1440. The verification file lists the screenshots actually reviewed. Layout, public content, project imagery, article neutrals, contact delivery, CMS and deployment configuration were preserved. Local review used the user’s Codex In-app Browser on the same Mac executor.
