import type { Grade2ProblemSolvingWorldConfig } from "./types";

export const GRADE2_PROBLEM_SOLVING_WORLD_ID = "grade2-problems";

export const GRADE2_PROBLEM_SOLVING_WORLD_CONFIG: Grade2ProblemSolvingWorldConfig = {
  id: GRADE2_PROBLEM_SOLVING_WORLD_ID,
  title: "Problem Solver City",
  emoji: "🧠",
  accentColor: "#F97316",
  description: "Use math stories, models, and evidence to solve problems.",
  activities: ["Story problems","Operation choice","Workspace models","Puzzle quests"],
  topics: [
    {
      assetId: "addition-word-problems",
      title: "Addition Word Problems",
      emoji: "+",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Story-Based Activity","Mastery Challenge"],
      example: "Model and explain an addition problem.",
    },
    {
      assetId: "subtraction-word-problems",
      title: "Subtraction Word Problems",
      emoji: "-",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Story-Based Activity","Mastery Challenge"],
      example: "Model and explain a subtraction problem.",
    },
    {
      assetId: "mixed-word-problems",
      title: "Mixed Word Problems",
      emoji: "+/-",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Story-Based Activity","Mastery Challenge"],
      example: "Choose addition or subtraction, then model and solve the story.",
    },
    {
      assetId: "problem-solving-challenge",
      title: "Problem Solving Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "problem-solving",
      interactionTypes: ["Story-Based Activity","Mastery Challenge"],
      example: "Choose a strategy, show the workspace, and explain the result.",
    }
  ],
};
