import { PRESCHOOL_SIZE_TOPIC_CONFIGS } from "./topics";
import type { PreschoolSizeWorldConfig } from "./types";

export const PRESCHOOL_SIZE_WORLD_ID = "preschool-big-small";

export const PRESCHOOL_SIZE_WORLD_CONFIG: PreschoolSizeWorldConfig = {
  id: PRESCHOOL_SIZE_WORLD_ID,
  title: "Big and Small Village",
  emoji: "SIZE",
  accentColor: "#0EA5E9",
  description:
    "A size village for comparing the same animal, fruit, food, or shape at small, medium, and big physical sizes.",
  activities: [
    "Compare identical art",
    "Tap big and small",
    "Sort by size",
    "Match same object sizes",
    "Choose physical size",
  ],
  topics: PRESCHOOL_SIZE_TOPIC_CONFIGS,
};
