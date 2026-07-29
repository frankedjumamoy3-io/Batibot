import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type StandardMasteryStageProps = {
  completedStageLabels?: string[];
  hasNextTopic: boolean;
  nextTopicLabel?: string;
  topicLabel?: string;
};

const DEFAULT_COMPLETED_STAGE_LABELS = ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY"];

export function StandardMasteryStage({
  completedStageLabels = DEFAULT_COMPLETED_STAGE_LABELS,
  hasNextTopic,
  nextTopicLabel,
  topicLabel,
}: StandardMasteryStageProps) {
  return (
    <View style={styles.wrap}>
      {topicLabel ? (
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.topic}>
          {topicLabel}
        </Text>
      ) : null}
      <View style={styles.checklist}>
        {completedStageLabels.map((label) => (
          <View key={label} style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={23} color="#65A30D" />
            <Text style={styles.checkText}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.nextLabel}>next topic</Text>
      <View style={styles.nextPill}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nextText}>
          {hasNextTopic ? nextTopicLabel ?? "Next" : "World Complete"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  checkText: {
    color: "#681BF2",
    fontSize: 24,
    fontWeight: "900",
  },
  checklist: {
    gap: 8,
    marginBottom: 18,
  },
  nextLabel: {
    color: "#44239A",
    fontSize: 9,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },
  nextPill: {
    alignItems: "center",
    backgroundColor: "#9CA3AF",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: "center",
    minHeight: 30,
    minWidth: 96,
    paddingHorizontal: 18,
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  topic: {
    color: "#44239A",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
    width: "86%",
  },
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 320,
    width: "100%",
  },
});
