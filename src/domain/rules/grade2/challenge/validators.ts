import { GRADE2_CHALLENGE_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildChallengeMission } from "./mission-builder";

export function validateChallengeMission(topicTitle: string) {
  return validateGrade2Mission(buildChallengeMission(topicTitle));
}

export function validateChallengeMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildChallengeMission(topicTitle));
}

export function validateChallengeWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_CHALLENGE_WORLD_CONFIG);
}
