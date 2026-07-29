import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import {
  GRADE1_NATURE_PLAY_ACTION,
  GRADE1_NATURE_RENDERER,
} from "./constants";
import type { Grade1NatureMission } from "./types";

export function buildGrade1NatureMission(
  topicTitle: string
): Grade1NatureMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1NatureRenderer() {
  return getGrade1RendererName(GRADE1_NATURE_RENDERER);
}

export function getGrade1NaturePlayAction() {
  return getGrade1PlayAction(GRADE1_NATURE_PLAY_ACTION);
}
