import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { ContactVerification } from "../components/contact-verification";

type Options = Parameters<NonNullable<Window["turnstile"]>["render"]>[1];
function installGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value });
  return () => {
    if (previous) Object.defineProperty(globalThis, name, previous);
    else Reflect.deleteProperty(globalThis, name);
  };
}

test("widget callbacks clear expired/failed tokens; retry and response remount obtain fresh verification and clean up", async () => {
  const options: Options[] = [];
  const removed: string[] = [];
  const restore = [
    installGlobal("IS_REACT_ACT_ENVIRONMENT", true),
    installGlobal("self", { setTimeout, clearTimeout }),
    installGlobal("window", { turnstile: {
      render: (_: unknown, value: Options) => { options.push(value); return String(options.length); },
      remove: (widget: string) => removed.push(widget),
    } }),
    installGlobal("document", { documentElement: { dataset: { theme: "dark" } } }),
  ];
  let renderer!: ReactTestRenderer;
  const view = (key: string) => createElement(ContactVerification, { key, siteKey: "mock-public-key" });
  const token = () => renderer.root.findByType("input").props.value;
  try {
    await act(async () => { renderer = create(view("first"), { createNodeMock: () => ({}) }); });
    assert.equal(options[0].action, "contact");
    assert.equal(options[0].appearance, "interaction-only");
    assert.equal(options[0]["response-field"], false);
    assert.equal(options[0].theme, "dark");
    await act(async () => { options[0].callback("first-token"); });
    assert.equal(token(), "first-token");
    await act(async () => { options[0]["expired-callback"](); });
    assert.equal(token(), "");
    await act(async () => { options[0].callback("refreshed-token"); options[0]["error-callback"](); });
    assert.equal(token(), "");
    assert.match(renderer.root.findByProps({ role: "status" }).children.join(""), /text stays here/);
    await act(async () => { renderer.root.findByType("button").props.onClick(); });
    assert.deepEqual(removed, ["1"]);
    assert.equal(options.length, 2);
    await act(async () => { options[0].callback("stale-token"); });
    assert.equal(token(), "", "Disposed widgets cannot restore stale tokens");
    await act(async () => { options[1].callback("second-token"); });
    assert.equal(token(), "second-token");
    await act(async () => { renderer.update(view("server-response")); });
    assert.equal(token(), "", "Every action response remounts verification, including mail failures");
    assert.deepEqual(removed, ["1", "2"]);
    await act(async () => { options[2].callback("third-token"); options[2]["timeout-callback"](); });
    assert.equal(token(), "");
    await act(async () => { options[2]["unsupported-callback"](); });
    assert.match(renderer.root.findByType("button").children.join(""), /Retry verification/);
  } finally {
    await act(async () => { renderer?.unmount(); });
    restore.reverse().forEach((fn) => fn());
  }
  assert.deepEqual(removed, ["1", "2", "3"]);
});

test("missing site key loads no script and exposes a readable contact fallback", async () => {
  const restore = [
    installGlobal("IS_REACT_ACT_ENVIRONMENT", true),
    installGlobal("self", { setTimeout, clearTimeout }),
    installGlobal("document", { createElement: () => assert.fail("must not load a script") }),
  ];
  let renderer!: ReactTestRenderer;
  try {
    await act(async () => { renderer = create(createElement(ContactVerification, { siteKey: "" })); });
    assert.equal(renderer.root.findByType("input").props.value, "");
    assert.match(renderer.root.findByProps({ role: "status" }).children.join(""), /social link above/);
    assert.match(renderer.root.findByType("noscript").findByType("p").children.join(""), /JavaScript/);
  } finally {
    await act(async () => { renderer?.unmount(); });
    restore.reverse().forEach((fn) => fn());
  }
});

test("a failed script can be loaded again without reloading the form", async () => {
  const scripts: { onload?: () => void; onerror?: () => void; remove: () => void; src?: string }[] = [];
  const browser: { turnstile?: Window["turnstile"] } = {};
  let scriptRemovals = 0;
  let options!: Options;
  const restore = [
    installGlobal("IS_REACT_ACT_ENVIRONMENT", true),
    installGlobal("self", { setTimeout, clearTimeout }),
    installGlobal("window", browser),
    installGlobal("document", {
      documentElement: { dataset: {} },
      createElement: () => ({ remove: () => { scriptRemovals++; } }),
      head: { appendChild: (script: typeof scripts[number]) => scripts.push(script) },
    }),
  ];
  let renderer!: ReactTestRenderer;
  try {
    await act(async () => { renderer = create(createElement(ContactVerification, { siteKey: "mock-key" }), { createNodeMock: () => ({}) }); });
    assert.match(scripts[0].src!, /^https:\/\/challenges\.cloudflare\.com\//);
    await act(async () => { scripts[0].onerror?.(); });
    assert.equal(scriptRemovals, 1);
    await act(async () => { renderer.root.findByType("button").props.onClick(); });
    assert.equal(scripts.length, 2);
    browser.turnstile = { render: (_, value) => { options = value; return "retry"; }, remove: () => {} };
    await act(async () => { scripts[1].onload?.(); });
    await act(async () => { options.callback("recovered-token"); });
    assert.equal(renderer.root.findByType("input").props.value, "recovered-token");
  } finally {
    await act(async () => { renderer?.unmount(); });
    restore.reverse().forEach((fn) => fn());
  }
});
