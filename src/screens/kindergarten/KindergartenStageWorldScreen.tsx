import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  PreschoolStageWorldConfig,
  PreschoolStageWorldTopic,
} from "@/src/data/preschoolStageWorldTypes";
import { getLearningTopicId } from "@/src/data/learning-content";
import { APP_ROUTES } from "@/src/navigation/routes";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";
import { simpleStyles as baseStyles } from "@/src/screens/simple/simple-batibot.styles";
import { isLessonTopicCompleteForUnlock } from "@/src/utils/lessonProgression";

type KindergartenStageWorldScreenProps = {
  config: PreschoolStageWorldConfig;
};

export function KindergartenStageWorldScreen({
  config,
}: KindergartenStageWorldScreenProps) {
  const insets = useSafeAreaInsets();
  const { progress } = useLearnerProgress();
  const masteredCount = config.topics.filter((topic) =>
    progress.masteredTopics[getLearningTopicId(config.worldId, topic.label)]
  ).length;
  const isAlphabet = config.worldId === "kindergarten-alphabet";

  return (
    <View style={baseStyles.page}>
      <ImageBackground source={config.backgroundImage} resizeMode="cover" style={styles.background}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 132, paddingTop: insets.top + 20 },
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
            <View style={styles.headerCopy}>
              <Text numberOfLines={2} style={styles.title}>
                {config.title}
              </Text>
              <Text style={styles.subtitle}>
                {masteredCount} / {config.topics.length} mastered
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(6, (masteredCount / config.topics.length) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={isAlphabet ? styles.letterGrid : styles.topicList}>
            {config.topics.map((topic, index) => (
              <TopicCard
                config={config}
                isAlphabet={isAlphabet}
                index={index}
                key={topic.id}
                topic={topic}
              />
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function TopicCard({
  config,
  index,
  isAlphabet,
  topic,
}: {
  config: PreschoolStageWorldConfig;
  index: number;
  isAlphabet: boolean;
  topic: PreschoolStageWorldTopic;
}) {
  const { progress } = useLearnerProgress();
  const topicRewardId = getLearningTopicId(config.worldId, topic.label);
  const previousTopic = config.topics[index - 1];
  const previousRewardId = previousTopic
    ? getLearningTopicId(config.worldId, previousTopic.label)
    : undefined;
  const mastered = Boolean(progress.masteredTopics[topicRewardId]);
  const completed = isLessonTopicCompleteForUnlock(progress, topicRewardId);
  const unlocked =
    index === 0 ||
    mastered ||
    (previousRewardId ? isLessonTopicCompleteForUnlock(progress, previousRewardId) : false);
  const statusIcon = mastered ? "star" : completed ? "checkmark" : unlocked ? "play" : "lock-closed";
  const statusColor = mastered ? "#F59E0B" : completed ? "#22C55E" : unlocked ? "#681BF2" : "#94A3B8";

  return (
    <Pressable
      accessibilityLabel={`${topic.label}${unlocked ? "" : ", locked"}`}
      accessibilityRole="button"
      disabled={!unlocked}
      onPress={() =>
        router.push({
          pathname: APP_ROUTES.lesson.topic as never,
          params: { topicId: topicRewardId },
        })
      }
      style={[
        isAlphabet ? styles.letterCard : styles.topicCard,
        unlocked && styles.unlockedCard,
        completed && styles.completedCard,
        mastered && styles.masteredCard,
        !unlocked && styles.lockedCard,
      ]}
    >
      {topic.look.symbol ? (
        <>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.letterUpper}>
            {topic.look.symbol}
          </Text>
          {isAlphabet ? (
            <Text style={styles.letterLower}>{topic.look.symbol.toLowerCase()}</Text>
          ) : null}
        </>
      ) : (
        <Image resizeMode="contain" source={topic.look.image} style={styles.topicImage} />
      )}
      {!isAlphabet ? (
        <Text numberOfLines={2} style={styles.topicTitle}>
          {topic.label}
        </Text>
      ) : null}
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Ionicons name={statusIcon} size={16} color="#FFFFFF" />
      </View>
    </Pressable>
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
  completedCard: {
    borderColor: "#22C55E",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#681BF2",
    borderRadius: 16,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    maxWidth: 360,
    padding: 12,
    width: "100%",
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  letterCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7C7FF",
    borderRadius: 14,
    borderWidth: 3,
    height: 96,
    justifyContent: "center",
    padding: 8,
    width: "22%",
  },
  letterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
    maxWidth: 360,
    width: "100%",
  },
  letterLower: {
    color: "#681BF2",
    fontSize: 16,
    fontWeight: "900",
  },
  letterUpper: {
    color: "#111827",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
  },
  lockedCard: {
    opacity: 0.48,
  },
  masteredCard: {
    borderColor: "#F59E0B",
  },
  progressFill: {
    backgroundColor: "#681BF2",
    borderRadius: 999,
    height: "100%",
  },
  progressTrack: {
    backgroundColor: "#E9DFFC",
    borderRadius: 999,
    height: 10,
    marginTop: 8,
    overflow: "hidden",
    width: "100%",
  },
  statusBadge: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 6,
    top: 6,
    width: 28,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "900",
  },
  title: {
    color: "#44239A",
    fontSize: 22,
    fontWeight: "900",
  },
  topicCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7C7FF",
    borderRadius: 16,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    minHeight: 88,
    padding: 10,
    width: "100%",
  },
  topicImage: {
    height: 62,
    width: 72,
  },
  topicList: {
    gap: 10,
    marginTop: 16,
    maxWidth: 360,
    width: "100%",
  },
  topicTitle: {
    color: "#44239A",
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
  },
  unlockedCard: {
    borderColor: "#681BF2",
  },
});
