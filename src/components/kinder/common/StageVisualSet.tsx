import { Image, StyleSheet, Text, View } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import type { PreschoolStageVisual } from "@/src/data/preschoolStageWorldTypes";

type StageVisualSetProps = {
  compact?: boolean;
  grade?: string;
  showLabels?: boolean;
  topic?: string;
  visuals: PreschoolStageVisual[];
  world?: string;
};

export function StageVisualSet({
  compact = false,
  grade,
  showLabels = true,
  topic,
  visuals,
  world,
}: StageVisualSetProps) {
  return (
    <View style={[styles.row, compact && styles.compactRow]}>
      {visuals.map((visual, index) => (
        <View
          key={`${visual.id}-${index}`}
          style={[styles.item, compact && styles.compactItem]}
        >
          <VisualContent
            compact={compact}
            grade={grade}
            topic={topic}
            visual={visual}
            world={world}
          />
          {showLabels && visual.label ? (
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
              {visual.label}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function VisualContent({
  compact,
  grade,
  topic,
  visual,
  world,
}: {
  compact: boolean;
  grade?: string;
  topic?: string;
  visual: PreschoolStageVisual;
  world?: string;
}) {
  if (visual.dotCount) {
    return <DotGroup compact={compact} visual={visual} />;
  }

  if (visual.image) {
    return (
      <BatibotAssetCard
        fallbackMode="iconLabel"
        grade={grade}
        label={visual.label ?? visual.id}
        showLabel={false}
        size={compact ? "small" : "medium"}
        source={visual.image}
        tags={[visual.id, visual.label ?? "", topic ?? ""].filter(Boolean)}
        topic={topic}
        world={world}
      />
    );
  }

  if (visual.symbol) {
    return (
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.symbol}>
        {visual.symbol}
      </Text>
    );
  }

  return <ShapeVisual compact={compact} visual={visual} />;
}

function DotGroup({
  compact,
  visual,
}: {
  compact: boolean;
  visual: PreschoolStageVisual;
}) {
  return (
    <View style={[styles.dotGroup, compact && styles.compactDotGroup]}>
      {Array.from({ length: visual.dotCount ?? 0 }).map((_, index) => (
        visual.image ? (
          <Image
            key={`${visual.id}-dot-${index}`}
            resizeMode="contain"
            source={visual.image}
            style={[styles.dotImage, compact && styles.compactDotImage]}
          />
        ) : (
          <View
            key={`${visual.id}-dot-${index}`}
            style={[
              styles.dot,
              compact && styles.compactDot,
              { backgroundColor: visual.color ?? "#FF1717" },
            ]}
          />
        )
      ))}
    </View>
  );
}

function ShapeVisual({
  compact,
  visual,
}: {
  compact: boolean;
  visual: PreschoolStageVisual;
}) {
  const isBar = visual.shape === "bar";
  const sizeStyle = getSizeStyle(visual.size, isBar, compact);

  return (
    <View
      style={[
        isBar ? styles.bar : styles.circle,
        sizeStyle,
        { backgroundColor: visual.color ?? "#FF1717" },
      ]}
    />
  );
}

function getSizeStyle(
  size: PreschoolStageVisual["size"],
  isBar: boolean,
  compact: boolean
) {
  if (isBar) {
    if (size === "long") return compact ? styles.compactLongBar : styles.longBar;
    return compact ? styles.compactShortBar : styles.shortBar;
  }

  if (size === "small" || size === "short") {
    return compact ? styles.compactSmallCircle : styles.smallCircle;
  }

  if (size === "tall") {
    return compact ? styles.compactTallShape : styles.tallShape;
  }

  return compact ? styles.compactLargeCircle : styles.largeCircle;
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 999,
    height: 34,
  },
  circle: {
    borderRadius: 999,
  },
  compactDot: {
    height: 17,
    width: 17,
  },
  compactDotGroup: {
    maxWidth: 80,
  },
  compactDotImage: {
    height: 20,
    width: 20,
  },
  compactImage: {
    height: 62,
  },
  compactItem: {
    minWidth: 58,
  },
  compactLargeCircle: {
    height: 54,
    width: 54,
  },
  compactLongBar: {
    width: 76,
  },
  compactRow: {
    gap: 8,
  },
  compactShortBar: {
    width: 42,
  },
  compactSmallCircle: {
    height: 26,
    width: 26,
  },
  compactTallShape: {
    borderRadius: 16,
    height: 72,
    width: 34,
  },
  dot: {
    borderRadius: 999,
    height: 25,
    width: 25,
  },
  dotGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    maxWidth: 104,
  },
  dotImage: {
    height: 28,
    width: 28,
  },
  image: {
    height: 104,
    width: "100%",
  },
  item: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 92,
    minWidth: 82,
  },
  label: {
    color: "#681BF2",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  largeCircle: {
    height: 84,
    width: 84,
  },
  longBar: {
    width: 128,
  },
  row: {
    alignItems: "flex-end",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
    width: "100%",
  },
  shortBar: {
    width: 64,
  },
  smallCircle: {
    height: 42,
    width: 42,
  },
  symbol: {
    color: "#681BF2",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },
  tallShape: {
    borderRadius: 18,
    height: 112,
    width: 44,
  },
});
