import { listGrades, listTopicsByWorld, listWorldsByGrade } from "@/src/services/admin/batibotMetadataApi";
import { getAdminInsights, type AdminInsights } from "@/src/services/admin/adminInsightsService";
import type { UserProfile } from "@/src/types/user";

export type AdminAnalytics = {
  activeLearners: number;
  approvedCount: number;
  aiDraftQueueCount: number;
  draftCount: number;
  gradeLevelCount: number;
  learnersByGrade: Record<string, number>;
  pendingReviewCount: number;
  publishedCount: number;
  recentActivityCount: number;
  topicCount: number;
  topicDraftCount: number | null;
  topicsByWorld: Record<string, number>;
  totalLearners: number;
  validationFailedCount: number;
  worldCount: number;
};

export function summarizeAdminInsights(insights: AdminInsights): AdminAnalytics {
  const statuses = insights.content.contentStatus;
  const quizzes = insights.content.quizStatus;
  const worlds = listGrades().flatMap(grade => listWorldsByGrade(grade.id));
  return {
    activeLearners: insights.learners.active30Days,
    approvedCount: statuses.approved ?? 0,
    aiDraftQueueCount: statuses.ai_generated ?? 0,
    draftCount: Object.entries(statuses).reduce((sum, [status, count]) => sum + (status === "published" ? 0 : count), 0) + (quizzes.draft ?? 0),
    gradeLevelCount: listGrades().length,
    learnersByGrade: Object.fromEntries(Object.entries(insights.learners.byGrade).map(([grade, value]) => [grade, value.learners])),
    pendingReviewCount: (statuses.needs_review ?? 0) + (statuses.ai_generated ?? 0),
    publishedCount: (statuses.published ?? 0) + (quizzes.published ?? 0),
    recentActivityCount: insights.recentActivity.length,
    topicCount: worlds.reduce((sum, world) => sum + listTopicsByWorld(world.gradeLevel, world.id).length, 0),
    topicDraftCount: insights.topicDrafts?.length ?? null,
    topicsByWorld: Object.fromEntries(worlds.map(world => [`${world.gradeLevel}:${world.title}`, listTopicsByWorld(world.gradeLevel, world.id).length])),
    totalLearners: insights.learners.total,
    validationFailedCount: statuses.validation_failed ?? 0,
    worldCount: worlds.length,
  };
}

export async function getAdminAnalytics(profile?: UserProfile | null): Promise<AdminAnalytics> {
  return summarizeAdminInsights(await getAdminInsights(profile));
}
