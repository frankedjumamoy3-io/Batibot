import type { Ionicons } from "@expo/vector-icons";

import { getLevelTitle } from "@/src/data/quiz/unlock";
import {
  evaluateUnlockRequirements,
  type UnlockEvaluation,
} from "@/src/data/quiz/unlock";
import type {
  LearningNotification,
  LearningNotificationType,
  UnlockRequirements,
} from "@/src/data/quiz/types";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";

export interface AwardDefinition {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  type: "badge" | "achievement";
  unlockRequirements: UnlockRequirements;
}

export const BADGE_DEFINITIONS: AwardDefinition[] = [
  {
    id: "first-word-viewer",
    title: "First Word Viewer",
    description: "View 1 vocabulary word.",
    icon: "eye",
    accentColor: "#3B82F6",
    type: "badge",
    unlockRequirements: {
      requiredViewedWords: 1,
    },
  },
  {
    id: "word-explorer",
    title: "Word Explorer",
    description: "Explore 20 vocabulary cards and read their meaning prompts.",
    icon: "book",
    accentColor: "#2563EB",
    type: "badge",
    unlockRequirements: {
      requiredViewedWords: 20,
    },
  },
  {
    id: "letter-hunter",
    title: "Letter Hunter",
    description: "Explore words from 5 different starting letters.",
    icon: "text",
    accentColor: "#8B5CF6",
    type: "badge",
    unlockRequirements: {
      requiredDistinctViewedLetters: 5,
    },
  },
  {
    id: "alphabet-traveler",
    title: "Alphabet Traveler",
    description: "View at least 1 word from A, B, C, D, and E.",
    icon: "navigate",
    accentColor: "#F97316",
    type: "badge",
    unlockRequirements: {
      requiredViewedLetters: {
        A: 1,
        B: 1,
        C: 1,
        D: 1,
        E: 1,
      },
    },
  },
  {
    id: "animal-learner",
    title: "Animal Learner",
    description: "View dog, cat, bird, fish, and cow.",
    icon: "paw",
    accentColor: "#F59E0B",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["dog", "cat", "bird", "fish", "cow"],
    },
  },
  {
    id: "number-starter",
    title: "Number Explorer",
    description: "Explore one, two, three, four, and five.",
    icon: "calculator",
    accentColor: "#F97316",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["one", "two", "three", "four", "five"],
    },
  },
  {
    id: "number-master",
    title: "Number Master",
    description: "View one to ten and complete Number Word 1-10.",
    icon: "ribbon",
    accentColor: "#EA580C",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: [
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
      ],
      requiredCompletedQuizIds: ["number-word-1-10"],
    },
  },
  {
    id: "speech-beginner",
    title: "Speech Beginner",
    description: "Complete 1 speech-to-text quiz.",
    icon: "mic",
    accentColor: "#0EA5E9",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "speech-to-text": 1,
      },
    },
  },
  {
    id: "listening-learner",
    title: "Listening Learner",
    description: "Complete 1 text-to-speech quiz.",
    icon: "headset",
    accentColor: "#14B8A6",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "text-to-speech": 1,
      },
    },
  },
  {
    id: "mixed-thinker",
    title: "Mixed Thinker",
    description: "Complete 1 mixed quiz.",
    icon: "sparkles",
    accentColor: "#10B981",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCountByCategory: {
        mixed: 1,
      },
    },
  },
  {
    id: "quiz-starter",
    title: "Practice Explorer",
    description: "Complete your first Play practice.",
    icon: "play",
    accentColor: "#6366F1",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCount: 1,
    },
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Complete 10 quizzes.",
    icon: "school",
    accentColor: "#7C3AED",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCount: 10,
    },
  },
  {
    id: "perfect-scorer",
    title: "Perfect Scorer",
    description: "Score 100% in any quiz.",
    icon: "trophy",
    accentColor: "#F59E0B",
    type: "badge",
    unlockRequirements: {
      requiredPerfectQuizCount: 1,
    },
  },
  {
    id: "spelling-builder",
    title: "Spelling Builder",
    description: "Score at least 80% in a spelling quiz.",
    icon: "create",
    accentColor: "#EC4899",
    type: "badge",
    unlockRequirements: {
      requiredQuizTypeMinimumScores: {
        spelling: 80,
      },
    },
  },
  {
    id: "sentence-builder",
    title: "Sentence Builder",
    description: "Complete Sentence Builder Beginner Quiz.",
    icon: "document-text",
    accentColor: "#4F46E5",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizIds: ["sentence-builder-beginner"],
    },
  },
  {
    id: "category-collector",
    title: "Word Group Collector",
    description: "Explore words from 3 vocabulary groups.",
    icon: "layers",
    accentColor: "#22C55E",
    type: "badge",
    unlockRequirements: {
      requiredViewedCategoryCount: 3,
    },
  },
  {
    id: "question-word-starter",
    title: "Question Word Explorer",
    description: "Explore what, how, when, where, and why.",
    icon: "help-circle",
    accentColor: "#6366F1",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["what", "how", "when", "where", "why"],
    },
  },
  {
    id: "example-sentence-scout",
    title: "Example Sentence Scout",
    description: "Explore 40 vocabulary cards with meaning and example prompts.",
    icon: "chatbubble-ellipses",
    accentColor: "#0EA5E9",
    type: "badge",
    unlockRequirements: {
      requiredViewedWords: 40,
    },
  },
  {
    id: "transport-talker",
    title: "Transport Talker",
    description: "Explore airplane, bus, car, train, and boat.",
    icon: "airplane",
    accentColor: "#0284C7",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["airplane", "bus", "car", "train", "boat"],
    },
  },
  {
    id: "nature-questioner",
    title: "Nature Questioner",
    description: "Explore sky, sun, rain, cloud, and wind.",
    icon: "partly-sunny",
    accentColor: "#0EA5E9",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["sky", "sun", "rain", "cloud", "wind"],
    },
  },
  {
    id: "plant-observer",
    title: "Plant Observer",
    description: "Explore apple, leaf, flower, tree, and seed.",
    icon: "leaf",
    accentColor: "#16A34A",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["apple", "leaf", "flower", "tree", "seed"],
    },
  },
  {
    id: "shape-question-finder",
    title: "Shape Question Finder",
    description: "Explore circle, square, triangle, rectangle, and oval.",
    icon: "shapes",
    accentColor: "#2563EB",
    type: "badge",
    unlockRequirements: {
      requiredViewedSpecificWords: ["circle", "square", "triangle", "rectangle", "oval"],
    },
  },
  {
    id: "meaning-builder",
    title: "Meaning Builder",
    description: "Explore 75 vocabulary cards and connect words to clear meanings.",
    icon: "reader",
    accentColor: "#7C3AED",
    type: "badge",
    unlockRequirements: {
      requiredViewedWords: 75,
    },
  },
  {
    id: "fast-learner",
    title: "Fast Learner",
    description: "Complete a timed quiz.",
    icon: "timer",
    accentColor: "#F97316",
    type: "badge",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "timed-mastery-challenge": 1,
      },
    },
  },
  {
    id: "streak-keeper",
    title: "Streak Keeper",
    description: "Maintain a 3-day learning streak.",
    icon: "flame",
    accentColor: "#FB7185",
    type: "badge",
    unlockRequirements: {
      requiredStreakDays: 3,
    },
  },
  {
    id: "level-climber",
    title: "Level Climber",
    description: "Reach Level 5.",
    icon: "trending-up",
    accentColor: "#14B8A6",
    type: "badge",
    unlockRequirements: {
      requiredLevel: 5,
    },
  },
  {
    id: "curriculum-champion",
    title: "Curriculum Champion",
    description: "Reach Level 10.",
    icon: "medal",
    accentColor: "#EAB308",
    type: "badge",
    unlockRequirements: {
      requiredLevel: 10,
    },
  },
];

