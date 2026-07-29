import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_TIME_PLAY_ACTION, GRADE1_TIME_RENDERER } from "./constants";
import type { Grade1TimeMission } from "./types";

export function buildGrade1TimeMission(topicTitle: string): Grade1TimeMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1TimeRenderer() {
  return getGrade1RendererName(GRADE1_TIME_RENDERER);
}

export function getGrade1TimePlayAction() {
  return getGrade1PlayAction(GRADE1_TIME_PLAY_ACTION);
}
