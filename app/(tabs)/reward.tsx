import { Ionicons } from "@expo/vector-icons";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, type ReactNode } from "react";

import { allAchievements, allBadges, allWorlds } from "@/src/data/learning-content";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { simpleStyles as baseStyles } from "@/src/screens/simple/simple-batibot.styles";
import { REWARD_ASSETS } from "@/src/services/assets/assetResolver";
import type { Achievement, Badge, LearnerProfile } from "@/src/types/learning";
import {
  getVisibleAchievementsForLearner,
  getVisibleBadgesForLearner,
  getVisibleWorldsForLearner,
} from "@/src/utils/learningProgressUtils";

function getAchievementValue(achievement: Achievement, learner: LearnerProfile) {
  switch (achievement.metric) {
    case "xp":
      return learner.xp;
    case "stars":
      return learner.stars;
    case "worldsCompleted":
      return learner.completedWorlds.length;
    case "lessonsCompleted":
    case "activitiesCompleted":
      return learner.completedTopics.length;
    case "perfectScores":
    case "streakDays":
    case "wordsLearned":
      return 0;
    default:
      return 0;
  }
}

function isBadgeUnlocked(badge: Badge, learner: LearnerProfile) {
  if (learner.badges.includes(badge.id)) {
    return true;
  }

  if (badge.id === "preschool-superstar") {
    const preschoolWorlds = allWorlds.filter((world) => world.gradeLevel === "preschool");
    return preschoolWorlds.every((world) => learner.completedWorlds.includes(world.id));
  }

  return !!badge.worldId && learner.completedWorlds.includes(badge.worldId);
}

