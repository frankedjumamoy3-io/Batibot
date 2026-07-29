import { getKindergartenMathOptions } from "@/src/curriculum/kindergarten/math";
import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_MATH_PLAY_ACTION } from "./constants";

export function buildKindergartenMathOptions() {
  return getKindergartenMathOptions();
}

export function buildKindergartenMathMission(topicTitle: string) {
  return {
    prompt: `Solve ${topicTitle}.`,
    target: topicTitle,
  };
}

export const getKindergartenMathPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_MATH_PLAY_ACTION);
