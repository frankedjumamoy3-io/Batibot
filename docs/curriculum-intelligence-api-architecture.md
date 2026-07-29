# BatiBot Curriculum Intelligence API Architecture

## Position

BatiBot API should not be treated as a plain CRUD API.

CRUD endpoints can store data, but they do not protect curriculum quality. BatiBot needs a Curriculum Intelligence API that sits between Admin and Gemini, resolves curriculum rules, validates output, and connects published content to learner Play, Rank, and Reward outcomes.

Official workflow:

```text
Admin
-> BatiBot Curriculum Intelligence API
-> Gemini API
-> Draft Validator
-> Admin Review
-> Published Play Content
```

Avoid this old workflow:

```text
Admin
-> Gemini
-> Quiz
```

## Core API Modules

### 1. Curriculum Service

Owns grade curriculum structure.

Examples:

```text
Preschool
- My Family World
- My Body World
- My Colorful World
```

```text
Kindergarten
- Alphabet Island
- School World
- Community Village
```

```text
Grade 1
- Word Kingdom
- Reading Quest
- Math Mountain
```

Example endpoints:

```http
GET /curriculum/levels
GET /curriculum/worlds
GET /curriculum/topics
```

Current source:

- `src/data/curriculum/learning-path.ts`
- `src/services/curriculumDraftApi.ts`

### 2. Active Learning Framework Service

Owns the phase rules:

```text
Discover -> Explore -> Interact -> Practice -> Challenge -> Reward -> Progress -> Mastery
```

Example endpoints:

```http
GET /framework/stages
GET /framework/rules
```

Current source:

- `src/domain/rules/gemini-draft-rules.ts`
- `src/domain/rules/lesson-stage-rules.ts`

### 3. Learning Template Service

Returns reusable stage templates for a grade/topic.

Example:

```text
Preschool + Mother

Discover: Show Mother.
Explore: Tap Mother.
Interact: Match Mother.
Practice: Choose Mother.
Challenge: Find Mother.
```

Example endpoints:

```http
GET /templates/preschool
GET /templates/kindergarten
GET /templates/grade1
```

Current source:

- `WORLD_ACTIVITY_TEMPLATES` in `src/data/curriculum/learning-path.ts`

### 4. Cognitive Rules Engine

Constrains the task by age and grade.

Preschool allowed:

- tap
- match
- count
- identify

Preschool blocked:

- paragraph reading
- essay tasks
- complex problem solving

Grade 3 allowed:

- context clues
- fractions
- word problems
- multi-step reasoning

Example endpoints:

```http
GET /cognitive-rules/preschool
GET /cognitive-rules/grade3
```

Current source:

- `GRADE_COGNITIVE_TEMPLATES` in `src/data/curriculum/learning-path.ts`

### 5. AI Context Builder

Builds the Gemini-ready contract from admin choices.

Admin selects:

```text
Grade
World
Topic
Phase
Node
Asset
Reward mapping
```

Example endpoint:

```http
POST /ai/context
```

Current source:

- `buildBatiBotCurriculumDraftApiContract` in `src/services/curriculumDraftApi.ts`

### 6. Gemini Generator Service

Sends the constrained draft request to Gemini.

Example endpoint:

```http
POST /ai/generate
```

Rules:

- backend only
- no client secrets
- no direct learner-facing generation
- JSON-only draft output

Current source:

- `firebase/functions/index.js`
- `src/infrastructure/gemini/quiz-draft-client.ts`

### 7. Draft Validator

Checks if Gemini output follows BatiBot rules.

Bad for Preschool:

```text
Read this paragraph.
```

Good for Preschool:

```text
Tap Mother.
```

Validator checks:

- age suitability
- curriculum alignment
- framework alignment
- Practice safety
- Challenge safety
- difficulty level
- content format
- mobile preview
- asset match
- reward and unlock path

Example endpoint:

```http
POST /validation/draft
```

Current source:

- `src/domain/rules/admin-publish-rules.ts`
- `validateAdminPlayContentForPublish`

### 8. Draft Management

Owns content lifecycle states:

```text
Draft
Review
Needs Fix
Published
Archived
```

Example endpoints:

```http
POST /drafts
GET /drafts
PATCH /drafts
```

Current source:

- `src/services/adminQuizService.ts`
- `app/(admin)/index.tsx`

### 9. Content Publishing

Publishes validated content only to its mapped learner destination.

Example endpoint:

```http
POST /publish
```

Required learner destination:

```text
Play > Grade > World > Topic > Phase > Node
```

Current source:

- `publishQuiz`
- `curatedQuizLearnerService`

### 10. Learner Services

Includes:

- User Profiles
- Progress Tracking
- Gamification
- Ranking

Important product adjustment:

The current Rank tab should behave as personal progress and standing, not a public child leaderboard. A public leaderboard should only be added later if it becomes an approved product scope with child-safety rules.

Example endpoints:

```http
GET /users
GET /progress
POST /progress
GET /rewards
GET /badges
GET /rank
```

### 11. Admin Monitoring

Tracks:

