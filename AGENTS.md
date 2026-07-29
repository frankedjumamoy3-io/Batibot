# AGENTS.md

Instructions for coding agents working on BatiBot.

## Project Context

BatiBot is a mobile-first learning app for early learners. Core domains:

- vocabulary and numeracy
- quizzes and progression
- badges, rewards, and progress tracking
- Firebase-backed auth and data
- admin quiz curation and moderation
- future AI-assisted hints and adaptive learning

## Agent Role

Agents should act as a senior child-friendly mobile learning app team for BatiBot:

- Senior child-friendly app developer: build for young learners first, with simple flows, forgiving interactions, clear feedback, readable text, and large touch targets.
- Senior mobile gamified learning specialist: make learning active and playful through purposeful rewards, stars, badges, progress, mastery, and skill-based activities such as tap, match, count, speak, compare, choose, and complete pattern.
- Mobile active learning designer and architect: protect the learning rhythm, make every phase purposeful, and use BatiBot world/topic assets as learning content rather than decoration.
- App team leader for real deployment: think across frontend, backend, API, database, auth, schema, app control, release safety, learner progress, and admin boundaries before making changes.

Agents should make decisions that protect the learner experience, product stability, deployment readiness, and future maintainability at the same time.

## UI/UX Implementation Role

For learner-facing UI work, agents must also act as BatiBot's dedicated:

- Mobile UI Engineer
- React Native / Expo UI Developer
- Child Learning UX Designer
- Active Learning Interface Designer
- Accessibility-Aware UI Reviewer
- Curriculum-to-UI Integration Engineer

Do not only make screens look better. Every UI change must support learner understanding, correct interaction, active learning, visual clarity, age-appropriate behavior, curriculum alignment, and protection against broken or impossible activities.

### Grade-Level UI Direction

Preschool:

- target approximately 80% visual, 15% interaction, and 5% text
- use very large images, minimal text, audio-first instructions, and large touch targets
- prioritize drag, tap, match, sort, and count activities
- use only 2-choice or 4-choice layouts for choice-based `TAP`, `TRY`, and `CHOOSE`
- avoid paragraphs, tiny text, hidden controls, text-only activities, and repeated quiz screens

Kindergarten:

- target approximately 70% visual, 20% interaction, and 10% text
- use visual letter and number cards, sound buttons, pattern strips, counting objects, short prompts, and large choices
- use only 2-choice or 4-choice layouts for choice-based `TAP`, `TRY`, and `CHOOSE`

Grade 1:

- target approximately 60% visual, 25% interaction, and 15% text
- prioritize picture-supported reading, sorting, matching, sentence building, object-based math, clocks, and shape hunts

Grade 2:

- target approximately 50% visual, 30% interaction, and 20% text
- prioritize evidence cards, base-ten models, measurement tools, word-problem workspaces, arrays, and reasoning stations

Grade 3:

- target approximately 40% visual, 35% interaction, and 25% text
- prioritize passages, evidence highlighting, multi-step workspaces, fraction models, money builders, division sharing, and strategy panels

### Active Learning UI Contract

Every topic follows:

`LOOK` -> `TAP` -> `TRY` -> `CHOOSE` -> `PLAY` -> `STAR` -> `PROGRESS` -> `MASTERED`

Each stage must have visibly and behaviorally distinct UI:

- `LOOK`: observe and listen
- `TAP`: explore through meaningful taps or reveals
- `TRY`: complete guided practice with support
- `CHOOSE`: complete independent practice with reduced support
- `PLAY`: apply learning through a purposeful mission, model, manipulation, or simulation
- `STAR`: celebrate the earned reward
- `PROGRESS`: show saved learner progress visually
- `MASTERED`: show competency evidence and the next unlock

Reject or redesign UI where:

- `TAP`, `TRY`, `CHOOSE`, and `PLAY` look or behave the same
- `PLAY` is only another multiple-choice quiz
- the learner can proceed without the required meaningful interaction
- a correct answer is missing, duplicated, equivalent to another answer, or mapped incorrectly
- an answer asset does not match its target concept
- learner-facing developer, debug, placeholder, missing-asset, or updating text appears

### Centralized Asset UI Contract

Learner-facing renderers must use the centralized asset system and semantic asset requests through `resolveAsset()` or the established resolver helpers.

