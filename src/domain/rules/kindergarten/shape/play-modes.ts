import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_SHAPE_PLAY_ACTION } from "./constants";

export const getKindergartenShapePlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_SHAPE_PLAY_ACTION);
