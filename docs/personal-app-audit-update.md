# BatiBot Personal App Audit Update

This audit assumes BatiBot is a personal mobile learning app. It is not a parent-managed, teacher-managed, or school-managed platform. Learners can enter the app with a local profile using only a name, grade level, and optional buddy. Email/password access is reserved for app-owner administrator tools.

## Corrected Product Assumptions

1. Email-free learner login is intentional.
   - Learners should not need an email account to start.
   - The current local learner session model supports the intended child-friendly flow.
   - Future work should protect and clarify local progress rather than replacing this with mandatory learner email accounts.
   - Status: strengthened. Local learner identity now uses a generated profile ID, while name remains display copy only.

2. Parent and teacher management is out of scope.
   - The app should not promise parent dashboards, teacher dashboards, classroom management, or school-linked progress.
   - Curriculum topics can still include words such as teacher, school, class, mother, and father when those are learning content.
   - Product, policy, and UI copy should not describe parents or teachers as app users unless that role is intentionally added later.

3. Admin means app owner or content curator.
   - Admin access is for quiz curation, AI draft review, publication, reports, and deployment-sensitive workflows.
   - Admin login can use Firebase Auth because it is separate from the learner path.
   - Learner entry should remain simpler than admin entry.

4. Local progress is acceptable for the current product.
   - The main tradeoff is limited cross-device sync, not a broken login model.
   - A future optional export, backup, or sync feature can be added without requiring learner email accounts.

5. Grade-specific curriculum separation is required.
   - The learner's selected grade level should act as the curriculum module selector.
   - A Preschool learner should see Preschool worlds, activities, quiz presets, copy density, and rewards.
   - Kindergarten, Grade 1, Grade 2, and Grade 3 learners should each see their own module instead of a mixed curriculum list.
   - Changing grade level should clearly switch to a different module path rather than silently merging progress.

6. Gemini is guided by the BatiBot curriculum contract.
   - AI draft generation should not depend only on a free-form admin prompt.
   - BatiBot now has a service contract that contains preset curriculum rules, UI/UX formats, active learning phases, question types, cognitive-level limits, prompt modules, and validation schemas.
   - Gemini should generate drafts inside that contract, then admin review should remain required before publication.

## Critical Fixes

1. Admin security rules are inconsistent.
   - UI requires admin role plus approved email.
   - Firestore rules allow either `admin@batibot.app` or any user document with `role == "admin"`.
   - Fix: use one app-owner admin authorization model across client, Firestore rules, Storage rules, and Cloud Functions. Custom claims or a backend-controlled allowlist are preferred.

2. Hardcoded admin email exists in multiple layers.
   - Found in client config, Firestore rules, Storage rules, and the Firebase Function fallback.
   - Fix: keep a development fallback only if clearly documented, then use environment configuration or custom claims for production.

3. Learner local-session behavior needs clearer product boundaries.
   - This is not a defect; it is the intended personal-app model.
   - Risk: progress is tied to the device/local profile.
   - Status: partially fixed. Local profiles now keep generated IDs and same-name learners can choose the correct saved profile. Continue documenting reset behavior and optional future sync/export plans.

4. AI draft endpoint allows broad CORS.
   - Function sets `Access-Control-Allow-Origin: *`.
   - Admin token checks help, but production should still restrict accepted origins where practical.
   - Fix: restrict CORS to approved app domains and expected clients.

5. AI fallback draft can mask network failure.
   - `generateQuizDraftWithGemini` falls back to local draft generation on fetch failure.
   - Useful for admin productivity, risky if it feels equivalent to an AI-reviewed draft.
   - Fix: label fallback drafts clearly and require review before publishing.

## High-Priority UI / UX Fixes

1. Rank does not match product objective.
   - Previous Rank was mostly a practice-leaderboard pattern with placeholder players.
   - For a personal app, Rank should focus on the learner's level, XP, streak, stars, completed worlds, and progress.
   - Status: fixed. Rank now uses a personal progress dashboard with level, XP, stars, streak, worlds, words, quizzes, and next goal.

2. Rank placeholder names feel unfinished.
   - Previous placeholder practice names looked like test data.
   - Status: fixed. Placeholder leaderboard rows were removed.

3. Reward grid may feel too generic.
   - Fallback cards are generated to fill six slots.
   - Status: fixed. Reward now shows real badge and achievement definitions only.

4. Play topic list has overlap risk.
   - Topic icons are absolutely positioned with negative top offsets over 66px buttons.
   - Long Grade 2/3 topic names can collide with icons or status badges.
   - Fix: add reserved icon gutters, dynamic text sizing, and screenshot checks for long topic names.

