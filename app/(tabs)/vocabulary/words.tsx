import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AnimatedAchievementCard } from "@/components/animation/animated-achievement-card";
import { AnimatedLessonCard } from "@/components/animation/animated-lesson-card";
import { AnimatedMascot } from "@/components/animation/animated-mascot";
import { AnimatedWorldNode } from "@/components/animation/animated-world-node";
import { AnimatedXPBar } from "@/components/animation/animated-xp-bar";
import { useCurrentUserProfile } from "@/src/presentation/hooks/use-current-user-profile";
import {
  ACTIVE_LEARNING_PHASES,
  XP_REWARDS,
  getCurriculumForGrade,
  getExplorerRank,
  getWorldLearningTopics,
} from "@/src/data/curriculum/learning-path";
import {
  resolveTopicAssetSource as getTopicImage,
  resolveWorldAssetSource as getWorldImage,
} from "@/src/services/assets/assetResolver";
import { getGradeVocabularyItemByWord } from "@/src/data/learner-module";
import {
  isVocabularyItemViewed,
  type VocabularyItem,
} from "@/src/data/vocabulary";
import { APP_ROUTES } from "@/src/navigation/routes";
import {
  SIMPLE_COLORS,
  simpleStyles as styles,
} from "@/src/screens/simple/simple-batibot.styles";
import {
  getLevelFromXP,
  getXPForNextLevel,
  getXPInCurrentLevel,
} from "@/src/store/gameStore";
import { useLearnerProgress } from "@/src/presentation/state/learner-progress-provider";

function getFirstName(name?: string | null, email?: string | null) {
  return name?.trim().split(" ")[0] || email?.split("@")[0] || "Learner";
}

