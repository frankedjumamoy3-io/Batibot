import { KINDERGARTEN_NATURE_WORLD_CONFIG } from "./config";
import type { KindergartenNatureTopicId } from "./types";

export const KINDERGARTEN_NATURE_TOPIC_ORDER =
  KINDERGARTEN_NATURE_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_NATURE_TOPIC_IDS =
  new Set<KindergartenNatureTopicId>([
    "plants",
    "animals-in-nature",
    "weather",
    "trees",
    "flowers",
    "nature-challenge",
  ]);
