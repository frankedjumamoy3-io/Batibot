import { ImageBackground, StyleSheet, View } from "react-native";
import { UI_BACKGROUND_ASSETS } from "@/src/data/assets/ui-background-assets";

type PlayfulBackgroundVariant = "home" | "play" | "progress" | "rewards" | "words";

const BACKGROUND_IMAGES = UI_BACKGROUND_ASSETS;

const VARIANT_WASH: Record<PlayfulBackgroundVariant, string> = {
  home: "rgba(19, 138, 122, 0.04)",
  play: "rgba(249, 115, 22, 0.04)",
  progress: "rgba(124, 58, 237, 0.05)",
  rewards: "rgba(245, 158, 11, 0.05)",
  words: "rgba(37, 99, 235, 0.04)",
};

const READABILITY_WASH: Record<PlayfulBackgroundVariant, string> = {
  home: "rgba(255, 255, 255, 0.06)",
  play: "rgba(255, 255, 255, 0.07)",
  progress: "rgba(255, 255, 255, 0.10)",
  rewards: "rgba(255, 255, 255, 0.09)",
  words: "rgba(255, 255, 255, 0.12)",
};

export function PlayfulBackground({
  variant,
}: {
  variant: PlayfulBackgroundVariant;
}) {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
      <ImageBackground
        resizeMode="cover"
        source={BACKGROUND_IMAGES[variant]}
        style={StyleSheet.absoluteFill}
      >
        <View style={[styles.variantWash, { backgroundColor: VARIANT_WASH[variant] }]} />
        <View
          style={[
            styles.readabilityWash,
            { backgroundColor: READABILITY_WASH[variant] },
          ]}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  readabilityWash: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  variantWash: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
