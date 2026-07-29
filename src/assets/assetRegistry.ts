import type { ImageSourcePropType } from "react-native";

import {
  COUNTING_FOREST_ASSETS,
  FEEDBACK_ASSETS,
  PLAY_BACKGROUNDS,
  PRESCHOOL_CONCEPT_ASSETS,
  REUSABLE_LEARNING_ASSETS,
  REWARD_ASSETS,
  TOPIC_IMAGES,
  WORLD_IMAGES,
} from "@/src/data/play-assets";

export type BatibotAssetKey = string;
export type BatibotAssetGrade =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3"
  | "shared";

export type BatibotAssetMeta = {
  key: BatibotAssetKey;
  label: string;
  grade?: BatibotAssetGrade;
  world?: string;
  topic?: string;
  tags?: string[];
  source: ImageSourcePropType | null;
};

function asset(meta: BatibotAssetMeta): BatibotAssetMeta {
  return meta;
}

function toTitleLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function getEarlyLearnerGrade(key: string): BatibotAssetGrade | undefined {
  if (key.startsWith("preschool-")) return "preschool";
  if (key.startsWith("kindergarten-")) return "kindergarten";

  return undefined;
}

function getWorldIdForAssetKey(key: string) {
  return Object.keys(WORLD_IMAGES)
    .filter((worldId) => key === worldId || key.startsWith(`${worldId}-`))
    .sort((left, right) => right.length - left.length)[0];
}

function getTopicLabelForAssetKey(key: string) {
  const worldId = getWorldIdForAssetKey(key);
  const topicKey = worldId ? key.replace(`${worldId}-`, "") : key;

  return toTitleLabel(topicKey);
}

