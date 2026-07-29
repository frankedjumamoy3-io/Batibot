import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";

import { ChooseStage } from "@/src/components/preschool/number/ChooseStage";
import { LookStage } from "@/src/components/preschool/number/LookStage";
import { NumberStageShell } from "@/src/components/preschool/number/NumberStageShell";
import { PlayStage } from "@/src/components/preschool/number/PlayStage";
import { TapStage } from "@/src/components/preschool/number/TapStage";
import { TryStage } from "@/src/components/preschool/number/TryStage";
import type { LessonFeedbackType } from "@/src/components/lesson/StandardLessonShell";
import { StandardMasteryStage } from "@/src/components/lesson/mastery/StandardMasteryStage";
import { StandardProgressStage } from "@/src/components/lesson/progress/StandardProgressStage";
import { StandardRewardStage } from "@/src/components/lesson/reward/StandardRewardStage";
import { getLearningTopicId } from "@/src/data/learning-content";
import {
  numberVillageAssets,
  preschoolNumberVillage,
  type NumberChoice,
  type NumberStageType,
  type NumberVillageTopic,
} from "@/src/data/preschoolNumberVillage";
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
  awardNumberTopicReward,
  getNumberVillageProgress,
  markNumberMasteryComplete,
  markNumberStageComplete,
  markNumberTopicComplete,
  recordNumberAttempt,
} from "@/src/services/numberVillageProgressService";
import { speak } from "@/src/services/speechService";
import {
  isLessonTopicReplay,
  isLessonTopicRewardClaimed,
} from "@/src/utils/lessonProgression";

const STAGE_ORDER: NumberStageType[] = ["look", "tap", "try", "choose", "play"];
const POST_STAGE_ORDER = ["reward", "progress", "mastery"] as const;
const FLOW_STAGE_ORDER = [...STAGE_ORDER, ...POST_STAGE_ORDER] as const;
const STAGE_NAMES = ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY", "REWARD", "PROGRESS", "MASTERY"];
const LEARNING_STAGE_NAMES = STAGE_NAMES.slice(0, STAGE_ORDER.length);
const PRESCHOOL_PLAY_TIMER_SECONDS = 20;

type PostLearningStageType = (typeof POST_STAGE_ORDER)[number];
type NumberFlowStageType = NumberStageType | PostLearningStageType;
type Feedback = "correct" | "wrong" | "timeout" | null;

const LEGACY_STAGE_MAP: Record<NumberStageType, LearnerStageId> = {
  choose: "practice",
  look: "discover",
  play: "challenge",
  tap: "explore",
  try: "interact",
};

const NUMBER_STAGE_FROM_LEGACY: Partial<Record<LearnerStageId, NumberFlowStageType>> = {
  challenge: "play",
  discover: "look",
  explore: "tap",
  interact: "try",
  mastery: "mastery",
  practice: "choose",
  progress: "progress",
  reward: "reward",
};

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function resolveTopic(routeTopicId?: string): NumberVillageTopic | undefined {
  const raw = routeTopicId?.split(":").pop() ?? "";
  const normalized = normalize(raw);

  return preschoolNumberVillage.topics.find(
    (topic) => topic.id === normalized || normalize(topic.label) === normalized
  );
}

function isLearningStage(stage: NumberFlowStageType | undefined): stage is NumberStageType {
  return Boolean(stage && STAGE_ORDER.includes(stage as NumberStageType));
}

function makeChoice(value: number, correctNumeral: number): NumberChoice {
  const labels: Record<number, string> = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
  };

  return {
    id: `number-${value}`,
    isCorrect: value === correctNumeral,
    label: labels[value],
    numeral: value,
  };
}

function wrongFor(value: number) {
  return value === 10 ? 9 : value + 1;
}

