import { getGrade2MissionDistractors } from "../shared";
import { buildMultiplicationMission } from "./mission-builder";

export function getMultiplicationDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildMultiplicationMission(topicTitle));
}
