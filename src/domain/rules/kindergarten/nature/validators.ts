import { createKindergartenDistractorValidator } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_NATURE_DISTRACTORS } from "./constants";

export const validateKindergartenNatureDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_NATURE_DISTRACTORS);
