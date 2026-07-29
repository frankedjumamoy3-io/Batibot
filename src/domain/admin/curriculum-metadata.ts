export type StageType = "LOOK" | "TAP" | "TRY" | "CHOOSE" | "PLAY" | "REWARD";

export type ActivityType =
  | "tapReveal"
  | "singleChoice"
  | "multiChoice"
  | "dragDrop"
  | "matching"
  | "sorting"
  | "sequence"
  | "build"
  | "fillBlank"
  | "speak"
  | "count"
  | "equationBuilder"
  | "highlight"
  | "clockInteraction"
  | "fractionSelect"
  | "moneyBuilder";

export type EditableStageField =
  | "instruction"
  | "title"
  | "word"
  | "meaning"
  | "example"
  | "body"
  | "passage"
  | "question"
  | "choices"
  | "correctAnswer"
  | "feedbackCorrect"
  | "feedbackIncorrect"
  | "activityType"
  | "activityPrompt"
  | "timerSeconds"
  | "assetRefs"
  | "pronunciationText";

export type LockedStageSection =
  | "header"
  | "progress"
  | "contentContainer"
  | "feedbackContainer"
  | "primaryButton"
  | "stageOrder"
  | "worldTheme"
  | "rendererKey";

export type GradeMetadata = {
  curriculumFocus: string[];
  id: string;
  order: number;
  targetLearnerDescription: string;
  title: string;
  worldIds: string[];
};

export type WorldThemeMetadata = {
  accentColorToken?: string;
  backgroundRef?: string;
  cardStyleKey?: string;
  primaryColorToken?: string;
  worldIconRef?: string;
};

export type WorldMetadata = {
  challengeTopicId?: string;
  defaultStageOrder: StageType[];
  description?: string;
  gradeLevel: string;
  id: string;
  order: number;
  templateSourceTopicId?: string;
  theme: WorldThemeMetadata;
  title: string;
  topicIds: string[];
};

export type TopicMetadata = {
  assetRefs?: string[];
  difficulty?: "easy" | "medium" | "hard";
  gradeLevel: string;
  id: string;
  isChallenge: boolean;
  isPublishedStatic: boolean;
  objective?: string;
  order: number;
  slug: string;
  stageTypes: StageType[];
  title: string;
  worldId: string;
};

export type ChoiceRules = {
  allowImageChoices: boolean;
  allowMixedChoices: boolean;
  allowTextChoices: boolean;
  correctAnswerCount: number;
  maxChoices: number;
  minChoices: number;
  preventDuplicateAssets: boolean;
  preventDuplicateLabels: boolean;
};

export type AssetSlotRule = {
  allowSharedAsset: boolean;
  id: string;
  maxCount: number;
  minCount: number;
  required: boolean;
  role:
    | "primaryVisual"
    | "secondaryVisual"
    | "choiceVisual"
    | "distractorVisual"
    | "background"
    | "audio"
    | "speakerTarget"
    | "draggable"
    | "dropZone"
    | "rewardVisual";
  type: "image" | "audio" | "background" | "icon";
};

export type FeedbackRules = {
  correctStateKey: string;
  defaultCorrectText?: string;
  defaultIncorrectText?: string;
  incorrectStateKey: string;
  requiresCorrectFeedback: boolean;
  requiresIncorrectFeedback: boolean;
};

export type TimerRules = {
  defaultSeconds?: number;
  editableByAdmin: boolean;
  enabled: boolean;
  maximumSeconds?: number;
  minimumSeconds?: number;
};

export type MobileLayoutRules = {
  contentScrollable: boolean;
  fixedBottomButton: boolean;
  longChoiceLayout: "column";
  maxChoiceCountVisibleWithoutScroll: number;
  maxChoiceLines: number;
  maxInstructionLines: number;
  maxQuestionLines: number;
  maxTitleLines: number;
  passageInternallyScrollable: boolean;
  shortChoiceLayout: "grid" | "row" | "column";
};

export type CurriculumAuthoringRule = {
  appliesToStages?: StageType[];
  description: string;
  id: string;
  severity: "error" | "warning";
};

export type StageTemplate = {
  allowedActivityTypes: ActivityType[];
  assetSlotRules: AssetSlotRule[];
  choiceRules?: ChoiceRules;
  editableFields: EditableStageField[];
  feedbackRules: FeedbackRules;
  layoutKey: string;
  lockedSections: LockedStageSection[];
  mobileLayoutRules: MobileLayoutRules;
  optionalFields: string[];
  rendererKey: string;
  requiredFields: string[];
  stageIndex: number;
  stageType: StageType;
  timerRules?: TimerRules;
  totalStages: number;
};

export type WorldTopicTemplate = {
  curriculumRules: CurriculumAuthoringRule[];
  gradeLevel: string;
  sourceTopicId?: string;
  stageOrder: StageType[];
  stageTemplates: Record<StageType, StageTemplate>;
  topicPlacementRule: {
    challengeTopicId?: string;
    strategy: "beforeChallenge";
  };
  worldId: string;
  worldTheme: WorldThemeMetadata;
};

export type MetadataDiagnostic = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export class BatiBotMetadataError extends Error {
  constructor(
    public readonly code: "UNKNOWN_GRADE" | "UNKNOWN_WORLD" | "UNKNOWN_TOPIC" | "UNKNOWN_STAGE",
    message: string
  ) {
    super(message);
    this.name = "BatiBotMetadataError";
  }
}
