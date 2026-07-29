import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import {
  LiveArrowMatchingBoard,
  type LiveArrowMatchPair,
} from "@/src/components/common/LiveArrowMatchingBoard";
import { StageRetryNotice } from "@/src/components/lesson/StageRetryNotice";
import { TryAgainSection } from "@/src/components/lesson/TryAgainSection";
import type {
  PreschoolStageChoice,
  PreschoolStageMatchRow,
  PreschoolStagePatternPiece,
  PreschoolStageWorldTopic,
} from "@/src/data/preschoolStageWorldTypes";
import { DraggableChoice } from "@/src/components/preschool/stage-engine/DraggableChoice";
import { DropZone } from "@/src/components/preschool/stage-engine/DropZone";
import { STANDARD_STAGE_FEEDBACK } from "@/src/hooks/useStageAttemptLimit";
import { speak } from "@/src/services/speechService";

type PlayStageProps = {
  attemptLimitReached?: boolean;
  disabled?: boolean;
  feedback: "correct" | "wrong" | "timeout" | null;
  grade?: string;
  isCompleted: boolean;
  onDrop: (choice: PreschoolStageChoice & { label: string }) => void;
  onRetry?: () => void;
  showTryAgain?: boolean;
  timerRemaining: number;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
  wrongImage?: ImageSourcePropType;
};

export function PlayStage({
  attemptLimitReached = false,
  disabled = false,
  feedback,
  grade,
  isCompleted,
  onDrop,
  onRetry,
  showTryAgain = false,
  timerRemaining,
  topic,
  worldId,
  wrongImage,
}: PlayStageProps) {
  const choicesDisabled = disabled || isCompleted || showTryAgain || attemptLimitReached;
  const retryMessage = attemptLimitReached
    ? STANDARD_STAGE_FEEDBACK.limit
    : feedback === "timeout"
      ? STANDARD_STAGE_FEEDBACK.timeout
      : feedback === "wrong" || showTryAgain
        ? STANDARD_STAGE_FEEDBACK.wrong
        : null;
  const retryType = attemptLimitReached
    ? "limit"
    : feedback === "timeout"
      ? "timeout"
      : feedback === "wrong" || showTryAgain
        ? "wrong"
        : null;
  const shouldShowTryAgainCard = showTryAgain && retryType !== "limit";
  const specialPlay =
    topic.play.matchRows?.length ? (
      <MatchingPlayBoard
        disabled={choicesDisabled}
        isCompleted={isCompleted}
        onComplete={() => onDrop(createSyntheticChoice(topic.play.dropLabel, true))}
        onWrong={() => onDrop(createSyntheticChoice("Try again", false))}
        rows={topic.play.matchRows}
        resetKey={`${topic.id}-${showTryAgain}-${attemptLimitReached}`}
      />
    ) : topic.play.patternBuild ? (
      <PatternBuildBoard
        disabled={choicesDisabled}
        isCompleted={isCompleted}
        onComplete={() => onDrop(createSyntheticChoice(topic.play.dropLabel, true))}
        onWrong={() => onDrop(createSyntheticChoice("Try again", false))}
        pieces={topic.play.patternBuild.pieces}
        resetKey={`${topic.id}-${showTryAgain}-${attemptLimitReached}`}
        slots={topic.play.patternBuild.slots}
      />
    ) : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.timerRow}>
        <Ionicons name="timer-outline" size={21} color="#681BF2" />
        <Text style={styles.timerText}>{Math.max(0, timerRemaining)}</Text>
      </View>
      {shouldShowTryAgainCard ? (
        <TryAgainSection onTryAgain={onRetry ?? (() => undefined)} />
      ) : (
        <StageRetryNotice feedbackType={retryType} message={retryMessage} />
      )}
      {shouldShowTryAgainCard ? null : specialPlay ?? (
        <View style={styles.choiceRow}>
          {topic.play.choices.slice(0, 2).map((choice) => (
            <DraggableChoice
              choice={choice}
              disabled={choicesDisabled}
              grade={grade}
              key={choice.id}
              onDrop={onDrop}
              topic={topic.label}
              worldId={worldId}
            />
          ))}
        </View>
      )}
      {shouldShowTryAgainCard || specialPlay ? null : (
        <DropZone
          completed={isCompleted}
          feedback={feedback}
          grade={grade}
          onPress={() => speak(topic.play.task)}
          topic={topic}
          worldId={worldId}
          wrongImage={wrongImage}
        />
      )}
    </View>
  );
}

function createSyntheticChoice(
  label: string,
  isCorrect: boolean
): PreschoolStageChoice & { label: string } {
  return {
    id: isCorrect ? "play-complete" : "play-wrong",
    image: undefined as unknown as PreschoolStageChoice["image"],
    isCorrect,
    label,
  };
}

