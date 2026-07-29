import { getKindergartenNumberMeaning } from "./numbers";

export function getKindergartenNumberMeaningByTopic(topicTitle: string): string {
  const value = Number(topicTitle.match(/\d+/)?.[0]);

  return Number.isFinite(value)
    ? getKindergartenNumberMeaning(value)
    : "Let's learn together.";
}
