import type { StageTemplate, StageType } from "@/src/domain/admin/curriculum-metadata";

export type StageRenderMode = "learner" | "adminPreview";
export type StagePreviewFeedbackState = "default" | "correct" | "wrong";

export type StageContentChoice = {
  assetRef?: string;
  id: string;
  isCorrect?: boolean;
  label: string;
};

export type StageContentAssetReference = {
  assetId: string;
  role: string;
  type: "image" | "audio" | "background" | "icon";
  uri?: string;
};

export type StageTemplateContent = {
  activityData?: unknown;
  activityPrompt?: string;
  activityType?: string;
  assets?: StageContentAssetReference[];
  body?: string;
  choices?: StageContentChoice[];
  correctAnswerIds?: string[];
  example?: string;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  instruction: string;
  meaning?: string;
  passage?: string;
  pronunciationText?: string;
  question?: string;
  stageType: StageType;
  title?: string;
  word?: string;
};

export type StageRuntimeState = {
  feedbackMessage?: string;
  feedbackState?: StagePreviewFeedbackState;
  interaction?: {
    dragResult?: unknown;
    matchingResult?: unknown;
    sequenceResult?: unknown;
    speechPassed?: boolean;
    speechTranscript?: string;
  };
  isCorrect?: boolean;
  primaryActionEnabled?: boolean;
  selectedChoiceIds?: string[];
  submitted?: boolean;
  timer?: {
    enabled: boolean;
    expired?: boolean;
    remainingSeconds?: number;
  };
};

export type StageRenderHandlers = {
  onAssetPress?: (assetId: string) => void;
  onChoicePress?: (choiceId: string) => void;
  onDone?: () => void;
  onDragComplete?: (result: unknown) => void;
  onHear?: () => void;
  onMatchComplete?: (result: unknown) => void;
  onNext?: () => void;
  onSequenceChange?: (result: unknown) => void;
  onSpeak?: () => void;
  onSubmit?: () => void;
};

export type SharedStageRenderInput = {
  content: StageTemplateContent;
  runtime: StageRuntimeState;
  template: StageTemplate;
};
