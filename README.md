# BatiBot

BatiBot is a personal, mobile-first gamified learning application for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners. It lets learners start with a simple local profile instead of an email account, routes them into their selected grade-specific curriculum module, then combines vocabulary, numeracy, quizzes, rewards, progress tracking, and app-owner quiz curation in a child-friendly interface built with Expo and React Native.

## Official Documentation

- Official Chapter I source: `docs/chapter-1-introduction.md`
- Chapter I system alignment audit: `docs/chapter-1-system-alignment-audit.md`
- Admin Play Content Control Center: `docs/admin-play-content-control-center.md`
- Admin AI prompt system: `docs/admin-ai-prompt-system.md`
- Curriculum Intelligence API architecture: `docs/curriculum-intelligence-api-architecture.md`
- Evaluation plan: `docs/evaluation-plan.md`
- Test cases: `docs/test-cases.md`
- Security and data reliability checklist: `docs/security-and-data-reliability-checklist.md`

The official Chapter I source defines the academic project context, objectives, purpose, scope, limitations, and required system checkpoints. README and implementation notes should stay aligned to that source.

## Major System Revision

The current codebase reflects a screenshot-driven product revision of BatiBot as a simpler, larger, map-first child learning app. The learner experience is now framed as three clear mobile tabs:

- `Rank` as the learner level, XP, streak, and standing area
- `Play` as the central map that fuses lesson worlds and quiz challenges
- `Reward` as the badges, achievements, stars, and locked reward gallery

This revision also pushes the app toward:

- grade-aware visibility from Preschool to Grade 3
- separated Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learner modules
- clearer child-friendly progression language
- a visible mobile learning map on the Play tab
- stronger system identity across Play, Rank, and Reward
- grade-specific Play map backgrounds and world art from the BatiBot asset pack
- enforced Reanimated feedback for lesson cards, quiz choices, learning map nodes, progress bars, and reward tiles
- safer admin-reviewed AI quiz drafting through a BatiBot curriculum contract before Gemini output is published

The current app direction follows a three-part learner journey:

1. `Play`: grade-aware world map, lesson entry points, locked/unlocked worlds, and daily quiz challenge
2. `Rank`: learner level, XP, streak, lessons seen, quizzes done, and profile/settings access
3. `Reward`: unlocked and locked badges, achievements, stars, and reward progress

The phase model is enforced in code through `src/content/learner-phases.ts`. The bottom tabs use this same source so the app stays visually and functionally aligned with the attached Figma-style flow.

## Current Product Status

The app currently includes:

- Email-free local learner profiles plus Firebase-backed app-owner admin authentication
- Grade-specific local learner profiles for Preschool to Grade 3
- Generated local `profileId` identity so learners with the same name and grade can keep separate profiles and progress
- Separated learner curriculum modules so each profile sees its selected grade path across Play, hidden Quiz, Vocabulary, Reward summaries, Word of Day, and Rank
- Learning Worlds vocabulary source for Preschool to Grade 3 world/topic content
- World-first Firestore curriculum architecture for curriculum levels, worlds, topics, stages, activities, challenges, and rewards
- Three visible learner tabs: Rank, Play, and Reward
- Play tab map that fuses Learn and Quiz flows into one child-facing adventure surface
- Every Play world follows the 8-step schema: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery
- Play tab profile icon opens a simplified user settings section for learner summary, learning/display preferences, reset progress, and sign out
- Hidden Learn and Quiz routes preserved for internal actions, existing data, and deep links
- Rank tab for personal level, XP, streaks, stars, completed worlds, grade-module words, grade-module quizzes, and next goal
- Reward tab for real badges, achievements, grade-scoped progress summaries, reward filters, and reward detail links
- Admin-side curated quiz management and AI-assisted quiz draft generation
- BatiBot curriculum API layer to align admin AI drafts with grade, world, topic, UI/UX format, active learning phase rules, and validation schemas before Gemini output becomes an admin draft
- Child-friendly motion using React Native Reanimated for buttons, lesson cards, quiz options, learning nodes, progress bars, reward tiles, feedback pauses, and guided screen transitions

The learner UI now follows the attached reference screen: a full-screen Play map, top star/XP counters, profile button, locked and unlocked world nodes, dotted map progression, and three bottom tabs for Rank, Play, and Reward.

## Implementation Roadmap

1. **Asset Integration**
   - Keep grade-specific Play backgrounds and world images centralized in `src/data/play-assets.ts`.
   - Use existing files from `Batibot assets/` for Preschool, Kindergarten, Grade 1, Grade 2, Grade 3, Rank, and Reward surfaces.
   - Prefer typed asset lookups over scattered `require(...)` calls in screens.

