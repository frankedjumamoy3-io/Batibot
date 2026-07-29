# BatiBot API Architecture Audit Report

Date: 2026-06-21

Project: BatiBot, a gamified mobile application for primary vocabulary and numeracy, progress tracking, and AI-assisted content curation.

## 1. Executive Summary

BatiBot has a strong API architecture direction, but the current implementation is a hybrid: many "API" responsibilities exist as TypeScript domain rules, client services, Firestore collections, and one secure Firebase Function for Gemini draft generation. This is enough for a capstone prototype and controlled admin workflow, but it is not yet a fully production-ready central intelligence API.

The best existing pieces are:
- A secure backend Gemini gateway in `firebase/functions/index.js`.
- A typed Curriculum Intelligence contract in `src/services/curriculumDraftApi.ts`.
- Rich curriculum/framework/cognitive metadata in `src/data/curriculum/learning-path.ts` and `src/domain/rules/curriculum-intelligence-api.ts`.
- Admin draft, validation, publish, report, learner analytics, progress, reward, and leaderboard service layers.
- Firestore rules with clear learner/admin boundaries for users, curated content, quiz attempts, and learning architecture collections.

The main gap is architectural placement. BatiBot knows many of the right rules, but too many are still enforced locally in the app rather than as server-owned engines. For production, the API should become the authoritative service boundary for curriculum, framework stages, validation, publishing, versioning, rollback, mobile preview, analytics aggregation, and learner-safe leaderboard data.

## 2. Current API Inventory

| Module | Purpose | Current Status | Used | Refactor Need |
|---|---|---:|---:|---:|
| `firebase/functions/index.js` | Secure Gemini quiz draft endpoint and draft validator | Partial backend API | Yes | High |
| `src/infrastructure/gemini/quiz-draft-client.ts` | Client caller for Firebase Function Gemini gateway | Implemented | Yes | Medium |
| `src/services/curriculumDraftApi.ts` | Builds BatiBot curriculum/framework/AI context contract | Strong app-side API contract | Yes | Medium |
| `src/domain/rules/curriculum-intelligence-api.ts` | Defines intended API modules, schemas, metadata, snapshots | Strong architecture model | Yes | Medium |
| `src/services/adminQuizService.ts` | Curated quiz CRUD, AI draft normalization, publish lifecycle | Implemented app-side service | Yes | High |
| `src/services/adminPlayContentService.ts` | Generate/validate Play content drafts | Implemented wrapper | Yes | Medium |
| `src/domain/rules/admin-publish-rules.ts` | Publish blockers for Play mapping, phase, assets, mobile preview, XP | Partial validator | Yes | High |
| `src/services/curatedQuizLearnerService.ts` | Reads published curated quizzes for learners | Implemented | Yes | Low |
| `src/services/learnerAnalyticsService.ts` | Writes quiz/practice/challenge attempts and reads analytics | Implemented | Yes | Medium |
| `src/services/learnerProgressService.ts` | Reads learner progress summaries for admin/reporting | Implemented | Yes | Medium |
| `src/services/leaderboardService.ts` | Reads rank data from users and builds local fallback | Implemented | Yes | High |
| `src/services/learningArchitectureService.ts` | Reads published curriculum/world/topic/stage/activity/reward architecture | Implemented | Partial | Medium |
| `src/services/batibotApiService.ts` | In-app simulated API for curriculum, stages, validation, preview, learner content | Partial/intended API | Partial | High |
| `src/data/repositories/learner-progress-repository.ts` | Local/cloud learner progress persistence | Implemented | Yes | Low |
| `src/services/userProfileService.ts` | User profile persistence | Implemented | Yes | Low |
| `src/services/authService.ts` | Auth/profile account service | Implemented | Yes | Low |
| `src/services/adminReportService.ts` | Admin reporting from progress/attempt data | Implemented | Yes | Medium |
| `src/services/adminAccessService.ts` | Admin role access checks | Implemented | Yes | Medium |
| `src/services/vocabularyService.ts` | Vocabulary CRUD/sync/read service | Implemented | Yes | Medium |
| `src/services/quizHintService.ts` | Quiz hint support | Implemented | Partial | Low |
| Firestore rules | Security boundary for users, content, analytics, learning architecture | Implemented | Yes | Medium |

