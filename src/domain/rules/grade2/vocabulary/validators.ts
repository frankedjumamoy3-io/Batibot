import { GRADE2_VOCABULARY_WORLD_CONFIG } from "@/src/curriculum/grade2";
import {
  validateGrade2Mission,
  validateGrade2MissionDetailed,
  validateGrade2WorldConfig,
} from "../shared";
import { buildVocabularyMission } from "./mission-builder";

export function validateVocabularyMission(topicTitle: string) {
  return validateGrade2Mission(buildVocabularyMission(topicTitle));
}

export function validateVocabularyMissionDetailed(topicTitle: string) {
  return validateGrade2MissionDetailed(buildVocabularyMission(topicTitle));
}

export function validateVocabularyWorldConfig() {
  return validateGrade2WorldConfig(GRADE2_VOCABULARY_WORLD_CONFIG);
}
