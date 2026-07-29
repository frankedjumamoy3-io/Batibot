import { createKindergartenDistractorValidator } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_COMMUNITY_DISTRACTORS } from "./constants";

export const validateKindergartenCommunityDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_COMMUNITY_DISTRACTORS);