export const ACHIEVEMENT_DEFINITIONS: AwardDefinition[] = [
  {
    id: "first-quiz-completed",
    title: "First Quiz Completed",
    description: "Complete your first quiz.",
    icon: "checkmark-circle",
    accentColor: "#2563EB",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCount: 1,
    },
  },
  {
    id: "first-perfect-score",
    title: "First Perfect Score",
    description: "Earn a perfect quiz score.",
    icon: "trophy",
    accentColor: "#F59E0B",
    type: "achievement",
    unlockRequirements: {
      requiredPerfectQuizCount: 1,
    },
  },
  {
    id: "first-level-unlock",
    title: "First Level Unlock",
    description: "Unlock your first new curriculum level.",
    icon: "podium",
    accentColor: "#14B8A6",
    type: "achievement",
    unlockRequirements: {
      requiredLevel: 2,
    },
  },
  {
    id: "level-5-reached",
    title: "Level 5 Reached",
    description: "Reach Level 5.",
    icon: "flag",
    accentColor: "#7C3AED",
    type: "achievement",
    unlockRequirements: {
      requiredLevel: 5,
    },
  },
  {
    id: "level-10-reached",
    title: "Level 10 Reached",
    description: "Reach Level 10.",
    icon: "flag",
    accentColor: "#EAB308",
    type: "achievement",
    unlockRequirements: {
      requiredLevel: 10,
    },
  },
  {
    id: "viewed-50-vocabulary-words",
    title: "50 Word Prompts Explored",
    description: "Explore 50 vocabulary cards with meaning and example prompts.",
    icon: "bookmarks",
    accentColor: "#3B82F6",
    type: "achievement",
    unlockRequirements: {
      requiredViewedWords: 50,
    },
  },
  {
    id: "question-word-master",
    title: "Question Word Master",
    description: "Explore what, how, when, where, why, who, and which.",
    icon: "help-buoy",
    accentColor: "#6366F1",
    type: "achievement",
    unlockRequirements: {
      requiredViewedSpecificWords: ["what", "how", "when", "where", "why", "who", "which"],
    },
  },
  {
    id: "vocabulary-100-prompts",
    title: "100 Vocabulary Prompts",
    description: "Explore 100 vocabulary cards and their example questions.",
    icon: "library",
    accentColor: "#2563EB",
    type: "achievement",
    unlockRequirements: {
      requiredViewedWords: 100,
    },
  },
  {
    id: "word-group-roundup",
    title: "Word Group Roundup",
    description: "Explore words from all 9 vocabulary groups.",
    icon: "albums",
    accentColor: "#22C55E",
    type: "achievement",
    unlockRequirements: {
      requiredViewedCategoryCount: 9,
    },
  },
  {
    id: "meaning-and-quiz-linker",
    title: "Meaning and Quiz Linker",
    description: "Explore 50 vocabulary cards and complete 5 quizzes.",
    icon: "git-compare",
    accentColor: "#10B981",
    type: "achievement",
    unlockRequirements: {
      requiredViewedWords: 50,
      requiredCompletedQuizCount: 5,
    },
  },
  {
    id: "example-sentence-champion",
    title: "Example Sentence Champion",
    description: "Explore 150 vocabulary cards with clear example prompts.",
    icon: "chatbubbles",
    accentColor: "#0EA5E9",
    type: "achievement",
    unlockRequirements: {
      requiredViewedWords: 150,
    },
  },
  {
    id: "completed-5-numeric-quizzes",
    title: "Completed 5 Numeric Quizzes",
    description: "Complete 5 numeric quizzes.",
    icon: "calculator",
    accentColor: "#F97316",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByCategory: {
        numeric: 5,
      },
    },
  },
  {
    id: "completed-5-linguistic-quizzes",
    title: "Completed 5 Linguistic Quizzes",
    description: "Complete 5 linguistic quizzes.",
    icon: "library",
    accentColor: "#4F46E5",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByCategory: {
        linguistic: 5,
      },
    },
  },
  {
    id: "completed-3-mixed-quizzes",
    title: "Completed 3 Mixed Quizzes",
    description: "Complete 3 mixed quizzes.",
    icon: "color-wand",
    accentColor: "#10B981",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByCategory: {
        mixed: 3,
      },
    },
  },
  {
    id: "numeric-mastery-80",
    title: "80% Numeric Mastery",
    description: "Reach 80% numeric mastery.",
    icon: "stats-chart",
    accentColor: "#EA580C",
    type: "achievement",
    unlockRequirements: {
      requiredMasteryByCategory: {
        numeric: 80,
      },
    },
  },
  {
    id: "linguistic-mastery-80",
    title: "80% Linguistic Mastery",
    description: "Reach 80% linguistic mastery.",
    icon: "reader",
    accentColor: "#6366F1",
    type: "achievement",
    unlockRequirements: {
      requiredMasteryByCategory: {
        linguistic: 80,
      },
    },
  },
  {
    id: "mixed-mastery-80",
    title: "80% Mixed Mastery",
    description: "Reach 80% mixed mastery.",
    icon: "git-merge",
    accentColor: "#10B981",
    type: "achievement",
    unlockRequirements: {
      requiredMasteryByCategory: {
        mixed: 80,
      },
    },
  },
  {
    id: "completed-speech-practice",
    title: "Completed Speech Practice",
    description: "Complete 1 speech practice quiz.",
    icon: "mic-circle",
    accentColor: "#0EA5E9",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "speech-to-text": 1,
      },
    },
  },
  {
    id: "completed-listening-practice",
    title: "Completed Listening Practice",
    description: "Complete 1 listening practice quiz.",
    icon: "ear",
    accentColor: "#14B8A6",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "text-to-speech": 1,
      },
    },
  },
  {
    id: "completed-matching-quiz",
    title: "Completed Matching Quiz",
    description: "Complete a matching quiz.",
    icon: "git-compare",
    accentColor: "#8B5CF6",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "matching-type": 1,
      },
    },
  },
  {
    id: "completed-fill-in-the-blank-quiz",
    title: "Completed Fill-in-the-Blank Quiz",
    description: "Complete a fill-in-the-blank quiz.",
    icon: "create-outline",
    accentColor: "#EC4899",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "fill-in-the-blank": 1,
      },
    },
  },
  {
    id: "completed-word-problem-quiz",
    title: "Completed Word Problem Quiz",
    description: "Complete a word problem quiz.",
    icon: "help-circle",
    accentColor: "#22C55E",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "word-problem": 1,
      },
    },
  },
  {
    id: "completed-boss-quiz",
    title: "Completed Boss Quiz",
    description: "Complete a boss quiz.",
    icon: "shield-checkmark",
    accentColor: "#F97316",
    type: "achievement",
    unlockRequirements: {
      requiredCompletedQuizCountByType: {
        "review-boss": 1,
      },
    },
  },
  {
    id: "hundred-correct-answers",
    title: "100 Correct Answers",
    description: "Answer 100 quiz questions correctly.",
    icon: "flash",
    accentColor: "#EAB308",
    type: "achievement",
    unlockRequirements: {
      requiredCorrectAnswersTotal: 100,
    },
  },
  {
    id: "seven-day-learning-streak",
    title: "7-Day Learning Streak",
    description: "Maintain a 7-day learning streak.",
    icon: "flame",
    accentColor: "#FB7185",
    type: "achievement",
    unlockRequirements: {
      requiredStreakDays: 7,
    },
  },
];

