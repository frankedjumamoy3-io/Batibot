import type { PreschoolFruitTopicId, PreschoolFruitWorldConfig } from "./types";

export const PRESCHOOL_FRUIT_WORLD_ID = "preschool-fruit-garden";

export const PRESCHOOL_FRUIT_WORLD_CONFIG: PreschoolFruitWorldConfig = {
  id: PRESCHOOL_FRUIT_WORLD_ID,
  title: "Fruit Garden",
  emoji: "FRUIT",
  accentColor: "#22C55E",
  description:
    "A fruit-picking adventure for seeing, exploring, sorting, collecting, matching, and counting fruits.",
  activities: [
    "Explore fruit clues",
    "Match fruits",
    "Pick fruits",
    "Sort fruits",
    "Count fruits",
  ],
  topics: [
    {
      assetId: "apple",
      title: "Apple",
      emoji: "A",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Apple is red.",
    },
    {
      assetId: "banana",
      title: "Banana",
      emoji: "B",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Banana is yellow.",
    },
    {
      assetId: "mango",
      title: "Mango",
      emoji: "M",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Mango is sweet.",
    },
    {
      assetId: "orange",
      title: "Orange",
      emoji: "O",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Orange is orange.",
    },
    {
      assetId: "grapes",
      title: "Grapes",
      emoji: "G",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Counting Activity", "Drag and Drop Activity"],
      example: "Grapes grow in bunches.",
    },
    {
      assetId: "watermelon",
      title: "Watermelon",
      emoji: "W",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Watermelon is big.",
    },
  ],
};

export const PRESCHOOL_FRUIT_TOPIC_ORDER = PRESCHOOL_FRUIT_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_FRUIT_TOPIC_IDS = new Set<PreschoolFruitTopicId>([
  "apple",
  "banana",
  "mango",
  "orange",
  "grapes",
  "watermelon",
]);
