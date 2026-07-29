import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";
import type { LearnerLevel } from "@/src/types/quiz";

export type BatiBotApiServiceGroup =
  | "auth"
  | "admin"
  | "ai"
  | "content"
  | "curriculum"
  | "gamification"
  | "learner"
  | "monitoring"
  | "progress"
  | "rank"
  | "reports"
  | "reward"
  | "settings";

export type BatiBotApiLevelId =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

export type BatiBotApiRole = "learner" | "admin" | "tester";

export type BatiBotStageType =
  | "discover"
  | "explore"
  | "interact"
  | "practice"
  | "challenge"
  | "reward"
  | "progress"
  | "mastery";

export type BatiBotStageDisplayLabel =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "STAR"
  | "PROGRESS"
  | "MASTERED";

export type BatiBotContentStatus =
  | "draft"
  | "generating_stages"
  | "generating_content"
  | "needs_topics"
  | "missing_stages"
  | "needs_fix"
  | "ready_for_review"
  | "mobile_preview_passed"
  | "approved"
  | "published"
  | "archived";

export type BatiBotStageWorkflowStatus =
  | "empty"
  | "generated"
  | "needs_fix"
  | "valid"
  | "approved"
  | "published";

export type BatiBotValidationStatus = "missing" | "failed" | "passed";

export type BatiBotMobilePreviewStatus = "not_tested" | "passed" | "failed";

export type BatiBotDevicePreset = "android" | "iphone" | "tablet";

export interface BatiBotApiModuleContract {
  group: BatiBotApiServiceGroup;
  id: string;
  purpose: string;
  endpoints: string[];
  supports: ("learner-app" | "admin-app" | "secure-backend")[];
}

export interface BatiBotApiFirestoreCollection {
  collection: string;
  owner: BatiBotApiServiceGroup;
  purpose: string;
  readScope: "admin" | "learner-level" | "learner-self" | "system";
  requiredFields: string[];
  writeScope: "admin" | "learner-self" | "system";
}

export interface BatiBotApiProfile {
  avatar: string | null;
  createdAt: string;
  curriculumLevel: BatiBotApiLevelId;
  displayName: string;
  lastActiveAt: string;
  role: BatiBotApiRole;
  selectedBuddy: string | null;
  streak: number;
  totalStars: number;
  totalXP: number;
  userId: string;
}

export interface BatiBotApiCurriculumLevel {
  ageGroup: string;
  cognitiveRules: string[];
  description: string;
  displayOrder: number;
  id: BatiBotApiLevelId;
  isActive: boolean;
  label: LearnerLevel;
  learningFocus: string[];
  uiRules: string[];
}

export interface BatiBotApiWorld {
  backgroundImage: string;
  createdAt: string;
  createdBy: string;
  description: string;
  displayOrder: number;
  emoji: string;
  icon: string;
  levelId: BatiBotApiLevelId;
  linkedBadgeId: string;
  name: string;
  status: BatiBotContentStatus;
  themeColor: string;
  topicCount: number;
  unlockRequirement: string;
  updatedAt: string;
  updatedBy: string;
  worldId: string;
}

export interface BatiBotApiTopic {
  audioPrompt: string;
  category: string;
  createdAt: string;
  createdBy: string;
  difficulty: string;
  displayOrder: number;
  image: string;
  imagePrompt: string;
  levelId: BatiBotApiLevelId;
  name: string;
  objective: string;
  pronunciationText: string;
  starReward: number;
  status: BatiBotContentStatus;
  topicId: string;
  unlockRequirement: string;
  updatedAt: string;
  updatedBy: string;
  worldId: string;
  xpReward: number;
}

export interface BatiBotApiStageNode {
  activityType: string;
  animationType: string;
  audio: string;
  audioText: string;
  choices: string[];
  completionCondition: string;
  correctAnswer: string;
  displayLabel: BatiBotStageDisplayLabel;
  feedbackCorrect: string;
  feedbackWrong: string;
  image: string;
  imagePrompt: string;
  instructionText: string;
  levelId: BatiBotApiLevelId;
  mainWord: string;
  mascotMessage: string;
  mobilePreviewStatus: BatiBotMobilePreviewStatus;
  nodeIndex: 1;
  stageNodeId: string;
  stageType: BatiBotStageType;
  starReward: number;
  status: BatiBotStageWorkflowStatus;
  timerSeconds: number | null;
  topicId: string;
  unlockTarget: string;
  validationStatus: BatiBotValidationStatus;
  worldId: string;
  xpReward: number;
}

export interface BatiBotLearnerContentResponse {
  currentLevel: BatiBotApiCurriculumLevel;
  currentStage: BatiBotApiStageNode | null;
  learnerProfile: BatiBotApiProfile;
  progressMetadata: BatiBotApiProgress;
  rewardMetadata: BatiBotApiGamification;
  stageContent: BatiBotApiStageNode[];
  uiMetadata: BatiBotCurriculumUiMetadata;
  unlockedTopics: BatiBotApiTopic[];
  unlockedWorlds: BatiBotApiWorld[];
}

export interface BatiBotApiProgress {
  completedStages: string[];
  completedTopics: string[];
  completedWorlds: string[];
  currentStage: BatiBotStageType | null;
  lastCompletedAt: string | null;
  levelId: BatiBotApiLevelId;
  topicId: string | null;
  topicMasteryPercent: number;
  userId: string;
  worldId: string | null;
  worldProgressPercent: number;
}

export interface BatiBotApiGamification {
  achievements: string[];
  badges: string[];
  streak: number;
  totalStars: number;
  totalXP: number;
  unlockables: string[];
}

export interface BatiBotApiRankEntry {
  avatar: string | null;
  badges: string[];
  curriculumLevel: BatiBotApiLevelId;
  displayName: string;
  rank: number;
  totalStars: number;
  totalXP: number;
  userId: string;
}

export interface BatiBotAiContextRequest {
  activityType: string;
  levelId: BatiBotApiLevelId;
  stageType: BatiBotStageType;
  topicId: string;
  worldId: string;
}

export interface BatiBotAiDraftRecord {
  aiModel: string;
  aiPrompt: string;
  createdAt: string;
  createdBy: string;
  draftId: string;
  generatedContent: Partial<BatiBotApiStageNode>;
  levelId: BatiBotApiLevelId;
  stageType: BatiBotStageType;
  status: "draft" | "validated" | "rejected" | "ready_for_review";
  topicId: string;
  validationResult: BatiBotApiValidationResult | null;
  worldId: string;
}

export interface BatiBotApiValidationIssue {
  code: string;
  message: string;
  severity: "blocker" | "warning";
}

