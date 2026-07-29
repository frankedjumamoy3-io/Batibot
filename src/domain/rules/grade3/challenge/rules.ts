import {
  getGrade3ChallengeTopicConfig,
  GRADE3_CHALLENGE_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3ChallengeRules = createGrade3WorldRules({
  getTopicConfig: getGrade3ChallengeTopicConfig,
  worldConfig: GRADE3_CHALLENGE_WORLD_CONFIG,
});
