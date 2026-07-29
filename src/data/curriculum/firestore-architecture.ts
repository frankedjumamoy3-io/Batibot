import {
  ACTIVE_LEARNING_PHASES,
  CURRICULUM,
  DEFAULT_CHALLENGE_RULE,
  LEARNING_STAGE_RULES,
  XP_REWARDS,
  getWorldActivitySkillMode,
  type ActivitySkillMode,
  type ActiveLearningPhase,
  type CurriculumTopic,
  type CurriculumWorld,
} from "@/src/data/curriculum/learning-path";
import type { LearnerGradeLevel } from "@/src/types/user";

export type FirestorePublishStatus = "draft" | "published";

export interface FirestoreCurriculumLevelDocument {
  contentVersion: string;
  description: string;
  gradeLevel: LearnerGradeLevel;
  id: string;
  isPublished: boolean;
  order: number;
  sourceArchitecture: "learning-worlds";
  title: string;
}

export interface FirestoreWorldDocument {
  accentColor: string;
  activities: string[];
  badgeReward: string;
  contentVersion: string;
  curriculumLevel: string;
  description: string;
  emoji: string;
  gradeLevel: LearnerGradeLevel;
  id: string;
  isPublished: boolean;
  order: number;
  skillMode: ActivitySkillMode;
  sourceArchitecture: "learning-worlds";
  title: string;
}

export interface FirestoreTopicDocument {
  category: CurriculumTopic["category"];
  challengeRule: typeof DEFAULT_CHALLENGE_RULE;
  contentVersion: string;
  curriculumLevel: string;
  emoji: string;
  example: string;
  gradeLevel: LearnerGradeLevel;
  id: string;
  interactionTypes: CurriculumTopic["interactionTypes"];
  isPublished: boolean;
  learningOutcome: string;
  learningStages: ActiveLearningPhase[];
  order: number;
  skillMode: ActivitySkillMode;
  sourceArchitecture: "learning-worlds";
  subcategory: CurriculumTopic["subcategory"];
  title: string;
  worldId: string;
}

export interface FirestoreStageDocument {
  allowedContent: string;
  contentVersion: string;
  curriculumLevel: string;
  guidance: string;
  id: string;
  isEnabled: boolean;
  isPublished: boolean;
  learnerAction: string;
  order: number;
  purpose: string;
  skillMode: ActivitySkillMode;
  sourceArchitecture: "learning-worlds";
  stage: ActiveLearningPhase;
  topicId: string;
  worldId: string;
}

export interface FirestoreActivityDocument {
  activityType: string;
  content: {
    audioText: string;
    conceptLabel: string;
    countSequence?: string[];
    comparisonKind?: "size" | "quantity";
    leftCount?: number;
    objectCount?: number;
    objectType?: string;
    imageAssetId: string;
    patternAnswer?: string;
    patternSequence?: string[];
    rightCount?: number;
    skillMode: ActivitySkillMode;
    targetLabel?: string;
    targetNumber?: number;
    text: string;
  };
  contentVersion: string;
  curriculumLevel: string;
  id: string;
  instruction: string;
  isPublished: boolean;
  node: number;
  order: number;
  skillMode: ActivitySkillMode;
  sourceArchitecture: "learning-worlds";
  stage: Exclude<ActiveLearningPhase, "Challenge" | "Reward" | "Progress" | "Mastery">;
  title: string;
  topicId: string;
  worldId: string;
}

export interface FirestoreChallengeDocument {
  allowedContentSources: string[];
  challengeType: string;
  choices?: number[];
  contentVersion: string;
  correctChoice?: number;
  curriculumLevel: string;
  formula: string;
  guidanceLevel: "less-guided";
  id: string;
  instruction: string;
  introducesNewContent: false;
  isPublished: boolean;
  node: number;
  objectCount?: number;
  objectType?: string;
  retryLimit: number;
  skillMode: ActivitySkillMode;
  sourceArchitecture: "learning-worlds";
  targetNumber?: number;
  taskChange: string;
  topicId: string;
  worldId: string;
  introducedEarlier?: true;
}

