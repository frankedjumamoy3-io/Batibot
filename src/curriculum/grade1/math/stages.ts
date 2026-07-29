import { GRADE1_MATH_WORLD_ID } from "./config";
import { getGrade1MathContent } from "./operations";
import { getGrade1MathTopicConfig } from "./topics";

export function isScopedGrade1MathTopic(topicTitle: string) {
  return Boolean(getGrade1MathTopicConfig(topicTitle));
}

export function isScopedGrade1MathWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return worldId === GRADE1_MATH_WORLD_ID && isScopedGrade1MathTopic(topicTitle);
}

export function getGrade1MathTopicSupport(topicTitle: string) {
  const topic = getGrade1MathTopicConfig(topicTitle);
  const content = getGrade1MathContent(topicTitle);

  if (!topic || !content) {
    return null;
  }

  return {
    assetId: topic.assetId,
    examples: content.examples,
    meaning: content.meaning,
    pronunciation: content.pronunciation,
  };
}
