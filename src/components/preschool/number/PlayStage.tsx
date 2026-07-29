import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { StageRetryNotice } from "@/src/components/lesson/StageRetryNotice";
import { TryAgainSection } from "@/src/components/lesson/TryAgainSection";
import { NumberChoiceCard } from "@/src/components/preschool/number/NumberChoiceCard";
import { NumberMatchDropZone } from "@/src/components/preschool/number/NumberMatchDropZone";
import type { NumberChoice, NumberVillageTopic } from "@/src/data/preschoolNumberVillage";
import { STANDARD_STAGE_FEEDBACK } from "@/src/hooks/useStageAttemptLimit";
import { speak } from "@/src/services/speechService";

type PlayStageProps = {
  attemptLimitReached?: boolean;
  choices?: NumberChoice[];
  disabled?: boolean;
  feedback?: "correct" | "wrong" | "timeout" | null;
  isCompleted: boolean;
  onAnswer: (choice: NumberChoice) => void;
  onRetry?: () => void;
  showTryAgain?: boolean;
  targetCount: number;
  timerRemaining: number;
  topic: NumberVillageTopic;
  wrongImage: number;
};

export function PlayStage({
  attemptLimitReached = false,
  choices,
  disabled = false,
  feedback,
  isCompleted,
  onAnswer,
  onRetry,
  showTryAgain = false,
  targetCount,
  timerRemaining,
  topic,
  wrongImage,
}: PlayStageProps) {
  const choicesDisabled = disabled || isCompleted || showTryAgain || attemptLimitReached;
  const shouldShowLimitPanel = attemptLimitReached;
  const retryMessage = attemptLimitReached
    ? STANDARD_STAGE_FEEDBACK.limit
    : feedback === "timeout"
      ? STANDARD_STAGE_FEEDBACK.timeout
      : feedback === "wrong"
        ? STANDARD_STAGE_FEEDBACK.wrong
        : null;
  const retryType = attemptLimitReached
    ? "limit"
    : feedback === "timeout"
      ? "timeout"
      : feedback === "wrong"
        ? "wrong"
        : null;
  const shouldShowTryAgainCard = showTryAgain && retryType !== "limit";

  return (
    <View style={styles.wrap}>
      <View style={styles.timerRow}>
        <Ionicons name="timer-outline" size={21} color="#681BF2" />
        <Text style={styles.timerText}>{Math.max(0, timerRemaining)}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => speak(topic.play.task)}>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.task}>
          {topic.play.task}
        </Text>
      </Pressable>
      {shouldShowTryAgainCard ? (
        <TryAgainSection onTryAgain={onRetry ?? (() => undefined)} />
      ) : (
        <StageRetryNotice feedbackType={retryType} message={retryMessage} />
      )}
      {shouldShowLimitPanel ? (
        <View style={styles.retryWrap}>
          <Image resizeMode="contain" source={wrongImage} style={styles.wrongImage} />
          <Text style={styles.retryTitle}>{STANDARD_STAGE_FEEDBACK.limit}</Text>
        </View>
      ) : shouldShowTryAgainCard ? null : (
        <>
          <View style={styles.row}>
            {(choices ?? topic.play.choices).slice(0, 2).map((choice) => (
              <NumberChoiceCard
                choice={choice}
                disabled={choicesDisabled}
                key={`${targetCount}-${choice.id}`}
                onPress={onAnswer}
                showLabel={false}
              />
            ))}
          </View>
          <NumberMatchDropZone
            completed={isCompleted}
            count={targetCount}
            onPress={() => speak(topic.play.task)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 8,
    width: "100%",
  },
  retryTitle: {
    color: "#681BF2",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  retryWrap: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#681BF2",
    borderRadius: 14,
    borderWidth: 4,
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
    maxHeight: 166,
    minHeight: 142,
    paddingHorizontal: 18,
    paddingVertical: 16,
    width: "82%",
  },
  task: {
    color: "#681BF2",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 6,
    textAlign: "center",
  },
  timerRow: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    color: "#E11D48",
    fontSize: 14,
    fontWeight: "900",
  },
  wrap: {
    alignItems: "center",
    flexShrink: 1,
    justifyContent: "center",
    minHeight: 0,
    width: "100%",
  },
  wrongImage: {
    height: 42,
    width: 42,
  },
});
