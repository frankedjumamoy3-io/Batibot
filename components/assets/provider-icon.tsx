import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LucideIcons from "lucide-react-native";
import * as PhosphorIcons from "phosphor-react-native";
import type { ComponentType } from "react";

import type { BatiBotAssetProvider } from "@/src/data/assets/batibot-asset-manifest";

type ProviderIconProps = {
  color: string;
  iconName?: string;
  provider?: BatiBotAssetProvider;
  size: number;
};

const lucideIconMap = LucideIcons as unknown as Record<string, ComponentType<any>>;
const phosphorIconMap = PhosphorIcons as unknown as Record<string, ComponentType<any>>;

function toPascalCase(value: string) {
  return value
    .replace(/^mdi:/, "")
    .split(/[-_\s:]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toMaterialCommunityName(value?: string) {
  return (value ?? "mdi:image-outline").replace(/^mdi:/, "");
}

export function AssetProviderIcon({
  color,
  iconName = "mdi:image-outline",
  provider = "iconify",
  size,
}: ProviderIconProps) {
  if (provider === "lucide") {
    const LucideIcon = lucideIconMap[toPascalCase(iconName)] ?? lucideIconMap.Image;

    if (LucideIcon) {
      return <LucideIcon color={color} size={size} strokeWidth={2.6} />;
    }
  }

  if (provider === "phosphor") {
    const PhosphorIcon = phosphorIconMap[toPascalCase(iconName)] ?? phosphorIconMap.Image;

    if (PhosphorIcon) {
      return <PhosphorIcon color={color} size={size} weight="duotone" />;
    }
  }

  return (
    <MaterialCommunityIcons
      color={color}
      name={toMaterialCommunityName(iconName) as keyof typeof MaterialCommunityIcons.glyphMap}
      size={size}
    />
  );
}
