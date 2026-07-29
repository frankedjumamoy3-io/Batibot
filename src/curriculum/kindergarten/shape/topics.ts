import { KINDERGARTEN_SHAPE_WORLD_CONFIG } from "./config";
import type { KindergartenShapeTopicId } from "./types";

export const KINDERGARTEN_SHAPE_TOPIC_ORDER =
  KINDERGARTEN_SHAPE_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_SHAPE_TOPIC_IDS =
  new Set<KindergartenShapeTopicId>([
    "circle",
    "oval",
    "square",
    "rectangle",
    "triangle",
    "shape-challenge",
  ]);
