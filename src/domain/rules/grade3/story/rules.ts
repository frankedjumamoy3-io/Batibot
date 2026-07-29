import {
  getGrade3StoryTopicConfig,
  GRADE3_STORY_WORLD_CONFIG,
} from "@/src/curriculum/grade3";
import { createGrade3WorldRules } from "../shared";

export const grade3StoryRules = createGrade3WorldRules({
  getTopicConfig: getGrade3StoryTopicConfig,
  worldConfig: GRADE3_STORY_WORLD_CONFIG,
});
