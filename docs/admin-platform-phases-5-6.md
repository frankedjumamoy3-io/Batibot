# Admin Platform Phases 5-6

## Shared renderer

`LearnerStageRenderer` now consumes three independent inputs: a BatiBot-owned `StageTemplate`,
editable `StageTemplateContent`, and local/runtime `StageRuntimeState`. The renderer owns the standard
header, progress, instruction, content, feedback, button structure, responsive choice cards, and
asset placement. It does not import learner progress, rewards, routing, Firestore, Gemini, or asset
upload services.

The learner published-content path continues through a controlled legacy adapter. This preserves
the existing learner callbacks and side effects while translating legacy template/content records
into the shared contract. The Phase 2 topic editor uses the canonical Phase 3 template directly.

Admin preview uses `mode="adminPreview"` and local Default/Correct/Wrong runtime state. It invokes no
learner persistence callbacks. World backgrounds resolve through the centralized asset registry
when a registered background reference exists.

## Asset library

Admin assets are stored in Firestore at `adminAssets/{assetId}`. Uploaded files use:

`admin-assets/{gradeLevel}/{worldId}/{topicId}/{assetId}/{filename}`

or `admin-assets/shared/{assetId}/{filename}` when no curriculum scope is selected.

The service supports guarded image/audio upload, MIME and size validation, paginated listing,
search and curriculum filters, metadata updates, reads, stage-slot validation, and archive status.
Files are not physically deleted by the admin UI. If Storage succeeds but Firestore metadata fails,
the service reports a recoverable partial failure and logs the orphaned path in development.

Web admin supports local image and audio selection. Native admin uses the existing image picker;
native audio selection remains unavailable because the project has no document-picker dependency.

## Draft integration

The topic editor exposes template asset slots for the active stage only. Attaching or replacing an
asset updates the lightweight draft reference and shared preview immediately. Validation checks
only current-stage references, required counts, duplicate references, slot compatibility, registry
or Firestore existence, status, and URI readiness.

## Security

Every asset service operation calls `requireAdmin`. Firestore rules restrict `adminAssets` to
approved admins. Storage rules restrict `admin-assets/**` to approved admins and enforce matching
image/audio MIME and size limits. Learners cannot list draft assets or upload admin files.

## Deferred

Phase 4 structured Gemini generation is not present in the current repository and was not
fabricated here. Final approval/publishing validation and general learner runtime published-content
resolution remain Phase 7 and Phase 8 work.
