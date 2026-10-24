import { memo, useEffect, useMemo, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const CONFETTI_COLORS = ["#F59E0B", "#EC4899", "#8B5CF6", "#22C55E", "#3B82F6", "#F43F5E", "#FACC15"];

type ConfettiPieceSpec = {
  color: string;
  delay: number;
  duration: number;
  height: number;
  leftRatio: number;
  round: boolean;
  spin: number;
  sway: number;
  width: number;
};

type ConfettiBurstProps = {
  /** Number of pieces; kept modest so low-end Android devices stay smooth. */
  count?: number;
  /** Change this value to replay the burst. */
  playKey?: string | number;
};

// Deterministic pseudo-random so pieces don't jump around on re-render.
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildPieces(count: number): ConfettiPieceSpec[] {
  return Array.from({ length: count }, (_, index) => {
    const size = 7 + seeded(index, 1) * 6;
    const round = seeded(index, 2) > 0.72;
    return {
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delay: Math.round(seeded(index, 3) * 650),
      duration: Math.round(1900 + seeded(index, 4) * 1300),
      height: round ? size : size * 0.55,
      leftRatio: 0.03 + seeded(index, 5) * 0.94,
      round,
      spin: (seeded(index, 6) > 0.5 ? 1 : -1) * (360 + seeded(index, 7) * 540),
      sway: 10 + seeded(index, 8) * 26,
      width: size,
    };
  });
}

const ConfettiPiece = memo(function ConfettiPiece({
  areaHeight,
  areaWidth,
  progress,
  spec,
}: {
  areaHeight: number;
  areaWidth: number;
  progress: SharedValue<number>;
  spec: ConfettiPieceSpec;
}) {
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    return {
      opacity: t <= 0 ? 0 : t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1,
      transform: [
        { translateX: Math.sin(t * Math.PI * 3) * spec.sway },
        { translateY: -24 + t * (areaHeight + 48) },
        { rotate: `${t * spec.spin}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          backgroundColor: spec.color,
          borderRadius: spec.round ? spec.width : 2,
          height: spec.height,
          left: spec.leftRatio * areaWidth,
          width: spec.width,
        },
        style,
      ]}
    />
  );
});

function ConfettiPieceDriver({
  areaHeight,
  areaWidth,
  playKey,
  spec,
}: {
  areaHeight: number;
  areaWidth: number;
  playKey?: string | number;
  spec: ConfettiPieceSpec;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      spec.delay,
      withTiming(1, { duration: spec.duration, easing: Easing.in(Easing.quad) })
    );
    return () => cancelAnimation(progress);
  }, [playKey, progress, spec.delay, spec.duration]);

  return <ConfettiPiece areaHeight={areaHeight} areaWidth={areaWidth} progress={progress} spec={spec} />;
}

/**
 * Lightweight one-shot confetti shower. Renders as a non-interactive overlay that
 * fills its parent, so it never blocks taps on the content underneath.
 */
export function ConfettiBurst({ count = 34, playKey }: ConfettiBurstProps) {
  const reduceMotion = useReducedMotion();
  const [area, setArea] = useState({ height: 0, width: 0 });
  const pieces = useMemo(() => buildPieces(count), [count]);

  function handleLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;
    if (Math.abs(height - area.height) > 1 || Math.abs(width - area.width) > 1) {
      setArea({ height, width });
    }
  }

  if (reduceMotion) return null;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={handleLayout}
      style={[StyleSheet.absoluteFill, styles.layer, { pointerEvents: "none" }]}
    >
      {area.width > 0 && area.height > 0
        ? pieces.map((spec, index) => (
            <ConfettiPieceDriver
              key={index}
              areaHeight={area.height}
              areaWidth={area.width}
              playKey={playKey}
              spec={spec}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    overflow: "hidden",
    zIndex: 5,
  },
  piece: {
    position: "absolute",
    top: 0,
  },
});
