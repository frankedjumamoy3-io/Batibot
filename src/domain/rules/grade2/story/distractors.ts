import { getGrade2MissionDistractors } from "../shared";
import { buildStoryMission } from "./mission-builder";

export function getStoryDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildStoryMission(topicTitle));
}
