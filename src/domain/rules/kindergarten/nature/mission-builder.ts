import { createKindergartenChoiceRuleBuilder } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_NATURE_DISTRACTORS } from "./constants";

export const buildKindergartenNatureChoiceRule =
  createKindergartenChoiceRuleBuilder(KINDERGARTEN_NATURE_DISTRACTORS);
