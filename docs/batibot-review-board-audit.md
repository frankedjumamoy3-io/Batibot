# BatiBot Review Board Audit

Date: 2026-06-21

Scope: Full multi-role review of the current BatiBot learner app, API architecture, curriculum design, Firebase model, AI-assisted admin workflow, and capstone defensibility.

## Executive Verdict

BatiBot is a strong capstone-grade system with a clear product identity: a mobile-first, grade-aware, child-friendly learning app centered on Rank, Play, and Reward. The review board would approve the direction, the curriculum-specific Play map, the Active Learning Framework, the secure Gemini boundary, and the progress/reward foundation.

The board would not yet declare it fully production-ready. The largest blockers are backend governance, real device QA, leaderboard child-safety and Firestore design, server-side publish validation, Grade 2/3 activity depth, and consistency between documentation and implemented product scope.

Overall review-board readiness: 7.2/10.

## What The Board Would Approve

- Three-tab learner navigation: Rank, Play, Reward.
- Grade-specific curriculum worlds from Preschool through Grade 3.
- Eight-stage Active Learning Framework: LOOK, TAP, TRY, CHOOSE, PLAY, STAR, PROGRESS, MASTERED.
- Child-friendly Play map direction with large visual world nodes.
- Explicit learner progress and topic mastery data model.
- Admin-only Gemini generation through a backend function.
- BatiBot-owned curriculum contract before Gemini draft generation.
- Firestore rules that separate learner-owned data from admin-owned content.
- Reward, XP, streak, badge, and achievement foundation.
- Chapter 1 alignment at the concept and feature level.

## What The Board Would Reject For Production

- Treating app-side TypeScript validation as sufficient production governance.
- Reading private `users` documents directly for a learner leaderboard.
- Shipping public or pseudo-public leaderboard behavior without a child-safety policy.
- Claiming complete mobile QA without emulator/physical-device evidence.
- Claiming fully interactive Grade 2/3 cognitive renderers when some are still template-based choice activities.
- Publishing AI-generated content without server-side schema and curriculum validation.
- Shipping without content versioning, rollback, and audit logs for publish decisions.

## Issues Found

### Issue 1

Role: Software Architect

Issue: The Play surface is highly centralized in `app/(tabs)/play.tsx`, with stage logic, curriculum rendering, speech handling, challenge state, analytics, and many activity renderers in one large file.

Severity: High

Affected learner level: All levels

Affected world/topic: All Play worlds and topics

Why it matters: A monolithic learner screen increases regression risk, slows future curriculum expansion, and makes Grade 2/3 renderer changes harder to test.

Recommended fix: Split Play into feature modules: `play-map`, `topic-menu`, `stage-shell`, `early-renderers`, `advanced-renderers`, `speech-controls`, `stage-progress`, and `play-analytics`.

### Issue 2

Role: Mobile Application Architect

Issue: Mobile responsiveness is asserted by layout constraints, but there is no captured evidence from Android Small, Android Medium, Android Large, and Tablet runs.

Severity: High

Affected learner level: All levels

Affected world/topic: All screens, especially Play lesson cards, Rank leaderboard rows, Reward tiles, and Grade 3 long-topic activities

Why it matters: Low-end Android devices are the most likely deployment target. Text overflow, large images, and nested state-heavy screens can fail only on real/emulated devices.

Recommended fix: Add Expo/Playwright or manual QA artifacts with screenshots for four target viewports and document pass/fail in `docs/mobile-qa-report.md`.

### Issue 3

Role: UX Design Lead

Issue: Rank behavior is inconsistent across documentation and implementation. Some docs define Rank as personal standing only, while current Rank includes global and level leaderboard scopes.

Severity: Critical

Affected learner level: All levels

Affected world/topic: Rank tab

Why it matters: Children can be discouraged by public ranking. A capstone panel will ask whether leaderboard behavior is intentional, safe, and aligned with the personal learner app scope.

Recommended fix: Decide product scope. Either revert Rank to personal progress/standing or implement a child-safe leaderboard policy with anonymized names, opt-out, grade-only ranking, and sanitized leaderboard snapshots.

### Issue 4

Role: Child Learning Specialist

Issue: Grade 2 and Grade 3 advanced activities now have curriculum-specific templates, but several still resolve to choice grids rather than deep interactive manipulation.

Severity: High

Affected learner level: Grade 2, Grade 3

Affected world/topic: Place Value City, Multiplication Workshop, Fraction Fortress, Division Kingdom, Money Market, Number Empire

Why it matters: Older learners need meaningful cognitive actions such as grouping, partitioning, equal sharing, making change, and multi-step work. Choice grids alone can underrepresent those competencies.

Recommended fix: Convert advanced templates into true manipulatives: place-value columns, draggable equal groups, tappable fraction partitions, equal-sharing animation, coin/bill composer, and step-by-step math workspace.

### Issue 5

Role: Early Childhood Education Specialist

