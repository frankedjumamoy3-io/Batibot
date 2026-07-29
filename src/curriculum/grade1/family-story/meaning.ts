const GRADE1_FAMILY_STORY_MEANINGS: Record<string, string> = {
  "family-sentences": "Family sentences tell about people and actions.",
  "family-stories": "A family story tells who, what, and what happens.",
  "family-story-challenge": "Family story missions use characters and events.",
  "story-characters": "A story character is who the story is about.",
};

export function getScopedGrade1FamilyStoryMeaning(topicTitle: string): string {
  return GRADE1_FAMILY_STORY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
