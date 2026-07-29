import { GRADE2_STORY_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildStoryMission } from "./mission-builder";

export function validateStoryMission(topicTitle: string) {
  return validateGrade2Mission(buildStoryMission(topicTitle));
}

export function validateStoryMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildStoryMission(topicTitle));
}

export function validateStoryWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_STORY_WORLD_CONFIG);
}
