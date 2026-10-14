# BatiBot Mobile APK Backend Migration Plan

## Purpose

Replace the inaccessible Firebase backend with a small Node.js/Express API and PostgreSQL database for controlled Android APK testing. The existing Expo application remains the mobile client. No web frontend or frontend hosting will be created.

The product is being discontinued, so this plan preserves the functionality already achieved and avoids rebuilding optional cloud features that are not required by the test group.

## Target Architecture

```text
Android test APK
  -> HTTPS requests
Render Node.js/Express web service
  -> private database connection
PostgreSQL database
```

Initial learner curriculum, artwork, settings, and progress remain bundled or stored locally in the APK. The backend is introduced only for data that must be shared, administered, or persisted outside the device.

## Deployment Decisions

- **Mobile client:** the existing Expo/React Native application in this repository.
- **Test artifact:** an internal Android APK built with the existing EAS `preview` profile.
- **Backend:** a separate private repository named `Batibot-backend` using Node.js, TypeScript, and Express.
- **API hosting:** one Render web service.
- **Database:** PostgreSQL accessed through a standard `DATABASE_URL`.
- **Initial database host:** Render PostgreSQL is acceptable only for a time-boxed test of 30 days or less. The free database expires after 30 days, provides no backups, and must be exported before expiration.
- **Longer-lived database:** move the same PostgreSQL schema to a persistent provider before the Render free database expires. Keeping PostgreSQL access behind the API prevents the APK from depending on a specific database vendor.
- **Object storage:** excluded from the initial deployment. Use bundled assets and device-local profile images during testing.
- **Optional future storage:** prefer Supabase Storage for private authenticated files, Cloudinary for managed image delivery, or Cloudflare R2 for S3-compatible general object storage. All upload credentials must remain in the backend.
- **AI generation:** disabled for this controlled deployment.
- **Firebase:** no new Firebase project, Hosting deployment, Functions deployment, Firestore synchronization, or Storage migration.

## Scope Guardrails

### Included

- A health-checked Express API deployed on Render.
- A versioned PostgreSQL schema and repeatable migrations.
- Backend authentication for the controlled administrator account.
- Published quiz reads and protected admin quiz operations if required by the current APK.
- Optional recording of sanitized quiz attempts for the controlled test.
- Mobile API adapters with clear offline/local fallback behavior.
- Internal APK generation and physical-device testing.
- Database export and deployment handoff documentation.

### Excluded

- Web frontend hosting.
- Migration of inaccessible Firebase users, Firestore documents, Functions secrets, or Storage files.
- Public registration for children.
- Rebuilding all curriculum as database records.
- Direct PostgreSQL access from the APK.
- Uploading real child photographs or unnecessary personally identifiable information.
- AI-assisted quiz generation unless it is separately reviewed and approved.
- Major UI redesign or unfinished roadmap work.

## Phase 1 - Audit, Contract, and Repository Foundation

Status: **Completed on 2026-10-14.** Firebase dependencies were classified in `docs/firebase-backend-dependency-audit.md`. The separate backend repository is located at `C:\Users\User\Batibot\Batibot-backend` and published at `https://github.com/frankedjumamoy3-io/Batibot-backend.git`. It contains the versioned health/status contract, request IDs, structured logging, safe error envelopes, security headers, JSON limits, rate limiting, tests, and Render Blueprint configuration. The Phase 1 scaffold is preserved in commits `9807835` and `a399bcf`. Connecting the repository to the owner's Render workspace remains pending.

### Objective

Define the smallest backend contract required by the current APK and establish a secure, independently deployable API repository.

### Implementation

1. Audit all current Firebase dependencies and classify each use as:
   - required for APK testing;
   - replace with the Express API;
   - keep local on the device; or
   - disable for the controlled release.
2. Keep learner profile creation, learner settings, rewards, curriculum content, and ordinary progress local unless a test requirement proves cloud persistence is necessary.
3. Define versioned API contracts under `/api/v1` before changing the mobile client.
4. Create a private `Batibot-backend` repository with:
   - Node.js and TypeScript;
   - Express;
   - request validation;
   - structured logging;
   - security headers;
   - rate limiting;
   - centralized error handling;
   - unit and integration test setup;
   - `.env.example` containing names only, never values.