export function evaluateBadgeRequirements(
  badge: AwardDefinition,
  progress: LearnerProgressState
) {
  return evaluateUnlockRequirements(badge.unlockRequirements, progress);
}

export function evaluateAchievementRequirements(
  achievement: AwardDefinition,
  progress: LearnerProgressState
) {
  return evaluateUnlockRequirements(achievement.unlockRequirements, progress);
}

export function unlockEligibleBadges(progress: LearnerProgressState) {
  return BADGE_DEFINITIONS.filter((badge) =>
    evaluateBadgeRequirements(badge, progress).eligible
  ).map((badge) => badge.id);
}

export function unlockEligibleAchievements(progress: LearnerProgressState) {
  return ACHIEVEMENT_DEFINITIONS.filter((achievement) =>
    evaluateAchievementRequirements(achievement, progress).eligible
  ).map((achievement) => achievement.id);
}

export function awardBadges(progress: LearnerProgressState) {
  return unlockEligibleBadges(progress).filter((badgeId) => !progress.badges.includes(badgeId));
}

export function awardAchievements(progress: LearnerProgressState) {
  return unlockEligibleAchievements(progress).filter(
    (achievementId) => !progress.achievements.includes(achievementId)
  );
}

export function getAwardDefinition(id: string) {
  return (
    BADGE_DEFINITIONS.find((award) => award.id === id) ??
    ACHIEVEMENT_DEFINITIONS.find((award) => award.id === id)
  );
}