## 3. Existing Modules

Current Firebase usage:
- Firebase Auth for identity.
- Firestore for users, learner progress, curated quizzes, vocabulary, quiz attempts, admin logs, curriculum levels, worlds, topics, stages, activities, challenges, rewards, badges, and achievements.
- Firebase Functions for secure Gemini generation.
- Firebase Storage appears configured for profile/media support through storage rules and profile image services.

Current Gemini integration:
- Secure Gemini calls go through `generateQuizDraft` Firebase Function.
- The function checks admin identity, builds constrained prompts, calls Gemini, parses JSON, reviews quality, and may attempt repair.
- The client-side `curriculumDraftApi` builds a much richer curriculum contract than the function fully enforces.

Current content generation flow:
Admin input -> app-side curriculum contract -> `adminQuizService.generateAIQuizDraft` -> Firebase Function -> Gemini -> function review -> app-side publish validation -> admin review/publish into `curatedQuizzes`.

Current learner flow:
Auth/profile -> grade curriculum in app data -> Play/Rank/Reward tabs -> published curated quiz subscriptions and local/static curriculum renderers -> local/cloud learner progress -> analytics attempts.

Current admin flow:
Admin screen supports quiz/draft creation, AI generation, review metadata, validation cues, publish/archive, reports, and monitoring. It is functional but still largely screen/service-driven rather than endpoint-driven.

## 4. Missing Modules

| Recommended Module | Status |
|---|---|
| Curriculum Engine | Partial |
| Framework Engine | Partial |
| Cognitive Rules Engine | Partial |
| World Engine | Partial |
| Topic Engine | Partial |
| Stage Engine | Partial |
| Activity Template Engine | Partial |
| AI Context Engine | Partial |
| Gemini Gateway | Exists |
| Validation Engine | Partial |
| Mobile Preview Engine | Partial/model only |
| Publishing Engine | Partial |
| Reward Engine | Partial |
| Progress Engine | Partial |
| Rank Engine | Partial |
| Analytics Engine | Partial |
| Audit Log Engine | Partial |
| Version Control Engine | Missing |

## 5. Curriculum Alignment Report

The curriculum model exists strongly in `learning-path.ts`. It includes grade routing, worlds, topics, activities, active learning phases, cognitive templates, world activity templates, and grade-specific content. The API can resolve curriculum context through `curriculumDraftApi.ts` and `batibotApiService.ts`.

Exists:
- Grade routing.
- World/topic routing.
- Curriculum metadata.
- Cognitive rules in app data.
- Progression concepts.

Partial:
- Topic unlock logic is split between Play screen, progress state, quiz unlock logic, and simulated API helpers.
- Curriculum expansion is not fully admin-created end to end.
- Firestore architecture exists, but the app still depends heavily on static curriculum files.

Missing:
- Server-owned curriculum resolver endpoint.
- Versioned curriculum snapshots.
- Curriculum migration and rollback.
- Admin-safe curriculum publishing pipeline for full world/topic/stage creation.

Curriculum score: 7/10.

## 6. Framework Alignment Report

The Active Learning Framework is represented in code:
- `Discover`, `Explore`, `Interact`, `Practice`, `Challenge`, `Reward`, `Progress`, `Mastery`.
- Stage labels are modeled in `curriculum-intelligence-api.ts` as LOOK, TAP, TRY, CHOOSE, PLAY, STAR, PROGRESS, MASTERED.
- Play now renders eight stages learner-side.
- Publish rules include phase checks and Practice/Challenge safety.