5. Set a maintained Node.js version explicitly in `package.json` and Render configuration instead of relying on Render's default.
6. Add initial endpoints:

   ```text
   GET /health
   GET /api/v1/status
   ```

7. Define a standard response envelope and stable error codes so learner-facing screens never display server or database errors directly.
8. Document environment variables:

   ```text
   NODE_ENV
   PORT
   DATABASE_URL
   JWT_ACCESS_SECRET
   JWT_REFRESH_SECRET
   ADMIN_BOOTSTRAP_EMAIL
   ADMIN_BOOTSTRAP_PASSWORD_HASH
   LOG_LEVEL
   ```

### Security Requirements

- Keep every secret in Render environment variables.
- Never use an `EXPO_PUBLIC_` variable for a secret.
- Do not commit `.env`, database URLs, passwords, JWT secrets, or provider keys.
- Restrict request body size and reject unknown fields.
- Return generic authentication errors without revealing whether an account exists.

### Exit Gate

- Firebase usage is mapped to keep, replace, or disable decisions.
- The API repository installs from its lockfile.
- `/health` passes locally.
- Backend lint, typecheck, and automated tests pass.
- No mobile behavior has been changed yet.

## Phase 2 - PostgreSQL Schema, Migrations, and Authentication

Status: **Implemented and validated locally on 2026-10-14; external database gate pending.** Backend commit `752e54e` adds the seven-table PostgreSQL schema, checksum-protected migrations, database-aware health checks, Argon2 administrator authentication, short-lived JWT access tokens, rotating hashed refresh tokens, role middleware, a controlled administrator bootstrap command, and database operations documentation. TypeScript, lint, 13 automated tests, the production build, the npm vulnerability audit, and the repository secret-pattern scan pass. Clean migration and idempotence tests pass against a PostgreSQL-compatible in-memory adapter. A real PostgreSQL instance and PostgreSQL client tools are not available on this workstation, so the real-database migration plus `pg_dump` / `pg_restore` drill must be completed after the Render database is provisioned; the compatibility test is not treated as that exit gate.

### Objective

Create a minimal relational data model and secure administrator authentication without importing unavailable Firebase data.

### Implementation

1. Provision a PostgreSQL database and connect locally using a non-committed `DATABASE_URL`.
2. Add versioned SQL migrations. Do not make manual production-only schema changes.
3. Create only the tables needed for controlled testing:

   ```text
   app_users
   refresh_tokens
   curated_quizzes
   quiz_questions
   quiz_attempts
   admin_activity_logs
   asset_metadata
   ```

4. Add `learner_profiles` and `learner_progress` only if cross-device progress is an explicit test requirement. Local APK progress remains the default.
5. Use UUID identifiers, foreign keys, unique constraints, UTC timestamps, and indexes for frequently queried ownership and status columns.
6. Store passwords only as strong salted hashes. Never store or log plaintext passwords.
7. Implement controlled admin endpoints:

   ```text
   POST /api/v1/auth/login
   POST /api/v1/auth/refresh
   POST /api/v1/auth/logout
   GET  /api/v1/auth/me
   ```

8. Use short-lived access tokens and rotated refresh tokens. Store refresh-token hashes, expiration time, revocation time, and account ownership in PostgreSQL.
9. Bootstrap one administrator through a server-side migration or one-time command using environment-provided values. Do not expose public admin registration.
10. Add role middleware for `admin` and `tester`; default any future non-admin account to `learner`.
11. Add migration and authentication tests, including invalid credentials, expired tokens, revoked tokens, and role denial.

### Data Rules

- Do not attempt to recreate inaccessible Firebase users.
- Do not upload local curriculum tables unless the admin workflow actually needs to edit them.
- Store only sanitized test data.
- Exclude QA/test attempts from analytics and public leaderboards.

### Exit Gate

