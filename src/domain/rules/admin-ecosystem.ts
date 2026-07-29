import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";
import type { LearnerLevel } from "@/src/types/quiz";

export type AdminEcosystemSectionId =
  | "dashboard"
  | "curriculum"
  | "worlds"
  | "topics"
  | "stages"
  | "assets"
  | "generator"
  | "validation"
  | "review"
  | "preview-testing"
  | "published"
  | "monitoring"
  | "reports"
  | "logs"
  | "settings";

export type AdminFrameworkStageLabel =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "STAR"
  | "PROGRESS"
  | "MASTERED";

export interface AdminFrameworkStageContract {
  activityType: string;
  childLabel: AdminFrameworkStageLabel;
  instructionExample: string;
  learnerScreen: string;
  phase: ActiveLearningPhase;
  previewMode: string;
  purpose: string;
  requiredFields: string[];
  validationRules: string[];
}

export interface AdminWorldInterfaceContract {
  contentOwner: string;
  frameStyle: string;
  geminiRole: string;
  id: string;
  rendererFamily: string;
  stageFrame: string;
  stageRules: Record<ActiveLearningPhase, string>;
  topicInheritanceRule: string;
  validationRules: string[];
  visualRatio: string;
}

export type AdminContentFlowStatus =
  | "draft"
  | "for_review"
  | "needs_fix"
  | "approved"
  | "rejected"
  | "published"
  | "archived";

export interface AdminContentFlow {
  level: "preschool" | "kindergarten" | "grade1" | "grade2" | "grade3";
  publishedAt?: string;
  reviewedBy?: string;
  source: "manual" | "ai_generated";
  stage:
    | "discover"
    | "explore"
    | "interact"
    | "practice"
    | "challenge"
    | "reward"
    | "progress"
    | "mastery";
  status: AdminContentFlowStatus;
  topicId: string;
  worldId: string;
}

export interface AdminWorldModel {
  background: string;
  badge: string;
  description: string;
  difficulty: LearnerLevel;
  emoji: string;
  icon: string;
  level: LearnerLevel;
  metadata: Record<string, string>;
  order: number;
  status: "draft" | "published" | "archived";
  theme: string;
  unlockRule: string;
  worldId: string;
  worldName: string;
}

export interface AdminTopicModel {
  audioPrompt: string;
  category: string;
  difficulty: LearnerLevel;
  imagePrompt: string;
  objective: string;
  order: number;
  starReward: number;
  status: "draft" | "published" | "archived";
  topicId: string;
  topicName: string;
  unlockRules: string[];
  xpReward: number;
}

export interface AdminStageContentModel {
  activityType: string;
  animations: string[];
  answers: string[];
  audio: string;
  choices: string[];
  feedback: string;
  image: string;
  instruction: string;
  stars: number;
  stage: ActiveLearningPhase;
  title: string;
  validationStatus: "missing" | "needs_fix" | "ready" | "published";
  xp: number;
}

export type AdminWorldWorkflowStatus =
  | "draft"
  | "needs_topics"
  | "missing_stages"
  | "needs_fix"
  | "ready_for_review"
  | "published"
  | "archived";

export type AdminTopicWorkflowStatus =
  | "draft"
  | "missing_stages"
  | "needs_fix"
  | "ready_for_review"
  | "published"
  | "archived";

export type AdminPreviewDevice = "Android" | "iPhone" | "Tablet";

export const ADMIN_ECOSYSTEM_HIERARCHY = [
  "Level",
  "World",
  "Topic",
  "Framework Stage",
  "Mobile Preview",
  "Published Learner Content",
] as const;

