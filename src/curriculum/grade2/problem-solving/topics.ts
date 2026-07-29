import { GRADE2_PROBLEM_SOLVING_WORLD_CONFIG } from "./config";

export const GRADE2_PROBLEM_SOLVING_TOPIC_ORDER = GRADE2_PROBLEM_SOLVING_WORLD_CONFIG.topics.map((topic) => topic.title);

export function getGrade2ProblemSolvingTopicKey(topicTitle: string) {
  return topicTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getGrade2ProblemSolvingTopicConfig(topicTitle: string) {
  const topicKey = getGrade2ProblemSolvingTopicKey(topicTitle);
  return GRADE2_PROBLEM_SOLVING_WORLD_CONFIG.topics.find((topic) => getGrade2ProblemSolvingTopicKey(topic.title) === topicKey);
}
