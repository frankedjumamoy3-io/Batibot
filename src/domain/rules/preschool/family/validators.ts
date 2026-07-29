import type { FamilyChooseActivity, FamilyPlayMission } from "./types";

export function validateChooseActivity(activity: FamilyChooseActivity) {
  const normalizedChoices = activity.choices.map((choice) =>
    choice.trim().toLowerCase()
  );
  const correctMatches = normalizedChoices.filter(
    (choice) => choice === activity.correctAnswer.trim().toLowerCase()
  ).length;

  return (
    activity.choices.length === 4 &&
    correctMatches === 1 &&
    new Set(normalizedChoices).size === normalizedChoices.length
  );
}

export function validatePlayMission(mission: FamilyPlayMission) {
  const cardIds = mission.cards.map((card) => card.id);

  return (
    mission.cards.length === 4 &&
    mission.destinationLabel.trim().length > 0 &&
    mission.dropZoneId.trim().length > 0 &&
    mission.prompt.trim().length > 0 &&
    mission.successText.trim().length > 0 &&
    mission.requiredCardIds.length > 0 &&
    mission.requiredCardIds.every((id) => cardIds.includes(id)) &&
    mission.distractorCardIds.every((id) => cardIds.includes(id)) &&
    !mission.requiredCardIds.some((id) => mission.distractorCardIds.includes(id)) &&
    new Set(cardIds).size === mission.cards.length
  );
}

export function validateCorrectAnswer(
  correctAnswer: string,
  choices: string[]
) {
  const normalizedAnswer = correctAnswer.trim().toLowerCase();

  return choices.filter(
    (choice) => choice.trim().toLowerCase() === normalizedAnswer
  ).length === 1;
}

export function validateDropTarget(
  mission: FamilyPlayMission,
  droppedCardId: string | null,
  droppedCardIds: string[] = []
) {
  if (
    !droppedCardId ||
    droppedCardIds.includes(droppedCardId) ||
    !mission.cards.some((card) => card.id === droppedCardId)
  ) {
    return false;
  }

  if (
    mission.enforceHomeFirst &&
    droppedCardId !== "home" &&
    mission.requiredCardIds.includes(droppedCardId) &&
    !droppedCardIds.includes("home")
  ) {
    return false;
  }

  return true;
}
