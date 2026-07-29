export function normalizeGrade3ChoiceLabel(choice: string) {
  return choice.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasDuplicateEquivalentGrade3Choices(choices: string[]) {
  const normalizedChoices = choices.map(normalizeGrade3ChoiceLabel);
  return new Set(normalizedChoices).size !== normalizedChoices.length;
}

export function getUniqueGrade3Choices(choices: string[]) {
  const seen = new Set<string>();

  return choices.filter((choice) => {
    const normalizedChoice = normalizeGrade3ChoiceLabel(choice);

    if (seen.has(normalizedChoice)) {
      return false;
    }

    seen.add(normalizedChoice);
    return true;
  });
}
