export type FamilyMissionRound = {
  destination: string;
  distractors: [string, string];
  target: string;
};

export type FamilyTopicLesson = {
  chooseOptions: [string, string, string];
  choosePrompt: string;
  discoveries: [string, string, string];
  guidedAnswer: string;
  guidedDistractor: string;
  guidedPrompt: string;
  lookLine: string;
  missionTitle: string;
  roleLine: string;
  rounds: [FamilyMissionRound, FamilyMissionRound, FamilyMissionRound];
};
