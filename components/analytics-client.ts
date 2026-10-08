"use client";

import { createAnalyticsTracker } from "@/content/analytics-tracker";
import { gaMeasurementId, type AnalyticsPage } from "@/content/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let tracker: ReturnType<typeof createAnalyticsTracker> | undefined;

export function trackPublicPage(page: AnalyticsPage | null) {
  if (typeof window === "undefined" || !gaMeasurementId) return;
  tracker ??= createAnalyticsTracker({
    production: process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION === "true",
    hostname: window.location.hostname,
    pathname: () => window.location.pathname,
    disable: (disabled) => {
      window[`ga-disable-${gaMeasurementId}`] = disabled;
    },
    command: function (...args: unknown[]) {
      void args;
      window.dataLayer ??= [];
      // Google tag's native queued command shape; never expose form event data.
      // eslint-disable-next-line prefer-rest-params -- Google's documented tag queue uses Arguments objects.
      window.dataLayer.push(arguments);
    },
    load: (failed) => {
      const script = document.createElement("script");
      script.id = "jj-google-analytics";
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      script.onerror = failed;
      document.head.appendChild(script);
    },
  });
  tracker.page(page);
}