Partial:
- The backend Gemini function still generates quiz drafts rather than authoritative stage nodes.
- The framework engine does not yet guarantee one stored node per stage for every topic in Firestore.
- Stage validation is present but incomplete.

Missing:
- Server endpoint to auto-create all eight stages for every topic.
- Server-owned stage purpose enforcement.
- Server-owned stage metadata generation.
- Required audio/image/control validation per stage.

Framework score: 7/10.

## 7. Cognitive Alignment Report

The app has explicit cognitive templates:
- Preschool: visual/audio-first recognition.
- Kindergarten: symbols, letter sounds, oral language, early reading.
- Grade 1: words, simple sentences, basic math.
- Grade 2: relationships, problems, comprehension, place value, measurement, multiplication.
- Grade 3: context clues, fractions, division, money, multi-step solving.

The API understands cognitive level as metadata and prompt context, but it is not yet a complete server-side rule engine. It mostly stores or passes rules to Gemini rather than independently proving every generated item fits the grade.

Cognitive score: 7/10.

## 8. Admin Workflow Alignment Report

Expected workflow:
Create World -> Create Topic -> Generate Content -> Review -> Edit -> Validate -> Preview Mobile -> Publish.

Current support:
- Generate content: yes, for quiz/stage-like drafts.
- Review/edit: yes, in admin UI/service layer.
- Validate: partial, with publish issue checks and quality review.
- Publish: yes, for curated quizzes.
- Reports/analytics: partial.

Gaps:
- Full Create World/Create Topic admin workflow is modeled but not fully production endpoint-driven.
- Mobile preview status is required by validation, but automated preview validation is not implemented.
- Versioning, rollback, and draft lineage are missing.
- Publishing is not yet a strict server transaction that refuses invalid content in all cases.

Admin workflow score: 6.5/10.

## 9. Documentation Alignment Report

Chapter 1 objectives:

Objective 1, mobile application for curriculum-specific learning: supported. Curriculum is grade-specific and learner Play is aligned.

Objective 2, interactive learning activities and assessments: supported. Play stages, quizzes, practice/challenge analytics, and active renderers exist.

Objective 3, AI-assisted content curation: partially supported. Gemini draft generation is admin-only and backend-routed, but the API should own more validation and publishing governance.

Objective 4, functionality/usability/engagement/security evaluation: partially supported. Analytics, reports, rewards, Rank, validation, and rules exist, but mobile preview automation, audit trails, versioning, and rollback need expansion.

Documentation alignment score: 8/10.

## 10. Security Audit

Strengths:
- Gemini API key is server-side in Firebase Functions secret.
- Firestore rules separate learner-owned data and admin-owned content.
- Admin writes require approved admin role/email.
- Learner quiz attempts cannot be updated/deleted.
- Test/excluded accounts are filtered in analytics/leaderboard paths.

Risks:
- `users` collection reads are owner/admin only, while leaderboard service reads `users`; a real learner global leaderboard will fail under current rules unless moved to a sanitized public/level-scoped leaderboard collection or callable function.
- Some service rules are app-side only, so a malicious client could bypass local validation unless Firestore rules/functions enforce the same constraints.
- Admin approval still allows broad content writes to collections without schema validation in rules.
- No content versioning or rollback guard.
- No moderation queue for unsafe generated content beyond validators.

Security score: 7/10.

## 11. Production Readiness Score

| Area | Score |
|---|---:|
| Architecture | 7.0/10 |
| Curriculum | 7.0/10 |
| Framework | 7.0/10 |
| AI Integration | 7.5/10 |
| Admin Workflow | 6.5/10 |
| Scalability | 6.5/10 |
| Documentation Alignment | 8.0/10 |
| Production Readiness | 6.8/10 |

Overall: 7/10.

This is a strong capstone architecture with a credible AI governance direction. It is not yet a fully production-hardened API because key engines are app-side or documented rather than server-owned.

## 12. Recommended API Architecture

