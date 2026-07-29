import { normalizeKindergartenAnswer } from "@/src/domain/rules/kindergarten/shared";

export function normalizeKindergartenMathAnswer(value: string) {
  return normalizeKindergartenAnswer(value);
}

export function getKindergartenMathTargetLabel(topicTitle: string) {
  const topicKey = normalizeKindergartenMathAnswer(topicTitle).replace(
    /[^a-z0-9]+/g,
    "-"
  );
  const targetByTopic: Record<string, string> = {
    "before-and-after-numbers": "Before and After",
    "number-adventure-challenge": "Number Adventure",
  };

  return targetByTopic[topicKey] ?? topicTitle;
}
