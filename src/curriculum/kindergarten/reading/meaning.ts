import { getKindergartenReadingMeaning as getReadingMeaning } from "./vocabulary";

export function getKindergartenReadingMeaning(topicTitle: string): string {
  return getReadingMeaning(topicTitle) ?? "Let's learn together.";
}
