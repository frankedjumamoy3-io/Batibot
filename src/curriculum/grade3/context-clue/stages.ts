import { GRADE3_CONTEXT_CLUE_WORLD_ID } from "./config";
import { getGrade3ContextClueTopicConfig } from "./topics";

export function isScopedGrade3ContextClueWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_CONTEXT_CLUE_WORLD_ID && Boolean(getGrade3ContextClueTopicConfig(topicTitle));
}

export function getGrade3ContextClueTopicSupport(topicTitle: string) {
  const topic = getGrade3ContextClueTopicConfig(topicTitle);

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
