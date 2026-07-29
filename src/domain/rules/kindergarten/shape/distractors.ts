import type { VocabularyCategory } from "@/src/data/vocabulary/types";

import { KINDERGARTEN_SHAPE_DISTRACTORS } from "./constants";

export function getKindergartenShapeFriendlyDistractors(
  category?: VocabularyCategory
) {
  if (category === "numeric") {
    return ["1", "2", "3", "4", "5", "More", "Less"];
  }

  return KINDERGARTEN_SHAPE_DISTRACTORS;
}
