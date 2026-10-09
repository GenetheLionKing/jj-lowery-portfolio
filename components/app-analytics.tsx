"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { appAnalyticsPage, pageMatchesLocation } from "@/content/analytics";
import { trackPublicPage } from "./analytics-client";

/** Lives in the root to also pause a loaded tag on a transition into Studio. */
export function AppAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (!appAnalyticsPage(pathname)) trackPublicPage(null);
  }, [pathname]);
  return null;
}

/** Rendered only after the server page succeeds; a known-URL 404 cannot start GA. */
export function AppPageAnalytics({ path }: { path: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const page = appAnalyticsPage(path);
    trackPublicPage(
      page && pathname && pageMatchesLocation(page, pathname) ? page : null,
    );
  }, [path, pathname]);
  return null;
}

export function AnalyticsExcluded() {
  useEffect(() => {
    trackPublicPage(null);
  }, []);
  return null;
}
