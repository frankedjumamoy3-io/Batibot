import { getBodyTopicKey } from "@/src/curriculum/preschool/body";

const BODY_TRY_DISTRACTORS: Record<string, string> = {
  head: "Hands",
  hair: "Feet",
  eyes: "Nose",
  ears: "Mouth",
  nose: "Eyes",
  mouth: "Ears",
  teeth: "Hands",
  hands: "Feet",
  feet: "Hands",
  body: "Toy",
};

export function getBodyTryDistractor(topicTitle: string) {
  return BODY_TRY_DISTRACTORS[getBodyTopicKey(topicTitle)] ?? "Hands";
}
