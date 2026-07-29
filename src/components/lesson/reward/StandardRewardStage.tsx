import { Image, StyleSheet, Text, View } from "react-native";

import { FAMILY_WORLD_REWARD_ASSETS } from "@/src/data/play-assets";

type StandardRewardStageProps = {
  alreadyClaimed?: boolean;
  stars?: number;
  title?: string;
  topicLabel?: string;
  xp?: number;
};

export function StandardRewardStage({
  alreadyClaimed = false,
  stars = 1,
  title,
  topicLabel,
  xp = 10,
}: StandardRewardStageProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{alreadyClaimed ? "REWARD CLAIMED" : title ?? "GOOD JOB!"}</Text>
      <Image
        resizeMode="contain"
        source={FAMILY_WORLD_REWARD_ASSETS.trophy}
        style={styles.trophy}
      />
      <Text style={styles.message}>
        {alreadyClaimed
          ? "Already completed"
          : topicLabel
            ? `${topicLabel} complete`
            : "Topic complete"}
      </Text>
      <View style={styles.rewardRow}>
        <Text style={styles.rewardText}>+{stars} STAR</Text>
        <Text style={styles.rewardText}>+{xp} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    color: "#44239A",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  rewardRow: {
    flexDirection: "row",
    gap: 22,
    marginTop: 20,
  },
  rewardText: {
    color: "#681BF2",
    fontSize: 16,
    fontWeight: "900",
  },
  title: {
    color: "#681BF2",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
  },
  trophy: {
    height: 170,
    width: "86%",
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 320,
    width: "100%",
  },
});
