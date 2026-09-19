import { eq } from "drizzle-orm";
import { getDb } from "../db";
import * as s from "../db/schema";
import { assertKnownRole } from "./api/governance/access";

export type Actor = {
  userId: number;
  email: string;
  displayName: string;
  role: string;
  organizationId: string;
  organizationName: string;
};

type Identity = {
  authUserId: string | null;
  email: string;
  displayName: string;
};

function safeDecode(value: string | null, encoding: string | null) {
  if (!value || encoding !== "percent-encoded-utf-8") return null;
  try { return decodeURIComponent(value); } catch { return null; }
}

async function identityFor(request: Request): Promise<Identity> {
  let authUserId = request.headers.get("oai-authenticated-user-id")?.trim() || null;
  let email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  const fullName = safeDecode(
    request.headers.get("oai-authenticated-user-full-name"),
    request.headers.get("oai-authenticated-user-full-name-encoding"),
  );
  if (process.env.NODE_ENV !== "production") {
    authUserId ??= "sentinel-local-demo";
    email ||= "demo@sentinel.local";
  }
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("AUTH_REQUIRED");
  }
  if (authUserId && authUserId.length > 500) throw new Error("AUTH_REQUIRED");
  return { authUserId, email, displayName: (fullName || email).slice(0, 200) };
}

async function organizationKey(membershipKey: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(membershipKey));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export async function actorFor(request: Request): Promise<{ db: Awaited<ReturnType<typeof getDb>>; actor: Actor }> {
  const identity = await identityFor(request);
  const db = await getDb();
  let user = identity.authUserId
    ? await db.select().from(s.users).where(eq(s.users.authUserId, identity.authUserId)).get()
    : undefined;

  if (!user) {
    const invited = await db.select().from(s.users).where(eq(s.users.email, identity.email)).get();
    if (identity.authUserId && invited?.authUserId && invited.authUserId !== identity.authUserId) {
      throw new Error("ACCESS_DENIED");
    }
    if (invited) {
      if (identity.authUserId && !invited.authUserId) {
        await db.update(s.users).set({ authUserId: identity.authUserId }).where(eq(s.users.id, invited.id));
      }
      user = { ...invited, authUserId: identity.authUserId ?? invited.authUserId };
    } else {
      const membershipKey = identity.authUserId ?? `email:${identity.email}`;
      const key = await organizationKey(membershipKey);
      const organizationId = `org-${key}`;
      await db.batch([
        db.insert(s.organizations).values({
          id: organizationId,
          name: `${identity.displayName}'s Institution`,
          slug: `institution-${key}`,
        }).onConflictDoNothing(),
        db.insert(s.users).values({
          authUserId: identity.authUserId,
          email: identity.email,
          displayName: identity.displayName,
          role: "admin",
          organizationId,
        }).onConflictDoNothing(),
      ]);
      user = identity.authUserId
        ? await db.select().from(s.users).where(eq(s.users.authUserId, identity.authUserId)).get()
        : await db.select().from(s.users).where(eq(s.users.email, identity.email)).get();
    }
  }

  if (!user || user.status !== "active") throw new Error("ACCESS_DENIED");
  assertKnownRole(user.role);
  const organization = await db.select({ name: s.organizations.name }).from(s.organizations).where(eq(s.organizations.id, user.organizationId)).get();
  if (!organization) throw new Error("ACCESS_DENIED");
  return {
    db,
    actor: {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: organization.name,
    },
  };
}
