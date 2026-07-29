import type { Grade1Mission } from "./types";

export function buildGrade1TopicMission(topicTitle: string): Grade1Mission {
  return {
    prompt: `Use ${topicTitle}.`,
    target: topicTitle,
  };
}

export function getGrade1RendererName(renderer: string) {
  return renderer;
}

export function getGrade1PlayAction<TPlayAction extends string>(
  playAction: TPlayAction
) {
  return playAction;
}
