import { Image } from "expo-image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { StyleSheet, Text, View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";

import { AssetProviderIcon } from "./provider-icon";
import {
  getAssetRegistryVersion,
  resolveAsset,
  subscribeToAssetRegistryChanges,
  type ResolvedBatiBotAsset,
} from "@/src/services/assets/assetResolver";

type BatiBotAssetImageProps = {
  asset: ResolvedBatiBotAsset;
  contentFit?: "contain" | "cover";
  hideComingSoonLabel?: boolean;
  hideLabel?: boolean;
  iconColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
  placeholderStyle?: StyleProp<ViewStyle>;
  refreshFromRegistry?: boolean;
  style?: StyleProp<ViewStyle>;
};

function ShapeFallback({ asset }: { asset: ResolvedBatiBotAsset }) {
  const normalized = asset.label.toLowerCase();

  if (normalized.includes("triangle")) {
    return <View style={assetImageStyles.triangle} />;
  }

  if (normalized.includes("rectangle")) {
    return <View style={assetImageStyles.rectangle} />;
  }

  if (normalized.includes("square")) {
    return <View style={assetImageStyles.square} />;
  }

  if (normalized.includes("circle")) {
    return <View style={assetImageStyles.circle} />;
  }

  return null;
}

function ClockFallback() {
  return (
    <View style={assetImageStyles.clockFace}>
      <View style={assetImageStyles.clockHourHand} />
      <View style={assetImageStyles.clockMinuteHand} />
      <View style={assetImageStyles.clockCenter} />
    </View>
  );
}

export function BatiBotAssetImage({
  asset,
  contentFit = "contain",
  hideLabel = false,
  iconColor = "#4F46E5",
  imageStyle,
  placeholderStyle,
  refreshFromRegistry = true,
  style,
}: BatiBotAssetImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  useSyncExternalStore(
    subscribeToAssetRegistryChanges,
    getAssetRegistryVersion,
    getAssetRegistryVersion
  );
  const currentAsset = refreshFromRegistry ? resolveAsset(asset.resolutionRequest ?? asset.id) : asset;

  useEffect(() => {
    setImageFailed(false);
  }, [currentAsset.id, currentAsset.localSource]);

  if (currentAsset.localSource && !imageFailed) {
    return (
      <Image
        accessibilityLabel={currentAsset.altText}
        contentFit={contentFit}
        onError={() => setImageFailed(true)}
        source={currentAsset.localSource}
        style={[assetImageStyles.image, style as StyleProp<ImageStyle>, imageStyle]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={currentAsset.altText}
      accessibilityRole="image"
      style={[assetImageStyles.placeholder, style, placeholderStyle]}
    >
      {currentAsset.assetType === "clock" ? (
        <ClockFallback />
      ) : currentAsset.assetType === "shape" ? (
        <ShapeFallback asset={currentAsset} />
      ) : (
        <AssetProviderIcon
          color={iconColor}
          iconName={currentAsset.iconName}
          provider={currentAsset.provider}
          size={42}
        />
      )}
      {hideLabel ? null : (
        <Text numberOfLines={2} style={assetImageStyles.label}>
          {currentAsset.label}
        </Text>
      )}
    </View>
  );
}

const assetImageStyles = StyleSheet.create({
  circle: {
    backgroundColor: "#38BDF8",
    borderRadius: 999,
    height: 48,
    width: 48,
  },
  clockCenter: {
    backgroundColor: "#111827",
    borderRadius: 999,
    height: 7,
    left: 28,
    position: "absolute",
    top: 28,
    width: 7,
  },
  clockFace: {
    backgroundColor: "#FFFFFF",
    borderColor: "#4F46E5",
    borderRadius: 999,
    borderWidth: 4,
    height: 64,
    position: "relative",
    width: 64,
  },
  clockHourHand: {
    backgroundColor: "#111827",
    borderRadius: 999,
    height: 22,
    left: 30,
    position: "absolute",
    top: 11,
    width: 4,
  },
  clockMinuteHand: {
    backgroundColor: "#111827",
    borderRadius: 999,
    height: 4,
    left: 30,
    position: "absolute",
    top: 30,
    width: 22,
  },
  image: {
    height: 96,
    width: 96,
  },
  label: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  placeholder: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
    height: 112,
    justifyContent: "center",
    padding: 8,
    width: 112,
  },
  rectangle: {
    backgroundColor: "#F97316",
    borderRadius: 8,
    height: 38,
    width: 64,
  },
  square: {
    backgroundColor: "#22C55E",
    borderRadius: 8,
    height: 50,
    width: 50,
  },
  triangle: {
    backgroundColor: "transparent",
    borderBottomColor: "#EAB308",
    borderBottomWidth: 54,
    borderLeftColor: "transparent",
    borderLeftWidth: 30,
    borderRightColor: "transparent",
    borderRightWidth: 30,
    height: 0,
    width: 0,
  },
});
