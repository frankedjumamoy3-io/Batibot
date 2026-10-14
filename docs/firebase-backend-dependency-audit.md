# BatiBot Firebase Backend Dependency Audit

## Audit Status

Phase 1 audit completed on 2026-10-14 against the `feature/testing` branch. This document describes current ownership and the intended migration boundary before any Firebase-dependent mobile behavior is changed.

## Decision Summary

The controlled APK does not need a one-for-one Firebase replacement.

- Keep learner onboarding, curriculum, rewards, ordinary progress, and settings local on the device.
- Replace only controlled administrator authentication and the shared quiz/admin operations that require a server.
- Keep published curriculum and BatiBot assets bundled with the APK for the initial test.
- Disable AI generation, remote uploads, automatic cloud synchronization, and live global leaderboards for the initial release.
- Preserve repository/service boundaries so optional cloud features can be added later without coupling screens directly to Express or PostgreSQL.

## Current Firebase Ownership

### Firebase Initialization

| Current module | Responsibility | Phase 1 decision |
| --- | --- | --- |
| `src/infrastructure/firebase/client.ts` | Initializes Firebase Auth, Firestore, and Storage with the inaccessible project. | Retain temporarily; remove only after all required adapters have moved. |
| `src/config/firebase.ts` | Presentation-safe facade exporting `auth`, `db`, and `storage`. | Retain as a migration bridge. No new code may import it. |

### Authentication and User Records

| Current module | Firebase use | Migration decision |
| --- | --- | --- |
| `src/data/repositories/auth-repository.ts` | Email/password login, signup, reset, and sign-out. | Replace controlled admin authentication with Express access/refresh token endpoints. Keep local learner login. Disable public email signup for this test. |
| `src/store/auth-session.tsx` | Firebase auth listener and live `users/{uid}` profile listener. | Split local learner session from optional backend admin session. Remove Firebase listener after the API adapter is validated. |
| `src/data/repositories/user-profile-repository.ts` | Reads and writes `users/{uid}`. | Keep local fallback mapping; replace server-owned admin profile lookup with `/auth/me`. |
| `src/data/repositories/user-settings-repository.ts` | Optionally reads and writes settings in `users/{uid}`. | Keep settings device-local for controlled APK testing. |
| `src/services/admin/adminUserMetadataService.ts` | Lists Firebase user documents for Admin. | Defer. Do not expose a user directory in the initial API. |

### Learner Profiles and Progress

| Current module | Firebase use | Migration decision |
| --- | --- | --- |
| `src/services/syncService.ts` | Anonymous Auth plus `learnerProfiles` and `users` cloud synchronization. | Disable cloud synchronization initially. Local learner profiles remain authoritative. |
| `src/services/learnerProfileService.ts` | Reads a cloud learner profile when local data is incomplete. | Keep local behavior; remove remote fallback during mobile integration. |
| `src/data/repositories/learner-progress-repository.ts` | Optional cloud progress in `users/{uid}`. | Keep AsyncStorage/device persistence. Do not add PostgreSQL learner progress unless cross-device testing is approved. |
| `src/services/preschoolWorldProgressService.ts` | Uses `users/{uid}/learningProgress/{worldId}`. | Preserve current local/domain behavior and defer remote writes. |
| `src/services/learnerProgressService.ts` | Reads all `users` records for summaries. | Defer; not required for the learner APK path. |
| `src/services/learnerAnalyticsService.ts` | Writes and reads `quizAttempts`. | Optional API replacement. Store only sanitized attempts when testing explicitly requires reports. |
| `src/services/leaderboardService.ts` | Reads and writes Firebase leaderboard entries. | Use local leaderboard behavior. Disable shared leaderboard synchronization initially. |
| `src/services/learnerCloudSyncEligibility.ts` | Checks Firebase user ownership before cloud writes. | Retire after cloud synchronization is disabled. |

### Curriculum, Vocabulary, and Published Content

| Current module | Firebase use | Migration decision |
| --- | --- | --- |
| `src/services/learningArchitectureService.ts` | Reads published levels, worlds, topics, stages, activities, challenges, and rewards. | Keep the local curriculum source authoritative for the APK. Defer database-backed curriculum. |
| `src/services/learnerPublishedContentService.ts` | Reads published admin content. | Use bundled/local content for the initial test; defer remote overrides. |
| `src/services/vocabularyService.ts` | Reads and seeds `vocabularyItems`. | Keep local Learning Worlds vocabulary. Disable live seed operations. |
| `src/services/curatedQuizLearnerService.ts` | Subscribes to published `curatedQuizzes`. | Replace with versioned read-only API requests, retaining existing local quiz presets as fallback. |

### Admin Curation

| Current module | Firebase use | Migration decision |
| --- | --- | --- |
| `src/services/adminQuizService.ts` | Curated quiz CRUD, publication, activity logs, and Gemini draft requests. | Migrate manual quiz CRUD and publication to Express/PostgreSQL. Keep deterministic validation in the app and repeat integrity validation on the server. Disable Gemini generation. |
| `src/services/admin/adminTopicDraftService.ts` | Topic draft CRUD. | Defer until manual quiz administration works. |
| `src/services/admin/adminContentDraftService.ts` | Content draft workflow and published content. | Defer from the initial backend. Keep local draft helpers only if they do not require Firebase. |
| `src/services/admin/adminAssetService.ts` | Admin asset metadata plus Storage uploads. | Disable remote uploads initially. Keep bundled assets. |
| `src/services/assets/assetRegistryService.ts` | Live approved asset registry and Storage upload. | Keep the centralized local registry and resolver. Defer remote registry subscription and upload. |

