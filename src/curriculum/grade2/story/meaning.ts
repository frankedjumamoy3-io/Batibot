const GRADE2_STORY_MEANINGS: Record<string, string> = {
  characters: "Characters are the people or animals in a story.",
  problem: "A story problem is what needs to be solved.",
  "problem-and-solution": "Problem and solution show what happened and how it was fixed.",
  setting: "Setting tells where and when a story happens.",
  "story-challenge": "Story challenge uses characters, setting, problem, and solution.",
};

export function getScopedGrade2StoryMeaning(topicTitle: string): string {
  return GRADE2_STORY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
