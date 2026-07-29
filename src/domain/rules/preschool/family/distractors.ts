import type { FamilyPlayCard } from "./types";

export function getFamilyDistractorCardIds(
  cards: FamilyPlayCard[],
  requiredCardIds: string[]
) {
  return cards
    .filter((card) => !requiredCardIds.includes(card.id))
    .map((card) => card.id);
}
