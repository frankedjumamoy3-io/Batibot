import { getKindergartenMathOptions } from "./topics";

export function getKindergartenMathMeaning(topicTitle: string): string {
  return (
    getKindergartenMathOptions().find((option) => option.label === topicTitle)?.meaning ??
    "Let's learn together."
  );
}
