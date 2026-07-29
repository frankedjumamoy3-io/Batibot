import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";

import { PersonalProgressCard } from "@/src/components/rank/PersonalProgressCard";
import { allBadges, allWorlds } from "@/src/data/learning-content";
import { getAvatarOptionByAssetKey, getAvatarOptionById } from "@/src/data/avatarOptions";
import { useCurrentLearner } from "@/src/hooks/useCurrentLearner";
import { APP_ROUTES } from "@/src/navigation/routes";
import { simpleStyles as baseStyles } from "@/src/screens/simple/simple-batibot.styles";
import { RANK_ASSETS } from "@/src/services/assets/assetResolver";
import {
  buildLocalLeaderboard,
  getGradeLeaderboardFromSnapshots,
  getLocalGradeLeaderboard,
  rankEntries,
  type LeaderboardEntry,
} from "@/src/services/leaderboardService";
import { gradeLevelToLearnerGradeLabel, formatGradeLabel } from "@/src/utils/gradeUtils";
import {
  getVisibleBadgesForLearner,
  getVisibleWorldsForLearner,
} from "@/src/utils/learningProgressUtils";

type RankMode = "grade" | "me";

export default function RankScreen() {
  const insets = useSafeAreaInsets();
  const { learner, loading, error } = useCurrentLearner();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<RankMode>("grade");
  const [rankLoading, setRankLoading] = useState(true);

  const visibleWorlds = useMemo(
    () => (learner ? getVisibleWorldsForLearner(allWorlds, learner) : []),
    [learner]
  );
  const visibleBadges = useMemo(
    () => (learner ? getVisibleBadgesForLearner(allBadges, learner) : []),
    [learner]
  );
  const currentWorld = learner?.currentWorldId
    ? visibleWorlds.find((world) => world.id === learner.currentWorldId)
    : undefined;
  const learnerRankIndex = learner
    ? leaderboard.findIndex((entry) => entry.uid === learner.uid)
    : -1;
  const learnerTopTenRank =
    learnerRankIndex >= 0 ? learnerRankIndex + 1 : undefined;

  useEffect(() => {
    if (!learner) {
      setRankLoading(false);
      setLeaderboard([]);
      return;
    }

    let active = true;
    const currentLearner = {
      curriculumLevel: gradeLevelToLearnerGradeLabel(learner.gradeLevel),
      avatar: learner.avatarAssetKey || learner.avatarId || learner.buddyEmoji,
      displayName: learner.displayName,
      isTestAccount: learner.isTestAccount,
      profilePhotoUrl: learner.profilePhotoUrl ?? learner.profileImageUrl ?? null,
      stars: learner.stars,
      uid: learner.uid,
      xp: learner.xp,
    };
    const currentLearnerFallback = () =>
      buildLocalLeaderboard(currentLearner, "level")
        .filter((entry) => entry.isCurrentLearner)
        .slice(0, 1);

    setRankLoading(true);

    void Promise.all([
      getGradeLeaderboardFromSnapshots(learner.gradeLevel, 10).catch((caughtError) => {
        console.warn("Rank leaderboard snapshots unavailable.", caughtError);
        return [];
      }),
      getLocalGradeLeaderboard(learner.gradeLevel, {
        currentLearnerUid: learner.uid,
        maxEntries: 10,
      }).catch((caughtError) => {
        console.warn("Local leaderboard profiles unavailable.", caughtError);
        return [];
      }),
    ])
      .then(([cloudEntries, localEntries]) => {
        if (!active) {
          return;
        }

        const entriesByUid = new Map<string, LeaderboardEntry>();

        [...cloudEntries, ...localEntries].forEach((entry) => {
          entriesByUid.set(entry.uid, {
            ...entry,
            isCurrentLearner:
              entry.isCurrentLearner === true || entry.uid === learner.uid,
          });
        });

        const entries = rankEntries([...entriesByUid.values()]).slice(0, 10);

        setLeaderboard(entries.length ? entries : currentLearnerFallback());
      })
      .finally(() => {
        if (active) {
          setRankLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [learner]);

  if (loading) {
    return <StateScreen message="Loading rankings..." />;
  }

  if (error || !learner) {
    console.error(error);
    return <StateScreen message="We could not load your profile." />;
  }

  return (
    <View style={baseStyles.page}>
      <ImageBackground
        source={RANK_ASSETS.background}
        resizeMode="cover"
        style={rankStyles.background}
      >
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={[
            rankStyles.content,
            { paddingBottom: insets.bottom + 128, paddingTop: insets.top + 26 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityLabel="Close rank"
            accessibilityRole="button"
            onPress={() => router.push(APP_ROUTES.tabs.play)}
            style={rankStyles.closeButton}
          >
            <Ionicons name="close" size={30} color="#7C2EF2" />
          </Pressable>

          <View style={rankStyles.segmentedControl}>
            <SegmentButton
              active={mode === "grade"}
              label={formatGradeLabel(learner.gradeLevel)}
              onPress={() => setMode("grade")}
            />
            <SegmentButton
              active={mode === "me"}
              label="Me"
              onPress={() => setMode("me")}
            />
          </View>

          {mode === "grade" ? (
            <GradeLeaderboard
              entries={leaderboard}
              gradeLabel={formatGradeLabel(learner.gradeLevel)}
              loading={rankLoading}
              learnerUid={learner.uid}
            />
          ) : (
            <MyProgress
              achievementsCount={learner.achievements.length}
              badgesCount={learner.badges.length}
              completedTopicsCount={learner.completedTopics.length}
              currentWorldTitle={currentWorld?.title}
              learner={learner}
              rank={learnerTopTenRank}
              totalBadgesInGrade={visibleBadges.length}
              totalWorldsInGrade={visibleWorlds.length}
            />
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function getLeaderboardAvatarSource(entry: Pick<LeaderboardEntry, "avatar" | "profilePhotoUrl">) {
  if (entry.profilePhotoUrl) {
    return { uri: entry.profilePhotoUrl };
  }

  return (
    getAvatarOptionByAssetKey(entry.avatar)?.localSource ??
    getAvatarOptionById(entry.avatar)?.localSource ??
    null
  );
}

function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[rankStyles.segmentButton, active && rankStyles.segmentButtonActive]}
    >
      <Text style={[rankStyles.segmentText, active && rankStyles.segmentTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function GradeLeaderboard({
  entries,
  gradeLabel,
  learnerUid,
  loading,
}: {
  entries: LeaderboardEntry[];
  gradeLabel: string;
  learnerUid: string;
  loading: boolean;
}) {
  const topOne = entries[0];
  const topTwo = entries[1];
  const topThree = entries[2];
  const rowEntries = entries.slice(3, 10);

  return (
    <>
      <View style={rankStyles.titlePill}>
        <Text style={rankStyles.titleText}>{gradeLabel} Ranking</Text>
        <Text style={rankStyles.subtitleText}>Top players in your grade</Text>
      </View>

      <View style={rankStyles.podiumStage}>
        {topTwo ? <PodiumSpot entry={topTwo} learnerUid={learnerUid} place={2} /> : null}
        {topOne ? (
          <PodiumSpot entry={topOne} learnerUid={learnerUid} place={1} primary />
        ) : null}
        {topThree ? <PodiumSpot entry={topThree} learnerUid={learnerUid} place={3} /> : null}
      </View>

      {loading ? (
        <View style={rankStyles.emptyPanel}>
          <Text style={rankStyles.emptyText}>Loading rankings...</Text>
        </View>
      ) : entries.length ? (
        <View style={rankStyles.leaderboardList}>
          {rowEntries.map((entry) => (
            <LeaderboardRow
              current={entry.uid === learnerUid || entry.isCurrentLearner === true}
              entry={entry}
              key={entry.uid}
            />
          ))}
          {entries.length <= 3 ? (
            <View style={rankStyles.emptyPanel}>
              <Text style={rankStyles.emptyText}>
                More players will appear after they play.
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={rankStyles.emptyPanel}>
          <Text style={rankStyles.emptyText}>Play to join</Text>
        </View>
      )}
    </>
  );
}

function PodiumSpot({
  entry,
  learnerUid,
  place,
  primary,
}: {
  entry: LeaderboardEntry;
  learnerUid: string;
  place: 1 | 2 | 3;
  primary?: boolean;
}) {
  const current = entry.uid === learnerUid || entry.isCurrentLearner === true;
  const avatarSource = getLeaderboardAvatarSource(entry);

  return (
    <View style={[rankStyles.podiumSpot, primary && rankStyles.podiumSpotPrimary]}>
      <View style={rankStyles.podiumAvatar}>
        {avatarSource ? (
          <Image
            accessibilityIgnoresInvertColors
            contentFit="contain"
            source={avatarSource}
            style={primary ? rankStyles.podiumAvatarImagePrimary : rankStyles.podiumAvatarImage}
          />
        ) : (
          <Ionicons name="person" size={primary ? 32 : 26} color="#111827" />
        )}
      </View>
      <View style={[rankStyles.podiumBlock, primary && rankStyles.podiumBlockPrimary]}>
        <Text style={rankStyles.podiumPlace}>{place}</Text>
      </View>
      <Text numberOfLines={1} style={[rankStyles.podiumName, primary && rankStyles.podiumNamePrimary]}>
        {current ? "Me" : entry.displayName}
      </Text>
      <View style={rankStyles.podiumScoreRow}>
        <Ionicons name="star" size={18} color="#FACC15" />
        <Text style={rankStyles.podiumScore}>{entry.stars}</Text>
      </View>
    </View>
  );
}

function LeaderboardRow({
  current,
  entry,
}: {
  current: boolean;
  entry: LeaderboardEntry;
}) {
  const avatarSource = getLeaderboardAvatarSource(entry);

  return (
    <View style={[rankStyles.leaderboardRow, current && rankStyles.leaderboardRowCurrent]}>
      <Text style={rankStyles.leaderboardRank}>{entry.rank}</Text>
      <View style={rankStyles.leaderboardAvatar}>
        {avatarSource ? (
          <Image
            accessibilityIgnoresInvertColors
            contentFit="contain"
            source={avatarSource}
            style={rankStyles.leaderboardAvatarImage}
          />
        ) : (
          <Ionicons name="person" size={22} color="#111827" />
        )}
      </View>
      <Text numberOfLines={1} style={rankStyles.leaderboardName}>
        {current ? "Me" : entry.displayName}
      </Text>
      <View style={rankStyles.starRow}>
        <Ionicons name="star" size={24} color="#FACC15" />
        <Text style={rankStyles.starText}>{entry.stars}</Text>
      </View>
    </View>
  );
}

function MyProgress({
  achievementsCount,
  badgesCount,
  completedTopicsCount,
  currentWorldTitle,
  learner,
  rank,
  totalBadgesInGrade,
  totalWorldsInGrade,
}: {
  achievementsCount: number;
  badgesCount: number;
  completedTopicsCount: number;
  currentWorldTitle?: string;
  learner: NonNullable<ReturnType<typeof useCurrentLearner>["learner"]>;
  rank?: number;
  totalBadgesInGrade: number;
  totalWorldsInGrade: number;
}) {
  const worldPercent = getPercent(learner.completedWorlds.length, totalWorldsInGrade);
  const badgePercent = getPercent(badgesCount, totalBadgesInGrade);

  return (
    <>
      <View style={rankStyles.titlePill}>
        <Text style={rankStyles.titleText}>My Progress</Text>
        <Text style={rankStyles.subtitleText}>{learner.displayName}</Text>
      </View>
      <PersonalProgressCard
        learner={learner}
        rank={rank}
        totalBadgesInGrade={totalBadgesInGrade}
        totalWorldsInGrade={totalWorldsInGrade}
      />
      <View style={rankStyles.progressGrid}>
        <ProgressStat icon="flash" label="XP" value={`${learner.xp}`} />
        <ProgressStat icon="star" label="Stars" value={`${learner.stars}`} />
        <ProgressStat icon="map" label="Topics" value={`${completedTopicsCount}`} />
        <ProgressStat icon="ribbon" label="Badges" value={`${badgesCount}`} />
      </View>
      <ProgressBarCard
        label="Worlds"
        percent={worldPercent}
        value={`${learner.completedWorlds.length}/${totalWorldsInGrade}`}
      />
      <ProgressBarCard
        label="Badges"
        percent={badgePercent}
        value={`${badgesCount}/${totalBadgesInGrade}`}
      />
      <View style={rankStyles.nextGoalCard}>
        <Ionicons name="flag" size={28} color="#FACC15" />
        <View style={rankStyles.nextGoalTextWrap}>
          <Text style={rankStyles.nextGoalLabel}>Next Goal</Text>
          <Text style={rankStyles.nextGoalValue}>
            {currentWorldTitle ? `Finish ${currentWorldTitle}` : "Keep playing"}
          </Text>
          <Text style={rankStyles.nextGoalSub}>
            Achievements: {achievementsCount}
          </Text>
        </View>
      </View>
    </>
  );
}

function ProgressStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={rankStyles.progressStat}>
      <Ionicons name={icon} size={25} color="#6B21F2" />
      <Text style={rankStyles.progressStatValue}>{value}</Text>
      <Text style={rankStyles.progressStatLabel}>{label}</Text>
    </View>
  );
}

function ProgressBarCard({
  label,
  percent,
  value,
}: {
  label: string;
  percent: number;
  value: string;
}) {
  return (
    <View style={rankStyles.progressBarCard}>
      <View style={rankStyles.progressBarHeader}>
        <Text style={rankStyles.progressBarLabel}>{label}</Text>
        <Text style={rankStyles.progressBarValue}>{value}</Text>
      </View>
      <View style={rankStyles.progressTrack}>
        <View style={[rankStyles.progressFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

function getPercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function StateScreen({ message }: { message: string }) {
  return (
    <View style={baseStyles.page}>
      <ImageBackground
        source={RANK_ASSETS.background}
        resizeMode="cover"
        style={rankStyles.background}
      >
        <View style={rankStyles.stateWrap}>
          <Text style={rankStyles.emptyText}>{message}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const rankStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  closeButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#050505",
    borderColor: "#B8FFD8",
    borderRadius: 999,
    borderWidth: 2,
    height: 50,
    justifyContent: "center",
    marginRight: 10,
    width: 50,
  },
  content: {
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
  },
  emptyPanel: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 16,
    borderWidth: 3,
    maxWidth: 340,
    padding: 14,
    width: "100%",
  },
  emptyText: {
    color: "#44239A",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
    textAlign: "center",
  },
  leaderboardAvatar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EDE9FE",
    borderRadius: 999,
    borderWidth: 2,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  leaderboardAvatarImage: {
    height: 34,
    width: 34,
  },
  leaderboardList: {
    gap: 8,
    maxWidth: 340,
    width: "100%",
  },
  leaderboardName: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    minWidth: 0,
  },
  leaderboardRank: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    width: 30,
  },
  leaderboardRow: {
    alignItems: "center",
    backgroundColor: "rgba(107,33,242,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 16,
    borderWidth: 3,
    flexDirection: "row",
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  leaderboardRowCurrent: {
    backgroundColor: "#22C55E",
    borderColor: "#B8FFD8",
  },
  nextGoalCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    flexDirection: "row",
    gap: 12,
    maxWidth: 340,
    padding: 14,
    width: "100%",
  },
  nextGoalLabel: {
    color: "#6B21F2",
    fontSize: 13,
    fontWeight: "900",
  },
  nextGoalSub: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
  },
  nextGoalTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  nextGoalValue: {
    color: "#44239A",
    fontSize: 18,
    fontWeight: "900",
  },
  podiumAvatar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  podiumAvatarImage: {
    height: 34,
    width: 34,
  },
  podiumAvatarImagePrimary: {
    height: 40,
    width: 40,
  },
  podiumBlock: {
    alignItems: "center",
    backgroundColor: "#FACC15",
    borderColor: "#F59E0B",
    borderRadius: 6,
    borderWidth: 2,
    height: 54,
    justifyContent: "center",
    width: 68,
  },
  podiumBlockPrimary: {
    height: 76,
    width: 82,
  },
  podiumName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    maxWidth: 90,
    textAlign: "center",
  },
  podiumNamePrimary: {
    fontSize: 18,
  },
  podiumPlace: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  podiumScore: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  podiumScoreRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  podiumSpot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  podiumSpotPrimary: {
    flex: 1.1,
  },
  podiumStage: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 6,
    maxWidth: 340,
    minHeight: 210,
    paddingHorizontal: 4,
    width: "100%",
  },
  progressBarCard: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    maxWidth: 340,
    padding: 14,
    width: "100%",
  },
  progressBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressBarLabel: {
    color: "#44239A",
    fontSize: 16,
    fontWeight: "900",
  },
  progressBarValue: {
    color: "#6B21F2",
    fontSize: 16,
    fontWeight: "900",
  },
  progressFill: {
    backgroundColor: "#6B21F2",
    borderRadius: 999,
    height: "100%",
  },
  progressGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    maxWidth: 340,
    width: "100%",
  },
  progressStat: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    flexBasis: "47%",
    flexGrow: 1,
    padding: 12,
  },
  progressStatLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "900",
  },
  progressStatValue: {
    color: "#44239A",
    fontSize: 22,
    fontWeight: "900",
  },
  progressTrack: {
    backgroundColor: "#EDE9FE",
    borderRadius: 999,
    height: 14,
    overflow: "hidden",
  },
  segmentButton: {
    alignItems: "center",
    backgroundColor: "rgba(107,33,242,0.72)",
    borderColor: "#8B5CF6",
    borderRadius: 999,
    borderWidth: 3,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  segmentButtonActive: {
    backgroundColor: "#3B158F",
    borderColor: "#B8FFD8",
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 14,
    maxWidth: 280,
    width: "100%",
  },
  segmentText: {
    color: "#EDE9FE",
    fontSize: 14,
    fontWeight: "900",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  starRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  starText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
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
  subtitleText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  titlePill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    maxWidth: 340,
    paddingHorizontal: 22,
    paddingVertical: 12,
    width: "100%",
  },
  titleText: {
    color: "#44239A",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
});