export interface BatiBotApiValidationResult {
  checkedAt: string;
  issues: BatiBotApiValidationIssue[];
  status: BatiBotValidationStatus;
  targetId: string;
}

export interface BatiBotMobilePreviewValidationResult {
  checkedAt: string;
  devicePreset: BatiBotDevicePreset;
  issues: BatiBotApiValidationIssue[];
  stageNodeId: string;
  status: BatiBotMobilePreviewStatus;
}

export interface BatiBotCurriculumIntelligenceService {
  dataOwned: string[];
  endpoints: string[];
  group: BatiBotApiServiceGroup;
  id: string;
  responsibility: string;
  title: string;
}

export interface BatiBotCurriculumLevelMetadata {
  blockedFormats: string[];
  focus: string[];
  gradeLevel: LearnerLevel;
  interactionRatio: number;
  learningGoals: string[];
  visualRatio: number;
  wordRecognitionRatio: number;
  worlds: string[];
}

export interface BatiBotActiveLearningStageMetadata {
  allowedActivities: string[];
  difficulty: "intro" | "guided" | "supported" | "less-guided" | "celebration" | "status";
  learningGoal: string;
  phase: ActiveLearningPhase;
  purpose: string;
  uiBehavior: string[];
  validationRules: string[];
  xpReward: {
    max: number;
    min: number;
  };
}

export interface BatiBotCurriculumUiMetadata {
  animations: string[];
  audioBehavior: string[];
  buttonSize: "extra-large" | "large" | "standard-large";
  fontScale: "extra-large" | "large" | "grade-progressive";
  gradeLevel: LearnerLevel;
  themeBehavior: string[];
  accessibility: string[];
}

export interface BatiBotFirestoreCollectionSchema {
  collection: string;
  purpose: string;
  requiredFields: string[];
  owner: BatiBotApiServiceGroup;
  readScope: "admin" | "learner-grade" | "learner-self" | "system";
  writeScope: "admin" | "learner-self" | "system";
}

export interface BatiBotCurriculumIntelligenceSnapshot {
  activeLearningStages: BatiBotActiveLearningStageMetadata[];
  adminMonitoring: typeof BATIBOT_ADMIN_MONITORING_METADATA;
  aiCuration: typeof BATIBOT_AI_CONTENT_CURATION_METADATA;
  apiFirestoreCollections: BatiBotApiFirestoreCollection[];
  apiLevels: BatiBotApiCurriculumLevel[];
  apiModules: BatiBotApiModuleContract[];
  firestoreCollections: BatiBotFirestoreCollectionSchema[];
  gamification: typeof BATIBOT_GAMIFICATION_METADATA;
  level: BatiBotCurriculumLevelMetadata;
  playTab: typeof BATIBOT_PLAY_TAB_METADATA;
  progression: typeof BATIBOT_PROGRESSION_METADATA;
  publishingRules: typeof BATIBOT_PUBLISHING_RULES;
  rankTab: typeof BATIBOT_RANK_TAB_METADATA;
  recommendedFolderStructure: typeof BATIBOT_RECOMMENDED_FOLDER_STRUCTURE;
  rewardTab: typeof BATIBOT_REWARD_TAB_METADATA;
  uiUx: BatiBotCurriculumUiMetadata;
  validationRules: typeof BATIBOT_VALIDATION_RULES;
}

export const BATIBOT_CURRICULUM_INTELLIGENCE_PIPELINE =
  "Admin -> BatiBot Curriculum Intelligence API -> Gemini API -> Draft Validator -> Admin Review -> Published Play Content";

export const BATIBOT_API_MODULES: BatiBotApiModuleContract[] = [
  {
    endpoints: [
      "GET /profile/:userId",
      "PATCH /profile/:userId",
      "GET /profile/:userId/curriculum-level",
    ],
    group: "auth",
    id: "auth-profile-api",
    purpose: "Manage learner/admin profiles and return level-scoped content identity.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /curriculum/levels",
      "GET /curriculum/levels/:levelId",
      "GET /curriculum/levels/:levelId/worlds",
    ],
    group: "curriculum",
    id: "curriculum-api",
    purpose: "Store fixed level metadata, cognitive rules, UI rules, and active worlds.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "POST /admin/worlds",
      "GET /admin/worlds",
      "GET /admin/worlds/:worldId",
      "PATCH /admin/worlds/:worldId",
      "DELETE /admin/worlds/:worldId",
      "POST /admin/worlds/:worldId/archive",
      "GET /learner/levels/:levelId/worlds",
    ],
    group: "content",
    id: "world-api",
    purpose: "Create, validate, publish, and serve Play map worlds.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "POST /admin/worlds/:worldId/topics",
      "GET /admin/worlds/:worldId/topics",
      "GET /admin/topics/:topicId",
      "PATCH /admin/topics/:topicId",
      "POST /admin/topics/:topicId/archive",
      "POST /admin/topics/:topicId/auto-create-stages",
      "GET /learner/worlds/:worldId/topics",
    ],
    group: "content",
    id: "topic-api",
    purpose: "Manage world topics and enforce automatic 8-stage creation.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /admin/topics/:topicId/stages",
      "GET /admin/stages/:stageNodeId",
      "PATCH /admin/stages/:stageNodeId",
      "POST /admin/stages/:stageNodeId/validate",
      "GET /learner/topics/:topicId/stages",
      "GET /learner/topics/:topicId/stages/:stageType",
    ],
    group: "content",
    id: "stage-node-api",
    purpose: "Store the exact content rendered by LOOK, TAP, TRY, CHOOSE, PLAY, STAR, PROGRESS, and MASTERED screens.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /learner/home/:userId",
      "GET /learner/play-map/:userId",
      "GET /learner/world/:worldId",
      "GET /learner/topic/:topicId",
      "GET /learner/topic/:topicId/current-stage",
      "POST /learner/stage/:stageNodeId/complete",
    ],
    group: "learner",
    id: "learner-content-api",
    purpose: "Return only published, level-appropriate Play content and rendering metadata.",
    supports: ["learner-app"],
  },
  {
    endpoints: [
      "GET /progress/:userId",
      "GET /progress/:userId/world/:worldId",
      "GET /progress/:userId/topic/:topicId",
      "POST /progress/:userId/stage-complete",
      "POST /progress/:userId/topic-mastered",
    ],
    group: "progress",
    id: "progress-api",
    purpose: "Track stage completion, mastery, world progress, and next unlock state.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /gamification/:userId",
      "POST /gamification/:userId/award-xp",
      "POST /gamification/:userId/award-star",
      "POST /gamification/:userId/check-achievements",
      "POST /gamification/:userId/check-badges",
    ],
    group: "gamification",
    id: "gamification-api",
    purpose: "Manage XP, stars, streaks, badges, achievements, and unlockables.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /rank/leaderboard",
      "GET /rank/leaderboard/:levelId",
      "GET /rank/user/:userId",
    ],
    group: "rank",
    id: "rank-api",
    purpose: "Support Rank tab data based on stars, XP, badges, and level.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "GET /rewards/:userId",
      "GET /rewards/:userId/badges",
      "GET /rewards/:userId/achievements",
    ],
    group: "reward",
    id: "reward-api",
    purpose: "Support Reward tab badges, progress badges, and achievements.",
    supports: ["learner-app", "admin-app"],
  },
  {
    endpoints: [
      "POST /admin/ai/context",
      "POST /admin/ai/generate-draft",
    ],
    group: "ai",
    id: "ai-context-and-gemini-draft-api",
    purpose: "Build secure curriculum-aware AI context and generate editable stage drafts.",
    supports: ["admin-app", "secure-backend"],
  },
  {
    endpoints: [
      "POST /admin/drafts/:draftId/validate",
      "POST /admin/topics/:topicId/validate",
      "POST /admin/worlds/:worldId/validate",
      "POST /admin/mobile-preview/validate",
    ],
    group: "admin",
    id: "validation-and-mobile-preview-api",
    purpose: "Validate curriculum alignment, stage correctness, mobile rendering, and publish readiness.",
    supports: ["admin-app", "secure-backend"],
  },
  {
    endpoints: [
      "POST /admin/topics/:topicId/publish",
      "POST /admin/worlds/:worldId/publish",
      "POST /admin/stages/:stageNodeId/publish",
    ],
    group: "admin",
    id: "publishing-api",
    purpose: "Publish only approved content with complete validation and mobile preview status.",
    supports: ["admin-app", "secure-backend"],
  },
  {
    endpoints: [
      "GET /admin/monitoring/learners",
      "GET /admin/monitoring/content",
      "GET /admin/monitoring/publishing",
      "GET /admin/monitoring/validation",
    ],
    group: "monitoring",
    id: "monitoring-api",
    purpose: "Track learners, content status, publishing status, and validation failures.",
    supports: ["admin-app"],
  },
  {
    endpoints: [
      "GET /admin/reports/overview",
      "GET /admin/reports/completion",
      "GET /admin/reports/difficult-topics",
      "GET /admin/reports/ranking",
      "GET /admin/reports/rewards",
      "GET /admin/reports/ai-drafts",
    ],
    group: "reports",
    id: "reports-api",
    purpose: "Provide completion, difficulty, ranking, reward, AI, and publishing reports.",
    supports: ["admin-app"],
  },
  {
    endpoints: ["GET /admin/logs", "POST /admin/logs"],
    group: "admin",
    id: "admin-logs-api",
    purpose: "Store audit trail for world/topic/stage creation, validation, preview, approval, publish, and archive events.",
    supports: ["admin-app", "secure-backend"],
  },
  {
    endpoints: ["GET /admin/settings", "PATCH /admin/settings"],
    group: "settings",
    id: "settings-rules-api",
    purpose: "Manage XP, stars, badges, unlock, validation, preview, AI prompt, and UI metadata rules.",
    supports: ["admin-app", "secure-backend"],
  },
];

