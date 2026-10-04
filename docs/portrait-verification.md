# Complete-shoulder portrait verification

2026-10-04. Branch `fix/portrait-shoulder`, based on published main `140f22f6557a0cbd5dcde2546eee4e4ee972fc72`. The owner approved the corrected version 2 portrait and publication. Scope: portrait source, responsive derivatives and necessary Home/About framing only. Typography, wording, masthead, navigation, selected work, résumé and application JavaScript are unchanged.

The composition remains the same centered portrait with flanking roles on desktop and paired centered headings/descriptions below on phones. The complete shoulder silhouette is the only visual change; existing interactions and reduced-motion behavior remain.

## Approved source

- Owner-approved portrait version **2**, canonical name `JJ-portrait-shoulder-review.png`, supplied through the project reference folder.
- SHA-256 `efece57a797797c1229d196e8eb651d2b3ffd4515e93f61d6882538484abb083` exactly matches the approved asset fingerprint supplied by the parent.
- Actual metadata: **1640×1294**, 8-bit sRGB RGBA. Alpha contains 1,195,900 fully transparent pixels, 17,884 partial pixels and 908,376 opaque pixels. Visible bounds x=118..1556, y=95..1293; left/right transparent margins **118/83px** preserve the pose.
- Independent local comparison: **542,700 head-area RGB pixels** in the original rectangle x=260,y=50,w=670,h=810 match exactly at the approved placement x=187,y=40. This comparison applies to the native source; the responsive derivatives are resized/compressed.
- The source and actual light/dark page captures were viewed. Both shoulder contours have transparent room at their outer edges. The source face was not regenerated or retouched by this implementation.

The approved PNG is preserved byte-for-byte in `assets/portrait-shoulder-approved.png`. `pnpm portrait:shoulder` verifies its hash/metadata before producing native-aspect-ratio 320/640/960/1280px WebP and lossless PNG derivatives. It never extracts/crops or squares the image. Prior originals and derivatives remain. Distinct asset names prevent old portrait URLs from hiding the replacement.

## Responsive framing and checks

The hero image is widened to retain its previous rendered height: roughly **609×480px** on desktop and **330×260px** on common phones. At 320px it uses a full **304px** canvas to fit both shoulders; the face is about 12% smaller than before at this narrow width, versus about 3% on common phones/desktop. No object-fit cover, CSS clipping, transform or hidden overflow crops it. The Home text columns and gaps remain unchanged.

About uses a wider image track and stacks below 750px so both shoulders fit without tablet overflow. Existing text styling and copy remain. Only Home and About use this shared portrait component.

- `pnpm check`: ESLint zero warnings, TypeScript and production static export pass. Prettier and `git diff --check` pass. React best-practices review: existing Server Components retained, no hooks/state/fetching or Client Component added, unchanged alt/loading priority and no extra runtime dependencies.
- **28/28** Home/About layout checks: light and dark at 320/390/650/768/900/1100/1440px. No overflow, broken images, framework overlays or browser page errors. Portrait geometry remains its native ratio and within the viewport; both mobile headings and descriptions remain centered with symmetric bounds.
- **Four Axe scans**, Home/About in light/dark at 390px: zero violations. Actual 320/390/768/1440 screenshots inspected, including dark edges and shoulder contours.
- Both pages pass keyboard skip/focus, 200% CSS zoom reflow and author-JavaScript-disabled reading with the new portrait. Native OS zoom remains a manual limit. No motion or print behavior was changed.

## Actual local captures

| Page  | Light mobile                                     | Light desktop                                      | Dark mobile                                     | Dark desktop                                      |
| ----- | ------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| Home  | [390px](portrait-review/home-light-mobile.webp)  | [1440px](portrait-review/home-light-desktop.webp)  | [390px](portrait-review/home-dark-mobile.webp)  | [1440px](portrait-review/home-dark-desktop.webp)  |
| About | [390px](portrait-review/about-light-mobile.webp) | [1440px](portrait-review/about-light-desktop.webp) | [390px](portrait-review/about-dark-mobile.webp) | [1440px](portrait-review/about-dark-desktop.webp) |

Before: [mobile](portrait-review/home-before-mobile.webp) / [desktop](portrait-review/home-before-desktop.webp). All images are actual browser captures. Raw PNG, geometry/Axe/performance JSON and local scripts are retained in ignored `review/` and the adjacent isolated `review-tools/`; no new application test dependency or Library output identity is claimed.

Local preview: `PORT=3120 pnpm preview`, then `http://127.0.0.1:3120/` and `/about/`.

## Consistent local performance comparison

Three alternating fresh-profile cold-cache mobile runs per version, identical local gzip level-6/no-store servers. Baseline is the previous production export; after is this full production export. Lighthouse 13.5.0 / Chrome 154, 412×823 CSS px, DPR 1.75, simulated mobile slow 4G (150ms RTT, 1638.4Kbps), CPU multiplier 4, storage reset enabled. Browser runs were sequential. These are local lab medians, not live field measurements or universal guarantees.

| Metric                      |   Before |    After |
| --------------------------- | -------: | -------: |
| Performance / accessibility | 98 / 100 | 98 / 100 |
| Median LCP                  |   2.481s |   2.332s |
| CLS, all runs               |        0 |        0 |
| Median TBT                  |   12.5ms |   11.5ms |
| Total compressed transfer   | 260,124B | 239,187B |
| Portrait transfer           |  57,904B |  36,868B |
| JavaScript transfer         | 144,656B | 144,656B |

The selected mobile image is the complete 640px WebP. All WebP derivatives are below 150KB, including 1280px. Lossless PNG fallbacks are larger; the table measures the modern WebP path. There is no added interaction JavaScript, tracking, font or dependency. No content was removed for measurement.
