import { getGrade2MissionDistractors } from "../shared";
import { buildMeasurementMission } from "./mission-builder";

export function getMeasurementDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildMeasurementMission(topicTitle));
}
