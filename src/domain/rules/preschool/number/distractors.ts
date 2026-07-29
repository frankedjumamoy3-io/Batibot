import { getNumberQuantityFromTitle, isNumberChallengeTopic } from "@/src/curriculum/preschool/number";

function getStableHash(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

export function getStableShuffledItems<T>(items: T[], seed: string) {
  const shuffled = [...items];
  let state = getStableHash(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getNumberTryChoices(topicTitle: string) {
  if (isNumberChallengeTopic(topicTitle)) {
    const choices = ["Four missions", "Three missions"];

    return {
      correctAnswer: "Four missions",
      choices: getStableShuffledItems(choices, `${topicTitle}-number-try`),
    };
  }

  const quantity = getNumberQuantityFromTitle(topicTitle);
  if (!quantity) {
    return {
      correctAnswer: "5",
      choices: getStableShuffledItems(["5", "4"], `${topicTitle}-number-try`),
    };
  }

  const distractor = quantity === 10 ? 9 : quantity + 1;
  const choices = [`${quantity}`, `${distractor}`];

  return {
    correctAnswer: `${quantity}`,
    choices: getStableShuffledItems(choices, `${topicTitle}-number-try`),
  };
}

export function getNearbyQuantities(quantity: number) {
  const candidates = new Set([
    quantity,
    quantity === 10 ? 9 : quantity + 1,
    quantity <= 1 ? 2 : quantity - 1,
    quantity <= 7 ? quantity + 3 : quantity - 3,
  ]);

  for (let value = 1; value <= 10 && candidates.size < 4; value += 1) {
    candidates.add(value);
  }

  return Array.from(candidates)
    .filter((value) => value >= 1 && value <= 10)
    .slice(0, 4);
}
