# Kindergarten Curriculum Structure Update

This document records the strengthened Kindergarten curriculum design for BatiBot. It keeps the existing Kindergarten worlds and topics while adding reusable metadata for foundational literacy, oral language, early reading, and numeracy.

## Design Rules

- Keep the existing Kindergarten worlds.
- Keep existing topics and refine them with support metadata.
- Use the BatiBot active learning rhythm: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, Mastery.
- Keep one node per stage through `src/domain/rules/lesson-node-rules.ts`.
- Keep prompts short, visual, audio-supported, and suitable for Kindergarten.
- Prefer listening, tapping, matching, counting, tracing, sorting, and simple recognition.
- Avoid long reading tasks.

## TypeScript Schema

Kindergarten topics now use optional `kindergartenSupport` metadata on `CurriculumTopic`:

```ts
interface KindergartenTopicSupport {
  audioPrompt?: string;
  beginningSound?: string;
  beforeAfter?: {
    after?: string;
    before?: string;
  };
  countingObjects?: number;
  lowercase?: string;
  moreLess?: boolean;
  objectMatch?: string;
  oralPrompt?: string;
  patternType?: "AB" | "AAB" | "ABC";
  pictureMatch?: string[];
  soundExamples?: string[];
  stagePrompts?: Partial<Record<ActiveLearningPhase, string>>;
  uppercase?: string;
  wordMatch?: string[];
}
```

The metadata is attached only to the Kindergarten grade in `src/data/curriculum/learning-path.ts`, so the base curriculum structure remains intact.

## World Updates

### Alphabet Island

Topics kept:

- What is Alphabet?
- Letter A to Letter Z

Added support:

- Letter sound for each letter.
- Beginning sound examples, such as A for Apple, B for Ball, C for Cat.
- Uppercase and lowercase matching.
- Target-letter finding.
- Listen, tap, match, say, and timed recognition activities.

### School World

Topics kept:

- Pencil, Crayon, Notebook, Eraser, Desk, Chair, Book, Bag
- Existing school intro and related school topics remain.

Added support:

- Oral prompts: "What is this?", "Say Pencil.", "Tap the school item."
- Image-to-word and word-to-image matching metadata.
- Listening and tapping prompts for classroom objects.

### Community Village

Topics kept:

- Teacher, Doctor, Nurse, Police Officer, Firefighter, Farmer

Added support:

- Role prompts:
  - Teacher: "Who helps us learn?"
  - Doctor/Nurse: "Who helps sick people?"
  - Police Officer: "Who keeps us safe?"
  - Firefighter: "Who puts out fire?"
  - Farmer: "Who grows food?"
- Helper-to-workplace/object matching.

### Nature World

Topics kept:

- Sun, Moon, Cloud, Rain, Tree, Flower

Added support:

- Observation prompts: "What do you see?", "Is it day or night?", "Tap the nature object."
- Listening and picture identification.
- Simple nature object matching.

### Number Forest

Topics kept:

- Number 11 to Number 20

Added support:

- Visual object counting from 11 to 20.
- Number recognition and number-to-group matching.
- Number order, before-and-after, and more-or-less metadata.
- Counting-first prompts with minimal text.

### Shape Kingdom

Topics kept:

- Circle, Square, Triangle, Rectangle, Oval

Added support:

- Shape recognition, tracing, sorting, and object matching.
- Examples:
  - Circle -> Ball
  - Rectangle -> Book
  - Square -> Block
  - Triangle -> Roof
  - Oval -> Egg

### Pattern Valley

Topics kept:

- Color Patterns, Shape Patterns, Number Patterns, Object Patterns

Added support:

- Simple AB and AAB pattern activities.
- "What comes next?" prompts.
- Color, shape, number, and object pattern completion.

## Reuse In Play And Admin

- The Play screen reads `kindergartenSupport` and feeds it into existing lesson copy. No new visual panels were added, which protects the current UI/UX layout from overlap or hidden controls.
- The BatiBot curriculum draft API includes Kindergarten support metadata in the Gemini prompt contract, so admin-generated drafts can align to the same literacy and numeracy design.
