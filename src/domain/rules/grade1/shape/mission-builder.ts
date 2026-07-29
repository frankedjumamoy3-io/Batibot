import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_SHAPE_PLAY_ACTION, GRADE1_SHAPE_RENDERER } from "./constants";
import type { Grade1ShapeMission } from "./types";

export function buildGrade1ShapeMission(
  topicTitle: string
): Grade1ShapeMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1ShapeRenderer() {
  return getGrade1RendererName(GRADE1_SHAPE_RENDERER);
}

export function getGrade1ShapePlayAction() {
  return getGrade1PlayAction(GRADE1_SHAPE_PLAY_ACTION);
}
