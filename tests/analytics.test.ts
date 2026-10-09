import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement, Fragment, StrictMode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, create } from "react-test-renderer";
import type { ReactTestRenderer } from "react-test-renderer";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";
import {
  analyticsAllowed,
  appAnalyticsPage,
  pagesAnalyticsPage,
  safeAnalyticsPage,
  gaMeasurementId,
  analyticsOrigin,
} from "../content/analytics";
import { createAnalyticsTracker } from "../content/analytics-tracker";
import {
  AnalyticsExcluded,
  AppAnalytics,
  AppPageAnalytics,
} from "../components/app-analytics";
import { PagesAnalytics } from "../components/pages-analytics";
import PrivacyPage from "../app/(site)/privacy/page";
import { SiteFooter } from "../components/site-footer";

function fixture(production = true, hostname = "www.jjlowery.com") {
  let pathname = "/";
  let onError: (() => void) | undefined;
  const commands: unknown[][] = [];
  const disabled: boolean[] = [];
  let loads = 0;
  const tracker = createAnalyticsTracker({
    production,
    hostname,
    pathname: () => pathname,
    command: (...args) => commands.push(args),
    disable: (value) => disabled.push(value),
    load: (failed) => {
      loads++;
      onError = failed;
    },
  });
  return {
    tracker,
    commands,
    disabled,
    path: (path: string) => {
      pathname = path;
    },
    get loads() {
      return loads;
    },
    fail: () => onError?.(),
    views: () => commands.filter((args) => args[0] === "event"),
  };
}

test("only public production hostnames may load analytics; Studio, previews, local and unknown paths cannot queue events", () => {
  assert.equal(gaMeasurementId, "G-YRGF46MB1T");
  for (const hostname of ["www.jjlowery.com", "jjlowery.com"])
    assert.equal(analyticsAllowed(true, hostname), true);
  for (const hostname of [
    "localhost",
    "127.0.0.1",
    "jj-lowery-portfolio.vercel.app",
    "www.jjlowery.com.attacker.example",
    "preview.jjlowery.com",
    "",
  ]) {
    const f = fixture(true, hostname);
    f.tracker.page(appAnalyticsPage("/"));
    assert.equal(f.loads, 0);
    assert.deepEqual(f.commands, []);
  }
  const preview = fixture(false);
  preview.tracker.page(appAnalyticsPage("/"));
  assert.equal(preview.loads, 0);
  assert.deepEqual(preview.commands, []);
  for (const path of [
    "/studio/",
    "/studio/structure/",
    "/design-review/about/",
    "/api/contact/",
    "/404/",
    "/unknown/",
    "/blog/private-draft/",
    "/contact?email=person@example.com",
    "/about/#person@example.com",
  ]) {
    const f = fixture();
    f.path(path);
    f.tracker.page(appAnalyticsPage(path));
    assert.equal(f.loads, 0);
    assert.deepEqual(f.commands, []);
  }
});

test("automatic initial and routed page views use one tag, deduplicate repeated effects and ignore query/hash-only changes", () => {
  const f = fixture();
  f.tracker.page(appAnalyticsPage("/"));
  f.tracker.page(appAnalyticsPage("/"));
  assert.equal(f.loads, 1);
  assert.equal(f.views().length, 1);
  f.path("/about/");
  f.tracker.page(appAnalyticsPage("/about"));
  f.tracker.page(appAnalyticsPage("/about/"));
  assert.equal(f.loads, 1);
  assert.equal(f.views().length, 2);
  f.path("/privacy/");
  f.tracker.page(appAnalyticsPage("/privacy/"));
  f.path("/about/");
  f.tracker.page(appAnalyticsPage("/about/"));
  assert.equal(f.views().length, 4);
  const configurations = f.commands.filter((args) => args[0] === "config");
  assert.equal(
    configurations.filter(
      (args) => !(args[2] as Record<string, unknown>).update,
    ).length,
    1,
  );
  assert.ok(
    configurations
      .slice(1)
      .every((args) => (args[2] as Record<string, unknown>).update === true),
  );
  for (const [name, id, parameters] of f.commands.filter(
    (args) => args[0] === "config",
  )) {
    assert.equal(name, "config");
    assert.equal(id, gaMeasurementId);
    assert.equal((parameters as Record<string, unknown>).send_page_view, false);
    assert.equal(
      (parameters as Record<string, unknown>).allow_google_signals,
      false,
    );
    assert.equal(
      (parameters as Record<string, unknown>).allow_ad_personalization_signals,
      false,
    );
  }
  assert.equal(
    f.commands.some((args) => args[0] === "consent"),
    false,
    "No visitor consent is fabricated",
  );
});

