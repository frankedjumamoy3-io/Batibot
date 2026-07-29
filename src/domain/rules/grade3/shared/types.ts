import type { Grade3WorldConfig, Grade3WorldTopicConfig } from "@/src/curriculum/grade3";

export type Grade3Mission = {
  action: string;
  assetId: string;
  choices: string[];
  correctAnswer: string;
  prompt: string;
  topicTitle: string;
  worldId: string;
};

export type Grade3MissionTopic = Grade3WorldTopicConfig;
export type Grade3TopicResolver = (topicTitle: string) => Grade3MissionTopic | undefined;

export type Grade3MissionValidationIssue =
  | "missing-mission"
  | "missing-topic-title"
  | "missing-world-id"
  | "missing-action"
  | "missing-semantic-asset-id"
  | "unsafe-asset-id"
  | "missing-correct-answer"
  | "correct-answer-not-visible"
  | "duplicate-equivalent-choice";

export type Grade3MissionValidationResult = {
  isValid: boolean;
  issues: Grade3MissionValidationIssue[];
};

export type Grade3WorldValidationIssue =
  | "missing-world-id"
  | "missing-world-title"
  | "missing-topic"
  | "duplicate-topic-id"
  | "invalid-topic";

export type Grade3WorldValidationResult = {
  isValid: boolean;
  issues: Grade3WorldValidationIssue[];
};

export type Grade3StageChoiceExpectation = {
  choices: string[];
  correctAnswer: string;
  expectedChoiceCount: 2 | 4;
};

export type Grade3WorldRulesConfig = {
  getTopicConfig: Grade3TopicResolver;
  worldConfig: Grade3WorldConfig;
};

export type Grade3WorldRules = {
  buildMission: (topicTitle: string) => Grade3Mission | null;
  getDistractors: (topicTitle: string) => string[];
  validateMission: (topicTitle: string) => boolean;
  validateMissionDetailed: (topicTitle: string) => Grade3MissionValidationResult;
  validateWorld: () => Grade3WorldValidationResult;
};
