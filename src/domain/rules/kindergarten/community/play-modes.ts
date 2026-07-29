import { createKindergartenPlayActionGetter } from "@/src/domain/rules/kindergarten/shared";

import { KINDERGARTEN_COMMUNITY_PLAY_ACTION } from "./constants";

export const getKindergartenCommunityPlayAction =
  createKindergartenPlayActionGetter(KINDERGARTEN_COMMUNITY_PLAY_ACTION);
