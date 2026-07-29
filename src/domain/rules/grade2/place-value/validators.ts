import { GRADE2_PLACE_VALUE_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildPlaceValueMission } from "./mission-builder";

export function validatePlaceValueMission(topicTitle: string) {
  return validateGrade2Mission(buildPlaceValueMission(topicTitle));
}

export function validatePlaceValueMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildPlaceValueMission(topicTitle));
}

export function validatePlaceValueWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_PLACE_VALUE_WORLD_CONFIG);
}
