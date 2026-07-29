import { KINDERGARTEN_NUMBER_WORLD_CONFIG } from "./config";
import type { KindergartenNumberTopicId } from "./types";

export const KINDERGARTEN_NUMBER_TOPIC_ORDER =
  KINDERGARTEN_NUMBER_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_NUMBER_TOPIC_IDS =
  new Set<KindergartenNumberTopicId>([
    "number-11",
    "number-12",
    "number-13",
    "number-14",
    "number-15",
    "number-16",
    "number-17",
    "number-18",
    "number-19",
    "number-20",
    "number-challenge",
  ]);
