# Chapter I System Alignment Audit

This audit checks the current BatiBot system against the official Chapter I source in `docs/chapter-1-introduction.md`.

Status labels:

- `Aligned`: implemented in the current system.
- `Partial`: foundation exists, but behavior is incomplete or not connected end to end.
- `Gap`: missing or not yet reliable enough for the Chapter I claim.

## Alignment Summary

| Chapter I Requirement | Current Status | Evidence | Required Fix |
| --- | --- | --- | --- |
| Preschool to Grade 3 curriculum-specific learner experience | Aligned | `src/data/curriculum/learning-path.ts`, `src/data/learner-module.ts`, `app/(tabs)/play.tsx`, `app/(tabs)/rank.tsx`, `app/(tabs)/reward.tsx` | Keep all new learner content grade-scoped. |
| Learners only see assigned curriculum-level worlds/topics/activities | Aligned | Play uses `getCurriculumForGrade(profile?.gradeLevel)`, vocabulary and quiz use grade helpers, and published curated content has grade/world/topic/phase filtering. | Keep new learner content behind the same filters. |
| Play, Rank, Reward learner model | Aligned | `src/navigation/tab-config.ts`, `app/(tabs)/_layout.tsx`; hidden tabs redirect or are internal. | Keep Learn/Quiz as internal routes only. |
| Discover, Explore, Interact, Practice, Challenge, Reward, Progress, Mastery framework | Aligned | `ACTIVE_LEARNING_PHASES`, `STEP_META`, Play lesson renderer. | Keep phase copy and admin phase validation synchronized. |
| One-node-per-stage progression | Aligned | `src/domain/rules/lesson-node-rules.ts` returns `SINGLE_STAGE_NODE_INDEXES`. | If multi-node stages are added later, update Chapter I or add approved exception. |
| Immediate feedback and rewards | Aligned | Play reward claim, XP/stars, quiz result feedback, Reanimated controls. | Continue testing mobile layout so feedback does not overlap controls. |
| Progress tracking with XP, levels, streaks, stars, badges, achievements, notifications, unlockable content | Aligned | `src/domain/usecases/learner-progress`, `app/(tabs)/rank.tsx`, `app/(tabs)/reward.tsx`. | Keep learning updates compact so they do not crowd mobile controls. |
| Administrator monitoring and content management | Mostly aligned | `app/(admin)/index.tsx`, admin reports, activity logs, Play Content views. | Split large admin route into smaller components/routes for maintainability; add stronger dedicated world/topic monitoring. |
| AI-assisted content curation through BatiBot curriculum intelligence layer and Gemini | Mostly aligned | `src/services/curriculumDraftApi.ts`, `src/services/adminPlayContentService.ts`, `firebase/functions/index.js`. | Deploy updated Firebase function; keep backend prompt version aligned with local prompt/version. |
| AI-generated content requires admin review, validation, approval before publication | Aligned | Draft Studio saves drafts/review status; `validateAdminPlayContentForPublish`; publish blocker flow. | Mobile preview is now a persisted publish blocker; continue testing the preview path. |
| Admin can create, review, organize, validate, publish, and monitor content | Partial | Admin can generate, edit, validate, publish, archive, report. | Published curated content still needs stronger Play-map learner connection and phase/node placement. |
| MATATAG/foundational competency alignment | Mostly aligned | Grade/world/topic data exists, cognitive templates exist, and topics now expose competency code/source/objective metadata. | Replace generated competency codes with exact school/curriculum codes if a formal mapping table is later provided. |
| Evaluation in functionality, usability, engagement, reliability, security | Mostly aligned | `docs/evaluation-plan.md`, `docs/test-cases.md`, `docs/security-and-data-reliability-checklist.md`. | Add filled test results after hands-on evaluation. |

## Highest-Priority System Gaps

1. Published curated content now has a learner Play connection, but needs richer activity rendering.
   - The admin draft model now stores `gradeLevel`, `worldId`, `topicId`, `phase`, `node`, `assetId`, and reward mapping.
   - The learner-side curated quiz normalization now preserves Play placement metadata.
   - The Play screen subscribes to matching published content by grade/world/topic/phase and shows a compact cue in the matching lesson placement.
   - Remaining fix: open the exact curated Practice/Challenge activity from that cue instead of only signaling availability.

2. Curated content visibility now has an active Play subscriber.
   - Built-in Play, vocabulary, and quiz content are grade-scoped.
   - Admin-published curated content now has a learner service filter for grade/world/topic/phase.
   - The Play screen uses that filtered service for the active learner placement.

3. Mobile preview is now a persisted publish gate.
   - `mobilePreviewChecked`, `previewCheckedAt`, and `previewCheckedByUid` are part of curated quiz metadata.
   - Publishing blocks when preview has not been checked.

4. Reward and rank impact is now structured, but reward application should be tested end to end.
   - XP is validated by phase range, and Play rewards claim stars/XP.
   - `QuizRewards` now supports stars, rank progress, reward progress, mastery, and next unlock metadata.
   - Remaining fix: ensure every learner completion path applies those fields consistently.

5. Chapter I mentions rankings based on accumulated stars, and current Rank is implemented as personal progress/standing.
   - `app/(tabs)/rank.tsx` shows learner level, XP, stars, streak, completed worlds, and next goal.
   - Public multi-learner leaderboard behavior is intentionally out of scope unless a child-safe ranking design is approved later.
   - Fix: keep wording aligned around personal Rank, stars, XP, mastery, and next goal.

6. Notifications are now visible in Rank.
   - Progress notification data and mark-read use cases exist.
   - Rank now shows compact child-safe learning updates.

7. MATATAG/foundational competency mapping has generated traceability, but exact official codes are not yet supplied.
   - The curriculum is grade-specific and topic-based.
   - It now exposes competency code, source, and objective metadata.
   - Remaining fix: replace generated codes with exact official codes if a formal mapping table is provided.

8. Admin UI is still concentrated in one large route file.
   - It now has cleaner Overview, Create, Draft Studio, Test, Review, Published, Insights, Settings, and validator logic.
   - Fix: split into `components/admin/` and small admin routes/components for maintainability.

9. Firebase function prompt/version is locally aligned, but deployment is still required.
   - Firebase function now reports `2026-06-batibot-curriculum-intelligence-api-v4`.
   - Remaining fix: deploy Firebase functions.

10. Formal evaluation documents are added.
   - Chapter I requires evaluation of functionality, usability, learner engagement, reliability, and security.
   - Remaining fix: fill actual test results after device/user testing.

## Recommended Fix Order

1. Add a direct tap/open flow from the Play curated-content cue into the exact published Practice/Challenge activity.
2. Test structured reward application for curated content completion.
3. Split the admin screen into maintainable admin components.
4. Deploy Firebase functions so backend Gemini generation matches the local BatiBot curriculum contract.
5. Fill actual evaluation/test results after device testing.
6. Keep Rank as personal progress/standing unless a safe public leaderboard scope is approved later.
