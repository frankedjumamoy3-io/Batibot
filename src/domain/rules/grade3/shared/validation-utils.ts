import type { Grade3WorldConfig, Grade3WorldTopicConfig } from "@/src/curriculum/grade3";
import type { Grade3Mission, Grade3MissionValidationIssue, Grade3MissionValidationResult, Grade3WorldValidationIssue, Grade3WorldValidationResult } from "./types";
import { getUniqueGrade3Choices, hasDuplicateEquivalentGrade3Choices, normalizeGrade3ChoiceLabel } from "./choice-utils";

export function isSafeGrade3SemanticAssetId(assetId: string) {
  return Boolean(assetId) && !/[\/()]/.test(assetId) && !assetId.includes("require");
}

export function getGrade3MissionDistractors(mission: Grade3Mission | null) {
  if (!mission) {
    return [];
  }

  const normalizedCorrectAnswer = normalizeGrade3ChoiceLabel(mission.correctAnswer);
  return getUniqueGrade3Choices(mission.choices).filter((choice) => normalizeGrade3ChoiceLabel(choice) !== normalizedCorrectAnswer);
}

export function validateGrade3MissionDetailed(mission: Grade3Mission | null): Grade3MissionValidationResult {
  const issues: Grade3MissionValidationIssue[] = [];

  if (!mission) {
    return { isValid: false, issues: ["missing-mission"] };
  }

  if (!mission.topicTitle) issues.push("missing-topic-title");
  if (!mission.worldId) issues.push("missing-world-id");
  if (!mission.action) issues.push("missing-action");
  if (!mission.assetId) {
    issues.push("missing-semantic-asset-id");
  } else if (!isSafeGrade3SemanticAssetId(mission.assetId)) {
    issues.push("unsafe-asset-id");
  }
  if (!mission.correctAnswer) issues.push("missing-correct-answer");

  const normalizedCorrectAnswer = normalizeGrade3ChoiceLabel(mission.correctAnswer);
  const correctAnswerCount = mission.choices.filter((choice) => normalizeGrade3ChoiceLabel(choice) === normalizedCorrectAnswer).length;
  if (correctAnswerCount !== 1) issues.push("correct-answer-not-visible");
  if (hasDuplicateEquivalentGrade3Choices(mission.choices)) issues.push("duplicate-equivalent-choice");

  return { isValid: issues.length === 0, issues };
}

export function validateGrade3Mission(mission: Grade3Mission | null) {
  return validateGrade3MissionDetailed(mission).isValid;
}

export function validateGrade3TopicConfig(topic: Grade3WorldTopicConfig) {
  return Boolean(topic.title && topic.assetId && isSafeGrade3SemanticAssetId(topic.assetId) && topic.interactionTypes.length > 0);
}

export function validateGrade3WorldConfig(worldConfig: Grade3WorldConfig): Grade3WorldValidationResult {
  const issues: Grade3WorldValidationIssue[] = [];
  const topicIds = worldConfig.topics.map((topic) => normalizeGrade3ChoiceLabel(topic.title));

  if (!worldConfig.id) issues.push("missing-world-id");
  if (!worldConfig.title) issues.push("missing-world-title");
  if (worldConfig.topics.length === 0) issues.push("missing-topic");
  if (new Set(topicIds).size !== topicIds.length) issues.push("duplicate-topic-id");
  if (worldConfig.topics.some((topic) => !validateGrade3TopicConfig(topic))) issues.push("invalid-topic");

  return { isValid: issues.length === 0, issues };
}