- A clean database can be created entirely from migrations.
- A controlled admin can sign in, refresh, and sign out.
- Protected endpoints reject missing, expired, or insufficient credentials.
- A database export and restore test succeeds.

## Phase 3 - API Features and Mobile Integration

### Objective

Replace only the Firebase operations required by the APK while preserving local learner functionality when the service is sleeping or unavailable.

### Backend Implementation

1. Implement the minimum current API surface:

   ```text
   GET    /api/v1/quizzes
   GET    /api/v1/quizzes/:id
   POST   /api/v1/quiz-attempts
   GET    /api/v1/admin/quizzes
   POST   /api/v1/admin/quizzes
   PATCH  /api/v1/admin/quizzes/:id
   DELETE /api/v1/admin/quizzes/:id
   GET    /api/v1/admin/activity-logs
   ```

2. Validate correct-answer integrity on every quiz write:
   - one clear target;
   - exactly one correct answer unless explicitly multi-select;
   - no normalized duplicate choices;
   - valid grade, world, topic, and learning phase;
   - no unpublished content returned to learner endpoints.
3. Use database transactions for quiz and question writes.
4. Add pagination and safe maximum result sizes.
5. Keep AI drafting endpoints disabled.
6. Store only object metadata and provider URLs if remote storage is added later. Never store image or audio binaries in PostgreSQL.

### Mobile Implementation

1. Add a typed API client and repository adapters in the established service/data layers.
2. Configure only the public API origin in the APK:

   ```text
   EXPO_PUBLIC_API_BASE_URL=https://<service-name>.onrender.com/api/v1
   ```

3. Replace direct Firebase use one feature at a time rather than rewriting screens.
4. Preserve local learner creation and local progress if the API is unavailable.
5. Add request timeouts, retry only safe idempotent requests, and provide child-friendly fallback behavior.
6. Never show raw network, SQL, stack-trace, or deployment messages in learner screens.
7. Keep bundled curriculum and centralized BatiBot asset resolution unchanged.
8. Remove Firebase client initialization only after no required feature depends on it.

### Storage Decision

Remote uploads remain disabled during this phase. The APK uses bundled learning assets and device-local profile images. If testers require cross-device uploads, select one provider in a separately approved change:

- Supabase Storage for private user-owned files and policy-based access.
- Cloudinary for image-focused upload, transformation, and delivery.
- Cloudflare R2 for private S3-compatible images, audio, and general objects.

All remote uploads must pass through backend authorization or backend-issued short-lived signed URLs.

### Required Frontend Validation

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

### Exit Gate

- Required mobile features use typed API adapters.
- The core learner path still works with the API unavailable.
- Admin operations require an authenticated admin role.
- No Firebase credential or inaccessible-project dependency blocks APK startup.
- All required repository validation passes.

## Phase 4 - Render Deployment and APK Build

### Objective

Deploy only the API and PostgreSQL database, then produce an installable APK configured for that service.

### Render Database

1. Create the PostgreSQL instance in the same practical region as the API.
2. Treat free Render PostgreSQL as disposable and limited to the controlled test window.
3. Store the internal database URL only in the Render web service environment.
4. Run migrations through a reviewed deployment command.
5. Create the controlled admin without printing credentials in logs.
6. Produce an encrypted SQL export immediately after schema initialization.
7. Schedule another export before day 25 and at the end of testing.

### Render Web Service

1. Connect the private `Batibot-backend` repository.
2. Configure the explicit Node.js version, build command, start command, health-check path, and environment variables.
3. Deploy the Express service over Render HTTPS.
4. Confirm:
   - `/health` returns HTTP 200;
   - database connectivity is healthy;
   - migrations are at the expected version;
   - secrets do not appear in logs;
   - protected routes reject unauthenticated requests.
5. Accept that a free Render web service may sleep when idle. The APK must handle the initial cold start without crashing or losing local progress.

### APK Build

