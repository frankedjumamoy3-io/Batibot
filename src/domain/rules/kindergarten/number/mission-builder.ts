import {
  getKindergartenNumberForestOptions,
} from "@/src/curriculum/kindergarten/number";

export function buildKindergartenNumberForestOptions() {
  return getKindergartenNumberForestOptions();
}

export function buildKindergartenNumberMission(topicTitle: string) {
  return {
    prompt: `Place ${topicTitle} on the number trail.`,
    target: topicTitle,
  };
}