function getTopicProgress(worldTopicIds: string[], viewedWordIds: string[]) {
  if (!worldTopicIds.length) {
    return 0;
  }

  const viewedCount = worldTopicIds.filter((id) => viewedWordIds.includes(id)).length;
  return Math.min((viewedCount / worldTopicIds.length) * 100, 100);
}

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useCurrentUserProfile();
  const { progress, markWordViewed } = useLearnerProgress();
  const firstName = getFirstName(profile?.displayName, profile?.email);
  const level = getLevelFromXP(progress.totalXp);
  const xpInLevel = getXPInCurrentLevel(progress.totalXp);
  const xpNeeded = getXPForNextLevel(level);
  const curriculum = getCurriculumForGrade(profile?.gradeLevel);

  return (
    <View style={styles.page}>
      <View style={[styles.topInset, { height: insets.top }]} />
      <ScrollView style={styles.surface} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={[styles.header, { paddingTop: 24 }]}>
          <View style={styles.headerBubbleLarge} />
          <View style={styles.headerBubbleSmall} />
          <View style={styles.headerRow}>
            <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
              <View style={styles.profileIcon}>
                <Text style={{ fontSize: 28 }}>🐱</Text>
              </View>
              <View>
                <Text style={styles.subtitle}>{curriculum.title}</Text>
                <Text style={styles.name}>{firstName}</Text>
              </View>
            </View>
            <View style={[styles.chip, { backgroundColor: SIMPLE_COLORS.orange }]}>
              <Ionicons name="star" size={16} color="#FFFFFF" />
              <Text style={styles.chipText}>{getExplorerRank(level)}</Text>
            </View>
          </View>
          <View style={styles.progressLine}>
            <Text style={styles.progressText}>Level {level}</Text>
            <Text style={styles.progressText}>{xpInLevel}/{xpNeeded} XP</Text>
          </View>
          <AnimatedXPBar progress={Math.min((xpInLevel / xpNeeded) * 100, 100)} />
        </View>

        <View style={styles.content}>
          <AnimatedMascot
            message="Choose a world, discover a topic, then complete the challenge for stars and XP."
            style={{ marginTop: 22 }}
          />

          <View style={[styles.sectionHeader, { marginTop: 26 }]}>
            <Text style={styles.sectionTitle}>Learning Worlds</Text>
            <Text style={{ color: SIMPLE_COLORS.purple, fontSize: 17, fontWeight: "900" }}>
              {curriculum.worlds.length} worlds
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14, paddingVertical: 18 }}
          >
            {curriculum.worlds.map((world, index) => (
              <AnimatedWorldNode
                key={world.id}
                accentColor={world.accentColor}
                emoji={world.emoji}
                isCurrent={index === 0}
                label={world.title}
              />
            ))}
          </ScrollView>

          <View style={{ gap: 18 }}>
            {curriculum.worlds.map((world, index) => {
              const learningTopics = getWorldLearningTopics(world);
              const worldImage = getWorldImage(world.id);
              const topicItems = learningTopics
                .map((topic) =>
                  getGradeVocabularyItemByWord({
                    category: topic.category,
                    gradeLevel: profile?.gradeLevel,
                    word: topic.title,
                  })
                )
                .filter((item): item is VocabularyItem => Boolean(item));
              const firstItem = topicItems[0];
              const worldProgress = getTopicProgress(
                topicItems.map((item) => item.id),
                progress.viewedWordIds
              );

              return (
                <AnimatedLessonCard
                  key={world.id}
                  delay={index * 70}
                  style={[styles.card, { padding: 20 }]}
                  onPress={() => {
                    if (firstItem) {
                      markWordViewed(firstItem.id, firstItem.word, firstItem.legacyIds);
                      router.push({
                        pathname: APP_ROUTES.tabs.vocabularyDetail,
                        params: { id: firstItem.id },
                      });
                    }
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: `${world.accentColor}24`, overflow: "hidden" },
                      ]}
                    >
                      {worldImage ? (
                        <Image
                          accessibilityLabel={world.title}
                          resizeMode="contain"
                          source={worldImage}
                          style={{ height: 66, width: 66 }}
                        />
                      ) : (
                        <Text style={{ fontSize: 34 }}>{world.emoji}</Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lessonTitle}>{world.title}</Text>
                      <Text style={styles.lessonMeta}>{world.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={26} color={SIMPLE_COLORS.purple} />
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <AnimatedXPBar
                      label={`${Math.round(worldProgress)}% mastery`}
                      progress={worldProgress}
                    />
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {ACTIVE_LEARNING_PHASES.map((phase) => (
                      <View
                        key={phase}
                        style={{
                          backgroundColor: SIMPLE_COLORS.purpleLight,
                          borderRadius: 999,
                          paddingHorizontal: 10,
                          paddingVertical: 7,
                        }}
                      >
                        <Text style={{ color: SIMPLE_COLORS.purple, fontSize: 12, fontWeight: "900" }}>
                          {phase}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{ gap: 10, marginTop: 16 }}>
                    {learningTopics.slice(0, 6).map((topic) => {
                      const item = getGradeVocabularyItemByWord({
                        category: topic.category,
                        gradeLevel: profile?.gradeLevel,
                        word: topic.title,
                      });
                      const topicImage = getTopicImage(world.id, topic.title);
                      const viewed = item ? isVocabularyItemViewed(item, progress.viewedWordIds) : false;

                      return (
                        <View
                          key={`${world.id}-${topic.title}`}
                          style={{
                            alignItems: "center",
                            backgroundColor: viewed ? "#ECFDF5" : "#F8FAFC",
                            borderRadius: 16,
                            flexDirection: "row",
                            gap: 12,
                            padding: 12,
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              backgroundColor: "#FFFFFF",
                              borderRadius: 14,
                              height: 48,
                              justifyContent: "center",
                              width: 48,
                            }}
                          >
                            {topicImage ? (
                              <Image
                                accessibilityLabel={topic.title}
                                resizeMode="contain"
                                source={topicImage}
                                style={{ height: 42, width: 42 }}
                              />
                            ) : (
                              <Text style={{ fontSize: 25 }}>{topic.emoji}</Text>
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: SIMPLE_COLORS.text, fontSize: 16, fontWeight: "900" }}>
                              {topic.title}
                            </Text>
                            <Text style={{ color: SIMPLE_COLORS.muted, fontSize: 12, fontWeight: "800" }}>
                              {topic.interactionTypes.slice(0, 2).join(" • ")}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 18 }}>{viewed ? "✅" : "⭐"}</Text>
                        </View>
                      );
                    })}
                  </View>
                </AnimatedLessonCard>
              );
            })}
          </View>

          <View style={{ marginTop: 20 }}>
            <AnimatedAchievementCard
              icon="🎁"
              title="Reward Rules"
              description={`View lesson +${XP_REWARDS.viewLesson} XP • Activity +${XP_REWARDS.completeActivity} XP • Perfect +${XP_REWARDS.perfectChallenge} XP • Mastery +${XP_REWARDS.masterTopic} XP`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
