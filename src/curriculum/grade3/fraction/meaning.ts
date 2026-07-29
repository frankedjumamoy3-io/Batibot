const GRADE3_FRACTION_MEANINGS: Record<string, string> = {
  "1-2": "One-half means one of two equal parts.",
  "1-3": "One-third means one of three equal parts.",
  "1-4": "One-fourth means one of four equal parts.",
  "color-the-fraction": "Color the fraction to show equal parts.",
  "compare-fractions": "Compare fractions by looking at equal parts.",
  "equal-parts": "Fractions need equal parts.",
  "fractions-in-real-objects": "Fractions can describe parts of real objects.",
};

export function getScopedGrade3FractionMeaning(topicTitle: string): string {
  return GRADE3_FRACTION_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/\//g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