- most played world
- completion rate
- drop-off by phase
- content coverage
- difficulty health
- learner progress
- reward health
- publishing blockers

Example endpoint:

```http
GET /analytics
```

## Minimum API Data

BatiBot should store or resolve:

```text
Levels
Worlds
Topics
Framework Rules
Learning Templates
Cognitive Rules
Users
Progress
XP
Stars
Badges
Achievements
Drafts
Published Content
Analytics
```

## Production Metadata Source

The production metadata source is now implemented in:

- `src/domain/rules/curriculum-intelligence-api.ts`
- `src/services/curriculumDraftApi.ts`

The domain file defines typed schemas for:

- complete curriculum level metadata for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3
- learning world lists and grade-specific blocked formats
- Active Learning Framework metadata for Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery
- one-node-per-stage Play path behavior
- curriculum-specific UI/UX rules for font scale, button size, audio behavior, animation, theme behavior, and accessibility
- Rank metadata based on stars and personal progress
- Reward metadata for badges, progress badges, achievements, stars, and unlockables
- gamification metadata for XP, stars, levels, badges, achievements, streaks, and unlockables
- progression metadata for unlock, mastery, topic completion, world completion, and level completion
- AI content curation metadata for AI context building, prompt building, draft validation, content approval, and publishing
- admin monitoring metadata for learner monitoring, progress monitoring, content monitoring, publishing monitoring, analytics, reports, and validation logs
- Firestore collection schemas and required fields
- recommended folder structure
- production boundaries for secure AI calls, learner visibility, review gates, and scalability

The draft contract now includes a `curriculumContract.ecosystem.snapshot` object. This lets the BatiBot API send Gemini a constrained contract that includes curriculum, UI/UX, progression, gamification, monitoring, validation, publishing, and Firestore structure expectations.

## TypeScript Interfaces

Primary interfaces:

- `BatiBotCurriculumIntelligenceService`
- `BatiBotCurriculumLevelMetadata`
- `BatiBotActiveLearningStageMetadata`
- `BatiBotCurriculumUiMetadata`
- `BatiBotFirestoreCollectionSchema`
- `BatiBotCurriculumIntelligenceSnapshot`
- `BatiBotCurriculumDraftApiContract`

Primary helpers:

- `getBatiBotCurriculumLevelMetadata(gradeLevel)`
- `getBatiBotUiUxMetadata(gradeLevel)`
- `buildBatiBotCurriculumIntelligenceSnapshot(gradeLevel)`
- `buildBatiBotCurriculumDraftApiContract(input)`
- `buildBatiBotCurriculumPromptSection(contract)`

## Firestore Collections Structure

Recommended collections:

- `curriculumLevels/{gradeLevel}`
- `curriculumWorlds/{worldId}`
- `curriculumTopics/{topicId}`
- `activeLearningRules/{phase}`
- `curatedPlayContent/{contentId}`
- `aiDraftRequests/{requestId}`
- `validationLogs/{logId}`
- `users/{uid}`
- `learnerProgress/{uid}`
- `adminMonitoring/{eventId}`

Each collection schema defines purpose, owner, read scope, write scope, and required fields in `BATIBOT_FIRESTORE_COLLECTIONS`.

## Validation Rules

Validation now covers:

- learner safety
- JSON-only AI draft output
- admin review checklist
- one selected Active Learning phase
- Practice known-content repetition
- Challenge known-content-only behavior
- mobile preview
- asset mapping
- reward and unlock fit
- grade, world, topic, phase, and node mapping

## Production Boundaries

The API must keep these boundaries:

- BatiBot remains the source of truth.
- Gemini is a backend-only draft assistant.
- Learners only receive published content for their assigned grade and mapped Play destination.
- AI output never publishes directly.
- Admin review and validator gates are mandatory.
- Metadata is structured by grade, world, topic, phase, node, asset, reward, and validation event so new grades and worlds can be added without rewriting learner UI.

## Related User-Side Updates

These updates apply when admin-published content becomes learner-facing:

- Play must load published content only for the learner's selected grade.
- Play must place content inside the matching world, topic, phase, and node.
- Practice must repeat known content with support.
- Challenge must use known content only with fewer hints.
- Rank must reflect XP, stars, mastery, streak, and next goal effects.
- Reward must reflect badges, achievements, stars, and unlock progress.
- Hidden Learn and Quiz routes should remain Play-internal routes.
- Learner-facing copy should use Play, Rank, and Reward language instead of admin terms.

## Cleanup Rules

Replace:

- plain `CRUD API` framing with `Curriculum Intelligence API`
- direct `Admin -> Gemini -> Quiz` framing with the official workflow
- standalone `quiz` language with `Play content` when describing admin publishing
- public `leaderboard` assumptions with personal `Rank` unless the product scope changes

Keep:

- secure backend Gemini calls
- admin review before publication
- BatiBot validator blockers
- legacy IDs needed for saved progress compatibility

Avoid:

- client-side Gemini secrets
- generated content that bypasses review
- generic topic-label questions
- adult-facing instructions in child prompts
- Firestore or API structures that store content without curriculum/phase/reward context