function getTagsForAssetKey(key: string, label: string) {
  return Array.from(
    new Set(
      [...key.split("-"), ...label.toLowerCase().split(/\s+/)]
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

const earlyLearnerWorldAssets = Object.fromEntries(
  Object.entries(WORLD_IMAGES)
    .filter(([key]) => key.startsWith("preschool-") || key.startsWith("kindergarten-"))
    .map(([key, source]) => {
      const label = toTitleLabel(key.replace(/^(preschool|kindergarten)-/, ""));

      return [
        `world.${key}`,
        asset({
          grade: getEarlyLearnerGrade(key),
          key: `world.${key}`,
          label,
          source,
          tags: getTagsForAssetKey(key, label),
          world: key,
        }),
      ];
    })
) as Record<string, BatibotAssetMeta>;

const earlyLearnerTopicAssets = Object.fromEntries(
  Object.entries(TOPIC_IMAGES)
    .filter(([key]) => key.startsWith("preschool-") || key.startsWith("kindergarten-"))
    .map(([key, source]) => {
      const label = getTopicLabelForAssetKey(key);
      const worldId = getWorldIdForAssetKey(key);

      return [
        `topic.${key}`,
        asset({
          grade: getEarlyLearnerGrade(key),
          key: `topic.${key}`,
          label,
          source,
          tags: getTagsForAssetKey(key, label),
          topic: label,
          world: worldId,
        }),
      ];
    })
) as Record<string, BatibotAssetMeta>;

export const batibotAssetRegistry: Record<string, BatibotAssetMeta> = {
  ...earlyLearnerWorldAssets,
  ...earlyLearnerTopicAssets,
  "action.jump": asset({
    key: "action.jump",
    label: "Jump",
    grade: "shared",
    tags: ["jump", "action", "verb"],
    source: REUSABLE_LEARNING_ASSETS.actions.jump,
  }),
  "action.read": asset({
    key: "action.read",
    label: "Read",
    grade: "shared",
    tags: ["read", "reading", "book", "action", "verb"],
    source: REUSABLE_LEARNING_ASSETS.actions.read,
  }),
  "action.run": asset({
    key: "action.run",
    label: "Run",
    grade: "shared",
    tags: ["run", "running", "runner", "fast", "action", "verb"],
    source: REUSABLE_LEARNING_ASSETS.actions.run,
  }),
  "action.write": asset({
    key: "action.write",
    label: "Write",
    grade: "shared",
    tags: ["write", "writing", "pencil", "action", "verb"],
    source: REUSABLE_LEARNING_ASSETS.actions.write,
  }),
  "adjective.big": asset({
    key: "adjective.big",
    label: "Big",
    grade: "kindergarten",
    world: "kindergarten-big-small",
    tags: ["big", "large", "size"],
    source: PRESCHOOL_CONCEPT_ASSETS.bigSmall.big,
  }),
  "adjective.bright": asset({
    key: "adjective.bright",
    label: "Bright",
    grade: "shared",
    tags: ["bright", "sun", "light"],
    source: REUSABLE_LEARNING_ASSETS.nature.sun,
  }),
  "adjective.cold": asset({
    key: "adjective.cold",
    label: "Cold",
    grade: "shared",
    tags: ["cold", "water"],
    source: REUSABLE_LEARNING_ASSETS.nature.water,
  }),
  "adjective.fast": asset({
    key: "adjective.fast",
    label: "Fast",
    grade: "shared",
    tags: ["fast", "quick", "run", "running"],
    source: REUSABLE_LEARNING_ASSETS.actions.run,
  }),
  "adjective.hot": asset({
    key: "adjective.hot",
    label: "Hot",
    grade: "shared",
    tags: ["hot", "sun"],
    source: REUSABLE_LEARNING_ASSETS.nature.sun,
  }),
  "adjective.slow": asset({
    key: "adjective.slow",
    label: "Slow",
    grade: "shared",
    tags: ["slow", "walking"],
    source: REUSABLE_LEARNING_ASSETS.animals.dog,
  }),
  "adjective.small": asset({
    key: "adjective.small",
    label: "Small",
    grade: "kindergarten",
    world: "kindergarten-big-small",
    tags: ["small", "tiny", "size"],
    source: PRESCHOOL_CONCEPT_ASSETS.bigSmall.small,
  }),
  "animal.cat": asset({
    key: "animal.cat",
    label: "Cat",
    grade: "preschool",
    world: "preschool-animal-adventure",
    tags: ["cat", "animal"],
    source: REUSABLE_LEARNING_ASSETS.animals.cat,
  }),
  "animal.dog": asset({
    key: "animal.dog",
    label: "Dog",
    grade: "preschool",
    world: "preschool-animal-adventure",
    tags: ["dog", "puppy", "animal", "noun"],
    source: REUSABLE_LEARNING_ASSETS.animals.dog,
  }),
  "animal.fish": asset({
    key: "animal.fish",
    label: "Fish",
    grade: "preschool",
    world: "preschool-animal-adventure",
    tags: ["fish", "animal"],
    source: REUSABLE_LEARNING_ASSETS.animals.fish,
  }),
  "character.ben": asset({
    key: "character.ben",
    label: "Ben",
    grade: "preschool",
    tags: ["ben", "boy", "character"],
    source: TOPIC_IMAGES["preschool-family-world-brother"],
  }),
  "character.girl": asset({
    key: "character.girl",
    label: "Girl",
    grade: "preschool",
    tags: ["girl", "character"],
    source: TOPIC_IMAGES["preschool-family-world-sister"],
  }),
  "direction.down": asset({
    key: "direction.down",
    label: "Down",
    grade: "shared",
    tags: ["down", "direction"],
    source: null,
  }),
  "direction.up": asset({
    key: "direction.up",
    label: "Up",
    grade: "shared",
    tags: ["up", "direction"],
    source: null,
  }),
  "emotion.happy": asset({
    key: "emotion.happy",
    label: "Happy",
    grade: "preschool",
    tags: ["happy", "glad", "smiling", "emotion"],
    source: TOPIC_IMAGES["preschool-family-world-friend"],
  }),
  "emotion.sad": asset({
    key: "emotion.sad",
    label: "Sad",
    grade: "grade1",
    tags: ["sad", "emotion"],
    source: FEEDBACK_ASSETS.wrong.grade1,
  }),
  "math.divide": asset({
    key: "math.divide",
    label: "Divide",
    grade: "shared",
    tags: ["divide", "division", "sharing", "division symbol"],
    source: null,
  }),
  "math.equal": asset({
    key: "math.equal",
    label: "Equal",
    grade: "shared",
    tags: ["equal", "equals", "same", "="],
    source: PRESCHOOL_CONCEPT_ASSETS.moreLess.equal,
  }),
  "math.fraction.half": asset({
    key: "math.fraction.half",
    label: "One Half",
    grade: "shared",
    tags: ["half", "one half", "fraction", "1/2"],
    source: null,
  }),
  "math.fraction.quarter": asset({
    key: "math.fraction.quarter",
    label: "One Fourth",
    grade: "shared",
    tags: ["quarter", "one fourth", "fraction", "1/4"],
    source: null,
  }),
  "math.fraction.third": asset({
    key: "math.fraction.third",
    label: "One Third",
    grade: "shared",
    tags: ["third", "one third", "fraction", "1/3"],
    source: null,
  }),
  "math.greaterThan": asset({
    key: "math.greaterThan",
    label: "Greater Than",
    grade: "shared",
    tags: ["greater", "greater than", "more", ">"],
    source: PRESCHOOL_CONCEPT_ASSETS.moreLess.more,
  }),
  "math.lessThan": asset({
    key: "math.lessThan",
    label: "Less Than",
    grade: "shared",
    tags: ["less", "less than", "fewer", "<"],
    source: PRESCHOOL_CONCEPT_ASSETS.moreLess.less,
  }),
  "math.minus": asset({
    key: "math.minus",
    label: "Minus",
    grade: "shared",
    tags: ["minus", "subtract", "subtraction", "-"],
    source: null,
  }),
  "math.multiply": asset({
    key: "math.multiply",
    label: "Multiply",
    grade: "shared",
    tags: ["multiply", "multiplication", "groups", "array", "multiplication symbol"],
    source: null,
  }),
  "math.plus": asset({
    key: "math.plus",
    label: "Plus",
    grade: "shared",
    tags: ["plus", "add", "addition", "+"],
    source: null,
  }),
  "money.bill": asset({
    key: "money.bill",
    label: "Bill",
    grade: "shared",
    tags: ["bill", "peso", "money"],
    source: null,
  }),
  "money.coin": asset({
    key: "money.coin",
    label: "Coin",
    grade: "shared",
    tags: ["coin", "peso", "money"],
    source: null,
  }),
  "number.range.1_20": asset({
    key: "number.range.1_20",
    label: "1-20",
    grade: "shared",
    tags: ["1-20", "numbers 1 20", "number range"],
    source: COUNTING_FOREST_ASSETS.numbers.count,
  }),
  "number.range.21_50": asset({
    key: "number.range.21_50",
    label: "21-50",
    grade: "shared",
    tags: ["21-50", "numbers 21 50", "number range"],
    source: null,
  }),
  "number.range.51_100": asset({
    key: "number.range.51_100",
    label: "51-100",
    grade: "shared",
    tags: ["51-100", "numbers 51 100", "number range"],
    source: null,
  }),
  "object.ball": asset({
    key: "object.ball",
    label: "Ball",
    grade: "kindergarten",
    tags: ["ball", "object", "noun"],
    source: REUSABLE_LEARNING_ASSETS.objects.ball,
  }),
  "object.book": asset({
    key: "object.book",
    label: "Book",
    grade: "kindergarten",
    tags: ["book", "read", "object", "school"],
    source: TOPIC_IMAGES["kindergarten-school-book"],
  }),
  "person.boy": asset({
    key: "person.boy",
    label: "Boy",
    grade: "preschool",
    tags: ["boy", "person", "child", "noun"],
    source: TOPIC_IMAGES["preschool-family-world-brother"],
  }),
  "person.girl": asset({
    key: "person.girl",
    label: "Girl",
    grade: "preschool",
    tags: ["girl", "person", "child"],
    source: TOPIC_IMAGES["preschool-family-world-sister"],
  }),
  "place.school": asset({
    key: "place.school",
    label: "School",
    grade: "kindergarten",
    world: "kindergarten-school",
    tags: ["school", "place", "classroom"],
    source: WORLD_IMAGES["kindergarten-school"],
  }),
  "question.what": asset({
    key: "question.what",
    label: "What",
    grade: "shared",
    tags: ["what", "question"],
    source: null,
  }),
  "question.when": asset({
    key: "question.when",
    label: "When",
    grade: "shared",
    tags: ["when", "question", "time"],
    source: WORLD_IMAGES["grade1-time-town"],
  }),
  "question.where": asset({
    key: "question.where",
    label: "Where",
    grade: "shared",
    tags: ["where", "question", "place"],
    source: null,
  }),
  "question.who": asset({
    key: "question.who",
    label: "Who",
    grade: "shared",
    tags: ["who", "question", "person"],
    source: TOPIC_IMAGES["preschool-family-world-brother"],
  }),
  "reward.badge": asset({
    key: "reward.badge",
    label: "Badge",
    grade: "shared",
    tags: ["reward", "badge"],
    source: REWARD_ASSETS.badge,
  }),
  "story.bench": asset({
    key: "story.bench",
    label: "Bench",
    grade: "kindergarten",
    tags: ["bench", "story", "park"],
    source: null,
  }),
  "story.park": asset({
    key: "story.park",
    label: "Park",
    grade: "shared",
    tags: ["park", "story", "setting", "tree"],
    source: REUSABLE_LEARNING_ASSETS.nature.tree,
  }),
  "story.playground": asset({
    key: "story.playground",
    label: "Playground",
    grade: "kindergarten",
    tags: ["playground", "story", "park"],
    source: null,
  }),
  "story.puppy": asset({
    key: "story.puppy",
    label: "Puppy",
    grade: "preschool",
    tags: ["puppy", "dog", "story"],
    source: REUSABLE_LEARNING_ASSETS.animals.dog,
  }),
  "world.grade1.math": asset({
    key: "world.grade1.math",
    label: "Math Mountain",
    grade: "grade1",
    world: "grade1-math",
    tags: ["math", "addition", "subtraction"],
    source: WORLD_IMAGES["grade1-math"],
  }),
  "world.grade1.number": asset({
    key: "world.grade1.number",
    label: "Number Kingdom",
    grade: "grade1",
    world: "grade1-number-kingdom",
    tags: ["number", "numbers", "compare"],
    source: WORLD_IMAGES["grade1-number-kingdom"],
  }),
  "world.grade1.reading": asset({
    key: "world.grade1.reading",
    label: "Reading Quest",
    grade: "grade1",
    world: "grade1-reading",
    tags: ["reading", "story", "sentence"],
    source: WORLD_IMAGES["grade1-reading"],
  }),
  "world.grade1.word": asset({
    key: "world.grade1.word",
    label: "Word Kingdom",
    grade: "grade1",
    world: "grade1-word-kingdom",
    tags: ["word", "vocabulary", "noun", "verb"],
    source: WORLD_IMAGES["grade1-word-kingdom"],
  }),
  "world.grade2.measurement": asset({
    key: "world.grade2.measurement",
    label: "Measurement Harbor",
    grade: "grade2",
    world: "grade2-measurement",
    tags: ["measurement", "length", "height", "weight", "capacity"],
    source: WORLD_IMAGES["grade2-measurement"],
  }),
  "world.grade2.multiplication": asset({
    key: "world.grade2.multiplication",
    label: "Multiplication Workshop",
    grade: "grade2",
    world: "grade2-multiplication",
    tags: ["multiplication", "groups", "array"],
    source: WORLD_IMAGES["grade2-multiplication"],
  }),
  "world.grade2.placeValue": asset({
    key: "world.grade2.placeValue",
    label: "Place Value City",
    grade: "grade2",
    world: "grade2-place-value",
    tags: ["place value", "tens", "ones"],
    source: WORLD_IMAGES["grade2-place-value"],
  }),
  "world.grade2.problem": asset({
    key: "world.grade2.problem",
    label: "Problem Solver City",
    grade: "grade2",
    world: "grade2-problems",
    tags: ["problem", "word problem"],
    source: WORLD_IMAGES["grade2-problems"],
  }),
  "world.grade2.story": asset({
    key: "world.grade2.story",
    label: "Story Quest",
    grade: "grade2",
    world: "grade2-story",
    tags: ["story", "reading"],
    source: WORLD_IMAGES["grade2-story"],
  }),
  "world.grade2.vocabulary": asset({
    key: "world.grade2.vocabulary",
    label: "Vocabulary Village",
    grade: "grade2",
    world: "grade2-vocabulary",
    tags: ["vocabulary", "word", "synonym", "antonym"],
    source: WORLD_IMAGES["grade2-vocabulary"],
  }),
  "world.grade3.division": asset({
    key: "world.grade3.division",
    label: "Division Kingdom",
    grade: "grade3",
    world: "grade3-division",
    tags: ["division", "divide", "sharing"],
    source: WORLD_IMAGES["grade3-division"],
  }),
  "world.grade3.fraction": asset({
    key: "world.grade3.fraction",
    label: "Fraction Fortress",
    grade: "grade3",
    world: "grade3-fractions",
    tags: ["fraction", "half", "third", "fourth"],
    source: WORLD_IMAGES["grade3-fractions"],
  }),
  "world.grade3.money": asset({
    key: "world.grade3.money",
    label: "Money Market",
    grade: "grade3",
    world: "grade3-money",
    tags: ["money", "coin", "bill", "peso"],
    source: WORLD_IMAGES["grade3-money"],
  }),
  "world.grade3.multiplication": asset({
    key: "world.grade3.multiplication",
    label: "Multiplication Empire",
    grade: "grade3",
    world: "grade3-multiplication",
    tags: ["multiplication", "array", "groups"],
    source: WORLD_IMAGES["grade3-multiplication"],
  }),
  "world.grade3.number": asset({
    key: "world.grade3.number",
    label: "Number Empire",
    grade: "grade3",
    world: "grade3-number",
    tags: ["number", "operations", "multi step"],
    source: WORLD_IMAGES["grade3-number"],
  }),
  "world.grade3.reading": asset({
    key: "world.grade3.reading",
    label: "Reading Adventure",
    grade: "grade3",
    world: "grade3-reading",
    tags: ["reading", "vocabulary", "evidence"],
    source: WORLD_IMAGES["grade3-reading"],
  }),
  "world.grade3.story": asset({
    key: "world.grade3.story",
    label: "Story Adventure",
    grade: "grade3",
    world: "grade3-story-adventure",
    tags: ["story", "character", "setting"],
    source: WORLD_IMAGES["grade3-story-adventure"],
  }),
  "placeholder.grade1": asset({
    key: "placeholder.grade1",
    label: "Learning Picture",
    grade: "grade1",
    tags: ["placeholder", "grade1"],
    source: PLAY_BACKGROUNDS["Grade 1"],
  }),
  "placeholder.grade2": asset({
    key: "placeholder.grade2",
    label: "Learning Picture",
    grade: "grade2",
    tags: ["placeholder", "grade2"],
    source: PLAY_BACKGROUNDS["Grade 2"],
  }),
  "placeholder.grade3": asset({
    key: "placeholder.grade3",
    label: "Learning Picture",
    grade: "grade3",
    tags: ["placeholder", "grade3"],
    source: PLAY_BACKGROUNDS["Grade 3"],
  }),
};
