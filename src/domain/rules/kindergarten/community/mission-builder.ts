import { createKindergartenChoiceRuleBuilder } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_COMMUNITY_DISTRACTORS } from "./constants";

export const buildKindergartenCommunityChoiceRule =
  createKindergartenChoiceRuleBuilder(KINDERGARTEN_COMMUNITY_DISTRACTORS);
