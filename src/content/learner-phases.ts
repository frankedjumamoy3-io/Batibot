import { Ionicons } from "@expo/vector-icons";
import { type Href } from "expo-router";

import { APP_ROUTES } from "@/src/navigation/routes";

export type LearnerPhaseId = "play" | "rank" | "reward";

export type LearnerPhase = {
  accent: string;
  accessibilityLabel: string;
  defaultIcon: keyof typeof Ionicons.glyphMap;
  focusedIcon: keyof typeof Ionicons.glyphMap;
  goal: string;
  id: LearnerPhaseId;
  phase: number;
  route: Href;
  status: string;
  subtitle: string;
  title: string;
};

export const LEARNER_PHASES: LearnerPhase[] = [
  {
    id: "play",
    phase: 1,
    title: "Play",
    subtitle: "Learning worlds, lessons, and quizzes in one adventure map.",
    status: "Play",
    goal: "Choose a world, learn, and answer challenges.",
    defaultIcon: "game-controller-outline",
    focusedIcon: "game-controller",
    accent: "#21D68B",
    accessibilityLabel: "Play tab",
    route: APP_ROUTES.tabs.play,
  },
  {
    id: "rank",
    phase: 2,
    title: "Rank",
    subtitle: "Level, XP, streak, stars, and personal progress.",
    status: "Rank",
    goal: "See your explorer rank and next goal.",
    defaultIcon: "podium-outline",
    focusedIcon: "podium",
    accent: "#29A7FF",
    accessibilityLabel: "Rank tab",
    route: APP_ROUTES.tabs.rank,
  },
  {
    id: "reward",
    phase: 3,
    title: "Reward",
    subtitle: "Badges, achievements, stars, and locked rewards.",
    status: "Reward",
    goal: "Celebrate unlocked badges and see what to earn next.",
    defaultIcon: "ribbon-outline",
    focusedIcon: "ribbon",
    accent: "#FFD84D",
    accessibilityLabel: "Reward tab",
    route: APP_ROUTES.tabs.reward,
  },
];

export function getLearnerPhase(id: LearnerPhaseId) {
  return LEARNER_PHASES.find((phase) => phase.id === id) ?? LEARNER_PHASES[0];
}

export function getLearnerPhaseIndex(id: LearnerPhaseId) {
  return LEARNER_PHASES.findIndex((phase) => phase.id === id);
}

export function getNextLearnerPhase(id: LearnerPhaseId) {
  const nextIndex = getLearnerPhaseIndex(id) + 1;

  return LEARNER_PHASES[nextIndex] ?? LEARNER_PHASES[0];
}
