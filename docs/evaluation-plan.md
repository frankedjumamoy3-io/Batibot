# BatiBot Evaluation Plan

This plan supports the Chapter I requirement to evaluate BatiBot in terms of functionality, usability, learner engagement, content management reliability, and data security.

## Evaluation Areas

### Functionality

- Learner can create or resume a local profile with grade level.
- Learner sees only the selected grade module.
- Play shows grade-specific worlds and topics.
- Each Play topic follows Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery.
- Rank shows XP, level, stars, streak, completed worlds, words, quizzes, and learning updates.
- Reward shows badges, achievements, progress, and locked/unlocked states.
- Admin can create, generate, review, preview, validate, publish, unpublish, archive, and monitor Play content.

### Usability And Suitability

- Kindergarten and Preschool prompts are short and child-friendly.
- Touch targets are large enough for young learners.
- Text does not overlap, clip, or cover controls on common mobile sizes.
- Audio/speech prompts have visible alternatives.
- Play, Rank, and Reward navigation remains understandable without adult instructions.

### Learner Engagement

- Learners receive immediate feedback after meaningful actions.
- Rewards are visible and consistent.
- XP/stars/badges support motivation without hiding learning goals.
- Practice repeats known content with support.
- Challenge checks known content with less guidance.

### Content Management Reliability

- Admin-published content must include grade, world, topic, phase, node, asset, preview, and reward mapping.
- Mobile preview must be checked before publish.
- AI drafts must be validated before review/publish.
- Published content must be visible only in the matching learner grade/world/topic/phase.

### Data Security

- Admin routes require approved admin access.
- Gemini calls stay behind secure function layers.
- API keys and secrets are not stored in client screens.
- Learner local profiles do not require child email accounts.
- Firestore writes remain role-appropriate.

## Suggested Rating Scale

Use a 5-point scale:

1. Not working
2. Working with major issues
3. Working with minor issues
4. Working well
5. Working very well

## Minimum Acceptance Criteria

- TypeScript passes.
- Lint passes.
- Architecture boundary validation passes.
- Learner Play, Rank, and Reward are usable on mobile width without overlapping controls.
- Admin cannot publish unchecked or unmapped content.
- Curated content is filtered to the correct grade and Play placement.
