import { getKindergartenReadingLesson } from "@/src/curriculum/kindergarten/reading";

export function validateKindergartenReadingSentence(sentence: string) {
  return sentence.trim().length > 0 && /[.!?]$/.test(sentence.trim());
}

export function validateKindergartenReadingChoices(topicTitle: string) {
  const lesson = getKindergartenReadingLesson(topicTitle);

  return Boolean(
    lesson &&
      lesson.pictureMatch.length >= 4 &&
      lesson.wordMatch.length >= 4 &&
      lesson.prompt
  );
}

export function isKindergartenReadingCorrectAnswer(
  expected: string,
  actual: string
) {
  return expected.trim().toLowerCase() === actual.trim().toLowerCase();
}
