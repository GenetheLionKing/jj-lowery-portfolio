import { AppPageAnalytics } from "@/components/app-analytics";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="reading-article">
      <AppPageAnalytics path="/privacy/" />
      <article>
        <header className="reading-heading">
          <h1>Privacy</h1>
          <p className="reading-subtitle">
            How this portfolio measures visits.
          </p>
        </header>
        <div className="reading-body">
          <h2>Google Analytics</h2>
          <p>
            Google Analytics loads automatically when you visit a public page on
            jjlowery.com. There is no opt-in prompt. It helps me understand
            which pages people visit and how they move through the site.
          </p>
          <p>
            Google receives page-visit events and technical information from
            your browser, including browser and device details. Analytics can
            use first-party cookies to distinguish visits and maintain sessions.
            Google may also generate its standard session and engagement events.
            This is not anonymous browsing.
          </p>
          <p>
            The site sends known public page paths and general page labels. It
            removes URL query strings and fragments from page URLs. It keeps the
            available referring site’s origin, without its credentials, path or
            query, and validated public UTM source, medium and campaign labels.
            Contact-form contents and arbitrary URL parameters are not included
            in these Analytics events. Campaign links must use public labels,
            never personal information or secrets. Advertising features and
            Google Signals are disabled in the site’s tracking configuration.
          </p>
          <p>
            Studio, design previews and local development are excluded.
            Analytics does not load when JavaScript is disabled; browser privacy
            tools may also block it.
          </p>
          <p>
            Read{" "}
            <a href="https://policies.google.com/privacy">
              Google’s privacy policy
            </a>{" "}
            for information about how Google processes data. Google also
            provides an{" "}
            <a href="https://tools.google.com/dlpage/gaoptout">
              Analytics opt-out browser add-on
            </a>
            .
          </p>
          <h2>Messages</h2>
          <p>
            Information you enter in the contact form is handled separately to
            respond to your message. It is not sent to Google Analytics by this
            site. For questions about privacy,{" "}
            <Link href="/contact/">get in touch</Link>.
          </p>
        </div>
      </article>
    </div>
  );
}