function MatchingPlayBoard({
  disabled,
  isCompleted,
  onComplete,
  onWrong,
  resetKey,
  rows,
}: {
  disabled: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onWrong: () => void;
  resetKey: string;
  rows: PreschoolStageMatchRow[];
}) {
  const [completedPairs, setCompletedPairs] = useState<LiveArrowMatchPair[]>([]);

  useEffect(() => {
    setCompletedPairs([]);
  }, [resetKey]);

  const sources = rows.map((row) => ({
    id: row.id,
    image: row.symbol ? undefined : row.image,
    label: row.label,
    visual: row.symbol ? <Text style={styles.matchSymbol}>{row.symbol}</Text> : undefined,
  }));
  const targets = rows
    .map((row) => ({ id: row.targetLabel, label: row.targetLabel }))
    .reverse();
  const correctPairs = rows.map((row) => ({
    sourceId: row.id,
    targetId: row.targetLabel,
  }));

  return (
    <LiveArrowMatchingBoard
      completedPairs={completedPairs}
      correctPairs={correctPairs}
      disabled={disabled || isCompleted}
      onMatchCorrect={(pair) => {
        const nextPairs = completedPairs.some(
          (item) => item.sourceId === pair.sourceId && item.targetId === pair.targetId
        )
          ? completedPairs
          : [...completedPairs, pair];

        setCompletedPairs(nextPairs);

        if (nextPairs.length === rows.length) {
          onComplete();
        }
      }}
      onMatchWrong={onWrong}
      sources={sources}
      targets={targets}
    />
  );
}

function PatternBuildBoard({
  disabled,
  isCompleted,
  onComplete,
  onWrong,
  pieces,
  resetKey,
  slots,
}: {
  disabled: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  onWrong: () => void;
  pieces: PreschoolStagePatternPiece[];
  resetKey: string;
  slots: { expectedPieceId: string; id: string; label: string }[];
}) {
  const [filledPieceIds, setFilledPieceIds] = useState<string[]>([]);

  useEffect(() => {
    setFilledPieceIds([]);
  }, [resetKey]);

  function placePiece(piece: PreschoolStagePatternPiece) {
    if (disabled || isCompleted) {
      return;
    }

    const nextSlot = slots[filledPieceIds.length];

    if (!nextSlot || nextSlot.expectedPieceId !== piece.id) {
      onWrong();
      return;
    }

    const nextFilled = [...filledPieceIds, piece.id];
    setFilledPieceIds(nextFilled);

    if (nextFilled.length === slots.length) {
      onComplete();
    }
  }

  return (
    <View style={styles.patternBoard}>
      <View style={styles.patternPieceRow}>
        {pieces.map((piece, index) => (
          <Pressable
            accessibilityLabel={piece.label}
            accessibilityRole="button"
            disabled={disabled || isCompleted}
            key={`${piece.id}-${index}`}
            onPress={() => placePiece(piece)}
            style={[styles.patternPiece, { backgroundColor: piece.color }]}
          />
        ))}
      </View>
      <View style={styles.slotBoard}>
        <View style={styles.slotLabelRow}>
          {slots.map((slot) => (
            <Text key={`${slot.id}-label`} style={styles.slotLabel}>
              {slot.label}
            </Text>
          ))}
        </View>
        <View style={styles.patternPieceRow}>
          {slots.map((slot, index) => {
            const pieceId = filledPieceIds[index];
            const piece = pieces.find((item) => item.id === pieceId);

            return (
              <View key={slot.id} style={styles.patternSlot}>
                {piece ? (
                  <View style={[styles.patternSlotFill, { backgroundColor: piece.color }]} />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  choiceRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 8,
    width: "100%",
  },
  connectorColumn: {
    height: 150,
    justifyContent: "center",
    position: "relative",
    width: 36,
  },
  connectorLine: {
    backgroundColor: "#111827",
    height: 3,
    left: -8,
    position: "absolute",
    width: 54,
  },
  connectorLineOne: {
    top: 48,
    transform: [{ rotate: "34deg" }],
  },
  connectorLineTwo: {
    bottom: 48,
    transform: [{ rotate: "-34deg" }],
  },
  labelCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 62,
    justifyContent: "center",
    paddingHorizontal: 8,
    width: 82,
  },
  labelCardText: {
    color: "#681BF2",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  matchBoard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    width: "100%",
  },
  matchCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 3,
    height: 62,
    justifyContent: "center",
    padding: 6,
    width: 82,
  },
  matchCardDone: {
    borderColor: "#22C55E",
  },
  matchCardSelected: {
    borderColor: "#681BF2",
  },
  matchColumn: {
    alignItems: "center",
    gap: 12,
  },
  matchColumnLabel: {
    color: "#681BF2",
    fontSize: 11,
    fontWeight: "900",
  },
  matchImage: {
    height: 48,
    width: "100%",
  },
  matchSymbol: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "900",
  },
  patternBoard: {
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    width: "100%",
  },
  patternPiece: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 3,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  patternPieceRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  patternPieceText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  patternSlot: {
    alignItems: "center",
    backgroundColor: "#D6CACA",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  patternSlotFill: {
    borderRadius: 999,
    height: 24,
    width: 24,
  },
  slotBoard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
  },
  slotLabel: {
    color: "#681BF2",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    width: 42,
  },
  slotLabelRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 6,
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
});
