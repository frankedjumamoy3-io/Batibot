import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_NATURE_PLAY_ACTION } from "./constants";

export const getKindergartenNaturePlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_NATURE_PLAY_ACTION);
