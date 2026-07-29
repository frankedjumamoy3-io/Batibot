import { GRADE3_STORY_WORLD_CONFIG } from "./config";

export const GRADE3_STORY_TOPIC_ORDER = GRADE3_STORY_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3StoryTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3StoryTopicConfig(topicTitle: string) {
  const topicKey = getGrade3StoryTopicKey(topicTitle);
  return GRADE3_STORY_WORLD_CONFIG.topics.find((topic) => getGrade3StoryTopicKey(topic.title) === topicKey);
}
