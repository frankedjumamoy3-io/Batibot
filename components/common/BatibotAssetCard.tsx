import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { resolveBatibotAsset } from "@/src/utils/batibotAssetResolver";
import { SHOW_LESSON_LAYOUT_DEBUG } from "@/src/utils/uiDiagnostics";

type BatibotAssetCardProps = {
  assetKey?: string;
  label: string;
  grade?: string;
  world?: string;
  topic?: string;
  tags?: string[];
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  fallbackMode?: "labelOnly" | "iconLabel" | "symbol";
  fallbackSymbol?: string;
  fitToContainer?: boolean;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  source?: ImageSourcePropType | null;
  style?: StyleProp<ViewStyle>;
};

export function BatibotAssetCard({
  assetKey,
  disabled = false,
  fallbackMode = "iconLabel",
  fallbackSymbol,
  fitToContainer = false,
  grade,
  label,
  onPress,
  selected = false,
  showLabel = true,
  size = "medium",
  source,
  style,
  tags,
  topic,
  world,
}: BatibotAssetCardProps) {
  const asset = source
    ? {
        isFallback: false,
        label,
        source,
      }
    : resolveBatibotAsset({
        grade,
        key: assetKey,
        label,
        tags,
        topic,
        world,
      });
  const symbol = fallbackSymbol ?? getFallbackSymbol(label, tags);

  const cardStyle = [
    styles.card,
    fitToContainer ? null : styles[size],
    selected ? styles.selected : null,
    disabled ? styles.disabled : null,
    SHOW_LESSON_LAYOUT_DEBUG ? styles.debug : null,
    style,
  ];
  const content = (
    <>
      {asset.source ? (
        <Image resizeMode="contain" source={asset.source} style={styles.image} />
      ) : (
        <View style={styles.fallbackPanel}>
          {fallbackMode === "symbol" || fallbackMode === "iconLabel" ? (
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={fallbackMode === "symbol" ? styles.symbol : styles.icon}
            >
              {symbol}
            </Text>
          ) : null}
          {fallbackMode !== "symbol" ? (
            <Text adjustsFontSizeToFit numberOfLines={3} style={styles.fallbackLabel}>
              {asset.label}
            </Text>
          ) : null}
        </View>
      )}

      {showLabel && asset.source ? (
        <Text adjustsFontSizeToFit numberOfLines={3} style={styles.label}>
          {asset.label}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={cardStyle}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessibilityLabel={label} accessibilityRole="image" style={cardStyle}>
      {content}
    </View>
  );
}

function getFallbackSymbol(label: string, tags?: string[]) {
  const normalized = `${label} ${(tags ?? []).join(" ")}`.toLowerCase();

  if (normalized.includes("greater")) return ">";
  if (normalized.includes("less")) return "<";
  if (normalized.includes("equal")) return "=";
  if (normalized.includes("minus") || normalized.includes("subtract")) return "-";
  if (normalized.includes("multiply")) return "x";
  if (normalized.includes("divide")) return "/";
  if (normalized.includes("half")) return "1/2";
  if (normalized.includes("third")) return "1/3";
  if (normalized.includes("fourth") || normalized.includes("quarter")) return "1/4";
  if (normalized.includes("plus") || normalized.includes("add")) return "+";
  if (normalized.includes("money") || normalized.includes("coin")) return "P";
  if (normalized.includes("question") || /^(who|what|where|when)$/i.test(label)) return "?";

  return label.slice(0, 1).toUpperCase();
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#7C3AED",
    borderRadius: 14,
    borderWidth: 3,
    gap: 6,
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  debug: {
    borderColor: "#EF4444",
    borderStyle: "dashed",
  },
  disabled: {
    opacity: 0.55,
  },
  fallbackLabel: {
    color: "#312E81",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 23,
    textAlign: "center",
  },
  fallbackPanel: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 62,
    paddingHorizontal: 8,
  },
  icon: {
    color: "#6B21F2",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34,
    marginBottom: 3,
    textAlign: "center",
  },
  image: {
    flex: 1,
    minHeight: 56,
    width: "100%",
  },
  label: {
    color: "#111827",
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 18,
    minHeight: 18,
    textAlign: "center",
  },
  large: {
    height: 180,
    width: 210,
  },
  medium: {
    height: 116,
    width: 124,
  },
  selected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
  },
  small: {
    height: 92,
    width: 104,
  },
  symbol: {
    color: "#6B21F2",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    textAlign: "center",
  },
});
