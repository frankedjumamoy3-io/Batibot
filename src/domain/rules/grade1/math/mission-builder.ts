import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_MATH_PLAY_ACTION, GRADE1_MATH_RENDERER } from "./constants";
import type { Grade1MathMission } from "./types";

export function buildGrade1MathMission(
  topicTitle: string
): Grade1MathMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1MathRenderer() {
  return getGrade1RendererName(GRADE1_MATH_RENDERER);
}

export function getGrade1MathPlayAction() {
  return getGrade1PlayAction(GRADE1_MATH_PLAY_ACTION);
}
