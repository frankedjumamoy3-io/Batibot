import {
  getGrade3NumberTopicConfig,
  GRADE3_NUMBER_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3NumberRules = createGrade3WorldRules({
  getTopicConfig: getGrade3NumberTopicConfig,
  worldConfig: GRADE3_NUMBER_WORLD_CONFIG,
});
