import type { Grade3Mission, Grade3MissionTopic, Grade3TopicResolver } from "./types";
import { getUniqueGrade3Choices } from "./choice-utils";

export function buildGrade3TopicMission(worldId: string, topic: Grade3MissionTopic | null): Grade3Mission | null {
  if (!topic) {
    return null;
  }

  return {
    action: topic.interactionTypes[0] ?? "Mastery Challenge",
    assetId: topic.assetId,
    choices: getUniqueGrade3Choices([topic.title]),
    correctAnswer: topic.title,
    prompt: topic.example ?? `Use ${topic.title}.`,
    topicTitle: topic.title,
    worldId,
  };
}

export function createGrade3WorldMissionBuilder(worldId: string, getTopicConfig: Grade3TopicResolver) {
  return (topicTitle: string) => buildGrade3TopicMission(worldId, getTopicConfig(topicTitle) ?? null);
}
