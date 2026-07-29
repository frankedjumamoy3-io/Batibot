const GRADE3_READING_MEANINGS: Record<string, string> = {
  "cause-and-effect": "Cause and effect show why something happened.",
  "fact-and-opinion": "Facts can be proven; opinions tell what someone thinks.",
  "main-idea-and-details": "The main idea is supported by important details.",
  paragraphs: "A paragraph has connected sentences about one topic.",
  "reading-challenge": "Reading challenge uses evidence across a passage.",
  "reading-words": "Readers use word parts and sentence meaning.",
  sentences: "Sentences work together to make meaning.",
  sequence: "Sequence tells the order of events.",
};

export function getScopedReadingAdventureMeaning(topicTitle: string): string {
  return GRADE3_READING_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
