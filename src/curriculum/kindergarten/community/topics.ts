import { KINDERGARTEN_COMMUNITY_WORLD_CONFIG } from "./config";
import type { KindergartenCommunityTopicId } from "./types";

export const KINDERGARTEN_COMMUNITY_TOPIC_ORDER =
  KINDERGARTEN_COMMUNITY_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_KINDERGARTEN_COMMUNITY_TOPIC_IDS =
  new Set<KindergartenCommunityTopicId>([
    "teacher",
    "doctor",
    "police-officer",
    "firefighter",
    "farmer",
    "community-challenge",
  ]);
