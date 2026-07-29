# BatiBot Git Branching Strategy

## Purpose

BatiBot uses a small, professional branch model that keeps the repository clean while supporting long-term development. Only long-lived branches should exist by default. Feature branches are created only when real work begins.

## Long-Lived Branches

### `main`

`main` is the stable branch.

Responsibilities:

- Hold production-ready code.
- Stay functional at all times.
- Receive completed release work only after final validation.
- Carry tagged releases.
- Avoid experimental commits.

Do not commit exploratory work directly to `main`.

### `develop`

`develop` is the long-lived integration branch.

Responsibilities:

- Integrate completed feature branches.
- Support system-wide validation.
- Support regression testing.
- Act as the pre-release branch before merging into `main`.

Feature work should branch from `develop`, then merge back into `develop` after validation.

## Feature Branch Policy

Do not create empty feature branches ahead of time. Future feature branches should exist only while active implementation is happening.

Naming convention examples:

```text
feature/architecture
feature/preschool
feature/kindergarten
feature/grade1
feature/grade2
feature/grade3
feature/admin-ai
feature/firebase
feature/profile
feature/leaderboard
feature/testing
```

Responsibilities:

- Keep implementation isolated.
- Stay temporary.
- Hold scoped feature commits.
- Merge into `develop` only after validation.
- Be deleted after merge when no longer needed.

## Feature Branch Lifecycle

Start new work from `develop`:

```bash
git switch develop
git switch -c feature/preschool
```

Before major implementation, create a checkpoint:

```bash
git commit --allow-empty -m "checkpoint: before preschool counting redesign"
```

Then implement, validate, and commit:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
git add .
git commit -m "feat(preschool): add counting activity flow"
```

Merge only after validation:

```bash
git switch develop
git merge feature/preschool
```

Delete the feature branch after merge if it is no longer needed:

```bash
git branch -d feature/preschool
```

## Release Workflow

```text
feature branch
  |
  v
validation
  |
  v
merge into develop
  |
  v
system testing
  |
  v
final validation
  |
  v
merge into main
  |
  v
release
```

Final validation should include:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

Do not report validation as successful unless the commands were actually run and completed successfully.

## Merge Strategy

- Merge feature branches into `develop`.
- Merge `develop` into `main` only for release-ready work.
- Keep merges small and reviewable.
- Resolve conflicts in favor of learner safety, data integrity, and current architecture.
- Do not merge branches during documentation-only branch setup unless explicitly requested.

## Rollback Workflow

Use revert commits for shared branches:

```bash
git revert <commit>
```

Use checkpoint commits to recover private feature work:

```bash
git log --oneline
git reset --soft <checkpoint-commit>
```

Only use reset on private local branches. Do not rewrite shared branch history.

## Checkpoint Workflow

Create checkpoints before:

- Clean Architecture migration steps.
- Large UI or learner-flow implementation.
- Firebase-sensitive changes.
- Broad data or validation changes.
- Risky dependency or build configuration work.

Checkpoint message examples:

```text
checkpoint: before architecture refactor
checkpoint: before preschool counting redesign
checkpoint: before Firebase progress migration
```

## Branch Deletion Policy

- Keep `main`.
- Keep `develop`.
- Do not keep empty or unused feature branches.
- Delete feature branches after successful merge if they are no longer needed.
- Do not delete branches that contain unmerged work.
- Do not delete branches without checking with the owner when their purpose is unclear.
