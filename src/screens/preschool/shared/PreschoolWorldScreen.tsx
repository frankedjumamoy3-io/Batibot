import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getLearningTopicId } from "@/src/data/learning-content";
import type { PreschoolStageWorldConfig } from "@/src/data/preschoolStageWorldTypes";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { canSyncLearnerProgressToCloud } from "@/src/services/learnerCloudSyncEligibility";
import {
  getPreschoolWorldProgress,
  type PreschoolWorldProgress,
} from "@/src/services/preschoolWorldProgressService";
import { isLessonTopicCompleteForUnlock } from "@/src/utils/lessonProgression";
import { playTapFeedback } from "@/src/services/soundEffectsService";

type PreschoolWorldScreenProps = {
  config: PreschoolStageWorldConfig;
};

export function PreschoolWorldScreen({ config }: PreschoolWorldScreenProps) {
  const insets = useSafeAreaInsets();
  const { learner, loading } = useCurrentLearner();
  const { profile, user } = useCurrentUserProfile();
  const { progress: learnerProgress } = useLearnerProgress();
  const [progress, setProgress] = useState<PreschoolWorldProgress | null>(null);
  const canUseCloudProgress = canSyncLearnerProgressToCloud({ profile, user });
  const progressDefinition = useMemo(
    () => ({
      topicOrder: config.topics.map((topic) => topic.id),
      worldId: config.worldId,
    }),
    [config]
  );

  useEffect(() => {
    if (!learner?.uid || !canUseCloudProgress) {
      setProgress(null);
      return;
    }

    getPreschoolWorldProgress(learner.uid, progressDefinition)
      .then(setProgress)
      .catch(() => setProgress(null));
  }, [canUseCloudProgress, learner?.uid, progressDefinition]);

  const completedTopics = useMemo(
    () => {
      const cloudCompleted = progress?.completedTopics ?? [];
      const localCompleted = config.topics
        .filter(
          (topic) =>
            isLessonTopicCompleteForUnlock(
              learnerProgress,
              getLearningTopicId(config.worldId, topic.label)
            )
        )
        .map((topic) => topic.id);

      return new Set([...cloudCompleted, ...localCompleted]);
    },
    [
      config.topics,
      config.worldId,
      learnerProgress,
      progress?.completedTopics,
    ]
  );

  if (loading || !learner) {
    return <StateScreen backgroundImage={config.backgroundImage} message="Loading..." />;
  }

  return (
    <ImageBackground source={config.backgroundImage} resizeMode="cover" style={styles.background}>
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 132, paddingTop: insets.top + 22 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to Play"
            accessibilityRole="button"
            onPress={() => {
              void playTapFeedback();
              router.replace(APP_ROUTES.tabs.play);
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerText}>
            <Text numberOfLines={2} style={styles.title}>
              {config.title}
            </Text>
            <Text style={styles.subtitle}>Choose a topic.</Text>
          </View>
        </View>

        <View style={styles.topicList}>
          {config.topics.map((topic, index) => {
            const previousTopic = config.topics[index - 1];
            const unlocked =
              learner.unlockAllQuizzes === true ||
              !previousTopic ||
              completedTopics.has(previousTopic.id);
            const completed = completedTopics.has(topic.id);

            return (
              <Pressable
                accessibilityLabel={`${topic.label}${unlocked ? "" : ", locked"}`}
                accessibilityRole="button"
                disabled={!unlocked}
                key={topic.id}
                onPress={() => {
                  void playTapFeedback();
                  router.push({
                    pathname: APP_ROUTES.lesson.topic as never,
                    params: { topicId: getLearningTopicId(config.worldId, topic.label) },
                  });
                }}
                style={[styles.topicCard, !unlocked && styles.topicCardLocked]}
              >
                <Image resizeMode="contain" source={topic.look.image} style={styles.topicImage} />
                <View style={styles.topicCopy}>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.topicTitle}>
                    {topic.label}
                  </Text>
                  <Text style={styles.topicState}>
                    {completed ? "Done" : unlocked ? "Ready" : "Locked"}
                  </Text>
                </View>
                <View style={[styles.statusBadge, completed && styles.statusBadgeDone]}>
                  <Ionicons
                    name={completed ? "checkmark" : unlocked ? "play" : "lock-closed"}
                    size={17}
                    color={completed || unlocked ? "#FFFFFF" : "#681BF2"}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function StateScreen({
  backgroundImage,
  message,
}: {
  backgroundImage: PreschoolStageWorldConfig["backgroundImage"];
  message: string;
}) {
  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
      <View style={styles.stateWrap}>
        <Text style={styles.stateText}>{message}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#681BF2",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 3,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 16,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    maxWidth: 360,
    minHeight: 90,
    padding: 12,
    width: "100%",
  },
  headerText: {
    flex: 1,
  },
  stateText: {
    color: "#44239A",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  stateWrap: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 16,
    margin: 24,
    padding: 18,
  },
  statusBadge: {
    alignItems: "center",
    backgroundColor: "#22C55E",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  statusBadgeDone: {
    backgroundColor: "#F59E0B",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "900",
  },
  title: {
    color: "#44239A",
    fontSize: 24,
    fontWeight: "900",
  },
  topicCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 16,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    minHeight: 96,
    padding: 10,
    width: "100%",
  },
  topicCardLocked: {
    opacity: 0.58,
  },
  topicCopy: {
    flex: 1,
    minWidth: 0,
  },
  topicImage: {
    height: 66,
    width: 66,
  },
  topicList: {
    gap: 10,
    marginTop: 16,
    maxWidth: 360,
    width: "100%",
  },
  topicState: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "900",
  },
  topicTitle: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "900",
  },
});
