import { useCallback, useMemo } from "react";

import { getLearningTopicId } from "@/src/data/learning-content";
import {
  getCurriculumForGrade,
  getWorldLearningTopics,
} from "@/src/data/curriculum/learning-path";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { isTestAuthSessionTrusted } from "@/src/services/testAccountService";
import type { LearnerProfile } from "@/src/types/learning";
import { toGradeLevel } from "@/src/utils/gradeUtils";

export function useCurrentLearner() {
  const { loading, profile, user } = useCurrentUserProfile();
  const { progress } = useLearnerProgress();

  const learner = useMemo<LearnerProfile | null>(() => {
    if (!profile && !user) {
      return null;
    }

    const profileGradeLevel = profile?.gradeLevel ?? "Preschool";
    const curriculum = getCurriculumForGrade(profileGradeLevel);
    const completedTopics = Object.keys(progress.masteredTopics);
    const completedWorlds = curriculum.worlds
      .filter((world) => {
        const topics = getWorldLearningTopics(world);

        return (
          topics.length > 0 &&
          topics.every((topic) =>
            completedTopics.includes(getLearningTopicId(world.id, topic.title))
          )
        );
      })
      .map((world) => world.id);
    const currentWorld =
      curriculum.worlds.find((world) => !completedWorlds.includes(world.id)) ??
      curriculum.worlds[0];
    const trustedTestSession =
      (profile?.isTestAccount === true ||
        user?.isTestAccount === true ||
        progress.isTestAccount === true) &&
      isTestAuthSessionTrusted(user);
    const unlockAllQuizzes =
      trustedTestSession &&
      (profile?.unlockMode === "all_unlocked" ||
        profile?.unlockAllQuizzes === true ||
        user?.unlockAllQuizzes === true ||
        progress.unlockAllQuizzes === true);

    return {
      uid: profile?.uid ?? user?.uid ?? "local-learner",
      displayName:
        profile?.displayName?.trim() ||
        user?.displayName?.trim() ||
        user?.email?.split("@")[0] ||
        "Learner",
      avatarAssetKey: profile?.avatarAssetKey ?? null,
      avatarId: profile?.avatarId ?? null,
      buddyEmoji: profile?.buddyEmoji ?? null,
      profileImageUrl: profile?.profileImageUrl ?? user?.photoURL ?? null,
      profilePhotoUrl: profile?.profilePhotoUrl ?? profile?.profileImageUrl ?? user?.photoURL ?? null,
      gradeLevel: toGradeLevel(profileGradeLevel),
      xp: Number(progress.totalXp ?? 0),
      stars: Number(progress.claimedWorldRewardIds?.length ?? 0),
      completedWorlds: Array.isArray(completedWorlds) ? completedWorlds : [],
      completedTopics: Array.isArray(completedTopics) ? completedTopics : [],
      badges: Array.isArray(progress.badges) ? progress.badges : [],
      achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
      currentWorldId: currentWorld?.id,
      isTestAccount: trustedTestSession,
      lastPlayedAt: progress.lastActiveDate ?? undefined,
      unlockAllQuizzes,
    };
  }, [profile, progress, user]);

  const reload = useCallback(() => {
    return Promise.resolve();
  }, []);

  return {
    learner,
    loading,
    error: !loading && !learner ? new Error("Learner profile is unavailable.") : null,
    reload,
  };
}