export const BATIBOT_CURRICULUM_LEVEL_METADATA: Record<
  LearnerLevel,
  BatiBotCurriculumLevelMetadata
> = {
  Preschool: {
    blockedFormats: [
      "paragraph reading",
      "long instructions",
      "essay activities",
      "complex word problems",
    ],
    focus: ["visual recognition", "listening", "touch", "matching", "early counting"],
    gradeLevel: "Preschool",
    interactionRatio: 15,
    learningGoals: ["Recognize", "Listen", "Touch", "Match", "Identify", "Count"],
    visualRatio: 80,
    wordRecognitionRatio: 5,
    worlds: [
      "My Family World",
      "My Body World",
      "My Colorful World",
      "Shape Kingdom",
      "Animal Adventure",
      "Fruit Garden",
      "Food Town",
      "Number Village",
      "Counting Forest",
      "Big and Small Village",
      "More and Less Kingdom",
      "Pattern Playground",
    ],
  },
  Kindergarten: {
    blockedFormats: [
      "long reading tasks",
      "paragraph comprehension",
      "unsupported spelling tests",
      "multi-step written problems",
    ],
    focus: [
      "Letter Recognition",
      "Letter Sounds",
      "Beginning Sounds",
      "Phonological Awareness",
      "Oral Language",
      "Early Reading",
      "Number Recognition",
      "Patterns",
      "Shapes",
    ],
    gradeLevel: "Kindergarten",
    interactionRatio: 30,
    learningGoals: ["Listen", "Identify", "Match", "Say", "Recognize", "Read Simple Words"],
    visualRatio: 55,
    wordRecognitionRatio: 15,
    worlds: [
      "Alphabet Adventure",
      "School World",
      "Community Helpers",
      "Counting Forest",
      "Big & Small Village",
      "More & Less Valley",
      "Pattern Playground",
    ],
  },
  "Grade 1": {
    blockedFormats: ["long passages", "multi-paragraph writing", "abstract grammar lectures"],
    focus: [
      "Nouns",
      "Verbs",
      "Adjectives",
      "Reading Words",
      "Simple Sentences",
      "Addition",
      "Subtraction",
      "Numbers",
      "Shapes",
      "Time",
    ],
    gradeLevel: "Grade 1",
    interactionRatio: 35,
    learningGoals: ["Read", "Choose", "Match", "Count", "Add", "Subtract", "Sequence"],
    visualRatio: 40,
    wordRecognitionRatio: 25,
    worlds: [
      "Word Kingdom",
      "Reading Quest",
      "Family Story Village",
      "Nature Explorer",
      "Number Kingdom",
      "Math Mountain",
      "Shape Adventure",
      "Time Town",
    ],
  },
  "Grade 2": {
    blockedFormats: ["unsupported multi-step problems", "dense instructions", "adult vocabulary"],
    focus: [
      "Synonyms",
      "Antonyms",
      "Reading Comprehension",
      "Place Value",
      "Measurement",
      "Multiplication",
      "Problem Solving",
    ],
    gradeLevel: "Grade 2",
    interactionRatio: 35,
    learningGoals: ["Compare", "Explain Simply", "Solve", "Measure", "Read", "Apply"],
    visualRatio: 30,
    wordRecognitionRatio: 35,
    worlds: [
      "Vocabulary Village",
      "Story Quest",
      "Community Explorer",
      "Place Value City",
      "Problem Solver City",
      "Measurement Harbor",
      "Multiplication Workshop",
      "Challenge Arena",
    ],
  },
  "Grade 3": {
    blockedFormats: ["trick questions", "unscaffolded abstract problems", "adult-facing analytics"],
    focus: [
      "Context Clues",
      "Story Elements",
      "Multiplication",
      "Division",
      "Fractions",
      "Money",
      "Word Problems",
      "Multi-Step Operations",
    ],
    gradeLevel: "Grade 3",
    interactionRatio: 30,
    learningGoals: ["Infer", "Solve", "Compare", "Analyze", "Apply", "Master"],
    visualRatio: 25,
    wordRecognitionRatio: 45,
    worlds: [
      "Reading Quest",
      "Context Clue Canyon",
      "Story Adventure",
      "Number Empire",
      "Multiplication Empire",
      "Division Kingdom",
      "Fraction Fortress",
      "Money Market",
      "Master Challenge Arena",
    ],
  },
};

