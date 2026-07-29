import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SCHOOL_PLAY_ACTION } from "./constants";

export const getKindergartenSchoolPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_SCHOOL_PLAY_ACTION);
