import { GRADE1_SHAPE_WORLD_ID } from "./config";
import { getGrade1ShapeMeaning } from "./meanings";
import { getGrade1ShapeTopicConfig } from "./topics";

export function isScopedGrade1ShapeTopic(topicTitle: string) {
  return Boolean(getGrade1ShapeTopicConfig(topicTitle));
}

export function isScopedGrade1ShapeWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === GRADE1_SHAPE_WORLD_ID && isScopedGrade1ShapeTopic(topicTitle)
  );
}

export function getGrade1ShapeTopicSupport(topicTitle: string) {
  const topic = getGrade1ShapeTopicConfig(topicTitle);
  const meaning = getGrade1ShapeMeaning(topicTitle);

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
