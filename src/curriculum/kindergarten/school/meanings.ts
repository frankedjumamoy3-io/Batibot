import { getKindergartenSchoolTopicKey } from "./stages";

const KINDERGARTEN_SCHOOL_MEANINGS: Record<string, string> = {
  bag: "A bag holds school things.",
  book: "A book has pages to read.",
  paper: "Paper is for drawing and writing.",
  chair: "A chair is for sitting.",
  crayon: "A crayon helps us color.",
  desk: "A desk is where we work.",
  eraser: "An eraser helps fix writing.",
  notebook: "A notebook holds our work.",
  pencil: "A pencil helps us write.",
};

export function getKindergartenSchoolMeaning(topicTitle: string) {
  return (
    KINDERGARTEN_SCHOOL_MEANINGS[
      getKindergartenSchoolTopicKey(topicTitle)
    ] ?? `${topicTitle}.`
  );
}