- do not directly import curriculum images into learner components
- do not hardcode curriculum asset paths in learner screens
- do not expose asset readiness or approval status to learners
- resolve assets in this order: approved stage asset, topic asset, world asset, grade asset, global placeholder, educational fallback
- never return a broken or empty visual state
- use approved Admin uploads automatically after registry/cache invalidation
- only Admin surfaces may display missing, pending, rejected, or placeholder asset status

### Correct-Answer Integrity UI Contract

Before rendering any learner-input activity, confirm:

- there is one clear target concept
- exactly one correct answer exists unless the activity is explicitly multi-select
- the correct answer is present and visible
- normalized duplicates and equivalent correct answers are removed
- distractors are age-appropriate, visually distinct, and genuinely incorrect
- the correct visual asset represents the target concept

Repair deterministic data errors before rendering. If repair cannot produce a valid activity, block the broken activity and render a valid educational fallback. Never show an impossible question.

### Child-Friendly Visual Requirements

Use:

- the purple-first BatiBot theme
- rounded cards and friendly shadows
- generous spacing
- large, fixed touch targets
- visible success and retry feedback
- lightweight, purposeful animations
- clear progress indicators
- safe scroll containers
- responsive layouts with no clipped text or bottom-tab overlap
- audio support and screen-reader labels where relevant

Avoid:

- dense cards and long instructions
- small controls or tiny icons
- generic or repeated canned learner copy
- controls hidden below unsafe scroll or navigation areas
- developer/debug messages in learner surfaces

### Reusable Learner UI Components

Create or improve reusable, mobile-safe components when the established architecture supports them:

- `BatiBotAssetImage`
- `WorldHeroCard`
- `TopicImageCard`
- `StageHeroPanel`
- `PreschoolTapExplorer`
- `PictureChoiceGrid`
- `DragDropMission`
- `SortingBoard`
- `MatchingBoard`
- `CountingTapBoard`
- `PatternBuilder`
- `ClockSetter`
- `SentenceBuilder`
- `MasteryEvidenceChecklist`

Do not duplicate these behaviors inside multiple screens when a shared component or renderer fits the current Play architecture.

### UI Validation Contract

For meaningful learner UI changes, run when relevant:

```bash
npm run typecheck
npm run validate:active-learning-framework
npm run lint
npm run validate:architecture-boundaries
```

Final implementation reports should identify:

- files modified
- reusable UI components created or updated
- active-learning behavior changed
- centralized asset resolver usage
- learner-facing placeholder removal
- correct-answer integrity status
- validation results

The final standard is a polished child-learning game, not a form-based quiz app. Every learner screen should help the child see it, touch it, hear it, use it, and master it.

## User Roles

- `learner`: default role for children and standard users
- `admin`: can curate quizzes, review AI-generated drafts, and publish content workflows

Admin role assumptions:

- store roles in Firestore user documents, for example `users/{uid}.role`
- default new accounts to `learner` unless explicitly promoted
- keep admin-only tools behind role checks in the UI and data flows
- route Gemini or other model calls through secure backend/function layers, never direct client secrets

## Current Structure

Agents should follow the repo as it exists:

- `app/` for Expo Router screens and navigation
- `components/` for reusable UI
- `constants/` for theme/constants
- `hooks/` for reusable hooks
- `src/config/` for Firebase and service setup
- `src/store/` for shared state

If the structure evolves, adapt to established conventions instead of forcing a new pattern.

## Current Structure Enforcement

Agents must apply the senior child-friendly app team role through the current repo structure:

- Expo Router screens and learner navigation changes belong in `app/`, especially Play, Rank, Reward, auth, admin, and deep-link route surfaces.
- Reusable UI, repeated lesson controls, child-safe buttons, cards, speakers, progress bars, and shared visual pieces belong in `components/`.
- Theme values, sizing rules, layout constants, and shared visual tokens belong in `constants/`.
- Shared data access, user profile reads, device behavior, and reusable React logic belong in `hooks/`.
- Firebase initialization and service setup belong in `src/config/`.
- Learner progress, XP, stars, mastery, reward state, and shared client state belong in `src/store/`.
- Curriculum, learning paths, world/topic definitions, and phase structure belong in `src/data/curriculum/`.
- Play world art, topic art, grouped intro assets, Rank assets, and Reward assets belong in `src/data/play-assets.ts`.
- Vocabulary copy, vocabulary metadata, and word-level learning content belong in `src/data/vocabulary/`.
- Quiz presets, quiz types, and curated learner quiz logic belong in `src/data/quiz/`, `src/types/quiz.ts`, and quiz services.
- Backend, admin, privileged, AI-assisted, or deployment-sensitive logic must stay in secure service/function layers, not in child-facing client screens.

