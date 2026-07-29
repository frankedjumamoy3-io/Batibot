import { GRADE2_PROBLEM_SOLVING_WORLD_ID } from "./config";
import { getGrade2ProblemSolvingTopicConfig } from "./topics";

export function isScopedGrade2ProblemSolvingWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_PROBLEM_SOLVING_WORLD_ID && Boolean(getGrade2ProblemSolvingTopicConfig(topicTitle));
}

export function getGrade2ProblemSolvingTopicSupport(topicTitle: string) {
  const topic = getGrade2ProblemSolvingTopicConfig(topicTitle);
  if (!topic) {
    return null;
  }
  return {
    assetId: topic.assetId,
    example: topic.example,
    interactionTypes: topic.interactionTypes,
    title: topic.title,
  };
}
