import { PRESCHOOL_PATTERN_TOPIC_CONFIGS } from "./topics";
import type { PreschoolPatternWorldConfig } from "./types";

export const PRESCHOOL_PATTERN_WORLD_ID = "preschool-pattern-playground";

export const PRESCHOOL_PATTERN_WORLD_CONFIG: PreschoolPatternWorldConfig = {
  id: PRESCHOOL_PATTERN_WORLD_ID,
  title: "Pattern Playground",
  emoji: "AB",
  accentColor: "#EC4899",
  description:
    "Picture pattern play using animals, fruits, foods, and shapes before quantity comparison.",
  activities: [
    "Tap repeating pictures",
    "Repair AB patterns",
    "Build AAB patterns",
    "Build ABB patterns",
    "Complete ABC patterns",
  ],
  topics: PRESCHOOL_PATTERN_TOPIC_CONFIGS,
};
