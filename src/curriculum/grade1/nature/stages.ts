import { GRADE1_NATURE_WORLD_ID } from "./config";
import { getGrade1NatureMeaning } from "./meanings";
import { getGrade1NatureTopicConfig } from "./topics";

export function isScopedGrade1NatureTopic(topicTitle: string) {
  return Boolean(getGrade1NatureTopicConfig(topicTitle));
}

export function isScopedGrade1NatureWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === GRADE1_NATURE_WORLD_ID && isScopedGrade1NatureTopic(topicTitle)
  );
}

export function getGrade1NatureTopicSupport(topicTitle: string) {
  const topic = getGrade1NatureTopicConfig(topicTitle);
  const meaning = getGrade1NatureMeaning(topicTitle);

  if (!topic || !meaning) {
    return null;
  }

  return {
    assetId: topic.assetId,
    examples: meaning.examples,
    meaning: meaning.meaning,
    pronunciation: meaning.pronunciation,
  };
}
