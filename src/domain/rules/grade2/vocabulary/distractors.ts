import { getGrade2MissionDistractors } from "../shared";
import { buildVocabularyMission } from "./mission-builder";

export function getVocabularyDistractors(topicTitle: string) {
  return getGrade2MissionDistractors(buildVocabularyMission(topicTitle));
}
