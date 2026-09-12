# Spec: Multi-tenant organization isolation

## Objective

Allow one Sentinel deployment and database to serve multiple institutions without sharing records across them.

## Tech Stack

Next.js 16, TypeScript, Drizzle ORM, Cloudflare D1.

## Commands

- Build and test: `npm test`
- Generate migration: `npm run db:generate`
- Audit dependencies: `npm audit --omit=dev --audit-level=high`

## Project Structure

- `app/org-auth.ts`: authenticated identity, institution membership, and first-use tenant provisioning.
- `app/api/**`: organization-scoped API routes.
- `db/schema.ts`: tenant keys and identity binding.
- `drizzle/**`: forward-only database migrations.

## Code Style

```ts
db.select().from(table).where(eq(table.organizationId, actor.organizationId));
```

## Testing Strategy

Run the production build, rendered-page test, fresh-database migration check, and tenant-isolation source assertions.

## Boundaries

- Always: derive organization scope server-side from the authenticated user.
- Ask first: support one user belonging to multiple institutions.
- Never: accept `organizationId` from browser input or use a shared organization fallback.

## Success Criteria

- No current schema or server code contains `org-sovereign`.
- New signed-in users receive distinct institutions based on stable authenticated user IDs.
- Invited users join the inviter's institution.
- System reads and writes are scoped to the authenticated user's institution.
- Existing users are bound to stable authenticated user IDs on their next request.

## Open Questions

Multi-institution membership for regulators is a separate capability.
