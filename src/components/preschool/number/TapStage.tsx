import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppleCountGrid } from "@/src/components/preschool/number/AppleCountGrid";
import type { NumberVillageTopic } from "@/src/data/preschoolNumberVillage";
import { speak } from "@/src/services/speechService";

type TapStageProps = {
  onTapped: () => void;
  topic: NumberVillageTopic;
};

export function TapStage({ onTapped, topic }: TapStageProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {topic.id === "number-challenge" ? "Number Challenge" : topic.word}
      </Text>
      <Pressable
        accessibilityLabel={`Count ${topic.tap.sentence}`}
        accessibilityRole="button"
        onPress={() => {
          speak(topic.tap.speech);
          setRevealed(true);
          onTapped();
        }}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <AppleCountGrid count={topic.tap.appleCount} showNumeral size={42} />
      </Pressable>
      {revealed ? (
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.sentence}>
          {topic.tap.sentence}
        </Text>
      ) : (
        <View style={styles.sentenceSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 210,
    padding: 12,
    width: "92%",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  sentence: {
    color: "#681BF2",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
  sentenceSpace: {
    height: 42,
    marginTop: 14,
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
