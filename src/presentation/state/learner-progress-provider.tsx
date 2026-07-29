import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getLearnerProgressStorageKey,
  loadCloudLearnerProgress,
  loadLocalLearnerProgress,
  saveCloudLearnerProgress,
  saveLocalLearnerProgress,
} from "@/src/data/repositories/learner-progress-repository";
import { useAuthSession } from "@/src/store/auth-session";
import type {
  ActiveQuizProgressDraft,
  ClearLessonStageAttemptsInput,
  LessonStageCompletionInput,
  LessonStageAttemptInput,
  LearnerActivity,
  LearnerProgressState,
  QuizCompletionInput,
  SaveQuizDraftInput,
  SavedQuizQuestionResponse,
  TopicMasteryInput,
  WorldRewardInput,
} from "@/src/domain/entities/learner-progress";
import { markNotificationReadUseCase } from "@/src/domain/usecases/learner-progress/notifications";
import {
  claimWorldRewardUseCase,
  clearLessonStageAttemptsUseCase,
  markLessonStageCompletedUseCase,
  markTopicMasteredUseCase,
  markWordViewedUseCase,
  recordLessonStageAttemptUseCase,
  recordQuizCompletionUseCase,
} from "@/src/domain/usecases/learner-progress/progress-actions";
import {
  clearQuizDraftUseCase,
  saveQuizDraftUseCase,
} from "@/src/domain/usecases/learner-progress/quiz-drafts";
import {
  DEFAULT_PROGRESS,
  getLearnerAccessFlags,
  getPersistableLearnerProgress,
  sanitizeLearnerProgress,
  withLearnerAccessFlags,
} from "@/src/domain/usecases/learner-progress/progress-state";
import { syncCurrentLearnerLeaderboardEntry } from "@/src/services/leaderboardService";
import { isTestAuthSessionTrusted } from "@/src/services/testAccountService";

const LOCAL_SAVE_DEBOUNCE_MS = 120;
const CLOUD_SAVE_DEBOUNCE_MS = 900;

export type {
  ActiveQuizProgressDraft,
  LearnerActivity,
  LearnerProgressState,
  QuizCompletionInput,
  SaveQuizDraftInput,
  SavedQuizQuestionResponse,
  WorldRewardInput,
};

