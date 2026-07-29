import { KINDERGARTEN_COMMUNITY_WORLD_ID } from "./config";
import { getKindergartenCommunityRolePrompt } from "./meanings";
import { SCOPED_KINDERGARTEN_COMMUNITY_TOPIC_IDS } from "./topics";
import type {
  KindergartenCommunityTopicId,
  KindergartenCommunityTopicSupportConfig,
} from "./types";

export function getKindergartenCommunityTopicKey(
  topicTitle: string
): KindergartenCommunityTopicId {
  return topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") as KindergartenCommunityTopicId;
}

export function isScopedKindergartenCommunityTopic(topicTitle: string) {
  return SCOPED_KINDERGARTEN_COMMUNITY_TOPIC_IDS.has(
    getKindergartenCommunityTopicKey(topicTitle)
  );
}

export function isScopedKindergartenCommunityWorldTopic(
  worldId: string,
  topicTitle: string
) {
  return (
    worldId === KINDERGARTEN_COMMUNITY_WORLD_ID &&
    isScopedKindergartenCommunityTopic(topicTitle)
  );
}

export function getKindergartenCommunityTopicSupport(
  topicTitle: string
): KindergartenCommunityTopicSupportConfig | null {
  if (!isScopedKindergartenCommunityTopic(topicTitle)) {
    return null;
  }

  const role = getKindergartenCommunityRolePrompt(topicTitle);

  return {
    audioPrompt: `${topicTitle} helps the community.`,
    competencyFocus: ["Oral Language", "Early Reading"],
    objectMatch: role.object,
    oralPrompt: `Say ${topicTitle}.`,
    pictureMatch: [`${topicTitle} picture`, role.object],
    target: topicTitle,
    wordMatch: [topicTitle],
    stagePrompts: {
      Practice: role.prompt,
      Challenge: `Match ${topicTitle} to ${role.object}.`,
    },
    example: `${role.prompt} Match ${topicTitle} to ${role.object}.`,
    interactionTypes: ["Listening Activity", "Tap Activity", "Match Activity", "Timed Challenge"],
  };
}
