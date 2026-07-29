import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getLearningTopicId } from "@/src/data/learning-content";
import { numberVillageAssets, preschoolNumberVillage } from "@/src/data/preschoolNumberVillage";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { isLessonTopicCompleteForUnlock } from "@/src/utils/lessonProgression";

export function NumberVillageScreen() {
  const insets = useSafeAreaInsets();
  const { learner, loading } = useCurrentLearner();
  const { progress } = useLearnerProgress();
  const completedTopics = useMemo(
    () =>
      new Set(
        preschoolNumberVillage.topics
          .filter((topic) =>
            isLessonTopicCompleteForUnlock(
              progress,
              getLearningTopicId(preschoolNumberVillage.worldId, topic.label)
            )
          )
          .map((topic) => topic.id)
      ),
    [progress]
  );

  if (loading || !learner) {
    return (
      <ImageBackground source={numberVillageAssets.backgroundImage} resizeMode="cover" style={styles.background}>
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={numberVillageAssets.backgroundImage} resizeMode="cover" style={styles.background}>
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
            onPress={() => router.replace(APP_ROUTES.tabs.play)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerText}>
            <Text numberOfLines={2} style={styles.title}>Number Village</Text>
            <Text style={styles.subtitle}>Choose a number.</Text>
          </View>
        </View>

        <View style={styles.topicList}>
          {preschoolNumberVillage.topics.map((topic, index) => {
            const previousTopic = preschoolNumberVillage.topics[index - 1];
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
                  router.push({
                    pathname: APP_ROUTES.lesson.topic as never,
                    params: { topicId: getLearningTopicId(preschoolNumberVillage.worldId, topic.label) },
                  });
                }}
                style={[styles.topicCard, !unlocked && styles.topicCardLocked]}
              >
                <View style={styles.numberBadge}>
                  <Text adjustsFontSizeToFit numberOfLines={1} style={styles.numberText}>
                    {topic.id === "number-challenge" ? "1-10" : topic.value}
                  </Text>
                </View>
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
  numberBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D6CAFF",
    borderRadius: 14,
    borderWidth: 2,
    height: 66,
    justifyContent: "center",
    width: 66,
  },
  numberText: {
    color: "#050505",
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
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
    color: "#44239A",
    fontSize: 21,
    fontWeight: "900",
  },
});
