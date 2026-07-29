const GRADE2_MEASUREMENT_MEANINGS: Record<string, string> = {
  capacity: "Capacity tells how much a container holds.",
  length: "Length tells how long something is.",
  "measurement-challenge": "Measurement challenge compares tools and units.",
  time: "Time tells when an event happens.",
  weight: "Weight tells how heavy something is.",
};

export function getScopedGrade2MeasurementMeaning(topicTitle: string): string {
  return GRADE2_MEASUREMENT_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
