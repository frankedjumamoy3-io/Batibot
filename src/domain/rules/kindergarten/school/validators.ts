import { createKindergartenDistractorValidator } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SCHOOL_DISTRACTORS } from "./constants";

export const validateKindergartenSchoolDistractors =
  createKindergartenDistractorValidator(KINDERGARTEN_SCHOOL_DISTRACTORS);
