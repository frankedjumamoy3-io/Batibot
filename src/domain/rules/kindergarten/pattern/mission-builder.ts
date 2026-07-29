import {
  getKindergartenPatternTopicConfig,
} from "@/src/curriculum/kindergarten/pattern";
import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_PATTERN_PLAY_ACTION } from "./constants";
import type { KindergartenPatternMission } from "./types";

export function buildKindergartenPatternMission(
  topicTitle: string
): KindergartenPatternMission {
  return {
    prompt: "Build the pattern.",
    target: topicTitle,
  };
}

export const getKindergartenPatternPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_PATTERN_PLAY_ACTION);

export function getKindergartenPatternMissionPatternKey(topicTitle: string) {
  return getKindergartenPatternTopicConfig(topicTitle)?.patternKey;
}
