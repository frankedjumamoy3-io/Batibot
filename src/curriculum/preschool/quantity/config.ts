import { PRESCHOOL_QUANTITY_TOPIC_CONFIGS } from "./topics";
import type { PreschoolQuantityWorldConfig } from "./types";

export const PRESCHOOL_QUANTITY_WORLD_ID = "preschool-more-less";

export const PRESCHOOL_QUANTITY_WORLD_CONFIG: PreschoolQuantityWorldConfig = {
  id: PRESCHOOL_QUANTITY_WORLD_ID,
  title: "More and Less Valley",
  emoji: "+-=",
  accentColor: "#F97316",
  description:
    "A quantity valley for counting two groups first, then choosing which group has more or less.",
  activities: [
    "Count each group",
    "Compare animal groups",
    "Compare fruit groups",
    "Compare food groups",
    "Compare shape groups",
  ],
  topics: PRESCHOOL_QUANTITY_TOPIC_CONFIGS,
};
