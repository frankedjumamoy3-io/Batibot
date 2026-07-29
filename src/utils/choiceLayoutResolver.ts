import type { ImageSourcePropType } from "react-native";

export type ChoiceVisualType = "text" | "image" | "imageLabel" | "mixed";

export type ChoiceLayoutMode =
  | "textVertical"
  | "textTwoByOne"
  | "textTwoByTwo"
  | "imageTwoByOne"
  | "imageTwoByTwo"
  | "imageVertical"
  | "adaptive";

export type ChoiceLike = {
  assetKey?: string;
  image?: ImageSourcePropType | null;
  imageKey?: string;
  label?: string;
};

export function getChoiceVisualType(choice: ChoiceLike): ChoiceVisualType {
  if (choice.imageKey || choice.image || choice.assetKey) {
    return choice.label ? "imageLabel" : "image";
  }

  return "text";
}

export function getChoiceSetVisualType(choices: ChoiceLike[]): ChoiceVisualType {
  const visualTypes = choices.map(getChoiceVisualType);
  const allText = visualTypes.every((type) => type === "text");
  const allImage = visualTypes.every((type) => type === "image");
  const allImageLabel = visualTypes.every((type) => type === "imageLabel" || type === "image");

  if (allText) return "text";
  if (allImage) return "image";
  if (allImageLabel) return "imageLabel";

  return "mixed";
}

export function getChoiceLayoutMode(
  choices: ChoiceLike[],
  contentType: ChoiceVisualType | "auto" = "auto"
): ChoiceLayoutMode {
  const visualType = contentType === "auto" ? getChoiceSetVisualType(choices) : contentType;
  const count = choices.length;
  const longestLabelLength = choices.reduce(
    (longest, choice) => Math.max(longest, (choice.label ?? "").trim().length),
    0
  );
  const longText = longestLabelLength > 22;

  if (visualType === "text") {
    if (count === 2) return longText ? "textVertical" : "textTwoByOne";
    if (count === 4) return longText ? "textVertical" : "textTwoByTwo";
    return "adaptive";
  }

  if (visualType === "image" || visualType === "imageLabel" || visualType === "mixed") {
    if (count === 2) return "imageTwoByOne";
    if (count === 4) return "imageTwoByTwo";
    return "imageVertical";
  }

  return "adaptive";
}
