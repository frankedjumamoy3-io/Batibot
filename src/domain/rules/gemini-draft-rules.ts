import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";
import type { QuizLayoutType } from "@/src/types/quiz";

export type BatiBotChildAction =
  | "look"
  | "tap"
  | "match"
  | "count"
  | "say"
  | "compare"
  | "choose"
  | "complete-pattern";

export interface BatiBotPhaseContract {
  allowedContent: string;
  childAction: BatiBotChildAction;
  guidanceLevel: "celebration" | "guided" | "intro" | "less-guided" | "progress";
  mustNot: string[];
  phase: ActiveLearningPhase;
  purpose: string;
  promptRule: string;
}

export interface BatiBotMobileUiContract {
  choiceCount: 0 | 2 | 4;
  maxPromptWords: number;
  primarySurface: "audio" | "choice-grid" | "match-grid" | "reward" | "single-asset" | "status";
  requiredControls: string[];
  touchTarget: "large";
}

export interface BatiBotAdminPromptModule {
  goal: string;
  id: string;
  prompt: string;
  title: string;
}

export const BATIBOT_CURRICULUM_API_VERSION = "2026-06-play-content-api-v1";

export const BATIBOT_ADMIN_PROMPT_PIPELINE =
  "Admin -> BatiBot Curriculum Intelligence API -> Gemini -> Validator -> Review -> Published";

export const BATIBOT_ADMIN_PROMPT_MODULES: BatiBotAdminPromptModule[] = [
  {
    goal: "Make BatiBot, not Gemini, the source of truth.",
    id: "source-of-truth",
    title: "BatiBot Source Of Truth",
    prompt:
      "You are generating an unpublished BatiBot admin draft. BatiBot owns the curriculum, Play-map placement, phase rules, UI format, safety checks, reward logic, and publishing decision. Gemini only assists with draft content.",
  },
  {
    goal: "Force every draft into the current learner model.",
    id: "rank-play-reward",
    title: "Rank / Play / Reward Alignment",
    prompt:
      "The learner app is Rank / Play / Reward. Learn and Quiz are internal Play actions. All generated content must appear as Play content mapped to Grade > World > Topic > Phase > Node, with personal Rank and Reward impact described structurally.",
  },
  {
    goal: "Protect the active learning rhythm.",
    id: "phase-fit",
    title: "Active Learning Phase Fit",
    prompt:
      "Use the selected BatiBot phase only: Discover, Explore, Interact, Practice, Challenge, Reward, Progress, or Mastery. Practice repeats known content with support. Challenge checks known content with less guidance and introduces no new content.",
  },
  {
    goal: "Keep prompts child-safe and mobile-ready.",
    id: "child-action-ui",
    title: "Child Action And Mobile UI",
    prompt:
      "Every item must use one clear child action such as Tap, Match, Count, Say, Compare, Choose, or Complete. Use short child-facing copy, large-choice or matching surfaces, audio/speech controls when required, and no dense adult instructions.",
  },
  {
    goal: "Keep generated content inside approved curriculum and assets.",
    id: "known-content-assets",
    title: "Known Content And Asset Contract",
    prompt:
      "Use only the approved Learning Worlds word set, topic, asset contract, and competency context supplied by BatiBot. Image-based items must include an approved asset mapping or exact asset prompt for admin approval; do not invent live URLs.",
  },
  {
    goal: "Make reward impact predictable.",
    id: "reward-rank-impact",
    title: "Reward And Rank Impact",
    prompt:
      "Return structured reward impact: XP, stars, badge or mastery effect, rank progress, reward progress, and next unlock. XP must feel consistent with similar phase, grade, and activity difficulty.",
  },
  {
    goal: "Make validation and review possible.",
    id: "validator-review",
    title: "Validator And Review Metadata",
    prompt:
      "For every question, include sourceVocabularyWord, vocabularyUsed, targetSkill, reasoningType, questionIntent, quality scores, level-fit explanation, alignment notes, answer justification, distractor notes, and validation flags when risk exists.",
  },
  {
    goal: "Keep the backend response deterministic.",
    id: "json-only",
    title: "Structured JSON Only",
    prompt:
      "Return JSON only. Do not include markdown, commentary, admin instructions to the learner, publication claims, secrets, or hidden reasoning. The admin review screen and validator decide whether content can be published.",
  },
];

