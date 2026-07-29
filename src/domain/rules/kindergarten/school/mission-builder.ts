import { createKindergartenChoiceRuleBuilder } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SCHOOL_DISTRACTORS } from "./constants";

export const buildKindergartenSchoolChoiceRule =
  createKindergartenChoiceRuleBuilder(KINDERGARTEN_SCHOOL_DISTRACTORS);