export const BATIBOT_ACTIVE_LEARNING_METADATA: BatiBotActiveLearningStageMetadata[] = [
  {
    allowedActivities: ["show", "listen", "tap to hear"],
    difficulty: "intro",
    learningGoal: "Meet the current word, concept, number, group, or pattern.",
    phase: "Discover",
    purpose: "Introduce one learning target.",
    uiBehavior: ["single focal asset", "speaker control", "short prompt"],
    validationRules: ["one target only", "no assessment wording", "no extra topic"],
    xpReward: { min: 0, max: 5 },
  },
  {
    allowedActivities: ["tap", "listen", "observe"],
    difficulty: "guided",
    learningGoal: "Explore known examples with gentle support.",
    phase: "Explore",
    purpose: "Let the learner observe and hear the target.",
    uiBehavior: ["tap feedback", "audio support", "large target"],
    validationRules: ["answer can be visible", "no trick choices"],
    xpReward: { min: 0, max: 5 },
  },
  {
    allowedActivities: ["tap", "match", "count", "say", "choose"],
    difficulty: "guided",
    learningGoal: "Use the target in a supported mini-action.",
    phase: "Interact",
    purpose: "Turn observation into a guided action.",
    uiBehavior: ["large controls", "supportive hints", "immediate feedback"],
    validationRules: ["one clear child action", "support remains visible"],
    xpReward: { min: 5, max: 15 },
  },
  {
    allowedActivities: ["match", "choose", "repeat", "count known objects"],
    difficulty: "supported",
    learningGoal: "Repeat already introduced content.",
    phase: "Practice",
    purpose: "Build memory through supported repetition.",
    uiBehavior: ["choice grid", "speaker", "gentle retry"],
    validationRules: ["known content only", "support required", "no new vocabulary"],
    xpReward: { min: 15, max: 45 },
  },
  {
    allowedActivities: ["choose", "find", "compare", "complete", "timed challenge"],
    difficulty: "less-guided",
    learningGoal: "Check understanding with fewer hints.",
    phase: "Challenge",
    purpose: "Assess known content without introducing new material.",
    uiBehavior: ["less hinting", "clear success/fail feedback", "no dense explanation"],
    validationRules: ["known content only", "no answer giveaway", "no new concept"],
    xpReward: { min: 25, max: 60 },
  },
  {
    allowedActivities: ["claim reward", "tap star", "view badge"],
    difficulty: "celebration",
    learningGoal: "Celebrate completion.",
    phase: "Reward",
    purpose: "Connect effort to XP, stars, badges, and celebration.",
    uiBehavior: ["reward animation", "star or badge display", "short celebration"],
    validationRules: ["no new question", "reward must match configured impact"],
    xpReward: { min: 10, max: 30 },
  },
  {
    allowedActivities: ["view progress", "continue", "next step"],
    difficulty: "status",
    learningGoal: "See saved progress.",
    phase: "Progress",
    purpose: "Show progress in child-safe visual form.",
    uiBehavior: ["progress bar", "world/topic marker", "next button"],
    validationRules: ["no dense analytics", "no admin language"],
    xpReward: { min: 0, max: 5 },
  },
  {
    allowedActivities: ["view mastery", "unlock next", "continue"],
    difficulty: "celebration",
    learningGoal: "Confirm mastery and next unlock.",
    phase: "Mastery",
    purpose: "Close the topic and point to the next unlock.",
    uiBehavior: ["mastery badge", "next unlock", "celebration feedback"],
    validationRules: ["requires completion", "no new learning target"],
    xpReward: { min: 20, max: 60 },
  },
];

export const BATIBOT_API_LEVELS: BatiBotApiCurriculumLevel[] = [
  {
    ageGroup: "Preschool",
    cognitiveRules: ["highly visual", "minimal text", "audio-first", "recognition-based"],
    description: "Highly visual recognition, listening, matching, and early counting.",
    displayOrder: 1,
    id: "preschool",
    isActive: true,
    label: "Preschool",
    learningFocus: BATIBOT_CURRICULUM_LEVEL_METADATA.Preschool.focus,
    uiRules: ["large image targets", "speaker controls", "very short copy"],
  },
  {
    ageGroup: "Kindergarten",
    cognitiveRules: ["letter recognition", "phonological awareness", "oral language", "foundational numeracy"],
    description: "Letters, sounds, oral language, early reading, and foundational numeracy.",
    displayOrder: 2,
    id: "kindergarten",
    isActive: true,
    label: "Kindergarten",
    learningFocus: BATIBOT_CURRICULUM_LEVEL_METADATA.Kindergarten.focus,
    uiRules: ["image plus label", "audio support", "large choices"],
  },
  {
    ageGroup: "Grade 1",
    cognitiveRules: ["words", "simple sentences", "addition", "subtraction"],
    description: "Words, simple sentences, addition, subtraction, numbers, shapes, and time.",
    displayOrder: 3,
    id: "grade1",
    isActive: true,
    label: "Grade 1",
    learningFocus: BATIBOT_CURRICULUM_LEVEL_METADATA["Grade 1"].focus,
    uiRules: ["short readable sentences", "visual support", "clear choice grids"],
  },
  {
    ageGroup: "Grade 2",
    cognitiveRules: ["comprehension", "place value", "measurement", "multiplication"],
    description: "Comprehension, vocabulary relationships, place value, measurement, and multiplication.",
    displayOrder: 4,
    id: "grade2",
    isActive: true,
    label: "Grade 2",
    learningFocus: BATIBOT_CURRICULUM_LEVEL_METADATA["Grade 2"].focus,
    uiRules: ["short scenarios", "comparison tasks", "structured problem surfaces"],
  },
  {
    ageGroup: "Grade 3",
    cognitiveRules: ["context clues", "fractions", "money", "division", "multi-step problems"],
    description: "Context clues, story elements, fractions, money, division, and multi-step problems.",
    displayOrder: 5,
    id: "grade3",
    isActive: true,
    label: "Grade 3",
    learningFocus: BATIBOT_CURRICULUM_LEVEL_METADATA["Grade 3"].focus,
    uiRules: ["readable problem text", "optional audio", "mastery review"],
  },
];

