import { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
} from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import type { PreschoolStageChoice } from "@/src/data/preschoolStageWorldTypes";

type DraggableChoiceProps = {
  choice: PreschoolStageChoice & { label: string };
  disabled?: boolean;
  onDrop: (choice: PreschoolStageChoice & { label: string }) => void;
  grade?: string;
  topic?: string;
  worldId?: string;
};

export function DraggableChoice({
  choice,
  disabled = false,
  grade,
  onDrop,
  topic,
  worldId,
}: DraggableChoiceProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !disabledRef.current && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 8,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        const traveled = Math.abs(gesture.dx) + Math.abs(gesture.dy);

        Animated.spring(pan, {
          friction: 6,
          tension: 80,
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

        if (!disabledRef.current && traveled > 70) {
          onDrop(choice);
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.animatedWrap, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <BatibotAssetCard
        disabled={disabled}
        fallbackMode={choice.symbol ? "symbol" : "iconLabel"}
        fallbackSymbol={choice.symbol}
        grade={grade}
        label={choice.label}
        onPress={() => onDrop(choice)}
        showLabel={!choice.hideLabel}
        size="medium"
        source={choice.symbol ? undefined : choice.image}
        tags={[choice.id, choice.label, topic ?? ""].filter(Boolean)}
        topic={topic}
        world={worldId}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrap: {
    width: 124,
  },
});
