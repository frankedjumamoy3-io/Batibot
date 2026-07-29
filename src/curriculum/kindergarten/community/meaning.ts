const KINDERGARTEN_COMMUNITY_MEANINGS: Record<string, string> = {
  doctor: "A doctor helps sick people.",
  farmer: "A farmer grows food.",
  firefighter: "A firefighter puts out fire.",
  nurse: "A nurse gives care.",
  "police-officer": "A police officer keeps people safe.",
  teacher: "A teacher helps us learn.",
};

export function getKindergartenCommunityMeaning(topicTitle: string): string {
  return KINDERGARTEN_COMMUNITY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
