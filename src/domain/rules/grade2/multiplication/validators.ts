import { GRADE2_MULTIPLICATION_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildMultiplicationMission } from "./mission-builder";

export function validateMultiplicationMission(topicTitle: string) {
  return validateGrade2Mission(buildMultiplicationMission(topicTitle));
}

export function validateMultiplicationMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildMultiplicationMission(topicTitle));
}

export function validateMultiplicationWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_MULTIPLICATION_WORLD_CONFIG);
}
