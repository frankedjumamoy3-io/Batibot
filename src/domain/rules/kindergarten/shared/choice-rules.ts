import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

export type KindergartenChoiceRule = {
  correctAnswer: string;
  distractors: string[];
};

export function buildKindergartenChoiceRule(
  correctAnswer: string,
  distractorPool: string[]
): KindergartenChoiceRule {
  const distractors = distractorPool.filter(
    (candidate) => candidate !== correctAnswer
  );
  const repaired = repairChoicesForTarget({
    choiceLimit: 4,
    choices: [correctAnswer, ...distractors],
    correctAnswer,
    distractorPool: distractors,
    targetConcept: correctAnswer,
  });

  return {
    correctAnswer,
    distractors: (repaired.activity.choices ?? [])
      .map((choice) =>
        typeof choice === "string"
          ? choice
          : choice.label ?? choice.text ?? choice.title ?? choice.concept ?? choice.id ?? ""
      )
      .filter((choice) => choice !== correctAnswer),
  };
}

export function createKindergartenChoiceRuleBuilder(distractorPool: string[]) {
  return (correctAnswer: string) =>
    buildKindergartenChoiceRule(correctAnswer, distractorPool);
}

export function validateKindergartenDistractors(
  correctAnswer: string,
  distractorPool: string[]
) {
  return (
    Boolean(correctAnswer) &&
    distractorPool.some((candidate) => candidate !== correctAnswer)
  );
}
