import {
  CURRICULUM,
  type ActiveLearningPhase,
  type CurriculumTopic,
  type CurriculumWorld,
} from "@/src/data/curriculum/learning-path";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import {
  getAllowedChoiceCount,
  isAllowedChoiceCount,
  validateActivityCorrectAnswer,
} from "@/src/domain/rules/activity-integrity-rules";
import {
  BATIBOT_ACTIVE_LEARNING_METADATA,
  BATIBOT_API_FIRESTORE_COLLECTIONS,
  BATIBOT_API_LEVELS,
  BATIBOT_API_MODULES,
  BATIBOT_PHASE_TO_STAGE_TYPE,
  BATIBOT_REQUIRED_STAGE_TYPES,
  BATIBOT_STAGE_DISPLAY_LABELS,
  BATIBOT_STAGE_TYPE_TO_PHASE,
  BATIBOT_UI_UX_METADATA,
  buildBatiBotCurriculumIntelligenceSnapshot,
  type BatiBotApiCurriculumLevel,
  type BatiBotApiGamification,
  type BatiBotApiProfile,
  type BatiBotApiProgress,
  type BatiBotApiRankEntry,
  type BatiBotApiStageNode,
  type BatiBotApiTopic,
  type BatiBotApiValidationIssue,
  type BatiBotApiValidationResult,
  type BatiBotApiWorld,
  type BatiBotContentStatus,
  type BatiBotDevicePreset,
  type BatiBotLearnerContentResponse,
  type BatiBotMobilePreviewValidationResult,
  type BatiBotStageType,
} from "@/src/domain/rules/curriculum-intelligence-api";
import type { LearnerLevel } from "@/src/types/quiz";
import type { UserProfile } from "@/src/types/user";

const SYSTEM_ACTOR = "batibot-api";

const STAGE_XP: Record<BatiBotStageType, number> = {
  challenge: 10,
  discover: 1,
  explore: 2,
  interact: 3,
  mastery: 0,
  practice: 5,
  progress: 0,
  reward: 20,
};

const LEVEL_ID_BY_LABEL: Record<LearnerLevel, BatiBotApiCurriculumLevel["id"]> = {
  "Grade 1": "grade1",
  "Grade 2": "grade2",
  "Grade 3": "grade3",
  Kindergarten: "kindergarten",
  Preschool: "preschool",
};

const LEVEL_LABEL_BY_ID: Record<BatiBotApiCurriculumLevel["id"], LearnerLevel> = {
  grade1: "Grade 1",
  grade2: "Grade 2",
  grade3: "Grade 3",
  kindergarten: "Kindergarten",
  preschool: "Preschool",
};

export interface BatiBotCreateWorldInput {
  backgroundStyle: string;
  badgeName: string;
  createdBy?: string;
  description: string;
  displayOrder: number;
  emoji: string;
  imagePrompt: string;
  levelId: BatiBotApiCurriculumLevel["id"];
  themeColor: string;
  title: string;
  topicTitles: string[];
  unlockRequirement: string;
}

export interface BatiBotCreateTopicInput {
  audioPrompt: string;
  category: string;
  createdBy?: string;
  difficulty: string;
  displayOrder: number;
  imagePrompt: string;
  levelId: BatiBotApiCurriculumLevel["id"];
  objective: string;
  starReward: number;
  title: string;
  unlockRequirement: string;
  worldId: string;
  xpReward: number;
}

export interface BatiBotStageGenerationPlan {
  aiContext: ReturnType<typeof buildBatiBotAiContext>;
  prompt: string;
  stageNode: BatiBotApiStageNode;
  validation: BatiBotApiValidationResult;
}

export interface BatiBotGeneratedTopicStructure {
  mobilePreviewResults: BatiBotMobilePreviewValidationResult[];
  prompts: BatiBotStageGenerationPlan[];
  publishValidation: ReturnType<typeof validateBatiBotTopicForPublish>;
  status: Extract<
    BatiBotContentStatus,
    | "generating_stages"
    | "generating_content"
    | "needs_fix"
    | "ready_for_review"
    | "mobile_preview_passed"
    | "approved"
    | "published"
  >;
  topic: BatiBotApiTopic;
}

export interface BatiBotGeneratedWorldStructure {
  mobilePreviewResults: BatiBotMobilePreviewValidationResult[];
  prompts: BatiBotStageGenerationPlan[];
  publishValidation: ReturnType<typeof validateBatiBotWorldForPublish>;
  status: Extract<
    BatiBotContentStatus,
    | "needs_topics"
    | "generating_content"
    | "needs_fix"
    | "ready_for_review"
    | "mobile_preview_passed"
    | "approved"
    | "published"
  >;
  topics: BatiBotGeneratedTopicStructure[];
  world: BatiBotApiWorld;
}

