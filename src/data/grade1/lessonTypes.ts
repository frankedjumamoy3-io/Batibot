export type Grade1WorldId =
  | "grade1-word-kingdom"
  | "grade1-reading"
  | "grade1-number-kingdom"
  | "grade1-math";

export type Grade1LessonStageId =
  | "look"
  | "tap"
  | "try"
  | "choose"
  | "play-match"
  | "play-apply"
  | "challenge"
  | "reward";

export type Grade1StageLabel =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "CHALLENGE"
  | "REWARD";

export type Grade1ActivityType =
  | "observe"
  | "carousel"
  | "singleChoice"
  | "multiSelect"
  | "liveArrowMatch"
  | "dragDrop"
  | "sentenceComplete"
  | "memoryMatch"
  | "categorySort"
  | "mixedQuiz"
  | "reward";

export type Grade1WordItem = {
  category?: string;
  id: string;
  imageKey?: string;
  meaning?: string;
  sentence?: string;
  word: string;
};

export type Grade1WordPair = {
  id: string;
  left: string;
  leftImageKey?: string;
  relation: "opposite" | "similar";
  right: string;
  rightImageKey?: string;
};

export type Grade1ChoiceItem = {
  id: string;
  imageKey?: string;
  isCorrect?: boolean;
  label: string;
};

export type Grade1MatchPair = {
  sourceId: string;
  targetId: string;
};

export type Grade1ChallengeQuestion = {
  activityType:
    | "singleChoice"
    | "multiSelect"
    | "liveArrowMatch"
    | "sentenceComplete"
    | "categorySort";
  choices?: Grade1ChoiceItem[];
  correctAnswerIds?: string[];
  id: string;
  matchPairs?: Grade1MatchPair[];
  prompt: string;
};

export type Grade1RewardPayload = {
  badgeName: string;
  stars: number;
  unlocksWorldId?: Grade1WorldId | string;
  xp: number;
};

export type Grade1LessonStage = {
  activityType: Grade1ActivityType;
  choices?: Grade1ChoiceItem[];
  correctAnswerIds?: string[];
  instruction: string;
  items?: Grade1WordItem[];
  matchPairs?: Grade1MatchPair[];
  pairs?: Grade1WordPair[];
  prompt?: string;
  progressIndex: number;
  questions?: Grade1ChallengeQuestion[];
  reward?: Grade1RewardPayload;
  stageLabel: Grade1StageLabel;
  id: Grade1LessonStageId;
  title: string;
  totalStages: 8;
};

export type Grade1LessonTopic = {
  id: string;
  items?: Grade1WordItem[];
  objective: string;
  pairs?: Grade1WordPair[];
  shortDefinition: string;
  stages: Grade1LessonStage[];
  title: string;
  worldId: Grade1WorldId;
};

export const GRADE1_LESSON_STAGE_ORDER: Grade1LessonStageId[] = [
  "look",
  "tap",
  "try",
  "choose",
  "play-match",
  "play-apply",
  "challenge",
  "reward",
];
