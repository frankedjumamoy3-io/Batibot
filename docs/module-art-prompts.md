# Module artwork

Generated with the built-in imagegen tool on 2026-10-25, with transparent backgrounds. Final PNGs are bundled under `assets/images/modules/` and registered in `src/data/play-assets.ts`. The existing central manifest and resolver make them available to topic cards and lesson illustrations, while approved remote assets retain priority.

The six Word Kingdom modules use these files:

| Module | File |
| --- | --- |
| Noun / Naming Words | `word-nouns.png` |
| Action Words / Verbs | `word-verbs.png` |
| Describing Words / Adjectives | `word-adjectives.png` |
| Opposite Words | `word-opposites.png` |
| Similar Words | `word-similar.png` |
| Word Challenge | `word-challenge.png` |

Nouns prompt:

> Use case: stylized-concept. Asset type: BatiBot children's learning module icon, square transparent PNG. Primary request: A friendly toy-like 3D open purple storybook with three small objects standing on its pages: a smiling Filipino child, a little school house, and a golden cat. Represents naming words (nouns). Large simple silhouettes, rounded edges, bright purple and golden accents, soft studio lighting, front three-quarter view, centered with generous transparent margin. No letters, no words, no watermark. Must read clearly at 80 pixels.

The other five prompts use this common wrapper, inserting the subject below:

> Use case: stylized-concept. Asset type: BatiBot children's learning module illustration and icon. Square transparent PNG. [Subject] Friendly toy-like 3D illustration, rounded edges, simple large silhouettes, purple and golden accents, soft studio lighting, centered front three-quarter view with transparent margin. Clear at 80 pixels. No text, letters, watermark, or background.

Subjects:

- Verbs: A smiling Filipino child in purple sports clothes joyfully jumping above a small grassy island, with curved motion swooshes. Represents action words.
- Adjectives: A large shiny red apple beside a small shiny green apple on a purple book. Represents describing words, red and green, big and small.
- Opposites: Two friendly toy trees on a tiny grassy island, one clearly tall and one clearly short, separated by a purple double-headed arrow. Represents opposite words.
- Similar: Two smiling golden happy face characters beside each other above an open purple book. Represents similar words, happy and glad.
- Challenge: An open purple storybook supporting a large golden star trophy, with a little purple castle behind it. Represents the word kingdom mastery challenge.

Other kingdoms continue to use their existing topic illustrations and semantic resolver fallbacks. No generated illustration is used to determine or change an activity's correct answer.
