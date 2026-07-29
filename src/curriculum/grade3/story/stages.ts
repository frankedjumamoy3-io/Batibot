import { GRADE3_STORY_WORLD_ID } from "./config";
import { getGrade3StoryTopicConfig } from "./topics";

export function isScopedGrade3StoryWorldTopic(worldId: string, topicTitle: string) {
  return worldId === GRADE3_STORY_WORLD_ID && Boolean(getGrade3StoryTopicConfig(topicTitle));
}

export function getGrade3StoryTopicSupport(topicTitle: string) {
  const topic = getGrade3StoryTopicConfig(topicTitle);

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
