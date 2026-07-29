import { GRADE3_DIVISION_WORLD_ID } from "./config";
import { getGrade3DivisionTopicConfig } from "./topics";

export function isScopedGrade3DivisionWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_DIVISION_WORLD_ID && Boolean(getGrade3DivisionTopicConfig(topicTitle));
}

export function getGrade3DivisionTopicSupport(topicTitle: string) {
  const topic = getGrade3DivisionTopicConfig(topicTitle);

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