2. **Learner Flow Update**
   - Keep only three learner-facing bottom tabs: `Rank`, `Play`, and `Reward`.
   - Treat Learn and Quiz as Play-internal routes/actions, not visible tabs.
   - Preserve local learner progress, viewed lessons, quiz completion, XP, streaks, badges, and deep links.
   - Use the learner's selected grade level as the module selector so Preschool learners see Preschool content, Kindergarten learners see Kindergarten content, and Grade 1 to Grade 3 learners see their own grade-specific worlds, quizzes, prompts, and rewards.
   - Use shared learner-module helpers for grade-scoped worlds, vocabulary, quiz presets, progress totals, and challenge timing.
   - Treat learner name as display copy only. Store and load progress by generated local `profileId`.
   - When the same name and grade have multiple saved profiles, show a child-friendly profile picker with buddy/avatar and last played date.

3. **Play Surface**
   - Use `/(tabs)/play` as the visible Play route.
   - Present a grade-aware map with unlocked and locked worlds.
   - Route world taps into the in-Play 8-step schema: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.
   - Keep simplified user settings behind the upper-right Play profile icon; signing out must clear the current local learner session and return the user to the Login or Sign Up flow where name and grade level are required.
   - Match curriculum worlds to the supplied world artwork wherever an asset exists.

4. **BatiBot Curriculum Intelligence API**
   - Maintain an application-owned curriculum API or service layer that stores the preset curriculum contract for each grade.
   - Resolve grade, topic, objective, phase, allowed interaction types, question formats, copy length, cognitive level, and validation rules before requesting Gemini drafts.
   - Treat Gemini as a draft assistant only; BatiBot remains the source of truth for curriculum logic, active learning structure, UI/UX format, and publication safety.
   - Validate and normalize AI output before it reaches the admin editor.

5. **Rank And Reward Surfaces**
   - Use `/(tabs)/rank` as the visible Rank route for personal level, XP, streak, stars, worlds, words, quizzes, and next goal.
   - Use `/(tabs)/reward` as the visible Reward route for real badges, achievements, grade-scoped progress summaries, reward filters, and reward details.
   - Use the Rank and Reward asset folders for backgrounds, icons, and reward presentation.

6. **Verification**
   - Run `npx tsc --noEmit` after TypeScript/navigation changes.
   - Run `npm run lint` after UI and documentation changes.
   - Start Expo for visual review when the Play map, Rank, or Reward screens are touched.

## Learning Worlds Vocabulary Cleanup

The old local vocabulary banks were removed from the active source and replaced by:

```text
src/data/vocabulary/learning-worlds.ts
```

`VOCABULARY_ITEMS` now exports only the cleaned Learning Worlds vocabulary. The old `linguistic.ts`, `numeric.ts`, and `supplemental.ts` seed files were deleted so local vocabulary no longer falls back to the previous standalone word-list status.

Legacy dictionary row counts and sample copy reports are not current product goals. The active goal is grade > world > topic Play content that can connect to Rank progress and Reward outcomes.

Firestore vocabulary cleanup is handled by:

```bash
npm run sync:vocabulary:firestore
npm run sync:vocabulary:firestore:rest
```

Both sync paths delete stale `vocabularyItems` documents that are not in the current Learning Worlds source, then replace current documents with `sourceArchitecture: "learning-worlds"`, `learningWorld`, and the Discover to Mastery learning cycle fields. A Firebase Admin credential or valid Firestore OAuth credential is required before the live Firestore cleanup can run.

## Learning World Firestore Architecture

BatiBot now has a world-first curriculum export path that follows:

```text
Curriculum Level
World
Topic
Learning Stages
Activities
Challenges
Rewards
Progress
Mastery
```

The source builder lives in:

```text
src/data/curriculum/firestore-architecture.ts
```

It converts the local `CURRICULUM` source into Firestore-ready documents for:

- `curriculumLevels`
- `worlds`
- `topics`
- `stages`
- `activities`
- `challenges`
- `rewards`

Useful commands:

```bash
npm run validate:learning-architecture
npm run export:learning-architecture
npm run sync:learning-architecture:firestore
```

`validate:learning-architecture` checks that every topic has all eight stages and that Challenge documents follow `Known Content + New Question Style + Less Guidance`. `export:learning-architecture` writes a local JSON snapshot to `logs/learning-architecture-export.json`. The live sync command requires Firebase Admin credentials and writes only admin-curated architecture collections.

