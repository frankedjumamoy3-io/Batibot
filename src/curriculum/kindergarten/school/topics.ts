import { KINDERGARTEN_SCHOOL_WORLD_CONFIG } from "./config";
import type { KindergartenSchoolTopicId } from "./types";

export const KINDERGARTEN_SCHOOL_TOPIC_ORDER =
  KINDERGARTEN_SCHOOL_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_SCHOOL_TOPIC_IDS =
  new Set<KindergartenSchoolTopicId>([
    "bag",
    "book",
    "paper",
    "chair",
    "crayon",
    "desk",
    "eraser",
    "notebook",
    "pencil",
  ]);
