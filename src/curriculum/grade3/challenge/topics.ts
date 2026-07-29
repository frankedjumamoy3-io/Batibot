import { GRADE3_CHALLENGE_WORLD_CONFIG } from "./config";

export const GRADE3_CHALLENGE_TOPIC_ORDER = GRADE3_CHALLENGE_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade3ChallengeTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade3ChallengeTopicConfig(topicTitle: string) {
  const topicKey = getGrade3ChallengeTopicKey(topicTitle);
  return GRADE3_CHALLENGE_WORLD_CONFIG.topics.find((topic) => getGrade3ChallengeTopicKey(topic.title) === topicKey);
}
