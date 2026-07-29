import {
  getGrade2StoryTopicConfig,
  GRADE2_STORY_WORLD_ID,
} from "@/src/curriculum/grade2";
import { createGrade2WorldMissionBuilder } from "../shared";

export const buildStoryMission = createGrade2WorldMissionBuilder(
  GRADE2_STORY_WORLD_ID,
  getGrade2StoryTopicConfig
);
