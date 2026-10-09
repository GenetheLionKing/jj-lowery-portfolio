import {
  analyticsAllowed,
  analyticsOrigin,
  gaMeasurementId,
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
      if (
        !/^G-[A-Z0-9]+$/.test(gaMeasurementId) ||
        !analyticsAllowed(runtime.production, runtime.hostname) ||
        !page ||
        !pageMatchesLocation(page, runtime.pathname())
      ) {
        runtime.disable(true);
        lastPath = null;
        previousLocation = "";
        return;
      }
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