export const BATIBOT_STAGE_TYPE_TO_PHASE: Record<BatiBotStageType, ActiveLearningPhase> = {
  challenge: "Challenge",
  discover: "Discover",
  explore: "Explore",
  interact: "Interact",
  mastery: "Mastery",
  practice: "Practice",
  progress: "Progress",
  reward: "Reward",
};

export const BATIBOT_PHASE_TO_STAGE_TYPE: Record<ActiveLearningPhase, BatiBotStageType> = {
  Challenge: "challenge",
  Discover: "discover",
  Explore: "explore",
  Interact: "interact",
  Mastery: "mastery",
  Practice: "practice",
  Progress: "progress",
  Reward: "reward",
};

export const BATIBOT_STAGE_DISPLAY_LABELS: Record<BatiBotStageType, BatiBotStageDisplayLabel> = {
  challenge: "PLAY",
  discover: "LOOK",
  explore: "TAP",
  interact: "TRY",
  mastery: "MASTERED",
  practice: "CHOOSE",
  progress: "PROGRESS",
  reward: "STAR",
};

export const BATIBOT_REQUIRED_STAGE_TYPES = [
  "discover",
  "explore",
  "interact",
  "practice",
  "challenge",
  "reward",
  "progress",
  "mastery",
] as const satisfies readonly BatiBotStageType[];

export const BATIBOT_UI_UX_METADATA: Record<LearnerLevel, BatiBotCurriculumUiMetadata> = {
  Preschool: {
    accessibility: ["large tap targets", "audio-first prompts", "minimal reading"],
    animations: ["gentle bounce", "reward sparkle", "tap feedback"],
    audioBehavior: ["auto-play introduction", "speaker always visible"],
    buttonSize: "extra-large",
    fontScale: "extra-large",
    gradeLevel: "Preschool",
    themeBehavior: ["bright visuals", "high contrast", "asset-led screens"],
  },
  Kindergarten: {
    accessibility: ["large buttons", "letter and sound support", "speaker visible"],
    animations: ["tap feedback", "match feedback", "reward sparkle"],
    audioBehavior: ["letter sounds", "beginning sounds", "simple word prompts"],
    buttonSize: "large",
    fontScale: "large",
    gradeLevel: "Kindergarten",
    themeBehavior: ["visual plus symbol", "world thumbnails", "phase colors"],
  },
  "Grade 1": {
    accessibility: ["large controls", "read-aloud support", "clear sentence spacing"],
    animations: ["success feedback", "progress fill", "badge reveal"],
    audioBehavior: ["speaker optional", "read prompt support"],
    buttonSize: "large",
    fontScale: "grade-progressive",
    gradeLevel: "Grade 1",
    themeBehavior: ["more text support", "still image-supported"],
  },
  "Grade 2": {
    accessibility: ["comfortable controls", "optional audio", "short paragraph guard"],
    animations: ["progress fill", "reward reveal"],
    audioBehavior: ["optional read-aloud", "problem prompt support"],
    buttonSize: "standard-large",
    fontScale: "grade-progressive",
    gradeLevel: "Grade 2",
    themeBehavior: ["reduced visual assistance", "clear work surfaces"],
  },
  "Grade 3": {
    accessibility: ["readable problem text", "optional audio", "no cramped cards"],
    animations: ["mastery reveal", "rank progress", "reward reveal"],
    audioBehavior: ["optional support", "no forced auto-play"],
    buttonSize: "standard-large",
    fontScale: "grade-progressive",
    gradeLevel: "Grade 3",
    themeBehavior: ["independent learning", "structured problem surfaces"],
  },
};

export const BATIBOT_CURRICULUM_INTELLIGENCE_SERVICES: BatiBotCurriculumIntelligenceService[] = [
  {
    dataOwned: ["Levels", "Worlds", "Topics", "competency traces"],
    endpoints: ["/curriculum/levels", "/curriculum/worlds", "/curriculum/topics"],
    group: "curriculum",
    id: "curriculum-service",
    responsibility:
      "Store and resolve grade-specific curriculum maps for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3.",
    title: "Curriculum Service",
  },
  {
    dataOwned: ["Framework rules", "phase goals", "phase restrictions"],
    endpoints: ["/framework/stages", "/framework/rules"],
    group: "curriculum",
    id: "active-learning-framework-service",
    responsibility:
      "Define Discover, Explore, Interact, Practice, Challenge, Reward, Progress, and Mastery semantics.",
    title: "Active Learning Framework Service",
  },
  {
    dataOwned: ["Learning templates", "phase node templates", "child actions"],
    endpoints: ["/templates/preschool", "/templates/kindergarten", "/templates/grade1"],
    group: "curriculum",
    id: "learning-template-service",
    responsibility:
      "Return reusable stage-by-stage templates such as Discover: Show Mother, Explore: Tap Mother, Practice: Choose Mother.",
    title: "Learning Template Service",
  },
  {
    dataOwned: ["Cognitive rules", "allowed actions", "blocked formats"],
    endpoints: ["/cognitive-rules/preschool", "/cognitive-rules/kindergarten", "/cognitive-rules/grade3"],
    group: "curriculum",
    id: "cognitive-rules-engine",
    responsibility:
      "Constrain each grade by allowed actions, reading length, reasoning depth, and activity formats.",
    title: "Cognitive Rules Engine",
  },
  {
    dataOwned: ["AI context", "selected curriculum contract", "approved word set"],
    endpoints: ["/ai/context"],
    group: "ai",
    id: "ai-context-builder",
    responsibility:
      "Build the Gemini-ready context from admin selections, Play placement, framework rules, templates, and cognitive constraints.",
    title: "AI Context Builder",
  },
  {
    dataOwned: ["Gemini draft request", "prompt modules", "response schema"],
    endpoints: ["/ai/generate"],
    group: "ai",
    id: "gemini-generator-service",
    responsibility:
      "Send a constrained draft request to Gemini through the secure backend only; never expose secrets in client screens.",
    title: "Gemini Generator Service",
  },
  {
    dataOwned: ["Validation results", "publish blockers", "review warnings"],
    endpoints: ["/validation/draft"],
    group: "ai",
    id: "draft-validator",
    responsibility:
      "Check age suitability, curriculum alignment, framework alignment, difficulty, asset fit, mobile preview, and content format.",
    title: "Draft Validator",
  },
  {
    dataOwned: ["Drafts", "review state", "admin edits"],
    endpoints: ["/drafts"],
    group: "content",
    id: "draft-management",
    responsibility:
      "Manage draft, review, needs-fix, published, and archived content states without bypassing validation.",
    title: "Draft Management",
  },
  {
    dataOwned: ["Published Content", "publish logs", "learner visibility"],
    endpoints: ["/publish"],
    group: "content",
    id: "content-publishing",
    responsibility:
      "Publish only validated content to the matching learner grade, Play world, topic, phase, and node.",
    title: "Content Publishing",
  },
  {
    dataOwned: ["Users", "roles", "local learner profile metadata"],
    endpoints: ["/users"],
    group: "learner",
    id: "user-profiles",
    responsibility:
      "Represent learner profiles and admin roles while keeping learner entry email-free and admin access secured.",
    title: "User Profiles",
  },
  {
    dataOwned: ["Viewed topics", "completed topics", "XP", "stars", "mastery"],
    endpoints: ["/progress"],
    group: "learner",
    id: "progress-tracking",
    responsibility:
      "Track grade-scoped progress for Play, Rank, Reward, mastery, and next unlock behavior.",
    title: "Progress Tracking",
  },
  {
    dataOwned: ["XP", "stars", "levels", "streaks", "badges", "achievements"],
    endpoints: ["/rewards", "/badges"],
    group: "learner",
    id: "gamification-service",
    responsibility:
      "Keep reward, badge, star, streak, and achievement impact consistent across similar activities.",
    title: "Gamification Service",
  },
  {
    dataOwned: ["Personal rank tier", "stars", "XP", "next goal"],
    endpoints: ["/rank"],
    group: "learner",
    id: "ranking-service",
    responsibility:
      "Support the Rank tab as personal progress and standing. Do not add a public child leaderboard unless that product scope is approved later.",
    title: "Ranking Service",
  },
  {
    dataOwned: ["Analytics", "completion rate", "difficulty signals", "coverage"],
    endpoints: ["/analytics"],
    group: "monitoring",
    id: "admin-monitoring",
    responsibility:
      "Monitor most played worlds, completion rates, content coverage, difficulty, learner progress, and publishing health.",
    title: "Admin Monitoring",
  },
];

