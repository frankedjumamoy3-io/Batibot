export type PreschoolPatternPlayMission = {
  destinationLabel: string;
  distractorChoiceIds: string[];
  prompt: string;
  requiredChoiceId: string;
  successText: string;
};

export type PreschoolPatternMissionInput = {
  answerId: string;
  choiceIds: string[];
};