Firestore rules allow signed-in learners to read published curriculum content while keeping writes admin-only. Learner stage progress can be stored under `users/{uid}/progress/{progressId}` so Discover, Explore, Interact nodes, Practice, Challenge nodes, Reward, Progress, and Mastery can be tracked separately.

For the personal learner app model, grade level is the primary curriculum filter. The shared routes can stay the same, but the data returned to a learner should be scoped to the active local profile:

- `Preschool` learners see Preschool worlds, vocabulary, quiz presets, rewards, and copy density.
- `Kindergarten` learners see Kindergarten worlds, vocabulary, quiz presets, rewards, and copy density.
- `Grade 1`, `Grade 2`, and `Grade 3` learners see their matching upper-grade modules and should not be mixed with lower-grade or higher-grade content unless an intentional review or promotion flow is added.

Progress should be tracked per learner profile and grade module so changing grade level does not accidentally merge unrelated curriculum progress.

Counting-related worlds use a more concrete lesson formula:

```text
Known Objects + Count Sequence + Numeral Match + Independent Count Challenge
```

For example, Counting Forest introduces counting with a visible object group, lets learners tap each object while hearing the count sequence, guides them to choose the matching numeral, then challenges them with the same known objects through `How many?`, independent count, and number-to-group tasks with fewer hints.

## Curriculum World Expansion

The Learning Worlds curriculum now includes additional grade-specific worlds:

- `Preschool`: Fruit Garden and Food Town for everyday vocabulary, object recognition, sorting, matching, and counting.
- `Kindergarten`: Community Village for common community helpers such as teachers, doctors, nurses, police officers, firefighters, and farmers.
- `Grade 1`: Family Story Village for early reading bridges, plus Time Town for clocks and daily time words.
- `Grade 2`: Community Explorer for community vocabulary, occupations, and places; Story Quest now includes sentence understanding and reading response work.
- `Grade 3`: Context Clue Canyon for context clues and word meaning; Story Adventure now carries story elements, reading comprehension, character, setting, problem, and solution.

New Play worlds are mapped through `src/data/play-assets.ts` to their matching BatiBot world artwork so Fruit Garden, Food Town, Community Village, Family Story Village, Time Town, Community Explorer, Context Clue Canyon, and Story Adventure display accurate world icons.

## BatiBot Curriculum Intelligence API Contract

BatiBot now uses an application-owned Curriculum Intelligence API contract between the admin module and Gemini. This is not a plain CRUD API. It contains the preset curriculum structure and returns constrained generation rules for each admin draft request.

Expected contract inputs:

- learner grade module
- curriculum level, world, topic, and objective
- active learning phase
- allowed activity and question formats
- vocabulary or numeracy source
- cognitive level and reading length
- UI/UX format expectations
- validation and publication rules

Official admin workflow:

```text
Admin
-> BatiBot Curriculum Intelligence API
-> Gemini API
-> Draft Validator
-> Admin Review
-> Published Play Content
```

This keeps BatiBot aligned with its own active learning framework instead of depending only on free-form prompt text. The full prompt modules are documented in `docs/admin-ai-prompt-system.md`; the service architecture is documented in `docs/curriculum-intelligence-api-architecture.md`.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Firebase Auth
- Cloud Firestore
- Firebase Storage
- React Native Reanimated
- React Native Gesture Handler

## App Structure

```text
batibot/
|-- app/                          Expo Router routes
|   |-- _layout.tsx               Root providers and app shell
|   |-- index.tsx                 Entry redirect
|   |-- modal.tsx
|   |-- (auth)/                   Login, signup, forgot password
|   |-- (tabs)/                   Learner-facing app tabs
|   |   |-- home.tsx
|   |   |-- progress/
|   |   |-- badges/
|   |   |-- vocabulary/
|   |   `-- quiz/
|   `-- (admin)/                  Admin dashboard and curation flow
|-- assets/                       Images, backgrounds, icons, Lottie files
|-- components/                   Shared UI and animation components
|   |-- animation/                Reanimated buttons, lesson cards, quiz options, badges, nodes, and progress
|-- constants/                    Theme tokens and layout constants
|-- docs/                         Product and system documentation
|-- firebase/                     Functions and Firebase backend code
|-- hooks/                        Shared React hooks
|-- scripts/                      Local tooling scripts
|-- src/
|   |-- config/                   Firebase configuration
|   |-- content/                  System, curriculum, and learner phase copy
|   |-- data/                     Quiz, vocabulary, and dashboard data
|   |-- navigation/               Route and tab configuration
|   |-- screens/                  Screen content and style helpers
|   |-- services/                 Firebase, AI, analytics, and media services
|   |-- store/                    Shared learner progress and session state
|   `-- types/                    Shared TypeScript models
|-- app.json
|-- eas.json
|-- firestore.rules
|-- storage.rules
`-- package.json
```

