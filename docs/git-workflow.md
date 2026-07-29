# BatiBot Git Workflow

## Repository Overview

BatiBot uses Git to protect learner-facing work from accidental overwrites, truncation, and hard-to-review large edits. All source changes should be made on a branch, reviewed with `git diff`, validated, and committed before another major change begins.

Git is infrastructure only. It does not change curriculum, UI, Firebase, navigation, rewards, XP, stars, or assets.

## Branch Diagram

```text
main
  ^
  |
develop
  |-- feature/preschool
  |-- feature/kindergarten
  |-- feature/grade1
  |-- feature/grade2
  |-- feature/grade3
  |-- feature/admin-ai
  |-- feature/architecture
  |-- feature/firebase
  |-- feature/profile
  |-- feature/leaderboard
  |-- feature/testing
```

## Branch Strategy

- `main`: stable production-ready code only.
- `develop`: integration branch for validated features.
- `feature/preschool`: Preschool learning experiences and curriculum-supporting implementation.
- `feature/kindergarten`: Kindergarten learning experiences and curriculum-supporting implementation.
- `feature/grade1`: Grade 1 learning experiences and curriculum-supporting implementation.
- `feature/grade2`: Grade 2 learning experiences and curriculum-supporting implementation.
- `feature/grade3`: Grade 3 learning experiences and curriculum-supporting implementation.
- `feature/admin-ai`: admin curation, AI-assisted drafts, moderation, and review tooling.
- `feature/architecture`: Clean Architecture migration, module boundaries, and shared structure.
- `feature/firebase`: Firebase services, rules, data access, and deployment-supporting changes.
- `feature/profile`: learner profile, settings, account, and session flows.
- `feature/leaderboard`: rank, XP summaries, streaks, and leaderboard surfaces.
- `feature/testing`: validation scripts, test coverage, QA harnesses, and release checks.

Do not merge branches until validation is complete. Do not delete long-lived branches. Delete temporary feature branches only after they are merged and no longer needed. If branches already exist, leave them unchanged.

Create branches with:

```bash
git switch develop
git pull
git switch -c feature/kindergarten
```

## Commit Convention

Use concise, standardized commits. Prefer a specific scope when it helps reviewers understand the risk area.

```text
checkpoint: before preschool counting redesign
checkpoint: before architecture refactor
feat(play): add Counting Forest mission
fix(auth): prevent duplicate sign-in request
refactor(architecture): move learner progress behind repository boundary
docs(workflow): document branch strategy
style(reward): adjust badge spacing
test(validation): add active-learning boundary check
chore(git): update repository ignore rules
```

Commit types:

- `checkpoint`: safe restore point before large implementation or refactor work.
- `feat`: new functionality.
- `fix`: bug fixes.
- `refactor`: architecture improvements that should not change behavior.
- `docs`: documentation.
- `style`: visual-only changes.
- `test`: tests and validation.
- `chore`: infrastructure and maintenance.

Never use generic messages such as `update`, `changes`, `fixes`, or `new update`.

## Recommended Development Workflow

The normal lifecycle is:

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
Codex implementation
  |
  v
validation
  |
  v
feature commit
  |
  v
merge into develop
  |
  v
system testing
  |
  v
merge into main
```

```bash
git status
git switch develop
git pull
git switch -c feature/architecture
git commit --allow-empty -m "checkpoint: before architecture refactor"
git diff
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
git add .
git commit -m "refactor(architecture): migrate one bounded module"
git switch develop
git merge feature/architecture
```

## Pre-Commit Quality Checklist

- TypeScript passes.
- ESLint passes.
- Architecture boundary validator passes.
- Active-learning validator passes.
- Asset-resolution validator passes.
- No missing assets.
- No unresolved imports.
- No placeholder learner images.
- No TODO code left in committed work.
- No debug console logs.
- No broken routes.
- No duplicated lesson stages.
- Lesson validation passes.

Required validation before every feature merge:

```bash
npm run typecheck
npm run lint
npm run validate:architecture-boundaries
npm run validate:active-learning-framework
npm run validate:asset-resolution
```

If one of these commands is unavailable in a future branch, add the missing script before relying on the workflow. Do not report validation as passed unless the command was actually run and completed successfully.

## Recovery Examples

### View Status

```bash
git status
git diff
git branch
git log --oneline --decorate --graph
```

### Restore One File

```bash
git restore "app/(tabs)/play.tsx"
git restore --source HEAD~1 "app/(tabs)/play.tsx"
```

### Restore One Folder

```bash
git restore src/domain/rules
git restore --source HEAD~1 src/domain/rules
```

### Recover A Deleted File

```bash
git log -- "app/(tabs)/play.tsx"
git restore --source <commit> "app/(tabs)/play.tsx"
```

### Compare Commits

```bash
git diff HEAD~1 HEAD
git show HEAD
git show <commit>:"app/(tabs)/play.tsx"
```

### Undo Accidental Edits

```bash
git diff
git restore "app/(tabs)/play.tsx"
```

Older Git versions can use `git checkout` for file recovery:

```bash
git checkout -- "app/(tabs)/play.tsx"
git checkout <commit> -- "app/(tabs)/play.tsx"
```

### Stash Work Temporarily

```bash
git stash
git switch fix/assets
git stash pop
```

### Roll Back A Shared Commit

Prefer creating a revert commit for shared branches:

```bash
git revert <commit>
```

Use reset only on private local branches when you are certain:

```bash
git reset --soft HEAD~1
```

### Roll Back A Feature Branch

Use this when a feature branch becomes risky but the checkpoint commit is good:

```bash
git status
git log --oneline
git reset --soft <checkpoint-commit>
git status
```

For shared branches, prefer a new revert commit instead of rewriting history.

## Merge Strategy

- Prefer small branches with one purpose.
- Merge feature branches into `develop` after validation.
- Merge `develop` into `main` only after app-level QA.
- Resolve conflicts by keeping learner safety and curriculum correctness first.
- Never delete `app/`, `src/`, `assets/`, `docs/`, or `curriculum/`.
- Use pull requests or reviewed merge commits for `develop` and `main` when hosted remotely.

## Codex Safety Rules

Before modifying source files:

1. Run `git status`.
2. Create a checkpoint before architecture refactors or broad UI changes.
3. Use incremental patches.
4. Preserve surrounding architecture.
5. Never delete source files automatically.
6. Avoid replacing files larger than 800 lines unless explicitly requested.
7. Keep backups or commits before risky edits.
8. Never regenerate large modules without explicit approval.
9. Stop and report any staged secret, `.env` file, credential, private key, or generated cache.

## GitHub Setup

After creating a GitHub repository:

```bash
git remote add origin <repo-url>
git push -u origin main
git push origin develop
```

Use GitHub Pull Requests for changes into `develop` and `main`. Use GitHub Issues for bugs and GitHub Releases for tagged builds.

## Release Tags

Use semantic versioning:

```text
v0.1.0 Initial project
v0.2.0 Preschool complete
v0.3.0 Kindergarten complete
v0.4.0 Grade 1 complete
v1.0.0 Capstone release
```
