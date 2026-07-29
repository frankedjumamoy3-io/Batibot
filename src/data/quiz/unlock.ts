import { CURRICULUM_QUIZ_LEVELS, QUIZ_PRESETS } from "@/src/data/quiz/presets";
import type {
  CurriculumQuizLevel,
  QuizCategory,
  QuizPreset,
  QuizType,
  SpecificWordProgressItem,
  UnlockRequirements,
} from "@/src/data/quiz/types";
import {
  VOCABULARY_ITEMS,
  getVocabularyItemByWord,
  isVocabularyItemViewed,
  type VocabularyCategory,
  type VocabularySubcategory,
} from "@/src/data/vocabulary";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";

export interface UnlockChecklistItem {
  id: string;
  label: string;
  current: number;
  required: number;
  complete: boolean;
  statusText: string;
}

export interface UnlockProgress {
  checklist: UnlockChecklistItem[];
  requiredWords: SpecificWordProgressItem[];
  completed: number;
  percentage: number;
  total: number;
}

export interface UnlockEvaluation extends UnlockProgress {
  eligible: boolean;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toTitle(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeWordKey(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatQuizTypeLabel(quizType: QuizType) {
  return quizType
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPercentageStatus(current: number, required: number) {
  return `${current}% / ${required}%`;
}

function clampRequirementProgress(current: number, required: number) {
  return Math.min(Math.max(current, 0), Math.max(required, 1));
}

function makeChecklistItem(
  id: string,
  label: string,
  current: number,
  required: number,
  statusText?: string
): UnlockChecklistItem {
  const safeRequired = Math.max(required, 1);
  const safeCurrent = clampRequirementProgress(current, safeRequired);

  return {
    id,
    label,
    current: safeCurrent,
    required: safeRequired,
    complete: current >= safeRequired,
    statusText: statusText ?? `${safeCurrent} / ${safeRequired}`,
  };
}

function makeBooleanChecklistItem(
  id: string,
  label: string,
  complete: boolean
): UnlockChecklistItem {
  return {
    id,
    label,
    current: complete ? 1 : 0,
    required: 1,
    complete,
    statusText: complete ? "Completed" : "Not completed",
  };
}

function getViewedWordIds(progress: LearnerProgressState) {
  return unique([...(progress.viewedWords ?? []), ...(progress.viewedWordIds ?? [])]);
}

export function getViewedWords(progress: LearnerProgressState) {
  return getViewedWordIds(progress);
}

export function getViewedSpecificWords(progress: LearnerProgressState) {
  const existing = unique((progress.viewedSpecificWords ?? []).map(normalizeWordKey));

  if (existing.length) {
    return existing;
  }

  return unique(
    getViewedWordIds(progress)
      .map((wordId) =>
        VOCABULARY_ITEMS.find((item) => item.id === wordId || item.legacyIds.includes(wordId))
      )
      .filter((item): item is (typeof VOCABULARY_ITEMS)[number] => !!item)
      .map((item) => normalizeWordKey(item.word))
  );
}

export function getCompletedQuizzes(progress: LearnerProgressState) {
  return unique([...(progress.completedQuizzes ?? []), ...(progress.completedQuizIds ?? [])]);
}

export function getCompletedLessons(progress: LearnerProgressState) {
  return unique(progress.completedLessons ?? []);
}

export function hasViewedSpecificWords(
  requiredWords: string[],
  progress: LearnerProgressState
) {
  const viewedWords = new Set(getViewedSpecificWords(progress));

  return unique(requiredWords.map(normalizeWordKey)).every((word) => viewedWords.has(word));
}

export function getSpecificWordViewProgress(
  requiredWords: string[],
  progress: LearnerProgressState
): SpecificWordProgressItem[] {
  const viewedWords = new Set(getViewedSpecificWords(progress));

  return unique(requiredWords.map((word) => word.trim()).filter(Boolean)).map((word) => {
    const viewed = viewedWords.has(normalizeWordKey(word));
    const vocabularyItem = getVocabularyItemByWord(word);

    return {
      id: `word-${normalizeWordKey(word).replace(/\s+/g, "-")}`,
      word,
      vocabularyItemId: vocabularyItem?.id,
      viewed,
      statusText: viewed ? "Viewed" : "Not viewed",
    };
  });
}

function getViewedLetterCounts(progress: LearnerProgressState) {
  if (progress.viewedLetters && Object.keys(progress.viewedLetters).length) {
    return progress.viewedLetters;
  }

  return getViewedSpecificWords(progress).reduce<Record<string, number>>((letters, word) => {
    const firstLetter = word.charAt(0).toUpperCase();

    if (firstLetter) {
      letters[firstLetter] = (letters[firstLetter] ?? 0) + 1;
    }

    return letters;
  }, {});
}

function getViewedVocabularySubcategoryCount(progress: LearnerProgressState) {
  const viewedWordIds = getViewedWordIds(progress);
  const viewedSubcategories = new Set(
    VOCABULARY_ITEMS.filter((item) => isVocabularyItemViewed(item, viewedWordIds)).map(
      (item) => item.subcategory
    )
  );

  return viewedSubcategories.size;
}

function getCategoryViewedCount(
  progress: LearnerProgressState,
  category: VocabularyCategory | VocabularySubcategory | string
) {
  const normalizedCategory = category.toLowerCase();
  const viewedWordIds = getViewedWordIds(progress);
  const wordsInCategory = VOCABULARY_ITEMS.filter(
    (item) =>
      item.category.toLowerCase() === normalizedCategory ||
      item.subcategory.toLowerCase() === normalizedCategory
  );
  const viewedCount = wordsInCategory.filter((item) =>
    isVocabularyItemViewed(item, viewedWordIds)
  ).length;

  return {
    viewedCount,
    total: wordsInCategory.length,
  };
}

function getCompletedQuizCountByCategory(
  progress: LearnerProgressState,
  category: QuizCategory
) {
  if (typeof progress.completedQuizCountByCategory?.[category] === "number") {
    return progress.completedQuizCountByCategory[category];
  }

  const completedQuizzes = getCompletedQuizzes(progress);
  return QUIZ_PRESETS.filter(
    (quiz) => quiz.category === category && completedQuizzes.includes(quiz.id)
  ).length;
}

function getCompletedQuizCountByLevel(progress: LearnerProgressState, level: number) {
  if (typeof progress.completedQuizCountByLevel?.[level] === "number") {
    return progress.completedQuizCountByLevel[level];
  }

  const completedQuizzes = getCompletedQuizzes(progress);
  return QUIZ_PRESETS.filter(
    (quiz) => quiz.curriculumLevel === level && completedQuizzes.includes(quiz.id)
  ).length;
}

function getCompletedQuizCountByType(progress: LearnerProgressState, quizType: QuizType) {
  const completedQuizzes = getCompletedQuizzes(progress);
  return QUIZ_PRESETS.filter(
    (quiz) => quiz.quizType === quizType && completedQuizzes.includes(quiz.id)
  ).length;
}

function getAverageScoreForLevel(progress: LearnerProgressState, level: number) {
  const scoreRecords = QUIZ_PRESETS.filter(
    (quiz) => quiz.curriculumLevel === level && progress.quizScores?.[quiz.id]
  ).map((quiz) => progress.quizScores[quiz.id]?.bestPercentage ?? 0);

  if (!scoreRecords.length) {
    return 0;
  }

  return Math.round(
    scoreRecords.reduce((total, percentage) => total + percentage, 0) /
      scoreRecords.length
  );
}

function getAverageScoreByCategory(progress: LearnerProgressState, category: QuizCategory) {
  const scoreRecords = QUIZ_PRESETS.filter(
    (quiz) => quiz.category === category && progress.quizScores?.[quiz.id]
  ).map((quiz) => progress.quizScores[quiz.id]?.bestPercentage ?? 0);

  if (!scoreRecords.length) {
    return 0;
  }

  return Math.round(
    scoreRecords.reduce((total, percentage) => total + percentage, 0) /
      scoreRecords.length
  );
}

function getAverageScoreByType(progress: LearnerProgressState, quizType: QuizType) {
  const scoreRecords = QUIZ_PRESETS.filter(
    (quiz) => quiz.quizType === quizType && progress.quizScores?.[quiz.id]
  ).map((quiz) => progress.quizScores[quiz.id]?.bestPercentage ?? 0);

  if (!scoreRecords.length) {
    return 0;
  }

  return Math.round(
    scoreRecords.reduce((total, percentage) => total + percentage, 0) /
      scoreRecords.length
  );
}

function getBestScoreByType(progress: LearnerProgressState, quizType: QuizType) {
  const scoreRecords = QUIZ_PRESETS.filter(
    (quiz) => quiz.quizType === quizType && progress.quizScores?.[quiz.id]
  ).map((quiz) => progress.quizScores[quiz.id]?.bestPercentage ?? 0);

  return scoreRecords.length ? Math.max(...scoreRecords) : 0;
}

function getOverallAverageScore(progress: LearnerProgressState) {
  const scores = Object.values(progress.quizScores ?? {});

  if (!scores.length) {
    return 0;
  }

  return Math.round(
    scores.reduce((total, score) => total + score.bestPercentage, 0) / scores.length
  );
}

function getOverallMastery(progress: LearnerProgressState) {
  const categoryMastery = [
    progress.masteryByCategory.numeric ?? 0,
    progress.masteryByCategory.linguistic ?? 0,
    progress.masteryByCategory.mixed ?? 0,
  ];

  return Math.round(
    categoryMastery.reduce((total, value) => total + value, 0) / categoryMastery.length
  );
}

function getQuizTitle(quizId: string) {
  return QUIZ_PRESETS.find((quiz) => quiz.id === quizId)?.title ?? toTitle(quizId);
}

function hasFullQuizAccess(progress: LearnerProgressState) {
  return progress.unlockAllQuizzes;
}

export function evaluateUnlockRequirements(
  requirements: UnlockRequirements | undefined,
  progress: LearnerProgressState
): UnlockEvaluation {
  const resolvedRequirements = requirements ?? {};
  const completedQuizzes = getCompletedQuizzes(progress);
  const completedLessons = getCompletedLessons(progress);
  const viewedWords = getViewedWordIds(progress);
  const viewedLetters = getViewedLetterCounts(progress);
  const checklist: UnlockChecklistItem[] = [];
  const requiredWords = getSpecificWordViewProgress(
    resolvedRequirements.requiredViewedSpecificWords ?? [],
    progress
  );

  if (resolvedRequirements.requiredLevel) {
    checklist.push(
      makeChecklistItem(
        "required-level",
        `Reach Level ${resolvedRequirements.requiredLevel}`,
        progress.currentLevel,
        resolvedRequirements.requiredLevel,
        `Current Level ${progress.currentLevel} / Required Level ${resolvedRequirements.requiredLevel}`
      )
    );
  }

  if (resolvedRequirements.requiredUnlockedLevels?.length) {
    const unlockedCount = resolvedRequirements.requiredUnlockedLevels.filter((level) =>
      progress.unlockedLevels.includes(level)
    ).length;

    checklist.push(
      makeChecklistItem(
        "required-unlocked-levels",
        `Unlock levels ${resolvedRequirements.requiredUnlockedLevels.join(", ")}`,
        unlockedCount,
        resolvedRequirements.requiredUnlockedLevels.length,
        `${unlockedCount} / ${resolvedRequirements.requiredUnlockedLevels.length} levels unlocked`
      )
    );
  }

  if (resolvedRequirements.requiredViewedWords) {
    checklist.push(
      makeChecklistItem(
        "required-viewed-words",
        `View ${resolvedRequirements.requiredViewedWords} vocabulary words`,
        viewedWords.length,
        resolvedRequirements.requiredViewedWords,
        `${viewedWords.length} / ${resolvedRequirements.requiredViewedWords} words viewed`
      )
    );
  }

  if (resolvedRequirements.requiredViewedWordIds?.length) {
    const viewedCount = resolvedRequirements.requiredViewedWordIds.filter((wordId) =>
      viewedWords.includes(wordId)
    ).length;

    checklist.push(
      makeChecklistItem(
        "required-viewed-word-ids",
        `View ${resolvedRequirements.requiredViewedWordIds.length} exact vocabulary cards`,
        viewedCount,
        resolvedRequirements.requiredViewedWordIds.length,
        `${viewedCount} / ${resolvedRequirements.requiredViewedWordIds.length} cards viewed`
      )
    );
  }

  if (resolvedRequirements.requiredDistinctViewedLetters) {
    const currentCount = Object.keys(viewedLetters).length;
    checklist.push(
      makeChecklistItem(
        "required-distinct-letters",
        `View words from ${resolvedRequirements.requiredDistinctViewedLetters} different starting letters`,
        currentCount,
        resolvedRequirements.requiredDistinctViewedLetters,
        `${currentCount} / ${resolvedRequirements.requiredDistinctViewedLetters} letters viewed`
      )
    );
  }

  Object.entries(resolvedRequirements.requiredViewedLetters ?? {}).forEach(
    ([letter, requiredCount]) => {
      if (!requiredCount) {
        return;
      }

      const normalizedLetter = letter.toUpperCase();
      const currentCount = viewedLetters[normalizedLetter] ?? 0;

      checklist.push(
        makeChecklistItem(
          `required-letter-${normalizedLetter}`,
          `View ${requiredCount} words starting with ${normalizedLetter}`,
          currentCount,
          requiredCount,
          `${currentCount} / ${requiredCount} words`
        )
      );
    }
  );

  if (resolvedRequirements.requiredViewedCategoryCount) {
    const currentCount = getViewedVocabularySubcategoryCount(progress);

    checklist.push(
      makeChecklistItem(
        "required-viewed-category-count",
        `Explore words from ${resolvedRequirements.requiredViewedCategoryCount} vocabulary groups`,
        currentCount,
        resolvedRequirements.requiredViewedCategoryCount,
        `${currentCount} / ${resolvedRequirements.requiredViewedCategoryCount} groups explored`
      )
    );
  }

  Object.entries(resolvedRequirements.requiredViewedCategories ?? {}).forEach(
    ([category, requiredCount]) => {
      if (!requiredCount) {
        return;
      }

      const { viewedCount, total } = getCategoryViewedCount(progress, category);
      const resolvedRequired =
        requiredCount === Number.POSITIVE_INFINITY ? total : requiredCount;

      checklist.push(
        makeChecklistItem(
          `required-viewed-category-${category}`,
          `View ${resolvedRequired} ${toTitle(category)} words`,
          viewedCount,
          resolvedRequired,
          `${viewedCount} / ${resolvedRequired} words viewed`
        )
      );
    }
  );

  resolvedRequirements.requiredCompletedLessons?.forEach((lessonId) => {
    checklist.push(
      makeBooleanChecklistItem(
        `required-lesson-${lessonId}`,
        `Complete lesson: ${toTitle(lessonId)}`,
        completedLessons.includes(lessonId)
      )
    );
  });

  if (resolvedRequirements.requiredCompletedQuizCount) {
    checklist.push(
      makeChecklistItem(
        "required-completed-quiz-count",
        `Complete ${resolvedRequirements.requiredCompletedQuizCount} quizzes`,
        completedQuizzes.length,
        resolvedRequirements.requiredCompletedQuizCount,
        `${completedQuizzes.length} / ${resolvedRequirements.requiredCompletedQuizCount} quizzes completed`
      )
    );
  }

  const requiredQuizIds = unique([
    ...(resolvedRequirements.requiredCompletedQuizzes ?? []),
    ...(resolvedRequirements.requiredCompletedQuizIds ?? []),
  ]);

  requiredQuizIds.forEach((quizId) => {
    checklist.push(
      makeBooleanChecklistItem(
        `required-quiz-${quizId}`,
        `Complete ${getQuizTitle(quizId)}`,
        completedQuizzes.includes(quizId)
      )
    );
  });

  Object.entries(resolvedRequirements.requiredCompletedQuizCountByLevel ?? {}).forEach(
    ([level, requiredCount]) => {
      if (!requiredCount) {
        return;
      }

      const numericLevel = Number(level);
      const currentCount = getCompletedQuizCountByLevel(progress, numericLevel);

      checklist.push(
        makeChecklistItem(
          `required-level-${level}-quiz-count`,
          `Complete ${requiredCount} Level ${level} quizzes`,
          currentCount,
          requiredCount,
          `${currentCount} / ${requiredCount} quizzes completed`
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredCompletedQuizCountByCategory ?? {}).forEach(
    ([category, requiredCount]) => {
      if (!requiredCount) {
        return;
      }

      const currentCount = getCompletedQuizCountByCategory(progress, category as QuizCategory);

      checklist.push(
        makeChecklistItem(
          `required-${category}-quiz-count`,
          `Complete ${requiredCount} ${toTitle(category)} quizzes`,
          currentCount,
          requiredCount,
          `${currentCount} / ${requiredCount} quizzes completed`
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredCompletedQuizCountByType ?? {}).forEach(
    ([quizType, requiredCount]) => {
      if (!requiredCount) {
        return;
      }

      const currentCount = getCompletedQuizCountByType(progress, quizType as QuizType);

      checklist.push(
        makeChecklistItem(
          `required-type-${quizType}-quiz-count`,
          `Complete ${requiredCount} ${formatQuizTypeLabel(quizType as QuizType)} quiz${requiredCount === 1 ? "" : "es"}`,
          currentCount,
          requiredCount,
          `${currentCount} / ${requiredCount} quizzes completed`
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredMinimumScores ?? {}).forEach(
    ([quizId, requiredScore]) => {
      const currentScore = progress.quizScores[quizId]?.bestPercentage ?? 0;

      checklist.push(
        makeChecklistItem(
          `required-score-${quizId}`,
          `Score ${requiredScore}% in ${getQuizTitle(quizId)}`,
          currentScore,
          requiredScore,
          formatPercentageStatus(currentScore, requiredScore)
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredQuizTypeMinimumScores ?? {}).forEach(
    ([quizType, requiredScore]) => {
      if (!requiredScore) {
        return;
      }

      const currentScore = getBestScoreByType(progress, quizType as QuizType);

      checklist.push(
        makeChecklistItem(
          `required-type-score-${quizType}`,
          `Reach ${requiredScore}% in any ${formatQuizTypeLabel(quizType as QuizType)} quiz`,
          currentScore,
          requiredScore,
          formatPercentageStatus(currentScore, requiredScore)
        )
      );
    }
  );

  if (resolvedRequirements.requiredAverageScore) {
    const averageScore = getOverallAverageScore(progress);

    checklist.push(
      makeChecklistItem(
        "required-average-score",
        `Maintain ${resolvedRequirements.requiredAverageScore}% average score`,
        averageScore,
        resolvedRequirements.requiredAverageScore,
        formatPercentageStatus(averageScore, resolvedRequirements.requiredAverageScore)
      )
    );
  }

  Object.entries(resolvedRequirements.requiredAverageScoreByLevel ?? {}).forEach(
    ([level, requiredScore]) => {
      if (!requiredScore) {
        return;
      }

      const averageScore = getAverageScoreForLevel(progress, Number(level));

      checklist.push(
        makeChecklistItem(
          `required-level-${level}-average-score`,
          `Maintain ${requiredScore}% average in Level ${level} quizzes`,
          averageScore,
          requiredScore,
          formatPercentageStatus(averageScore, requiredScore)
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredAverageScoreByCategory ?? {}).forEach(
    ([category, requiredScore]) => {
      if (!requiredScore) {
        return;
      }

      const averageScore = getAverageScoreByCategory(progress, category as QuizCategory);

      checklist.push(
        makeChecklistItem(
          `required-category-${category}-average-score`,
          `Maintain ${requiredScore}% average in ${toTitle(category)} quizzes`,
          averageScore,
          requiredScore,
          formatPercentageStatus(averageScore, requiredScore)
        )
      );
    }
  );

  Object.entries(resolvedRequirements.requiredAverageScoreByType ?? {}).forEach(
    ([quizType, requiredScore]) => {
      if (!requiredScore) {
        return;
      }

      const averageScore = getAverageScoreByType(progress, quizType as QuizType);

      checklist.push(
        makeChecklistItem(
          `required-type-${quizType}-average-score`,
          `Maintain ${requiredScore}% average in ${formatQuizTypeLabel(quizType as QuizType)} quizzes`,
          averageScore,
          requiredScore,
          formatPercentageStatus(averageScore, requiredScore)
        )
      );
    }
  );

  if (resolvedRequirements.requiredMasteryPercentage) {
    const mastery = Math.max(
      progress.masteryByCategory.numeric,
      progress.masteryByCategory.linguistic,
      progress.masteryByCategory.mixed
    );

    checklist.push(
      makeChecklistItem(
        "required-mastery",
        `Reach ${resolvedRequirements.requiredMasteryPercentage}% mastery`,
        mastery,
        resolvedRequirements.requiredMasteryPercentage,
        formatPercentageStatus(mastery, resolvedRequirements.requiredMasteryPercentage)
      )
    );
  }

  Object.entries(resolvedRequirements.requiredMasteryByCategory ?? {}).forEach(
    ([category, requiredMastery]) => {
      if (!requiredMastery) {
        return;
      }

      const currentMastery = progress.masteryByCategory[category as QuizCategory] ?? 0;

      checklist.push(
        makeChecklistItem(
          `required-${category}-mastery`,
          `Reach ${requiredMastery}% ${toTitle(category)} mastery`,
          currentMastery,
          requiredMastery,
          formatPercentageStatus(currentMastery, requiredMastery)
        )
      );
    }
  );

  if (resolvedRequirements.requiredOverallMastery) {
    const overallMastery = getOverallMastery(progress);

    checklist.push(
      makeChecklistItem(
        "required-overall-mastery",
        `Reach ${resolvedRequirements.requiredOverallMastery}% overall mastery`,
        overallMastery,
        resolvedRequirements.requiredOverallMastery,
        formatPercentageStatus(overallMastery, resolvedRequirements.requiredOverallMastery)
      )
    );
  }

  resolvedRequirements.requiredBadges?.forEach((badgeId) => {
    checklist.push(
      makeBooleanChecklistItem(
        `required-badge-${badgeId}`,
        `Unlock badge: ${toTitle(badgeId)}`,
        progress.badges.includes(badgeId)
      )
    );
  });

  if (resolvedRequirements.requiredBadgeCount) {
    checklist.push(
      makeChecklistItem(
        "required-badge-count",
        `Earn ${resolvedRequirements.requiredBadgeCount} badges`,
        progress.badges.length,
        resolvedRequirements.requiredBadgeCount,
        `${progress.badges.length} / ${resolvedRequirements.requiredBadgeCount} badges earned`
      )
    );
  }

  resolvedRequirements.requiredAchievements?.forEach((achievementId) => {
    checklist.push(
      makeBooleanChecklistItem(
        `required-achievement-${achievementId}`,
        `Unlock achievement: ${toTitle(achievementId)}`,
        progress.achievements.includes(achievementId)
      )
    );
  });

  if (resolvedRequirements.requiredPerfectQuizCount) {
    checklist.push(
      makeChecklistItem(
        "required-perfect-quiz-count",
        `Earn ${resolvedRequirements.requiredPerfectQuizCount} perfect quiz score${resolvedRequirements.requiredPerfectQuizCount === 1 ? "" : "s"}`,
        progress.perfectQuizIds.length,
        resolvedRequirements.requiredPerfectQuizCount,
        `${progress.perfectQuizIds.length} / ${resolvedRequirements.requiredPerfectQuizCount} perfect scores`
      )
    );
  }

  if (resolvedRequirements.requiredCorrectAnswersTotal) {
    checklist.push(
      makeChecklistItem(
        "required-correct-answers",
        `Answer ${resolvedRequirements.requiredCorrectAnswersTotal} questions correctly`,
        progress.correctAnswersTotal,
        resolvedRequirements.requiredCorrectAnswersTotal,
        `${progress.correctAnswersTotal} / ${resolvedRequirements.requiredCorrectAnswersTotal} correct answers`
      )
    );
  }

  if (resolvedRequirements.requiredStreakDays) {
    checklist.push(
      makeChecklistItem(
        "required-streak",
        `Build a ${resolvedRequirements.requiredStreakDays}-day learning streak`,
        progress.streakDays,
        resolvedRequirements.requiredStreakDays,
        `${progress.streakDays} / ${resolvedRequirements.requiredStreakDays} days`
      )
    );
  }

  const completed =
    requiredWords.filter((word) => word.viewed).length +
    checklist.filter((item) => item.complete).length;
  const total = requiredWords.length + checklist.length;

  return {
    requiredWords,
    checklist,
    completed,
    eligible: total === 0 || completed === total,
    percentage: total ? Math.round((completed / total) * 100) : 100,
    total,
  };
}

export function getRequirementChecklist(
  quiz: QuizPreset,
  progress: LearnerProgressState
) {
  return evaluateQuizRequirements(quiz, progress).checklist;
}

export function evaluateQuizRequirements(
  quiz: QuizPreset,
  progress: LearnerProgressState
) {
  return evaluateUnlockRequirements(quiz.unlockRequirements, progress);
}

export function evaluateLevelRequirements(
  level: CurriculumQuizLevel,
  progress: LearnerProgressState
) {
  return evaluateUnlockRequirements(level.unlockRequirements, progress);
}

export function getUnlockProgress(
  quiz: QuizPreset,
  progress: LearnerProgressState
): UnlockProgress {
  const evaluation = evaluateQuizRequirements(quiz, progress);
  const forceUnlocked = hasFullQuizAccess(progress);

  return {
    checklist: evaluation.checklist,
    requiredWords: evaluation.requiredWords,
    completed: forceUnlocked ? evaluation.total : evaluation.completed,
    percentage: forceUnlocked ? 100 : evaluation.percentage,
    total: evaluation.total,
  };
}

export function getLevelUnlockProgress(
  level: CurriculumQuizLevel,
  progress: LearnerProgressState
): UnlockProgress {
  const evaluation = evaluateLevelRequirements(level, progress);
  const forceUnlocked = hasFullQuizAccess(progress);

  return {
    checklist: evaluation.checklist,
    requiredWords: evaluation.requiredWords,
    completed: forceUnlocked ? evaluation.total : evaluation.completed,
    percentage: forceUnlocked ? 100 : evaluation.percentage,
    total: evaluation.total,
  };
}

export function isQuizUnlocked(quiz: QuizPreset, progress: LearnerProgressState) {
  if (hasFullQuizAccess(progress)) {
    return true;
  }

  if (quiz.curriculumLevel === 1 && !quiz.unlockRequirements) {
    return true;
  }

  return evaluateQuizRequirements(quiz, progress).eligible;
}

export function isLevelUnlocked(level: CurriculumQuizLevel, progress: LearnerProgressState) {
  if (hasFullQuizAccess(progress)) {
    return true;
  }

  if (level.id === 1) {
    return true;
  }

  return evaluateLevelRequirements(level, progress).eligible;
}

export function unlockEligibleLevels(
  progress: LearnerProgressState,
  levels: CurriculumQuizLevel[] = CURRICULUM_QUIZ_LEVELS
) {
  if (hasFullQuizAccess(progress)) {
    return levels.map((level) => level.id).sort((left, right) => left - right);
  }

  const unlockedLevels = new Set<number>([1]);
  const sortedLevels = [...levels].sort((left, right) => left.id - right.id);
  let workingProgress: LearnerProgressState = {
    ...progress,
    currentLevel: Math.max(progress.currentLevel, ...Array.from(unlockedLevels)),
    unlockedLevels: Array.from(unlockedLevels).sort((left, right) => left - right),
  };

  sortedLevels.forEach((level) => {
    if (level.id === 1 || unlockedLevels.has(level.id)) {
      return;
    }

    const eligible = evaluateLevelRequirements(level, workingProgress).eligible;

    if (!eligible) {
      return;
    }

    unlockedLevels.add(level.id);
    const nextUnlockedLevels = Array.from(unlockedLevels).sort((left, right) => left - right);

    workingProgress = {
      ...workingProgress,
      unlockedLevels: nextUnlockedLevels,
      currentLevel: nextUnlockedLevels.at(-1) ?? 1,
    };
  });

  return Array.from(unlockedLevels).sort((left, right) => left - right);
}

export function unlockEligibleQuizzes(
  progress: LearnerProgressState,
  quizPresets: QuizPreset[] = QUIZ_PRESETS
) {
  if (hasFullQuizAccess(progress)) {
    return quizPresets.map((quiz) => quiz.id);
  }

  return quizPresets.filter((quiz) => isQuizUnlocked(quiz, progress)).map((quiz) => quiz.id);
}

export function getUnlockedQuizIds(progress: LearnerProgressState) {
  return unlockEligibleQuizzes(progress);
}

export function checkLevelUnlocks(progress: LearnerProgressState) {
  const unlockedLevels = unlockEligibleLevels(progress);

  return {
    currentLevel: unlockedLevels.at(-1) ?? 1,
    unlockedLevels,
  };
}

export function calculateMasteryByCategory(progress: LearnerProgressState) {
  return (["numeric", "linguistic", "mixed"] as QuizCategory[]).reduce(
    (mastery, category) => {
      mastery[category] = getAverageScoreByCategory(progress, category);
      return mastery;
    },
    { numeric: 0, linguistic: 0, mixed: 0 } as Record<QuizCategory, number>
  );
}

export function getQuizzesByLevel(level: number) {
  return QUIZ_PRESETS.filter((quiz) => quiz.curriculumLevel === level);
}

export function getQuizzesByCategory(category: QuizCategory | "all") {
  return category === "all"
    ? QUIZ_PRESETS
    : QUIZ_PRESETS.filter((quiz) => quiz.category === category);
}

export function getLevelTitle(levelId: number) {
  return CURRICULUM_QUIZ_LEVELS.find((level) => level.id === levelId)?.title;
}

export function getLevelDefinition(levelId: number) {
  return CURRICULUM_QUIZ_LEVELS.find((level) => level.id === levelId);
}

export function getQuizById(quizId: string) {
  return QUIZ_PRESETS.find((quiz) => quiz.id === quizId);
}
