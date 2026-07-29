import type { PreschoolFoodTopicId, PreschoolFoodWorldConfig } from "./types";

export const PRESCHOOL_FOOD_WORLD_ID = "preschool-food-town";

export const PRESCHOOL_FOOD_WORLD_CONFIG: PreschoolFoodWorldConfig = {
  id: PRESCHOOL_FOOD_WORLD_ID,
  title: "Food Town",
  emoji: "FOOD",
  accentColor: "#F59E0B",
  description:
    "A food adventure town for recognizing, grouping, sorting, serving, and preparing simple meals.",
  activities: [
    "Explore food clues",
    "Match foods",
    "Sort healthy foods",
    "Prepare meals",
    "Serve a feast",
  ],
  topics: [
    {
      assetId: "rice",
      title: "Rice",
      emoji: "R",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Rice is food.",
    },
    {
      assetId: "bread",
      title: "Bread",
      emoji: "B",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Bread can make a sandwich.",
    },
    {
      assetId: "milk",
      title: "Milk",
      emoji: "M",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Milk helps us grow.",
    },
    {
      assetId: "egg",
      title: "Egg",
      emoji: "E",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Counting Activity", "Drag and Drop Activity"],
      example: "Egg is food.",
    },
    {
      assetId: "meat",
      title: "Meat",
      emoji: "M",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Meat is food.",
    },
    {
      assetId: "vegetables",
      title: "Vegetables",
      emoji: "V",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Vegetables help us grow.",
    },
    {
      assetId: "juice",
      title: "Juice",
      emoji: "J",
      category: "linguistic",
      subcategory: "things",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Juice is a drink.",
    },
  ],
};

export const PRESCHOOL_FOOD_TOPIC_ORDER = PRESCHOOL_FOOD_WORLD_CONFIG.topics.map(
  (topic) => topic.title
);

export const SCOPED_FOOD_TOPIC_IDS = new Set<PreschoolFoodTopicId>([
  "rice",
  "bread",
  "milk",
  "egg",
  "meat",
  "vegetables",
  "juice",
]);
