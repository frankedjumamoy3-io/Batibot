import {
  ACTIVE_LEARNING_PHASES,
  CURRICULUM,
} from "@/src/data/curriculum/learning-path";
import type { QuizCategory } from "@/src/data/quiz/types";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import type { AdminActivityLog } from "@/src/services/adminQuizService";
import type { LearnerQuizAttempt } from "@/src/services/learnerAnalyticsService";
import type { CuratedQuiz } from "@/src/types/quiz";

export type AdminReportType =
  | "learner-progress"
  | "curriculum-coverage"
  | "quiz-performance"
  | "admin-curation";

export interface AdminReportFilters {
  category?: QuizCategory | "all";
  curriculumLevel?: number | null;
  dateFrom?: string;
  dateTo?: string;
  learner?: string;
}

export interface AdminReport {
  title: string;
  generatedAt: string;
  summaryCards: { label: string; value: string; detail?: string }[];
  tableHeaders: string[];
  tableRows: string[][];
  insights: string[];
}

function getAverageScore(progress: LearnerProgressState) {
  const scores = Object.values(progress.quizScores);

  if (!scores.length) {
    return 0;
  }

  return Math.round(
    scores.reduce((total, score) => total + score.bestPercentage, 0) / scores.length
  );
}

function getAttemptAverage(attempts: LearnerQuizAttempt[]) {
  if (!attempts.length) {
    return 0;
  }

  return Math.round(
    attempts.reduce((total, attempt) => total + attempt.percentage, 0) /
      attempts.length
  );
}

