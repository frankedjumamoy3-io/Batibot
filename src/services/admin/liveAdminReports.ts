import type { AdminReport, AdminReportType } from "@/src/services/adminReportService";
import type { AdminInsights } from "@/src/services/admin/adminInsightsService";

export type LiveReportType = AdminReportType;
const cell = (value: string | number | null) => value === null ? "—" : String(value);

export function buildLiveAdminReport(insights: AdminInsights, type: LiveReportType, gradeLevel?: string): AdminReport {
  const gradeMatches = (value: string) => !gradeLevel || value === gradeLevel;
  const gradeLabel = gradeLevel ?? "All grades";
  if (type === "learner-progress") {
    const learners = insights.learnerRows.filter(row => gradeMatches(row.gradeLevel));
    return {
      title: `Learner Progress · ${gradeLabel}`, generatedAt: insights.generatedAt,
      summaryCards: [
        { label: "Learners", value: cell(learners.length) },
        { label: "Completed lessons", value: cell(learners.reduce((sum, row) => sum + row.completedLessons, 0)) },
        { label: "Mastered topics", value: cell(learners.reduce((sum, row) => sum + row.completedTopics, 0)) },
        { label: "Saved quiz attempts", value: cell(learners.reduce((sum, row) => sum + row.savedQuizAttempts, 0)) },
      ],
      tableHeaders: ["Learner", "Grade", "XP", "Lessons", "Mastered Topics", "Quiz Attempts", "Avg Latest Score", "Last Saved"],
      tableRows: learners.map(row => [row.displayName, row.gradeLevel, cell(row.totalXp), cell(row.completedLessons), cell(row.completedTopics), cell(row.savedQuizAttempts), row.averageLatestScore === null ? "—" : `${row.averageLatestScore}%`, row.lastActiveAt ? new Date(row.lastActiveAt).toLocaleDateString() : "—"]),
      insights: ["Activity is based on saved progress from signed-in learner accounts. Learners who have not synced progress have no activity yet."],
    };
  }
  if (type === "curriculum-coverage") {
    const worldsByKey = new Map(insights.content.worldCoverage.filter(row => gradeMatches(row.gradeLevel)).map(row => [
      `${row.gradeLevel}:${row.worldId}`, { ...row, publishedTopicDrafts: 0, unpublishedTopicDrafts: 0 },
    ]));
    for (const draft of insights.topicDrafts ?? []) {
      if (!gradeMatches(draft.gradeLevel)) continue;
      const key = `${draft.gradeLevel}:${draft.worldId}`;
      const row = worldsByKey.get(key) ?? { gradeLevel: draft.gradeLevel, worldId: draft.worldId,
        publishedStages: 0, draftStages: 0, publishedQuizzes: 0, draftQuizzes: 0,
        publishedTopicDrafts: 0, unpublishedTopicDrafts: 0 };
      if (draft.status === "published") row.publishedTopicDrafts++;
      else row.unpublishedTopicDrafts++;
      worldsByKey.set(key, row);
    }
    const worlds = [...worldsByKey.values()];
    return {
      title: `Published Content Coverage · ${gradeLabel}`, generatedAt: insights.generatedAt,
      summaryCards: [
        { label: "Worlds with admin content", value: cell(worlds.length) },
        { label: "Published stages", value: cell(worlds.reduce((sum, row) => sum + row.publishedStages, 0)) },
        { label: "Published quizzes", value: cell(worlds.reduce((sum, row) => sum + row.publishedQuizzes, 0)) },
        { label: "Topic drafts (Firestore/local)", value: insights.topicDrafts ? cell(worlds.reduce((sum, row) => sum + row.publishedTopicDrafts + row.unpublishedTopicDrafts, 0)) : "Unavailable" },
        { label: "Unpublished items", value: cell(worlds.reduce((sum, row) => sum + row.draftStages + row.draftQuizzes, 0)) },
      ],
      tableHeaders: ["Grade", "World", "Published Stages", "Draft Stages", "Published Quizzes", "Draft Quizzes", "Published Topic Drafts", "Other Topic Drafts"],
      tableRows: worlds.map(row => [row.gradeLevel, row.worldId, cell(row.publishedStages), cell(row.draftStages), cell(row.publishedQuizzes), cell(row.draftQuizzes), cell(row.publishedTopicDrafts), cell(row.unpublishedTopicDrafts)]),
      insights: ["Stages and quizzes are backend records. Topic drafts are from the separate Firestore/local workspace and are shown in their own columns when available. Bundled curriculum is in the Curriculum Map."],
    };
  }
  if (type === "quiz-performance") {
    const quizzes = insights.quizPerformance.filter(row => gradeMatches(row.gradeLevel));
    const attempts = quizzes.reduce((sum, row) => sum + row.attempts, 0);
    return {
      title: `Quiz Performance · ${gradeLabel}`, generatedAt: insights.generatedAt,
      summaryCards: [
        { label: "Quizzes with scores", value: cell(quizzes.length) },
        { label: "Saved attempts", value: cell(attempts) },
        { label: "Average latest score", value: quizzes.length ? `${Math.round(quizzes.reduce((sum, row) => sum + row.averageLatestScore * row.learners, 0) / quizzes.reduce((sum, row) => sum + row.learners, 0))}%` : "—" },
      ],
      tableHeaders: ["Quiz", "Grade", "Learners", "Saved Attempts", "Avg Latest Score"],
      tableRows: quizzes.map(row => [row.title, row.gradeLevel, cell(row.learners), cell(row.attempts), `${row.averageLatestScore}%`]),
      insights: ["Attempt totals come from saved cumulative quiz progress. Average scores use each learner's latest saved score for that quiz."],
    };
  }
  const actions = insights.recentActivity;
  return {
    title: "Publishing & Curation Activity", generatedAt: insights.generatedAt,
    summaryCards: [
      { label: "Published quizzes", value: cell(insights.content.quizStatus.published ?? 0) },
      { label: "Draft quizzes", value: cell(insights.content.quizStatus.draft ?? 0) },
      { label: "Published stages", value: cell(insights.content.contentStatus.published ?? 0) },
      { label: "Approved stages", value: cell(insights.content.contentStatus.approved ?? 0) },
      { label: "Failed validation", value: cell(insights.content.contentStatus.validation_failed ?? 0) },
      { label: "Topic drafts (Firestore/local)", value: insights.topicDrafts ? cell(insights.topicDrafts.length) : "Unavailable" },
    ],
    tableHeaders: ["When", "Action", "Content Type"],
    tableRows: actions.map(row => [row.timestamp ? new Date(row.timestamp).toLocaleString() : "—", row.action, row.entityType]),
    insights: ["The activity table shows the 100 most recent backend admin actions. Topic draft counts come from the separate Firestore/local workspace and do not have backend audit entries."],
  };
}

export function reportToCsv(report: AdminReport): string {
  const quote = (value: string) => {
    const safe = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [report.tableHeaders, ...report.tableRows].map(row => row.map(quote).join(",")).join("\r\n");
}
