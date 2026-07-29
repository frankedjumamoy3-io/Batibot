import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NumberChoiceCard } from "@/src/components/preschool/number/NumberChoiceCard";
import type { NumberChoice, NumberVillageTopic } from "@/src/data/preschoolNumberVillage";
import { speak } from "@/src/services/speechService";

type TryStageProps = {
  onAnswer: (choice: NumberChoice) => void;
  topic: NumberVillageTopic;
};

export function TryStage({ onAnswer, topic }: TryStageProps) {
  useEffect(() => {
    speak(topic.try.question);
  }, [topic.try.question]);

  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" onPress={() => speak(topic.try.question)}>
        <Text style={styles.title}>We learn</Text>
      </Pressable>
      <View style={styles.row}>
        {topic.try.choices.slice(0, 2).map((choice) => (
          <NumberChoiceCard choice={choice} key={choice.id} onPress={onAnswer} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 12,
    width: "100%",
  },
  title: {
    color: "#681BF2",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
