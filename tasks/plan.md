# Multi-tenant organization isolation plan

1. Bind users to the stable authenticated-user ID and remove the AI-system organization default.
2. Centralize actor resolution and provision a distinct institution for new signed-in users.
3. Scope the systems API by the resolved institution.
4. Generate and validate the migration, then build, test, audit, and deploy.
