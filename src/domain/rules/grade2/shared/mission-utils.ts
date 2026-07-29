import type {
  Grade2Mission,
  Grade2MissionTopic,
  Grade2TopicResolver,
} from "./types";
import { getUniqueGrade2Choices } from "./choice-utils";

export function buildGrade2TopicMission(worldId: string, topic: Grade2MissionTopic | null): Grade2Mission | null {
  if (!topic) {
    return null;
  }
  return {
    action: topic.interactionTypes[0] ?? "Mastery Challenge",
    assetId: topic.assetId,
    choices: getUniqueGrade2Choices([topic.title]),
    correctAnswer: topic.title,
    prompt: topic.example ?? `Use ${topic.title}.`,
    topicTitle: topic.title,
    worldId,
  };
}

export function createGrade2WorldMissionBuilder(
  worldId: string,
  getTopicConfig: Grade2TopicResolver
) {
  return (topicTitle: string) =>
    buildGrade2TopicMission(worldId, getTopicConfig(topicTitle) ?? null);
}
