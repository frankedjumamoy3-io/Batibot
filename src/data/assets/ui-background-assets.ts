import type { ImageSourcePropType } from "react-native";

export const UI_BACKGROUND_ASSETS = {
  home: require("@/assets/images/backgrounds/batibot-home-background.png"),
  play: require("@/assets/images/backgrounds/batibot-play-background.png"),
  progress: require("@/assets/images/backgrounds/batibot-progress-background.png"),
  rewards: require("@/assets/images/backgrounds/batibot-rewards-background.png"),
  words: require("@/assets/images/backgrounds/batibot-words-background.png"),
} satisfies Record<string, ImageSourcePropType>;
