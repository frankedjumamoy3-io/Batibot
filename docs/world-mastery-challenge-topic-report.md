# Word Kingdom Mastery Challenge Fix Report

## Scope

Grade 1 Word Kingdom.

## Implemented Correction

| Topic | Issue | Severity | Implemented correction |
| --- | --- | --- | --- |
| Word Kingdom topic sequence | The visible world repeated the same competencies as separate topics: Nouns/Naming Words, Verbs/Action Words, and Adjectives/Describing Words. | High | Rebuilt the visible sequence as Nouns, Verbs, Adjectives, and Word Kingdom Mastery Challenge. |
| Word Kingdom Mastery Challenge | No final combined topic existed to check noun, verb, and adjective understanding together. | High | Added a combined mastery topic with LOOK/TAP/TRY/CHOOSE/PLAY blueprint content. |
| Word Kingdom PLAY | The final challenge needed an activity that used the competency, not another generic quiz. | High | Added `Word Job Mastery Sort`, a sort challenge across Nouns, Verbs, and Adjectives. |
| Word Kingdom progress copy | Legacy progress text still referenced six topics. | Medium | Updated Word Kingdom progress copy to reference four topics. |

## Learner Flow

1. Nouns
2. Verbs
3. Adjectives
4. Word Kingdom Mastery Challenge

## Mastery Challenge Behavior

The mastery challenge asks learners to sort words by job:

- Nouns name people, animals, places, or things.
- Verbs tell actions.
- Adjectives describe nouns.

The PLAY activity uses scored sort items so it works with the existing one-attempt scoring, retake, and STAR/mastery gate.

## Validation

- `npm run typecheck` passed.
- `npm run validate:active-learning-framework` passed.
- `npm run lint` passed.
