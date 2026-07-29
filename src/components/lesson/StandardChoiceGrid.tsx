import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  useWindowDimensions,
} from "react-native";

import { BatibotAssetCard } from "@/components/common/BatibotAssetCard";
import {
  getChoiceLayoutMode,
  getChoiceSetVisualType,
  type ChoiceLayoutMode,
  type ChoiceVisualType,
} from "@/src/utils/choiceLayoutResolver";

export type StandardChoice = {
  assetKey?: string;
  disabled?: boolean;
  id: string;
  image?: ImageSourcePropType | null;
  imageKey?: string;
  isCorrect?: boolean;
  label: string;
};

export type StandardChoiceGradeLevel =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

type StandardChoiceGridProps = {
  choices: StandardChoice[];
  contentType?: ChoiceVisualType | "auto";
  correctIds?: string[];
  disabled?: boolean;
  gradeLevel?: StandardChoiceGradeLevel;
  multiSelect?: boolean;
  onSelect: (choiceId: string) => void;
  selectedIds?: string[];
  topic?: string;
  worldId?: string;
  wrongIds?: string[];
};

export function StandardChoiceGrid({
  choices,
  contentType = "auto",
  correctIds = [],
  disabled = false,
  gradeLevel = "grade1",
  onSelect,
  selectedIds = [],
  topic,
  worldId,
  wrongIds = [],
}: StandardChoiceGridProps) {
  const { height } = useWindowDimensions();
  const visualType = contentType === "auto" ? getChoiceSetVisualType(choices) : contentType;
  const layoutMode = getChoiceLayoutMode(choices, contentType);
  const normalizedVisualType = visualType === "mixed" ? "imageLabel" : visualType;
  const isSmallScreen = height < 700;
  const scrollChoices =
    layoutMode === "textVertical" || layoutMode === "imageVertical" || choices.length > 4;

  const grid = (
    <View style={[styles.grid, getGridStyle(layoutMode)]}>
      {choices.map((choice) => {
        const selected = selectedIds.includes(choice.id);
        const correct = correctIds.includes(choice.id);
        const wrong = wrongIds.includes(choice.id);
        const choiceDisabled = disabled || choice.disabled;
        const cardStyle = getCardStyle(
          layoutMode,
          normalizedVisualType,
          gradeLevel,
          isSmallScreen
        );

        if (normalizedVisualType === "image" || normalizedVisualType === "imageLabel") {
          if (choice.image) {
            return (
              <Pressable
                accessibilityLabel={choice.label}
                accessibilityRole="button"
                disabled={choiceDisabled}
                key={choice.id}
                onPress={() => onSelect(choice.id)}
                style={[
                  styles.imageCard,
                  cardStyle,
                  selected && !correct ? styles.selected : null,
                  correct ? styles.correct : null,
                  wrong ? styles.wrong : null,
                  choiceDisabled ? styles.disabled : null,
                ]}
              >
                <Image resizeMode="contain" source={choice.image} style={styles.image} />
                {choice.label ? (
                  <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.74}
                    numberOfLines={3}
                    style={styles.imageLabel}
                  >
                    {choice.label}
                  </Text>
                ) : null}
              </Pressable>
            );
          }

          return (
            <BatibotAssetCard
              assetKey={choice.assetKey ?? choice.imageKey}
              disabled={choiceDisabled}
              fallbackMode="iconLabel"
              fitToContainer
              grade={gradeLevel}
              key={choice.id}
              label={choice.label}
              onPress={() => onSelect(choice.id)}
              showLabel={normalizedVisualType === "imageLabel" || Boolean(choice.label)}
              source={choice.image ?? undefined}
              style={[
                cardStyle,
                selected && !correct ? styles.selected : null,
                correct ? styles.correct : null,
                wrong ? styles.wrong : null,
              ]}
              tags={[choice.label, topic, worldId].filter((tag): tag is string => Boolean(tag))}
              topic={topic}
              world={worldId}
            />
          );
        }

        return (
          <Pressable
            accessibilityLabel={choice.label}
            accessibilityRole="button"
            disabled={choiceDisabled}
            key={choice.id}
            onPress={() => onSelect(choice.id)}
            style={[
              styles.textCard,
              cardStyle,
              selected && !correct ? styles.selected : null,
              correct ? styles.correct : null,
              wrong ? styles.wrong : null,
              choiceDisabled ? styles.disabled : null,
            ]}
          >
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              numberOfLines={3}
              style={styles.textChoice}
            >
              {choice.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (scrollChoices) {
    return (
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={choices.length > 3}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {grid}
      </ScrollView>
    );
  }

  return grid;
}

function getGridStyle(layoutMode: ChoiceLayoutMode) {
  if (layoutMode === "textVertical" || layoutMode === "imageVertical") {
    return styles.verticalGrid;
  }

  if (layoutMode === "textTwoByOne" || layoutMode === "imageTwoByOne") {
    return styles.twoByOneGrid;
  }

  if (layoutMode === "textTwoByTwo" || layoutMode === "imageTwoByTwo") {
    return styles.twoByTwoGrid;
  }

  return styles.adaptiveGrid;
}

function getCardStyle(
  layoutMode: ChoiceLayoutMode,
  visualType: ChoiceVisualType,
  gradeLevel: StandardChoiceGradeLevel,
  isSmallScreen: boolean
) {
  const preschoolVisual = gradeLevel === "preschool" || gradeLevel === "kindergarten";

  if (layoutMode === "textVertical") return styles.textVerticalCard;
  if (layoutMode === "textTwoByOne") return isSmallScreen ? styles.textTwoByOneCardCompact : styles.textTwoByOneCard;
  if (layoutMode === "textTwoByTwo") return isSmallScreen ? styles.textTwoByTwoCardCompact : styles.textTwoByTwoCard;
  if (layoutMode === "imageTwoByOne") {
    if (preschoolVisual) return styles.imageTwoByOneCardLarge;
    return isSmallScreen ? styles.imageTwoByOneCardCompact : styles.imageTwoByOneCard;
  }
  if (layoutMode === "imageTwoByTwo") {
    if (preschoolVisual) return styles.imageTwoByTwoCardLarge;
    return isSmallScreen ? styles.imageTwoByTwoCardCompact : styles.imageTwoByTwoCard;
  }
  if (layoutMode === "imageVertical") return styles.imageVerticalCard;

  return visualType === "text" ? styles.textTwoByTwoCard : styles.imageTwoByTwoCard;
}

const styles = StyleSheet.create({
  adaptiveGrid: {
    maxWidth: 286,
  },
  correct: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  disabled: {
    opacity: 0.5,
  },
  grid: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  imageTwoByOneCard: {
    minHeight: 150,
    width: 138,
  },
  imageTwoByOneCardCompact: {
    minHeight: 132,
    width: 132,
  },
  imageTwoByOneCardLarge: {
    minHeight: 150,
    width: 136,
  },
  imageTwoByTwoCard: {
    minHeight: 132,
    width: 136,
  },
  imageTwoByTwoCardCompact: {
    minHeight: 116,
    width: 130,
  },
  imageTwoByTwoCardLarge: {
    minHeight: 128,
    width: 132,
  },
  imageVerticalCard: {
    minHeight: 126,
    width: 276,
  },
  selected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#7C3AED",
  },
  image: {
    flex: 1,
    minHeight: 72,
    width: "100%",
  },
  imageCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#7C3AED",
    borderRadius: 16,
    borderWidth: 3,
    gap: 6,
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  imageLabel: {
    color: "#111827",
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
    minHeight: 20,
    textAlign: "center",
  },
  textCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#7C3AED",
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textChoice: {
    color: "#4C1D95",
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
  },
  textTwoByOneCard: {
    minHeight: 82,
    width: 136,
  },
  textTwoByOneCardCompact: {
    minHeight: 74,
    width: 130,
  },
  textTwoByTwoCard: {
    minHeight: 88,
    width: 136,
  },
  textTwoByTwoCardCompact: {
    minHeight: 78,
    width: 130,
  },
  textVerticalCard: {
    minHeight: 78,
    width: 276,
  },
  twoByOneGrid: {
    flexWrap: "nowrap",
    maxWidth: 292,
  },
  twoByTwoGrid: {
    maxWidth: 292,
  },
  verticalGrid: {
    flexDirection: "column",
    flexWrap: "nowrap",
    maxWidth: 286,
  },
  scroll: {
    maxHeight: "100%",
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 2,
  },
  wrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
  },
});
