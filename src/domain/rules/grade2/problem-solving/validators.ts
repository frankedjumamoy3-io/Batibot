import { GRADE2_PROBLEM_SOLVING_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildProblemSolvingMission } from "./mission-builder";

export function validateProblemSolvingMission(topicTitle: string) {
  return validateGrade2Mission(buildProblemSolvingMission(topicTitle));
}

export function validateProblemSolvingMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildProblemSolvingMission(topicTitle));
}

export function validateProblemSolvingWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_PROBLEM_SOLVING_WORLD_CONFIG);
}
