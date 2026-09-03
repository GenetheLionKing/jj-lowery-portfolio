import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Local-only inspection of the production export; this is not a deployment server.
const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

if (!existsSync(path.join(root, "index.html"))) {
  console.error("No static export found. Run pnpm build before pnpm preview.");
  process.exit(1);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400).end("Invalid request");
    return;
  }
  let file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  let status = 200;
  try {
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith("/")) {
        response
          .writeHead(308, {
            Location: `${pathname}/${new URL(request.url, "http://localhost").search}`,
          })
          .end();
        return;
      }
      file = path.join(file, "index.html");
    }
    const content = await readFile(file);
    response.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    status = 404;
    response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    response.end(
      request.method === "HEAD"
        ? undefined
        : await readFile(path.join(root, "404.html")),
    );
  }
});

server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Local production preview: http://127.0.0.1:${port}`),
);
