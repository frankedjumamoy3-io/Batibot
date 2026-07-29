import type { ImageSourcePropType } from "react-native";

export type PreschoolInteractiveStageType =
  | "look"
  | "tap"
  | "try"
  | "choose"
  | "play";

export type PreschoolStageChoice = {
  hideLabel?: boolean;
  id: string;
  image: ImageSourcePropType;
  isCorrect: boolean;
  label?: string;
  symbol?: string;
};

export type PreschoolStageMatchRow = {
  id: string;
  image: ImageSourcePropType;
  label: string;
  targetLabel: string;
  symbol?: string;
};

export type PreschoolStagePatternPiece = {
  color: string;
  id: string;
  image?: ImageSourcePropType;
  label: string;
  symbol?: string;
};

export type PreschoolStagePatternSlot = {
  expectedPieceId: string;
  id: string;
  label: string;
};

export type PreschoolStageVisual = {
  color?: string;
  dotCount?: number;
  id: string;
  image?: ImageSourcePropType;
  label?: string;
  shape?: "circle" | "bar";
  size?: "small" | "medium" | "large" | "long" | "short" | "tall";
  symbol?: string;
};

export type PreschoolTapLessonSlide = {
  id: string;
  speech: string;
  text: string;
  title: string;
  visuals: PreschoolStageVisual[];
};

export type PreschoolChooseRevealPattern = {
  completionText: string;
  prompt: (PreschoolStageVisual | null)[];
  revealVisual: PreschoolStageVisual;
};

export type PreschoolStageWorldTopic<TTopicId extends string = string> = {
  id: TTopicId;
  label: string;
  order: number;
  look: {
    image: ImageSourcePropType;
    speech: string;
    symbol?: string;
    visuals?: PreschoolStageVisual[];
  };
  tap: {
    image: ImageSourcePropType;
    meaning: string;
    sound?: number;
    speech: string;
    slides?: PreschoolTapLessonSlide[];
    symbol?: string;
  };
  try: {
    question: string;
    choices: (PreschoolStageChoice & { label: string })[];
  };
  choose: {
    question: string;
    revealPattern?: PreschoolChooseRevealPattern;
    choices: PreschoolStageChoice[];
  };
  play: {
    task: string;
    timerSeconds: number;
    situationImage: ImageSourcePropType;
    completedImage: ImageSourcePropType;
    dropLabel: string;
    matchRows?: PreschoolStageMatchRow[];
    patternBuild?: {
      pieces: PreschoolStagePatternPiece[];
      slots: PreschoolStagePatternSlot[];
    };
    choices: (PreschoolStageChoice & { label: string })[];
  };
  reward: {
    stars: number;
    xp: number;
  };
};

export type PreschoolStageWorldConfig<TTopicId extends string = string> = {
  backgroundImage: ImageSourcePropType;
  gradeLevel?: "preschool" | "kindergarten";
  title: string;
  topics: PreschoolStageWorldTopic<TTopicId>[];
  wrongImage: ImageSourcePropType;
  worldId: string;
};
