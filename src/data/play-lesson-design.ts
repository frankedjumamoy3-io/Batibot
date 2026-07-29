import type { ActiveLearningPhase } from "@/src/data/curriculum/learning-path";

export type PlayLessonStageContract = {
  challengeRule: string;
  choiceCount: 0 | 1 | 2;
  contentZone: "group-scene" | "single-target" | "choice-pair" | "speech";
  learnerGoal: string;
  promptRule: string;
  stage: ActiveLearningPhase;
};

export const PLAY_LESSON_STAGE_CONTRACTS: PlayLessonStageContract[] = [
  {
    challengeRule: "Introduce the world topic using the richest asset group.",
    choiceCount: 0,
    contentZone: "group-scene",
    learnerGoal: "Notice the topic.",
    promptRule: "Use one short sentence.",
    stage: "Discover",
  },
  {
    challengeRule: "Explain the concept with clear examples and hints.",
    choiceCount: 0,
    contentZone: "group-scene",
    learnerGoal: "Understand the idea.",
    promptRule: "Name what the learner should look at.",
    stage: "Explore",
  },
  {
    challengeRule: "Teach with familiar assets and visible hints.",
    choiceCount: 2,
    contentZone: "choice-pair",
    learnerGoal: "Try the skill with help.",
    promptRule: "Start with Tap, Match, or Say.",
    stage: "Interact",
  },
  {
    challengeRule: "Practice the same skill with a guided answer check.",
    choiceCount: 2,
    contentZone: "choice-pair",
    learnerGoal: "Confirm the skill.",
    promptRule: "Use Match or Count and Match.",
    stage: "Practice",
  },
  {
    challengeRule: "Change the assets, counts, or sequence while testing the same skill.",
    choiceCount: 2,
    contentZone: "choice-pair",
    learnerGoal: "Transfer the skill.",
    promptRule: "Give less hint than Interact.",
    stage: "Challenge",
  },
  {
    challengeRule: "Let the child claim the reward before moving on.",
    choiceCount: 0,
    contentZone: "single-target",
    learnerGoal: "Celebrate effort.",
    promptRule: "Keep reward language concrete.",
    stage: "Reward",
  },
  {
    challengeRule: "Show progress in simple visual form.",
    choiceCount: 0,
    contentZone: "single-target",
    learnerGoal: "See growth.",
    promptRule: "Name the world and progress.",
    stage: "Progress",
  },
  {
    challengeRule: "Confirm mastery and preview the next topic.",
    choiceCount: 0,
    contentZone: "single-target",
    learnerGoal: "Finish with confidence.",
    promptRule: "Name the mastered topic.",
    stage: "Mastery",
  },
];
