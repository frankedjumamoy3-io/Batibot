import { getGrade2MissionDistractors } from "../shared";
import { buildChallengeMission } from "./mission-builder";

export function getChallengeDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildChallengeMission(topicTitle));
}
