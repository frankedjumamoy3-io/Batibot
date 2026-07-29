# Vocabulary Copy Status

This file is now an archived companion note, not the active curriculum source.

Current source of truth: `src/data/vocabulary/learning-worlds.ts`

That file generates vocabulary items from the official Learning Worlds curriculum through `getAllCurriculumTopics()`. The active system should be treated as grade > world > topic > phase content for Play, Rank, and Reward alignment.

The previous dictionary-batch count is intentionally not used as a current product goal. BatiBot no longer frames the learner experience around a large standalone vocabulary row target; vocabulary exists as Play-map learning content with Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery support.

Runtime rule:
- Do not call a dictionary API from learner screens.
- Do not present legacy dictionary row counts as current app progress.
- Use Learning Worlds vocabulary for admin draft generation, learner Play content, reports, and Firestore sync.
