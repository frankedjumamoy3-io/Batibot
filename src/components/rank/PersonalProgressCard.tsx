import { StyleSheet, Text, View } from "react-native";

import { LearnerAvatar } from "@/src/components/profile/LearnerAvatar";
import type { LearnerProfile } from "@/src/types/learning";
import { formatGradeLabel } from "@/src/utils/gradeUtils";

type PersonalProgressCardProps = {
  learner: LearnerProfile;
  totalWorldsInGrade: number;
  totalBadgesInGrade: number;
  rank?: number;
};

export function PersonalProgressCard({
  learner,
  totalWorldsInGrade,
  totalBadgesInGrade,
  rank,
}: PersonalProgressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <LearnerAvatar profile={learner} size="medium" />
        <View style={styles.headerText}>
          <Text style={styles.title}>{formatGradeLabel(learner.gradeLevel)} - Me</Text>
          <Text numberOfLines={1} style={styles.name}>{learner.displayName}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.metric}>XP: {learner.xp}</Text>
        <Text style={styles.metric}>Stars: {learner.stars}</Text>
      </View>
      <Text style={styles.detail}>
        Worlds Completed: {learner.completedWorlds.length}/{totalWorldsInGrade}
      </Text>
      <Text style={styles.detail}>
        Badges: {learner.badges.length}/{totalBadgesInGrade}
      </Text>
      {rank ? (
        <Text style={styles.rank}>Rank: #{rank}</Text>
      ) : (
        <Text style={styles.rank}>Rank: Not in Top 10</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderColor: "#D6CAFF",
    borderRadius: 18,
    borderWidth: 3,
    gap: 8,
    maxWidth: 340,
    padding: 14,
    width: "100%",
  },
  detail: {
    color: "#44239A",
    fontSize: 14,
    fontWeight: "900",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  metric: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  name: {
    color: "#6B21F2",
    fontSize: 15,
    fontWeight: "900",
  },
  rank: {
    color: "#6B21F2",
    fontSize: 15,
    fontWeight: "900",
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  title: {
    color: "#44239A",
    fontSize: 20,
    fontWeight: "900",
  },
});
