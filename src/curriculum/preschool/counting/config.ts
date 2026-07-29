import type { PreschoolCountingTopicConfig, PreschoolCountingTopicId, PreschoolCountingWorldConfig } from "./types";

export const PRESCHOOL_COUNTING_WORLD_ID = "preschool-counting-forest";

export const PRESCHOOL_COUNTING_TOPIC_CONFIGS: PreschoolCountingTopicConfig[] = [
  {
    assetId: "counting-animals",
    title: "Counting Animals",
    emoji: "DOT",
    category: "numeric",
    subcategory: "counting",
    interactionTypes: ["Counting Activity", "Tap Activity", "Drag and Drop Activity"],
    example: "Count every animal once.",
  },
  {
    assetId: "counting-fruits",
    title: "Counting Fruits",
    emoji: "DOT",
    category: "numeric",
    subcategory: "counting",
    interactionTypes: ["Counting Activity", "Tap Activity", "Drag and Drop Activity"],
    example: "Count every fruit once.",
  },
  {
    assetId: "counting-foods",
    title: "Counting Foods",
    emoji: "DOT",
    category: "numeric",
    subcategory: "counting",
    interactionTypes: ["Counting Activity", "Tap Activity", "Drag and Drop Activity"],
    example: "Count every food once.",
  },
  {
    assetId: "counting-shapes",
    title: "Counting Shapes",
    emoji: "DOT",
    category: "numeric",
    subcategory: "counting",
    interactionTypes: ["Counting Activity", "Tap Activity", "Drag and Drop Activity"],
    example: "Count every shape once.",
  },
  {
    assetId: "counting-challenge",
    title: "Counting Challenge",
    emoji: "BADGE",
    category: "numeric",
    subcategory: "counting",
    interactionTypes: ["Counting Activity", "Drag and Drop Activity", "Mastery Challenge"],
    example: "Complete every counting mission.",
  },
];

export const PRESCHOOL_COUNTING_WORLD_CONFIG: PreschoolCountingWorldConfig = {
  id: PRESCHOOL_COUNTING_WORLD_ID,
  title: "Counting Forest",
  emoji: "DOT",
  accentColor: "#16A34A",
  description:
    "Picture-first counting: look, touch each object, remember the count, and collect exact groups.",
  activities: [
    "Look at object groups",
    "Tap each object once",
    "Remember the count",
    "Match dot groups",
    "Collect exact groups",
  ],
  topics: PRESCHOOL_COUNTING_TOPIC_CONFIGS,
};

export const PRESCHOOL_COUNTING_TOPIC_ORDER = PRESCHOOL_COUNTING_TOPIC_CONFIGS.map(
  (topic) => topic.title,
);

export const SCOPED_COUNTING_TOPIC_IDS = new Set<PreschoolCountingTopicId>([
  "counting-animals",
  "counting-fruits",
  "counting-foods",
  "counting-shapes",
  "counting-challenge",
]);