export const BATIBOT_MINIMUM_API_DATA = [
  "Levels",
  "Worlds",
  "Topics",
  "Framework Rules",
  "Learning Templates",
  "Cognitive Rules",
  "Users",
  "Progress",
  "XP",
  "Stars",
  "Badges",
  "Achievements",
  "Drafts",
  "Published Content",
  "Analytics",
] as const;

export const BATIBOT_PLAY_TAB_METADATA = {
  pathLayout: [
    "Discover",
    "Explore",
    "Interact",
    "Practice",
    "Challenge",
    "Reward",
    "Progress",
    "Mastery",
  ] satisfies ActiveLearningPhase[],
  rule: "Each topic contains exactly one node for each Active Learning stage.",
  visibleLearnerModel: "Play is the central world-map experience; Learn and Quiz are internal Play actions.",
};

export const BATIBOT_RANK_TAB_METADATA = {
  displayFields: ["avatar", "name", "stars", "rank", "XP", "streak", "next goal"],
  rankBasis: "personal stars and progress",
  rule: "Complete Topic -> Earn 1 Star",
  safetyRule:
    "Use personal progress ranking unless a public child leaderboard is explicitly approved later.",
};

export const BATIBOT_REWARD_TAB_METADATA = {
  achievementTypes: ["topic completion", "world completion", "streak", "mastery"],
  badgeTypes: ["progress badge", "world badge", "skill badge", "mastery badge"],
  displayFields: ["badges", "progress badges", "achievements", "stars", "unlockables"],
  rule: "Reward outcomes must be tied to world, topic, phase, and mastery progress.",
};

export const BATIBOT_GAMIFICATION_METADATA = {
  achievements: ["first topic complete", "world complete", "perfect challenge", "mastery"],
  badges: ["topic badge", "world badge", "streak badge", "mastery badge"],
  levels: "XP increases learner level and supports Rank progress.",
  rewards: ["XP", "stars", "badges", "achievements", "unlockables"],
  stars: "One topic completion earns one star by default.",
  streaks: "Daily learning can extend streak state without punishing young learners harshly.",
  unlockables: ["next topic", "next world", "badge", "mastery celebration"],
  xp: "XP range is controlled by phase and difficulty, not random prompt output.",
};

export const BATIBOT_PROGRESSION_METADATA = {
  levelCompletionRules: [
    "A grade level is complete when required worlds and mastery checkpoints are complete.",
  ],
  masteryRequirements: [
    "Complete required Active Learning phases for the topic.",
    "Pass Challenge without introducing new content.",
    "Record Reward, Progress, and Mastery state.",
  ],
  topicCompletionRules: [
    "One node per stage must be available or intentionally system-generated.",
    "Reward and Progress stages close the topic loop.",
  ],
  unlockRequirements: [
    "Learner grade must match content grade.",
    "Previous topic or world requirement must be met unless admin unlocks it.",
    "Published content must be mapped to Grade > World > Topic > Phase > Node.",
  ],
  worldCompletionRules: [
    "A world is complete when required topics in that world reach Mastery.",
  ],
};

export const BATIBOT_AI_CONTENT_CURATION_METADATA = {
  aiContextBuilder: [
    "Resolve grade, world, topic, phase, node, asset, reward, and unlock path.",
    "Attach cognitive rules, UI/UX rules, approved vocabulary, and validation gates.",
  ],
  contentApproval: [
    "Admin must edit or approve the draft.",
    "Publish is blocked by missing mapping, missing asset, missing preview, or phase violations.",
  ],
  draftValidation: [
    "Validate phase fit.",
    "Validate Practice repeats known content.",
    "Validate Challenge introduces no new content.",
    "Validate mobile UI and asset fit.",
    "Validate reward and unlock fit.",
  ],
  promptBuilder: [
    "BatiBot supplies the source-of-truth contract.",
    "Gemini receives constrained instructions and returns JSON only.",
  ],
  workflow: [
    "Admin",
    "Select Level",
    "Select World",
    "Select Topic",
    "Generate Draft",
    "AI Context Engine",
    "Gemini API",
    "Draft Validation",
    "Admin Review",
    "Publish",
  ],
};

export const BATIBOT_ADMIN_MONITORING_METADATA = {
  analytics: [
    "completion rate",
    "drop-off by phase",
    "difficulty health",
    "reward health",
    "asset coverage",
  ],
  contentMonitoring: [
    "drafts",
    "needs review",
    "needs asset",
    "needs Play mapping",
    "published",
  ],
  learnerMonitoring: ["learner grade", "world progress", "topic progress", "phase progress"],
  progressMonitoring: ["XP", "stars", "badges", "mastery", "next unlock"],
  publishingMonitoring: ["validation logs", "publish logs", "admin reviewer", "published at"],
  reports: ["Play coverage", "activity performance", "learner progress", "publishing health"],
};

