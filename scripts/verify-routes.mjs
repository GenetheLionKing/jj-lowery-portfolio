import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

// Tests the built server's real HTTP/HTML, without executing hydration scripts.
// Published articles vary by dataset; proposed repository articles are not imports.
const manifest = JSON.parse(
  await readFile(".next/prerender-manifest.json", "utf8"),
);
const articleRoutes = Object.keys(manifest.routes).filter((route) =>
  /^\/blog\/[^/]+\/?$/.test(route),
);
const socket = createServer();
await new Promise((resolve) => socket.listen(0, "127.0.0.1", resolve));
const port = socket.address().port;
await new Promise((resolve) => socket.close(resolve));
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
server.stdout.on("data", (data) => {
  logs += data;
});
server.stderr.on("data", (data) => {
  logs += data;
});
const base = `http://127.0.0.1:${port}`;
const visibleHtml = (html) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
try {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + "/")).ok) break;
    } catch {}
    if (i === 79) throw Error("Built server did not become ready: " + logs);
    await delay(125);
  }
  for (const route of [
    "/blog/does-not-exist/",
    "/work/does-not-exist/",
    "/blog/drafts.secret/",
    "/work/versions.secret/",
    "/missing/",
  ]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetch(base + route, { method });
      assert.equal(response.status, 404, route + " " + method);
      if (method === "HEAD") continue;
      const html = visibleHtml(await response.text());
      assert.match(html, /<h1\b/, route);
      assert.match(html, /This path doesn’t lead to a page\./, route);
      assert.match(html, /<main\b/, route);
      assert.match(html, /href="\/portfolio\/"/, route);
      assert.match(
        html,
        /name="robots" content="noindex(?:, nofollow)?"/,
        route,
      );
    }
  }
  for (const route of [
    ...articleRoutes,
    "/work/vector-income-architecture/",
    "/work/vector-performance-investigation/",
    "/work/portfolio-design/",
    "/work/bgm-budget-pacing/",
    "/resume/",
  ]) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.match(visibleHtml(await response.text()), /<h1\b/, route);
  }
  for (const route of ["/about/", "/portfolio/", "/learn/", "/blog/"]) {
    const html = visibleHtml(await (await fetch(base + route)).text());
    assert.equal(
      (html.match(/href="\/blog\/"[^>]*>Blog<\/a>/g) ?? []).length,
      2,
      "Blog appears in header/footer: " + route,
    );
    assert.ok(
      !html.includes("Filter by topic") &&
        !html.includes("Filter by content type"),
      route,
    );
  }
  console.log(
    "Built HTTP routes: readable GET/HEAD 404s, draft-like URLs, canonical pages, shared Blog navigation and no public filters PASS",
  );
} finally {
  server.kill("SIGTERM");
  await new Promise((resolve) => server.once("exit", resolve));
}
