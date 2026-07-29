import {
  getGrade2MultiplicationTopicConfig,
  GRADE2_MULTIPLICATION_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildMultiplicationMission = createGrade2WorldMissionBuilder(
  GRADE2_MULTIPLICATION_WORLD_ID,
  getGrade2MultiplicationTopicConfig
);
