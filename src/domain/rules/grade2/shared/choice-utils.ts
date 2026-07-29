export function normalizeGrade2ChoiceLabel(choice: string) {
  return choice.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasDuplicateEquivalentGrade2Choices(choices: string[]) {
  const normalizedChoices = choices.map(normalizeGrade2ChoiceLabel);
  return new Set(normalizedChoices).size !== normalizedChoices.length;
}

export function getUniqueGrade2Choices(choices: string[]) {
  const seen = new Set<string>();

  return choices.filter((choice) => {
    const normalizedChoice = normalizeGrade2ChoiceLabel(choice);

    if (seen.has(normalizedChoice)) {
      return false;
    }

    seen.add(normalizedChoice);
    return true;
  });
}
