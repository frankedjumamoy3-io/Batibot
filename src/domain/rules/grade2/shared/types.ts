import type {
  Grade2WorldConfig,
  Grade2WorldTopicConfig,
} from "@/src/curriculum/grade2";

export type Grade2Mission = {
  action: string;
  assetId: string;
  choices: string[];
  correctAnswer: string;
  prompt: string;
  topicTitle: string;
  worldId: string;
};

export type Grade2MissionTopic = Grade2WorldTopicConfig;

export type Grade2TopicResolver = (
  topicTitle: string
) => Grade2MissionTopic | undefined;

export type Grade2MissionValidationIssue =
  | "missing-mission"
  | "missing-topic-title"
  | "missing-world-id"
  | "missing-action"
  | "missing-semantic-asset-id"
  | "unsafe-asset-id"
  | "missing-correct-answer"
  | "correct-answer-not-visible"
  | "duplicate-equivalent-choice";

export type Grade2MissionValidationResult = {
  isValid: boolean;
  issues: Grade2MissionValidationIssue[];
};

export type Grade2WorldValidationIssue =
  | "missing-world-id"
  | "missing-world-title"
  | "missing-topic"
  | "duplicate-topic-id"
  | "invalid-topic";

export type Grade2WorldValidationResult = {
  isValid: boolean;
  issues: Grade2WorldValidationIssue[];
};

export type Grade2StageChoiceExpectation = {
  choices: string[];
  correctAnswer: string;
  expectedChoiceCount: 2 | 4;
};

export type Grade2WorldRules = {
  buildMission: (topicTitle: string) => Grade2Mission | null;
  getDistractors: (topicTitle: string) => string[];
  validateMission: (topicTitle: string) => boolean;
  validateWorld: () => Grade2WorldValidationResult;
};

export type Grade2WorldRulesConfig = {
  getTopicConfig: Grade2TopicResolver;
  worldConfig: Grade2WorldConfig;
};
