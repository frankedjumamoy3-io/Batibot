import {
  getGrade2MeasurementTopicConfig,
  GRADE2_MEASUREMENT_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildMeasurementMission = createGrade2WorldMissionBuilder(
  GRADE2_MEASUREMENT_WORLD_ID,
  getGrade2MeasurementTopicConfig
);
