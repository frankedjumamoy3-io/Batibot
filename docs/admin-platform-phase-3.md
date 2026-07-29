# Admin Platform Phase 3: Metadata API and Rules Engine

Phase 3 introduces one canonical, typed metadata API for admin authoring. The API reads the
existing learner `CURRICULUM` tree and returns structure and rules only. It does not copy lesson
instructions, passages, questions, choices, answers, or other educational content into templates.

## Ownership

- `src/data/curriculum/learning-path.ts` remains the authoritative grade, world, and topic source.
- `src/domain/admin/curriculum-metadata.ts` owns metadata and rules contracts without React,
  Expo, or Firebase dependencies.
- `src/services/admin/batibotMetadataApi.ts` indexes and normalizes learner curriculum data,
  resolves templates, creates empty topic shells, and reports developer diagnostics.
- `src/services/admin/adminTopicDraftService.ts` persists editable topic drafts and stores a
  template/rules snapshot outside editable stage content.

The older `batibotCurriculumApi.ts` remains a temporary compatibility adapter for the existing
AI draft flow. Phase 4 can migrate that flow after structured Gemini generation is implemented.

## Deterministic Resolution

World template resolution uses an explicitly configured source topic when available. Otherwise,
it chooses the first complete, non-challenge topic. Challenge topics are never template sources.
The resolved template contains the fixed `LOOK -> TAP -> TRY -> CHOOSE -> PLAY -> REWARD` order,
renderer/layout keys, editable and locked fields, activity rules, choice constraints, asset slots,
feedback behavior, timer rules, and mobile layout constraints.

New topics are placed immediately before the detected challenge topic. If a world has no explicit
challenge topic, the API returns the append index and emits a development warning; it does not
reorder existing topics.

## Empty Topic Shells

`createEmptyTopicShell()` creates all six required stages with empty educational content and a
resolved `WorldTopicTemplate` snapshot. Admins can edit only stage content fields. Header,
progress, renderer, layout, stage order, world theme, feedback position, and primary button remain
platform-owned.

## Diagnostics

The metadata index detects duplicate grade/world/topic IDs, missing or misplaced challenge topics,
missing stage templates, unsupported activity types, invalid asset slot rules, and missing valid
template sources. Unknown identifiers throw `BatiBotMetadataError` rather than being silently
mapped.

## Deferred

Gemini transport and prompt construction, final learner-equivalent preview, asset upload,
approval/publishing, and learner runtime overrides remain deferred to Phases 4-8.
