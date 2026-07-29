import { createKindergartenDistractorValidator } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SHAPE_DISTRACTORS } from "./constants";

export const validateKindergartenShapeDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_SHAPE_DISTRACTORS);
