import {
  buildGrade1TopicMission,
  getGrade1PlayAction,
  getGrade1RendererName,
} from "@/src/domain/rules/grade1/shared";

import {
  GRADE1_FAMILY_STORY_PLAY_ACTION,
  GRADE1_FAMILY_STORY_RENDERER,
} from "./constants";
import type { Grade1FamilyStoryMission } from "./types";

export function buildGrade1FamilyStoryMission(
  topicTitle: string
): Grade1FamilyStoryMission {
  return buildGrade1TopicMission(topicTitle);
}

export function getGrade1FamilyStoryRenderer() {
  return getGrade1RendererName(GRADE1_FAMILY_STORY_RENDERER);
}

export function getGrade1FamilyStoryPlayAction() {
  return getGrade1PlayAction(GRADE1_FAMILY_STORY_PLAY_ACTION);
}