Issue: Preschool and Kindergarten are generally visual/audio-first, but speech recognition availability can fail and currently falls back to accepting tap completion.

Severity: Medium

Affected learner level: Preschool, Kindergarten

Affected world/topic: Speech-related Interact and Challenge stages

Why it matters: If speech is part of the learning claim, fallback completion can overstate oral-language mastery.

Recommended fix: Track speech fallback separately from successful speech, and show mastery as "speech skipped" until a supported oral activity is completed.

### Issue 6

Role: Elementary Education Specialist

Issue: Grade 1 is less explicitly upgraded than Grade 2/3. It remains mostly word/simple sentence oriented, with fewer specialized renderers for nouns, sentences, time, shapes, addition, and subtraction.

Severity: Medium

Affected learner level: Grade 1

Affected world/topic: Word Kingdom, Reading Quest, Math Mountain, Time Town, Shape Adventure

Why it matters: Grade 1 is the bridge between recognition and formal elementary skills. It needs visible sentence-building, time-reading, shape classification, and basic operation activities.

Recommended fix: Add Grade 1 renderer variants for sentence building, noun/verb sorting, clock matching, shape property sorting, addition counters, and subtraction take-away tasks.

### Issue 7

Role: Curriculum Specialist

Issue: Curriculum sequencing exists in static data, but server-side curriculum versioning and migration are missing.

Severity: High

Affected learner level: All levels

Affected world/topic: All curriculum worlds and topics

Why it matters: Once learners have saved progress, changing world/topic order can corrupt unlock assumptions or make mastered topics point to changed content.

Recommended fix: Add `curriculumVersions`, store each learner's active curriculum version, and create migration rules for renamed worlds/topics/stages.

### Issue 8

Role: Active Learning Specialist

Issue: The eight stages are now represented, but not every topic has a server-owned stored node for each stage.

Severity: High

Affected learner level: All levels

Affected world/topic: All Firestore-published curriculum topics

Why it matters: The framework is strongest when every topic has explicit LOOK/TAP/TRY/CHOOSE/PLAY/STAR/PROGRESS/MASTERED content and validation status.

Recommended fix: Add a server-side Stage Engine that auto-creates and validates one stage-node document per stage for each topic before publish.

### Issue 9

Role: Gamification Designer

Issue: XP, stars, badges, rewards, mastery, and leaderboard ranking are all active, but reward balance is not yet governed by a central tuning model.

Severity: Medium

Affected learner level: All levels

Affected world/topic: Rank and Reward surfaces, all Play topics

Why it matters: Without reward tuning, learners can experience reward fatigue, unfair ranking, or inflated XP from repeated stage completion.

Recommended fix: Create a `rewardRules` engine with per-stage XP caps, repeat-reward rules, streak limits, mastery bonuses, and grade-scoped badge paths.

### Issue 10

Role: UI Design Specialist

Issue: Grade 1-3 per-topic illustrations are missing. The app falls back to exact world art, which is safer than unrelated generic images but still incomplete.

Severity: Medium

Affected learner level: Grade 1, Grade 2, Grade 3

Affected world/topic: All upper-grade topics without dedicated topic assets

Why it matters: Visual specificity helps children understand context clues, money, fractions, place value, measurement, and story elements.

Recommended fix: Add `TOPIC_IMAGES` assets for high-value upper-grade concepts: fractions, division, money, measurement, context clues, story characters, place value, and multi-step solving.

### Issue 11

Role: Accessibility Specialist

Issue: Audio support is present in Play, but accessibility is not yet fully audited for non-readers, motor support, screen readers, or reduced-motion needs.

Severity: High

Affected learner level: All levels, especially Preschool and Kindergarten

Affected world/topic: All Play stages, auth/profile setup, Rank, Reward

Why it matters: Child learners may be non-readers, have limited fine motor control, or need repeated audio cues.

Recommended fix: Add accessibility acceptance criteria: every instruction has audio, every tap target is at least 44px, all icon-only controls have labels, animations respect reduced motion, and non-reader flows are testable.

### Issue 12

Role: QA Test Engineer

Issue: Stage completion and mastery are now explicit, but duplicate writes, interrupted stage transitions, offline sync, and reset/sign-out edge cases need tests.

Severity: High

Affected learner level: All levels

Affected world/topic: All Play topics

Why it matters: Incorrect progression is one of the most damaging learner-facing bugs. A learner may unlock too early, fail to unlock, or lose mastery.

Recommended fix: Add unit tests for `progress-actions.ts`, integration tests for Play stage transitions, and manual QA cases for offline play, repeated reward claim, reset progress, and sign-out.

### Issue 13

Role: Firebase Engineer

Issue: The leaderboard service reads from `users`, but Firestore rules allow learner reads only for self or admins.

Severity: Critical

Affected learner level: All levels

Affected world/topic: Rank tab

Why it matters: Global/level leaderboard reads will fail for normal learners or require unsafe rule expansion.

