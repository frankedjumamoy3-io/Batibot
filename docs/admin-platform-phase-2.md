# Admin Platform Phase 2

Phase 2 adds structured topic authoring without changing learner runtime content.

## Draft Records

Topic drafts share the `contentDrafts` collection and use `recordType: "topicDraft"`. Existing AI content records remain separate and are excluded from topic-draft parsing.

The topic identity, grade, world, source topic ID, and six-stage order are immutable after creation. Published and submitted records are read-only in the Phase 2 editor.

## Authoring Flow

1. Select grade and world.
2. Create a new topic or choose an existing topic to copy.
3. Enter topic details and initialize the draft.
4. Edit LOOK, TAP, TRY, CHOOSE, PLAY, and REWARD through locked stage tabs.
5. Save explicitly and reopen from Content Drafts.
6. Submit only when basic structural completeness passes.

Existing-topic mode resolves current curriculum metadata into a separate editable draft. Static curriculum files are never updated.

## Deferred Boundaries

- Phase 3: world-specific metadata and rules enforcement
- Phase 4: Gemini generation
- Phase 5: learner-identical preview
- Phase 6: asset upload and assignment
- Phase 7: complete validation, approval, rejection, and publishing
- Phase 8: learner runtime overrides