export interface FirestoreRewardDocument {
  contentVersion: string;
  curriculumLevel: string;
  id: string;
  isPublished: boolean;
  sourceArchitecture: "learning-worlds";
  stars: number;
  title: string;
  topicId: string;
  worldId: string;
  xp: number;
}

export interface LearningArchitectureSnapshot {
  activities: FirestoreActivityDocument[];
  challenges: FirestoreChallengeDocument[];
  curriculumLevels: FirestoreCurriculumLevelDocument[];
  rewards: FirestoreRewardDocument[];
  stages: FirestoreStageDocument[];
  topics: FirestoreTopicDocument[];
  worlds: FirestoreWorldDocument[];
}

const CONTENT_VERSION = "2026-06-learning-world-architecture-v1";

const CURRICULUM_LEVEL_IDS: Record<LearnerGradeLevel, string> = {
  Preschool: "preschool",
  Kindergarten: "kindergarten",
  "Grade 1": "grade1",
  "Grade 2": "grade2",
  "Grade 3": "grade3",
};

const CURRICULUM_LEVEL_DESCRIPTIONS: Record<LearnerGradeLevel, string> = {
  Preschool: "Early vocabulary, body, family, color, shape, counting, size, amount, and pattern concepts.",
  Kindergarten: "Beginning alphabet, school, community, nature, reading, shape, number, pattern, math, and problem-solving concepts.",
  "Grade 1": "Beginning literacy, sentence understanding, number sense, time, shapes, and nature vocabulary.",
  "Grade 2": "Vocabulary reasoning, community words, place value, problem solving, measurement, and story response.",
  "Grade 3": "Reading comprehension, context clues, story elements, multiplication, division, fractions, money, and mastery review.",
};

const STAGE_ORDER: Record<ActiveLearningPhase, number> = ACTIVE_LEARNING_PHASES.reduce(
  (orders, stage, index) => ({
    ...orders,
    [stage]: index + 1,
  }),
  {} as Record<ActiveLearningPhase, number>
);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCurriculumLevelId(gradeLevel: LearnerGradeLevel) {
  return CURRICULUM_LEVEL_IDS[gradeLevel];
}

function getTopicId(worldId: string, topicTitle: string) {
  return `${worldId}-${slugify(topicTitle)}`;
}

function getTopicAssetId(worldId: string, topicTitle: string) {
  return `${worldId}-${slugify(topicTitle)}`;
}

function getNumberFromTopicTitle(topicTitle: string) {
  const match = topicTitle.match(/\d+/);

  return match ? Number(match[0]) : null;
}