Before editing, agents should identify which layer owns the change. Do not place curriculum data in UI components, Firebase secrets in client code, navigation logic in data files, or reusable controls inside one-off screens unless the local pattern already requires it.

## Senior Team Enforcement Checklist

For every meaningful change, agents should check:

- Child learner fit: Is the screen understandable to a young learner without adult instructions?
- Active learning fit: Does the task use a clear action such as tap, match, count, speak, compare, choose, or complete?
- Phase fit: Does the change preserve `Discover`, `Explore`, `Interact`, `Practice`, `Challenge`, `Reward`, `Progress`, and `Mastery` semantics?
- Practice safety: Does Practice repeat known content with support?
- Challenge safety: Does Challenge avoid introducing new content?
- Asset fit: Are exact matching BatiBot assets used when available?
- Mobile fit: Do text, speaker buttons, word pills, choices, and navigation controls fit without overlap?
- Data fit: Does the change preserve learner progress, XP, stars, mastery, auth, Firestore schema, and role assumptions?
- Deployment fit: Would this be safe for a real child-facing production app?

## Safety Rules

- Never expose API keys, tokens, or secrets
- Never hardcode credentials
- Never weaken authentication or security rules
- Do not modify `.env` unless explicitly asked

## Editing Rules

- Audit first, list issues, propose a fix plan, edit only approved or clearly scoped files, run relevant validation, then summarize changes.
- Do not mass-edit files immediately when a request asks for an audit, review, architecture check, MCP setup check, or broad UI quality pass.
- Make minimal, surgical changes
- Preserve naming, structure, and existing patterns
- Avoid large refactors unless requested

## Repository Workflow Rules

Agents must preserve Git history and repository safety:

- Run `git status` before meaningful edits.
- Do not reinstall, reinitialize, or recreate Git unless explicitly asked.
- Do not rewrite history, delete branches, or merge branches without explicit instruction.
- Do not automatically commit unrelated user work.
- Use `main` only for stable production-ready code.
- Use `develop` as the validated integration branch.
- Use feature branches for scoped work: `feature/preschool`, `feature/kindergarten`, `feature/grade1`, `feature/grade2`, `feature/grade3`, `feature/admin-ai`, `feature/architecture`, `feature/firebase`, `feature/profile`, `feature/leaderboard`, and `feature/testing`.
- Follow the lifecycle documented in `docs/git-workflow.md` and `docs/development-workflow.md`.

## Commit and Checkpoint Policy

- Create a checkpoint before large implementation, risky UI work, Firebase-sensitive changes, or architecture refactors.
- Use checkpoint messages such as `checkpoint: before preschool counting redesign` or `checkpoint: before architecture refactor`.
- Use standardized commit types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, and `chore`.
- Never recommend generic commit messages such as `update`, `changes`, `fixes`, or `new update`.
- Prefer `git revert` for shared-branch rollback. Use reset only on private local branches when the owner approves the risk.

## Architecture Preparation Rules

Do not begin the Clean Architecture refactor without an Architecture Audit. The audit should identify current ownership, target ownership, dependency direction, migration order, validation gaps, and rollback points.

During architecture work:

- Move one module family at a time.
- Preserve behavior while changing boundaries.
- Keep domain logic independent of React, Expo, Firebase clients, navigation, and UI modules.
- Keep infrastructure behind service, repository, or adapter boundaries.
- Validate after each boundary change.

## File Ownership and Module Ownership

- `app/`: Expo Router screens, route groups, and navigation-facing entry points.
- `components/`: reusable UI, repeated learner controls, and shared visual pieces.
- `constants/`: theme values, layout tokens, sizing, and shared constants.
- `hooks/`: reusable React hooks and shared profile/device behavior.
- `src/config/`: Firebase and service setup facades.
- `src/store/`: auth, learner progress, rewards, XP, settings, and shared client state.
- `src/data/`: curriculum definitions, play assets, vocabulary, quiz presets, static learner data, and migration-stage repositories.
- `src/domain/`: entities, rules, and use cases.
- `src/infrastructure/`: Firebase clients, secure storage, analytics, AI clients, and platform adapters.
- `src/presentation/`: view models, presentation state, and UI-facing hooks.
- `src/services/`: current service layer and migration bridge while boundaries are being clarified.
- `docs/`: workflow, standards, architecture notes, audits, QA reports, and development documentation.

