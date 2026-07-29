const KINDERGARTEN_NATURE_MEANINGS: Record<string, string> = {
  cloud: "A cloud floats in the sky.",
  flower: "A flower grows in many colors.",
  moon: "The Moon shines at night.",
  rain: "Rain gives water to plants.",
  sun: "The Sun shines in the daytime.",
  tree: "A tree is a big plant.",
};

export function getKindergartenNatureMeaning(topicTitle: string): string {
  return KINDERGARTEN_NATURE_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