Recommended fix: Use a callable/HTTPS leaderboard endpoint or write sanitized `leaderboards/{scope}/entries/{uid}` docs with display name policy, grade scope, stars, XP, and exclusion flags.

### Issue 14

Role: AI Content Curation Specialist

Issue: Gemini is correctly behind a backend function, but publish validation remains partly app-side and not a guaranteed server transaction.

Severity: Critical

Affected learner level: All levels

Affected world/topic: Admin-generated curated quizzes and Play content

Why it matters: A client-side admin screen can be bypassed. Unsafe, off-curriculum, or incorrectly mapped AI content must be blocked by the backend.

Recommended fix: Move publish validation into Firebase Functions. Require validation status, mobile preview status, schema validity, asset mapping, and admin audit log before `published`.

### Issue 15

Role: Capstone Panel Reviewer

Issue: The README and audit docs present some features as completed that are actually partial, such as production-ready API engines, mobile QA, and upper-grade specialized cognitive activities.

Severity: High

Affected learner level: All levels

Affected world/topic: Documentation and defense narrative

Why it matters: Capstone panels focus on the gap between claims and implementation. Overclaiming can weaken the final defense.

Recommended fix: Reword documentation into three statuses: implemented, partially implemented, and recommended next phase. Keep production claims conservative.

### Issue 16

Role: Software Architect

Issue: API intelligence is modeled well, but many engines are not backend-owned modules.

Severity: High

Affected learner level: All levels

Affected world/topic: Admin workflow, learner content delivery, progress, Rank, Reward

Why it matters: Production systems need enforcement at the service boundary, not only in React Native/client code.

Recommended fix: Prioritize server-owned Curriculum Engine, Framework Engine, Validation Engine, Publishing Engine, Progress Engine, Rank Engine, Analytics Engine, Audit Log Engine, and Version Control Engine.

## Role-by-Role Board Decision

| Role | Approve | Question | Require Before Production |
|---|---|---|---|
| Software Architect | Product structure and domain direction | Large Play module, app-side engines | Backend-owned engines, module split, tests |
| Mobile Application Architect | Expo/React Native fit | Low-end Android evidence | Device QA and render/performance checks |
| UX Design Lead | Three-tab child journey | Leaderboard scope | Decide safe Rank model |
| Child Learning Specialist | Grade-aware progression | Advanced task depth | More manipulative Grade 2/3 activities |
| Early Childhood Specialist | Visual/audio-first early grades | Speech fallback | Track oral completion separately |
| Elementary Specialist | Grade 2/3 curriculum targets | Grade 1 depth | Grade 1 specialized activities |
| Curriculum Specialist | Organized worlds/topics | Versioning | Curriculum versions and migrations |
| Active Learning Specialist | Official 8-stage framework | Server stage nodes | Stage Engine with validation |
| Gamification Designer | Stars/XP/badges foundation | Balance and fatigue | Reward tuning rules |
| UI Design Specialist | Child-friendly visual direction | Missing topic assets | Upper-grade topic illustrations |
| Accessibility Specialist | Speaker controls and large UI direction | Non-reader full coverage | Accessibility QA checklist |
| QA Test Engineer | Typecheck/lint baseline | Edge-case coverage | Progress/play/admin tests |
| Firebase Engineer | Auth/rules foundation | Leaderboard read model | Sanitized leaderboard or function |
| AI Curation Specialist | Secure Gemini gateway | Publish bypass risk | Server-side publish validation |
| Capstone Panel Reviewer | Strong objective alignment | Overclaiming readiness | Conservative docs and demo proof |

## Scoring

| Area | Score |
|---|---:|
| System Architecture | 7.0/10 |
| Mobile Architecture | 7.0/10 |
| UX and Child Usability | 8.0/10 |
| Early Childhood Fit | 8.0/10 |
| Elementary Learning Fit | 7.0/10 |
| Curriculum Alignment | 7.5/10 |
| Active Learning Alignment | 7.5/10 |
| Gamification | 7.0/10 |
| UI and Accessibility | 7.0/10 |
| QA Readiness | 6.0/10 |
| Firebase Readiness | 6.5/10 |
| AI Governance | 7.0/10 |
| Capstone Defensibility | 8.0/10 |
| Production Readiness | 6.8/10 |

## Final Board Answer

If evaluated by software architects, curriculum experts, child learning specialists, Firebase engineers, UX designers, and capstone panel members, BatiBot would be approved as a strong capstone system and a credible prototype for curriculum-specific active learning.

It would be questioned on production claims, public leaderboard safety, backend governance, real mobile QA evidence, upper-grade activity depth, and documentation consistency.

It would be required to add backend-owned validation/publishing, sanitized leaderboard architecture, curriculum versioning, rollback, mobile preview evidence, stronger accessibility QA, and more concrete Grade 1-3 manipulatives before being declared production-ready and fully curriculum-aligned.
