import type { Grade2MeasurementWorldConfig } from "./types";

export const GRADE2_MEASUREMENT_WORLD_ID = "grade2-measurement";

export const GRADE2_MEASUREMENT_WORLD_CONFIG: Grade2MeasurementWorldConfig = {
  id: GRADE2_MEASUREMENT_WORLD_ID,
  title: "Measurement Harbor",
  emoji: "⚓",
  accentColor: "#14B8A6",
  description: "Measure, compare, and describe length, weight, capacity, and time.",
  activities: ["Measurement puzzles","Match activity","Clock practice","Mini challenge"],
  topics: [
    {
      assetId: "length",
      title: "Length",
      emoji: "L",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Match Activity","Puzzle Activity"],
    },
    {
      assetId: "weight",
      title: "Weight",
      emoji: "W",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Match Activity","Puzzle Activity"],
    },
    {
      assetId: "capacity",
      title: "Capacity",
      emoji: "C",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Match Activity","Puzzle Activity"],
    },
    {
      assetId: "time",
      title: "Time",
      emoji: "T",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Match Activity","Puzzle Activity"],
      example: "Read simple clock times and choose the matching daily activity.",
    },
    {
      assetId: "measurement-challenge",
      title: "Measurement Challenge",
      emoji: "BADGE",
      category: "numeric",
      subcategory: "measurement",
      interactionTypes: ["Match Activity","Puzzle Activity","Mastery Challenge"],
      example: "Measure, compare, sort, and select the best tool.",
    }
  ],
};
