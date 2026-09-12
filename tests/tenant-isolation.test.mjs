import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("organization scope is derived from authenticated membership", async () => {
  const [schema, auth, systems, governance] = await Promise.all([
    readFile("db/schema.ts", "utf8"),
    readFile("app/org-auth.ts", "utf8"),
    readFile("app/api/systems/route.ts", "utf8"),
    readFile("app/api/governance/route.ts", "utf8"),
  ]);

  assert.doesNotMatch(schema, /default\("org-sovereign"\)/);
  assert.doesNotMatch(auth, /org-sovereign/);
  assert.match(auth, /oai-authenticated-user-id/);
  assert.match(auth, /authUserId \|\|= `email:\$\{email\}`/);
  assert.match(systems, /eq\(aiSystems\.organizationId,actor\.organizationId\)/);
  assert.match(systems, /organizationId:actor\.organizationId/);
  assert.match(systems, /AUTH_REQUIRED"\?401/);
  assert.match(governance, /actorFor, type Actor/);
});
