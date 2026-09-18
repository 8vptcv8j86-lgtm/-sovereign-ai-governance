# Release Artifact Preservation Skill

## Purpose

Prevent loss of source code, release state, or deployment provenance after any build, patch, migration, release, or production deployment.

This skill is mandatory for every software artifact created or changed for the user.

## Core Rule

A build is not complete until the exact source that produced it is stored in a durable retrievable location, identified by an immutable version reference, and recovery has been verified.

Never treat a temporary workspace, chat session, local container, generated attachment, deployment filesystem, or transient agent environment as the only copy of source.

## Mandatory Completion Gates

Before stating that software work is complete, deployed, production ready, released, merged, or finished, confirm all of the following.

1. Source preservation
   - The complete source tree exists in a durable repository or durable file store.
   - The source includes every file required to rebuild the artifact.
   - Generated or edited files are not left only in a temporary execution environment.

2. Version identity
   - A git commit, tag, release ID, or equivalent immutable identifier exists.
   - Record the exact identifier in the release note.
   - Never cite a commit as authoritative unless it is retrievable from a durable remote.

3. Remote persistence
   - Push the commit or release to the connected durable remote before calling the work complete.
   - Verify the remote contains the exact commit.
   - If push is unavailable, save a complete source archive to another durable location and explicitly mark the release as not yet repository preserved.

4. Recovery verification
   - Verify the saved source can be retrieved from the durable location.
   - For git, fetch or query the remote commit.
   - For an archive, verify the file exists and can be opened.
   - Record the recovery path.

5. Production provenance
   - Record which exact source version produced the deployed build.
   - Record build date, deployment target, migration state, and verification result.
   - If production source cannot be tied back to an immutable version, label provenance unverified.

6. Migration preservation
   - Persist all migration files and migration metadata with the same release source.
   - Confirm migration numbering does not collide with the target baseline.
   - Never rely on a database state that cannot be reconstructed from preserved migrations.

7. Test and build evidence
   - Save the test/build result or CI run reference with the release record.
   - Do not claim a build passed if the evidence exists only in a transient session and cannot be checked later.

8. Release handoff
   - Update the durable release record with:
     - repository
     - branch
     - commit/tag
     - deployment target
     - migration version
     - test/build status
     - recovery location
     - known gaps

## Stop Conditions

Do not continue to the next feature or release if any of these are true:

- the authoritative source exists only in a temporary environment;
- the production commit has not been pushed;
- the recorded commit cannot be found on the remote;
- the deployment source and repository source differ without documentation;
- migrations cannot be reconstructed;
- a release record points to source that cannot be retrieved.

In those cases, stop feature work and preserve/recover the source first.

## Recovery Procedure

If source preservation failed:

1. Freeze new changes.
2. Identify the environment that produced the build.
3. Recover the exact source tree from the build machine, deployment source bundle, local clone, remote, artifact archive, or host.
4. Verify the commit hash when possible.
5. If the exact hash cannot be verified, mark the recovered source as unverified.
6. If only compiled output survives, never present reconstructed source as the original release. Create a new baseline and document the provenance gap.
7. Push the recovered source to the durable repository.
8. Verify retrieval from the remote before resuming work.

## Required Language in Status Reports

Use explicit status labels:

- SOURCE PRESERVED
- REMOTE VERIFIED
- RECOVERY VERIFIED
- PROVENANCE VERIFIED

If any are not true, say:

- SOURCE NOT YET PRESERVED
- REMOTE NOT VERIFIED
- RECOVERY NOT VERIFIED
- PROVENANCE UNVERIFIED

Never substitute "built," "saved," "deployed," or "recorded" for these checks.

## Sentinel Specific Application

For Sentinel releases, every release must preserve:

- application source;
- db/schema.ts;
- all Drizzle migrations and journal metadata;
- authorization modules;
- audit-chain modules;
- organization scoping logic;
- evidence export logic;
- recovery assurance logic;
- frontend page/workspace code;
- tests;
- CI configuration;
- exact production commit.

A Sentinel version number must never be declared authoritative unless the corresponding source commit is retrievable from the durable remote.

## Definition of Done

Software work is done only when:

SOURCE PRESERVED = true
REMOTE VERIFIED = true
RECOVERY VERIFIED = true
PROVENANCE VERIFIED = true

Anything less is work in progress.
