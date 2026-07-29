import {
  getGrade2ProblemSolvingTopicConfig,
  GRADE2_PROBLEM_SOLVING_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildProblemSolvingMission = createGrade2WorldMissionBuilder(
  GRADE2_PROBLEM_SOLVING_WORLD_ID,
  getGrade2ProblemSolvingTopicConfig
);
