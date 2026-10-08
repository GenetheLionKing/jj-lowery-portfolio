"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { pagesAnalyticsPage } from "@/content/analytics";
import { trackPublicPage } from "./analytics-client";

export function PagesAnalytics({
  pageProps,
}: {
  pageProps: Record<string, unknown>;
}) {
  const router = useRouter();
  const page = pagesAnalyticsPage(router.pathname, pageProps);
  const path = page?.path ?? null;
  const title = page?.title ?? "";
  useEffect(() => {
    if (router.isReady) trackPublicPage(path ? { path, title } : null);
  }, [router.isReady, path, title]);
  return null;
}
