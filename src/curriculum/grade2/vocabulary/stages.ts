import { GRADE2_VOCABULARY_WORLD_ID } from "./config";
import { getGrade2VocabularyTopicConfig } from "./topics";

export function isScopedGrade2VocabularyWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_VOCABULARY_WORLD_ID && Boolean(getGrade2VocabularyTopicConfig(topicTitle));
}

export function getGrade2VocabularyTopicSupport(topicTitle: string) {
  const topic = getGrade2VocabularyTopicConfig(topicTitle);
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
