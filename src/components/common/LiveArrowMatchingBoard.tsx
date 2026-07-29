import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { ImageSourcePropType, LayoutChangeEvent } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type LiveArrowMatchItem = {
  id: string;
  image?: ImageSourcePropType;
  label?: string;
  visual?: ReactNode;
};

export type LiveArrowMatchTarget = {
  id: string;
  label: string;
};

export type LiveArrowMatchPair = {
  sourceId: string;
  targetId: string;
};

type Point = {
  x: number;
  y: number;
};

type Rect = Point & {
  height: number;
  width: number;
};

type LiveArrowMatchingBoardProps = {
  compact?: boolean;
  completedPairs: LiveArrowMatchPair[];
  correctPairs: LiveArrowMatchPair[];
  disabled?: boolean;
  onMatchCorrect: (pair: LiveArrowMatchPair) => void;
  onMatchWrong?: (sourceId: string, targetId: string) => void;
  sources: LiveArrowMatchItem[];
  sourceLabel?: string;
  targets: LiveArrowMatchTarget[];
  targetLabel?: string;
};

export function LiveArrowMatchingBoard({
  compact = false,
  completedPairs,
  correctPairs,
  disabled = false,
  onMatchCorrect,
  onMatchWrong,
  sources,
  sourceLabel = "A",
  targets,
  targetLabel = "B",
}: LiveArrowMatchingBoardProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>();
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [sourceColumn, setSourceColumn] = useState<Rect>();
  const [targetColumn, setTargetColumn] = useState<Rect>();
  const [sourceLayouts, setSourceLayouts] = useState<Record<string, Rect>>({});
  const [targetLayouts, setTargetLayouts] = useState<Record<string, Rect>>({});

  const completedSourceIds = useMemo(
    () => new Set(completedPairs.map((pair) => pair.sourceId)),
    [completedPairs]
  );
  const completedTargetIds = useMemo(
    () => new Set(completedPairs.map((pair) => pair.targetId)),
    [completedPairs]
  );

  useEffect(() => {
    if (!selectedSourceId || !completedSourceIds.has(selectedSourceId)) {
      return;
    }

    setSelectedSourceId(undefined);
  }, [completedSourceIds, selectedSourceId]);

  function handleSourcePress(sourceId: string) {
    if (disabled || completedSourceIds.has(sourceId)) {
      return;
    }

    setSelectedSourceId(sourceId);
  }

  function handleTargetPress(targetId: string) {
    if (disabled || !selectedSourceId || completedTargetIds.has(targetId)) {
      return;
    }

    const isCorrect = correctPairs.some(
      (pair) => pair.sourceId === selectedSourceId && pair.targetId === targetId
    );

    if (isCorrect) {
      onMatchCorrect({ sourceId: selectedSourceId, targetId });
      setSelectedSourceId(undefined);
      return;
    }

    setWrongIds([selectedSourceId, targetId]);
    onMatchWrong?.(selectedSourceId, targetId);
    setSelectedSourceId(undefined);
    setTimeout(() => setWrongIds([]), 520);
  }

  function setColumnLayout(kind: "source" | "target", event: LayoutChangeEvent) {
    const { height, width, x, y } = event.nativeEvent.layout;
    const rect = { height, width, x, y };

    if (kind === "source") {
      setSourceColumn(rect);
      return;
    }

    setTargetColumn(rect);
  }

  function setItemLayout(
    kind: "source" | "target",
    id: string,
    event: LayoutChangeEvent
  ) {
    const { height, width, x, y } = event.nativeEvent.layout;
    const rect = { height, width, x, y };

    if (kind === "source") {
      setSourceLayouts((current) => ({ ...current, [id]: rect }));
      return;
    }

    setTargetLayouts((current) => ({ ...current, [id]: rect }));
  }

  function getConnectorPoint(kind: "source" | "target", id: string): Point | undefined {
    const column = kind === "source" ? sourceColumn : targetColumn;
    const item = kind === "source" ? sourceLayouts[id] : targetLayouts[id];

    if (!column || !item) {
      return undefined;
    }

    return {
      x: column.x + item.x + (kind === "source" ? item.width : 0),
      y: column.y + item.y + item.height / 2,
    };
  }

  const matchedLines = completedPairs
    .map((pair) => {
      const from = getConnectorPoint("source", pair.sourceId);
      const to = getConnectorPoint("target", pair.targetId);

      return from && to ? { from, key: `${pair.sourceId}-${pair.targetId}`, to } : null;
    })
    .filter((line): line is { from: Point; key: string; to: Point } => Boolean(line));

  const selectedCenter = selectedSourceId
    ? getConnectorPoint("source", selectedSourceId)
    : undefined;
  const previewTo =
    selectedCenter && targetColumn
      ? {
          x: targetColumn.x,
          y: selectedCenter.y,
        }
      : undefined;

  return (
    <View style={[styles.board, compact && styles.boardCompact]}>
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        {matchedLines.map((line) => (
          <ConnectorLine from={line.from} key={line.key} to={line.to} />
        ))}
        {selectedCenter && previewTo ? (
          <ConnectorLine dashed from={selectedCenter} to={previewTo} />
        ) : null}
      </View>
      <View
        onLayout={(event) => setColumnLayout("source", event)}
        style={[styles.column, compact && styles.columnCompact]}
      >
        <Text style={[styles.columnLabel, compact && styles.columnLabelCompact]}>
          {sourceLabel}
        </Text>
        {sources.map((source) => {
          const isDone = completedSourceIds.has(source.id);
          const isSelected = selectedSourceId === source.id;
          const isWrong = wrongIds.includes(source.id);

          return (
            <Pressable
              accessibilityLabel={source.label}
              accessibilityRole="button"
              disabled={disabled || isDone}
              key={source.id}
              onLayout={(event) => setItemLayout("source", source.id, event)}
              onPress={() => handleSourcePress(source.id)}
              style={[
                styles.card,
                compact && styles.cardCompact,
                isSelected && styles.cardSelected,
                isDone && styles.cardDone,
                isWrong && styles.cardWrong,
              ]}
            >
              <MatchItemContent compact={compact} item={source} />
            </Pressable>
          );
        })}
      </View>
      <View
        onLayout={(event) => setColumnLayout("target", event)}
        style={[styles.column, compact && styles.columnCompact]}
      >
        <Text style={[styles.columnLabel, compact && styles.columnLabelCompact]}>
          {targetLabel}
        </Text>
        {targets.map((target) => {
          const isDone = completedTargetIds.has(target.id);
          const isWrong = wrongIds.includes(target.id);

          return (
            <Pressable
              accessibilityLabel={target.label}
              accessibilityRole="button"
              disabled={disabled || isDone}
              key={target.id}
              onLayout={(event) => setItemLayout("target", target.id, event)}
              onPress={() => handleTargetPress(target.id)}
              style={[
                styles.card,
                styles.targetCard,
                compact && styles.cardCompact,
                isDone && styles.cardDone,
                isWrong && styles.cardWrong,
              ]}
            >
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.76}
                numberOfLines={compact ? 3 : 2}
                style={[styles.targetText, compact && styles.targetTextCompact]}
              >
                {target.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MatchItemContent({
  compact = false,
  item,
}: {
  compact?: boolean;
  item: LiveArrowMatchItem;
}) {
  if (item.visual) {
    return <>{item.visual}</>;
  }

  if (item.image) {
    return <Image resizeMode="contain" source={item.image} style={styles.image} />;
  }

  return (
    <Text
      adjustsFontSizeToFit
      minimumFontScale={0.76}
      numberOfLines={compact ? 3 : 1}
      style={[styles.targetText, compact && styles.targetTextCompact]}
    >
      {item.label}
    </Text>
  );
}

function ConnectorLine({
  dashed = false,
  from,
  to,
}: {
  dashed?: boolean;
  from: Point;
  to: Point;
}) {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX);

  return (
    <View
      style={[
        styles.connector,
        dashed && styles.connectorPreview,
        {
          left: (from.x + to.x) / 2 - length / 2,
          top: (from.y + to.y) / 2 - 2,
          transform: [{ rotateZ: `${angle}rad` }],
          width: length,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  board: {
    alignItems: "center",
    flexDirection: "row",
    gap: 34,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 168,
    position: "relative",
    width: "100%",
  },
  boardCompact: {
    gap: 24,
    marginTop: 2,
    minHeight: 0,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 3,
    height: 64,
    justifyContent: "center",
    padding: 6,
    width: 84,
  },
  cardCompact: {
    borderWidth: 2,
    height: 42,
    padding: 4,
    width: 110,
  },
  cardDone: {
    borderColor: "#22C55E",
  },
  cardSelected: {
    borderColor: "#681BF2",
    transform: [{ scale: 1.04 }],
  },
  cardWrong: {
    borderColor: "#EF4444",
    transform: [{ translateX: -4 }],
  },
  column: {
    alignItems: "center",
    gap: 12,
  },
  columnCompact: {
    gap: 5,
  },
  columnLabel: {
    color: "#681BF2",
    fontSize: 11,
    fontWeight: "900",
  },
  columnLabelCompact: {
    fontSize: 12,
    lineHeight: 15,
  },
  connector: {
    backgroundColor: "#111827",
    borderRadius: 999,
    height: 4,
    position: "absolute",
  },
  connectorPreview: {
    backgroundColor: "#681BF2",
    opacity: 0.35,
  },
  image: {
    height: 48,
    width: "100%",
  },
  targetCard: {
    paddingHorizontal: 8,
  },
  targetText: {
    color: "#681BF2",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  targetTextCompact: {
    fontSize: 11,
    lineHeight: 13,
  },
});
