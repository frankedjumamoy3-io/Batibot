import { getColorTopicKey } from "@/src/curriculum/preschool/color";

const TRY_DISTRACTORS: Record<string, string> = {
  red: "Blue",
  blue: "Red",
  yellow: "Green",
  green: "Yellow",
  orange: "Purple",
  purple: "Orange",
  black: "White",
  white: "Black",
  "rainbow-color-challenge": "Black",
};

export function getColorTryDistractor(topicTitle: string) {
  return TRY_DISTRACTORS[getColorTopicKey(topicTitle)] ?? "Blue";
}
