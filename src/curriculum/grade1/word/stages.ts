import { GRADE1_WORD_WORLD_ID } from "./config";
import { getGrade1WordMeaning } from "./meanings";
import { getGrade1WordTopicConfig } from "./topics";

export function isScopedGrade1WordTopic(topicTitle: string) {
  return Boolean(getGrade1WordTopicConfig(topicTitle));
}

export function isScopedGrade1WordWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return worldId === GRADE1_WORD_WORLD_ID && isScopedGrade1WordTopic(topicTitle);
}

export function getGrade1WordTopicSupport(topicTitle: string) {
  const topic = getGrade1WordTopicConfig(topicTitle);
  const meaning = getGrade1WordMeaning(topicTitle);

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