function getCountingSet(topic: CurriculumTopic, world: CurriculumWorld) {
  const topicKey = slugify(topic.title);
  const numberFromTitle = getNumberFromTopicTitle(topic.title);

  if (getWorldActivitySkillMode(world.id) === "compare-quantity") {
    return null;
  }

  if (
    topic.subcategory !== "counting" &&
    !topic.interactionTypes.includes("Counting Activity")
  ) {
    return null;
  }

  if (world.id === "preschool-number-village" && numberFromTitle) {
    const objectByNumber: Record<number, string> = {
      1: "apple",
      2: "stars",
      3: "fish",
      4: "bananas",
      5: "balls",
      6: "flowers",
      7: "birds",
      8: "leaves",
      9: "grapes",
      10: "shapes",
    };

    return {
      objectType: objectByNumber[numberFromTitle] ?? "objects",
      objectCount: Math.min(numberFromTitle, 10),
      targetNumber: numberFromTitle,
    };
  }

  if (world.id === "preschool-counting-forest") {
    if (topicKey === "count-animals" || topicKey === "counting-animals") {
      return { objectType: "animals", objectCount: 6, targetNumber: 6 };
    }

    if (topicKey === "count-fruits" || topicKey === "counting-fruits") {
      return { objectType: "fruits", objectCount: 6, targetNumber: 6 };
    }

    if (topicKey === "count-food" || topicKey === "counting-foods") {
      return { objectType: "food", objectCount: 6, targetNumber: 6 };
    }

    if (topicKey === "count-shapes" || topicKey === "counting-shapes") {
      return { objectType: "shapes", objectCount: 5, targetNumber: 5 };
    }

    if (topicKey === "forest-counting-challenge" || topicKey === "counting-challenge") {
      return { objectType: "mixed forest objects", objectCount: 4, targetNumber: 4 };
    }

    return { objectType: "objects", objectCount: 4, targetNumber: 4 };
  }

  if (world.id === "kindergarten-number-forest") {
    return { objectType: "stars", objectCount: 5, targetNumber: 5 };
  }

  if (topic.interactionTypes.includes("Counting Activity")) {
    if (world.id === "preschool-fruit-garden") {
      return { objectType: "fruits", objectCount: 3, targetNumber: 3 };
    }

    if (world.id === "preschool-food-town") {
      return { objectType: "foods", objectCount: 3, targetNumber: 3 };
    }

    if (world.id === "preschool-more-less") {
      if (topicKey.includes("animal")) {
        return { objectType: "animals", objectCount: 5, targetNumber: 5 };
      }

      if (topicKey.includes("fruit")) {
        return { objectType: "fruits", objectCount: 5, targetNumber: 5 };
      }

      if (topicKey.includes("food")) {
        return { objectType: "foods", objectCount: 5, targetNumber: 5 };
      }

      if (topicKey.includes("shape")) {
        return { objectType: "shapes", objectCount: 5, targetNumber: 5 };
      }

      return { objectType: "comparison groups", objectCount: 5, targetNumber: 5 };
    }

    if (world.id === "grade3-money") {
      return { objectType: "coins", objectCount: 5, targetNumber: 5 };
    }

    return { objectType: "blocks", objectCount: 4, targetNumber: 4 };
  }

  if (topic.subcategory === "counting") {
    return { objectType: "blocks", objectCount: 4, targetNumber: 4 };
  }

  return null;
}

function getCountSequence(count: number) {
  const numberWords = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];

  return numberWords.slice(0, Math.max(0, Math.min(count, numberWords.length)));
}

function getNearbyChoices(answer: number) {
  if (answer <= 1) {
    return [1, 2, 3];
  }

  if (answer >= 10) {
    return [8, 9, 10];
  }

  const choices = [answer - 1, answer, answer + 1];

  return Array.from(new Set(choices)).slice(0, 3);
}

function getComparisonKind(skillMode: ActivitySkillMode) {
  if (skillMode === "compare-size") {
    return "size" as const;
  }

  if (skillMode === "compare-quantity") {
    return "quantity" as const;
  }

  return undefined;
}

function getPatternSequence(topic: CurriculumTopic) {
  const topicKey = slugify(topic.title);

  if (topicKey.includes("shape")) {
    return ["circle", "square", "circle", "square"];
  }

  if (topicKey.includes("animal")) {
    return ["cat", "dog", "cat", "dog"];
  }

  if (topicKey.includes("number")) {
    return ["1", "2", "1", "2"];
  }

  return ["red", "blue", "red", "blue"];
}

function getPatternAnswer(topic: CurriculumTopic) {
  return getPatternSequence(topic)[0];
}

function getBadgeReward(world: CurriculumWorld) {
  return `${world.title} Explorer`;
}

function getLearningOutcome(topic: CurriculumTopic, world: CurriculumWorld) {
  if (topic.example && !topic.example.includes("today's learning quest")) {
    return topic.example;
  }

  return `Identify and use ${topic.title} inside ${world.title}.`;
}

function getStageId(topicId: string, stage: ActiveLearningPhase) {
  return `${topicId}-${slugify(stage)}`;
}

