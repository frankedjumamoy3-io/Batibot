const GRADE1_TIME_MEANINGS: Record<string, string> = {
  afternoon: "Afternoon comes after morning.",
  evening: "Evening comes near night.",
  "half-hour": "Half hour means thirty minutes after the hour.",
  hour: "The short hand tells the hour.",
  morning: "Morning is when the day starts.",
};

export function getScopedGrade1TimeMeaning(topicTitle: string): string {
  return GRADE1_TIME_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
