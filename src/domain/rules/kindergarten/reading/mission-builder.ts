import {
  getKindergartenReadingMeaning,
  KINDERGARTEN_READING_TOPIC_ORDER,
} from "@/src/curriculum/kindergarten/reading";
import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_READING_PLAY_ACTION } from "./constants";
import type { KindergartenReadingWordOption } from "./types";

export function buildKindergartenReadingWordOptions(): KindergartenReadingWordOption[] {
  return KINDERGARTEN_READING_TOPIC_ORDER.map((title) => ({
    assetTopic: title,
    label: title,
    meaning: getKindergartenReadingMeaning(title),
    mission: `Put ${title} in the reading box.`,
  }));
}

export function buildKindergartenReadingMission(topicTitle: string) {
  return {
    prompt: `Put ${topicTitle} in the reading box.`,
    target: topicTitle,
  };
}

export const getKindergartenReadingPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_READING_PLAY_ACTION);