Production API should be organized as:

1. Auth/Profile API
2. Curriculum Engine
3. World Engine
4. Topic Engine
5. Framework/Stage Engine
6. Cognitive Rules Engine
7. Activity Template Engine
8. AI Context Engine
9. Gemini Gateway
10. Draft Management Engine
11. Validation Engine
12. Mobile Preview Engine
13. Publishing Engine
14. Learner Content API
15. Progress Engine
16. Reward/Gamification Engine
17. Rank Engine
18. Analytics Engine
19. Audit Log Engine
20. Version Control/Rollback Engine

Core rule:
BatiBot owns curriculum, framework, UI metadata, validation, and publishing. Gemini only returns drafts.

## 13. Recommended Firestore Structure

Recommended production collections:

```text
users/{uid}
users/{uid}/progress/{progressId}
curriculumVersions/{versionId}
curriculumLevels/{levelId}
worlds/{worldId}
topics/{topicId}
stageNodes/{stageNodeId}
activityTemplates/{templateId}
cognitiveRules/{gradeId}
frameworkRules/{stageId}
aiDrafts/{draftId}
publishedContent/{contentId}
validationResults/{resultId}
mobilePreviewResults/{previewId}
publishEvents/{eventId}
contentVersions/{versionId}
rollbackPlans/{rollbackId}
quizAttempts/{attemptId}
learnerStageAttempts/{attemptId}
leaderboards/{scopeId}/entries/{uid}
rewards/{rewardId}
badges/{badgeId}
achievements/{achievementId}
adminActivityLogs/{logId}
moderationEvents/{eventId}
reports/{reportId}
```

Important change:
Do not build learner leaderboard directly from private `users` reads. Write sanitized rank snapshots to `leaderboards/global/entries/{uid}` and `leaderboards/levels/{levelId}/entries/{uid}`, or expose rank through a callable/HTTPS function.

## 14. Recommended Service Structure

```text
src/api/client/
  learnerContentApi.ts
  progressApi.ts
  rankApi.ts
  rewardApi.ts
  adminContentApi.ts

src/domain/engines/
  curriculum-engine.ts
  framework-engine.ts
  cognitive-rules-engine.ts
  activity-template-engine.ts
  validation-engine.ts
  publishing-engine.ts
  reward-engine.ts
  rank-engine.ts

firebase/functions/src/
  auth/
  curriculum/
  ai-context/
  gemini-gateway/
  validation/
  publishing/
  learner-progress/
  leaderboard/
  analytics/
  audit-log/
```

Use shared domain packages where possible, but make production enforcement happen on the server side.

## 15. Priority Fix List

P0:
- Move publish validation into a Firebase Function or callable endpoint.
- Add sanitized leaderboard snapshots or a leaderboard function.
- Add server-side schema validation for curated content, stages, and AI drafts.
- Add content versioning and rollback.

P1:
- Implement server-owned Curriculum Engine and Framework Engine endpoints.
- Add stage-node creation that guarantees all eight stages.
- Add mobile preview validation records per device preset.
- Add audit logs for generation, validation, publish, archive, and rollback.

P2:
- Move cognitive rules into server-readable versioned configuration.
- Add analytics aggregation jobs for admin reports.
- Add moderation states for unsafe or off-curriculum AI drafts.
- Add curriculum version migration tooling.

## Final Answer

If BatiBot were submitted as a capstone today, the API architecture is coherent and defensible: it demonstrates secure AI-assisted curation, curriculum-aware metadata, learner progress, admin validation, and Firebase-backed persistence.

If BatiBot were deployed to real learners, the next step is to convert the architecture from an app-side intelligence model into a server-owned Curriculum Intelligence API. The essential additions are server-side curriculum/framework/cognitive engines, stage-node governance, publish validation, mobile preview validation, sanitized leaderboard snapshots, analytics aggregation, audit logs, content versioning, rollback support, and moderation workflows.
