import { GRADE2_STORY_WORLD_CONFIG } from "./config";

export const GRADE2_STORY_TOPIC_ORDER = GRADE2_STORY_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2StoryTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2StoryTopicConfig(topicTitle: string) {
  const topicKey = getGrade2StoryTopicKey(topicTitle);
  return GRADE2_STORY_WORLD_CONFIG.topics.find((topic) => getGrade2StoryTopicKey(topic.title) === topicKey);
}
