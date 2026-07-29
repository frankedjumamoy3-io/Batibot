# BatiBot UI Audit

Read `AGENTS.md` first and follow it as the source of truth.

Use these viewpoints:
- Child UI/UX designer
- QA tester
- React Native / Expo frontend engineer
- Curriculum-to-UI reviewer

Check:
- Child-friendliness and visual clarity
- Button size, spacing, and safe-area behavior
- `LOOK`, `TAP`, `TRY`, `CHOOSE`, `PLAY`, reward, progress, and mastery rhythm
- Passive stages that should require action
- Missing or unclear success and retry feedback
- Choice-count validity: only 2 or 4 choices for choice-based `TAP`, `TRY`, and `CHOOSE`
- Centralized asset resolver usage
- Correct answer, duplicate answer, and distractor integrity

Do not edit during the first pass. Audit first, list issues, and propose a fix plan.

Return:
1. Major issues
2. Minor issues
3. Recommended fixes
4. Files to edit
5. Validation commands to run
