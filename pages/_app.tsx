import type { AppProps } from "next/app";
import Head from "next/head";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "@/app/globals.css";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#111315" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Component {...pageProps} />
      </main>
      <SiteFooter />
    </>
  );
}
