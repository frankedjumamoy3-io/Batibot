import { GRADE1_FAMILY_STORY_WORLD_ID } from "./config";
import { getGrade1FamilyStoryContent } from "./content";
import { getGrade1FamilyStoryTopicConfig } from "./topics";

export function isScopedGrade1FamilyStoryTopic(topicTitle: string) {
  return Boolean(getGrade1FamilyStoryTopicConfig(topicTitle));
}

export function isScopedGrade1FamilyStoryWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === GRADE1_FAMILY_STORY_WORLD_ID &&
    isScopedGrade1FamilyStoryTopic(topicTitle)
  );
}

export function getGrade1FamilyStoryTopicSupport(topicTitle: string) {
  const topic = getGrade1FamilyStoryTopicConfig(topicTitle);
  const content = getGrade1FamilyStoryContent(topicTitle);

  if (!topic || !content) {
    return null;
  }

  return {
    assetId: topic.assetId,
    examples: content.examples,
    meaning: content.meaning,
    pronunciation: content.pronunciation,
  };
}
