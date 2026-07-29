# BatiBot Coding Standards

## Purpose

These standards protect BatiBot during long-term development and the upcoming Clean Architecture migration. They define ownership, size limits, naming, imports, and validation expectations without changing current app behavior.

## Folder Organization

- `app/`: Expo Router screens, route groups, tab entry points, auth/admin routes, and navigation-facing screens.
- `components/`: reusable UI, child-safe controls, shared visual pieces, and repeated learner interaction components.
- `constants/`: theme values, sizing, color, layout tokens, and shared constants.
- `hooks/`: reusable React hooks and shared device/profile behavior.
- `src/config/`: Firebase and service setup facades.
- `src/store/`: shared client state for auth, learner progress, settings, rewards, XP, and tab behavior.
- `src/data/`: curriculum definitions, play assets, vocabulary, quiz presets, static learner data, and repository implementations while migration is in progress.
- `src/domain/`: entities, rules, and use cases that should not depend on React, Expo, Firebase clients, or UI.
- `src/infrastructure/`: Firebase clients, secure storage, analytics, AI clients, and platform-specific adapters.
- `src/presentation/`: view models, presentation state, and UI-facing hooks.
- `src/services/`: current service layer and migration bridge until responsibilities are moved behind clearer boundaries.
- `docs/`: repository workflow, architecture notes, audits, QA reports, and development standards.

## Naming Conventions

Use descriptive names tied to learner, curriculum, or system behavior. Prefer `kebab-case` for route and documentation files, `camelCase` for functions and variables, `PascalCase` for React components and types, and clear suffixes such as `Service`, `Repository`, `Provider`, `Rules`, `ViewModel`, and `Validator`.

Avoid vague names such as `utils2`, `newData`, `tempFix`, or `finalUpdate`. Commit messages should never be generic `update`, `changes`, `fixes`, or `new update`.

## Import Conventions

Prefer local established aliases and stable module boundaries. UI should not import Firebase clients directly unless the existing local pattern requires it and no safer service boundary exists yet. Domain code should not import React, Expo, navigation, Firebase clients, or UI modules.

During migration, introduce small adapters rather than large cross-layer rewrites. Keep barrel exports intentional and avoid circular dependencies.

## Module Responsibilities

Each module should own one clear responsibility. Screens compose flows. Components render reusable UI. Services coordinate external data and app operations. Domain rules validate learning behavior. Data files define content and static configuration. Infrastructure wraps platform and provider details.

Do not place curriculum data in UI components, Firebase secrets in client code, navigation decisions in data files, or reusable controls inside one-off screens unless the existing architecture requires it temporarily.

## Clean Architecture Principles

The target architecture should move toward dependency direction from presentation and infrastructure inward to domain rules and use cases. Domain code should remain framework-independent. Infrastructure should implement external concerns. Presentation should adapt domain state into mobile-friendly UI.

Phase 2 must begin with an Architecture Audit. Refactoring should be incremental, validated, and reversible.

## Maximum File Sizes

No source file should exceed approximately 800 lines unless justified in review. Targets:

- `play.tsx`: under 150 lines.
- UI components: under 300 lines.
- Validators: under 300 lines.
- Mission builders: under 300 lines.
- Curriculum config: under 300 lines.

Large files should be split by responsibility, such as data, presentation, validation, interaction logic, and styles.

## Reusable Component Rules

Create reusable components when behavior repeats across learner stages, worlds, grades, or admin surfaces. Learner-facing repeated controls should be large, accessible, mobile-safe, and asset-aware. Avoid duplicating tap, match, count, choose, reward, progress, or mastery behavior in multiple screens when a shared renderer or component can own it safely.

## Large File Policy

Never regenerate large files without explicit approval. Avoid replacing whole modules when a focused patch is enough. Split large modules during refactors only after a checkpoint commit and validation plan exist.

## Validation Requirements

Before merging feature work, run:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

Report actual results only. Documentation-only changes may use documentation review plus `git status`, unless scripts, package configuration, or repository rules changed.