export const ADMIN_FRAMEWORK_STAGE_CONTRACTS: AdminFrameworkStageContract[] = [
  {
    activityType: "look-introduction",
    childLabel: "LOOK",
    instructionExample: "Look at Family.",
    learnerScreen: "Look / Discover screen",
    phase: "Discover",
    previewMode: "LOOK Screen Preview",
    purpose: "Introduce the topic with one clear word, image, and audio.",
    requiredFields: ["main topic word", "large image", "audio text", "short instruction"],
    validationRules: ["Has image", "Has audio", "No answer choices", "Instruction is very short"],
  },
  {
    activityType: "tap-explore",
    childLabel: "TAP",
    instructionExample: "Tap Family.",
    learnerScreen: "Tap / Explore screen",
    phase: "Explore",
    previewMode: "TAP Screen Preview",
    purpose: "Let the learner tap and explore known content with gentle support.",
    requiredFields: ["tap target", "exactly 2 image choices", "audio replay", "tap animation"],
    validationRules: ["Has tap interaction", "Has exactly 2 or 4 choices", "Audio replay is available"],
  },
  {
    activityType: "guided-try",
    childLabel: "TRY",
    instructionExample: "Find Family.",
    learnerScreen: "Try / Interact screen",
    phase: "Interact",
    previewMode: "TRY Screen Preview",
    purpose: "Guide recognition with feedback before independent practice.",
    requiredFields: ["prompt", "exactly 2 or 4 choices", "correct answer", "feedback"],
    validationRules: ["Has exactly 2 or 4 choices", "Has one correct answer", "Next waits for learner action"],
  },
  {
    activityType: "practice-choice",
    childLabel: "CHOOSE",
    instructionExample: "Which one is Family?",
    learnerScreen: "Choose / Practice screen",
    phase: "Practice",
    previewMode: "CHOOSE Screen Preview",
    purpose: "Repeat known content with simple support and no new content.",
    requiredFields: ["target word card", "exactly 4 standard choices", "correct answer", "feedback"],
    validationRules: ["Uses known content", "Has exactly 2 or 4 choices", "Does not auto-advance"],
  },
  {
    activityType: "challenge-play",
    childLabel: "PLAY",
    instructionExample: "Find Family before time ends.",
    learnerScreen: "Challenge screen",
    phase: "Challenge",
    previewMode: "PLAY/Challenge Screen Preview",
    purpose: "Check understanding with game logic and no newly introduced content.",
    requiredFields: ["timer or game logic", "multiple choices", "correct answer", "completion condition"],
    validationRules: ["Harder than Practice", "Does not introduce new content", "Has feedback"],
  },
  {
    activityType: "reward-star",
    childLabel: "STAR",
    instructionExample: "You got it!",
    learnerScreen: "Star / Reward screen",
    phase: "Reward",
    previewMode: "STAR/Reward Screen Preview",
    purpose: "Celebrate completion and show XP/star impact.",
    requiredFields: ["XP reward", "star reward", "claim action", "celebration animation"],
    validationRules: ["Has XP", "Has star reward", "Claim action is present"],
  },
  {
    activityType: "progress-update",
    childLabel: "PROGRESS",
    instructionExample: "See your progress.",
    learnerScreen: "Progress screen",
    phase: "Progress",
    previewMode: "PROGRESS Screen Preview",
    purpose: "Show saved learner progress and the next goal.",
    requiredFields: ["world progress", "topic completion", "mastery percentage", "next goal"],
    validationRules: ["Shows progress percentage", "Updates topic completion", "Shows next goal"],
  },
  {
    activityType: "mastery-unlock",
    childLabel: "MASTERED",
    instructionExample: "You mastered Family.",
    learnerScreen: "Mastered / Mastery screen",
    phase: "Mastery",
    previewMode: "MASTERED Screen Preview",
    purpose: "Confirm mastery and unlock the next topic or path.",
    requiredFields: ["mastery message", "completed topic", "next unlock", "unlock animation"],
    validationRules: ["Has mastery message", "Has unlock rule", "Shows completed topic"],
  },
];

const PRESCHOOL_STAGE_RULES: Record<ActiveLearningPhase, string> = {
  Discover: "LOOK uses one large topic image, a clear label, and short audio.",
  Explore: "TAP uses two focused visual choices and a tap-to-hear/reveal action.",
  Interact: "TRY uses guided 2-choice recognition with retry feedback.",
  Practice: "CHOOSE uses a 2x2 choice grid with one clear correct answer.",
  Challenge: "PLAY uses a one-node mission, timer, clear target, and Try Again overlay inside PLAY.",
  Reward: "STAR celebrates XP and star gain without adding new lesson content.",
  Progress: "PROGRESS shows saved topic progress and next goal.",
  Mastery: "MASTERED confirms the completed topic and next unlock.",
};

