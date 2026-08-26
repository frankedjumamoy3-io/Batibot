# BatiBot Controlled Testing Deployment Plan

## Purpose

Prepare the current BatiBot application for a small, controlled testing deployment without expanding the product or starting unfinished roadmap work. The app is being discontinued, so the goal is to preserve and demonstrate the functionality already achieved, fix only release-blocking defects, and leave a simple handoff path.

## Scope Guardrails

- Keep the current learner experience, curriculum, assets, Firebase project, and three-tab `Rank` / `Play` / `Reward` structure.
- Do not add new curriculum, redesign screens, refactor architecture, or finish deferred roadmap items.
- Do not publish AI-generated content or run destructive Firestore cleanup/sync scripts.
- Do not weaken authentication, Firestore rules, Storage rules, or admin access controls.
- Use the built-in test account only for the controlled test build.
- Prefer the web export for the first test gate. Build an internal Android APK only if the web gate passes and an EAS account/token is available.

## Current Baseline

- Expo SDK 54 / React Native 0.81 / TypeScript application.
- Existing Firebase project: `batibot-app-e3cc9`.
- Existing static web export and Firebase Hosting configuration.
- Existing EAS `preview` profile produces an internal Android APK.
- QA/test-account flow already exists and is gated by `EXPO_PUBLIC_ENABLE_QA_MODE=true` outside development.
- Learner-side readiness audit reports the implemented experience as suitable for a controlled review, with physical-device QA still pending.
- Local dependencies are not installed at the start of this plan.
- Firebase Functions target Node 20; use Node 20 LTS for deployment work even if static checks happen to pass on a newer local Node version.

## Preparation Status — 2026-08-26

- [x] Created and switched to `feature/testing`.
- [x] Installed root dependencies from `package-lock.json` with `npm.cmd ci`.
- [x] Added the Expo SDK 54-compatible `expo-asset` and `react-native-svg` peer dependencies required by standalone builds.
- [x] Aligned Expo, Expo Constants, and React Navigation declarations with Expo SDK 54.
- [x] Passed Expo Doctor: 18/18 checks.
- [x] Passed TypeScript, lint, architecture-boundary, asset-resolution, Preschool Play, and active-learning validation.
- [x] Exported the controlled QA web build to `dist/`: 76 static routes and 565 files.
- [x] Confirmed `/`, `/login`, and the main JavaScript bundle return HTTP 200 from a local static server.
- [x] Confirmed the controlled bundle contains **Open Test Account** and **BatiBot Test Account**.
- [x] Installed nested Firebase Functions dependencies and passed backend JavaScript syntax validation.
- [x] Passed the learning-architecture dry run for 5 levels, 37 worlds, 247 topics, and 1,976 stages.
- [ ] Perform the interactive browser/device learner-flow smoke test listed in Phase 3.
- [ ] Build an Android preview APK only if an installable test artifact is requested and EAS credentials are available.
- [ ] Deploy Firebase Hosting only after explicit approval and Firebase CLI authentication.

Dependency-audit note:

- The root dependency tree currently reports 30 inherited advisories, including 2 critical advisories.
- The Firebase Functions dependency tree currently reports 12 inherited advisories, including 1 critical advisory.
- No forced audit upgrade was applied. Some reported fixes would move the project to Expo 57 or otherwise exceed this discontinued controlled-test scope. Keep the test audience limited and do not treat this build as a maintained public production release.

## Gradual Implementation

### Phase 0 — Preserve the Baseline

Status: **Completed on 2026-08-26.** The controlled-testing preparation is isolated on `feature/testing`, the baseline changes are recorded in Git, and no database migration, content synchronization, or production-data cleanup was performed.

1. Work on `feature/testing`.
2. Confirm the working tree is clean before implementation.
3. Avoid database migrations, content synchronization, and production data cleanup.

Exit gate:

- Existing source is unchanged except for controlled-testing documentation or confirmed release-blocker fixes.

### Phase 1 — Reproduce the Existing App Locally

1. Install locked dependencies with `npm.cmd ci`.
2. Confirm Expo dependency compatibility with `npx.cmd expo-doctor`.
3. Run the existing project checks:

   ```powershell
   npm.cmd run typecheck
   npm.cmd run lint
   npm.cmd run validate:architecture-boundaries
   npm.cmd run validate:asset-resolution
   npm.cmd run validate:preschool-play
   npm.cmd run validate:active-learning-framework
   ```

4. Record failures before changing code.

