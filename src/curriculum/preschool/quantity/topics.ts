import type { PreschoolQuantityTopicConfig, PreschoolQuantityTopicId } from "./types";

export const PRESCHOOL_QUANTITY_TOPIC_CONFIGS: PreschoolQuantityTopicConfig[] = [
  {
    assetId: "more-animals",
    title: "More Animals",
    emoji: "+",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Count animal groups, then choose more or less.",
  },
  {
    assetId: "more-fruits",
    title: "More Fruits",
    emoji: "+",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Count fruit groups, then choose more or less.",
  },
  {
    assetId: "more-foods",
    title: "More Foods",
    emoji: "+",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Count food groups, then choose more or less.",
  },
  {
    assetId: "more-shapes",
    title: "More Shapes",
    emoji: "+",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Counting Activity", "Puzzle Activity", "Drag and Drop Activity"],
    example: "Count shape groups, then choose more or less.",
  },
  {
    assetId: "more-less-challenge",
    title: "More & Less Challenge",
    emoji: "BADGE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Counting Activity", "Drag and Drop Activity", "Mastery Challenge"],
    example: "Complete every quantity comparison mission.",
  },
];

export const PRESCHOOL_QUANTITY_TOPIC_ORDER = PRESCHOOL_QUANTITY_TOPIC_CONFIGS.map(
  (topic) => topic.title,
);

export const SCOPED_QUANTITY_TOPIC_IDS = new Set<PreschoolQuantityTopicId>([
  "more-animals",
  "more-fruits",
  "more-foods",
  "more-shapes",
  "more-less-challenge",
]);
