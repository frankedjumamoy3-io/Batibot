import { getGrade1FriendlyDistractors } from "./choice-utils";

export function validateGrade1Distractors(
  correctAnswer: string,
  distractorPool: string[]
) {
  return (
    Boolean(correctAnswer.trim()) &&
    getGrade1FriendlyDistractors(correctAnswer, distractorPool).length > 0
  );
}

export function validateGrade1TopicTitle(topicTitle: string) {
  return topicTitle.trim().length > 0;
}

export function validateGrade1StageIntegrity(topicTitle: string) {
  return validateGrade1TopicTitle(topicTitle);
}
