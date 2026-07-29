import { createKindergartenDistractorValidator } from "@/src/domain/rules/kindergarten/shared";
import {
  getKindergartenPatternSequence,
  getKindergartenPatternTopicConfig,
} from "@/src/curriculum/kindergarten/pattern";

import { KINDERGARTEN_PATTERN_DISTRACTORS } from "./constants";
import {
  isKindergartenPatternCorrectAnswer as isPatternCorrectAnswer,
} from "./pattern-utils";

export const validateKindergartenPatternDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_PATTERN_DISTRACTORS);

export function validateKindergartenPatternStageIntegrity(topicTitle: string) {
  const topic = getKindergartenPatternTopicConfig(topicTitle);
  const sequence = topic ? getKindergartenPatternSequence(topic.patternKey) : null;

  return Boolean(
    topic &&
      sequence &&
      sequence.choices.some((choice) =>
        isPatternCorrectAnswer(choice.id, sequence.answerId)
      )
  );
}
