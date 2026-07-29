import { PRESCHOOL_BODY_TOPIC_CONFIGS } from "./topics";
import type { PreschoolBodyWorldConfig } from "./types";

export const PRESCHOOL_BODY_WORLD_ID = "preschool-body-world";

export const PRESCHOOL_BODY_WORLD_CONFIG: PreschoolBodyWorldConfig = {
  id: PRESCHOOL_BODY_WORLD_ID,
  title: "My Body World",
  emoji: "BODY",
  accentColor: "#6D28FF",
  description: "Use body parts to see, hear, smell, eat, hold, move, and build.",
  activities: [
    "Touch body parts",
    "Find body parts",
    "Use body functions",
    "Build the child",
  ],
  topics: PRESCHOOL_BODY_TOPIC_CONFIGS,
};
