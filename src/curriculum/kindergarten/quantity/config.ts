export const KINDERGARTEN_QUANTITY_WORLD_ID = "kindergarten-more-less";

export const KINDERGARTEN_QUANTITY_WORLD_CONFIG = {
  id: KINDERGARTEN_QUANTITY_WORLD_ID,
  title: "More & Less Valley",
  emoji: "+/-",
  accentColor: "#22C55E",
  description:
    "Count simple groups, then compare more, less, and equal amounts.",
  activities: [
    "Count each group",
    "Compare more and less",
    "Find equal groups",
    "Move the matching group",
  ],
  topics: [
    {
      assetId: "more",
      title: "More",
      emoji: "+",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Find the group with more.",
    },
    {
      assetId: "less",
      title: "Less",
      emoji: "-",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Find the group with less.",
    },
    {
      assetId: "equal",
      title: "Equal",
      emoji: "=",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Match Activity", "Drag and Drop Activity"],
      example: "Find groups with equal amounts.",
    },
    {
      assetId: "compare-groups",
      title: "Compare Groups",
      emoji: "A/B",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Puzzle Activity", "Drag and Drop Activity"],
      example: "Compare group A and group B.",
    },
    {
      assetId: "comparison-challenge",
      title: "Comparison Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "comparing",
      interactionTypes: ["Counting Activity", "Drag and Drop Activity", "Mastery Challenge"],
      example: "Complete mixed quantity comparison missions.",
    },
  ],
};
