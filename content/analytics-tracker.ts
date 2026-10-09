import {
  analyticsAllowed,
  analyticsOrigin,
  gaMeasurementId,
  isPublicAnalyticsPath,
  pageMatchesLocation,
  safeAnalyticsPage,
  type AnalyticsPage,
} from "./analytics";
import {
  analyticsAcquisition,
  type AnalyticsAcquisitionInput,
} from "./analytics-acquisition";

export type AnalyticsRuntime = {
  production: boolean;
  hostname: string;
  pathname: () => string;
  acquisition?: () => AnalyticsAcquisitionInput;
  command: (...args: unknown[]) => void;
  disable: (disabled: boolean) => void;
  load: (failed: () => void) => void;
};

/** A browser-scoped instance is shared by both routers; no SSR request state. */
export function createAnalyticsTracker(runtime: AnalyticsRuntime) {
  let initialized = false;
  let failed = false;
  let lastPath: string | null = null;
  let previousLocation = "";
  let acquisition: ReturnType<typeof analyticsAcquisition> | undefined;
  return {
    page(input: AnalyticsPage | null) {
      const page = safeAnalyticsPage(input);
      const pathname = runtime.pathname();
      if (
        !/^G-[A-Z0-9]+$/.test(gaMeasurementId) ||
        !analyticsAllowed(runtime.production, runtime.hostname) ||
        !page ||
        !isPublicAnalyticsPath(pathname)
      ) {
        runtime.disable(true);
        lastPath = null;
        previousLocation = "";
        return;
      }
      // An old route marker is not an exclusion signal for the current page.
      // Preserve both dedupe and an explicit 404/private pause until a matching
      // successful marker arrives; never emit from the URL shape alone.
      if (!pageMatchesLocation(page, pathname)) return;
      if (failed) return;
      runtime.disable(false);
      if (page.path === lastPath) return;
      acquisition ??= analyticsAcquisition(runtime.acquisition?.());
      const { referrer, ...campaign } = acquisition;
      const parameters = {
        ...campaign,
        page_location: `${analyticsOrigin}${page.path}`,
        page_title: page.title,
        // Only the initial eligible view uses the sanitized document referrer.
        page_referrer: previousLocation || (!initialized ? referrer : ""),
      };
      runtime.command("set", parameters);
      if (!initialized) {
        runtime.command("set", "allow_google_signals", false);
        runtime.command("set", "allow_ad_personalization_signals", false);
        runtime.command("js", new Date());
      }
      runtime.command("config", gaMeasurementId, {
        ...parameters,
        ...(initialized ? { update: true } : {}),
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      runtime.command("event", "page_view", {
        ...parameters,
        send_to: gaMeasurementId,
      });
      lastPath = page.path;
      previousLocation = parameters.page_location;
      if (!initialized) {
        initialized = true;
        const stop = () => {
          failed = true;
          runtime.disable(true);
        };
        try {
          runtime.load(stop);
        } catch {
          stop();
        }
      }
    },
  };
}
