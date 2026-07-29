import {
  getGrade3DivisionTopicConfig,
  GRADE3_DIVISION_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3DivisionRules = createGrade3WorldRules({
  getTopicConfig: getGrade3DivisionTopicConfig,
  worldConfig: GRADE3_DIVISION_WORLD_CONFIG,
});