export const BATIBOT_PHASE_CONTRACTS: Record<ActiveLearningPhase, BatiBotPhaseContract> = {
  Discover: {
    allowedContent: "current word, concept, number, group, or pattern only",
    childAction: "look",
    guidanceLevel: "intro",
    mustNot: ["quiz the learner", "introduce extra topics", "use dense explanation"],
    phase: "Discover",
    purpose: "Introduce the current learning target.",
    promptRule: "Use one short concrete sentence.",
  },
  Explore: {
    allowedContent: "known examples from the current topic",
    childAction: "tap",
    guidanceLevel: "guided",
    mustNot: ["hide the answer", "add challenge-only wording"],
    phase: "Explore",
    purpose: "Let the child observe known content with gentle support.",
    promptRule: "Name what the learner should look at or tap.",
  },
  Interact: {
    allowedContent: "familiar content with visible support",
    childAction: "choose",
    guidanceLevel: "guided",
    mustNot: ["remove hints", "introduce new vocabulary"],
    phase: "Interact",
    purpose: "Guide the child through a supported mini-action.",
    promptRule: "Start with Tap, Match, Count, Say, Compare, Choose, or Complete.",
  },
  Practice: {
    allowedContent: "content already introduced in Discover, Explore, or Interact",
    childAction: "match",
    guidanceLevel: "guided",
    mustNot: ["introduce new content", "use mastery-style pressure"],
    phase: "Practice",
    purpose: "Repeat known content with simple support.",
    promptRule: "Repeat the known skill with a clear action and answer check.",
  },
  Challenge: {
    allowedContent: "known content only; change style, asset, count, or sequence",
    childAction: "choose",
    guidanceLevel: "less-guided",
    mustNot: ["introduce new content", "give the answer away", "use trick wording"],
    phase: "Challenge",
    purpose: "Check understanding with less guidance.",
    promptRule: "Use less hinting than Practice while staying inside known content.",
  },
  Reward: {
    allowedContent: "completion result, star, XP, badge, or world reward",
    childAction: "tap",
    guidanceLevel: "celebration",
    mustNot: ["add a new question", "hide completion feedback"],
    phase: "Reward",
    purpose: "Celebrate completion.",
    promptRule: "Use concrete celebration language.",
  },
  Progress: {
    allowedContent: "saved learner progress, XP, streak, stars, or completed phase state",
    childAction: "look",
    guidanceLevel: "progress",
    mustNot: ["ask new learning questions", "show dense analytics"],
    phase: "Progress",
    purpose: "Show saved learner progress in simple visual form.",
    promptRule: "Name the world or topic progress clearly.",
  },
  Mastery: {
    allowedContent: "mastered topic/world and next unlock",
    childAction: "look",
    guidanceLevel: "celebration",
    mustNot: ["introduce new learning content", "restart the lesson"],
    phase: "Mastery",
    purpose: "Confirm mastery and point to the next unlock.",
    promptRule: "Name the mastered topic and the next step.",
  },
};

export function getChildActionForLayouts(
  phase: ActiveLearningPhase,
  layouts: QuizLayoutType[]
): BatiBotChildAction {
  if (layouts.includes("speech-to-text")) {
    return "say";
  }

  if (
    layouts.includes("matching") ||
    layouts.includes("image-to-word") ||
    layouts.includes("word-to-image")
  ) {
    return "match";
  }

  if (layouts.includes("counting-objects")) {
    return "count";
  }

  if (layouts.includes("compare-numbers")) {
    return "compare";
  }

  if (layouts.includes("ordering")) {
    return "complete-pattern";
  }

  return BATIBOT_PHASE_CONTRACTS[phase].childAction;
}

export function getMobileUiContract(
  phase: ActiveLearningPhase,
  layouts: QuizLayoutType[]
): BatiBotMobileUiContract {
  if (phase === "Reward") {
    return {
      choiceCount: 0,
      maxPromptWords: 10,
      primarySurface: "reward",
      requiredControls: ["claim reward"],
      touchTarget: "large",
    };
  }

  if (phase === "Progress" || phase === "Mastery" || phase === "Discover" || phase === "Explore") {
    return {
      choiceCount: 0,
      maxPromptWords: 12,
      primarySurface: phase === "Progress" ? "status" : "single-asset",
      requiredControls: ["speaker", "next"],
      touchTarget: "large",
    };
  }

  if (
    layouts.includes("matching") ||
    layouts.includes("image-to-word") ||
    layouts.includes("word-to-image")
  ) {
    return {
      choiceCount: 4,
      maxPromptWords: 12,
      primarySurface: "match-grid",
      requiredControls: ["speaker", "large match tiles", "next"],
      touchTarget: "large",
    };
  }

  if (layouts.includes("text-to-speech") || layouts.includes("speech-to-text")) {
    return {
      choiceCount: layouts.includes("speech-to-text") ? 0 : 4,
      maxPromptWords: 10,
      primarySurface: "audio",
      requiredControls: ["speaker", "microphone", "next"],
      touchTarget: "large",
    };
  }

  return {
    choiceCount: 4,
    maxPromptWords: phase === "Challenge" ? 10 : 12,
    primarySurface: "choice-grid",
    requiredControls: ["speaker", "large choices", "next"],
    touchTarget: "large",
  };
}