function getActivityType(stage: FirestoreActivityDocument["stage"], node: number) {
  if (stage === "Discover") {
    return "concept-card";
  }

  if (stage === "Explore") {
    return "tap-listen-observe";
  }

  if (stage === "Practice") {
    return "supported-match";
  }

  return node === 1
    ? "tap-image"
    : node === 2
      ? "match-word-picture"
      : "listen-identify";
}

function getCountingActivityType(stage: FirestoreActivityDocument["stage"], node: number) {
  if (stage === "Discover") {
    return "count-object-set";
  }

  if (stage === "Explore") {
    return "tap-count-sequence";
  }

  if (stage === "Practice") {
    return "recall-number-quantity";
  }

  return node === 1
    ? "tap-count-sequence"
    : node === 2
      ? "count-with-batibot"
      : "choose-number";
}

function getThinkingActivityType(
  skillMode: ActivitySkillMode,
  stage: FirestoreActivityDocument["stage"],
  node: number
) {
  if (skillMode === "compare-size") {
    if (stage === "Discover") {
      return "size-comparison-pair";
    }

    if (stage === "Explore") {
      return "tap-size-pair";
    }

    if (stage === "Practice") {
      return "recall-size-label";
    }

    return node === 1
      ? "choose-size-target"
      : node === 2
        ? "match-size-word"
        : "sort-by-size";
  }

  if (skillMode === "compare-quantity") {
    if (stage === "Discover") {
      return "quantity-comparison-pair";
    }

    if (stage === "Explore") {
      return "tap-quantity-group";
    }

    if (stage === "Practice") {
      return "recall-quantity-comparison";
    }

    return node === 1
      ? "choose-more-less-equal"
      : node === 2
        ? "match-comparison-word"
        : "sort-quantity-groups";
  }

  if (skillMode === "predict-pattern") {
    if (stage === "Discover") {
      return "pattern-row";
    }

    if (stage === "Explore") {
      return "tap-pattern-sequence";
    }

    if (stage === "Practice") {
      return "recall-pattern-next";
    }

    return node === 1
      ? "tap-missing-pattern-spot"
      : node === 2
        ? "choose-next-pattern-item"
        : "pattern-builder";
  }

  return null;
}

function getActivityInstruction(
  topic: CurriculumTopic,
  stage: FirestoreActivityDocument["stage"],
  node: number
) {
  if (stage === "Discover") {
    return `Look at ${topic.title}.`;
  }

  if (stage === "Explore") {
    return `Tap and listen to ${topic.title}.`;
  }

  if (stage === "Practice") {
    return `Recall ${topic.title} from the picture or group.`;
  }

  return node === 1
    ? `Tap ${topic.title}.`
    : node === 2
      ? `Match ${topic.title} to its picture.`
      : `Listen and identify ${topic.title}.`;
}

function getCountingActivityInstruction(
  topic: CurriculumTopic,
  stage: FirestoreActivityDocument["stage"],
  node: number,
  count: number,
  objectType: string
) {
  if (stage === "Discover") {
    return `This is counting. Count ${count} ${objectType}.`;
  }

  if (stage === "Explore") {
    return `Tap each object and hear ${getCountSequence(count).join(", ")}.`;
  }

  if (stage === "Practice") {
    return `Recall how many objects are shown.`;
  }

  return node === 1
    ? "Tap each object in order."
    : node === 2
      ? "Count with BatiBot."
      : `Choose the number ${count}.`;
}

