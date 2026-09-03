import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JJ Lowery — Systems Analyst & Business Systems Analyst",
    template: "%s | JJ Lowery",
  },
  description: profile.description,
  authors: [{ name: profile.name }],
  creator: profile.name,
  applicationName: "JJ Lowery Portfolio",
  openGraph: {
    title: "JJ Lowery — Clear thinking. Reliable systems.",
    description: profile.description,
    type: "website",
    locale: "en_US",
    siteName: "JJ Lowery",
  },
  twitter: {
    card: "summary",
    title: "JJ Lowery — Systems Analyst",
    description: profile.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
