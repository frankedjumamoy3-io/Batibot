const BODY_MEANINGS: Record<string, string> = {
  body: "Has many parts.",
  ears: "Help us hear.",
  eyes: "Help us see.",
  feet: "Help us walk.",
  hair: "Grows on the head.",
  hands: "Help us hold.",
  head: "Goes on top.",
  mouth: "Helps us eat.",
  nose: "Helps us smell.",
  teeth: "Help us chew.",
};

export function getBodyMeaning(topicTitle: string): string {
  return BODY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
