import {
  getGrade3FractionTopicConfig,
  GRADE3_FRACTION_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3FractionRules = createGrade3WorldRules({
  getTopicConfig: getGrade3FractionTopicConfig,
  worldConfig: GRADE3_FRACTION_WORLD_CONFIG,
});