export const BATIBOT_PUBLISHING_RULES = [
  "Block publish when grade, world, topic, phase, or node is missing.",
  "Block publish when image-based content has no approved asset id.",
  "Block publish when mobile preview has not been checked.",
  "Block publish when Practice introduces unsupported new content.",
  "Warn when Challenge appears to introduce new content.",
  "Warn when XP falls outside phase-appropriate range.",
  "Require reward and unlock mapping before release readiness.",
  "Published content must be visible only to matching learner grade and Play placement.",
];

export const BATIBOT_VALIDATION_RULES = {
  adminReview: [
    "age appropriate",
    "objective clear",
    "instructions understandable",
    "questions complete",
    "answers valid",
    "no duplicate questions",
    "no broken matching pairs",
    "no low-quality AI output",
    "topic matches curriculum",
    "question count acceptable",
  ],
  aiDraft: [
    "JSON-only response",
    "question metadata included",
    "known content boundaries followed",
    "no publication claim",
  ],
  learnerSafety: [
    "no unsafe or mature content",
    "no frightening content",
    "no dense adult instructions",
    "copy remains child-facing",
  ],
  phase: BATIBOT_ACTIVE_LEARNING_METADATA.map((stage) => ({
    phase: stage.phase,
    rules: stage.validationRules,
  })),
};

export const BATIBOT_FIRESTORE_COLLECTIONS: BatiBotFirestoreCollectionSchema[] = [
  {
    collection: "curriculumLevels/{gradeLevel}",
    owner: "curriculum",
    purpose: "Stores grade-level curriculum metadata, focus, restrictions, and world list.",
    readScope: "admin",
    requiredFields: ["gradeLevel", "worlds", "focus", "learningGoals", "blockedFormats"],
    writeScope: "system",
  },
  {
    collection: "curriculumWorlds/{worldId}",
    owner: "curriculum",
    purpose: "Stores world metadata and topic ids.",
    readScope: "learner-grade",
    requiredFields: ["gradeLevel", "worldId", "title", "topicIds", "assetId"],
    writeScope: "admin",
  },
  {
    collection: "curriculumTopics/{topicId}",
    owner: "curriculum",
    purpose: "Stores topic metadata, competency trace, and one-node-per-stage structure.",
    readScope: "learner-grade",
    requiredFields: ["gradeLevel", "worldId", "topicId", "title", "stages"],
    writeScope: "admin",
  },
  {
    collection: "activeLearningRules/{phase}",
    owner: "curriculum",
    purpose: "Stores phase purpose, activities, UI behavior, XP range, and validation rules.",
    readScope: "admin",
    requiredFields: ["phase", "purpose", "allowedActivities", "validationRules", "xpReward"],
    writeScope: "system",
  },
  {
    collection: "curatedPlayContent/{contentId}",
    owner: "content",
    purpose: "Stores drafts, review items, and published Play content.",
    readScope: "learner-grade",
    requiredFields: ["gradeLevel", "worldId", "topicId", "phase", "node", "status", "questions"],
    writeScope: "admin",
  },
  {
    collection: "aiDraftRequests/{requestId}",
    owner: "ai",
    purpose: "Stores admin AI context requests and prompt contract versions.",
    readScope: "admin",
    requiredFields: ["adminUid", "contractVersion", "playTarget", "status", "createdAt"],
    writeScope: "admin",
  },
  {
    collection: "validationLogs/{logId}",
    owner: "ai",
    purpose: "Stores validator results, blockers, warnings, and review actions.",
    readScope: "admin",
    requiredFields: ["contentId", "issues", "validatorVersion", "createdAt"],
    writeScope: "system",
  },
  {
    collection: "users/{uid}",
    owner: "learner",
    purpose: "Stores learner/admin profile, role, and grade assignment.",
    readScope: "learner-self",
    requiredFields: ["uid", "role", "gradeLevel"],
    writeScope: "learner-self",
  },
  {
    collection: "learnerProgress/{uid}",
    owner: "learner",
    purpose: "Stores Play, Rank, Reward, XP, stars, badges, and mastery progress.",
    readScope: "learner-self",
    requiredFields: ["uid", "gradeLevel", "completedTopicIds", "xp", "stars", "badges"],
    writeScope: "learner-self",
  },
  {
    collection: "adminMonitoring/{eventId}",
    owner: "monitoring",
    purpose: "Stores publishing, analytics, and validation events for reports.",
    readScope: "admin",
    requiredFields: ["eventType", "actorUid", "targetId", "createdAt"],
    writeScope: "system",
  },
];

