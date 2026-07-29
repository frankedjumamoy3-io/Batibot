export const KINDERGARTEN_SIZE_WORLD_ID = "kindergarten-big-small";

export const KINDERGARTEN_SIZE_WORLD_CONFIG = {
  id: KINDERGARTEN_SIZE_WORLD_ID,
  title: "Big & Small Village",
  emoji: "SIZE",
  accentColor: "#F97316",
  description:
    "Compare real objects by size, height, length, and weight clues.",
  activities: [
    "Compare size pairs",
    "Match comparison words",
    "Find big and small",
    "Build size matches",
  ],
  topics: [
    {
      assetId: "big-small",
      title: "Big & Small",
      emoji: "SIZE",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Compare big and small objects.",
    },
    {
      assetId: "tall-short",
      title: "Tall & Short",
      emoji: "TALL",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Compare tall and short objects.",
    },
    {
      assetId: "long-short",
      title: "Long & Short",
      emoji: "LONG",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Compare long and short objects.",
    },
    {
      assetId: "heavy-light",
      title: "Heavy & Light",
      emoji: "HEAVY",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Listening Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Compare heavy and light objects.",
    },
    {
      assetId: "size-challenge",
      title: "Size Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Match Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Complete mixed comparison missions.",
    },
  ],
};