## Key Architectural Notes

- Learner-facing flows are mobile-first and child-friendly.
- Roles are limited to `learner` and `admin`.
- Learner grade level drives curriculum targeting and curated quiz visibility.
- AI-generated quiz drafts are admin-reviewed before learner publication.
- Reanimated is used as the learner interaction language: touch response, lesson-card entrance, quiz-option correct/wrong feedback, learning-node motion, XP/progress fill, badge reveal, and screen entrance.
- Firebase handles data persistence; animations only reflect saved or computed state.

## Main Routes

- `/(auth)/login`
- `/(auth)/signup`
- `/(tabs)/play` as the visible Play tab
- `/(tabs)/rank` as the visible Rank tab
- `/(tabs)/reward` as the visible Reward tab
- `/(tabs)/vocabulary/words` as a hidden Play lesson route
- `/(tabs)/vocabulary/detail` as a hidden Play lesson detail route
- `/(tabs)/quiz` as a hidden Play quiz route
- `/(admin)`

## Local Development

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Useful scripts:

- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- `npx tsc --noEmit`

## Web Export and Hosting

Export the web build:

```bash
npm run export:web
```

Deploy Firebase Hosting:

```bash
npm run deploy:web
```

## Android APK Build

Build a preview APK through EAS:

```bash
npm run build:android:apk
```

Build locally if your Android toolchain is installed:

```bash
npm run build:android:apk:local
```

Notes:

- `app.json` points to the bundled launcher icon assets in `assets/images/`
- the EAS scripts set `EAS_NO_VCS=1` to avoid requiring Git on the build machine
- EAS login or an `EXPO_TOKEN` is required for cloud builds

## Firebase and Security

- Learners use email-free local profiles for personal app use on one device.
- Firebase Auth is used for app-owner admin identity and protected admin workflows.
- Firestore stores curated quizzes, admin logs, published learning data, and optional analytics.
- Storage is used for protected profile/admin media assets when enabled.
- Privileged AI and admin operations should stay behind backend or Firebase function layers.
- Admin AI generation should go through the BatiBot curriculum API/contract layer before Gemini is called.

## Current Design Direction

The current UI direction is a bright, content-aware learner experience with:

- distinct tab color themes for Rank, Play, and Reward
- three simplified bottom tabs: Rank, Play, and Reward
- Learn and Quiz fused into the Play tab as map and challenge actions
- full-screen grade-specific Play maps based on the BatiBot asset pack
- large rounded cards and buttons based on the attached reference screens
- friendly mascot-supported guidance
- solid content surfaces and readable tab states
- playful but restrained motion for tap, answer, unlock, progress, and reward moments
- grade-appropriate presentation for young learners

## Verification

For code changes that affect the app, the usual verification path is:

```bash
npx tsc --noEmit
npm run lint
```

Use Expo export, Firebase deploy, and EAS build commands as needed for release work.

## Git Workflow

BatiBot uses Git to keep every change recoverable, reviewable, and reversible. Treat `main` as production-ready code and `develop` as the integration branch. Create scoped branches for active work, such as `feature/kindergarten`, `feature/ui`, `fix/play-stage`, or `hotfix/build`.

Recommended workflow:

```bash
git status
git switch develop
git pull
git switch -c feature/ui
npm run lint
npm run typecheck
npm run validate:active-learning-framework
npm test
git add .
git commit
git switch develop
git merge feature/ui
```

Commit messages follow a conventional format:

```text
feat(kindergarten): Redesign Alphabet LOOK stage
fix(audio): Prevent duplicate speech
refactor(renderer): Simplify lesson renderer
docs(git): Update recovery workflow
chore(git): Configure repository
```

## Recovery Commands

Use these commands before and after risky edits:

```bash
git status
git diff
git log --oneline --decorate --graph
git show HEAD
git restore "app/(tabs)/play.tsx"
git restore src/domain/rules
git stash
git stash pop
```

To recover a deleted or overwritten file from an older commit:

```bash
git log -- "app/(tabs)/play.tsx"
git restore --source <commit> "app/(tabs)/play.tsx"
```

Detailed branch, commit, merge, release tag, and recovery guidance lives in [`docs/git-workflow.md`](docs/git-workflow.md).
