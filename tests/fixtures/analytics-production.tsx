// Run only in a separate Node process: the real client tracker is per document.
// Plain in-memory React and object mocks; no browser, DOM, SDK or network.
import assert from "node:assert/strict";
import { createElement, Fragment, useEffect } from "react";
import { create, type ReactTestRenderer } from "react-test-renderer";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import {
  AnalyticsExcluded,
  AppAnalytics,
  AppPageAnalytics,
} from "../../components/app-analytics";
import { analyticsOrigin, gaMeasurementId } from "../../content/analytics";

assert.equal(process.env.NODE_ENV, "production");
process.env.NEXT_PUBLIC_ANALYTICS_PRODUCTION = "true";
const commands: unknown[] = [];
const scripts: Record<string, unknown>[] = [];
const location = { hostname: "www.jjlowery.com", pathname: "/", search: "" };
const fakeWindow = { location, dataLayer: commands };
globalThis.window = fakeWindow as unknown as Window & typeof globalThis;
globalThis.document = {
  referrer: "",
  createElement: () => ({}),
  head: {
    appendChild: (script: Record<string, unknown>) => scripts.push(script),
  },
} as unknown as Document;
const views = () =>
  commands
    .map((item) => Array.from(item as ArrayLike<unknown>))
    .filter((args) => args[0] === "event");
const disabled = () =>
  (fakeWindow as unknown as Record<string, unknown>)[
    `ga-disable-${gaMeasurementId}`
  ];

function EffectsCommitted({ done }: { done: () => void }) {
  useEffect(done, [done]);
  return null;
}

type Marker = { key: string; path: string };
let renderer: ReactTestRenderer | undefined;
async function commit(pathname: string, markers: Marker[], excluded = false) {
  // Resolve after the actual adapter effects in this commit. Production React
  // does not implement act; this fence avoids assumptions about timer delays.
  await new Promise<void>((done) => {
    const tree = createElement(
      AppRouterContext.Provider,
      { value: null },
      createElement(
        PathnameContext.Provider,
        { value: pathname },
        createElement(
          Fragment,
          null,
          createElement(AppAnalytics),
          ...markers.map((marker) => createElement(AppPageAnalytics, marker)),
          excluded ? createElement(AnalyticsExcluded) : null,
          createElement(EffectsCommitted, { done }),
        ),
      ),
    );
    if (renderer) renderer.update(tree);
    else renderer = create(tree);
  });
}

async function main() {
  location.pathname = "/about/story/";
  await commit("/about/story/", [], true);
  await commit("/about/story/", [{ key: "stale-home", path: "/" }]);
  assert.equal(views().length, 0);
  assert.equal(scripts.length, 0);
  assert.equal(disabled(), true);

  location.pathname = "/";
  await commit("/", [{ key: "home", path: "/" }]);
  assert.equal(views().length, 1);
  location.pathname = "/about/";
  for (const staleFirst of [false, true]) {
    // Fresh keys ensure both effects run for each ordering, even at the same URL.
    const current = { key: `about-${staleFirst}`, path: "/about/" };
    const stale = { key: `home-${staleFirst}`, path: "/" };
    await commit("/about/", staleFirst ? [stale, current] : [current, stale]);
    assert.equal(views().length, 2);
    assert.equal(disabled(), false);
    await commit("/about/", [current]);
    await commit("/about/", []);
    await commit("/about/", [current]);
    assert.equal(views().length, 2);
    assert.equal(disabled(), false);
  }

  // Actual back/forward path changes still count, with canonical prior referrers.
  location.pathname = "/";
  await commit("/", [{ key: "home", path: "/" }]);
  assert.equal(views().length, 3);
  assert.equal(
    (views()[2][2] as Record<string, unknown>).page_referrer,
    `${analyticsOrigin}/about/`,
  );
  location.pathname = "/about/";
  await commit("/about/", [{ key: "about", path: "/about/" }]);
  assert.equal(views().length, 4);

  await commit("/about/", [], true);
  await commit("/about/", [{ key: "stale-home", path: "/" }]);
  assert.equal(disabled(), true);
  assert.equal(views().length, 4);
  await commit("/about/", [{ key: "about", path: "/about/" }]);
  assert.equal(disabled(), false);
  assert.equal(views().length, 5);
  assert.equal((views()[4][2] as Record<string, unknown>).page_referrer, "");

  // A URL shape alone is not proof that a dynamic post was published/successful.
  location.pathname = "/blog/unpublished-story/";
  await commit("/blog/unpublished-story/", [], true);
  await commit("/blog/unpublished-story/", [{ key: "stale", path: "/about/" }]);
  assert.equal(disabled(), true);
  assert.equal(views().length, 5);

  // The real URL wins even when React's router context still looks public.
  location.pathname = "/studio/";
  await commit("/about/", [{ key: "lagging-about", path: "/about/" }]);
  assert.equal(disabled(), true);
  assert.equal(views().length, 5);
  location.pathname = "/about/";
  await commit("/about/", [{ key: "returned-about", path: "/about/" }]);
  assert.equal(disabled(), false);
  assert.equal(views().length, 6);
  assert.equal(scripts.length, 1);
  console.log(
    JSON.stringify({
      environment: process.env.NODE_ENV,
      views: views().length,
      scripts: scripts.length,
      markerOrders: 2,
    }),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => renderer?.unmount());
