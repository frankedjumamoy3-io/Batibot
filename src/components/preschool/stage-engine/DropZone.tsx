import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";

type DropZoneProps = {
  completed: boolean;
  feedback?: "correct" | "wrong" | "timeout" | null;
  grade?: string;
  onPress?: () => void;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
  wrongImage?: ImageSourcePropType;
};

export function DropZone({
  completed,
  feedback,
  grade,
  onPress,
  topic,
  worldId,
  wrongImage,
}: DropZoneProps) {
  const isWrong = feedback === "wrong" || feedback === "timeout";
  const dropImage = completed
    ? topic.play.completedImage
    : isWrong && wrongImage
      ? wrongImage
      : topic.play.situationImage;
  const dropLabel = completed
    ? topic.play.dropLabel
    : isWrong
      ? "Try again"
      : topic.play.task;

  return (
    <View style={styles.wrap}>
      {completed ? (
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
          {topic.play.dropLabel}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="imagebutton"
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [styles.imageCard, pressed && styles.pressed]}
      >
        <BatibotAssetCard
          grade={grade}
          label={dropLabel}
          showLabel={false}
          size="medium"
          source={dropImage}
          tags={[topic.id, topic.label, topic.play.dropLabel, topic.play.task]}
          topic={topic.label}
          world={worldId}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    maxHeight: 154,
    minHeight: 138,
    padding: 6,
    width: "100%",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: "#681BF2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 5,
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    flexShrink: 1,
    marginTop: 8,
    maxHeight: 166,
    width: "78%",
  },
});
