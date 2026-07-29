import {
  getGrade2PlaceValueTopicConfig,
  GRADE2_PLACE_VALUE_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildPlaceValueMission = createGrade2WorldMissionBuilder(
  GRADE2_PLACE_VALUE_WORLD_ID,
  getGrade2PlaceValueTopicConfig
);
