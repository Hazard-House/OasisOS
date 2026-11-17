import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist/web",
);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

export function resolveWebPath(urlPath, webRoot = root) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  } catch {
    return null;
  }
  const relative = pathname.replace(/^\/+/, "");
  const candidate = path.resolve(webRoot, relative);
  if (candidate !== webRoot && !candidate.startsWith(webRoot + path.sep)) {
    return null;
  }
  return candidate;
}

export function contentTypeFor(filePath) {
  return (
    types[path.extname(filePath).toLowerCase()] ?? "application/octet-stream"
  );
}

export function createWebServer(webRoot = root) {
  return http.createServer((request, response) => {
    const candidate = resolveWebPath(request.url ?? "/", webRoot);
    if (!candidate) {
      response.writeHead(400);
      response.end("Bad path");
      return;
    }
    const file =
      fs.existsSync(candidate) && fs.statSync(candidate).isFile()
        ? candidate
        : path.join(webRoot, "index.html");
    if (!fs.existsSync(file)) {
      response.writeHead(404);
      response.end("OasisOS web build is missing. Run npm run build:web.");
      return;
    }
    response.writeHead(200, { "Content-Type": contentTypeFor(file) });
    fs.createReadStream(file).pipe(response);
  });
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const port = Number(process.env.PORT) || 3000;
  const server = createWebServer();
  server.listen(port, "0.0.0.0", () => {
    console.log(`OasisOS web demo listening on ${port}`);
  });
}
