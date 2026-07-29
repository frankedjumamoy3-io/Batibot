import { GRADE2_MEASUREMENT_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildMeasurementMission } from "./mission-builder";

export function validateMeasurementMission(topicTitle: string) {
  return validateGrade2Mission(buildMeasurementMission(topicTitle));
}

export function validateMeasurementMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildMeasurementMission(topicTitle));
}

export function validateMeasurementWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_MEASUREMENT_WORLD_CONFIG);
}