5. Play lesson cards use many fixed heights.
   - Fixed cards preserve the game-board look but risk clipping on short screens or large-text mode.
   - Fix: add compact layouts for short screens and verify large text settings.

6. Instruction rows may clip long prompts.
   - Some instruction rows have strict max heights.
   - Fix: allow two-line wrapping or shorten prompt copy by grade/topic.

7. Bottom nav needs narrow-phone screenshot QA.
   - Center Play tab is wide, side tabs are fixed-width.
   - Fix: test 320px and 360px widths and tune track padding if crowding appears.

8. Reward detail uses regular header/card language.
   - Functional, but less playful than Play and Reward.
   - Fix: align detail screens with Reward tab art, simpler copy, and larger child-friendly status visuals.

## Learning / Content Fixes

1. Grade module routing needs continued enforcement.
   - The app already stores learner grade level, but the product requirement should be explicit: grade controls curriculum visibility.
   - Status: partially fixed. Play, hidden Quiz, Vocabulary lookups, Reward summaries, Word of Day, floating helper totals, and Rank now use shared grade-scoped learner content. Admin draft generation now uses the BatiBot curriculum contract; published curated content still needs richer native Play rendering.

2. Curriculum progress can mix if grade changes are not handled clearly.
   - A learner switching from Preschool to Grade 1 should not automatically merge unrelated topic progress.
   - Fix: store progress with grade/module identifiers and explain grade switching behavior in settings.

3. Lesson node rules are too simple.
   - `lesson-node-rules.ts` currently returns one node for every stage.
   - Play state still has arrays for up to three challenge/interact nodes.
   - Fix: either implement real node counts by phase/world/topic or simplify state to one node everywhere.

4. Upper grades are less activity-rich than Preschool.
   - Preschool has richer concrete asset logic.
   - Grade 2/3 topics often depend on generic progressive copy.
   - Fix: add specialized renderers for context clues, story comprehension, money, fractions, multiplication, and multi-step math.

5. Challenge contract needs stronger enforcement in Play.
   - Challenge should avoid introducing new content.
   - Fix: constrain challenge choices to current topic plus previously mastered topics.

6. Cognitive level exists in data but is not always visible in UI.
   - Grade templates are strong, but screen behavior does not always change enough by grade.
   - Fix: map each grade template to layout density, reading length, hint style, and interaction type.

7. Stage labels may be abstract for young learners.
   - Observe, Recognize, and Apply are useful internal design labels.
   - Status: partially fixed. Play foregrounds simpler child-facing phase labels such as Look, Tap, Choose, Match, Try, Star, Progress, and Mastered.

8. AI draft generation needs continued BatiBot contract hardening.
   - Current admin generation uses a curriculum contract, prompt modules, and validator metadata, but shared prompt logic still exists in both the client service and Cloud Function.
   - Fix: keep the BatiBot curriculum API as the source of truth, reduce duplicated prompt logic, and deploy the updated Firebase function whenever prompt modules change.

## Frontend / Code Quality Fixes

1. `play.tsx` is too large.
   - It contains lesson logic, renderers, styles, speech, counting, patterns, and progression.
   - Fix: split into `PlayMap`, `TopicMenu`, `LessonShell`, phase renderers, and lesson helpers.

2. Duplicated quiz-generation logic.
   - AI prompt and quality logic exists in both frontend service code and Cloud Function code.
   - Fix: centralize shared validation contracts through the BatiBot curriculum API or generated shared schema/types.

3. Silent catches hide failure details.
   - Several services catch and continue.
   - Fix: keep graceful learner UX, but add structured diagnostics for admin/debug builds.

4. Some hidden routes still export.
   - `/home`, `/progress`, and `/badges` remain for deep links.
   - Fix: keep as legacy aliases if needed and document or redirect them.

5. No automated UI layout tests.
   - Build/export passes, but overlap and clipping need visual proof.
   - Fix: add screenshot QA for Play, Rank, Reward, auth, topic menu, and lesson cards at small mobile widths.

## Recommended Fix Order

1. Align admin authorization across client, Firestore, Storage, and Cloud Functions.
2. Design the BatiBot curriculum API contract for admin AI draft generation.
3. Extend grade/module tags into reward eligibility and curated quiz publication.
4. Run Play topic/menu and lesson-card responsive QA.
5. Decide whether lesson stages use one node or multiple nodes and align code accordingly.
6. Add richer upper-grade lesson renderers.
7. Add safeguards and labels for AI fallback drafts.
8. Document hidden route aliases and local learner profile behavior.
