import { GRADE3_MONEY_WORLD_ID } from "./config";
import { getGrade3MoneyTopicConfig } from "./topics";

export function isScopedGrade3MoneyWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_MONEY_WORLD_ID && Boolean(getGrade3MoneyTopicConfig(topicTitle));
}

export function getGrade3MoneyTopicSupport(topicTitle: string) {
  const topic = getGrade3MoneyTopicConfig(topicTitle);

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
