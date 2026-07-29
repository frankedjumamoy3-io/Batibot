import { StyleSheet, Text, View } from "react-native";

import { AnimatedTopicProgressTrack } from "@/src/components/preschool/stage-engine/AnimatedTopicProgressTrack";

type StandardProgressStageProps = {
  completedTopics: number;
  message?: string;
  previousCompletedTopics?: number;
  totalTopics: number;
};

export function StandardProgressStage({
  completedTopics,
  message,
  previousCompletedTopics = Math.max(0, completedTopics - 1),
  totalTopics,
}: StandardProgressStageProps) {
  const safeTotal = Math.max(1, totalTopics);
  const safeCompleted = Math.min(Math.max(0, completedTopics), safeTotal);
  const percent = Math.round((safeCompleted / safeTotal) * 100);

  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.count}>
        {safeCompleted}/{safeTotal}
      </Text>
      <AnimatedTopicProgressTrack
        completedTopics={safeCompleted}
        previousCompletedTopics={Math.min(previousCompletedTopics, safeCompleted)}
        totalTopics={safeTotal}
      />
      <Text style={styles.percent}>{percent}%</Text>
      <Text style={styles.message}>
        {message ?? (percent >= 100 ? "World complete" : "Keep going")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    color: "#681BF2",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
    width: "82%",
  },
  message: {
    color: "#44239A",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  percent: {
    color: "#681BF2",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    width: "100%",
  },
});
