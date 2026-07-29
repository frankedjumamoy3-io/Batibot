import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppleCountGrid } from "@/src/components/preschool/number/AppleCountGrid";
import type { NumberVillageTopic } from "@/src/data/preschoolNumberVillage";
import { speak } from "@/src/services/speechService";

type LookStageProps = {
  onTapped: () => void;
  topic: NumberVillageTopic;
};

export function LookStage({ onTapped, topic }: LookStageProps) {
  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {topic.id === "number-challenge" ? "Number Challenge" : topic.word}
      </Text>
      <Pressable
        accessibilityLabel={`Hear ${topic.label}`}
        accessibilityRole="button"
        onPress={() => {
          speak(topic.look.speech);
          onTapped();
        }}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <Text adjustsFontSizeToFit numberOfLines={topic.id === "number-challenge" ? 2 : 1} style={styles.numeral}>
          {topic.look.numeral}
        </Text>
        {topic.value > 0 ? (
          <AppleCountGrid count={topic.value} size={30} />
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    gap: 10,
    minHeight: 230,
    padding: 16,
    width: "92%",
  },
  numeral: {
    color: "#050505",
    fontSize: 94,
    fontWeight: "900",
    textAlign: "center",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  title: {
    color: "#681BF2",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