function getNumberShellInstruction(
  currentStage: NumberFlowStageType,
  topic: NumberVillageTopic
) {
  if (currentStage === "look") {
    return `Look at ${topic.label}.`;
  }

  if (currentStage === "tap") {
    return "Tap and count.";
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

function getNumberShellFeedback({
  attemptLimitReached,
  chooseFeedback,
  currentStage,
  playFeedback,
  tryFeedback,
}: {
  attemptLimitReached: boolean;
  chooseFeedback: Feedback;
  currentStage: NumberFlowStageType;
  playFeedback: Feedback;
  tryFeedback: Feedback;
}): { message: string | null; type: LessonFeedbackType | null } {
  if (attemptLimitReached) {
    return { message: STANDARD_STAGE_FEEDBACK.limit, type: "limit" };
  }

  if (currentStage === "play") {
    if (playFeedback === "timeout") {
      return { message: STANDARD_STAGE_FEEDBACK.timeout, type: "timeout" };
    }

    return toNumberShellFeedback(playFeedback);
  }

  if (currentStage === "try") {
    return toNumberShellFeedback(tryFeedback);
  }

  if (currentStage === "choose") {
    return toNumberShellFeedback(chooseFeedback);
  }

  return { message: null, type: null };
}

function toNumberShellFeedback(
  feedback: Feedback
): { message: string | null; type: LessonFeedbackType | null } {
  if (feedback === "correct") {
    return { message: STANDARD_STAGE_FEEDBACK.success, type: "success" };
  }

  if (feedback === "wrong") {
    return { message: STANDARD_STAGE_FEEDBACK.wrong, type: "wrong" };
  }

  if (feedback === "timeout") {
    return { message: STANDARD_STAGE_FEEDBACK.timeout, type: "timeout" };
  }

  return { message: null, type: null };
}

export function NumberTopicStageScreen() {
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
  const topic = useMemo(() => resolveTopic(routeTopicId), [routeTopicId]);
  const [challengeTarget, setChallengeTarget] = useState(5);
  const canUseCloudProgress = canSyncLearnerProgressToCloud({ profile, user });
  const globalTopicId = topic
    ? getLearningTopicId(preschoolNumberVillage.worldId, topic.label)
    : "";
  const activeRewardClaimed = isLessonTopicRewardClaimed(learnerProgress, globalTopicId);
  const [stageIndex, setStageIndex] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [completedStages, setCompletedStages] = useState<NumberStageType[]>([]);
  const [tryFeedback, setTryFeedback] = useState<Feedback>(null);
  const [chooseFeedback, setChooseFeedback] = useState<Feedback>(null);
  const [playFeedback, setPlayFeedback] = useState<Feedback>(null);
  const [playCompleted, setPlayCompleted] = useState(false);
  const [isPlayLocked, setIsPlayLocked] = useState(false);
  const [attemptLimitReached, setAttemptLimitReached] = useState(false);
  const [hasTappedLookImage, setHasTappedLookImage] = useState(false);
  const [hasTappedTapImage, setHasTappedTapImage] = useState(false);
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
      .map((stage) => NUMBER_STAGE_FROM_LEGACY[stage])
      .filter((stage): stage is NumberFlowStageType => Boolean(stage));

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
        localFlowStages.filter((stage): stage is NumberStageType => isLearningStage(stage))
      );
      setStageIndex(nextIndex === -1 ? FLOW_STAGE_ORDER.length - 1 : Math.max(0, nextIndex));
      return;
    }

    if (!learner?.uid || !canUseCloudProgress) {
      setCompletedStages([]);
      setStageIndex(0);
      return;
    }

    getNumberVillageProgress(learner.uid)
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
    topic,
  ]);

  const activeStages = isReviewMode ? STAGE_ORDER : FLOW_STAGE_ORDER;
  const activeStageNames = isReviewMode ? LEARNING_STAGE_NAMES : STAGE_NAMES;
  const currentStage = activeStages[stageIndex];

  useEffect(() => {
    setTryFeedback(null);
    setChooseFeedback(null);
    resetPlayVisitState();
    setHasTappedLookImage(false);
    setHasTappedTapImage(false);

    if (topic?.id === "number-challenge" && activeStages[stageIndex] === "play") {
      setChallengeTarget(Math.floor(Math.random() * 10) + 1);
    }

    return undefined;
  }, [activeStages, resetPlayVisitState, stageIndex, topic]);

  const playRetryVisible =
    currentStage === "play" &&
    (playFeedback === "wrong" || playFeedback === "timeout") &&
    !attemptLimitReached;
  const restartCurrentTopicFromLook = useCallback(() => {
    clearWrongFeedbackTimeout();
    setTryFeedback(null);
    setChooseFeedback(null);
    resetPlayVisitState();
    setHasTappedLookImage(false);
    setHasTappedTapImage(false);
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

  const nextTopic = topic
    ? preschoolNumberVillage.topics.find((item) => item.order === topic.order + 1)
    : undefined;
  const targetCount =
    topic?.id === "number-challenge"
      ? challengeTarget
      : topic?.play.targetAppleCount ?? 1;
  const playChoices = useMemo(
    () => [makeChoice(targetCount, targetCount), makeChoice(wrongFor(targetCount), targetCount)],
    [targetCount]
  );
  const stageAlreadySaved = isLearningStage(currentStage)
    ? completedStages.includes(currentStage)
    : false;
  const canProceed =
    stageIndex >= STAGE_ORDER.length ||
    stageAlreadySaved ||
    (currentStage === "look" && hasTappedLookImage) ||
    (currentStage === "tap" && hasTappedTapImage) ||
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
    async (stage: NumberStageType) => {
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
        worldId: preschoolNumberVillage.worldId,
        xp: 0,
      });

      if (learner?.uid && canUseCloudProgress) {
        await markNumberStageComplete(learner.uid, topic.id, stage).catch(() => undefined);
      }
    },
    [canUseCloudProgress, globalTopicId, learner?.uid, markLessonStageCompleted, topic]
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
      await awardNumberTopicReward(
        learner.uid,
        topic.id,
        topic.reward.stars,
        topic.reward.xp
      ).catch(() => undefined);
    }
  }, [
    activeRewardClaimed,
    canUseCloudProgress,
    claimWorldReward,
    globalTopicId,
    isReviewMode,
    learner?.uid,
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
        worldId: preschoolNumberVillage.worldId,
        xp: 0,
      });
    },
    [globalTopicId, markLessonStageCompleted, topic]
  );

  const completeMastery = useCallback(async () => {
    if (!topic) {
      return;
    }

    savePostStage("mastery");
    markTopicMastered({
      nextUnlockedTopicId: nextTopic
        ? getLearningTopicId(preschoolNumberVillage.worldId, nextTopic.label)
        : undefined,
      title: topic.label,
      topicId: globalTopicId,
      worldId: preschoolNumberVillage.worldId,
      xp: 0,
    });

    if (learner?.uid && canUseCloudProgress) {
      await markNumberMasteryComplete(learner.uid, topic.id).catch(() => undefined);
    }
  }, [
    canUseCloudProgress,
    globalTopicId,
    learner?.uid,
    markTopicMastered,
    nextTopic,
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
          params: { topicId: getLearningTopicId(preschoolNumberVillage.worldId, nextTopic.label) },
        });
      } else {
        router.replace({
          pathname: APP_ROUTES.tabs.worldTopics as never,
          params: { worldId: preschoolNumberVillage.worldId },
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
          params: { worldId: preschoolNumberVillage.worldId },
        });
        return;
      }

      if (learner?.uid && canUseCloudProgress) {
        await markNumberTopicComplete(learner.uid, topic.id).catch(() => undefined);
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
    currentStage,
    isReviewMode,
    isTransitioning,
    learner?.uid,
    nextTopic,
    savePostStage,
    saveStage,
    stageIndex,
    topic,
  ]);

  const recordAttempt = useCallback(
    (stage: "try" | "choose" | "play") => {
      if (learner?.uid && topic && canUseCloudProgress) {
        void recordNumberAttempt(learner.uid, topic.id, stage).catch(() => undefined);
      }
    },
    [canUseCloudProgress, learner?.uid, topic]
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

  const handlePlayAnswer = useCallback(
    (choice: NumberChoice) => {
      if (isPlayLocked || playRetryVisible || attemptLimitReached || playCompleted) {
        return;
      }

      if (choice.isCorrect) {
        recordAttempt("play");
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
      recordAttempt,
    ]
  );

  if (loading) {
    return null;
  }

  if (!learner || !topic) {
    return <Redirect href={APP_ROUTES.tabs.play} />;
  }

  const actionLabel =
    currentStage === "play" && attemptLimitReached
      ? "Done"
      : currentStage === "reward"
        ? "Claim"
        : currentStage === "mastery"
          ? nextTopic
            ? "Next"
            : "Finish"
          : currentStage === "play"
            ? "Done"
            : "Next";
  const completedTopicCount = topic ? Math.min(preschoolNumberVillage.topics.length, topic.order) : 0;
  const previousCompletedTopicCount = Math.max(0, completedTopicCount - 1);
  const shellInstruction = getNumberShellInstruction(currentStage, topic);
  const shellFeedback = getNumberShellFeedback({
    attemptLimitReached,
    chooseFeedback,
    currentStage,
    playFeedback,
    tryFeedback,
  });

  return (
    <NumberStageShell
      actionLabel={actionLabel}
      backgroundImage={numberVillageAssets.backgroundImage}
      buttonPulse={currentStage === "play" && playCompleted}
      canProceed={canUseShellAction && !isTransitioning}
      feedbackMessage={shellFeedback.message}
      feedbackType={shellFeedback.type}
      instruction={shellInstruction}
      onClose={() =>
        router.replace({
          pathname: APP_ROUTES.tabs.worldTopics as never,
          params: { worldId: preschoolNumberVillage.worldId },
        })
      }
      onProceed={
        currentStage === "play" && attemptLimitReached
          ? handleBackToLook
          : handleProceed
      }
      progressIndex={Math.min(stageIndex + 1, activeStages.length)}
      stageName={activeStageNames[stageIndex] ?? "REWARD"}
      totalStages={activeStages.length}
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
            totalTopics={preschoolNumberVillage.topics.length}
          />
        ) : currentStage === "mastery" ? (
          <StandardMasteryStage
            hasNextTopic={Boolean(nextTopic)}
            nextTopicLabel={nextTopic?.label}
          />
        ) : currentStage === "look" ? (
          <LookStage onTapped={() => setHasTappedLookImage(true)} topic={topic} />
        ) : currentStage === "tap" ? (
          <TapStage onTapped={() => setHasTappedTapImage(true)} topic={topic} />
        ) : currentStage === "try" ? (
          <TryStage
            onAnswer={(choice) => {
              recordAttempt("try");
              setTryFeedback(choice.isCorrect ? "correct" : "wrong");
              if (choice.isCorrect) {
                return;
              }
            }}
            topic={topic}
          />
        ) : currentStage === "choose" ? (
          <ChooseStage
            onAnswer={(choice) => {
              recordAttempt("choose");
              setChooseFeedback(choice.isCorrect ? "correct" : "wrong");
              if (choice.isCorrect) {
                return;
              }
            }}
            topic={topic}
          />
        ) : (
          <PlayStage
            attemptLimitReached={attemptLimitReached}
            choices={playChoices}
            disabled={isPlayLocked || playRetryVisible || attemptLimitReached}
            feedback={playFeedback}
            isCompleted={playCompleted}
            onAnswer={handlePlayAnswer}
            onRetry={handlePlayRetry}
            showTryAgain={playRetryVisible}
            targetCount={targetCount}
            timerRemaining={timerRemaining}
            topic={topic}
            wrongImage={numberVillageAssets.wrongImage}
          />
        )}
      </Animated.View>
    </NumberStageShell>
  );
}
