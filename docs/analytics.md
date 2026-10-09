# Portfolio Analytics

Public production pages collect GA4 page views automatically, without an opt-in prompt or recorded visitor consent. The owner-approved destination is **G-YRGF46MB1T**, in the JJ Lowery account (411410489), web stream 16081799346, for `https://www.jjlowery.com`. No API key, Measurement Protocol secret, service account or CMS setting is involved.

## Collection scope

The shared tracker loads Google's asynchronous tag only when both the build target is Vercel Production and the current hostname is exactly `jjlowery.com` or `www.jjlowery.com`. App Router pages and Pages Router articles use thin adapters to the same browser-scoped instance. Successful App pages render a tracking marker after their server checks; the root guard and not-found components only pause collection. A known URL that returns a 404 cannot initialize the tag, and a stale page marker cannot count a different current path. StrictMode/repeated effects and query/hash-only changes do not create duplicate views. A new document counts its initial view; navigation to another public path counts a new view. Later config commands use `update: true` to update safe parameters without reinitializing the tag.

Known public pages and published Post props supply canonical paths. Fixed general labels replace document/CMS titles in Analytics. Every config/view overrides `page_location`, `page_title` and `page_referrer`. Query strings and fragments are excluded, external referrers are blank, and subsequent internal referrers contain only a previously tracked canonical URL. This deliberately limits campaign and external referral attribution. No form fields, names, email addresses, search text, user IDs or custom user properties are supplied to Analytics.

Studio, design review, unknown/404 paths, local development and Vercel previews cannot initialize the tag. An in-app transition to an excluded path sets Google's `ga-disable-…` flag; returning to a valid public path resumes collection. Script loading failures disable further commands without interrupting the site.

The only application-generated event is `page_view`. Google's tag may also generate its standard session/engagement events and use first-party cookies. Google Signals and advertising personalization are disabled in the global and destination config. A `strict-origin` HTTP referrer policy and a `no-referrer` tag script policy prevent full URLs from leaking through the corresponding HTTP referrer headers.

The [public privacy page](<../app/(site)/privacy/page.tsx>) describes this automatic behavior and is linked from the shared footer. This implementation is not a legal-compliance certification or a claim that a portfolio is exempt from privacy/consent requirements.

## Destination setting prerequisite

The owner confirmed **Enhanced measurement is OFF** for the new web stream. Keep it off. Every config sets `send_page_view: false`, and the router adapters explicitly issue views automatically. Google's independent enhanced-history measurement can still produce duplicate/unredacted views if enabled; `send_page_view: false` alone does not disable it. See [Google's pageview guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).

The owner should also verify that the Google tag's destination list contains only the intended portfolio GA4 destination, that Google Signals/advertising integrations are not enabled in the property, and that the stream's email redaction is enabled as defense in depth. These are account settings; this change does not inspect or modify them. See [GA4 configuration](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) and [data redaction](https://support.google.com/analytics/answer/13544947).

## Verification and owner handoff

Run `pnpm check` and `git diff --check`. The Analytics tests use actual Next router contexts with plain in-memory React and a mocked document/tag queue. They issue no Google requests and fabricate no traffic or consent. Tests cover automatic initial/navigation views, both routers, duplicate effects, initial and subsequent known-URL 404s, stale page markers, private transitions, hostname/build guards, title/path sanitization, referrer omission, script failures and server-rendered privacy copy.

Browser use is prohibited for this task. Non-browser verification can confirm deployed commit/build state, public HTTP source, compiled destination/production guard and privacy-route readability. It cannot confirm Google's ingestion, actual client navigation, cookie behavior or screen-reader/visual interaction in a real visitor session.

After deployment, the owner can validate real traffic:

1. Select the **JJ Lowery** account and the portfolio property with web stream **16081799346 / G-YRGF46MB1T**.
2. Open the public production site yourself with JavaScript enabled, visit the homepage, then About, then a Blog article. No consent click is needed. A blocker or privacy extension can prevent collection.
3. Check the property's **Reports → Realtime** for that visit and `page_view` activity. Check page locations are canonical URLs without query strings or fragments. A query/hash-only change should not add a view; Studio and preview visits should not appear.
4. If nothing arrives, confirm the selected destination and Enhanced measurement state first, then check whether your browser blocked the Google tag. Source/build checks alone do not prove a received event.

This procedure uses the owner's real visit. Do not send artificial Measurement Protocol events to create a false verification result.
