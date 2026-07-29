import { getColorTopicKey } from "./stages";

const COLOR_MEANINGS: Record<string, string> = {
  red: "Apple color.",
  blue: "The sky color.",
  yellow: "The sun color.",
  green: "The leaf color.",
  orange: "A fruit color.",
  purple: "A grape color.",
  black: "Black is dark.",
  white: "White is light.",
  "rainbow-color-challenge": "Colors make rainbow.",
};

export function getColorMeaning(topicTitle: string) {
  return COLOR_MEANINGS[getColorTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