function getAdminTopicId(worldId: string, topicTitle: string) {
  const topicSlug = topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${worldId}-${topicSlug}`;
}

export function generateLearnerProgressReport(
  progress: LearnerProgressState,
  filters: AdminReportFilters = {},
  attempts: LearnerQuizAttempt[] = []
): AdminReport {
  const matchingAttempts = attempts.filter((attempt) => {
    const matchesCategory =
      !filters.category || filters.category === "all" || attempt.category === filters.category;
    const matchesLevel =
      !filters.curriculumLevel || attempt.curriculumLevel === filters.curriculumLevel;
    const matchesLearner =
      !filters.learner ||
      attempt.learnerEmail.toLowerCase().includes(filters.learner.toLowerCase()) ||
      attempt.learnerName.toLowerCase().includes(filters.learner.toLowerCase());

    return matchesCategory && matchesLevel && matchesLearner;
  });
  const averageScore = matchingAttempts.length
    ? getAttemptAverage(matchingAttempts)
    : getAverageScore(progress);
  const weakestCategory = Object.entries(progress.masteryByCategory).sort(
    ([, first], [, second]) => first - second
  )[0];

  return {
    title: "Learner Progress Report",
    generatedAt: new Date().toISOString(),
    summaryCards: [
      { label: "Learner level", value: `Level ${progress.currentLevel}` },
      { label: "Completed Play activities", value: `${progress.completedQuizIds.length}` },
      { label: "Stored attempts", value: `${matchingAttempts.length}` },
      { label: "Average score", value: `${averageScore}%` },
      { label: "Badges", value: `${progress.badges.length}` },
      { label: "Achievements", value: `${progress.achievements.length}` },
      { label: "Viewed words", value: `${progress.viewedWordIds.length}` },
    ],
    tableHeaders: matchingAttempts.length
      ? ["Play activity", "Level", "Category", "Score", "Learner"]
      : ["Metric", "Value", "Context", "Status"],
    tableRows: matchingAttempts.length
      ? matchingAttempts.slice(0, 30).map((attempt) => [
          attempt.quizTitle,
          `Level ${attempt.curriculumLevel}`,
          attempt.category,
          `${attempt.percentage}%`,
          attempt.learnerEmail || attempt.learnerName,
        ])
      : [
          [
            "Local progress records",
            `${Object.keys(progress.quizScores).length}`,
            "This device",
            "Waiting for cloud analytics",
          ],
          [
            "Completed Play activities",
            `${progress.completedQuizIds.length}`,
            "Rank / Play / Reward",
            "Stored locally",
          ],
          [
            "Perfect completions",
            `${progress.perfectQuizIds.length}`,
            "Challenge / Mastery",
            "Stored locally",
          ],
        ],
    insights: [
      weakestCategory
        ? `Suggested next target: strengthen ${weakestCategory[0]} mastery.`
        : "Suggested next target: complete the first Play activity.",
      `${progress.unlockedQuizIds.length} Play activities are currently unlocked.`,
    ],
  };
}

export function generateCurriculumCoverageReport(
  curatedQuizzes: CuratedQuiz[],
  filters: AdminReportFilters = {}
): AdminReport {
  const publishedCurated = curatedQuizzes.filter((quiz) => quiz.status === "published");
  const draftCount = curatedQuizzes.filter((quiz) => quiz.status === "draft").length;
  const reviewCount = curatedQuizzes.filter((quiz) => quiz.status === "ready-for-review").length;
  const allWorlds = CURRICULUM.flatMap((grade) =>
    grade.worlds.map((world) => ({ gradeLevel: grade.gradeLevel, world }))
  );
  const allTopics = allWorlds.flatMap(({ gradeLevel, world }) =>
    world.topics.map((topic) => ({ gradeLevel, topic, world }))
  );
  const rows = allTopics.flatMap(({ gradeLevel, topic, world }) =>
    ACTIVE_LEARNING_PHASES.map((phase) => {
      const matchingContent = curatedQuizzes.filter(
        (quiz) =>
          quiz.gradeLevel === gradeLevel &&
          quiz.worldId === world.id &&
          (quiz.topic === topic.title ||
            quiz.topicId === getAdminTopicId(world.id, topic.title)) &&
          (quiz.phase ?? "Practice") === phase
      );
      const publishedCount = matchingContent.filter(
        (quiz) => quiz.status === "published"
      ).length;
      const draftOrReviewCount = matchingContent.filter(
        (quiz) => quiz.status === "draft" || quiz.status === "ready-for-review"
      ).length;

      return [
        gradeLevel,
        world.title,
        topic.title,
        phase,
        `${publishedCount}`,
        draftOrReviewCount ? `${draftOrReviewCount}` : "-",
      ];
    })
  );
  const practiceChallengeGaps = rows.filter(
    ([, , , phase, published]) =>
      (phase === "Practice" || phase === "Challenge") && published === "0"
  ).length;

  return {
    title: "Play Map Coverage Report",
    generatedAt: new Date().toISOString(),
    summaryCards: [
      { label: "Grades", value: `${CURRICULUM.length}` },
      { label: "Worlds", value: `${allWorlds.length}` },
      { label: "Topics", value: `${allTopics.length}` },
      { label: "Published Play items", value: `${publishedCurated.length}` },
      { label: "Drafts", value: `${draftCount}` },
      { label: "Review queue", value: `${reviewCount}` },
    ],
    tableHeaders: ["Grade", "World", "Topic", "Phase", "Published", "Draft/Review"],
    tableRows: rows.slice(0, 80),
    insights: [
      "Coverage is now reported by Grade > World > Topic > Phase.",
      `${practiceChallengeGaps} Practice or Challenge phase slots still need published Play content.`,
      `${draftCount} Play content items are drafts; ${reviewCount} are waiting for review.`,
    ],
  };
}

export function generateQuizPerformanceReport(
  progress: LearnerProgressState,
  filters: AdminReportFilters = {},
  attempts: LearnerQuizAttempt[] = []
): AdminReport {
  const matchingAttempts = attempts.filter((attempt) => {
    const matchesCategory =
      !filters.category || filters.category === "all" || attempt.category === filters.category;
    const matchesLevel =
      !filters.curriculumLevel || attempt.curriculumLevel === filters.curriculumLevel;

    return matchesCategory && matchesLevel;
  });
  const attemptsByQuiz = matchingAttempts.reduce<
    Record<
      string,
      {
        attempts: LearnerQuizAttempt[];
        average: number;
        highest: number;
        lowest: number;
        title: string;
        category: string;
        level: number;
      }
    >
  >((record, attempt) => {
    const current = record[attempt.quizId] ?? {
      attempts: [],
      average: 0,
      highest: 0,
      lowest: 100,
      title: attempt.quizTitle,
      category: attempt.category,
      level: attempt.curriculumLevel,
    };
    const nextAttempts = [...current.attempts, attempt];

    record[attempt.quizId] = {
      ...current,
      attempts: nextAttempts,
      average: Math.round(
        nextAttempts.reduce((total, item) => total + item.percentage, 0) /
          nextAttempts.length
      ),
      highest: Math.max(current.highest, attempt.percentage),
      lowest: Math.min(current.lowest, attempt.percentage),
    };

    return record;
  }, {});
  const attemptRows = Object.values(attemptsByQuiz).sort(
    (first, second) => second.attempts.length - first.attempts.length
  );
  const missedQuestions = matchingAttempts
    .flatMap((attempt) => attempt.responses)
    .filter((response) => !response.correct)
    .reduce<Record<string, number>>((record, response) => {
      record[response.prompt] = (record[response.prompt] ?? 0) + 1;
      return record;
    }, {});
  const commonMiss = Object.entries(missedQuestions).sort(
    ([, first], [, second]) => second - first
  )[0];

  if (attemptRows.length) {
    return {
      title: "Play Activity Performance Report",
      generatedAt: new Date().toISOString(),
      summaryCards: [
        { label: "Total attempts", value: `${matchingAttempts.length}` },
        { label: "Attempted activities", value: `${attemptRows.length}` },
        { label: "Average score", value: `${getAttemptAverage(matchingAttempts)}%` },
        { label: "Common miss", value: commonMiss?.[0] ?? "-" },
      ],
      tableHeaders: ["Play activity", "Category", "Level", "Average", "Attempts"],
      tableRows: attemptRows.map((row) => [
        row.title,
        row.category,
        `Level ${row.level}`,
        `${row.average}%`,
        `${row.attempts.length}`,
      ]),
      insights: [
        commonMiss
          ? `${commonMiss[0]} was missed ${commonMiss[1]} time(s).`
          : "No commonly missed questions yet.",
        `${attemptRows.filter((row) => row.average < 70).length} Play activities are averaging below 70%.`,
      ],
    };
  }

  const scoreRows = Object.entries(progress.quizScores);
  const averageScore = getAverageScore(progress);

  return {
    title: "Play Activity Performance Report",
    generatedAt: new Date().toISOString(),
    summaryCards: [
      { label: "Stored score records", value: `${scoreRows.length}` },
      { label: "Average score", value: `${averageScore}%` },
      { label: "Perfect completions", value: `${progress.perfectQuizIds.length}` },
      { label: "Completed Play activities", value: `${progress.completedQuizIds.length}` },
    ],
    tableHeaders: ["Metric", "Value", "Context"],
    tableRows: [
      ["Local score records", `${scoreRows.length}`, "This device"],
      ["Average score", `${averageScore}%`, "Saved Play activity attempts"],
      ["Completed", `${progress.completedQuizIds.length}`, "Rank / Play / Reward"],
      ["Perfect", `${progress.perfectQuizIds.length}`, "Challenge / Mastery"],
    ],
    insights: [
      "Cloud Play activity analytics will unlock per-question drop-off and common-miss reporting.",
      `${progress.perfectQuizIds.length} Play activities have been completed perfectly.`,
    ],
  };
}

export function generateAdminCurationReport(
  curatedQuizzes: CuratedQuiz[],
  activityLogs: AdminActivityLog[]
): AdminReport {
  const countByAction = activityLogs.reduce<Record<string, number>>((record, log) => {
    record[log.actionType] = (record[log.actionType] ?? 0) + 1;
    return record;
  }, {});
  const countByLifecycle = curatedQuizzes.reduce<Record<string, number>>((record, quiz) => {
    const status = quiz.lifecycleStatus ?? quiz.status;

    record[status] = (record[status] ?? 0) + 1;
    return record;
  }, {});
  const gateReadyCount = curatedQuizzes.filter(
    (quiz) => quiz.lifecycleStatus === "validated" || quiz.lifecycleStatus === "published"
  ).length;
  const blockedBeforePublishCount = curatedQuizzes.filter(
    (quiz) =>
      quiz.status !== "published" &&
      quiz.lifecycleStatus !== "validated" &&
      quiz.lifecycleStatus !== "published"
  ).length;

  return {
    title: "Publishing Health Report",
    generatedAt: new Date().toISOString(),
    summaryCards: [
      { label: "Drafts", value: `${curatedQuizzes.filter((quiz) => quiz.status === "draft").length}` },
      { label: "Validated", value: `${countByLifecycle.validated ?? 0}` },
      {
        label: "AI drafts",
        value: `${activityLogs.filter((log) => log.actionType === "ai-draft-generated").length}`,
      },
      {
        label: "Published",
        value: `${curatedQuizzes.filter((quiz) => quiz.status === "published").length}`,
      },
      {
        label: "Archived",
        value: `${curatedQuizzes.filter((quiz) => quiz.status === "archived").length}`,
      },
    ],
    tableHeaders: ["Signal", "Count"],
    tableRows: [
      ...Object.entries(countByLifecycle).map(([status, count]) => [
        `Lifecycle: ${status}`,
        `${count}`,
      ]),
      ...Object.entries(countByAction).map(([action, count]) => [
        `Activity: ${action}`,
        `${count}`,
      ]),
    ],
    insights: [
      `${curatedQuizzes.filter((quiz) => quiz.status === "ready-for-review").length} Play content items are waiting for review.`,
      `${gateReadyCount} Play content items passed the validation or publish gate.`,
      `${blockedBeforePublishCount} Play content items are blocked before publish by lifecycle gates.`,
      "AI-generated Play content stays unpublished until BatiBot testing, approval, validation, and publish gates pass.",
    ],
  };
}
