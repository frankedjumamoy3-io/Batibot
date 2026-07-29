# PLAY Stage Outcome, Scoring, Retake, And Shuffle Fix Report

Scope: Grade 1 PLAY activities first, with shared helpers used by Grade 2 station activities.

| Area | Implemented correction |
| --- | --- |
| Files modified | `app/(tabs)/play.tsx`, `src/presentation/hooks/useLessonChallengeTimer.ts` |
| PLAY scoring added | Added reusable score helpers for sort, match, sequence, hunt, clock, and round/station activities. First attempts are recorded so later correction does not erase early mistakes. |
| One-attempt flow added | Each scored unit now accepts one answer, records selected answer and correct answer, locks that unit, and advances to the next question/action. |
| Wrong-answer advancement | Wrong sort placements, match choices, sequence choices, hunt taps, clock hours, round choices, and Grade 2 station choices no longer repeat immediately in the same attempt. |
| Failed attempt tracking added | PLAY failed attempts are tracked by topic id, so each topic has its own remediation count. |
| Passing threshold added | Added default 80% pass threshold, plus a parser hook for future topic mastery conditions that include a percent. |
| Retake logic added | First and second failed outcome cards show `Retake Challenge`; retake resets selections, score state, outcome state, timer, and attempt shuffle seed without changing topic or stage. |
| 3-fail remediation added | On the third failed PLAY attempt, the outcome changes to `Let's practice first, then try again.` and the action becomes `Practice First`, which returns the learner to TRY for the same topic. |
| Stronger hint added | After the second failed attempt, the failed outcome card includes the activity hint before the next retake. |
| Shuffle logic added | Sort cards, match sides, sequence cards, hunt cards, clock rounds, round order, answer options, and Grade 2 stations shuffle once per attempt or retake. |
| Timer failure behavior added | Advanced PLAY timeout now shows a score outcome instead of instantly marking mastery progress. A completed failed attempt stops the timer, and Retake resets the parent timer through a reset key. |
| STAR/mastery gate | Parent Next/STAR/mastery gating remains intact: PLAY calls completion only after the learner passes, so STAR, PROGRESS, and MASTERED stay locked below threshold. |
| Outcome UI | Added a score outcome card with pass/fail status, score percentage, correct count, total count, required score, success text, and Retake button on failure. |
| Ambiguous hint removed | Replaced `Complete the PLAY action.` with `Complete the challenge to see your score.` |

Grade 1 spot checks covered:

- Nouns: one noun card per question, one bin answer, then advance.
- Verbs: one action match per question, one answer, then advance.
- Adjectives: one description match per question, one answer, then advance.
- Greater Than: one round-choice question at a time, one answer, then advance.
- Clock: one hour prompt at a time, one hour answer, then advance.
- Morning: one routine-order question at a time, one answer, then advance.
- Addition Facts: one math round at a time, one answer, then advance.
- Story Characters: one story-character round at a time, one answer, then advance.

Remediation behavior:

- Failed attempt 1: `Almost! Try the challenge again.`
- Failed attempt 2: `One more practice try. Use the hint.`
- Failed attempt 3+: `Let's practice first, then try again.` and route back to TRY.
- Passing PLAY resets the topic failed-attempt count to 0.

Validation:

- `npm run typecheck` passed.
- `npm run validate:active-learning-framework` passed.
- `npm run lint` passed.
