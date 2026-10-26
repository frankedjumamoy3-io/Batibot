import { AppState, Platform } from "react-native";
import type { LessonCheckpoint } from "@/src/domain/usecases/learner-progress/lesson-checkpoints";
import { mergeLearnerProgress } from "@/src/domain/usecases/learner-progress/merge-progress";
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
  syncLearnerProgress,
  loadLocalLearnerProgress,
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
  getPersistableLearnerProgress,
  sanitizeLearnerProgress,
  withLearnerAccessFlags,
} from "@/src/domain/usecases/learner-progress/progress-state";
import { syncCurrentLearnerLeaderboardEntry } from "@/src/services/leaderboardService";
import { isTestAuthSessionTrusted } from "@/src/services/testAccountService";

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
  saveError: boolean;
  saveLessonCheckpoint: (input: Omit<LessonCheckpoint, "savedAt">) => void;
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
  const userId = user?.uid ?? null;
  const storageKey = userId ? getLearnerProgressStorageKey(userId) : null;
  const [hydratedUserId, setHydratedUserId] = useState<string | null | undefined>(undefined);
  const isHydrated = hydratedUserId === userId;
  const [saveError, setSaveError] = useState(false);
  const [progress, setProgress] = useState<LearnerProgressState>(DEFAULT_PROGRESS);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const userAccessFlags = useMemo(() => ({
    isTestAccount: user?.isTestAccount === true && isTestAuthSessionTrusted(user),
    unlockAllQuizzes: user?.unlockAllQuizzes === true && isTestAuthSessionTrusted(user),
  }), [user]);
  const flagsRef = useRef(userAccessFlags);
  flagsRef.current = userAccessFlags;
  const canSaveToCloud = Boolean(userId && !user?.isLocalLearner && !user?.isTestAccount);
  const sessionRef = useRef({ profile, user });
  sessionRef.current = { profile, user };

  useEffect(() => {
    let active = true;
    setSaveError(false);
    if (!storageKey) {
      setProgress(DEFAULT_PROGRESS);
      setHydratedUserId(null);
      return;
    }
    void loadLocalLearnerProgress(storageKey).then(stored => {
      if (!active) return;
      setProgress(withLearnerAccessFlags(sanitizeLearnerProgress(stored), flagsRef.current));
      setHydratedUserId(userId);
    }).catch(() => { if (active) setSaveError(true); });
    return () => { active = false; };
  }, [storageKey, userId]);

  // Persist every committed interaction immediately, before attempting any upload.
  useEffect(() => {
    if (!isHydrated || !storageKey) return;
    let active = true;
    void saveLocalLearnerProgress(storageKey, getPersistableLearnerProgress(progress))
      .then(() => { if (active) setSaveError(false); })
      .catch(() => { if (active) setSaveError(true); });
    return () => { active = false; };
  }, [isHydrated, progress, storageKey]);

  useEffect(() => {
    if (!isHydrated || !storageKey || !userId) return;
    let active = true;
    let running = false;
    async function sync() {
      if (running || !active) return;
      running = true;
      const snapshot = progressRef.current;
      try {
        await saveLocalLearnerProgress(storageKey!, getPersistableLearnerProgress(snapshot));
        if (active) setSaveError(false);
      } catch {
        if (active) setSaveError(true);
        running = false;
        return;
      }
      try {
        if (!canSaveToCloud || !active) return;
        const merged = await syncLearnerProgress(userId!);
        if (!active || !merged) return;
        // Merge interactions performed while the request was in flight as well.
        setProgress(current => {
          const next = withLearnerAccessFlags(mergeLearnerProgress(current, merged), flagsRef.current);
          return JSON.stringify(current) === JSON.stringify(next) ? current : next;
        });
        const { profile: currentProfile, user: currentUser } = sessionRef.current;
        if (currentProfile?.gradeLevel && currentUser?.uid === userId) {
          void syncCurrentLearnerLeaderboardEntry({
            uid: userId!, gradeLevel: currentProfile.gradeLevel,
            displayName: currentProfile.displayName || "Learner",
            avatar: currentProfile.avatarAssetKey || currentProfile.avatarId || currentProfile.buddyEmoji,
            stars: merged.claimedWorldRewardIds?.length ?? 0, xp: merged.totalXp ?? 0,
            isLocalLearner: false, isTestAccount: false,
            excludeFromAnalytics: currentProfile.excludeFromAnalytics,
            excludeFromLeaderboard: currentProfile.excludeFromLeaderboard,
            profilePhotoUrl: currentProfile.profileImageUrl ?? null,
          }).catch(() => undefined);
        }
      } catch {
        // The durable outbox remains pending and retries on foreground/reconnect.
      } finally { running = false; }
    }
    const initial = setTimeout(() => { void sync(); }, CLOUD_SAVE_DEBOUNCE_MS);
    const retry = setInterval(() => { void sync(); }, 15000);
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") void sync();
      else void saveLocalLearnerProgress(storageKey, getPersistableLearnerProgress(progressRef.current)).catch(() => { if (active) setSaveError(true); });
    });
    const online = () => { void sync(); };
    if (Platform.OS === "web" && typeof window !== "undefined") window.addEventListener("online", online);
    return () => {
      active = false; clearTimeout(initial); clearInterval(retry); subscription.remove();
      if (Platform.OS === "web" && typeof window !== "undefined") window.removeEventListener("online", online);
    };
  }, [canSaveToCloud, isHydrated, storageKey, userId]);

  const saveLessonCheckpoint = useCallback((input: Omit<LessonCheckpoint, "savedAt">) => {
    setProgress(current => {
      const previous = current.lessonCheckpoints[input.topicId];
      if (previous) {
        const { savedAt: _savedAt, ...comparable } = previous;
        if (JSON.stringify(comparable) === JSON.stringify(input)) return current;
      }
      return { ...current, lessonCheckpoints: { ...current.lessonCheckpoints,
        [input.topicId]: { ...input, savedAt: new Date().toISOString() } } };
    });
  }, []);

  const clearQuizDraft = useCallback((quizId: string) => {
    setProgress((current) => clearQuizDraftUseCase(current, quizId));
  }, []);

  const saveQuizDraft = useCallback((input: SaveQuizDraftInput) => {
    setProgress((current) => saveQuizDraftUseCase(current, input));
  }, []);

  const value = useMemo<LearnerProgressContextValue>(() => {
    return {
      clearQuizDraft,
      isHydrated,
      saveError,
      saveLessonCheckpoint,
      progress,
      markNotificationRead: (notificationId: string) => {
        setProgress((current) =>
          markNotificationReadUseCase(current, notificationId)
        );
      },
      claimWorldReward: ({ rewardId, title, xp }: WorldRewardInput) => {
        setProgress((current) =>
          claimWorldRewardUseCase(current, { rewardId, title, xp })
        );
      },
      clearLessonStageAttempts: (input: ClearLessonStageAttemptsInput) => {
        setProgress((current) => clearLessonStageAttemptsUseCase(current, input));
      },
      markLessonStageCompleted: (input: LessonStageCompletionInput) => {
        setProgress((current) => markLessonStageCompletedUseCase(current, input));
      },
      markTopicMastered: (input: TopicMasteryInput) => {
        setProgress((current) => markTopicMasteredUseCase(current, input));
      },
      markWordViewed: (wordId: string, wordLabel: string, legacyIds = []) => {
        setProgress((current) =>
          markWordViewedUseCase(current, wordId, wordLabel, legacyIds)
        );
      },
      recordLessonStageAttempt: (input: LessonStageAttemptInput) => {
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
        setProgress(withLearnerAccessFlags({ ...DEFAULT_PROGRESS, resetAt: new Date().toISOString() }, userAccessFlags));
      },
      saveQuizDraft,
    };
  }, [clearQuizDraft, isHydrated, progress, saveQuizDraft, userAccessFlags, saveError, saveLessonCheckpoint]);

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