export function getAwardProgress(
  award: AwardDefinition,
  progress: LearnerProgressState
): UnlockEvaluation {
  return award.type === "badge"
    ? evaluateBadgeRequirements(award, progress)
    : evaluateAchievementRequirements(award, progress);
}

export function createUnlockNotification(
  type: LearningNotificationType,
  title: string,
  message: string,
  eventId = `${type}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
): LearningNotification {
  return {
    id: `${eventId}-${Date.now()}`,
    eventId,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    icon: getNotificationIcon(type),
  };
}

export const createNotification = createUnlockNotification;

export function preventDuplicateNotification(
  progress: LearnerProgressState,
  eventId: string
) {
  return progress.notifiedUnlockEventIds.includes(eventId);
}

export function getMasteryMilestoneEvents(
  before: LearnerProgressState,
  after: LearnerProgressState
) {
  return (["linguistic", "numeric", "mixed"] as const)
    .filter(
      (category) =>
        before.masteryByCategory[category] < 80 &&
        after.masteryByCategory[category] >= 80
    )
    .map((category) => ({
      eventId: `mastery-${category}-80`,
      title: `Mastery Milestone: 80% ${capitalize(category)} Mastery`,
      message: `You reached ${after.masteryByCategory[category]}% ${category} mastery.`,
    }));
}

export function getLevelUnlockEvents(
  before: LearnerProgressState,
  after: LearnerProgressState
) {
  return after.unlockedLevels
    .filter((level) => !before.unlockedLevels.includes(level))
    .map((level) => ({
      eventId: `level-unlocked-${level}`,
      title: `Level ${level} Unlocked`,
      message: getLevelTitle(level)
        ? `New curriculum level: ${getLevelTitle(level)}`
        : `Curriculum Level ${level} is ready.`,
    }));
}

export function getStreakMilestoneEvents(
  before: LearnerProgressState,
  after: LearnerProgressState
) {
  const milestones = [3, 7, 14, 30];

  return milestones
    .filter((days) => before.streakDays < days && after.streakDays >= days)
    .map((days) => ({
      eventId: `streak-${days}`,
      title: `${days}-Day Learning Streak`,
      message: `You practiced for ${days} day${days === 1 ? "" : "s"} in a row.`,
    }));
}

function getNotificationIcon(type: LearningNotificationType) {
  const icons: Record<LearningNotificationType, keyof typeof Ionicons.glyphMap> = {
    achievement: "trophy",
    badge: "ribbon",
    level: "podium",
    mastery: "sparkles",
    quiz: "lock-open",
    streak: "flame",
  };

  return icons[type];
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