export default function RewardScreen() {
  const insets = useSafeAreaInsets();
  const { learner, loading, error } = useCurrentLearner();
  const badges = useMemo(
    () => (learner ? getVisibleBadgesForLearner(allBadges, learner) : []),
    [learner]
  );
  const achievements = useMemo(
    () => (learner ? getVisibleAchievementsForLearner(allAchievements, learner) : []),
    [learner]
  );
  const visibleWorlds = useMemo(
    () => (learner ? getVisibleWorldsForLearner(allWorlds, learner) : []),
    [learner]
  );

  if (loading) {
    return <StateScreen message="Loading rewards..." />;
  }

  if (error || !learner) {
    console.error(error);
    return <StateScreen message="We could not load this page. Please try again." />;
  }

  const hasRewards = badges.length > 0 || achievements.length > 0;

  return (
    <View style={baseStyles.page}>
      <ImageBackground
        source={REWARD_ASSETS.background}
        resizeMode="cover"
        style={rewardStyles.background}
      >
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={[
            rewardStyles.content,
            { paddingBottom: insets.bottom + 132, paddingTop: insets.top + 28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={rewardStyles.heroPanel}>
            <View style={rewardStyles.heroIcon}>
              <Ionicons name="ribbon" size={28} color="#FFFFFF" />
            </View>
            <View style={rewardStyles.heroTextWrap}>
              <Text style={rewardStyles.heroTitle}>Rewards</Text>
              <Text numberOfLines={2} style={rewardStyles.heroText}>
                {learner.stars} stars, {learner.completedWorlds.length}/{visibleWorlds.length} worlds
              </Text>
            </View>
          </View>

          {!hasRewards ? (
            <View style={rewardStyles.emptyPanel}>
              <Text style={rewardStyles.emptyText}>No rewards available yet.</Text>
            </View>
          ) : (
            <>
              <RewardSection title="Badges" count={badges.length}>
                {badges.map((badge) => (
                  <BadgeTile
                    key={badge.id}
                    badge={badge}
                    unlocked={isBadgeUnlocked(badge, learner)}
                  />
                ))}
              </RewardSection>

              <RewardSection title="Achievements" count={achievements.length}>
                {achievements.map((achievement) => {
                  const value = getAchievementValue(achievement, learner);
                  const unlocked =
                    learner.achievements.includes(achievement.id) ||
                    value >= achievement.targetValue;

                  return (
                    <AchievementTile
                      key={achievement.id}
                      achievement={achievement}
                      progressValue={value}
                      unlocked={unlocked}
                    />
                  );
                })}
              </RewardSection>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function RewardSection({
  children,
  count,
  title,
}: {
  children: ReactNode;
  count: number;
  title: string;
}) {
  return (
    <View style={rewardStyles.section}>
      <View style={rewardStyles.sectionHeader}>
        <Text style={rewardStyles.heading}>{title}</Text>
        <Text style={rewardStyles.sectionCount}>{count}</Text>
      </View>
      <View style={rewardStyles.cardGrid}>{children}</View>
    </View>
  );
}

function BadgeTile({
  badge,
  unlocked,
}: {
  badge: Badge;
  unlocked: boolean;
}) {
  return (
    <View style={[rewardStyles.rewardTile, unlocked && rewardStyles.rewardTileUnlocked]}>
      <View style={[rewardStyles.rewardIconWrap, unlocked && rewardStyles.rewardIconUnlocked]}>
        <Ionicons
          name={unlocked ? "checkmark-circle" : "lock-closed"}
          size={24}
          color="#FFFFFF"
        />
      </View>
      <Text numberOfLines={2} adjustsFontSizeToFit style={rewardStyles.rewardTitle}>
        {badge.title}
      </Text>
      <Text numberOfLines={2} style={rewardStyles.rewardDescription}>
        {unlocked ? "Unlocked" : badge.requirement}
      </Text>
    </View>
  );
}

function AchievementTile({
  achievement,
  progressValue,
  unlocked,
}: {
  achievement: Achievement;
  progressValue: number;
  unlocked: boolean;
}) {
  const percentage = Math.min(
    100,
    Math.round((progressValue / Math.max(achievement.targetValue, 1)) * 100)
  );

  return (
    <View style={[rewardStyles.rewardTile, unlocked && rewardStyles.rewardTileUnlocked]}>
      <View style={[rewardStyles.rewardIconWrap, unlocked && rewardStyles.rewardIconUnlocked]}>
        <Ionicons name={unlocked ? "trophy" : "lock-closed"} size={24} color="#FFFFFF" />
      </View>
      <Text numberOfLines={2} adjustsFontSizeToFit style={rewardStyles.rewardTitle}>
        {achievement.title}
      </Text>
      <Text numberOfLines={2} style={rewardStyles.rewardDescription}>
        {unlocked ? "Unlocked" : achievement.requirement}
      </Text>
      <View style={rewardStyles.rewardProgressTrack}>
        <View style={[rewardStyles.rewardProgressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

function StateScreen({ message }: { message: string }) {
  return (
    <View style={baseStyles.page}>
      <ImageBackground
        source={REWARD_ASSETS.background}
        resizeMode="cover"
        style={rewardStyles.background}
      >
        <View style={rewardStyles.stateWrap}>
          <Text style={rewardStyles.emptyText}>{message}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const rewardStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  content: {
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
  },
  emptyPanel: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 16,
    borderWidth: 3,
    maxWidth: 330,
    padding: 14,
    width: "100%",
  },
  emptyText: {
    color: "#44239A",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
    textAlign: "center",
  },
  heading: {
    color: "#6B21F2",
    flex: 1,
    fontSize: 23,
    fontWeight: "900",
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#6B21F2",
    borderRadius: 999,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  heroPanel: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    maxWidth: 330,
    minHeight: 82,
    padding: 12,
    width: "100%",
  },
  heroText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
  },
  heroTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: "#44239A",
    fontSize: 24,
    fontWeight: "900",
  },
  rewardDescription: {
    color: "#E0E7FF",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
    minHeight: 24,
    textAlign: "center",
  },
  rewardIconUnlocked: {
    backgroundColor: "#22C55E",
  },
  rewardIconWrap: {
    alignItems: "center",
    backgroundColor: "#44239A",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  rewardProgressFill: {
    backgroundColor: "#35E79E",
    borderRadius: 999,
    height: "100%",
  },
  rewardProgressTrack: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 999,
    height: 6,
    marginTop: 4,
    overflow: "hidden",
    width: "82%",
  },
  rewardTile: {
    alignItems: "center",
    backgroundColor: "#625ED1",
    borderColor: "#6B4AF2",
    borderRadius: 14,
    borderWidth: 3,
    height: 132,
    justifyContent: "center",
    paddingHorizontal: 7,
    width: 100,
  },
  rewardTileUnlocked: {
    backgroundColor: "#514BC8",
    borderColor: "#22C55E",
  },
  rewardTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 6,
    minHeight: 28,
    textAlign: "center",
  },
  section: {
    gap: 10,
    maxWidth: 330,
    width: "100%",
  },
  sectionCount: {
    color: "#44239A",
    fontSize: 14,
    fontWeight: "900",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  stateWrap: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    margin: 24,
    padding: 18,
  },
});
