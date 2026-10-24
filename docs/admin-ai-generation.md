# Admin AI generation

Admin Dashboard → Quiz Console now has a **Generate quiz with AI** action. Select the grade, world, topic, objective, question count (1–20) and optional guidance. Generated multiple-choice questions open in the existing editor. Review, save, reopen, preview and complete the review checklist before publishing.

Create AI Draft generates complete lesson-stage content, saves it to the Node API, and opens the review screen. Validate saved content, approve it, then publish. Unsaved edits cannot be approved or published. Network or provider failures display an actionable error rather than a successful local-template draft.

## Implementation

- `src/infrastructure/gemini/quiz-draft-client.ts` uses authenticated Node generation routes with a longer request timeout.
- `src/components/admin/ControlledQuizConsole.tsx` owns quiz generation controls, loading state, editing and error display.
- `src/data/repositories/api-content-repository.ts` handles durable lesson-draft CRUD and timestamp adaptation.
- Admin Settings reads OpenAI configuration from the backend; it does not infer readiness from a frontend URL.
- Authoring choices use the actual learner curriculum rather than the old example topic names. Published lookups also include the full topic identifier, preserving distinctions between topics whose display titles omit number ranges.
- Published lesson content is loaded through the API into the existing learner renderer. `MatchingMission` replaces static matching previews with tap-to-match interaction and feedback sounds. Progression requires all pairs. TAP requires a reveal. Switching stages resets local interaction state.
- Lesson asset references are passed through the existing registry adapter. The backend only permits bundled identifiers; generated lesson data does not invent remote images or audio files.

Backend rollout instructions are in `Batibot-backend/docs/admin-ai-generation.md`. Deploy the backend and migration, configure its OpenAI key/model, and rebuild this frontend with the API base URL. This repository contains no OpenAI secret. The legacy topic editor and remote uploads are separate workflows.

## Checks

- `npm run test:admin-ai`: Node authentication and generation routing, provider failures, no silent template fallback, persistence errors, lesson generation/validation, published learner loading and asset adaptation.
- `npm run test:api-integration`: session security and quiz API integration.
- `npm run test:lesson-media`: matching assets and feedback audio regression tests.
- Type checking, lint, architecture, active-learning and asset-resolution validation; web export.
- Backend tests verify generation → save → reopen → review → publish with simulated provider responses.
- Browser checks with simulated API responses passed: admin login, Generate, edit, save/reopen, review gate, publish and visible missing-key error. A 390px learner check passed published lesson loading, TAP reveal, correct/wrong choices, stage reset, matching retry/completion and progression to Reward.

Live provider verification requires a configured backend key. In this implementation environment, the opt-in smoke command returned `AI_NOT_CONFIGURED` before any external request.

The active backend now uses OpenAI Responses with `OPENAI_MODEL=gpt-6.1-sol` and server-only `OPENAI_API_KEY`. Existing Gemini records remain compatible; newly generated quizzes keep their OpenAI model attribution throughout saving, review and learner loading. The legacy Firebase request path retains its old names and is inactive when `USE_NODE_BACKEND=true`.