const GRADE3_ENGLISH_STAGE_RULES: Record<ActiveLearningPhase, string> = {
  Discover: "LOOK uses four word/text example cards in a 2x2 layout with limited visual support.",
  Explore: "TAP uses two word cards; tapping reveals pronunciation, meaning, and one sentence.",
  Interact: "TRY matches pronunciation or evidence to a written word with one worthy distractor.",
  Practice: "CHOOSE uses four text choices for meaning, evidence, sentence, or vocabulary reasoning.",
  Challenge: "PLAY applies the skill through speech, evidence matching, or short reading aloud.",
  Reward: "STAR celebrates the completed reading skill.",
  Progress: "PROGRESS shows saved reading progress and mastery evidence.",
  Mastery: "MASTERED confirms the Grade 3 skill and next reading unlock.",
};

const GENERAL_STAGE_RULES: Record<ActiveLearningPhase, string> = {
  Discover: "LOOK introduces the topic using the approved world frame.",
  Explore: "TAP lets the learner explore known content with support.",
  Interact: "TRY gives guided practice with feedback.",
  Practice: "CHOOSE repeats known content independently.",
  Challenge: "PLAY applies the skill through a mission without new content.",
  Reward: "STAR celebrates completion.",
  Progress: "PROGRESS saves and displays progress.",
  Mastery: "MASTERED confirms mastery and next unlock.",
};

const ADMIN_WORLD_INTERFACE_CONTRACTS: AdminWorldInterfaceContract[] = [
  {
    contentOwner: "src/domain/rules/preschool/family plus learning-path framework stages",
    frameStyle: "Preschool BatiBot visual frame with large image cards, purple borders, short prompts, and audio-first support.",
    geminiRole: "Gemini fills learner copy, choices, and examples only. BatiBot keeps the Family World renderer, one-node PLAY mission, rewards, validation, and unlock rules.",
    id: "preschool-family-world",
    rendererFamily: "ScopedFamilyWordActivity",
    stageFrame: "Family topics inherit the Family World LOOK/TAP/TRY/CHOOSE/PLAY frame and must not invent a new interface.",
    stageRules: PRESCHOOL_STAGE_RULES,
    topicInheritanceRule:
      "New Family topics must use family-member/object labels, family-safe actions, matched distractors, and a coherent PLAY destination/action.",
    validationRules: [
      "Use Family World stage frame",
      "No old three-round family PLAY data",
      "Prompt, drop zone, required card, and success text must agree",
      "No generic topic-label-only questions",
    ],
    visualRatio: "80% visual / 15% interaction / 5% text",
  },
  {
    contentOwner: "app/(tabs)/play.tsx Grade 3 English renderer plus learning-path Grade 3 literacy blueprints",
    frameStyle: "Familiar BatiBot stage shell, but cards are word, sentence, pronunciation, passage, and evidence cards.",
    geminiRole: "Gemini fills vocabulary, meanings, sentences, evidence, and prompts only. BatiBot keeps the Grade 3 renderer and speech/validation rules.",
    id: "grade3-english",
    rendererFamily: "Grade3EnglishWordRelatedStage",
    stageFrame: "Reading Quest, Context Clue Canyon, and Story Adventure use text-first Grade 3 stage cards.",
    stageRules: GRADE3_ENGLISH_STAGE_RULES,
    topicInheritanceRule:
      "New Grade 3 English topics must keep 50%+ reading/text support and use visuals only as supporting evidence.",
    validationRules: [
      "LOOK cannot be picture recognition",
      "TAP must reveal pronunciation, meaning, or evidence",
      "TRY must be guided recall",
      "CHOOSE must use four reasoning choices",
      "PLAY must apply the reading skill",
    ],
    visualRatio: "50% text / 25% visual / 25% interaction",
  },
  {
    contentOwner: "learning-path framework stages and matching domain rule helper when present",
    frameStyle: "BatiBot active-learning frame matched to the selected grade/world.",
    geminiRole: "Gemini fills draft content only. BatiBot owns renderer, validation, rewards, progress, and publishing.",
    id: "default-world",
    rendererFamily: "Selected Play world renderer",
    stageFrame: "Use the selected world format and the eight active-learning stages.",
    stageRules: GENERAL_STAGE_RULES,
    topicInheritanceRule:
      "New topics inherit the selected world's grade ratio, stage layout, interaction type, and validation rules.",
    validationRules: [
      "Keep the selected world frame",
      "Use known content in Practice and Challenge",
      "Keep correct answer visible and unique",
      "Use mobile-safe prompts and choices",
    ],
    visualRatio: "Grade-appropriate BatiBot visual/text/interaction ratio",
  },
];

