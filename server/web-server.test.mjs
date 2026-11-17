import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createWebServer, resolveWebPath } from "./web-server.mjs";

test("rejects paths that leave the web root", () => {
  const root = path.join(os.tmpdir(), "oasis-web-root");
  assert.equal(resolveWebPath("/../secret", root), null);
});

test("serves a file and falls back to index.html", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "oasis-web-"));
  fs.writeFileSync(path.join(root, "index.html"), "<title>OasisOS</title>");
  fs.writeFileSync(path.join(root, "app.js"), "console.log(1)");
  const server = createWebServer(root);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const script = await fetch(`http://127.0.0.1:${port}/app.js`);
    assert.equal(script.status, 200);
    assert.match(script.headers.get("content-type") ?? "", /javascript/);
    assert.equal(await script.text(), "console.log(1)");
    const route = await fetch(`http://127.0.0.1:${port}/settings`);
    assert.equal(route.status, 200);
    assert.match(await route.text(), /OasisOS/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
