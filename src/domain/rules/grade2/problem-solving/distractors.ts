import { getGrade2MissionDistractors } from "../shared";
import { buildProblemSolvingMission } from "./mission-builder";

export function getProblemSolvingDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildProblemSolvingMission(topicTitle));
}
