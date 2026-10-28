import { authenticatedRequest } from "@/src/infrastructure/api/session";
import { listTopicDrafts } from "@/src/services/admin/adminTopicDraftService";
import type { UserProfile } from "@/src/types/user";

export interface AdminInsights {
  generatedAt: string;
  learners: {
    total: number;
    active30Days: number;
    completedLessons: number;
    masteredTopics: number;
    savedQuizAttempts: number;
    averageLatestScore: number | null;
    byGrade: Record<string, {
      learners: number;
      activeLearners: number;
      completedLessons: number;
      savedQuizAttempts: number;
      publishedQuizzes: number;
      publishedStages: number;
    }>;
  };
  content: {
    quizStatus: Record<string, number>;
    contentStatus: Record<string, number>;
    worldCoverage: { gradeLevel: string; worldId: string; publishedStages: number; draftStages: number; publishedQuizzes: number; draftQuizzes: number }[];
  };
  learnerRows: {
    id: string;
    displayName: string;
    gradeLevel: string;
    createdAt: string | null;
    lastActiveAt: string | null;
    totalXp: number;
    completedLessons: number;
    completedTopics: number;
    savedQuizAttempts: number;
    averageLatestScore: number | null;
  }[];
  quizPerformance: {
    id: string;
    title: string;
    gradeLevel: string;
    attempts: number;
    learners: number;
    averageLatestScore: number;
  }[];
  recentActivity: { action: string; entityType: string; timestamp: string | null }[];
  topicDrafts?: { gradeLevel: string; worldId: string; status: string }[];
}

export async function getAdminInsights(profile?: UserProfile | null): Promise<AdminInsights> {
  const backend = await authenticatedRequest<AdminInsights>("/admin/insights");
  if (!profile) return backend;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const topicDrafts = await Promise.race([
      listTopicDrafts({}, profile),
      new Promise<null>(resolve => { timeout = setTimeout(() => resolve(null), 4000); }),
    ]);
    return topicDrafts ? { ...backend, topicDrafts: topicDrafts.map(draft => ({ gradeLevel: draft.gradeLevel, worldId: draft.worldId, status: draft.status })) } : backend;
  } catch {
    return backend;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
