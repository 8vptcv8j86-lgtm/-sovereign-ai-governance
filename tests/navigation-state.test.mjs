import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("menu navigation preserves section state and supports browser back", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /window\.history\.pushState/);
  assert.match(page, /addEventListener\("popstate",\s*syncFromHistory\)/);
  assert.match(page, /searchParams\.set\("section",\s*section\)/);
  assert.match(page, /<OperationalWorkspace key=\{active\}/);
  assert.doesNotMatch(page, /onClick=\{\(\)=>setActive\(/);

  const workspace = await readFile(new URL("../app/operational-workspace.tsx", import.meta.url), "utf8");
  assert.match(workspace, /useEffect\(\(\)\s*=>\s*\{\s*void load\(\);?\s*\},\s*\[section\]\)/);
  assert.doesNotMatch(workspace, /useEffect\(load,/);
});

test("documents are never cached across hashed asset deployments", async () => {
  const worker = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");

  assert.match(worker, /Cache-Control", "no-store, max-age=0/);
  assert.match(worker, /CDN-Cache-Control", "no-store/);
});
