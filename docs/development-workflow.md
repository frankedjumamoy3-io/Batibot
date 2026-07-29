# BatiBot Development Workflow

## Purpose

This workflow prepares BatiBot for long-term professional development and the upcoming Clean Architecture migration. It is process documentation only; it does not change application behavior, curriculum, UI, Firebase, assets, progress, rewards, XP, stars, or navigation.

## Developer Workflow

1. Start from a clean working tree.
2. Update `develop`.
3. Create the correct feature branch.
4. Create a checkpoint commit before large implementation.
5. Make one scoped change at a time.
6. Review `git diff`.
7. Run validation.
8. Commit with a standardized message.
9. Merge into `develop` only after validation.
10. Merge `develop` into `main` only after system testing.

```text
main
  |
  v
develop
  |
  v
feature branch
  |
  v
checkpoint commit
  |
  v
implementation
  |
  v
validation
  |
  v
feature commit
  |
  v
develop
  |
  v
system testing
  |
  v
main
```

## Codex Workflow

Codex should begin every meaningful task with `git status` and a quick ownership check. Documentation work belongs in `docs/` or `AGENTS.md`. App behavior belongs in the owning application layer and must not be changed during workflow-only tasks.

Codex must prefer incremental edits, preserve local patterns, avoid broad regeneration, and stop before committing unrelated user work. Before architecture refactors, Codex should create or request a checkpoint, validate the current state, migrate one boundary at a time, validate again, and summarize risks clearly.

## Validation Workflow

Required validation before every feature merge:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

These scripts currently exist in `package.json`. Do not fabricate successful results. If a command fails, report the exact command and failure area. If a future branch removes a command, restore or replace the validation script before merging feature work.

## Testing Workflow

Use focused validation for narrow changes and broader testing for shared behavior. Source changes touching learning flows, navigation, Firebase, progress, rewards, XP, stars, assets, auth, or admin surfaces need relevant manual QA in addition to script validation.

Documentation-only changes should still end with `git status` and a documentation review, but they do not require app build validation unless they alter scripts or configuration.

## Release Workflow

Release candidates come from `develop` after all feature branches are validated. Merge `develop` into `main` only when the app is production-ready. Tag releases only after the merge is complete and the released commit is known.

Recommended release checks:

```bash
git status
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
npm run test:app
```

## Rollback Workflow

Use `git revert <commit>` for shared branches. Use `git reset --soft <checkpoint>` only on private local branches where history has not been shared. Keep checkpoint commits before risky work so a branch can return to a known safe state without guessing.

## Architecture Preparation

Phase 2 should begin with an Architecture Audit, not immediate refactoring. The audit should document current module responsibilities, target Clean Architecture boundaries, dependency direction, migration order, validation gaps, and rollback points.

Migration principles:

- Preserve behavior while moving boundaries.
- Move one module family at a time.
- Keep public interfaces stable during migration.
- Validate after each boundary change.
- Prefer adapters over direct cross-layer imports.
- Keep Firebase and privileged logic behind service or infrastructure boundaries.
