import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_READING_PLAY_ACTION, GRADE1_READING_RENDERER } from "./constants";
import type { Grade1ReadingMission } from "./types";

export function buildGrade1ReadingMission(
  topicTitle: string
): Grade1ReadingMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1ReadingRenderer() {
  return getGrade1RendererName(GRADE1_READING_RENDERER);
}

export function getGrade1ReadingPlayAction() {
  return getGrade1PlayAction(GRADE1_READING_PLAY_ACTION);
}
