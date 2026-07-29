import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import { StageVisualSet } from "@/src/components/kinder/common/StageVisualSet";
import type { PreschoolStageChoice, PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";
import { speak } from "@/src/services/speechService";

type ChooseStageProps = {
  grade?: string;
  onAnswer: (choice: PreschoolStageChoice) => void;
  selectedChoiceId?: string;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
};

export function ChooseStage({
  grade,
  onAnswer,
  selectedChoiceId,
  topic,
  worldId,
}: ChooseStageProps) {
  const [revealReadyChoice, setRevealReadyChoice] = useState<PreschoolStageChoice>();
  const [revealed, setRevealed] = useState(false);
  const revealPattern = topic.choose.revealPattern;

  useEffect(() => {
    speak(topic.choose.question);
  }, [topic.choose.question]);

  useEffect(() => {
    setRevealReadyChoice(undefined);
    setRevealed(false);
  }, [topic.id]);

  function handleChoice(choice: PreschoolStageChoice) {
    if (!revealPattern) {
      onAnswer(choice);
      return;
    }

    if (!choice.isCorrect) {
      setRevealReadyChoice(undefined);
      setRevealed(false);
      onAnswer(choice);
      return;
    }

    setRevealReadyChoice(choice);
  }

  function handleReveal() {
    if (!revealReadyChoice) {
      return;
    }

    setRevealed(true);
    speak(revealPattern?.completionText ?? "Great!");
    onAnswer(revealReadyChoice);
  }

  return (
    <View style={styles.wrap}>
      {revealPattern ? (
        <View style={styles.patternPrompt}>
          <StageVisualSet
            compact
            grade={grade}
            showLabels={false}
            topic={topic.label}
            visuals={revealPattern.prompt.map((visual, index) =>
              visual ?? {
                color: revealed ? revealPattern.revealVisual.color : "#D6CACA",
                id: `blank-${index}`,
                label: revealed ? revealPattern.revealVisual.label : "",
                shape: "circle",
                size: "medium",
              }
            )}
            world={worldId}
          />
        </View>
      ) : null}
      <View style={styles.grid}>
        {topic.choose.choices.slice(0, 4).map((choice) =>
          choice.symbol ? (
            <Pressable
              accessibilityLabel={choice.id}
              accessibilityRole="button"
              key={choice.id}
              onPress={() => handleChoice(choice)}
              style={[
                styles.choiceCard,
                (selectedChoiceId === choice.id || revealReadyChoice?.id === choice.id) &&
                  styles.choiceCardSelected,
              ]}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.choiceSymbol}>
                {choice.symbol}
              </Text>
            </Pressable>
          ) : (
            <BatibotAssetCard
              grade={grade}
              key={choice.id}
              label={choice.label ?? choice.id}
              onPress={() => handleChoice(choice)}
              selected={selectedChoiceId === choice.id || revealReadyChoice?.id === choice.id}
              showLabel={false}
              size="medium"
              source={choice.image}
              tags={[choice.id, choice.label ?? "", topic.label].filter(Boolean)}
              topic={topic.label}
              world={worldId}
            />
          )
        )}
      </View>
      {revealPattern ? (
        <Pressable
          accessibilityRole="button"
          disabled={!revealReadyChoice || revealed}
          onPress={handleReveal}
          style={[
            styles.revealButton,
            (!revealReadyChoice || revealed) && styles.revealButtonDisabled,
          ]}
        >
          <Text style={styles.revealButtonText}>Reveal</Text>
        </Pressable>
      ) : null}
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
    height: 104,
    justifyContent: "center",
    padding: 10,
    width: "45%",
  },
  choiceCardSelected: {
    borderColor: "#681BF2",
  },
  choiceSymbol: {
    color: "#111827",
    fontSize: 54,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
  },
  grid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 16,
    maxWidth: 268,
    width: "100%",
  },
  patternPrompt: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: "92%",
  },
  revealButton: {
    alignItems: "center",
    backgroundColor: "#681BF2",
    borderRadius: 16,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 42,
    paddingHorizontal: 26,
  },
  revealButtonDisabled: {
    opacity: 0.45,
  },
  revealButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
