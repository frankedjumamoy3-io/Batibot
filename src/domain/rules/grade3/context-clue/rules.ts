import {
  getGrade3ContextClueTopicConfig,
  GRADE3_CONTEXT_CLUE_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3ContextClueRules = createGrade3WorldRules({
  getTopicConfig: getGrade3ContextClueTopicConfig,
  worldConfig: GRADE3_CONTEXT_CLUE_WORLD_CONFIG,
});
