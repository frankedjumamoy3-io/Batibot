import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

import { getCurriculumSummary } from "@/src/data/learner-dashboard";
import { APP_ROUTES } from "@/src/navigation/routes";

export interface HomeQuickAction {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  id: string;
  route: Href;
  subtitle: string;
  title: string;
}

export const HOME_COPY = {
  continueLearning: "Start",
  heroBadge: "Major System Revision",
  heroDescription:
    "Follow a child-friendly path from words to play, progress, and rewards.",
  journeyTitle: "XP journey",
  missionFallback:
    "Wonderful work. Try replaying a quiz to earn even more XP.",
  missionTitle: "Recommended next step",
  overviewTitle: "How BatiBot works",
  progressComplete:
    "You have explored every quiz set available right now",
  quickActionsTitle: "Main tabs",
  snapshotTitle: "Current app status",
} as const;

export const HOME_CURRICULUM_SUMMARY = getCurriculumSummary();

export const HOME_QUICK_ACTIONS: HomeQuickAction[] = [
  {
    id: "vocabulary",
    title: "Words",
    subtitle: "Look, listen, and say new words",
    icon: "book-outline",
    color: "#3B82F6",
    route: APP_ROUTES.tabs.vocabulary,
  },
  {
    id: "quiz",
    title: "Play",
    subtitle: "Answer friendly quiz questions",
    icon: "help-circle-outline",
    color: "#F97316",
    route: APP_ROUTES.tabs.quiz,
  },
  {
    id: "progress",
    title: "Progress",
    subtitle: "See your level and next goal",
    icon: "stats-chart-outline",
    color: "#7C3AED",
    route: APP_ROUTES.tabs.rank,
  },
  {
    id: "rewards",
    title: "Rewards",
    subtitle: "Celebrate badges and milestones",
    icon: "star-outline",
    color: "#D97706",
    route: APP_ROUTES.tabs.reward,
  },
];

export const HOME_SNAPSHOT_LABELS = {
  totalXp: "XP earned",
  vocabularyCount: "Words to learn",
  totalQuizQuestions: "Questions",
  totalQuizSets: "Quiz sets",
} as const;

export function getHomeMissionText(wordsRemaining: number) {
  if (wordsRemaining <= 0) {
    return HOME_COPY.missionFallback;
  }

  const cardsToOpen = Math.min(wordsRemaining, 2);
  const noun = wordsRemaining > 1 ? "cards" : "card";

  return `Open ${cardsToOpen} more vocabulary ${noun} to keep building your Play path.`;
}

export function getQuizJourneySummary(quizzesRemaining: number) {
  if (quizzesRemaining <= 0) {
    return HOME_COPY.progressComplete;
  }

  return `${quizzesRemaining} quiz sets left to master`;
}

export function getHomeOverviewSummary(gradeLevel: string | null | undefined) {
  if (!gradeLevel) {
    return "BatiBot is organized as a guided mobile learning path for Preschool to Grade 3 learners, with Home, Words, Play, Progress, and Rewards acting as one connected system.";
  }

  return `BatiBot is currently tuned for ${gradeLevel} content, with a guided path across Home, Words, Play, Progress, and Rewards plus administrator-reviewed learning content behind the scenes.`;
}
