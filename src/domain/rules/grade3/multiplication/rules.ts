import {
  getGrade3MultiplicationTopicConfig,
  GRADE3_MULTIPLICATION_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3MultiplicationRules = createGrade3WorldRules({
  getTopicConfig: getGrade3MultiplicationTopicConfig,
  worldConfig: GRADE3_MULTIPLICATION_WORLD_CONFIG,
});
