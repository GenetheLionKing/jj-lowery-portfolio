import { Html, Head, Main, NextScript } from "next/document";
import { themeInitScript } from "@/data/theme";
export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