function getThinkingActivityInstruction(
  topic: CurriculumTopic,
  stage: FirestoreActivityDocument["stage"],
  node: number,
  skillMode: ActivitySkillMode
) {
  if (skillMode === "compare-size") {
    if (stage === "Discover") {
      return `Look at the size pair. Find ${topic.title}.`;
    }

    if (stage === "Explore") {
      return "Tap both objects and compare their size.";
    }

    if (stage === "Practice") {
      return `Recall ${topic.title} from one target object.`;
    }

    return node === 1
      ? `Tap the ${topic.title} object.`
      : node === 2
        ? `Match the word ${topic.title}.`
        : "Sort the objects by size.";
  }

  if (skillMode === "compare-quantity") {
    if (stage === "Discover") {
      return `Look at both groups. This shows ${topic.title}.`;
    }

    if (stage === "Explore") {
      return "Tap each group and compare how many.";
    }

    if (stage === "Practice") {
      return `Recall which comparison word fits the groups.`;
    }

    return node === 1
      ? `Which group shows ${topic.title}?`
      : node === 2
        ? `Match the word ${topic.title}.`
        : "Sort the groups as More, Less, or Equal.";
  }

  if (skillMode === "predict-pattern") {
    if (stage === "Discover") {
      return "Look at the repeating pattern.";
    }

    if (stage === "Explore") {
      return "Tap each pattern part in order.";
    }

    if (stage === "Practice") {
      return "Recall what comes next in the pattern.";
    }

    return node === 1
      ? "Tap the missing pattern spot."
      : node === 2
        ? "Choose what comes next."
        : "Build the pattern.";
  }

  return getActivityInstruction(topic, stage, node);
}

function buildActivitiesForTopic({
  curriculumLevel,
  topic,
  topicId,
  world,
}: {
  curriculumLevel: string;
  topic: CurriculumTopic;
  topicId: string;
  world: CurriculumWorld;
}) {
  const activityStages = [
    { nodes: 1, stage: "Discover" },
    { nodes: 1, stage: "Explore" },
    { nodes: 3, stage: "Interact" },
    { nodes: 1, stage: "Practice" },
  ] as const;

  return activityStages.flatMap(({ nodes, stage }) =>
    Array.from({ length: nodes }, (_, index) => {
      const node = index + 1;
      const nodeSuffix = nodes > 1 ? `-node${node}` : "";
      const skillMode = getWorldActivitySkillMode(world.id);
      const countingSet = getCountingSet(topic, world);
      const thinkingActivityType = getThinkingActivityType(skillMode, stage, node);
      const instruction = countingSet
        ? getCountingActivityInstruction(
            topic,
            stage,
            node,
            countingSet.targetNumber,
            countingSet.objectType
          )
        : thinkingActivityType
          ? getThinkingActivityInstruction(topic, stage, node, skillMode)
        : getActivityInstruction(topic, stage, node);

      return {
        id: `${topicId}-${slugify(stage)}${nodeSuffix}`,
        worldId: world.id,
        topicId,
        curriculumLevel,
        stage,
        node,
        order: STAGE_ORDER[stage] * 10 + node,
        activityType: countingSet
          ? getCountingActivityType(stage, node)
          : thinkingActivityType
            ? thinkingActivityType
          : getActivityType(stage, node),
        title: `${topic.title} ${stage}${nodes > 1 ? ` ${node}` : ""}`,
        instruction,
        skillMode,
        content: {
          conceptLabel: topic.title,
          imageAssetId: getTopicAssetId(world.id, topic.title),
          audioText: instruction,
          skillMode,
          ...(getComparisonKind(skillMode)
            ? {
                comparisonKind: getComparisonKind(skillMode),
                leftCount: skillMode === "compare-quantity" ? 2 : undefined,
                rightCount: skillMode === "compare-quantity" ? 4 : undefined,
                targetLabel: topic.title,
              }
            : {}),
          ...(skillMode === "predict-pattern"
            ? {
                patternAnswer: getPatternAnswer(topic),
                patternSequence: getPatternSequence(topic),
              }
            : {}),
          ...(countingSet
            ? {
                countSequence: getCountSequence(countingSet.objectCount),
                objectCount: countingSet.objectCount,
                objectType: countingSet.objectType,
                targetNumber: countingSet.targetNumber,
              }
            : {}),
          text: topic.example,
        },
        sourceArchitecture: "learning-worlds",
        contentVersion: CONTENT_VERSION,
        isPublished: true,
      } satisfies FirestoreActivityDocument;
    })
  );
}

