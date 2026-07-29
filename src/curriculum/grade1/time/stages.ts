import { GRADE1_TIME_WORLD_ID } from "./config";
import { getGrade1TimeMeaning } from "./meanings";
import { getGrade1TimeTopicConfig } from "./topics";

export function isScopedGrade1TimeTopic(topicTitle: string) {
  return Boolean(getGrade1TimeTopicConfig(topicTitle));
}

export function isScopedGrade1TimeWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return worldId === GRADE1_TIME_WORLD_ID && isScopedGrade1TimeTopic(topicTitle);
}

export function getGrade1TimeTopicSupport(topicTitle: string) {
  const topic = getGrade1TimeTopicConfig(topicTitle);
  const meaning = getGrade1TimeMeaning(topicTitle);

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
