import type { Grade3WorldRules, Grade3WorldRulesConfig } from "./types";
import { createGrade3WorldMissionBuilder } from "./mission-utils";
import {
  getGrade3MissionDistractors,
  validateGrade3Mission,
  validateGrade3MissionDetailed,
  validateGrade3WorldConfig,
} from "./validation-utils";

export function createGrade3WorldRules({
  getTopicConfig,
  worldConfig,
}: Grade3WorldRulesConfig): Grade3WorldRules {
  const buildMission = createGrade3WorldMissionBuilder(worldConfig.id, getTopicConfig);

  return {
    buildMission,
    getDistractors: (topicTitle) => getGrade3MissionDistractors(buildMission(topicTitle)),
    validateMission: (topicTitle) => validateGrade3Mission(buildMission(topicTitle)),
    validateMissionDetailed: (topicTitle) => validateGrade3MissionDetailed(buildMission(topicTitle)),
    validateWorld: () => validateGrade3WorldConfig(worldConfig),
  };
}
