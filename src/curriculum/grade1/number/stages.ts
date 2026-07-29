import { GRADE1_NUMBER_WORLD_ID } from "./config";
import { getGrade1NumberContent } from "./numbers";
import { getGrade1NumberTopicConfig } from "./topics";

export function isScopedGrade1NumberTopic(topicTitle: string) {
  return Boolean(getGrade1NumberTopicConfig(topicTitle));
}

export function isScopedGrade1NumberWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === GRADE1_NUMBER_WORLD_ID &&
    isScopedGrade1NumberTopic(topicTitle)
  );
}

export function getGrade1NumberTopicSupport(topicTitle: string) {
  const topic = getGrade1NumberTopicConfig(topicTitle);
  const content = getGrade1NumberContent(topicTitle);

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
