import type { PreschoolSizeTopicConfig, PreschoolSizeTopicId } from "./types";

export const PRESCHOOL_SIZE_TOPIC_CONFIGS: PreschoolSizeTopicConfig[] = [
  {
    assetId: "big",
    title: "Big",
    emoji: "SIZE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Big means larger physical size.",
  },
  {
    assetId: "small",
    title: "Small",
    emoji: "SIZE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Small means smaller physical size.",
  },
  {
    assetId: "tall",
    title: "Tall",
    emoji: "SIZE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Tall means higher physical height.",
  },
  {
    assetId: "short",
    title: "Short",
    emoji: "SIZE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
    example: "Short means lower physical height.",
  },
  {
    assetId: "mixed-sizes",
    title: "Mixed Sizes",
    emoji: "BADGE",
    category: "numeric",
    subcategory: "comparing",
    interactionTypes: ["Match Activity", "Drag and Drop Activity", "Mastery Challenge"],
    example: "Complete big, small, tall, and short missions.",
  },
];

export const PRESCHOOL_SIZE_TOPIC_ORDER = PRESCHOOL_SIZE_TOPIC_CONFIGS.map(
  (topic) => topic.title,
);

export const SCOPED_SIZE_TOPIC_IDS = new Set<PreschoolSizeTopicId>([
  "big",
  "small",
  "tall",
  "short",
  "mixed-sizes",
]);
