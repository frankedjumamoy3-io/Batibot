const GRADE3_MONEY_MEANINGS: Record<string, string> = {
  "adding-money": "Adding money finds the total amount.",
  bills: "Bills show larger money amounts.",
  coins: "Coins show money amounts.",
  "money-word-problems": "Money word problems use amounts in real situations.",
};

export function getScopedGrade3MoneyMeaning(topicTitle: string): string {
  return GRADE3_MONEY_MEANINGS[toMeaningKey(topicTitle)] ?? "Let's learn together.";
}

function toMeaningKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
