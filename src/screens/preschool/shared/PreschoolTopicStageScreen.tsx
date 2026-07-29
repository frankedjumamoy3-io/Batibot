import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

import { ChooseStage } from "@/src/components/preschool/stage-engine/ChooseStage";
import { FamilyStageShell } from "@/src/components/preschool/stage-engine/FamilyStageShell";
import { LookStage } from "@/src/components/preschool/stage-engine/LookStage";
import { PlayStage } from "@/src/components/preschool/stage-engine/PlayStage";
import { TapStage } from "@/src/components/preschool/stage-engine/TapStage";
import { TryStage } from "@/src/components/preschool/stage-engine/TryStage";
import type {
  LessonFeedbackType,
  StandardLessonButtonLabel,
} from "@/src/components/lesson/StandardLessonShell";
import { StandardMasteryStage } from "@/src/components/lesson/mastery/StandardMasteryStage";
import { StandardProgressStage } from "@/src/components/lesson/progress/StandardProgressStage";
import { StandardRewardStage } from "@/src/components/lesson/reward/StandardRewardStage";
import { getLearningTopicId } from "@/src/data/learning-content";
import type {
  PreschoolInteractiveStageType,
  PreschoolStageChoice,
  PreschoolStageWorldConfig,
  PreschoolStageWorldTopic,
} from "@/src/data/preschoolStageWorldTypes";
import type { LearnerStageId } from "@/src/domain/entities/learner-progress";
import {
  STANDARD_STAGE_FEEDBACK,
  useStageAttemptLimit,
} from "@/src/hooks/useStageAttemptLimit";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { canSyncLearnerProgressToCloud } from "@/src/services/learnerCloudSyncEligibility";
import {
  awardPreschoolTopicReward,
  getPreschoolWorldProgress,
  markPreschoolMasteryComplete,
  markPreschoolStageComplete,
  markPreschoolTopicComplete,
  recordPreschoolAttempt,
} from "@/src/services/preschoolWorldProgressService";
import { speak } from "@/src/services/speechService";
import {
  isLessonTopicReplay,
  isLessonTopicRewardClaimed,
} from "@/src/utils/lessonProgression";

const STAGE_ORDER: PreschoolInteractiveStageType[] = [
  "look",
  "tap",
  "try",
  "choose",
  "play",
];

type PostLearningStageType = "reward" | "progress" | "mastery";
type PreschoolFlowStageType = PreschoolInteractiveStageType | PostLearningStageType;

const POST_STAGE_ORDER: PostLearningStageType[] = ["reward", "progress", "mastery"];
const FLOW_STAGE_ORDER: PreschoolFlowStageType[] = [
  ...STAGE_ORDER,
  ...POST_STAGE_ORDER,
];

const STAGE_NAMES = [
  "LOOK",
  "TAP",
  "TRY",
  "CHOOSE",
  "PLAY",
  "REWARD",
  "PROGRESS",
  "MASTERED",
];
const LEARNING_STAGE_NAMES = STAGE_NAMES.slice(0, STAGE_ORDER.length);

const PRESCHOOL_PLAY_TIMER_SECONDS = 20;
const LOOK_MINIMUM_VIEW_MS = 3500;
const TAP_AFTER_TAP_DELAY_MS = 5000;

const LEGACY_STAGE_MAP: Record<PreschoolInteractiveStageType, LearnerStageId> = {
  choose: "practice",
  look: "discover",
  play: "challenge",
  tap: "explore",
  try: "interact",
};

const PRESCHOOL_STAGE_FROM_LEGACY: Partial<Record<LearnerStageId, PreschoolFlowStageType>> = {
  challenge: "play",
  discover: "look",
  explore: "tap",
  interact: "try",
  mastery: "mastery",
  practice: "choose",
  progress: "progress",
  reward: "reward",
};

type Feedback = "correct" | "wrong" | "timeout" | null;

