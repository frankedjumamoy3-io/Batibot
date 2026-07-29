import {
  getGrade2ChallengeTopicConfig,
  GRADE2_CHALLENGE_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildChallengeMission = createGrade2WorldMissionBuilder(
  GRADE2_CHALLENGE_WORLD_ID,
  getGrade2ChallengeTopicConfig
);
