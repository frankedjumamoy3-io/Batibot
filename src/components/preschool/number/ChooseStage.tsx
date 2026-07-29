import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NumberChoiceCard } from "@/src/components/preschool/number/NumberChoiceCard";
import type { NumberChoice, NumberVillageTopic } from "@/src/data/preschoolNumberVillage";
import { speak } from "@/src/services/speechService";

type ChooseStageProps = {
  onAnswer: (choice: NumberChoice) => void;
  topic: NumberVillageTopic;
};

export function ChooseStage({ onAnswer, topic }: ChooseStageProps) {
  useEffect(() => {
    speak(topic.choose.question);
  }, [topic.choose.question]);

  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" onPress={() => speak(topic.choose.question)}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.question}>
          {topic.choose.question}
        </Text>
      </Pressable>
      <View style={styles.grid}>
        {topic.choose.choices.slice(0, 4).map((choice) => (
          <NumberChoiceCard
            choice={choice}
            key={choice.id}
            onPress={onAnswer}
            showLabel={false}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 12,
    width: "100%",
  },
  question: {
    color: "#681BF2",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