type PreschoolTopicStageScreenProps = {
  config: PreschoolStageWorldConfig;
};

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function resolveTopic(
  config: PreschoolStageWorldConfig,
  routeTopicId?: string
): PreschoolStageWorldTopic | undefined {
  const raw = routeTopicId?.split(":").pop() ?? "";
  const normalized = normalize(raw);

  return config.topics.find(
    (topic) => topic.id === normalized || normalize(topic.label) === normalized
  );
}

function isLearningStage(
  stage: PreschoolFlowStageType | undefined
): stage is PreschoolInteractiveStageType {
  return Boolean(stage && STAGE_ORDER.includes(stage as PreschoolInteractiveStageType));
}

export function PreschoolTopicStageScreen({
  config,
}: PreschoolTopicStageScreenProps) {
  const params = useLocalSearchParams<{ topicId?: string | string[] }>();
  const routeTopicId = getParamValue(params.topicId);
  const { learner, loading } = useCurrentLearner();
  const { profile, user } = useCurrentUserProfile();
  const {
    claimWorldReward,
    markLessonStageCompleted,
    markTopicMastered,
    progress: learnerProgress,
  } = useLearnerProgress();
  const topic = useMemo(
    () => resolveTopic(config, routeTopicId),
    [config, routeTopicId]
  );
  const progressDefinition = useMemo(
    () => ({
      gradeLevel: config.gradeLevel,
      topicOrder: config.topics.map((item) => item.id),
      worldId: config.worldId,
    }),
    [config]
  );
  const globalTopicId = topic ? getLearningTopicId(config.worldId, topic.label) : "";
  const canUseCloudProgress = canSyncLearnerProgressToCloud({ profile, user });
  const activeRewardClaimed = isLessonTopicRewardClaimed(learnerProgress, globalTopicId);
  const [stageIndex, setStageIndex] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [completedStages, setCompletedStages] = useState<PreschoolInteractiveStageType[]>([]);
  const [selectedTryChoice, setSelectedTryChoice] = useState<string>();
  const [selectedChooseChoice, setSelectedChooseChoice] = useState<string>();
  const [tryFeedback, setTryFeedback] = useState<Feedback>(null);
  const [chooseFeedback, setChooseFeedback] = useState<Feedback>(null);
  const [playFeedback, setPlayFeedback] = useState<Feedback>(null);
  const [playCompleted, setPlayCompleted] = useState(false);
  const [isPlayLocked, setIsPlayLocked] = useState(false);
  const [attemptLimitReached, setAttemptLimitReached] = useState(false);
  const [hasTappedLookImage, setHasTappedLookImage] = useState(false);
  const [hasTappedTapImage, setHasTappedTapImage] = useState(false);
  const [lookReady, setLookReady] = useState(false);
  const [tapReady, setTapReady] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(PRESCHOOL_PLAY_TIMER_SECONDS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transition = useRef(new Animated.Value(1)).current;
  const wrongFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedTopicRef = useRef<string | null>(null);

  const clearWrongFeedbackTimeout = useCallback(() => {
    if (wrongFeedbackTimeoutRef.current) {
      clearTimeout(wrongFeedbackTimeoutRef.current);
      wrongFeedbackTimeoutRef.current = null;
    }
  }, []);

  const resetPlayVisitState = useCallback(() => {
    clearWrongFeedbackTimeout();
    setPlayFeedback(null);
    setPlayCompleted(false);
    setIsPlayLocked(false);
    setAttemptLimitReached(false);
    setTimerRemaining(PRESCHOOL_PLAY_TIMER_SECONDS);
  }, [clearWrongFeedbackTimeout]);

  useEffect(() => clearWrongFeedbackTimeout, [clearWrongFeedbackTimeout]);

  useEffect(() => {
    if (!topic) {
      return;
    }

    const topicChanged = initializedTopicRef.current !== globalTopicId;
    if (!topicChanged) {
      return;
    }
    initializedTopicRef.current = globalTopicId;

    if (isLessonTopicReplay(learnerProgress, globalTopicId)) {
      setCompletedStages([]);
      setIsReviewMode(true);
      setStageIndex(0);
      return;
    }

    setIsReviewMode(false);

    const localStages =
      learnerProgress.completedStagesByTopic[globalTopicId]?.completedStages ?? [];
    const localFlowStages = localStages
      .map((stage) => PRESCHOOL_STAGE_FROM_LEGACY[stage])
      .filter((stage): stage is PreschoolFlowStageType => Boolean(stage));

    if (localFlowStages.length) {
      const hasFinishedPostLearning = localFlowStages.some((stage) =>
        POST_STAGE_ORDER.includes(stage as PostLearningStageType)
      );

      if (hasFinishedPostLearning) {
        setCompletedStages([]);
        setIsReviewMode(true);
        setStageIndex(0);
        return;
      }

      const nextIndex = FLOW_STAGE_ORDER.findIndex(
        (stage) => !localFlowStages.includes(stage)
      );

      setCompletedStages(
        localFlowStages.filter((stage): stage is PreschoolInteractiveStageType =>
          isLearningStage(stage)
        )
      );
      setStageIndex(
        nextIndex === -1
          ? FLOW_STAGE_ORDER.length - 1
          : Math.max(0, nextIndex)
      );
      return;
    }

    if (!learner?.uid || !canUseCloudProgress) {
      setCompletedStages([]);
      setStageIndex(0);
      return;
    }

    getPreschoolWorldProgress(learner.uid, progressDefinition)
      .then((progress) => {
        const topicProgress = progress.topicProgress[topic.id];

        if (topicProgress?.masteryCompleted || topicProgress?.rewardClaimed) {
          setCompletedStages([]);
          setIsReviewMode(true);
          setStageIndex(0);
          return;
        }

        const stages = progress.topicProgress[topic.id]?.completedStages ?? [];
        const nextIndex = STAGE_ORDER.findIndex((stage) => !stages.includes(stage));

        setCompletedStages(stages);
        setStageIndex(nextIndex === -1 ? STAGE_ORDER.length : Math.max(0, nextIndex));
      })
      .catch(() => undefined);
  }, [
    canUseCloudProgress,
    globalTopicId,
    learner?.uid,
    learnerProgress,
    progressDefinition,
    topic,
  ]);

  const activeStages = isReviewMode ? STAGE_ORDER : FLOW_STAGE_ORDER;
  const activeStageNames = isReviewMode ? LEARNING_STAGE_NAMES : STAGE_NAMES;
  const currentStage = activeStages[stageIndex];

  useEffect(() => {
    setSelectedTryChoice(undefined);
    setSelectedChooseChoice(undefined);
    setTryFeedback(null);
    setChooseFeedback(null);
    resetPlayVisitState();
    setHasTappedLookImage(false);
    setHasTappedTapImage(false);
    setLookReady(false);
    setTapReady(false);

    return undefined;
  }, [resetPlayVisitState, stageIndex, topic]);

  useEffect(() => {
    if (activeStages[stageIndex] !== "look") {
      return undefined;
    }

    const timeout = setTimeout(() => setLookReady(true), LOOK_MINIMUM_VIEW_MS);

    return () => clearTimeout(timeout);
  }, [activeStages, stageIndex]);

  useEffect(() => {
    if (!hasTappedTapImage || activeStages[stageIndex] !== "tap") {
      return undefined;
    }

    const timeout = setTimeout(() => setTapReady(true), TAP_AFTER_TAP_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [activeStages, hasTappedTapImage, stageIndex]);
  const playRetryVisible =
    currentStage === "play" &&
    (playFeedback === "wrong" || playFeedback === "timeout") &&
    !attemptLimitReached;
  const restartCurrentTopicFromLook = useCallback(() => {
    clearWrongFeedbackTimeout();
    setSelectedTryChoice(undefined);
    setSelectedChooseChoice(undefined);
    setTryFeedback(null);
    setChooseFeedback(null);
    resetPlayVisitState();
    setHasTappedLookImage(false);
    setHasTappedTapImage(false);
    setLookReady(false);
    setTapReady(false);
    setStageIndex(0);
  }, [clearWrongFeedbackTimeout, resetPlayVisitState]);

  const {
    registerFailure: registerStageFailure,
    resetAttempts: resetStageAttempts,
  } = useStageAttemptLimit({
    enabled: currentStage === "play",
    onFeedback: (message, type) => {
      if (type === "limit") {
        setAttemptLimitReached(true);
        setIsPlayLocked(true);
        setPlayFeedback("wrong");
        speak(message);
        return;
      }

      setAttemptLimitReached(false);
      setIsPlayLocked(false);
      setPlayFeedback(type === "timeout" ? "timeout" : "wrong");
      speak(message);
    },
    onLimitReached: restartCurrentTopicFromLook,
  });

  useEffect(() => {
    resetStageAttempts();
  }, [resetStageAttempts, stageIndex, topic?.id]);

  const beginWrongPlayAttempt = useCallback((feedback: "wrong" | "timeout" = "wrong") => {
    if (!topic) {
      return;
    }

    clearWrongFeedbackTimeout();

    setPlayFeedback(feedback);
    setTimerRemaining(PRESCHOOL_PLAY_TIMER_SECONDS);
    registerStageFailure(feedback);
  }, [
    clearWrongFeedbackTimeout,
    registerStageFailure,
    topic,
  ]);

  useEffect(() => {
    if (
      !topic ||
      activeStages[stageIndex] !== "play" ||
      playCompleted ||
      isPlayLocked ||
      playRetryVisible ||
      attemptLimitReached
    ) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimerRemaining((current) => {
        if (current <= 1) {
          beginWrongPlayAttempt("timeout");
          return PRESCHOOL_PLAY_TIMER_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    attemptLimitReached,
    beginWrongPlayAttempt,
    isPlayLocked,
    playCompleted,
    playRetryVisible,
    activeStages,
    stageIndex,
    topic,
  ]);

  const stageAlreadySaved = isLearningStage(currentStage)
    ? completedStages.includes(currentStage)
    : false;
  const nextTopic = topic
    ? config.topics.find((item) => item.order === topic.order + 1)
    : undefined;

  const canProceed =
    stageIndex >= STAGE_ORDER.length ||
    stageAlreadySaved ||
    (currentStage === "look" && (hasTappedLookImage || lookReady)) ||
    (currentStage === "tap" && hasTappedTapImage && tapReady) ||
    (currentStage === "try" && tryFeedback === "correct") ||
    (currentStage === "choose" && chooseFeedback === "correct") ||
    (currentStage === "play" && playCompleted);
  const canUseShellAction =
    (currentStage === "play" && attemptLimitReached) || canProceed;

  const animateTo = useCallback(
    (nextIndex: number) => {
      setIsTransitioning(true);
      Animated.sequence([
        Animated.timing(transition, {
          duration: 130,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(transition, {
          duration: 180,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
      setStageIndex(nextIndex);
    },
    [transition]
  );

  const saveStage = useCallback(
    async (stage: PreschoolInteractiveStageType) => {
      if (!topic) {
        return;
      }

      setCompletedStages((current) =>
        current.includes(stage) ? current : [...current, stage]
      );
      markLessonStageCompleted({
        stage: LEGACY_STAGE_MAP[stage],
        title: `${topic.label} ${stage}`,
        topicId: globalTopicId,
        worldId: config.worldId,
        xp: 0,
      });

      if (learner?.uid && canUseCloudProgress) {
        await markPreschoolStageComplete(learner.uid, progressDefinition, topic.id, stage)
          .catch(() => undefined);
      }
    },
    [
      canUseCloudProgress,
      config.worldId,
      globalTopicId,
      learner?.uid,
      markLessonStageCompleted,
      progressDefinition,
      topic,
    ]
  );

  const awardTopic = useCallback(async () => {
    if (!topic) {
      return;
    }

    if (activeRewardClaimed || isReviewMode) {
      return;
    }

    claimWorldReward({
      rewardId: globalTopicId,
      title: `${topic.label} reward`,
      xp: topic.reward.xp,
    });

    if (learner?.uid && canUseCloudProgress) {
      await awardPreschoolTopicReward(
        learner.uid,
        progressDefinition,
        topic.id,
        topic.reward.stars,
        topic.reward.xp
      ).catch(() => undefined);
    }
  }, [
    canUseCloudProgress,
    claimWorldReward,
    globalTopicId,
    activeRewardClaimed,
    isReviewMode,
    learner?.uid,
    progressDefinition,
    topic,
  ]);

  const savePostStage = useCallback(
    (stage: PostLearningStageType) => {
      if (!topic) {
        return;
      }

      markLessonStageCompleted({
        stage,
        title: `${topic.label} ${stage}`,
        topicId: globalTopicId,
        worldId: config.worldId,
        xp: 0,
      });
    },
    [config.worldId, globalTopicId, markLessonStageCompleted, topic]
  );

  const completeMastery = useCallback(async () => {
    if (!topic) {
      return;
    }

    savePostStage("mastery");
    markTopicMastered({
      nextUnlockedTopicId: nextTopic
        ? getLearningTopicId(config.worldId, nextTopic.label)
        : undefined,
      title: topic.label,
      topicId: globalTopicId,
      worldId: config.worldId,
      xp: 0,
    });

    if (learner?.uid && canUseCloudProgress) {
      await markPreschoolMasteryComplete(learner.uid, progressDefinition, topic.id)
        .catch(() => undefined);
    }
  }, [
    canUseCloudProgress,
    config.worldId,
    globalTopicId,
    learner?.uid,
    markTopicMastered,
    nextTopic,
    progressDefinition,
    savePostStage,
    topic,
  ]);

  const handleProceed = useCallback(async () => {
    if (!canProceed || !topic || isTransitioning) {
      return;
    }

    if (currentStage === "reward") {
      await awardTopic();
      savePostStage("reward");
      animateTo(stageIndex + 1);
      return;
    }

    if (currentStage === "progress") {
      savePostStage("progress");
      animateTo(stageIndex + 1);
      return;
    }

    if (currentStage === "mastery") {
      await completeMastery();
      if (nextTopic) {
        router.replace({
          pathname: APP_ROUTES.lesson.topic as never,
          params: { topicId: getLearningTopicId(config.worldId, nextTopic.label) },
        });
      } else {
        router.replace({
          pathname: APP_ROUTES.tabs.worldTopics as never,
          params: { worldId: config.worldId },
        });
      }
      return;
    }

    const stage = STAGE_ORDER[stageIndex];

    if (!isReviewMode) {
      await saveStage(stage);
    }

    if (stage === "play") {
      if (isReviewMode) {
        router.replace({
          pathname: APP_ROUTES.tabs.worldTopics as never,
          params: { worldId: config.worldId },
        });
        return;
      }

      if (!isReviewMode && learner?.uid && canUseCloudProgress) {
        await markPreschoolTopicComplete(learner.uid, progressDefinition, topic.id)
          .catch(() => undefined);
      }
      animateTo(STAGE_ORDER.length);
      return;
    }

    animateTo(stageIndex + 1);
  }, [
    animateTo,
    awardTopic,
    canProceed,
    canUseCloudProgress,
    completeMastery,
    config.worldId,
    currentStage,
    isReviewMode,
    isTransitioning,
    learner?.uid,
    nextTopic,
    progressDefinition,
    saveStage,
    savePostStage,
    stageIndex,
    topic,
  ]);

  const recordChoiceAttempt = useCallback(
    (stage: "try" | "choose" | "play") => {
      if (learner?.uid && topic && canUseCloudProgress) {
        void recordPreschoolAttempt(learner.uid, progressDefinition, topic.id, stage)
          .catch(() => undefined);
      }
    },
    [canUseCloudProgress, learner?.uid, progressDefinition, topic]
  );

  const handleBackToLook = useCallback(() => {
    resetPlayVisitState();
    setHasTappedLookImage(false);
    setHasTappedTapImage(false);
    animateTo(0);
  }, [animateTo, resetPlayVisitState]);

  const handlePlayRetry = useCallback(() => {
    setPlayFeedback(null);
    setIsPlayLocked(false);
    setTimerRemaining(PRESCHOOL_PLAY_TIMER_SECONDS);
  }, []);

  const handlePlayDrop = useCallback(
    (choice: PreschoolStageChoice & { label: string }) => {
      if (isPlayLocked || playRetryVisible || attemptLimitReached || playCompleted) {
        return;
      }

      if (choice.isCorrect) {
        recordChoiceAttempt("play");
        clearWrongFeedbackTimeout();
        setPlayFeedback("correct");
        setPlayCompleted(true);
        setIsPlayLocked(false);
        setAttemptLimitReached(false);
        speak("Great!");
        return;
      }

      beginWrongPlayAttempt();
    },
    [
      attemptLimitReached,
      beginWrongPlayAttempt,
      clearWrongFeedbackTimeout,
      isPlayLocked,
      playCompleted,
      playRetryVisible,
      recordChoiceAttempt,
    ]
  );

  if (loading) {
    return null;
  }

  if (!learner || !topic) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }

  const progressIndex = Math.min(stageIndex + 1, activeStages.length);
  const completedTopicCount = topic ? Math.min(config.topics.length, topic.order) : 0;
  const previousCompletedTopicCount = Math.max(0, completedTopicCount - 1);
  const actionLabel = getActionLabel({
    attemptLimitReached,
    currentStage,
    hasNextTopic: Boolean(nextTopic),
  });
  const shellInstruction = getShellInstruction(currentStage, topic);
  const shellFeedback = getShellFeedback({
    attemptLimitReached,
    chooseFeedback,
    currentStage,
    playFeedback,
    tryFeedback,
  });

  return (
    <FamilyStageShell
      actionLabel={actionLabel}
      backgroundImage={config.backgroundImage}
      buttonPulse={currentStage === "play" && playCompleted}
      canProceed={canUseShellAction && !isTransitioning}
      feedbackMessage={shellFeedback.message}
      feedbackType={shellFeedback.type}
      instruction={shellInstruction}
      onClose={() =>
        router.replace({
          pathname: APP_ROUTES.tabs.worldTopics as never,
          params: { worldId: config.worldId },
        })
      }
      onProceed={
        currentStage === "play" && attemptLimitReached
          ? handleBackToLook
          : handleProceed
      }
      progressIndex={progressIndex}
      totalStages={activeStages.length}
      stageName={activeStageNames[stageIndex] ?? "REWARD"}
    >
      <Animated.View
        style={{
          opacity: transition,
          transform: [
            {
              translateY: transition.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
          width: "100%",
        }}
      >
        {currentStage === "reward" ? (
          <StandardRewardStage
            alreadyClaimed={activeRewardClaimed || isReviewMode}
            stars={topic.reward.stars}
            xp={topic.reward.xp}
          />
        ) : currentStage === "progress" ? (
          <StandardProgressStage
            completedTopics={completedTopicCount}
            previousCompletedTopics={previousCompletedTopicCount}
            totalTopics={config.topics.length}
          />
        ) : currentStage === "mastery" ? (
          <StandardMasteryStage
            hasNextTopic={Boolean(nextTopic)}
            nextTopicLabel={nextTopic?.label}
          />
        ) : currentStage === "look" ? (
          <LookStage
            grade={config.gradeLevel ?? "preschool"}
            onTapped={() => setHasTappedLookImage(true)}
            topic={topic}
            worldId={config.worldId}
          />
        ) : currentStage === "tap" ? (
          <TapStage
            grade={config.gradeLevel ?? "preschool"}
            onTapped={() => setHasTappedTapImage(true)}
            topic={topic}
            worldId={config.worldId}
          />
        ) : currentStage === "try" ? (
          <TryStage
            grade={config.gradeLevel ?? "preschool"}
            onAnswer={(choice) => {
              setSelectedTryChoice(choice.id);
              recordChoiceAttempt("try");
              setTryFeedback(choice.isCorrect ? "correct" : "wrong");
              if (choice.isCorrect) {
                return;
              }
            }}
            selectedChoiceId={selectedTryChoice}
            topic={topic}
            worldId={config.worldId}
          />
        ) : currentStage === "choose" ? (
          <ChooseStage
            grade={config.gradeLevel ?? "preschool"}
            onAnswer={(choice) => {
              setSelectedChooseChoice(choice.id);
              recordChoiceAttempt("choose");
              setChooseFeedback(choice.isCorrect ? "correct" : "wrong");
              if (choice.isCorrect) {
                return;
              }
            }}
            selectedChoiceId={selectedChooseChoice}
            topic={topic}
            worldId={config.worldId}
          />
        ) : (
          <PlayStage
            attemptLimitReached={attemptLimitReached}
            disabled={isPlayLocked || playRetryVisible || attemptLimitReached}
            feedback={playFeedback}
            grade={config.gradeLevel ?? "preschool"}
            isCompleted={playCompleted}
            onDrop={handlePlayDrop}
            onRetry={handlePlayRetry}
            showTryAgain={playRetryVisible}
            timerRemaining={timerRemaining}
            topic={topic}
            worldId={config.worldId}
            wrongImage={config.wrongImage}
          />
        )}
      </Animated.View>
    </FamilyStageShell>
  );
}

function getActionLabel({
  attemptLimitReached,
  currentStage,
  hasNextTopic,
}: {
  attemptLimitReached: boolean;
  currentStage: PreschoolFlowStageType;
  hasNextTopic: boolean;
}): StandardLessonButtonLabel {
  if (currentStage === "play" && attemptLimitReached) {
    return "Done";
  }

  if (currentStage === "play") {
    return "Reward";
  }

  if (currentStage === "reward") {
    return "Done";
  }

  if (currentStage === "mastery") {
    return hasNextTopic ? "Next" : "Done";
  }

  return "Next";
}

function getShellInstruction(
  currentStage: PreschoolFlowStageType,
  topic: PreschoolStageWorldTopic
) {
  if (currentStage === "look") {
    return `Look at ${topic.label}.`;
  }

  if (currentStage === "tap") {
    return "Tap to hear.";
  }

  if (currentStage === "try") {
    return topic.try.question;
  }

  if (currentStage === "choose") {
    return topic.choose.question;
  }

  if (currentStage === "play") {
    return topic.play.task;
  }

  if (currentStage === "reward") {
    return "See your reward.";
  }

  if (currentStage === "progress") {
    return "See your progress.";
  }

  return `You mastered ${topic.label}.`;
}

function getShellFeedback({
  attemptLimitReached,
  chooseFeedback,
  currentStage,
  playFeedback,
  tryFeedback,
}: {
  attemptLimitReached: boolean;
  chooseFeedback: Feedback;
  currentStage: PreschoolFlowStageType;
  playFeedback: Feedback;
  tryFeedback: Feedback;
}): { message: string | null; type: LessonFeedbackType | null } {
  if (attemptLimitReached) {
    return { message: STANDARD_STAGE_FEEDBACK.limit, type: "limit" };
  }

  if (currentStage === "try") {
    return toShellFeedback(tryFeedback);
  }

  if (currentStage === "choose") {
    return toShellFeedback(chooseFeedback);
  }

  if (currentStage === "play") {
    return toShellFeedback(playFeedback);
  }

  return { message: null, type: null };
}

function toShellFeedback(feedback: Feedback): {
  message: string | null;
  type: LessonFeedbackType | null;
} {
  if (feedback === "correct") {
    return { message: STANDARD_STAGE_FEEDBACK.success, type: "success" };
  }

  if (feedback === "timeout") {
    return { message: STANDARD_STAGE_FEEDBACK.timeout, type: "timeout" };
  }

  if (feedback === "wrong") {
    return { message: STANDARD_STAGE_FEEDBACK.wrong, type: "wrong" };
  }

  return { message: null, type: null };
}
