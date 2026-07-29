import {
  getKindergartenPatternSequence,
  getKindergartenPatternTopicConfig,
  getKindergartenPatternTopicKey,
} from "@/src/curriculum/kindergarten/pattern";
import {
  isKindergartenNormalizedAnswerMatch,
  normalizeKindergartenAnswer,
} from "@/src/domain/rules/kindergarten/shared";

export function normalizeKindergartenPatternAnswer(value: string) {
  return normalizeKindergartenAnswer(value);
}

export function getKindergartenPatternSourceKey(topicTitle: string) {
  const topicKey = getKindergartenPatternTopicKey(topicTitle);

  if (topicKey === "abc-pattern") {
    return "kindergarten-numbers";
  }

  if (topicKey === "abb-pattern") {
    return "kindergarten-objects";
  }

  if (topicKey === "aab-pattern") {
    return "kindergarten-shapes";
  }

  return "kindergarten-colors";
}

export function getKindergartenPatternAnswerId(topicTitle: string) {
  const sourceKey =
    getKindergartenPatternTopicConfig(topicTitle)?.patternKey ??
    getKindergartenPatternSourceKey(topicTitle);

  return getKindergartenPatternSequence(sourceKey)?.answerId ?? "";
}

export function isKindergartenPatternCorrectAnswer(
  expected: string,
  actual: string
) {
  return isKindergartenNormalizedAnswerMatch(expected, actual);
}