### File Storage

| Current module | Firebase use | Migration decision |
| --- | --- | --- |
| `src/services/profileImageService.ts` | Uploads, replaces, and deletes profile images in Firebase Storage. | Use device-local profile images during testing. Defer cross-device uploads. |
| `src/services/admin/adminAssetService.ts` | Uploads admin images and audio. | Disable upload controls or render a safe admin-only unavailable state until an object provider is approved. |
| `src/services/assets/assetRegistryService.ts` | Uploads curriculum images and resolves remote URLs. | Continue using bundled approved assets and educational fallbacks. |

PostgreSQL must store only asset metadata and provider URLs. It must never store image or audio binaries.

### Firebase Function and Maintenance Scripts

| Current module | Responsibility | Migration decision |
| --- | --- | --- |
| `firebase/functions/index.js` | Gemini-backed `generateQuizDraft` HTTP function. | Do not deploy or port during the controlled test. |
| `src/infrastructure/gemini/quiz-draft-client.ts` | Calls the inaccessible Firebase Function endpoint. | Disable the remote call; preserve deterministic local draft tools where safe. |
| `scripts/sync-learning-architecture-firestore.js` | Firestore architecture export/sync. | Preserve dry-run/export capability only; prohibit live synchronization. |
| `scripts/sync-vocabulary-firestore.js` | Firestore vocabulary synchronization. | Do not run against the new PostgreSQL stack. |
| `scripts/cleanup-firestore-safe.js` | Firestore cleanup. | Retain for history but exclude from the migration workflow. |

## Required Initial API Contract

Phase 1 establishes only service health and contract conventions:

```text
GET /health
GET /api/v1/status
```

Phase 2 adds controlled authentication:

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Phase 3 may add shared quiz operations:

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

### Success Envelope

```json
{
  "data": {},
  "meta": {
    "requestId": "opaque-request-id"
  }
}
```

### Error Envelope

```json
{
  "error": {
    "code": "STABLE_ERROR_CODE",
    "message": "Safe client-facing message",
    "requestId": "opaque-request-id"
  }
}
```

The API must never return stack traces, database errors, secrets, or account-existence details.

## Target Ownership

| Capability | Mobile repository | API repository | PostgreSQL |
| --- | --- | --- | --- |
| Learner UI and navigation | Owns | None | None |
| Curriculum and phase behavior | Owns for controlled test | Validates shared quiz payloads | Optional metadata later |
| Local learner profile and settings | Owns | None initially | None initially |
| Local progress, rewards, and mastery | Owns | None initially | None initially |
| Controlled admin authentication | Stores tokens securely and presents UI | Owns authentication and authorization | Stores user and token hashes |
| Curated quiz reads and writes | Calls typed adapter | Owns validation and routes | Stores normalized records |
| Quiz attempt reporting | Sends sanitized optional payload | Owns validation and persistence | Stores sanitized attempts |
| Asset rendering | Owns centralized resolver and bundled fallback | Optional signed upload orchestration later | Metadata only |
| AI generation | Disabled | Disabled | None |

## Dependency Direction

```text
Learner/Admin Screen
  -> presentation hook or view model
  -> repository/service interface
  -> local implementation or HTTP adapter
  -> Express API
  -> PostgreSQL repository
```

Screens must not import the API client, database concepts, or provider SDKs directly. The Express API must not duplicate learner presentation logic.

## Migration Order

1. Establish the API contract, health endpoint, logging, validation, and error handling.
2. Add PostgreSQL migrations and controlled admin authentication.
3. Introduce a typed mobile HTTP client without changing learner behavior.
4. Move curated quiz reads behind a repository adapter with local fallback.
5. Move manual admin quiz writes and activity logs.
6. Optionally add sanitized quiz attempt reporting.
7. Disable Firebase listeners and imports only after the replacement path passes APK testing.
8. Leave cloud learner sync, remote assets, live leaderboards, and AI generation disabled unless separately approved.

## Validation Gaps to Close

- The current test suite validates frontend architecture and curriculum but does not exercise an HTTP API.
- Backend contract, authentication, authorization, migration, transaction, and restore tests must be added in `Batibot-API`.
- APK tests must cover Render cold starts and service unavailability.
- An export/restore drill is required because free Render PostgreSQL has no managed backups.
- Mobile tests must verify that raw backend errors never reach learner-facing UI.

## Rollback Points

- Preserve the current local-only learner APK behavior as the primary rollback path.
- Introduce one HTTP-backed repository at a time.
- Keep local curated quiz presets available until remote quiz reads pass device testing.
- Do not delete Firebase bridge modules until the final APK no longer imports them.
- Roll back the API independently from the APK and restore PostgreSQL from the last verified export.

## Phase 1 Completion Criteria

- This audit is reviewed and remains the source of truth for initial migration scope.
- A local `Batibot-API` repository implements the health/status contract.
- The API installs from a lockfile and passes lint, typecheck, and tests.
- No mobile runtime behavior is changed in Phase 1.
- External GitHub and Render resources remain pending until authenticated owner accounts are available.