test("payloads discard arbitrary titles/form contents and never queue URL query/hash or external referrer data", () => {
  const f = fixture();
  f.path("/contact/");
  f.tracker.page({
    path: "/contact/",
    title: "Visitor Name person@example.com secret-token",
  });
  const source = {
    article: {
      slug: "public-story",
      title: "Visitor Name",
      body: "person@example.com",
      form: { name: "Visitor Name" },
    },
  };
  const page = pagesAnalyticsPage("/blog/[slug]", source)!;
  f.path(page.path);
  f.tracker.page(page);
  const payload = JSON.stringify(f.commands);
  for (const value of [
    "person@example.com",
    "Visitor Name",
    "secret-token",
    "?",
    "#",
  ])
    assert.equal(payload.includes(value), false);
  assert.deepEqual(f.views()[0][2], {
    page_location: `${analyticsOrigin}/contact/`,
    page_title: "Contact",
    page_referrer: "",
    send_to: gaMeasurementId,
  });
  assert.deepEqual(f.views()[1][2], {
    page_location: `${analyticsOrigin}/blog/public-story/`,
    page_title: "Blog article",
    page_referrer: `${analyticsOrigin}/contact/`,
    send_to: gaMeasurementId,
  });
  for (const slug of [
    "person@example.com",
    "name?email=x",
    "x#secret",
    "../studio",
    "%70erson",
    "x".repeat(101),
    null,
    {},
  ]) {
    assert.equal(
      pagesAnalyticsPage("/blog/[slug]", { article: { slug } }),
      null,
    );
  }
  assert.equal(pagesAnalyticsPage("/404", source), null);
  assert.equal(pagesAnalyticsPage("/work/[slug]", source), null);
  assert.equal(
    safeAnalyticsPage({ path: "/about/?email=x", title: "unsafe" }),
    null,
  );
});

test("location mismatch and private transitions pause collection; return to a public page counts a new view", () => {
  const f = fixture();
  f.tracker.page(appAnalyticsPage("/"));
  f.path("/studio/");
  f.tracker.page(null);
  f.tracker.page(appAnalyticsPage("/about/"));
  assert.equal(f.disabled.at(-1), true);
  assert.equal(f.views().length, 1);
  f.path("/");
  f.tracker.page(appAnalyticsPage("/"));
  assert.equal(f.disabled.at(-1), false);
  assert.equal(f.views().length, 2);
  assert.equal(f.loads, 1);
  assert.equal((f.views()[1][2] as Record<string, unknown>).page_referrer, "");
});

test("failed script loading disables future commands and never interrupts reading", () => {
  const f = fixture();
  f.tracker.page(appAnalyticsPage("/"));
  f.fail();
  const count = f.commands.length;
  f.path("/about/");
  assert.doesNotThrow(() => f.tracker.page(appAnalyticsPage("/about/")));
  assert.equal(f.commands.length, count);
  assert.equal(f.disabled.at(-1), true);
  const throwing = createAnalyticsTracker({
    production: true,
    hostname: "jjlowery.com",
    pathname: () => "/",
    command: () => {},
    disable: () => {},
    load: () => {
      throw Error("blocked");
    },
  });
  assert.doesNotThrow(() => throwing.page(appAnalyticsPage("/")));
});

test("public privacy disclosure and footer link remain readable without JavaScript and contain no consent prompt", () => {
  const html = renderToStaticMarkup(createElement(PrivacyPage));
  assert.match(html, /loads automatically/);
  assert.match(html, /no opt-in prompt/);
  assert.match(html, /first-party cookies/);
  assert.match(html, /not anonymous browsing/);
  assert.doesNotMatch(html, /<button|accept analytics|decline analytics/i);
  assert.match(
    renderToStaticMarkup(createElement(SiteFooter)),
    /href="\/privacy\/?"/,
  );
});

