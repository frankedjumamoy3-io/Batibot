import { getShapeTopicKey } from "@/src/curriculum/preschool/shape";
import { repairChoicesForTarget } from "@/src/domain/rules/activity-integrity-rules";

import type { ShapePlayItem, ShapePlayMission, ShapePlayMode } from "./types";

function shapeItem(id: string, label?: string): ShapePlayItem {
  return {
    assetTopicTitle: label ?? id.charAt(0).toUpperCase() + id.slice(1),
    id,
    label: label ?? id.charAt(0).toUpperCase() + id.slice(1),
  };
}

export function buildShapeChooseActivity(
  topicTitle: string,
  shapeTopicTitles: string[],
) {
  const correctAnswer = topicTitle === "Shape Challenge" ? "Shape" : topicTitle;
  const distractors = shapeTopicTitles
    .filter((candidate) => candidate !== topicTitle)
    .map((candidate) => candidate === "Shape Challenge" ? "Shape" : candidate);
  const repaired = repairChoicesForTarget({
    choiceLimit: 4,
    choices: [correctAnswer, ...distractors].slice(0, 4),
    correctAnswer,
    distractorPool: distractors,
    targetConcept: correctAnswer,
  });

  return {
    choices: (repaired.activity.choices ?? []).map((choice) =>
      typeof choice === "string"
        ? choice
        : (choice.label ??
          choice.text ??
          choice.title ??
          choice.concept ??
          choice.id ??
          ""),
    ),
    correctAnswer,
  };
}

export function buildShapePlayMission(topicTitle: string): ShapePlayMission {
  const key = getShapeTopicKey(topicTitle);
  const single = (
    playMode: ShapePlayMode,
    prompt: string,
    required: string,
    distractors: string[],
    dropZoneLabel: string,
    successText: string,
  ): ShapePlayMission => ({
    distractorItemIds: distractors,
    dropZoneLabel,
    items: [required, ...distractors].map((id) => shapeItem(id)),
    optionalDropItemIds: [],
    playMode,
    prompt,
    requiredDropItemIds: [required],
    successText,
  });
  const missions: Record<string, ShapePlayMission> = {
    circle: single(
      "drag-circle-wheel",
      "Roll Circle.",
      "circle",
      ["square", "triangle", "star"],
      "Toy car",
      "Wheel attached.",
    ),
    square: single(
      "drag-square-window",
      "Build Window.",
      "square",
      ["circle", "triangle", "rectangle"],
      "Window",
      "Window complete.",
    ),
    triangle: single(
      "drag-triangle-roof",
      "Build Roof.",
      "triangle",
      ["circle", "square", "star"],
      "House",
      "Roof complete.",
    ),
    rectangle: single(
      "drag-rectangle-door",
      "Build Door.",
      "rectangle",
      ["square", "triangle", "circle"],
      "Doorway",
      "Door complete.",
    ),
    star: single(
      "drag-star-sky",
      "Light the Sky.",
      "star",
      ["circle", "triangle", "rectangle"],
      "Night sky",
      "Sky is bright.",
    ),
    "shape-challenge": {
      distractorItemIds: ["circle"],
      dropZoneLabel: "House",
      items: [
        shapeItem("square"),
        shapeItem("triangle"),
        shapeItem("rectangle"),
        shapeItem("star"),
        shapeItem("circle"),
      ],
      optionalDropItemIds: ["star"],
      playMode: "build-house",
      prompt: "Build House.",
      requiredDropItemIds: ["square", "triangle", "rectangle"],
      successText: "House complete.",
    },
  };

  return missions[key] ?? missions.circle;
}

export function recordShapeDrop(current: string[], itemId: string) {
  return current.includes(itemId) ? current : [...current, itemId];
}
