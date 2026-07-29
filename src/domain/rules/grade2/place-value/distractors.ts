import { getGrade2MissionDistractors } from "../shared";
import { buildPlaceValueMission } from "./mission-builder";

export function getPlaceValueDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildPlaceValueMission(topicTitle));
}
