import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { migrationDocuments } from "../content/migration";
import { seedArticles } from "../content/seed";

// Local mock transport only: no Sanity project, account, tokens or writes.
// This uses the real built Next cache/pages with a controlled published
// response, including newly published URLs absent from generateStaticParams.
async function main() {
  const root = process.cwd();
  await mkdir(path.join(root, "review"), { recursive: true });
  const fixture = await mkdtemp(path.join(root, "review", "cache-fixture-"));
  const statePath = path.join(fixture, "mock-content.json");
  const mockPath = path.join(fixture, "mock-fetch.mjs");
  const baseline = migrationDocuments().filter(
    (doc) => !String(doc._id).startsWith("drafts."),
  );
  const post = {
    ...seedArticles[0],
    _id: "local-mock-post",
    _type: "post",
    kind: "article",
    slug: "local-placement-proof",
    title: "LOCAL MOCK PLACEMENT PROOF",
    tags: ["learn", "portfolio", "about-gallery"],
    mainImage: {
      src: "/images/profile-320.webp",
      alt: "JJ Lowery — local gallery fixture",
      width: 320,
      height: 320,
    },
  };
  const evidence: object[] = [];
  let server: ReturnType<typeof spawn> | undefined;
  const plain = (html: string) =>
    html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  try {
    for (const directory of [
      "app",
      "components",
      "content",
      "data",
      "styles",
      "studio",
      "pages",
    ])
      await cp(path.join(root, directory), path.join(fixture, directory), {
        recursive: true,
      });
    for (const filename of [
      "package.json",
      "pnpm-lock.yaml",
      "tsconfig.json",
      "next-env.d.ts",
    ])
      await cp(path.join(root, filename), path.join(fixture, filename));
    await writeFile(
      path.join(fixture, "next.config.ts"),
      `export default {trailingSlash:true,poweredByHeader:false,turbopack:{root:${JSON.stringify(root)}}};\n`,
    );
    await symlink(
      path.join(root, "node_modules"),
      path.join(fixture, "node_modules"),
    );
    await symlink(path.join(root, "public"), path.join(fixture, "public"));
    await writeFile(statePath, JSON.stringify(baseline));
    await writeFile(
      mockPath,
      `import {readFile} from 'node:fs/promises';
const original=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
 if(url.origin==='https://cachefixture.api.sanity.io'){
  if(url.searchParams.get('perspective')!=='published'||init?.headers)throw Error('Unsafe local test transport');
  return Response.json({result:JSON.parse(await readFile(process.env.PUBLISHING_TEST_CONTENT,'utf8')).map(doc=>({...doc,mainImage:doc.mainImage??null}))});
 }
 return original(input,init);
};\n`,
    );
    const env = {
      ...process.env,
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "cachefixture",
      NEXT_PUBLIC_SANITY_DATASET: "portfolio",
      NEXT_TELEMETRY_DISABLED: "1",
      PUBLISHING_TEST_CONTENT: statePath,
      NODE_OPTIONS: `--import=${mockPath}`,
    };
    const run = (args: string[]) =>
      spawn(
        process.execPath,
        [path.join(root, "node_modules/next/dist/bin/next"), ...args],
        { cwd: fixture, env, stdio: ["ignore", "pipe", "pipe"] },
      );
    const build = run(["build"]);
    let logs = "";
    build.stdout.on("data", (data) => {
      logs += data;
    });
    build.stderr.on("data", (data) => {
      logs += data;
    });
    const buildCode = await new Promise((resolve) =>
      build.once("exit", resolve),
    );
    assert.equal(buildCode, 0, logs);
    const socket = createServer();
    await new Promise<void>((resolve) =>
      socket.listen(0, "127.0.0.1", resolve),
    );
    const port = (socket.address() as { port: number }).port;
    await new Promise<void>((resolve) => socket.close(() => resolve()));
    server = run(["start", "--hostname", "127.0.0.1", "--port", String(port)]);
    server.stdout?.on("data", (data) => {
      logs += data;
    });
    server.stderr?.on("data", (data) => {
      logs += data;
    });
    const base = `http://127.0.0.1:${port}`;
    const get = async (route: string) => {
      const response = await fetch(base + route);
      const html = plain(await response.text());
      if (response.status === 404)
        assert.match(
          html,
          /<h1[^>]*>This path doesn’t lead to a page\./,
          route,
        );
      assert.ok(
        response.status === 200 || response.status === 404,
        route + ": " + response.status + "\n" + logs,
      );
      return { status: response.status, html };
    };
    for (let i = 0; i < 80; i++) {
      try {
        await get("/");
        break;
      } catch {
        await delay(125);
        if (i === 79) throw Error(logs);
      }
    }
    assert.equal((await get("/blog/local-placement-proof/")).status, 404);
    assert.equal((await get("/work/vector-income-architecture/")).status, 200);
    evidence.push({ phase: "initial", missingPost: 404, existingCase: 200 });
    await writeFile(
      statePath,
      JSON.stringify([
        ...baseline,
        post,
        { ...post, _id: "drafts.private-proof", slug: "private-proof" },
      ]),
    );
    const waitFor = async (
      route: string,
      expected: number,
      marker?: string,
    ) => {
      const start = Date.now();
      let requests = 0;
      while (Date.now() - start < 95000) {
        const value = await get(route);
        requests++;
        if (
          value.status === expected &&
          (!marker || value.html.includes(marker))
        ) {
          evidence.push({
            route,
            expected,
            requests,
            elapsedMs: Date.now() - start,
          });
          return value;
        }
        await delay(2000);
      }
      throw Error("Local cache transition timed out: " + route);
    };
    await waitFor(
      "/blog/local-placement-proof/",
      200,
      "LOCAL MOCK PLACEMENT PROOF",
    );
    for (const route of ["/about/", "/learn/", "/portfolio/", "/blog/"])
      await waitFor(route, 200, "LOCAL MOCK PLACEMENT PROOF");
    assert.equal((await get("/blog/private-proof/")).status, 404);
    const gallery = (await get("/about/")).html;
    assert.match(gallery, /aria-label="LOCAL MOCK PLACEMENT PROOF"/);
    assert.match(gallery, /href="\/blog\/local-placement-proof\/"/);
    evidence.push({
      phase: "published",
      canonicalUrl: "/blog/local-placement-proof/",
      allFourSurfaces: true,
      draftIsolated: true,
    });
    await writeFile(
      statePath,
      JSON.stringify(
        baseline.filter((doc) => doc._id !== "case-vector-income-architecture"),
      ),
    );
    await waitFor("/blog/local-placement-proof/", 404);
    await waitFor("/work/vector-income-architecture/", 404);
    evidence.push({
      phase: "unpublished",
      article: 404,
      case: 404,
      readableHtml: true,
    });
    await writeFile(
      path.join(root, "review/publishing-cache-transitions.json"),
      JSON.stringify(evidence, null, 2) + "\n",
    );
    console.log(JSON.stringify(evidence, null, 2));
  } finally {
    if (server && !server.killed) {
      server.kill("SIGTERM");
      await new Promise((resolve) => server!.once("exit", resolve));
    }
    await rm(fixture, { recursive: true, force: true });
  }
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
