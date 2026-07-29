import { GRADE1_READING_WORLD_ID } from "./config";
import { getGrade1ReadingContent } from "./content";
import { getGrade1ReadingTopicConfig } from "./topics";

export function isScopedGrade1ReadingTopic(topicTitle: string) {
  return Boolean(getGrade1ReadingTopicConfig(topicTitle));
}

export function isScopedGrade1ReadingWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === GRADE1_READING_WORLD_ID &&
    isScopedGrade1ReadingTopic(topicTitle)
  );
}

export function getGrade1ReadingTopicSupport(topicTitle: string) {
  const topic = getGrade1ReadingTopicConfig(topicTitle);
  const content = getGrade1ReadingContent(topicTitle);

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
