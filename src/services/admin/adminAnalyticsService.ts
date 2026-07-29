import {
  listGrades,
  listTopicsByWorld,
  listWorldsByGrade,
} from "@/src/services/admin/batibotMetadataApi";
import {
  listAdminContentDrafts,
  listPublishedContent,
} from "@/src/services/admin/adminContentDraftService";
import { listUserMetadataForAdmin } from "@/src/services/admin/adminUserMetadataService";
import { listTopicDrafts } from "@/src/services/admin/adminTopicDraftService";
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
  topicsByWorld: Record<string, number>;
  totalLearners: number;
  validationFailedCount: number;
  worldCount: number;
};

export async function getAdminAnalytics(
  profile?: UserProfile | null
): Promise<AdminAnalytics> {
  const empty = getEmptyAnalytics();

  try {
    const [users, drafts, published, topicDrafts] = await Promise.all([
      listUserMetadataForAdmin(profile),
      listAdminContentDrafts(),
      listPublishedContent(),
      listTopicDrafts({}, profile),
    ]);
    const learnersByGrade: Record<string, number> = {};

    users.forEach((metadata) => {
      if (metadata.role === "administrator") {
        return;
      }

      const grade = metadata.gradeLevel ?? "Unknown";
      learnersByGrade[grade] = (learnersByGrade[grade] ?? 0) + 1;
    });

    return {
      activeLearners: users.filter(
        (metadata) => metadata.role === "learner" && Boolean(metadata.lastActiveAt)
      ).length,
      approvedCount:
        drafts.filter((draft) => draft.status === "approved").length +
        topicDrafts.filter((draft) => draft.status === "approved").length,
      aiDraftQueueCount: drafts.filter((draft) => draft.status === "ai_generated").length,
      draftCount: drafts.length + topicDrafts.filter((draft) => draft.status !== "published").length,
      gradeLevelCount: getGradeLevelCount(),
      learnersByGrade,
      pendingReviewCount: drafts.filter((draft) =>
        ["ai_generated", "needs_review", "draft"].includes(draft.status)
      ).length + topicDrafts.filter((draft) => draft.status === "inReview").length,
      publishedCount: published.length + topicDrafts.filter((draft) => draft.status === "published").length,
      recentActivityCount: drafts.length + published.length + topicDrafts.length,
      topicCount: getTopicCount(),
      topicsByWorld: getTopicsByWorld(),
      totalLearners: Object.values(learnersByGrade).reduce((sum, count) => sum + count, 0),
      validationFailedCount: drafts.filter((draft) => draft.status === "validation_failed").length,
      worldCount: getWorldCount(),
    };
  } catch {
    return empty;
  }
}

function getEmptyAnalytics(): AdminAnalytics {
  return {
    activeLearners: 0,
    approvedCount: 0,
    aiDraftQueueCount: 0,
    draftCount: 0,
    gradeLevelCount: getGradeLevelCount(),
    learnersByGrade: {},
    pendingReviewCount: 0,
    publishedCount: 0,
    recentActivityCount: 0,
    topicCount: getTopicCount(),
    topicsByWorld: getTopicsByWorld(),
    totalLearners: 0,
    validationFailedCount: 0,
    worldCount: getWorldCount(),
  };
}

function getGradeLevelCount() {
  return listGrades().length;
}

function getTopicCount() {
  return getAllWorlds().reduce(
    (sum, world) => sum + listTopicsByWorld(world.gradeLevel, world.id).length,
    0
  );
}

function getTopicsByWorld() {
  return Object.fromEntries(
    getAllWorlds().map((world) => [
      `${world.gradeLevel}:${world.title}`,
      listTopicsByWorld(world.gradeLevel, world.id).length,
    ])
  );
}

function getWorldCount() {
  return getAllWorlds().length;
}

function getAllWorlds() {
  return listGrades().flatMap((grade) => listWorldsByGrade(grade.id));
}
