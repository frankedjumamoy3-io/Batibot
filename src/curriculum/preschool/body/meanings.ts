import { getBodyTopicKey } from "./stages";

const BODY_MEANINGS: Record<string, string> = {
  head: "Goes on top.",
  hair: "Grows on the head.",
  eyes: "Help us see.",
  ears: "Help us hear.",
  nose: "Helps us smell.",
  mouth: "Helps us eat.",
  teeth: "Help us chew.",
  hands: "Help us hold.",
  feet: "Help us walk.",
  body: "Has many parts.",
};

export function getBodyMeaning(topicTitle: string) {
  return BODY_MEANINGS[getBodyTopicKey(topicTitle)] ?? `${topicTitle}.`;
}