interface LearnerProgressContextValue {
  isHydrated: boolean;
  progress: LearnerProgressState;
  clearQuizDraft: (quizId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markWordViewed: (
    wordId: string,
    wordLabel: string,
    legacyIds?: string[]
  ) => void;
  claimWorldReward: (input: WorldRewardInput) => void;
  clearLessonStageAttempts: (input: ClearLessonStageAttemptsInput) => void;
  markLessonStageCompleted: (input: LessonStageCompletionInput) => void;
  markTopicMastered: (input: TopicMasteryInput) => void;
  recordLessonStageAttempt: (input: LessonStageAttemptInput) => void;
  recordQuizCompletion: (input: QuizCompletionInput) => void;
  resetProgress: () => void;
  saveQuizDraft: (input: SaveQuizDraftInput) => void;
}

const LearnerProgressContext = createContext<LearnerProgressContextValue | null>(
  null
);

export function LearnerProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, user } = useAuthSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [canSaveToCloud, setCanSaveToCloud] = useState(false);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<LearnerProgressState>(DEFAULT_PROGRESS);
  const pendingProgressEditRef = useRef(false);
  const localSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cloudSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userAccessFlags = useMemo(
    () => ({
      isTestAccount:
        user?.isTestAccount === true && isTestAuthSessionTrusted(user),
      unlockAllQuizzes:
        user?.unlockAllQuizzes === true && isTestAuthSessionTrusted(user),
    }),
    [user]
  );

  useEffect(() => {
    if (!user) {
      setUserId(null);
      setStorageKey(null);
      setProgress(DEFAULT_PROGRESS);
      pendingProgressEditRef.current = false;
      setCanSaveToCloud(false);
      setIsHydrated(true);
      return;
    }

    setIsHydrated(false);
    setCanSaveToCloud(false);
    pendingProgressEditRef.current = false;
    setUserId(user.uid);
    setStorageKey(getLearnerProgressStorageKey(user.uid));
  }, [user]);

  useEffect(() => {
    if (!storageKey || !userId) {
      return;
    }

    const activeStorageKey = storageKey;
    const activeUserId = userId;
    const activeAccessFlags = userAccessFlags;
    const shouldUseCloudProgress =
      user?.isLocalLearner !== true &&
      user?.isTestAccount !== true &&
      user?.excludeFromAnalytics !== true;
    let isMounted = true;
    pendingProgressEditRef.current = false;
    setCanSaveToCloud(false);

    async function loadProgress() {
      try {
        const storedValue = await loadLocalLearnerProgress(activeStorageKey);

        if (!isMounted) {
          return;
        }

        if (storedValue) {
          setProgress(
            withLearnerAccessFlags(
              sanitizeLearnerProgress(storedValue),
              activeAccessFlags
            )
          );
        } else {
          setProgress(withLearnerAccessFlags(DEFAULT_PROGRESS, activeAccessFlags));
        }
        setIsHydrated(true);
      } catch {
        if (isMounted) {
          setProgress(withLearnerAccessFlags(DEFAULT_PROGRESS, activeAccessFlags));
          setIsHydrated(true);
        }
      }

      if (!shouldUseCloudProgress) {
        return;
      }

      try {
        if (!isMounted) {
          return;
        }

        const userData = await loadCloudLearnerProgress(activeUserId);
        const cloudAccessFlags = getLearnerAccessFlags(userData);
        const accessFlags = {
          isTestAccount:
            activeAccessFlags.isTestAccount || cloudAccessFlags.isTestAccount,
          unlockAllQuizzes:
            activeAccessFlags.unlockAllQuizzes || cloudAccessFlags.unlockAllQuizzes,
        };
        const cloudProgress = userData?.learnerProgress ?? null;

        if (cloudProgress && !pendingProgressEditRef.current) {
          setProgress(
            sanitizeLearnerProgress({
              ...cloudProgress,
              ...accessFlags,
            })
          );
        } else if (!pendingProgressEditRef.current) {
          setProgress((current) => withLearnerAccessFlags(current, accessFlags));
        }
      } catch {
        // Local progress stays usable when Firestore is slow or offline.
      } finally {
        if (isMounted) {
          setCanSaveToCloud(true);
        }
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, [storageKey, user, userAccessFlags, userId]);

  useEffect(() => {
    if (!isHydrated || !storageKey) {
      return;
    }

    const activeStorageKey = storageKey;

    if (localSaveTimerRef.current) {
      clearTimeout(localSaveTimerRef.current);
    }

    localSaveTimerRef.current = setTimeout(() => {
      void saveLocalLearnerProgress(
        activeStorageKey,
        getPersistableLearnerProgress(progress)
      );
    }, LOCAL_SAVE_DEBOUNCE_MS);

    return () => {
      if (localSaveTimerRef.current) {
        clearTimeout(localSaveTimerRef.current);
      }
    };
  }, [isHydrated, progress, storageKey]);

  useEffect(() => {
    if (!isHydrated || !canSaveToCloud || !userId) {
      return;
    }

    const activeUserId = userId;

    if (cloudSaveTimerRef.current) {
      clearTimeout(cloudSaveTimerRef.current);
    }

    cloudSaveTimerRef.current = setTimeout(() => {
      const persistableProgress = getPersistableLearnerProgress(progress);

      void saveCloudLearnerProgress(activeUserId, persistableProgress)
        .then(() => {
          if (!profile?.gradeLevel || !user) {
            return;
          }

          return syncCurrentLearnerLeaderboardEntry({
            avatar: profile.avatarAssetKey || profile.avatarId || profile.buddyEmoji,
            displayName:
              profile.displayName?.trim() ||
              user.displayName?.trim() ||
              "Learner",
            excludeFromAnalytics:
              profile.excludeFromAnalytics === true ||
              user.excludeFromAnalytics === true,
            excludeFromLeaderboard:
              profile.excludeFromLeaderboard === true ||
              user.excludeFromLeaderboard === true,
            gradeLevel: profile.gradeLevel,
            isLocalLearner: user.isLocalLearner === true,
            isTestAccount:
              profile.isTestAccount === true || user.isTestAccount === true,
            profilePhotoUrl: profile.profileImageUrl ?? user.photoURL ?? null,
            stars: Array.isArray(persistableProgress.claimedWorldRewardIds)
              ? persistableProgress.claimedWorldRewardIds.length
              : 0,
            uid: activeUserId,
            xp: Number(persistableProgress.totalXp ?? 0),
          });
        })
        .catch(() => undefined);
    }, CLOUD_SAVE_DEBOUNCE_MS);

    return () => {
      if (cloudSaveTimerRef.current) {
        clearTimeout(cloudSaveTimerRef.current);
      }
    };
  }, [canSaveToCloud, isHydrated, profile, progress, user, userId]);

  const clearQuizDraft = useCallback((quizId: string) => {
    pendingProgressEditRef.current = true;
    setProgress((current) => clearQuizDraftUseCase(current, quizId));
  }, []);

  const saveQuizDraft = useCallback((input: SaveQuizDraftInput) => {
    pendingProgressEditRef.current = true;
    setProgress((current) => saveQuizDraftUseCase(current, input));
  }, []);

  const value = useMemo<LearnerProgressContextValue>(() => {
    return {
      clearQuizDraft,
      isHydrated,
      progress,
      markNotificationRead: (notificationId: string) => {
        pendingProgressEditRef.current = true;
        setProgress((current) =>
          markNotificationReadUseCase(current, notificationId)
        );
      },
      claimWorldReward: ({ rewardId, title, xp }: WorldRewardInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) =>
          claimWorldRewardUseCase(current, { rewardId, title, xp })
        );
      },
      clearLessonStageAttempts: (input: ClearLessonStageAttemptsInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) => clearLessonStageAttemptsUseCase(current, input));
      },
      markLessonStageCompleted: (input: LessonStageCompletionInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) => markLessonStageCompletedUseCase(current, input));
      },
      markTopicMastered: (input: TopicMasteryInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) => markTopicMasteredUseCase(current, input));
      },
      markWordViewed: (wordId: string, wordLabel: string, legacyIds = []) => {
        pendingProgressEditRef.current = true;
        setProgress((current) =>
          markWordViewedUseCase(current, wordId, wordLabel, legacyIds)
        );
      },
      recordLessonStageAttempt: (input: LessonStageAttemptInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) => recordLessonStageAttemptUseCase(current, input));
      },
      recordQuizCompletion: ({
        quizId,
        title,
        category,
        score,
        total,
        curriculumLevel = 1,
        practiceRecommendation,
        rewardsXp,
      }: QuizCompletionInput) => {
        pendingProgressEditRef.current = true;
        setProgress((current) =>
          recordQuizCompletionUseCase(current, {
            quizId,
            title,
            category,
            score,
            total,
            curriculumLevel,
            practiceRecommendation,
            rewardsXp,
          })
        );
      },
      resetProgress: () => {
        pendingProgressEditRef.current = true;
        setProgress(withLearnerAccessFlags(DEFAULT_PROGRESS, userAccessFlags));
      },
      saveQuizDraft,
    };
  }, [clearQuizDraft, isHydrated, progress, saveQuizDraft, userAccessFlags]);

  return (
    <LearnerProgressContext.Provider value={value}>
      {children}
    </LearnerProgressContext.Provider>
  );
}

export function useLearnerProgress() {
  const context = useContext(LearnerProgressContext);

  if (!context) {
    throw new Error("useLearnerProgress must be used within LearnerProgressProvider");
  }

  return context;
}