1. Use the existing EAS `preview` profile for an internal APK.
2. Authenticate with an available Expo/EAS account. The inaccessible prior account cannot be reused.
3. Set build-time public variables for the controlled build only:

   ```text
   EXPO_PUBLIC_ENABLE_QA_MODE=true
   EXPO_PUBLIC_API_BASE_URL=https://<service-name>.onrender.com/api/v1
   ```

4. Do not place database, JWT, storage, or admin secrets in EAS public variables.
5. Run the full frontend validation gate before starting the remote APK build.
6. Record the EAS build ID, APK URL, Git commit, API deployment, and database migration version.

### Exit Gate

- The Render API and PostgreSQL database are reachable and healthy.
- An installable controlled-test APK is produced.
- The APK points to the Render API over HTTPS.
- No frontend website or frontend hosting service has been created.

## Phase 5 - Physical-Device Testing, Backup, and Freeze

### Objective

Verify the real APK experience, preserve test evidence, and freeze the discontinued application after release blockers are resolved.

### Device Test Matrix

Test on at least one representative Android phone and, if available, one second Android version or screen size.

1. Install the APK from a clean device state.
2. Open the QA learner account.
3. Confirm Rank, Play, and Reward navigation.
4. Open one world, topic, and complete the available lesson stages.
5. Complete one quiz or challenge with correct and incorrect answers.
6. Confirm stars, XP, rewards, progress, and mastery remain saved after restart.
7. Test airplane/offline mode and confirm local learning remains usable.
8. Reconnect and confirm optional API operations recover safely.
9. Allow the Render service to sleep, then confirm a cold request shows safe waiting/retry behavior instead of an app crash.
10. Test controlled admin login and one create/update/publish flow if admin testing is in scope.
11. Confirm sign-out removes the active session and does not expose another learner's information.
12. Confirm no developer errors, database messages, missing-secret text, or raw server responses appear to learners.

### Final Security and Data Checks

- No secrets are present in the APK bundle or repository.
- No real child data was used.
- Admin endpoints require valid role authorization.
- Quiz attempts do not contain unnecessary identity data.
- Database exports are encrypted and access-controlled.
- Logs exclude passwords, tokens, database URLs, and learner-identifying information.

### Freeze and Handoff

1. Export PostgreSQL after the final successful test.
2. Record the database expiration date if using free Render PostgreSQL.
3. Record the last tested APK, commit, API URL, migration version, and device results.
4. Document known limitations:
   - free API cold starts;
   - time-limited free Render PostgreSQL;
   - local-only learner data unless cloud sync was explicitly enabled;
   - remote uploads disabled;
   - AI generation disabled.
5. Stop implementation after release-blocking issues are resolved.

### Exit Gate

- Testers have an installable APK and a working backend service.
- The representative learner journey passes on a physical Android device.
- The final PostgreSQL export has been verified.
- Known limitations and the database expiration date are documented.
- No frontend hosting was provisioned.

## Overall Acceptance Criteria

- The Android APK installs and launches without the inaccessible Firebase project.
- Learners can use Rank, Play, Reward, lessons, quizzes, and local progress.
- The app remains usable when the Render API is cold or temporarily unavailable.
- Required server operations use HTTPS and validated API requests.
- PostgreSQL is accessed only by the backend.
- Admin operations require authenticated role checks.
- The database can be recreated from migrations and restored from an export.
- Object storage is not required for the initial controlled test.
- No frontend hosting service is created.
- Validation and physical-device test results are recorded rather than assumed.

## Rollback Strategy

- Keep the pre-migration APK and the current `feature/testing` commit as the mobile rollback point.
- Migrate one repository/service adapter at a time so a failed API integration can fall back to local behavior.
- Roll back the Render web service to the last healthy deployment when an API release fails.
- Restore PostgreSQL from the latest verified export into a replacement database when necessary.
- Do not reactivate or depend on the inaccessible Firebase project as a rollback mechanism.

## Start Condition

Implementation begins only after the owner confirms:

1. the GitHub account or organization that will own the private `Batibot-backend` repository;
2. the Render account or workspace that will own the API and database;
3. the available Expo/EAS account that will produce the APK; and
4. whether the controlled test will end within the 30-day free Render PostgreSQL window.
