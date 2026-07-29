import { createKindergartenChoiceRuleBuilder } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SHAPE_DISTRACTORS } from "./constants";

export const buildKindergartenShapeChoiceRule =
  createKindergartenChoiceRuleBuilder(KINDERGARTEN_SHAPE_DISTRACTORS);
