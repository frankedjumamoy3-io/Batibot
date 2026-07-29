import {
  getKindergartenReadingLesson,
  KINDERGARTEN_READING_TARGETS,
} from "@/src/curriculum/kindergarten/reading";
import { normalizeKindergartenAnswer } from "@/src/domain/rules/kindergarten/shared";

export function normalizeKindergartenReadingAnswer(value: string) {
  return normalizeKindergartenAnswer(value);
}

export function getKindergartenReadingTargetLabel(topicLabel: string) {
  return (
    KINDERGARTEN_READING_TARGETS[
      normalizeKindergartenReadingAnswer(topicLabel)
    ] ?? topicLabel
  );
}

export function isKindergartenReadingTopic(topicTitle: string) {
  return Boolean(getKindergartenReadingLesson(topicTitle));
}

export function hasValidKindergartenReadingPronunciation(topicTitle: string) {
  const lesson = getKindergartenReadingLesson(topicTitle);

  return Boolean(lesson?.prompt && lesson.wordMatch.length);
}
