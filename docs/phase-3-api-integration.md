# Phase 3: API and APK integration

Implementation date: 2026-10-15.

## Runtime behavior

The controlled build uses the Node backend for administrator authentication and shared quizzes. Set the public build variable to the deployed versioned API origin:

```text
EXPO_PUBLIC_API_BASE_URL=https://<service-name>.onrender.com/api/v1
```

An empty value leaves local learner features available and makes remote admin actions unavailable. Release builds require HTTPS. Local development also accepts localhost, 127.0.0.1 and the Android emulator host 10.0.2.2. No database URL, admin password or JWT secret belongs in the APK.

Requests time out after 12 seconds. GET requests retry once on transport/server failure; mutations are not retried after transport failure. Authentication rejection can refresh the session and retry because authorization precedes mutations. Concurrent refreshes share one request. Android administrator tokens use Expo SecureStore. The web development fallback keeps tokens in memory only.

## Administrator workflow

1. Provision the administrator with the backend bootstrap command after running migrations.
2. Use the existing administrator email/password sign-in form. The backend account role determines access.
3. The administrator landing page opens the controlled quiz console. Select a grade, world and topic from bundled curriculum metadata.
4. Enter a title, objective and questions. The mobile console authors multiple-choice questions. Each answer must match one visible choice; early learner quizzes use two or four choices.
5. Preview questions on the phone, complete the review checklist, then save the draft.
6. Select the saved quiz and choose **Save and publish reviewed quiz**.
7. Unpublish or archive a quiz to remove it from subsequent learner fetches. Published quizzes must be unpublished before deletion. Quiz mutations are recorded by the server in the same database transaction.

Other admin content, AI and upload workflows are deferred; their deep links return to the controlled console. Public administrator registration is disabled. Administrator password resets remain an owner-operated bootstrap task.

## Learner workflow and fallback

**Play → Practice quizzes** opens the existing learner quiz screen. Published shared quizzes matching the learner's grade appear alongside bundled quizzes. The screen accepts remote text-choice question types that its current renderer supports. Other supported API question formats remain excluded from this screen until their renderers are integrated. The bundled lesson stages and asset resolver remain authoritative.

The remote list is fetched when the quiz screen mounts or the grade changes; it is not a live subscription. Reopen the screen to see publication changes. There is no persistent remote quiz cache, so an offline launch uses bundled content. A quiz already in progress retains its snapshot.

Profiles, settings, progress, stars, rewards, vocabulary and rankings remain local. Profile photos are copied into the application's document directory on the device. Cloud sync, remote asset listeners, live vocabulary seeding and AI generation are disabled in the controlled path. Firebase bridge modules remain for retained source compatibility; required startup and learner operations bypass their network calls.

Optional shared quiz attempt reporting sends only quiz UUID, score and question count. No learner name, email, device identifier, profile identifier or free-form response is sent. The server always marks these as test records excluded from analytics and rankings. Failed submissions are discarded; local learner completion is independent of the request.

## Reproducible checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:api-integration
npm.cmd run validate:architecture-boundaries
npm.cmd run validate:active-learning-framework
npm.cmd run validate:asset-resolution
npx.cmd expo export --platform android --output-dir .expo/phase3-android --no-bytecode
```

The Android export is a packaging check, not an installable APK or a physical-device test. APK generation and on-device acceptance remain Phases 4 and 5.

Recorded results: all commands above passed, including six mobile API integration tests and an Android bundle containing 7,555 modules and 400 assets. Backend `npm run check` passed with 18 tests. Active-learning validation covered 247 topics. These checks ran on the workstation's Node 24.18.0; the backend declares Node 22 for Render, whose actual runtime smoke test remains part of deployment verification. Backend commit `afa6573` is pushed to GitHub.

The frontend dependency audit currently reports 53 advisories (1 low, 17 moderate, 33 high, 2 critical). Adding the explicit Expo file-system dependency reused the same SDK-compatible version already nested under Expo. No forced framework upgrade was performed.

## Remaining deployment evidence

- Configure the Render service/database and run both numbered migrations against real PostgreSQL.
- Complete the Phase 2 export/restore drill with PostgreSQL client tools.
- Build the preview APK with the actual API URL.
- On an Android device, test admin login, create/edit/review/publish, learner fetch and completion, unpublish, offline learning, restart persistence and sign-out.
- Test Render cold start and connection loss during reads/writes; compare local progress before and after.
- Verify device-local profile photos survive restart and administrator tokens are cleared on sign-out.

Do not mark the APK or deployment gates passed based only on automated tests or the Android bundle export.