function getChallengeType(topic: CurriculumTopic, node: number, skillMode: ActivitySkillMode) {
  if (skillMode === "compare-size") {
    return node === 1
      ? "size-comparison-choice"
      : node === 2
        ? "size-word-match"
        : "size-sorting-challenge";
  }

  if (skillMode === "compare-quantity") {
    return node === 1
      ? "quantity-comparison-choice"
      : node === 2
        ? "more-less-equal-choice"
        : "timed-comparison-race";
  }

  if (skillMode === "predict-pattern") {
    return node === 1
      ? "next-pattern-choice"
      : node === 2
        ? "complete-pattern-row"
        : "pattern-builder-challenge";
  }

  if (topic.subcategory === "counting" || topic.interactionTypes.includes("Counting Activity")) {
    return node === 1
      ? "how-many-choice"
      : node === 2
        ? "independent-count"
        : "number-to-group";
  }

  if (node === 1) {
    return "multiple-choice";
  }

  if (node === 2) {
    return topic.category === "numeric" ? "independent-count-or-compare" : "image-choice";
  }

  return topic.subcategory === "patterns" ? "find-mistake" : "matching";
}

function getChallengeInstruction(topic: CurriculumTopic, node: number, skillMode: ActivitySkillMode) {
  if (skillMode === "compare-size") {
    return node === 1
      ? `Choose the ${topic.title} object.`
      : node === 2
        ? `Choose the word ${topic.title}.`
        : "Sort the known objects by size.";
  }

  if (skillMode === "compare-quantity") {
    return node === 1
      ? `Which group shows ${topic.title}?`
      : node === 2
        ? "Choose More, Less, or Equal."
        : "Compare quickly. Find More, Less, or Equal.";
  }

  if (skillMode === "predict-pattern") {
    return node === 1
      ? "What comes next?"
      : node === 2
        ? "Complete the pattern."
        : "Build the pattern.";
  }

  if (topic.subcategory === "counting" || topic.interactionTypes.includes("Counting Activity")) {
    return node === 1
      ? "How many are there?"
      : node === 2
        ? "Count by yourself and choose the number."
        : "Choose the group that matches the number.";
  }

  if (node === 1) {
    return `Choose ${topic.title} from mixed known choices.`;
  }

  if (node === 2) {
    return `Answer ${topic.title} independently with fewer hints.`;
  }

  return `Match ${topic.title} using known examples only.`;
}

function buildChallengesForTopic({
  curriculumLevel,
  topic,
  topicId,
  world,
}: {
  curriculumLevel: string;
  topic: CurriculumTopic;
  topicId: string;
  world: CurriculumWorld;
}) {
  const skillMode = getWorldActivitySkillMode(world.id);
  const countingSet = getCountingSet(topic, world);

  return [1, 2, 3].map((node) => {
    const nodeCount = countingSet
      ? node === 2
        ? Math.min(countingSet.targetNumber + 1, 10)
        : countingSet.targetNumber
      : undefined;

    return {
      id: `${topicId}-challenge-node${node}`,
      worldId: world.id,
      topicId,
      curriculumLevel,
      node,
      skillMode,
      challengeType: getChallengeType(topic, node, skillMode),
      instruction: getChallengeInstruction(topic, node, skillMode),
      formula: DEFAULT_CHALLENGE_RULE.formula,
      allowedContentSources: DEFAULT_CHALLENGE_RULE.allowedContentSources,
      taskChange: DEFAULT_CHALLENGE_RULE.taskChanges[node - 1],
      guidanceLevel: DEFAULT_CHALLENGE_RULE.guidance,
      retryLimit: 2,
      introducesNewContent: DEFAULT_CHALLENGE_RULE.introducesNewContent,
      ...(countingSet && nodeCount
        ? {
            choices: getNearbyChoices(nodeCount),
            correctChoice: nodeCount,
            introducedEarlier: true,
            objectCount: nodeCount,
            objectType: countingSet.objectType,
            targetNumber: countingSet.targetNumber,
          }
        : {}),
      sourceArchitecture: "learning-worlds",
      contentVersion: CONTENT_VERSION,
      isPublished: true,
    } satisfies FirestoreChallengeDocument;
  });
}

