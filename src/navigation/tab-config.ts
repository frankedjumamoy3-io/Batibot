import { Ionicons } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";

import { LEARNER_PHASES } from "@/src/content/learner-phases";
import { RANK_ASSETS, REWARD_ASSETS } from "@/src/services/assets/assetResolver";
import {
  HIDDEN_TAB_ROUTE_NAMES,
  TAB_ROUTE_NAMES,
  type VisibleTabRouteName,
} from "@/src/navigation/routes";

export interface VisibleTabScreenConfig {
  accessibilityLabel: string;
  activeColor: string;
  defaultIcon: keyof typeof Ionicons.glyphMap;
  focusedBackgroundColor: string;
  focusedIcon: keyof typeof Ionicons.glyphMap;
  imageIcon?: ImageSourcePropType;
  name: VisibleTabRouteName;
  phase: number;
  title: string;
}

export const VISIBLE_TAB_SCREENS: VisibleTabScreenConfig[] = [
  {
    accessibilityLabel: LEARNER_PHASES[1].accessibilityLabel,
    activeColor: LEARNER_PHASES[1].accent,
    defaultIcon: LEARNER_PHASES[1].defaultIcon,
    focusedBackgroundColor: LEARNER_PHASES[1].accent,
    focusedIcon: LEARNER_PHASES[1].focusedIcon,
    imageIcon: RANK_ASSETS.icon,
    name: TAB_ROUTE_NAMES.rank,
    phase: LEARNER_PHASES[1].phase,
    title: LEARNER_PHASES[1].title,
  },
  {
    accessibilityLabel: LEARNER_PHASES[0].accessibilityLabel,
    activeColor: LEARNER_PHASES[0].accent,
    defaultIcon: LEARNER_PHASES[0].defaultIcon,
    focusedBackgroundColor: LEARNER_PHASES[0].accent,
    focusedIcon: LEARNER_PHASES[0].focusedIcon,
    name: TAB_ROUTE_NAMES.play,
    phase: LEARNER_PHASES[0].phase,
    title: LEARNER_PHASES[0].title,
  },
  {
    accessibilityLabel: LEARNER_PHASES[2].accessibilityLabel,
    activeColor: LEARNER_PHASES[2].accent,
    defaultIcon: LEARNER_PHASES[2].defaultIcon,
    focusedBackgroundColor: LEARNER_PHASES[2].accent,
    focusedIcon: LEARNER_PHASES[2].focusedIcon,
    imageIcon: REWARD_ASSETS.icon,
    name: TAB_ROUTE_NAMES.reward,
    phase: LEARNER_PHASES[2].phase,
    title: LEARNER_PHASES[2].title,
  },
];

export const HIDDEN_TAB_SCREENS = [...HIDDEN_TAB_ROUTE_NAMES];
