import type {
  Grade2Mission,
  Grade2MissionValidationIssue,
  Grade2MissionValidationResult,
  Grade2WorldValidationIssue,
  Grade2WorldValidationResult,
} from "./types";
import type { Grade2WorldConfig, Grade2WorldTopicConfig } from "@/src/curriculum/grade2";
import {
  getUniqueGrade2Choices,
  hasDuplicateEquivalentGrade2Choices,
  normalizeGrade2ChoiceLabel,
} from "./choice-utils";

export function isSafeGrade2SemanticAssetId(assetId: string) {
  return Boolean(assetId) && !/[\\/()]/.test(assetId) && !assetId.includes("require");
}

export function getGrade2MissionDistractors(mission: Grade2Mission | null) {
  if (!mission) {
    return [];
  }

  const normalizedCorrectAnswer = normalizeGrade2ChoiceLabel(
    mission.correctAnswer
  );

  return getUniqueGrade2Choices(mission.choices).filter(
    (choice) => normalizeGrade2ChoiceLabel(choice) !== normalizedCorrectAnswer
  );
}

export function validateGrade2MissionDetailed(
  mission: Grade2Mission | null
): Grade2MissionValidationResult {
  const issues: Grade2MissionValidationIssue[] = [];

  if (!mission) {
    return {
      isValid: false,
      issues: ["missing-mission"],
    };
  }

  if (!mission.topicTitle) {
    issues.push("missing-topic-title");
  }

  if (!mission.worldId) {
    issues.push("missing-world-id");
  }

  if (!mission.action) {
    issues.push("missing-action");
  }

  if (!mission.assetId) {
    issues.push("missing-semantic-asset-id");
  } else if (!isSafeGrade2SemanticAssetId(mission.assetId)) {
    issues.push("unsafe-asset-id");
  }

  if (!mission.correctAnswer) {
    issues.push("missing-correct-answer");
  }

  const normalizedCorrectAnswer = normalizeGrade2ChoiceLabel(
    mission.correctAnswer
  );
  const correctAnswerCount = mission.choices.filter(
    (choice) => normalizeGrade2ChoiceLabel(choice) === normalizedCorrectAnswer
  ).length;

  if (correctAnswerCount !== 1) {
    issues.push("correct-answer-not-visible");
  }

  if (hasDuplicateEquivalentGrade2Choices(mission.choices)) {
    issues.push("duplicate-equivalent-choice");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function validateGrade2Mission(mission: Grade2Mission | null) {
  return validateGrade2MissionDetailed(mission).isValid;
}

export function validateGrade2TopicConfig(topic: Grade2WorldTopicConfig) {
  return Boolean(
    topic.title &&
      topic.assetId &&
      isSafeGrade2SemanticAssetId(topic.assetId) &&
      topic.interactionTypes.length > 0
  );
}

export function validateGrade2WorldConfig(
  worldConfig: Grade2WorldConfig
): Grade2WorldValidationResult {
  const issues: Grade2WorldValidationIssue[] = [];
  const topicIds = worldConfig.topics.map((topic) =>
    normalizeGrade2ChoiceLabel(topic.title)
  );

  if (!worldConfig.id) {
    issues.push("missing-world-id");
  }

  if (!worldConfig.title) {
    issues.push("missing-world-title");
  }

  if (worldConfig.topics.length === 0) {
    issues.push("missing-topic");
  }

  if (new Set(topicIds).size !== topicIds.length) {
    issues.push("duplicate-topic-id");
  }

  if (worldConfig.topics.some((topic) => !validateGrade2TopicConfig(topic))) {
    issues.push("invalid-topic");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