export const BATIBOT_API_FIRESTORE_COLLECTIONS: BatiBotApiFirestoreCollection[] = [
  {
    collection: "users",
    owner: "auth",
    purpose: "Stores learner/admin profile, role, selected buddy, grade level, stars, XP, streak, and activity timestamps.",
    readScope: "learner-self",
    requiredFields: ["userId", "displayName", "role", "curriculumLevel", "selectedBuddy", "totalStars", "totalXP"],
    writeScope: "learner-self",
  },
  {
    collection: "levels",
    owner: "curriculum",
    purpose: "Stores fixed curriculum level metadata and UI/cognitive rules.",
    readScope: "learner-level",
    requiredFields: ["id", "label", "learningFocus", "cognitiveRules", "uiRules", "displayOrder", "isActive"],
    writeScope: "system",
  },
  {
    collection: "worlds",
    owner: "content",
    purpose: "Stores Play map worlds and publish status.",
    readScope: "learner-level",
    requiredFields: ["worldId", "levelId", "name", "topicCount", "status", "unlockRequirement"],
    writeScope: "admin",
  },
  {
    collection: "topics",
    owner: "content",
    purpose: "Stores world topics, objective, rewards, media prompts, and publish status.",
    readScope: "learner-level",
    requiredFields: ["topicId", "worldId", "levelId", "name", "objective", "status", "xpReward", "starReward"],
    writeScope: "admin",
  },
  {
    collection: "stageNodes",
    owner: "content",
    purpose: "Stores one node per topic stage for LOOK, TAP, TRY, CHOOSE, PLAY, STAR, PROGRESS, and MASTERED screens.",
    readScope: "learner-level",
    requiredFields: ["stageNodeId", "topicId", "worldId", "levelId", "stageType", "displayLabel", "status"],
    writeScope: "admin",
  },
  {
    collection: "drafts",
    owner: "ai",
    purpose: "Stores AI/manual draft stage content, prompt, model, validation result, and review status.",
    readScope: "admin",
    requiredFields: ["draftId", "levelId", "worldId", "topicId", "stageType", "status", "createdBy"],
    writeScope: "admin",
  },
  {
    collection: "publishedContent",
    owner: "content",
    purpose: "Stores published learner-visible world/topic/stage content snapshots.",
    readScope: "learner-level",
    requiredFields: ["levelId", "worldId", "topicId", "stageNodeId", "publishedAt"],
    writeScope: "system",
  },
  {
    collection: "progress",
    owner: "progress",
    purpose: "Stores per-learner level/world/topic/stage progress and mastery state.",
    readScope: "learner-self",
    requiredFields: ["userId", "levelId", "completedStages", "completedTopics", "currentStage"],
    writeScope: "learner-self",
  },
  {
    collection: "gamification",
    owner: "gamification",
    purpose: "Stores XP, stars, streaks, unlockables, and reward calculations.",
    readScope: "learner-self",
    requiredFields: ["userId", "totalXP", "totalStars", "streak", "badges", "achievements"],
    writeScope: "system",
  },
  {
    collection: "badges",
    owner: "reward",
    purpose: "Stores badge definitions and badge progress metadata.",
    readScope: "learner-level",
    requiredFields: ["badgeId", "title", "description", "unlockRule"],
    writeScope: "admin",
  },
  {
    collection: "achievements",
    owner: "reward",
    purpose: "Stores achievement definitions and unlock rules.",
    readScope: "learner-level",
    requiredFields: ["achievementId", "title", "description", "unlockRule"],
    writeScope: "admin",
  },
  {
    collection: "leaderboards",
    owner: "rank",
    purpose: "Stores level-scoped rank snapshots based on stars, XP, and badges.",
    readScope: "learner-level",
    requiredFields: ["levelId", "entries", "updatedAt"],
    writeScope: "system",
  },
  {
    collection: "mobilePreviewTests",
    owner: "admin",
    purpose: "Stores Android, iPhone, and tablet preview validation results.",
    readScope: "admin",
    requiredFields: ["stageNodeId", "devicePreset", "status", "issues", "checkedAt"],
    writeScope: "admin",
  },
  {
    collection: "validationResults",
    owner: "admin",
    purpose: "Stores draft, topic, world, and stage validation results.",
    readScope: "admin",
    requiredFields: ["targetId", "status", "issues", "checkedAt"],
    writeScope: "system",
  },
  {
    collection: "adminLogs",
    owner: "admin",
    purpose: "Stores audit trail for admin create, generate, edit, validate, preview, approve, publish, and archive events.",
    readScope: "admin",
    requiredFields: ["actionType", "actorId", "targetId", "createdAt"],
    writeScope: "admin",
  },
  {
    collection: "reports",
    owner: "reports",
    purpose: "Stores generated overview, completion, difficult-topic, ranking, reward, AI, and publishing reports.",
    readScope: "admin",
    requiredFields: ["reportId", "type", "summary", "generatedAt"],
    writeScope: "system",
  },
  {
    collection: "settings",
    owner: "settings",
    purpose: "Stores configurable XP, star, badge, achievement, unlock, validation, preview, AI, and UI rules.",
    readScope: "admin",
    requiredFields: ["settingsId", "rules", "updatedAt"],
    writeScope: "admin",
  },
];

export const BATIBOT_RECOMMENDED_FOLDER_STRUCTURE = [
  "src/data/curriculum/ - grade worlds, topics, stage structures",
  "src/data/play-assets.ts - world, topic, Rank, and Reward assets",
  "src/domain/rules/ - curriculum, validation, publishing, and AI contracts",
  "src/services/ - admin, learner, analytics, and draft orchestration services",
  "src/infrastructure/gemini/ - secure Gemini request client",
  "firebase/functions/ - backend-only Gemini and privileged workflows",
  "app/(admin)/ - admin create, draft, test, review, publish, insights screens",
  "app/(tabs)/play - learner Play world map and phase routes",
  "app/(tabs)/rank - learner rank/progress surfaces",
  "app/(tabs)/reward - badges, achievements, stars, and reward surfaces",
];

export const BATIBOT_PRODUCTION_ARCHITECTURE = {
  foundation:
    "Curriculum Intelligence API is the source of truth for curriculum, rules, UI/UX behavior, progression, rewards, AI curation, validation, and publishing.",
  secureAiBoundary:
    "Gemini calls stay in secure backend/function layers and receive only constrained BatiBot contracts.",
  learnerBoundary:
    "Learners only receive published content for their grade and mapped Play destination.",
  reviewBoundary:
    "AI output cannot publish directly; admin review and validator gates are mandatory.",
  scalability:
    "Metadata is structured by grade, world, topic, phase, node, asset, reward, and validation event so new grades/worlds can be added without rewriting learner UI.",
};

export function getBatiBotCurriculumLevelMetadata(gradeLevel: LearnerLevel) {
  return BATIBOT_CURRICULUM_LEVEL_METADATA[gradeLevel];
}

export function getBatiBotUiUxMetadata(gradeLevel: LearnerLevel) {
  return BATIBOT_UI_UX_METADATA[gradeLevel];
}

export function buildBatiBotCurriculumIntelligenceSnapshot(
  gradeLevel: LearnerLevel
): BatiBotCurriculumIntelligenceSnapshot {
  return {
    activeLearningStages: BATIBOT_ACTIVE_LEARNING_METADATA,
    adminMonitoring: BATIBOT_ADMIN_MONITORING_METADATA,
    aiCuration: BATIBOT_AI_CONTENT_CURATION_METADATA,
    apiFirestoreCollections: BATIBOT_API_FIRESTORE_COLLECTIONS,
    apiLevels: BATIBOT_API_LEVELS,
    apiModules: BATIBOT_API_MODULES,
    firestoreCollections: BATIBOT_FIRESTORE_COLLECTIONS,
    gamification: BATIBOT_GAMIFICATION_METADATA,
    level: getBatiBotCurriculumLevelMetadata(gradeLevel),
    playTab: BATIBOT_PLAY_TAB_METADATA,
    progression: BATIBOT_PROGRESSION_METADATA,
    publishingRules: BATIBOT_PUBLISHING_RULES,
    rankTab: BATIBOT_RANK_TAB_METADATA,
    recommendedFolderStructure: BATIBOT_RECOMMENDED_FOLDER_STRUCTURE,
    rewardTab: BATIBOT_REWARD_TAB_METADATA,
    uiUx: getBatiBotUiUxMetadata(gradeLevel),
    validationRules: BATIBOT_VALIDATION_RULES,
  };
}