export function getAdminWorldInterfaceContract(
  worldId?: string,
  _gradeLevel?: LearnerLevel
): AdminWorldInterfaceContract {
  if (worldId === "preschool-family-world") {
    return ADMIN_WORLD_INTERFACE_CONTRACTS[0];
  }

  if (
    worldId === "grade3-reading" ||
    worldId === "grade3-context-clue-canyon" ||
    worldId === "grade3-story-adventure"
  ) {
    return ADMIN_WORLD_INTERFACE_CONTRACTS[1];
  }

  return ADMIN_WORLD_INTERFACE_CONTRACTS[2];
}

export const ADMIN_ECOSYSTEM_SIDEBAR: {
  id: AdminEcosystemSectionId;
  label: string;
}[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "curriculum", label: "Curriculum Manager" },
  { id: "worlds", label: "Create World" },
  { id: "topics", label: "Create Topic" },
  { id: "stages", label: "Stage Content Editor" },
  { id: "generator", label: "AI Draft Studio" },
  { id: "validation", label: "Validation Center" },
  { id: "preview-testing", label: "Mobile Preview Test" },
  { id: "review", label: "Review and Publish" },
  { id: "monitoring", label: "Learner Monitoring" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export const ADMIN_MOBILE_PREVIEW_CHECKLIST = [
  "Text Overflow",
  "Missing Images",
  "Missing Audio",
  "Button Size",
  "Touch Targets",
  "Animation Issues",
  "Layout Issues",
  "Challenge Logic",
  "Reward Logic",
  "Unlock Logic",
] as const;

export const ADMIN_MOBILE_PREVIEW_MODES = [
  "Play Map Preview",
  "World Topic List Preview",
  ...ADMIN_FRAMEWORK_STAGE_CONTRACTS.map((stage) => stage.previewMode),
  "Rank and Reward Tabs Preview",
] as const;

export const ADMIN_API_DESIGN = [
  "GET /admin/dashboard/status",
  "GET /admin/curriculum/tree",
  "POST /admin/worlds",
  "PATCH /admin/worlds/{worldId}",
  "POST /admin/topics",
  "PATCH /admin/topics/{topicId}",
  "PATCH /admin/stages/{topicId}/{stage}",
  "POST /admin/ai/context",
  "POST /admin/ai/generate",
  "POST /admin/validation/draft",
  "POST /admin/mobile-preview/{contentId}",
  "POST /admin/publish/{contentId}",
  "GET /admin/monitoring/learners",
  "GET /admin/reports",
  "GET /admin/logs",
] as const;

export const ADMIN_DATABASE_MODELS = [
  "adminWorlds",
  "adminTopics",
  "adminStageContent",
  "curatedPlayContent",
  "aiDraftRequests",
  "validationLogs",
  "mobilePreviewChecks",
  "adminMonitoring",
  "adminActivityLogs",
] as const;

export function getAdminFrameworkStageContract(phase: ActiveLearningPhase) {
  return (
    ADMIN_FRAMEWORK_STAGE_CONTRACTS.find((stage) => stage.phase === phase) ??
    ADMIN_FRAMEWORK_STAGE_CONTRACTS[0]
  );
}

export function getAdminFrameworkStageOptionLabel(phase: ActiveLearningPhase) {
  const contract = getAdminFrameworkStageContract(phase);

  return `${contract.childLabel} / ${phase}`;
}

export function validateAdminTopicStageCoverage(
  stages: ActiveLearningPhase[]
) {
  const uniqueStages = Array.from(new Set(stages));
  const missingStages = ADMIN_FRAMEWORK_STAGE_CONTRACTS
    .map((stage) => stage.phase)
    .filter((phase) => !uniqueStages.includes(phase));

  return {
    complete: missingStages.length === 0 && uniqueStages.length === ADMIN_FRAMEWORK_STAGE_CONTRACTS.length,
    missingStages,
  };
}

export function validateAdminWorldTopicMinimum(topicCount: number) {
  return {
    complete: topicCount >= 3,
    message:
      topicCount >= 3
        ? "This world has enough topics for review."
        : "This world needs at least 3 topics before publishing.",
  };
}