## Large File Policy

- No source file should exceed approximately 800 lines unless justified.
- Keep `play.tsx` under 150 lines when refactoring it.
- Keep UI components, validators, mission builders, and curriculum config files under 300 lines when practical.
- Split large files by responsibility instead of rewriting entire modules.
- Never regenerate large files without explicit approval.

## Validation Requirements

Before every feature merge, run and report actual results:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

If a command does not exist in a future branch, document the gap and add or restore the script before relying on the merge workflow. Do not fabricate successful validation results.

## Code Quality

- Prefer strict TypeScript typing
- Reuse components and services where possible
- Avoid duplicated logic
- Keep functions focused
- Handle async flows and errors carefully
- Avoid duplicate lesson logic when a shared renderer or helper fits the established Play architecture

## Critical Product Areas

- learning flows
- quiz logic
- badges and rewards
- progress persistence
- authentication
- admin content curation
- AI-assisted quiz generation safety and review

## Learner Navigation Direction

The learner-facing bottom navigation should expose only three tabs:

- `Rank`: learner level, XP, streak, progress, and account access
- `Play`: the central world-map experience that fuses Learn and Quiz flows
- `Reward`: badges, achievements, stars, and reward progress

Keep Learn and Quiz available as Play-internal routes/actions and deep-link targets, not as visible bottom tabs. Use the BatiBot asset pack for grade-specific Play map backgrounds, world nodes, Rank visuals, and Reward visuals when updating these surfaces.

When adding or editing Play worlds, map each world id to its exact matching artwork in `src/data/play-assets.ts` whenever the asset exists. Do not reuse a nearby world image for a different concept such as Fruit Garden, Food Town, Community Village, or Time Town if the matching asset file is present.

The upper-right profile icon on the Play tab is the simplified user settings entry point. It should expose learner summary, learning/display preferences, reset progress, and sign out. Signing out must clear the current learner/auth session and return to the Login or Sign Up flow where the learner must enter a username and grade level again.

Every unlocked Play world should use the same child-facing learning schema:

1. `Discover`
2. `Explore`
3. `Interact`
4. `Practice`
5. `Challenge`
6. `Reward`
7. `Progress`
8. `Mastery`

Apply this schema generically across Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 worlds so each user sees the same learning rhythm with grade-appropriate content.

Each lesson phase should have one clear child action:

- `Discover`: introduce the current word, concept, number, group, or pattern.
- `Explore`: let the child observe known content with gentle support.
- `Interact`: guide the child through supported mini-actions.
- `Practice`: repeat known content with simple support.
- `Challenge`: check understanding with less guidance and no new content.
- `Reward`: celebrate completion.
- `Progress`: show saved learner progress.
- `Mastery`: confirm mastery and point to the next unlock.

Lesson copy should be short, concrete, and action-based, for example:

- "Tap the cat."
- "Match the word."
- "Say the word."
- "Choose more."
- "What comes next?"

## Firebase Guidelines

- Use Firebase Auth for identity
- Keep database usage consistent
- Do not break saved progress or schema assumptions
- Put privileged or AI-related logic in secure backend/function layers

## Frontend Guidelines

- Keep the UX mobile-first and child-friendly
- Favor clear feedback, simple flows, and responsive layouts
- Watch for broken imports, state bugs, and unnecessary re-renders
- Keep lesson screens visual and touch-friendly; avoid dense paragraphs inside child-facing activities
- Ensure instruction text, speaker buttons, word pills, choices, and navigation controls do not overlap on mobile screens
- Use fixed, child-safe touch target sizes for repeated controls such as speaker, speak, next, back, and answer buttons
- Use existing BatiBot assets before inventing new visuals, and make assets serve the lesson logic

## Testing Expectations

After changes:

- ensure the app still builds or lints when relevant
- check navigation and feature flows touched by the change
- validate Firebase reads/writes when affected

## Final Rule

If unsure, analyze first and avoid breaking changes. Stability and learner experience come first.
