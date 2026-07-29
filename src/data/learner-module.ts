import { getCurriculumForGrade } from "@/src/data/curriculum/learning-path";
import { QUIZ_PRESETS } from "@/src/data/quiz";
import type { QuizPreset } from "@/src/data/quiz/types";
import { LEARNING_WORLD_VOCABULARY_ITEMS } from "@/src/data/vocabulary/learning-worlds";
import type {
  VocabularyCategory,
  VocabularyItem,
} from "@/src/data/vocabulary/types";
import type { LearnerGradeLevel } from "@/src/types/user";

const DEFAULT_GRADE: LearnerGradeLevel = "Preschool";

const GRADE_QUIZ_LEVEL_RANGES: Record<
  LearnerGradeLevel,
  { min: number; max: number }
> = {
  Preschool: { min: 1, max: 3 },
  Kindergarten: { min: 2, max: 5 },
  "Grade 1": { min: 5, max: 8 },
  "Grade 2": { min: 8, max: 11 },
  "Grade 3": { min: 12, max: 15 },
};

const GRADE_CHALLENGE_SECONDS: Record<LearnerGradeLevel, number> = {
  Preschool: 20,
  Kindergarten: 20,
  "Grade 1": 15,
  "Grade 2": 15,
  "Grade 3": 15,
};

export function resolveLearnerGrade(
  gradeLevel?: LearnerGradeLevel | null
): LearnerGradeLevel {
  return gradeLevel ?? DEFAULT_GRADE;
}

export function getLearnerQuizLevelRange(
  gradeLevel?: LearnerGradeLevel | null
) {
  return GRADE_QUIZ_LEVEL_RANGES[resolveLearnerGrade(gradeLevel)];
}

export function isQuizVisibleForGrade(
  quiz: QuizPreset,
  gradeLevel?: LearnerGradeLevel | null
) {
  const resolvedGrade = resolveLearnerGrade(gradeLevel);

  if (quiz.learnerLevel) {
    return quiz.learnerLevel === resolvedGrade;
  }

  const range = GRADE_QUIZ_LEVEL_RANGES[resolvedGrade];

  return quiz.curriculumLevel >= range.min && quiz.curriculumLevel <= range.max;
}

export function getGradeQuizPresets(
  gradeLevel?: LearnerGradeLevel | null,
  presets: QuizPreset[] = QUIZ_PRESETS
) {
  const visible = presets.filter((quiz) => isQuizVisibleForGrade(quiz, gradeLevel));

  return visible.length ? visible : presets.filter((quiz) => quiz.curriculumLevel === 1);
}

export function getGradeVocabularyItems(
  gradeLevel?: LearnerGradeLevel | null
): VocabularyItem[] {
  const grade = resolveLearnerGrade(gradeLevel);
  const prefix = `${grade} - `;

  return LEARNING_WORLD_VOCABULARY_ITEMS.filter((item) =>
    item.curriculumBand?.startsWith(prefix)
  );
}

export function getGradeVocabularyItemByWord({
  category,
  gradeLevel,
  word,
}: {
  category?: VocabularyCategory;
  gradeLevel?: LearnerGradeLevel | null;
  word?: string;
}) {
  const normalizedWord = word?.trim().toLowerCase().replace(/\s+/g, " ");

  if (!normalizedWord) {
    return undefined;
  }

  return getGradeVocabularyItems(gradeLevel).find((item) => {
    const matchesWord =
      item.word.trim().toLowerCase().replace(/\s+/g, " ") === normalizedWord;

    return matchesWord && (!category || item.category === category);
  });
}

export function getLearnerModuleSummary(
  gradeLevel?: LearnerGradeLevel | null
) {
  const grade = resolveLearnerGrade(gradeLevel);
  const curriculum = getCurriculumForGrade(grade);
  const vocabularyItems = getGradeVocabularyItems(grade);
  const quizPresets = getGradeQuizPresets(grade);

  return {
    curriculum,
    gradeLevel: grade,
    quizPresets,
    totalActivities: vocabularyItems.length + quizPresets.length,
    totalQuizQuestions: quizPresets.reduce(
      (total, quiz) => total + quiz.questions.length,
      0
    ),
    totalQuizSets: quizPresets.length,
    vocabularyItems,
    vocabularyCount: vocabularyItems.length,
    worldCount: curriculum.worlds.length,
  };
}

export function getChallengeTimeLimitForGrade(
  gradeLevel?: LearnerGradeLevel | null
) {
  return GRADE_CHALLENGE_SECONDS[resolveLearnerGrade(gradeLevel)];
}
