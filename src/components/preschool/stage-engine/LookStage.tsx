import { Pressable, StyleSheet, Text, View } from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import { StageVisualSet } from "@/src/components/kinder/common/StageVisualSet";
import type { PreschoolStageWorldTopic } from "@/src/data/preschoolStageWorldTypes";
import { speak } from "@/src/services/speechService";

type LookStageProps = {
  grade?: string;
  onTapped: () => void;
  topic: PreschoolStageWorldTopic;
  worldId?: string;
};

export function LookStage({ grade, onTapped, topic, worldId }: LookStageProps) {
  return (
    <View style={styles.wrap}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
        {topic.label}
      </Text>
      <Pressable
        accessibilityLabel={`Hear ${topic.label}`}
        accessibilityRole="imagebutton"
        onPress={() => {
          speak(topic.look.speech);
          onTapped();
        }}
        style={({ pressed }) => [styles.imageCard, pressed && styles.pressed]}
      >
        {topic.look.visuals?.length ? (
          <StageVisualSet
            compact={topic.look.visuals.length > 4}
            grade={grade}
            topic={topic.label}
            visuals={topic.look.visuals}
            world={worldId}
          />
        ) : topic.look.symbol ? (
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.heroSymbol}>
            {topic.look.symbol}
          </Text>
        ) : (
          <BatibotAssetCard
            fallbackMode="iconLabel"
            grade={grade}
            label={topic.label}
            showLabel={false}
            size="large"
            source={topic.look.image}
            tags={[topic.id, topic.label]}
            topic={topic.label}
            world={worldId}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSymbol: {
    color: "#111827",
    fontSize: 132,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
  },
  imageCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 230,
    padding: 12,
    width: "92%",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  title: {
    color: "#681BF2",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 12,
    maxWidth: "100%",
    textAlign: "center",
  },
  wrap: {
    alignItems: "center",
    width: "100%",
  },
});
