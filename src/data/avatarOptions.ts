import type { ImageSourcePropType } from "react-native";

export type AvatarOption = {
  assetKey: string;
  category: "animal" | "fruit" | "friendly";
  emoji: string;
  id: string;
  label: string;
  localSource: ImageSourcePropType;
  role: string;
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    assetKey: "avatar.apple",
    category: "fruit",
    emoji: "\uD83C\uDF4E",
    id: "apple",
    label: "Apple",
    localSource: require("../../Batibot assets/Avatar/Avatar 1.png"),
    role: "bright and ready",
  },
  {
    assetKey: "avatar.bear",
    category: "animal",
    emoji: "\uD83D\uDC3B",
    id: "bear",
    label: "Bear",
    localSource: require("../../Batibot assets/Avatar/Avatar 2.png"),
    role: "calm learner",
  },
  {
    assetKey: "avatar.avocado",
    category: "fruit",
    emoji: "\uD83E\uDD51",
    id: "avocado",
    label: "Avocado",
    localSource: require("../../Batibot assets/Avatar/Avatar 3.png"),
    role: "steady helper",
  },
  {
    assetKey: "avatar.pineapple",
    category: "fruit",
    emoji: "\uD83C\uDF4D",
    id: "pineapple",
    label: "Pineapple",
    localSource: require("../../Batibot assets/Avatar/Avatar 4.png"),
    role: "sunny explorer",
  },
  {
    assetKey: "avatar.grapes",
    category: "fruit",
    emoji: "\uD83C\uDF47",
    id: "grapes",
    label: "Grapes",
    localSource: require("../../Batibot assets/Avatar/Avatar 5.png"),
    role: "team player",
  },
  {
    assetKey: "avatar.watermelon",
    category: "fruit",
    emoji: "\uD83C\uDF49",
    id: "watermelon",
    label: "Watermelon",
    localSource: require("../../Batibot assets/Avatar/Avatar 6.png"),
    role: "happy reader",
  },
];

export function getAvatarOptionById(avatarId?: string | null) {
  return AVATAR_OPTIONS.find((option) => option.id === avatarId) ?? null;
}

export function getAvatarOptionByAssetKey(assetKey?: string | null) {
  return AVATAR_OPTIONS.find((option) => option.assetKey === assetKey) ?? null;
}
