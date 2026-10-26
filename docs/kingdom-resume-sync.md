# Kingdom menus, saved journeys, and rewards

The oversized empty panel came from a topic row with `height: "100%"` inside a scroll container whose height was not bounded. `components/learning/world-topic-menu.tsx` now renders independent, naturally sized cards with images, labels, completion bars, and explicit locked/continue/replay states. The title panel stays legible over world backgrounds.

`app/(tabs)/play.tsx` uses the same checkpoint restoration for topic selection, hero Play, bottom Play, and lesson deep links. Checkpoints retain the current stage, completed challenge nodes and answers, guided-practice node, interaction completion flags, and practice result. Hero and bottom Play choose the most recently active unfinished topic. Existing saves without checkpoints resume from their recorded completed stages. Hydration finishes before launch controls become available. Completed stages and modules do not need to be replayed; unfinished manipulations inside an individual activity can restart at that activity.

The replay shortcut that skipped Reward, Progress, and Mastery was removed. Reward UI is app-owned even when lesson content is remotely published. Already claimed rewards remain visible without granting duplicate XP or stars. Existing correct-answer checks and LOOK → TAP → TRY → CHOOSE → PLAY → STAR → PROGRESS → MASTERED behavior remain in place.

## Saving and synchronization

- Each authenticated user or device profile has a separate local cache key. Version 2 wraps existing progress with a local revision and pending-upload flag; old unwrapped saves migrate automatically.
- Local writes are serialized and start after every committed progress change. The cache doubles as a durable outbox. Failed uploads leave it intact across restarts.
- Synchronization runs after hydration, every 15 seconds while mounted, on app foreground, and on the browser's online event. Backgrounding also flushes local state.
- Cloud loading merges completed stages, rewards, mastery, and checkpoints instead of replacing local progress. Newer checkpoint timestamps win. A reset timestamp prevents an older backup from restoring deliberately reset progress.
- PostgreSQL writes use an expected version. A competing update returns HTTP 409; the next sync reads, merges, and retries. Edits during an upload remain pending.
- Uploads are bound to the initiating account. Local and test profiles stay local until an ordinary device profile is explicitly backed up.
- Online learners restore their cached identity immediately on mobile, allowing offline study. Native tokens use SecureStore. Web sessions use sessionStorage and survive reloads within the same browser tab.

## Accounts and existing device journeys

Login and signup now link to the online learner account screen. Learners can register with a name, grade, email, and password, then sign in later. Registration always assigns the learner role. Existing admin-only routes retain their authorization checks.

For an existing local journey, open Play settings → Account → **Back up my journey**. Creating an account or signing into an existing learner account copies and merges that journey before publishing the new authenticated session. The original device profile remains available in device storage.

## Backend release

Deploy the matching backend before releasing the frontend. Migration `004_learner_progress.sql` adds the saved grade and versioned learner-progress table. The existing Render start command already runs `npm run db:migrate` before starting the service.

New endpoints:

- `POST /api/v1/auth/register`
- `GET /api/v1/learner/progress`
- `PUT /api/v1/learner/progress`

The app build must have `EXPO_PUBLIC_API_BASE_URL` pointing to the deployed HTTPS API including `/api/v1`. No environment files, hosting settings, production databases, or live deployments were changed by this implementation.

## Validation

- Backend typecheck, lint, build, and 41 tests pass, including registration, grade restoration, account isolation, permission rejection, persisted progress, and conflicting writes.
- Frontend typecheck, lint, architecture boundaries, active-learning validation (247 topics), and asset-resolution validation pass.
- Eight API integration tests, seven lesson-media tests, and five progress/resume tests pass.
- Expo web export succeeds.
- Headless Edge at 390 × 844 confirms readable independent topic cards, continuation after reload, and saved-stage restoration from kingdom selection and both Play buttons. A 320 × 568 check confirms card bounds, scrolling to the last module, and online-signup validation. The reward transition is exercised using a persisted passed-challenge fixture, and claiming it records exactly one local reward; no physical Android/iOS device was connected.

Screenshots are in `docs/media/kingdom-menu-fixed.png`, `docs/media/lesson-resume.png`, and `docs/media/module-reward-fixed.png`. New artwork and exact generation prompts are documented in `module-art-prompts.md`.