Exit gate:

- Dependencies install reproducibly from `package-lock.json`.
- Static checks either pass or identify a small, specific deployment blocker.

### Phase 2 — Apply Only Blocking Fixes

Status: **Completed on 2026-08-26.** No additional application-code blocker was found. Expo Doctor passed all 18 checks, and TypeScript, lint, architecture-boundary, asset-resolution, and active-learning validation all passed. The SDK compatibility and missing peer-dependency fixes were already preserved in the Phase 0 baseline, so no further code change was justified.

1. Fix only errors that prevent startup, navigation, authentication fallback, asset loading, or export.
2. Preserve local learner profiles and existing Firebase-backed admin behavior.
3. Do not replace known asset fallbacks or implement deferred learning features unless they crash the app.
4. Re-run the smallest relevant check after every fix.

Exit gate:

- No TypeScript, lint, architecture, asset-resolution, or active-learning validation errors remain that block the controlled test.

### Phase 3 — Produce the Web Test Build

1. Enable the existing QA entry only for the controlled build:

   ```powershell
   $env:EXPO_PUBLIC_ENABLE_QA_MODE = "true"
   npm.cmd run export:web
   ```

2. Confirm `dist/` contains `index.html` and static assets.
3. Serve `dist/` locally and smoke-test:
   - app loads without a blank screen;
   - signup/login routes render;
   - **Open Test Account** starts a learner session;
   - grade preview and lock modes work;
   - Rank, Play, and Reward tabs open;
   - at least one world, topic, lesson stage, quiz/challenge, and reward path opens;
   - refresh and sign-out do not trap the tester;
   - no admin-only operation is required for learner testing.

Exit gate:

- Static web export succeeds and the core learner journey is usable in a browser.

### Phase 4 — Optional Internal Android Test

Proceed only if testers need an installable Android build.

1. Use Node 20 LTS.
2. Confirm EAS authentication with an interactive login or `EXPO_TOKEN`.
3. Keep `EXPO_PUBLIC_ENABLE_QA_MODE=true` limited to the preview build environment.
4. Run:

   ```powershell
   npm.cmd run build:android:apk
   ```

5. Install the APK on one representative Android device and repeat the core learner smoke test, including audio permissions and back navigation.

Exit gate:

- Internal APK installs and completes the same core learner journey without a release-blocking crash.

### Phase 5 — Controlled Hosting Deployment

Proceed only after the local web smoke test passes and Firebase CLI authentication is available.

1. Confirm the active Firebase project is `batibot-app-e3cc9`.
2. Deploy Hosting only:

   ```powershell
   npx.cmd firebase-tools deploy --only hosting
   ```

3. Do not deploy Functions, Firestore rules, Storage rules, or live curriculum data unless separately reviewed and explicitly required.
4. Share the test URL only with the controlled tester group.

Exit gate:

- Hosted test URL loads the same validated build.
- No production data or security configuration was changed.

### Phase 6 — Freeze and Handoff

1. Record the tested commit, platform, browser/device, and known limitations.
2. Preserve the final static build or EAS artifact reference if required by the project owner.
3. Document any unavailable external service rather than replacing it with a new integration.
4. Stop implementation after release blockers are resolved.

Exit gate:

- Testers have a working build, a short smoke-test checklist, and a known-limitations list.

## Acceptance Criteria

- The repository installs from the lockfile.
- TypeScript and required repository validators pass, or any non-blocking exception is documented.
- The Expo web export completes.
- The controlled QA account is visible only when explicitly enabled for the test build.
- A tester can enter the app and navigate Rank, Play, and Reward.
- At least one representative lesson flow reaches progress/mastery or its current completed state.
- No secrets are added to source control.
- No Firebase data synchronization, cleanup, or rules deployment occurs as part of the basic test release.

## Known Limitations Accepted for This Test

- Physical-device QA is limited to the devices available to the tester.
- Some curriculum artwork uses established fallback assets.
- Some drag interactions are implemented as mobile-safe tap-to-place behavior.
- Admin AI generation depends on the already-deployed Firebase Function and its configured secret.
- The discontinued product will not receive deferred adaptive scoring, expanded artwork, or major architecture work.

## Rollback

- Stop before deployment if the web export or core learner smoke test fails.
- Revert only the specific release-blocker change; do not rewrite Git history.
- Firebase Hosting rollback, if needed, should use the prior Hosting release in the Firebase console.
- Keep QA mode disabled in any build not intended for the controlled tester group.
