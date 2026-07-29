import {
  PATTERN_DESTINATION_LABEL,
  PATTERN_PLAY_PROMPT,
  PATTERN_SUCCESS_TEXT,
} from "./constants";
import { getPatternDistractorChoiceIds } from "./distractors";
import type { PreschoolPatternMissionInput, PreschoolPatternPlayMission } from "./types";

export function buildPreschoolPatternPlayMission({
  answerId,
  choiceIds,
}: PreschoolPatternMissionInput): PreschoolPatternPlayMission {
  return {
    destinationLabel: PATTERN_DESTINATION_LABEL,
    distractorChoiceIds: getPatternDistractorChoiceIds(choiceIds, answerId),
    prompt: PATTERN_PLAY_PROMPT,
    requiredChoiceId: answerId,
    successText: PATTERN_SUCCESS_TEXT,
  };
}

export const buildPatternMission = buildPreschoolPatternPlayMission;
