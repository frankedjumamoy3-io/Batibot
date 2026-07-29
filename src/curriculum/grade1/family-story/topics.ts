import { GRADE1_FAMILY_STORY_WORLD_CONFIG } from "./config";
import type { Grade1FamilyStoryTopicId } from "./types";

export const GRADE1_FAMILY_STORY_TOPIC_ORDER =
  GRADE1_FAMILY_STORY_WORLD_CONFIG.topics.map((topic) => topic.title);

export const SCOPED_GRADE1_FAMILY_STORY_TOPIC_IDS =
  new Set<Grade1FamilyStoryTopicId>(
    GRADE1_FAMILY_STORY_WORLD_CONFIG.topics.map((topic) =>
      getGrade1FamilyStoryTopicKey(topic.title)
    )
  );

export function getGrade1FamilyStoryTopicKey(
  topicTitle: string
): Grade1FamilyStoryTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") as Grade1FamilyStoryTopicId;
}

export function getGrade1FamilyStoryTopicConfig(topicTitle: string) {
  const topicKey = getGrade1FamilyStoryTopicKey(topicTitle);

  return GRADE1_FAMILY_STORY_WORLD_CONFIG.topics.find(
    (topic) => getGrade1FamilyStoryTopicKey(topic.title) === topicKey
  );
}
