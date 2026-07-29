# BatiBot Learner Production Readiness Audit

Date: 2026-06-21

## Readiness Summary

Current implementation target: 8.4/10 learner-side readiness.

Implemented:
- Official framework labels: LOOK, TAP, TRY, CHOOSE, PLAY, STAR, PROGRESS, MASTERED.
- Official 1-8 stage numbering without Reward/Mastery collapsing.
- Explicit persisted `completedStagesByTopic`.
- Explicit persisted `masteredTopics`.
- Grade 1-3 curriculum-specific Play renderer paths for sentence building, word categories, mini stories, number lines, counters, shape properties, time, vocabulary relationships, community scenarios, place value, measurement, word problems, multiplication, passages, context clues, fractions, division, money, and multi-step solving.
- Practice versus Challenge differentiation: Practice is guided recall, Challenge is independent timed application.
- Rank service and UI using sanitized leaderboard snapshot paths with global and level scopes.
- Grade-scoped reward cards for level badge, world badge, and achievement path.
- Topic image fallback registry behavior for Grade 1-3 topics.
- Analytics writes for Play Practice, Play Challenge, and quizzes.

Partially Implemented:
- Drag-and-drop tasks are represented as tap-to-place/tap-to-choose mobile interactions.
- Grade 1-3 renderer models now show manipulatives and evidence, but deeper adaptive scoring by competency is still a next phase.
- Mobile layout constraints are in code, but physical device QA is still pending.

Recommended Next Phase:
- Add dedicated Grade 1-3 topic artwork files.
- Add full drag physics where developmentally valuable.
- Add backend-owned leaderboard snapshot generation and scheduled cleanup.
- Add automated visual/device tests for small Android, large Android, and tablet.

## Firestore Schema Updates

`users/{uid}.learnerProgress.completedStagesByTopic`

```json
{
  "grade2-place-value:Ones": {
    "topicId": "grade2-place-value:Ones",
    "worldId": "grade2-place-value",
    "completedStages": ["discover", "explore", "interact"],
    "lastCompletedAt": "ISO timestamp"
  }
}
```

`users/{uid}.learnerProgress.masteredTopics`

```json
{
  "grade2-place-value:Ones": {
    "topicId": "grade2-place-value:Ones",
    "worldId": "grade2-place-value",
    "masteredAt": "ISO timestamp"
  }
}
```

`quizAttempts/{attemptId}` now supports:
- `activityType`: `practice`, `challenge`, or `quiz`
- `topicId`
- `worldId`
- `attempts`
- `timeSpentSeconds`
- `completed`
- `percentage`

`leaderboards/global/entries/{uid}` and `leaderboards/levels/{levelId}/entries/{uid}` store sanitized Rank snapshots:

```json
{
  "uid": "learner uid",
  "nickname": "Learner nickname",
  "avatar": "B",
  "curriculumLevel": "Grade 2",
  "stars": 12,
  "xp": 420,
  "updatedAt": "ISO timestamp"
}
```

The learner app no longer reads private `users` documents for Rank. Firestore rules allow signed-in reads only for sanitized leaderboard entry fields and keep writes admin-only.

## Curriculum Alignment

Preschool:
- Keeps image-first, audio-first, tap/count/match actions.
- Challenge uses hunt/count/find tasks with less support.

Kindergarten:
- Keeps letters, sounds, oral language, symbols, patterns, and object-picture matching.
- Challenge removes extra scaffolding.

Grade 1:
- Word Kingdom uses category sorting.
- Reading Quest and Nature Explorer use sentence building.
- Family Story Village uses mini story evidence prompts.
- Number Kingdom uses a number line.
- Math Mountain uses add/take-away counters.
- Shape Adventure uses shape property sorting.
- Time Town uses clock/routine matching.

Grade 2:
- Place value uses hundreds/tens/ones.
- Measurement compares object attributes.
- Word problems use one-step and two-step math stories.
- Multiplication uses equal groups.
- Vocabulary/community/story worlds remain relationship and meaning based.

Grade 3:
- Reading/story worlds use passage comprehension.
- Context clue worlds ask meaning from sentence evidence.
- Fractions use equal-part selection.
- Division uses equal sharing.
- Money uses coin/bill value and change.
- Number worlds use multi-step operations.

Flagged follow-up:
- Dedicated Grade 1-3 per-topic illustration files are not present in the asset pack. The app now maps upper-grade topics to the closest instructional world/task artwork instead of unrelated generic images.

## Mobile QA Report

See [mobile-qa-report.md](mobile-qa-report.md).

## Production Readiness Checklist

- Child learner fit: Pass.
- Active learning fit: Pass.
- Phase semantics: Pass.
- Practice safety: Pass.
- Challenge safety: Pass.
- Asset fit: Pass with Grade 1-3 fallback note.
- Mobile fit: Pass by layout constraints; physical QA still recommended.
- Durable progress: Pass.
- Explicit mastery: Pass.
- Leaderboard: Pass for sanitized read model; backend snapshot writer remains recommended next phase.
- Analytics: Pass.
- Security: No secrets added; no auth weakening.