function nowIso() {
  return new Date().toISOString();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBatiBotApiArchitecture() {
  return {
    firestoreCollections: BATIBOT_API_FIRESTORE_COLLECTIONS,
    modules: BATIBOT_API_MODULES,
    productionRule:
      "BatiBot API controls learner Play/Rank/Reward rendering and admin content curation through the same curriculum intelligence contract.",
  };
}

function getTopicTemplateCategory(category: string) {
  const normalized = category.trim().toLowerCase();

  if (normalized.includes("number") || normalized.includes("count")) {
    return "number-sense";
  }

  if (normalized.includes("family")) {
    return "family-recognition";
  }

  if (normalized.includes("habit") || normalized.includes("health")) {
    return "daily-life";
  }

  return "vocabulary-recognition";
}

export function getBatiBotApiLevelId(level: LearnerLevel) {
  return LEVEL_ID_BY_LABEL[level];
}

export function getBatiBotLearnerLevel(levelId: BatiBotApiCurriculumLevel["id"]) {
  return LEVEL_LABEL_BY_ID[levelId];
}

export function getBatiBotCurriculumLevels(): BatiBotApiCurriculumLevel[] {
  return BATIBOT_API_LEVELS;
}

export function getBatiBotCurriculumLevel(levelId: BatiBotApiCurriculumLevel["id"]) {
  return BATIBOT_API_LEVELS.find((level) => level.id === levelId) ?? BATIBOT_API_LEVELS[0];
}

function getCurriculumForLevelId(levelId: BatiBotApiCurriculumLevel["id"]) {
  const level = getBatiBotLearnerLevel(levelId);

  return CURRICULUM.find((item) => item.gradeLevel === level) ?? CURRICULUM[0];
}

function getTopicId(worldId: string, topicTitle: string) {
  return `${worldId}-${slugify(topicTitle)}`;
}

function mapWorldToApiWorld(
  world: CurriculumWorld,
  levelId: BatiBotApiCurriculumLevel["id"],
  displayOrder: number,
  status: BatiBotContentStatus = "published"
): BatiBotApiWorld {
  return {
    backgroundImage: world.id,
    createdAt: "",
    createdBy: SYSTEM_ACTOR,
    description: world.description,
    displayOrder,
    emoji: world.emoji,
    icon: world.id,
    levelId,
    linkedBadgeId: `${world.id}-badge`,
    name: world.title,
    status,
    themeColor: world.accentColor,
    topicCount: world.topics.length,
    unlockRequirement: displayOrder <= 1 ? "level_start" : "complete_previous_world",
    updatedAt: "",
    updatedBy: SYSTEM_ACTOR,
    worldId: world.id,
  };
}

function mapTopicToApiTopic(
  topic: CurriculumTopic,
  world: CurriculumWorld,
  levelId: BatiBotApiCurriculumLevel["id"],
  displayOrder: number,
  status: BatiBotContentStatus = "published"
): BatiBotApiTopic {
  return {
    audioPrompt: topic.kindergartenSupport?.audioPrompt ?? `Say ${topic.title}.`,
    category: topic.category,
    createdAt: "",
    createdBy: SYSTEM_ACTOR,
    difficulty: getBatiBotLearnerLevel(levelId),
    displayOrder,
    image: getTopicId(world.id, topic.title),
    imagePrompt: topic.example,
    levelId,
    name: topic.title,
    objective: topic.competencyObjective ?? topic.example,
    pronunciationText: topic.title,
    starReward: 1,
    status,
    topicId: getTopicId(world.id, topic.title),
    unlockRequirement: displayOrder <= 1 ? "world_start" : "complete_previous_topic",
    updatedAt: "",
    updatedBy: SYSTEM_ACTOR,
    worldId: world.id,
    xpReward: 20,
  };
}

function getChoiceSet(topic: CurriculumTopic, world: CurriculumWorld, choiceCount: number) {
  const allowedChoiceCount = getAllowedChoiceCount(choiceCount);
  const choices = [topic.title, ...world.topics.map((item) => item.title)]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .slice(0, allowedChoiceCount);

  while (choices.length < allowedChoiceCount) {
    choices.push(`${topic.title} ${choices.length + 1}`);
  }

  return choices;
}

function getStageChoiceCount(stageType: BatiBotStageType) {
  switch (stageType) {
    case "explore":
    case "interact":
      return 2;
    case "practice":
    case "challenge":
      return 4;
    default:
      return 0;
  }
}

function createStageNode({
  levelId,
  stageType,
  topic,
  world,
}: {
  levelId: BatiBotApiCurriculumLevel["id"];
  stageType: BatiBotStageType;
  topic: CurriculumTopic;
  world: CurriculumWorld;
}): BatiBotApiStageNode {
  const phase = BATIBOT_STAGE_TYPE_TO_PHASE[stageType];
  const topicId = getTopicId(world.id, topic.title);
  const choiceCount = getStageChoiceCount(stageType);
  const choices = choiceCount ? getChoiceSet(topic, world, choiceCount) : [];
  const isRewardStage = stageType === "reward";
  const isMasteryStage = stageType === "mastery";
  const instructionText = getStageInstruction(phase, topic.title);
  const imagePrompt = topic.example || `child-friendly illustration of ${topic.title}`;

  return {
    activityType:
      stageType === "challenge"
        ? "timed-challenge"
        : stageType === "explore"
          ? "tap-choice"
          : stageType === "practice"
            ? "image-choice"
            : "tap-choice",
    animationType:
      stageType === "reward" || stageType === "mastery"
        ? "celebration"
        : "gentle-feedback",
    audio: `Say ${topic.title}.`,
    audioText: `Say ${topic.title}.`,
    choices,
    completionCondition: getStageCompletionCondition(stageType, topic.title),
    correctAnswer: choices.length ? topic.title : "",
    displayLabel: BATIBOT_STAGE_DISPLAY_LABELS[stageType],
    feedbackCorrect: "Great job!",
    feedbackWrong: "Try again.",
    image: topicId,
    imagePrompt,
    instructionText,
    levelId,
    mainWord: topic.title,
    mascotMessage: getStageMascotMessage(phase, topic.title),
    mobilePreviewStatus: "passed",
    nodeIndex: 1,
    stageNodeId: `${topicId}-${stageType}`,
    stageType,
    starReward: isRewardStage ? 1 : 0,
    status: "published",
    timerSeconds: stageType === "challenge" ? 20 : null,
    topicId,
    unlockTarget: isMasteryStage ? "next_topic" : "",
    validationStatus: "passed",
    worldId: world.id,
    xpReward: isRewardStage ? 20 : STAGE_XP[stageType],
  };
}

function createStageNodeFromApiTopic({
  stageType,
  topic,
  world,
}: {
  stageType: BatiBotStageType;
  topic: BatiBotApiTopic;
  world: BatiBotApiWorld;
}): BatiBotApiStageNode {
  const choiceCount = getStageChoiceCount(stageType);
  const choices = choiceCount
    ? [
        topic.name,
        `${topic.name} picture`,
        `${world.name} clue`,
        "Try another choice",
      ].slice(0, choiceCount)
    : [];
  const isRewardStage = stageType === "reward";
  const isMasteryStage = stageType === "mastery";
  const instructionText = getStageInstruction(BATIBOT_STAGE_TYPE_TO_PHASE[stageType], topic.name);
  const imagePrompt = topic.imagePrompt || `child-friendly illustration of ${topic.name}`;

  return {
    activityType:
      stageType === "challenge"
        ? "timed-challenge"
        : stageType === "explore"
          ? "tap-choice"
          : stageType === "practice"
            ? "image-choice"
            : stageType === "discover"
              ? "recognition"
              : "tap-choice",
    animationType:
      stageType === "reward" || stageType === "mastery"
        ? "celebration"
        : "gentle-feedback",
    audio: topic.audioPrompt || `Say ${topic.name}.`,
    audioText: topic.audioPrompt || topic.pronunciationText || `Say ${topic.name}.`,
    choices,
    completionCondition: getStageCompletionCondition(stageType, topic.name),
    correctAnswer: choices.length ? topic.name : "",
    displayLabel: BATIBOT_STAGE_DISPLAY_LABELS[stageType],
    feedbackCorrect: stageType === "reward" ? "You got it!" : "Great job!",
    feedbackWrong: choices.length ? "Try again." : "",
    image: topic.image || topic.imagePrompt,
    imagePrompt,
    instructionText,
    levelId: topic.levelId,
    mainWord: topic.name,
    mascotMessage: getStageMascotMessage(BATIBOT_STAGE_TYPE_TO_PHASE[stageType], topic.name),
    mobilePreviewStatus: "not_tested",
    nodeIndex: 1,
    stageNodeId: `${topic.topicId}-${stageType}`,
    stageType,
    starReward: isRewardStage ? topic.starReward : 0,
    status: "generated",
    timerSeconds: stageType === "challenge" ? 20 : null,
    topicId: topic.topicId,
    unlockTarget: isMasteryStage ? topic.unlockRequirement : "",
    validationStatus: "missing",
    worldId: world.worldId,
    xpReward: isRewardStage ? topic.xpReward : STAGE_XP[stageType],
  };
}

function buildStageGeminiPrompt(stageNode: BatiBotApiStageNode, topic: BatiBotApiTopic) {
  const level = getBatiBotCurriculumLevel(stageNode.levelId);
  const stageMetadata = BATIBOT_ACTIVE_LEARNING_METADATA.find(
    (stage) => stage.phase === BATIBOT_STAGE_TYPE_TO_PHASE[stageNode.stageType]
  );
  const requiredFields = [
    "stageType",
    "displayLabel",
    "instructionText",
    "mainWord",
    "audioText",
    "mascotMessage",
    "imagePrompt",
    "activityType",
    "choices",
    "correctAnswer",
    "feedbackCorrect",
    "feedbackWrong",
    "animationType",
    "completionCondition",
    "nodeIndex",
    "xpReward",
    "starReward",
  ];

  return [
    "Return valid JSON only.",
    `Level: ${level.label}.`,
    `World ID: ${stageNode.worldId}.`,
    `Topic: ${topic.name}.`,
    `Category template: ${getTopicTemplateCategory(topic.category)}.`,
    `Stage: ${stageNode.displayLabel} / ${stageNode.stageType}.`,
    `Framework purpose: ${stageMetadata?.purpose ?? "Use the selected framework stage."}`,
    `UI format: ${stageNode.displayLabel} learner screen.`,
    `Allowed text length: ${level.id === "preschool" ? "very short" : "short and child-friendly"}.`,
    "BatiBot API controls the curriculum structure. Gemini only fills the requested stage JSON.",
    "One node per stage only. Do not add extra stages or alternate framework steps.",
    `Required fields: ${requiredFields.join(", ")}.`,
    `Restricted content: ${level.cognitiveRules.join(", ")}. ${level.uiRules.join(", ")}.`,
    "Choice-count rule: TAP and TRY use exactly 2 choices; CHOOSE uses exactly 4 choices; never return 1, 3, 5, or 6+ choices.",
    `Output JSON must use stageType="${stageNode.stageType}" and displayLabel="${stageNode.displayLabel}".`,
  ].join("\n");
}

function buildStageGenerationPlan(
  stageNode: BatiBotApiStageNode,
  topic: BatiBotApiTopic
): BatiBotStageGenerationPlan {
  const validation = validateBatiBotStageNode({
    ...stageNode,
    mobilePreviewStatus: "passed",
    validationStatus: "passed",
  });

  return {
    aiContext: buildBatiBotAiContext({
      activityType: stageNode.activityType,
      levelId: stageNode.levelId,
      stageType: stageNode.stageType,
      topicId: stageNode.topicId,
      worldId: stageNode.worldId,
    }),
    prompt: buildStageGeminiPrompt(stageNode, topic),
    stageNode: {
      ...stageNode,
      mobilePreviewStatus: "passed",
      validationStatus: validation.status,
    },
    validation,
  };
}

function getStageInstruction(phase: ActiveLearningPhase, topicTitle: string) {
  switch (phase) {
    case "Discover":
      return `Look at ${topicTitle}.`;
    case "Explore":
      return `Tap ${topicTitle}.`;
    case "Interact":
      return `Find ${topicTitle}.`;
    case "Practice":
      return `Choose ${topicTitle}.`;
    case "Challenge":
      return `Find ${topicTitle} before time ends.`;
    case "Reward":
      return "Claim your star.";
    case "Progress":
      return "See your progress.";
    case "Mastery":
      return `You mastered ${topicTitle}.`;
    default:
      return `Choose ${topicTitle}.`;
  }
}

function getStageCompletionCondition(stageType: BatiBotStageType, topicTitle: string) {
  switch (stageType) {
    case "discover":
      return `Learner sees and hears ${topicTitle}.`;
    case "explore":
      return `Learner taps ${topicTitle} from exactly 2 choices.`;
    case "interact":
      return `Learner chooses ${topicTitle} from exactly 2 guided choices.`;
    case "practice":
      return `Learner chooses ${topicTitle} independently from exactly 4 choices.`;
    case "challenge":
      return `Learner completes a timed or game-like ${topicTitle} task with fewer hints.`;
    case "reward":
      return "Learner claims the STAR reward.";
    case "progress":
      return "Learner sees topic, world, and mastery progress.";
    case "mastery":
      return "Learner sees the mastered topic and next unlock.";
    default:
      return `Learner completes ${topicTitle}.`;
  }
}

function getStageMascotMessage(phase: ActiveLearningPhase, topicTitle: string) {
  switch (phase) {
    case "Discover":
      return `Let's learn ${topicTitle}!`;
    case "Reward":
      return "You got it!";
    case "Mastery":
      return `You mastered ${topicTitle}!`;
    default:
      return `Try ${topicTitle}.`;
  }
}

export function getBatiBotWorldsForLevel(levelId: BatiBotApiCurriculumLevel["id"]) {
  return getCurriculumForLevelId(levelId).worlds.map((world, index) =>
    mapWorldToApiWorld(world, levelId, index + 1)
  );
}

export function getBatiBotTopicsForWorld(worldId: string) {
  for (const grade of CURRICULUM) {
    const world = grade.worlds.find((candidate) => candidate.id === worldId);

    if (world) {
      const levelId = getBatiBotApiLevelId(grade.gradeLevel);

      return world.topics.map((topic, index) =>
        mapTopicToApiTopic(topic, world, levelId, index + 1)
      );
    }
  }

  return [];
}

export function getBatiBotStageNodesForTopic(topicId: string) {
  for (const grade of CURRICULUM) {
    for (const world of grade.worlds) {
      const topic = world.topics.find(
        (candidate) => getTopicId(world.id, candidate.title) === topicId
      );

      if (topic) {
        const levelId = getBatiBotApiLevelId(grade.gradeLevel);

        return BATIBOT_REQUIRED_STAGE_TYPES.map((stageType) =>
          createStageNode({ levelId, stageType, topic, world })
        );
      }
    }
  }

  return [];
}

export function validateBatiBotStageNode(
  stageNode: BatiBotApiStageNode
): BatiBotApiValidationResult {
  const issues: BatiBotApiValidationIssue[] = [];
  const level = getBatiBotCurriculumLevel(stageNode.levelId);
  const instructionWordCount = stageNode.instructionText.trim().split(/\s+/).filter(Boolean).length;

  if (!stageNode.topicId || !stageNode.worldId || !stageNode.levelId) {
    issues.push({
      code: "missing-placement",
      message: "Stage needs level, world, and topic mapping.",
      severity: "blocker",
    });
  }

  if (stageNode.stageType === "discover" && (!stageNode.image || !stageNode.audio)) {
    issues.push({
      code: "discover-media",
      message: "LOOK needs an image and audio.",
      severity: "blocker",
    });
  }

  if (
    (level.id === "preschool" || level.id === "kindergarten") &&
    !stageNode.audioText.trim()
  ) {
    issues.push({
      code: "missing-audio",
      message: `Please add audio for this ${level.label} topic.`,
      severity: "blocker",
    });
  }

  if (level.id === "preschool" && instructionWordCount > 8) {
    issues.push({
      code: "preschool-text-too-long",
      message: "Preschool instructions should stay very short and visual-first.",
      severity: "warning",
    });
  }

  if (stageNode.stageType === "explore" && stageNode.activityType !== "tap-choice") {
    issues.push({
      code: "explore-tap",
      message: "TAP needs a tap interaction.",
      severity: "blocker",
    });
  }

  if (
    ["explore", "interact", "practice"].includes(stageNode.stageType) &&
    !isAllowedChoiceCount(stageNode.choices.length)
  ) {
    issues.push({
      code: "stage-choice-count",
      message: `${stageNode.displayLabel} needs exactly 2 or 4 choices.`,
      severity: "blocker",
    });
  }

  if (stageNode.choices.length) {
    const integrity = validateActivityCorrectAnswer({
      choices: stageNode.choices,
      correctAnswer: stageNode.correctAnswer,
      targetConcept: stageNode.correctAnswer,
    });

    integrity.issues.forEach((message) => {
      issues.push({
        code: "choice-integrity",
        message,
        severity: "blocker",
      });
    });
  }

  if (stageNode.stageType === "challenge" && !stageNode.timerSeconds) {
    issues.push({
      code: "challenge-timer",
      message: "PLAY needs timer or game logic.",
      severity: "blocker",
    });
  }

  if (
    stageNode.stageType === "reward" &&
    (stageNode.xpReward <= 0 || stageNode.starReward <= 0)
  ) {
    issues.push({
      code: "reward-impact",
      message: "STAR needs valid XP and star reward metadata.",
      severity: "blocker",
    });
  }

  if (stageNode.stageType === "mastery" && !stageNode.unlockTarget) {
    issues.push({
      code: "mastery-unlock",
      message: "MASTERED needs an unlock target.",
      severity: "blocker",
    });
  }

  return {
    checkedAt: nowIso(),
    issues,
    status: issues.some((issue) => issue.severity === "blocker") ? "failed" : "passed",
    targetId: stageNode.stageNodeId,
  };
}

export function validateBatiBotTopicForPublish(stageNodes: BatiBotApiStageNode[]) {
  const stages = new Set(stageNodes.map((stage) => stage.stageType));
  const issues: BatiBotApiValidationIssue[] = [];
  const practiceStage = stageNodes.find((stage) => stage.stageType === "practice");
  const challengeStage = stageNodes.find((stage) => stage.stageType === "challenge");

  BATIBOT_REQUIRED_STAGE_TYPES.forEach((stageType) => {
    const count = stageNodes.filter((stage) => stage.stageType === stageType).length;

    if (count === 0) {
      issues.push({
        code: "missing-stage",
        message: `Topic is missing ${BATIBOT_STAGE_DISPLAY_LABELS[stageType]} content.`,
        severity: "blocker",
      });
    }

    if (count > 1) {
      issues.push({
        code: "duplicate-stage",
        message: `Topic has more than one ${BATIBOT_STAGE_DISPLAY_LABELS[stageType]} node.`,
        severity: "blocker",
      });
    }
  });

  stageNodes.flatMap(validateBatiBotStageNode).forEach((result) => {
    issues.push(...result.issues);
  });

  if (practiceStage && challengeStage) {
    const challengeLooksHarder =
      Boolean(challengeStage.timerSeconds) ||
      challengeStage.activityType !== practiceStage.activityType ||
      challengeStage.completionCondition !== practiceStage.completionCondition;

    if (!challengeLooksHarder) {
      issues.push({
        code: "challenge-not-harder",
        message: "Challenge must be harder than Practice.",
        severity: "blocker",
      });
    }
  }

  return {
    complete: stages.size === BATIBOT_REQUIRED_STAGE_TYPES.length && !issues.length,
    issues,
  };
}

export function validateBatiBotWorldForPublish(
  topics: BatiBotApiTopic[],
  stageNodesByTopicId: Record<string, BatiBotApiStageNode[]> = {}
) {
  const issues: BatiBotApiValidationIssue[] = [];

  if (topics.length < 3) {
    issues.push({
      code: "world-needs-topics",
      message: "This world needs at least 3 topics before publishing.",
      severity: "blocker",
    });
  }

  topics.forEach((topic) => {
    const stageNodes = stageNodesByTopicId[topic.topicId] ?? getBatiBotStageNodesForTopic(topic.topicId);
    const topicValidation = validateBatiBotTopicForPublish(stageNodes);

    if (!topicValidation.complete) {
      issues.push({
        code: "topic-missing-stages",
        message: `${topic.name} must contain exactly one node for all 8 framework stages.`,
        severity: "blocker",
      });
    }
  });

  return {
    complete: !issues.length,
    issues,
  };
}

export function validateBatiBotMobilePreview(
  stageNode: BatiBotApiStageNode,
  devicePreset: BatiBotDevicePreset
): BatiBotMobilePreviewValidationResult {
  const issues = validateBatiBotStageNode(stageNode).issues;

  if (!stageNode.instructionText.trim()) {
    issues.push({
      code: "missing-instruction",
      message: "Instruction text must fit the mobile screen.",
      severity: "blocker",
    });
  }

  if (
    (devicePreset === "android" || devicePreset === "iphone") &&
    stageNode.instructionText.split(/\s+/).length > 12
  ) {
    issues.push({
      code: "mobile-text-length",
      message: "Use shorter instruction text for phone preview.",
      severity: "warning",
    });
  }

  return {
    checkedAt: nowIso(),
    devicePreset,
    issues,
    stageNodeId: stageNode.stageNodeId,
    status: issues.some((issue) => issue.severity === "blocker") ? "failed" : "passed",
  };
}

export function buildBatiBotTopicStructure(
  input: BatiBotCreateTopicInput,
  world?: BatiBotApiWorld
): BatiBotGeneratedTopicStructure {
  const resolvedWorld =
    world ??
    getBatiBotWorldsForLevel(input.levelId).find((candidate) => candidate.worldId === input.worldId) ??
    {
      backgroundImage: "",
      createdAt: "",
      createdBy: input.createdBy ?? SYSTEM_ACTOR,
      description: "",
      displayOrder: 1,
      emoji: "",
      icon: "",
      levelId: input.levelId,
      linkedBadgeId: "",
      name: input.worldId,
      status: "draft" as const,
      themeColor: "#6D28D9",
      topicCount: 0,
      unlockRequirement: "level_start",
      updatedAt: "",
      updatedBy: input.createdBy ?? SYSTEM_ACTOR,
      worldId: input.worldId,
    };
  const topic: BatiBotApiTopic = {
    audioPrompt: input.audioPrompt,
    category: input.category,
    createdAt: nowIso(),
    createdBy: input.createdBy ?? SYSTEM_ACTOR,
    difficulty: input.difficulty,
    displayOrder: input.displayOrder,
    image: `${input.worldId}-${slugify(input.title)}`,
    imagePrompt: input.imagePrompt,
    levelId: input.levelId,
    name: input.title.trim(),
    objective: input.objective.trim(),
    pronunciationText: input.title.trim(),
    starReward: input.starReward,
    status: "draft",
    topicId: `${input.worldId}-${slugify(input.title)}`,
    unlockRequirement: input.unlockRequirement,
    updatedAt: nowIso(),
    updatedBy: input.createdBy ?? SYSTEM_ACTOR,
    worldId: input.worldId,
    xpReward: input.xpReward,
  };
  const prompts = BATIBOT_REQUIRED_STAGE_TYPES.map((stageType) =>
    buildStageGenerationPlan(
      createStageNodeFromApiTopic({ stageType, topic, world: resolvedWorld }),
      topic
    )
  );
  const stageNodes = prompts.map((plan) => plan.stageNode);
  const publishValidation = validateBatiBotTopicForPublish(stageNodes);
  const mobilePreviewResults = stageNodes.map((stageNode) =>
    validateBatiBotMobilePreview(stageNode, "android")
  );
  const hasBlockers =
    publishValidation.issues.some((issue) => issue.severity === "blocker") ||
    mobilePreviewResults.some((result) => result.status === "failed");

  return {
    mobilePreviewResults,
    prompts,
    publishValidation,
    status: hasBlockers ? "needs_fix" : "ready_for_review",
    topic: {
      ...topic,
      status: hasBlockers ? "needs_fix" : "ready_for_review",
    },
  };
}

export function buildBatiBotWorldStructure(
  input: BatiBotCreateWorldInput
): BatiBotGeneratedWorldStructure {
  const cleanTopicTitles = input.topicTitles
    .map((title) => title.trim())
    .filter(Boolean);
  const world: BatiBotApiWorld = {
    backgroundImage: input.backgroundStyle || input.imagePrompt,
    createdAt: nowIso(),
    createdBy: input.createdBy ?? SYSTEM_ACTOR,
    description: input.description.trim(),
    displayOrder: input.displayOrder,
    emoji: input.emoji.trim(),
    icon: input.emoji.trim() || input.imagePrompt,
    levelId: input.levelId,
    linkedBadgeId: slugify(input.badgeName || `${input.title} Badge`),
    name: input.title.trim(),
    status: cleanTopicTitles.length < 3 ? "needs_topics" : "draft",
    themeColor: input.themeColor,
    topicCount: cleanTopicTitles.length,
    unlockRequirement: input.unlockRequirement,
    updatedAt: nowIso(),
    updatedBy: input.createdBy ?? SYSTEM_ACTOR,
    worldId: slugify(input.title),
  };
  const topics = cleanTopicTitles.map((topicTitle, index) =>
    buildBatiBotTopicStructure(
      {
        audioPrompt: `Say ${topicTitle}.`,
        category: "Vocabulary Recognition",
        createdBy: input.createdBy,
        difficulty: getBatiBotLearnerLevel(input.levelId),
        displayOrder: index + 1,
        imagePrompt: `child-friendly ${topicTitle} picture for ${input.title}`,
        levelId: input.levelId,
        objective: `Recognize ${topicTitle}.`,
        starReward: 1,
        title: topicTitle,
        unlockRequirement: index === 0 ? "world_start" : "complete_previous_topic",
        worldId: world.worldId,
        xpReward: 20,
      },
      world
    )
  );
  const stageNodesByTopicId = Object.fromEntries(
    topics.map((topic) => [
      topic.topic.topicId,
      topic.prompts.map((plan) => plan.stageNode),
    ])
  );
  const publishValidation = validateBatiBotWorldForPublish(
    topics.map((topic) => topic.topic),
    stageNodesByTopicId
  );
  const mobilePreviewResults = topics.flatMap((topic) => topic.mobilePreviewResults);
  const hasBlockers =
    publishValidation.issues.some((issue) => issue.severity === "blocker") ||
    topics.some((topic) => topic.status === "needs_fix");

  return {
    mobilePreviewResults,
    prompts: topics.flatMap((topic) => topic.prompts),
    publishValidation,
    status:
      cleanTopicTitles.length < 3
        ? "needs_topics"
        : hasBlockers
          ? "needs_fix"
          : "ready_for_review",
    topics,
    world: {
      ...world,
      status:
        cleanTopicTitles.length < 3
          ? "needs_topics"
          : hasBlockers
            ? "needs_fix"
            : "ready_for_review",
    },
  };
}

export function buildBatiBotApiProfile(
  profile: UserProfile,
  progress: LearnerProgressState
): BatiBotApiProfile {
  const level = profile.gradeLevel ?? "Preschool";

  return {
    avatar: profile.profileImageUrl,
    createdAt: "",
    curriculumLevel: getBatiBotApiLevelId(level),
    displayName: profile.displayName,
    lastActiveAt: progress.lastActiveDate ?? "",
    role: profile.role,
    selectedBuddy: profile.buddyEmoji,
    streak: progress.streak,
    totalStars: progress.claimedWorldRewardIds.length,
    totalXP: progress.totalXp,
    userId: profile.uid,
  };
}

export function buildBatiBotApiProgress(
  userId: string,
  levelId: BatiBotApiCurriculumLevel["id"],
  progress: LearnerProgressState
): BatiBotApiProgress {
  const completedTopics = progress.completedLessons.length
    ? progress.completedLessons
    : progress.completedQuizIds;

  return {
    completedStages: progress.completedLessons,
    completedTopics,
    completedWorlds: progress.claimedWorldRewardIds,
    currentStage: null,
    lastCompletedAt: progress.lastActiveDate,
    levelId,
    topicId: completedTopics[0] ?? null,
    topicMasteryPercent: completedTopics.length ? 100 : 0,
    userId,
    worldId: progress.claimedWorldRewardIds[0] ?? null,
    worldProgressPercent: progress.claimedWorldRewardIds.length ? 100 : 0,
  };
}

export function buildBatiBotGamification(
  progress: LearnerProgressState
): BatiBotApiGamification {
  return {
    achievements: progress.achievements,
    badges: progress.badges,
    streak: progress.streak,
    totalStars: progress.claimedWorldRewardIds.length,
    totalXP: progress.totalXp,
    unlockables: progress.unlockedQuizIds,
  };
}

export function buildBatiBotRankEntry(
  profile: BatiBotApiProfile,
  progress: LearnerProgressState,
  rank = 1
): BatiBotApiRankEntry {
  return {
    avatar: profile.avatar,
    badges: progress.badges,
    curriculumLevel: profile.curriculumLevel,
    displayName: profile.displayName,
    rank,
    totalStars: profile.totalStars,
    totalXP: profile.totalXP,
    userId: profile.userId,
  };
}

export function buildBatiBotLearnerContentResponse({
  profile,
  progress,
}: {
  profile: UserProfile;
  progress: LearnerProgressState;
}): BatiBotLearnerContentResponse {
  const apiProfile = buildBatiBotApiProfile(profile, progress);
  const currentLevel = getBatiBotCurriculumLevel(apiProfile.curriculumLevel);
  const unlockedWorlds = getBatiBotWorldsForLevel(apiProfile.curriculumLevel);
  const firstWorld = unlockedWorlds[0];
  const unlockedTopics = firstWorld ? getBatiBotTopicsForWorld(firstWorld.worldId) : [];
  const firstTopic = unlockedTopics[0];
  const stageContent = firstTopic ? getBatiBotStageNodesForTopic(firstTopic.topicId) : [];

  return {
    currentLevel,
    currentStage: stageContent[0] ?? null,
    learnerProfile: apiProfile,
    progressMetadata: buildBatiBotApiProgress(apiProfile.userId, apiProfile.curriculumLevel, progress),
    rewardMetadata: buildBatiBotGamification(progress),
    stageContent,
    uiMetadata: BATIBOT_UI_UX_METADATA[currentLevel.label],
    unlockedTopics,
    unlockedWorlds,
  };
}

export function buildBatiBotAiContext(request: {
  activityType: string;
  levelId: BatiBotApiCurriculumLevel["id"];
  stageType: BatiBotStageType;
  topicId: string;
  worldId: string;
}) {
  const level = getBatiBotCurriculumLevel(request.levelId);
  const phase = BATIBOT_STAGE_TYPE_TO_PHASE[request.stageType];

  return {
    activityType: request.activityType,
    expectedJsonSchema: {
      activityType: "string",
      animationType: "string",
      audioText: "string",
      choices: "string[]",
      completionCondition: "string",
      correctAnswer: "string",
      feedbackCorrect: "string",
      feedbackWrong: "string",
      imagePrompt: "string",
      instructionText: "string",
      mainWord: "string",
      mascotMessage: "string",
      nodeIndex: 1,
      starReward: "number",
      stageType: request.stageType,
      xpReward: "number",
    },
    level,
    snapshot: buildBatiBotCurriculumIntelligenceSnapshot(level.label),
    stageRules: BATIBOT_STAGE_TYPE_TO_PHASE[request.stageType],
    uiUxRules: BATIBOT_UI_UX_METADATA[level.label],
    validationRules: BATIBOT_ACTIVE_LEARNING_METADATA.find((stage) => stage.phase === phase)
      ?.validationRules ?? [],
    worldId: request.worldId,
    topicId: request.topicId,
  };
}

export function getBatiBotStageTypeForPhase(phase: ActiveLearningPhase) {
  return BATIBOT_PHASE_TO_STAGE_TYPE[phase];
}
