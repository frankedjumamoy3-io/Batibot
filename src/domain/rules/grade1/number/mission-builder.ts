import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import {
  GRADE1_NUMBER_PLAY_ACTION,
  GRADE1_NUMBER_RENDERER,
} from "./constants";
import type { Grade1NumberMission } from "./types";

export function buildGrade1NumberMission(
  topicTitle: string
): Grade1NumberMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1NumberRenderer() {
  return getGrade1RendererName(GRADE1_NUMBER_RENDERER);
}

export function getGrade1NumberPlayAction() {
  return getGrade1PlayAction(GRADE1_NUMBER_PLAY_ACTION);
}
