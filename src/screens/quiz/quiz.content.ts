import {
  CURRICULUM_QUIZ_LEVELS,
  QUIZ_CATEGORY_META,
  QUIZ_PRESETS,
  type QuizCategory,
  type QuizPreset,
} from "@/src/data/quiz";

export type QuizDashboardViewFilter = "all" | "locked" | "unlocked";

export const QUIZ_SCREEN_COPY = {
  allFilterLabel: "All",
  lockedFilterLabel: "Locked",
  unlockedFilterLabel: "Unlocked",
  backToDashboard: "Back to Play Practice",
  categorySummarySuffix: "sets completed",
  changeQuizSet: "Change Quiz Set",
  dashboardSubtitle:
    "Practice unlocks as learners view words, complete Play phases, and show mastery.",
  dashboardTitle: "Play Practice Path",
  detailLockedHint: "Finish the checklist below to unlock this practice.",
  detailStart: "Start Practice",
  helperPrompt:
    "Try the question first, then use the hint button if you want a little help.",
  heroBadge: "Unlocking Play Practice",
  hint: "Hint",
  lockedBadge: "Locked",
  noQuizzes: "No quizzes in this filter yet.",
  resultTitle: "Practice complete!",
  speechFallback:
    "Speech tools are not available here. You can still answer by typing or choosing.",
  unlockedBadge: "Ready",
} as const;

export { CURRICULUM_QUIZ_LEVELS, QUIZ_CATEGORY_META, QUIZ_PRESETS };
export type { QuizCategory, QuizPreset };

export function getCategoryParam(
  category: string | string[] | undefined
): QuizDashboardViewFilter | null {
  const resolvedCategory = Array.isArray(category) ? category[0] : category;

  if (
    resolvedCategory === "all" ||
    resolvedCategory === "locked" ||
    resolvedCategory === "unlocked"
  ) {
    return resolvedCategory;
  }

  return null;
}

export function formatDifficultyLabel(difficulty: QuizPreset["difficulty"]) {
  return difficulty
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