function buildStagesForTopic({
  curriculumLevel,
  topicId,
  worldId,
}: {
  curriculumLevel: string;
  topicId: string;
  worldId: string;
}) {
  const skillMode = getWorldActivitySkillMode(worldId);

  return ACTIVE_LEARNING_PHASES.map((stage) => {
    const rule = LEARNING_STAGE_RULES[stage];

    return {
      id: getStageId(topicId, stage),
      worldId,
      topicId,
      curriculumLevel,
      stage,
      order: STAGE_ORDER[stage],
      isEnabled: true,
      purpose: rule.purpose,
      learnerAction: rule.learnerAction,
      guidance: rule.guidance,
      allowedContent: rule.allowedContent,
      skillMode,
      sourceArchitecture: "learning-worlds",
      contentVersion: CONTENT_VERSION,
      isPublished: true,
    } satisfies FirestoreStageDocument;
  });
}

export function buildLearningArchitectureSnapshot(): LearningArchitectureSnapshot {
  const curriculumLevels = CURRICULUM.map((curriculum, index) => ({
    id: getCurriculumLevelId(curriculum.gradeLevel),
    gradeLevel: curriculum.gradeLevel,
    title: curriculum.gradeLevel,
    order: index + 1,
    description: CURRICULUM_LEVEL_DESCRIPTIONS[curriculum.gradeLevel],
    sourceArchitecture: "learning-worlds",
    contentVersion: CONTENT_VERSION,
    isPublished: true,
  } satisfies FirestoreCurriculumLevelDocument));

  const worlds: FirestoreWorldDocument[] = [];
  const topics: FirestoreTopicDocument[] = [];
  const stages: FirestoreStageDocument[] = [];
  const activities: FirestoreActivityDocument[] = [];
  const challenges: FirestoreChallengeDocument[] = [];
  const rewards: FirestoreRewardDocument[] = [];

  CURRICULUM.forEach((curriculum) => {
    const curriculumLevel = getCurriculumLevelId(curriculum.gradeLevel);

    curriculum.worlds.forEach((world, worldIndex) => {
      const skillMode = getWorldActivitySkillMode(world.id);

      worlds.push({
        id: world.id,
        curriculumLevel,
        gradeLevel: curriculum.gradeLevel,
        title: world.title,
        order: worldIndex + 1,
        description: world.description,
        badgeReward: getBadgeReward(world),
        emoji: world.emoji,
        accentColor: world.accentColor,
        activities: world.activities,
        skillMode,
        sourceArchitecture: "learning-worlds",
        contentVersion: CONTENT_VERSION,
        isPublished: true,
      });

      world.topics.forEach((topic, topicIndex) => {
        const topicId = getTopicId(world.id, topic.title);

        topics.push({
          id: topicId,
          worldId: world.id,
          curriculumLevel,
          gradeLevel: curriculum.gradeLevel,
          title: topic.title,
          order: topicIndex + 1,
          category: topic.category,
          subcategory: topic.subcategory,
          learningOutcome: getLearningOutcome(topic, world),
          emoji: topic.emoji,
          example: topic.example,
          interactionTypes: topic.interactionTypes,
          learningStages: ACTIVE_LEARNING_PHASES,
          challengeRule: DEFAULT_CHALLENGE_RULE,
          skillMode,
          sourceArchitecture: "learning-worlds",
          contentVersion: CONTENT_VERSION,
          isPublished: true,
        });

        stages.push(...buildStagesForTopic({ curriculumLevel, topicId, worldId: world.id }));
        activities.push(...buildActivitiesForTopic({ curriculumLevel, topic, topicId, world }));
        challenges.push(...buildChallengesForTopic({ curriculumLevel, topic, topicId, world }));
        rewards.push({
          id: `${topicId}-reward`,
          worldId: world.id,
          topicId,
          curriculumLevel,
          title: `${topic.title} Reward`,
          xp: XP_REWARDS.completeActivity,
          stars: 1,
          sourceArchitecture: "learning-worlds",
          contentVersion: CONTENT_VERSION,
          isPublished: true,
        });
      });
    });
  });

  return {
    curriculumLevels,
    worlds,
    topics,
    stages,
    activities,
    challenges,
    rewards,
  };
}

