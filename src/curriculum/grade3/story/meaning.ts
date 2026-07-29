const GRADE3_STORY_MEANINGS: Record<string, string> = {
  "character-traits": "Character traits describe what a character is like.",
  "plot-events": "Plot events tell what happens in a story.",
  "story-theme": "Theme is the lesson or message of a story.",
};

export function getScopedGrade3StoryMeaning(topicTitle: string): string {
  return GRADE3_STORY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
