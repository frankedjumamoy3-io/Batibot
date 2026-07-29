import { GRADE2_STORY_WORLD_ID } from "./config";
import { getGrade2StoryTopicConfig } from "./topics";

export function isScopedGrade2StoryWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE2_STORY_WORLD_ID && Boolean(getGrade2StoryTopicConfig(topicTitle));
}

export function getGrade2StoryTopicSupport(topicTitle: string) {
  const topic = getGrade2StoryTopicConfig(topicTitle);
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
