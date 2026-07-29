const KINDERGARTEN_SCHOOL_MEANINGS: Record<string, string> = {
  bag: "A bag holds school things.",
  book: "A book has pages to read.",
  chair: "A chair is for sitting.",
  crayon: "A crayon helps us color.",
  desk: "A desk is where we work.",
  eraser: "An eraser helps fix writing.",
  notebook: "A notebook holds our work.",
  paper: "Paper is for drawing and writing.",
  pencil: "A pencil helps us write.",
};

export function getKindergartenSchoolMeaning(topicTitle: string): string {
  return KINDERGARTEN_SCHOOL_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
