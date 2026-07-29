import type { PreschoolPatternTopicConfig, PreschoolPatternTopicId } from "./types";

export const PRESCHOOL_PATTERN_TOPIC_CONFIGS: PreschoolPatternTopicConfig[] = [
  {
    assetId: "animal-patterns",
    title: "Animal Patterns",
    emoji: "AB",
    category: "numeric",
    subcategory: "patterns",
    interactionTypes: ["Sequence Activity", "Puzzle Activity", "Drag and Drop Activity"],
    example: "Animals repeat in an AB pattern.",
    patternType: "AB",
  },
  {
    assetId: "fruit-patterns",
    title: "Fruit Patterns",
    emoji: "AAB",
    category: "numeric",
    subcategory: "patterns",
    interactionTypes: ["Sequence Activity", "Puzzle Activity", "Drag and Drop Activity"],
    example: "Fruits repeat in an AAB pattern.",
    patternType: "AAB",
  },
  {
    assetId: "food-patterns",
    title: "Food Patterns",
    emoji: "ABB",
    category: "numeric",
    subcategory: "patterns",
    interactionTypes: ["Sequence Activity", "Puzzle Activity", "Drag and Drop Activity"],
    example: "Foods repeat in an ABB pattern.",
    patternType: "ABB",
  },
  {
    assetId: "shape-patterns",
    title: "Shape Patterns",
    emoji: "ABC",
    category: "numeric",
    subcategory: "patterns",
    interactionTypes: ["Sequence Activity", "Puzzle Activity", "Drag and Drop Activity"],
    example: "Shapes repeat in an ABC pattern.",
    patternType: "ABC",
  },
  {
    assetId: "pattern-challenge",
    title: "Pattern Challenge",
    emoji: "BADGE",
    category: "numeric",
    subcategory: "patterns",
    interactionTypes: ["Sequence Activity", "Drag and Drop Activity", "Mastery Challenge"],
    example: "Repair AB, AAB, ABB, and ABC picture patterns.",
    patternType: "ABC",
  },
];

export const PRESCHOOL_PATTERN_TOPIC_ORDER = PRESCHOOL_PATTERN_TOPIC_CONFIGS.map(
  (topic) => topic.title,
);

export const SCOPED_PATTERN_TOPIC_IDS = new Set<PreschoolPatternTopicId>([
  "animal-patterns",
  "fruit-patterns",
  "food-patterns",
  "shape-patterns",
  "pattern-challenge",
]);