export function validateLearningArchitectureSnapshot(snapshot: LearningArchitectureSnapshot) {
  const errors: string[] = [];
  const topicIds = new Set(snapshot.topics.map((topic) => topic.id));

  snapshot.topics.forEach((topic) => {
    const stageNames = snapshot.stages
      .filter((stage) => stage.topicId === topic.id)
      .map((stage) => stage.stage);

    ACTIVE_LEARNING_PHASES.forEach((stage) => {
      if (!stageNames.includes(stage)) {
        errors.push(`${topic.id} is missing ${stage}.`);
      }
    });
  });

  snapshot.activities.forEach((activity) => {
    if (!topicIds.has(activity.topicId)) {
      errors.push(`${activity.id} references missing topic ${activity.topicId}.`);
    }

    if (activity.skillMode !== activity.content.skillMode) {
      errors.push(`${activity.id} has mismatched activity/content skillMode.`);
    }

    if (
      activity.skillMode === "compare-size" &&
      activity.content.comparisonKind !== "size"
    ) {
      errors.push(`${activity.id} is missing size comparison metadata.`);
    }

    if (
      activity.skillMode === "compare-quantity" &&
      activity.content.comparisonKind !== "quantity"
    ) {
      errors.push(`${activity.id} is missing quantity comparison metadata.`);
    }

    if (
      activity.skillMode === "predict-pattern" &&
      (!activity.content.patternSequence?.length || !activity.content.patternAnswer)
    ) {
      errors.push(`${activity.id} is missing pattern prediction metadata.`);
    }
  });

  snapshot.challenges.forEach((challenge) => {
    if (!topicIds.has(challenge.topicId)) {
      errors.push(`${challenge.id} references missing topic ${challenge.topicId}.`);
    }

    if (challenge.introducesNewContent) {
      errors.push(`${challenge.id} introduces new content.`);
    }

    if (
      challenge.worldId === "preschool-more-less" &&
      (
        challenge.challengeType === "how-many-choice" ||
        challenge.challengeType === "independent-count" ||
        challenge.challengeType === "number-to-group"
      )
    ) {
      errors.push(`${challenge.id} treats More and Less as plain counting.`);
    }

    if (challenge.formula !== DEFAULT_CHALLENGE_RULE.formula) {
      errors.push(`${challenge.id} does not use the Challenge formula.`);
    }

    if (
      challenge.challengeType === "how-many-choice" ||
      challenge.challengeType === "independent-count" ||
      challenge.challengeType === "number-to-group"
    ) {
      if (!challenge.objectCount || !challenge.correctChoice || !challenge.choices?.length) {
        errors.push(`${challenge.id} is missing counting challenge metadata.`);
      }

      if (!challenge.introducedEarlier) {
        errors.push(`${challenge.id} must use introduced counting content.`);
      }

      if (
        challenge.correctChoice &&
        challenge.choices?.length &&
        !challenge.choices.includes(challenge.correctChoice)
      ) {
        errors.push(`${challenge.id} choices do not include the correct count.`);
      }
    }
  });

  snapshot.rewards.forEach((reward) => {
    if (!topicIds.has(reward.topicId)) {
      errors.push(`${reward.id} references missing topic ${reward.topicId}.`);
    }
  });

  return {
    errors,
    isValid: errors.length === 0,
  };
}
