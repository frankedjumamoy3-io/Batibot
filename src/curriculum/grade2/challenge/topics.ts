import { GRADE2_CHALLENGE_WORLD_CONFIG } from "./config";

export const GRADE2_CHALLENGE_TOPIC_ORDER = GRADE2_CHALLENGE_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2ChallengeTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2ChallengeTopicConfig(topicTitle: string) {
  const topicKey = getGrade2ChallengeTopicKey(topicTitle);
  return GRADE2_CHALLENGE_WORLD_CONFIG.topics.find((topic) => getGrade2ChallengeTopicKey(topic.title) === topicKey);
}
