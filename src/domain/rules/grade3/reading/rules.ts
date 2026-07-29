import {
  getGrade3ReadingTopicConfig,
  GRADE3_READING_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3ReadingRules = createGrade3WorldRules({
  getTopicConfig: getGrade3ReadingTopicConfig,
  worldConfig: GRADE3_READING_WORLD_CONFIG,
});