test("actual App and Pages router adapters share one browser tag, survive StrictMode and reject private/404 transitions", async () => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const previousFlag = process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION;
  const reactGlobal = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousAct = reactGlobal.IS_REACT_ACT_ENVIRONMENT;
  const scripts: Record<string, unknown>[] = [];
  const location = {
    hostname: "www.jjlowery.com",
    pathname: "/about/story/",
    href: "https://www.jjlowery.com/?email=person@example.com#secret",
  };
  const fakeWindow = { location, dataLayer: [] as unknown[] };
  globalThis.window = fakeWindow as unknown as Window & typeof globalThis;
  globalThis.document = {
    createElement: () => ({}),
    head: {
      appendChild: (script: Record<string, unknown>) => scripts.push(script),
    },
    title: "Visitor Name",
    referrer: "https://external.example/?email=person@example.com",
  } as unknown as Document;
  process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION = "true";
  reactGlobal.IS_REACT_ACT_ENVIRONMENT = true;
  let renderer: ReactTestRenderer | undefined;
  const app = (
    pathname: string,
    mode: "page" | "not-found" | "guard" = "page",
    pagePath = pathname,
  ) =>
    createElement(
      StrictMode,
      null,
      createElement(
        AppRouterContext.Provider,
        { value: null },
        createElement(
          PathnameContext.Provider,
          { value: pathname },
          createElement(
            Fragment,
            null,
            createElement(AppAnalytics),
            mode === "not-found"
              ? createElement(AnalyticsExcluded)
              : mode === "page"
                ? createElement(AppPageAnalytics, { path: pagePath })
                : null,
          ),
        ),
      ),
    );
  const pages = (route: string, pageProps: Record<string, unknown>) =>
    createElement(
      StrictMode,
      null,
      createElement(
        RouterContext.Provider,
        { value: { pathname: route, isReady: true } as NextRouter },
        createElement(PagesAnalytics, { pageProps }),
      ),
    );
  const commands = () =>
    fakeWindow.dataLayer.map((item) => Array.from(item as ArrayLike<unknown>));
  const views = () => commands().filter((args) => args[0] === "event");
  try {
    await act(async () => {
      renderer = create(app("/about/story/", "not-found"));
    });
    assert.equal(scripts.length, 0);
    assert.equal(commands().length, 0);
    location.pathname = "/";
    await act(async () => renderer!.update(app("/")));
    assert.equal(scripts.length, 1);
    assert.equal(views().length, 1);
    assert.equal(
      scripts[0].src,
      `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
    );
    assert.equal(scripts[0].referrerPolicy, "no-referrer");
    location.pathname = "/about/";
    await act(async () => renderer!.update(app("/about/")));
    assert.equal(views().length, 2);
    // Query/hash-only changes do not alter canonical route props.
    location.href =
      "https://www.jjlowery.com/about/?name=Visitor#email=person@example.com";
    await act(async () => renderer!.update(app("/about/")));
    assert.equal(views().length, 2);
    location.pathname = "/about/story/";
    await act(async () => renderer!.update(app("/about/story/", "not-found")));
    assert.equal(views().length, 2);
    assert.equal(
      (fakeWindow as unknown as Record<string, unknown>)[
        `ga-disable-${gaMeasurementId}`
      ],
      true,
    );
    location.pathname = "/privacy/";
    await act(async () =>
      renderer!.update(app("/privacy/", "page", "/about/")),
    );
    assert.equal(views().length, 2);
    await act(async () => renderer!.update(app("/privacy/")));
    assert.equal(views().length, 3);
    location.pathname = "/studio/";
    await act(async () => renderer!.update(app("/studio/", "guard")));
    assert.equal(
      (fakeWindow as unknown as Record<string, unknown>)[
        `ga-disable-${gaMeasurementId}`
      ],
      true,
    );
    location.pathname = "/blog/public-story/";
    await act(async () =>
      renderer!.update(
        pages("/blog/[slug]", {
          article: { slug: "public-story", title: "Visitor Name" },
        }),
      ),
    );
    assert.equal(views().length, 4);
    location.pathname = "/work/public-project/";
    await act(async () =>
      renderer!.update(
        pages("/work/[slug]", { study: { slug: "public-project" } }),
      ),
    );
    assert.equal(views().length, 5);
    assert.equal(scripts.length, 1);
    location.pathname = "/unknown/";
    await act(async () => renderer!.update(pages("/404", {})));
    assert.equal(views().length, 5);
    const payload = JSON.stringify(commands());
    for (const value of [
      "person@example.com",
      "Visitor Name",
      "external.example",
      "?",
      "#",
    ])
      assert.equal(payload.includes(value), false);
    assert.equal(
      commands().some((args) => args[0] === "consent"),
      false,
    );
  } finally {
    await act(async () => renderer?.unmount());
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    if (previousFlag === undefined)
      delete process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION;
    else process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION = previousFlag;
    reactGlobal.IS_REACT_ACT_ENVIRONMENT = previousAct;
  }
});
