import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";
import { themeInitScript } from "@/data/theme";
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
    title: "JJ Lowery — Systems analysis & software development",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111315",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
