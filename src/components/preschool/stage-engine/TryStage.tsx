import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import type { PreschoolStageChoice, PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";
import { speak } from "@/src/services/speechService";

type TryStageProps = {
  grade?: string;
  onAnswer: (choice: PreschoolStageChoice) => void;
  selectedChoiceId?: string;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
};

export function TryStage({
  grade,
  onAnswer,
  selectedChoiceId,
  topic,
  worldId,
}: TryStageProps) {
  useEffect(() => {
    speak(topic.try.question);
  }, [topic.try.question]);

  return (
    <View style={styles.wrap}>
      <View style={styles.choiceRow}>
        {topic.try.choices.slice(0, 2).map((choice) =>
          choice.symbol ? (
            <Pressable
              accessibilityLabel={choice.label}
              accessibilityRole="button"
              key={choice.id}
              onPress={() => onAnswer(choice)}
              style={[
                styles.choiceCard,
                selectedChoiceId === choice.id && styles.choiceCardSelected,
              ]}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.choiceSymbol}>
                {choice.symbol}
              </Text>
              {choice.hideLabel ? null : (
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.choiceLabel}>
                  {choice.label}
                </Text>
              )}
            </Pressable>
          ) : (
            <BatibotAssetCard
              grade={grade}
              key={choice.id}
              label={choice.label}
              onPress={() => onAnswer(choice)}
              selected={selectedChoiceId === choice.id}
              showLabel={!choice.hideLabel}
              size="medium"
              source={choice.image}
              tags={[choice.id, choice.label, topic.label]}
              topic={topic.label}
              world={worldId}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  choiceCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 3,
    justifyContent: "center",
    minHeight: 140,
    padding: 10,
    width: "45%",
  },
  choiceCardSelected: {
    borderColor: "#681BF2",
  },
  choiceSymbol: {
    color: "#111827",
    fontSize: 56,
    fontWeight: "900",
    height: 86,
    textAlign: "center",
    width: "100%",
  },
  choiceLabel: {
    color: "#681BF2",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 6,
    maxWidth: "100%",
    textAlign: "center",
  },
  choiceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 10,
    maxWidth: 268,
    width: "100%",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
