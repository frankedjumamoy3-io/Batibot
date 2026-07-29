import {
  getGrade2VocabularyTopicConfig,
  GRADE2_VOCABULARY_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildVocabularyMission = createGrade2WorldMissionBuilder(
  GRADE2_VOCABULARY_WORLD_ID,
  getGrade2VocabularyTopicConfig
);
