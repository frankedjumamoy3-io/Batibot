import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import { GRADE1_WORD_PLAY_ACTION, GRADE1_WORD_RENDERER } from "./constants";
import type { Grade1WordMission } from "./types";

export function buildGrade1WordMission(topicTitle: string): Grade1WordMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1WordRenderer() {
  return getGrade1RendererName(GRADE1_WORD_RENDERER);
}

export function getGrade1WordPlayAction() {
  return getGrade1PlayAction(GRADE1_WORD_PLAY_ACTION);
}
