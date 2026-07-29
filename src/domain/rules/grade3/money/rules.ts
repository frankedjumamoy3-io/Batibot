import {
  getGrade3MoneyTopicConfig,
  GRADE3_MONEY_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3MoneyRules = createGrade3WorldRules({
  getTopicConfig: getGrade3MoneyTopicConfig,
  worldConfig: GRADE3_MONEY_WORLD_CONFIG,
});
