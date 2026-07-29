import { StyleSheet } from "react-native";

export const animatedWordImageStyles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 42,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  cardContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 150,
  },
  detailContainer: {
    height: 260,
  },
  featuredContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 170,
  },
  featuredContainerCompact: {
    height: 142,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageFrame: {
    backgroundColor: "#E8EEF5",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  lottieOverlay: {
    bottom: 12,
    height: 90,
    left: 12,
    position: "absolute",
    width: 90,
  },
  promptBubble: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    bottom: 12,
    maxWidth: "58%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    right: 12,
  },
  promptText: {
    color: "#17324D",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  webGlow: {
    borderRadius: 999,
    bottom: 18,
    height: 68,
    left: 20,
    position: "absolute",
    width: 68,
  },
});
