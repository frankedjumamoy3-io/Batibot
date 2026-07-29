# Admin Platform Phase 1

## Purpose

Phase 1 establishes the module and workflow boundaries for AI-assisted content curation. It does not claim that Gemini generation, upload, complete validation, or learner publishing are finished.

## Ownership

- `app/(admin)` and `src/components/admin`: admin presentation, navigation, forms, tables, and module states.
- `src/application/admin`: admin use cases that coordinate domain rules and persistence services.
- `src/domain/admin`: lifecycle, stage, topic-shell, placement, and service contracts with no React or Firebase dependency.
- `src/infrastructure/admin`: Firestore collection names and future Firebase/Gemini adapters.
- `src/services/admin`: current migration bridge. Existing services remain operational while later phases move adapters behind domain ports.

## Phase 1 Workflow

1. Admin selects an existing grade and world.
2. Admin enters a topic title, optional objective, order, and notes.
3. `beginTopicCreation()` validates admin access and required identity fields.
4. `initializeAdminTopicDraft()` resolves stage templates and creates an empty LOOK, TAP, TRY, CHOOSE, PLAY, REWARD shell.
5. The draft is saved with `draft` status and opens in Draft Review.
6. Gemini, validation, approval, and publishing remain explicit later workflow actions.

## Persistence

Collection names are centralized in `src/infrastructure/admin/admin-firestore-collections.ts`:

- `contentDrafts`
- `publishedContent`
- `adminAssets`
- `curriculumMetadata`
- `stageTemplates`

Static curriculum files are not overwritten by the admin foundation.

## Security

The `(admin)` route group uses the existing profile and allowed-email guard. Application and write-service entry points also call `requireAdmin()` so navigation alone cannot authorize a write.

## Later Phases

- Metadata and rules engine refinement
- Structured Gemini generation
- Shared learner/admin renderer completion
- Local file selection and Storage upload hardening
- Full validation, approval, topic placement, and learner runtime publishing
