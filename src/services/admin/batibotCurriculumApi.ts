import { batibotAssetRegistry } from "@/src/assets/assetRegistry";

export type GradeLevel =
  | "Preschool"
  | "Kindergarten"
  | "Grade 1"
  | "Grade 2"
  | "Grade 3";

export type LessonStageType =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "REWARD"
  | "PROGRESS"
  | "MASTERY";

export type CurriculumSubjectArea = "vocabulary" | "reading" | "math" | "mixed";

export type ValidationSeverity = "pass" | "warning" | "error";

export type ValidationResult = {
  field?: string;
  id: string;
  message: string;
  severity: ValidationSeverity;
};

export type StageMetadata = {
  activityType: string;
  contentRequirements: string[];
  instructionGuidance: string;
  stageLabel: LessonStageType;
  validationRules: string[];
};

export type CurriculumTopicMetadata = {
  allowedActivityTypes: string[];
  defaultInstruction: string;
  description: string;
  topicType: string;
};

export type CurriculumWorldMetadata = {
  allowedPlayActivityTypes: string[];
  allowedTopicTypes: string[];
  contentRules: string[];
  geminiPromptGuidance: string[];
  maxExamples: number;
  requiredStages: LessonStageType[];
  stageMetadata: StageMetadata[];
  subjectArea: CurriculumSubjectArea;
  title: string;
  topicMetadata: CurriculumTopicMetadata[];
  topicTitles: string[];
  validationRules: string[];
  worldId: string;
};

export type CurriculumGradeMetadata = {
  gradeLevel: GradeLevel;
  gradeRules: string[];
  worlds: CurriculumWorldMetadata[];
};

export type CurriculumMetadata = {
  generatedFor: "admin-content-curation";
  gradeLevels: CurriculumGradeMetadata[];
  requiredStages: LessonStageType[];
  version: string;
};

export type TopicBuildRequest = {
  adminPrompt?: string;
  exampleCount: number;
  gradeLevel: GradeLevel | string;
  topicTitle: string;
  topicType: string;
  worldId: string;
};

export type TopicBuildSpec = {
  adminPrompt: string;
  allowedActivityTypes: string[];
  contentRules: string[];
  exampleCount: number;
  grade: CurriculumGradeMetadata | null;
  gradeLevel: string;
  requiredStages: StageMetadata[];
  topicTitle: string;
  topicType: string;
  validationRules: string[];
  world: CurriculumWorldMetadata | null;
  worldId: string;
};

export type ContentDraftStageType = Exclude<LessonStageType, "PROGRESS" | "MASTERY">;

export type CurriculumContentMetadata = {
  contentRules: {
    ageAppropriate: boolean;
    mustFitMobileLayout: boolean;
    mustMatchTopic: boolean;
    noPlaceholderText: boolean;
    oneObjectiveOnly: boolean;
    shortInstructionRequired: boolean;
    useExistingAssetsOnly: boolean;
  };
  currentContent?: {
    choices?: string[];
    correctAnswer?: string | string[];
    example?: string;
    feedbackCorrect?: string;
    feedbackIncorrect?: string;
    instruction?: string;
    meaning?: string;
    passage?: string;
    question?: string;
    title?: string;
  };
  existingAssetRefs: {
    audio: string[];
    backgrounds: string[];
    icons: string[];
    images: string[];
  };
  gradeLevel: string;
  gradeTitle: string;
  learnerUiSchema: {
    allowedInteractionTypes?: string[];
    contentMaxLength?: number;
    layout: "standardStage";
    maxInstructionLines: number;
    requiredSections: ["header", "progress", "instruction", "content", "feedback", "button"];
    requiresChoices?: boolean;
    requiresCorrectAnswer?: boolean;
    supportsAssets?: boolean;
    supportsAudio?: boolean;
    supportsSpeech?: boolean;
  };
  stageIndex: number;
  stageType: ContentDraftStageType;
  topicDifficulty?: "easy" | "medium" | "hard";
  topicId: string;
  topicObjective?: string;
  topicOrder?: number;
  topicTitle: string;
  totalStages: number;
  worldBackgroundRef?: string;
  worldDescription?: string;
  worldIconRef?: string;
  worldId: string;
  worldOrder?: number;
  worldTitle: string;
};

export type StageAuthoringRules = {
  allowedActivityTypes: string[];
  layoutSections: ["header", "progress", "instruction", "content", "feedback", "button"];
  maxChoiceCount?: number;
  maxInstructionLines: number;
  requiresChoices?: boolean;
  requiresCorrectAnswer?: boolean;
  requiresFeedback: boolean;
  requiresQuestion?: boolean;
  stageType: ContentDraftStageType;
};

export type StageTemplateSection =
  | "header"
  | "progress"
  | "instruction"
  | "topicTitle"
  | "contentCard"
  | "assetContainer"
  | "readingCard"
  | "questionCard"
  | "choiceGrid"
  | "interactiveArea"
  | "feedback"
  | "button"
  | "rewardCard";

export type EditableStageField =
  | "instruction"
  | "title"
  | "meaning"
  | "body"
  | "example"
  | "passage"
  | "question"
  | "choices"
  | "correctAnswer"
  | "feedbackCorrect"
  | "feedbackIncorrect"
  | "activityType"
  | "timer"
  | "assetRefs";

export type StageTemplateContent = {
  activityType?: string;
  assetKey?: string;
  assetLabel?: string;
  assetRefs?: CurriculumContentMetadata["existingAssetRefs"];
  assetUri?: string;
  body?: string;
  choices?: {
    id: string;
    isCorrect?: boolean;
    label: string;
  }[];
  correctAnswer?: string | string[];
  example?: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  instruction: string;
  items?: unknown[];
  meaning?: string;
  passage?: string;
  question?: string;
  stageType: ContentDraftStageType;
  title?: string;
};

export type StageTemplate = {
  activityTypes: string[];
  buttonLabel: "Next" | "Done" | "Reward";
  choiceLayout: "none" | "two-column" | "single-column" | "auto";
  editableFields: EditableStageField[];
  emptyContent: StageTemplateContent;
  gradeLevel: string;
  id: string;
  layout: "standardStage";
  lockedSections: StageTemplateSection[];
  previewStates: ["default", "correct", "wrong"];
  requiresAssets: boolean;
  requiresChoices: boolean;
  requiresCorrectAnswer: boolean;
  requiresFeedback: boolean;
  requiresQuestion: boolean;
  sections: StageTemplateSection[];
  stageIndex: number;
  stageType: ContentDraftStageType;
  topicId: string;
  topicTitle: string;
  totalStages: number;
  validationRules: string[];
  worldBackgroundRef?: string;
  worldId: string;
  worldTitle: string;
};

export type AdminContentDraftRequest = {
  adminPrompt?: string;
  contentKind:
    | "meaning"
    | "example"
    | "instruction"
    | "activity"
    | "question"
    | "readingPassage"
    | "story"
    | "assessment"
    | "playActivity";
  gradeLevel: string;
  stageType: ContentDraftStageType;
  topicId: string;
  worldId: string;
};

export type ContentDraftValidationResult = {
  passed: boolean;
  results: ValidationResult[];
};

type DraftRecord = Record<string, unknown>;

export const ADMIN_REQUIRED_STAGES: LessonStageType[] = [
  "LOOK",
  "TAP",
  "TRY",
  "CHOOSE",
  "PLAY",
  "REWARD",
  "PROGRESS",
  "MASTERY",
];

const GRADE_RULES: Record<GradeLevel, string[]> = {
  "Grade 1": [
    "Balance images and text.",
    "Use short sentences and picture-supported examples.",
    "PLAY should use matching, sorting, sentence building, or object-based math.",
  ],
  "Grade 2": [
    "Use text-first activities with clear visual support when useful.",
    "Use evidence cards, base-ten models, measurement tools, and reasoning workspaces.",
    "PLAY validates full work only after Done.",
  ],
  "Grade 3": [
    "Use passages, evidence, multi-step reasoning, fraction models, and strategy panels.",
    "Keep reading passages concise and internally scrollable if needed.",
    "PLAY should use matching, sorting, evidence selection, or functional math interactions.",
  ],
  Kindergarten: [
    "Use image-first letter, sound, number, pattern, and matching activities.",
    "Keep labels short and tap targets large.",
    "Use two-choice or four-choice layouts for choice stages.",
  ],
  Preschool: [
    "Use mostly visual content with minimal text.",
    "Use one idea per screen and very large images.",
    "Use two-choice or four-choice layouts for choice stages.",
  ],
};

const SUBJECT_RULES: Record<CurriculumSubjectArea, string[]> = {
  math: [
    "Use number models, equations, comparisons, or manipulatives.",
    "PLAY must require a meaningful solve, match, sort, count, or arrange action.",
    "Correct answers must be unique and visible before publishing.",
  ],
  mixed: [
    "Keep instructions short and action-based.",
    "Use grade-appropriate interaction complexity.",
    "Assets must support the task, not decorate it.",
  ],
  reading: [
    "Use brief passages with evidence-based questions.",
    "TAP examples need a meaning or explanation.",
    "PLAY should validate comprehension, evidence, sequence, or inference.",
  ],
  vocabulary: [
    "Use concrete examples and age-appropriate distractors.",
    "TAP must teach word meaning or usage.",
    "PLAY should use matching, sorting, classification, or application.",
  ],
};

const SUBJECT_PLAY_TYPES: Record<CurriculumSubjectArea, string[]> = {
  math: ["matching", "sorting", "arrange", "equation", "number-model", "measurement", "clock", "money"],
  mixed: ["matching", "sorting", "sequence", "tap-to-place", "applied-play"],
  reading: ["matching", "evidence-selection", "sequence", "comprehension", "context-clue"],
  vocabulary: ["matching", "sorting", "classification", "sentence-use", "word-meaning"],
};

const TOPIC_TYPE_METADATA: Record<CurriculumSubjectArea, CurriculumTopicMetadata[]> = {
  math: [
    topicType("number-model", "Use number cards, place-value models, or comparison cards.", ["number-model", "matching"]),
    topicType("equation", "Use equation cards with one clear correct answer.", ["equation", "matching"]),
    topicType("word-problem", "Use a short story problem and a visible workspace.", ["word-problem", "evidence-selection"]),
    topicType("measurement", "Use units, tools, or sortable measurement chips.", ["measurement", "sorting"]),
    topicType("matching", "Match terms, models, equations, or answers.", ["matching"]),
  ],
  mixed: [
    topicType("concept", "Introduce one concept with examples and a simple application.", ["matching", "sorting"]),
    topicType("matching", "Match each item to the correct related item.", ["matching"]),
    topicType("sorting", "Sort chips into clear categories.", ["sorting"]),
    topicType("applied-play", "Use a short applied task with a single success condition.", ["applied-play"]),
    topicType("review", "Review known content without introducing a new concept.", ["matching", "sorting"]),
  ],
  reading: [
    topicType("passage", "Use a readable passage and direct comprehension question.", ["comprehension", "evidence-selection"]),
    topicType("evidence", "Use evidence from the passage as answer choices.", ["evidence-selection", "matching"]),
    topicType("comprehension", "Ask a question that matches the passage exactly.", ["comprehension"]),
    topicType("context-clue", "Use clue sentences and word meanings.", ["context-clue", "matching"]),
    topicType("story-map", "Use character, setting, event, or sequence evidence.", ["sequence", "matching"]),
  ],
  vocabulary: [
    topicType("word-meaning", "Teach word meaning with examples and usage.", ["word-meaning", "matching"]),
    topicType("classification", "Group words by category or part of speech.", ["classification", "sorting"]),
    topicType("synonym-antonym", "Pair words with synonyms or antonyms.", ["matching"]),
    topicType("matching", "Match word to meaning, example, or related word.", ["matching"]),
    topicType("sentence-use", "Use the word in a short clear sentence.", ["sentence-use", "matching"]),
  ],
};

const ADMIN_CURRICULUM_METADATA: CurriculumMetadata = {
  generatedFor: "admin-content-curation",
  gradeLevels: [
    grade("Preschool", [
      world("preschool-family-world", "My Family World", "vocabulary", ["Mother", "Father", "Sister", "Brother", "Baby", "Home"]),
      world("preschool-body-world", "My Body World", "vocabulary", ["Head", "Eyes", "Ears", "Nose", "Mouth", "Hands", "Feet"]),
      world("preschool-colorful-world", "My Colorful World", "vocabulary", ["Red", "Blue", "Yellow", "Green", "Orange", "Purple"]),
      world("preschool-shape-kingdom", "Shape Kingdom", "math", ["Circle", "Square", "Triangle", "Rectangle", "Star"]),
      world("preschool-animal-adventure", "Animal Adventure", "vocabulary", ["Dog", "Cat", "Bird", "Fish", "Cow", "Horse"]),
      world("preschool-fruit-garden", "Fruit Garden", "vocabulary", ["Apple", "Banana", "Mango", "Orange", "Grapes", "Watermelon"]),
      world("preschool-food-town", "Food Town", "mixed", ["Rice", "Bread", "Milk", "Juice", "Egg", "Vegetable"]),
      world("preschool-number-village", "Number Village", "math", ["Number 1", "Number 2", "Number 3", "Number 4", "Number 5"]),
    ]),
    grade("Kindergarten", [
      world("kindergarten-alphabet-adventure", "Alphabet Adventure", "vocabulary", ["Letter A", "Letter B", "Letter C", "Letter D"]),
      world("kindergarten-school-world", "School World", "vocabulary", ["Teacher", "Book", "Pencil", "Classroom"]),
      world("kindergarten-community-helpers", "Community Helpers", "mixed", ["Doctor", "Teacher", "Farmer", "Police Officer"]),
      world("kindergarten-counting-forest", "Counting Forest", "math", ["Count 1-5", "Count 6-10", "Count Objects"]),
      world("kindergarten-big-small", "Big and Small Village", "math", ["Big", "Small", "Tall", "Short"]),
      world("kindergarten-more-less", "More and Less Valley", "math", ["More", "Less", "Equal"]),
      world("kindergarten-pattern-playground", "Pattern Playground", "math", ["AB Pattern", "AAB Pattern", "ABC Pattern"]),
    ]),
    grade("Grade 1", [
      world("grade1-word-kingdom", "Word Kingdom", "vocabulary", ["Nouns", "Verbs", "Adjectives", "Opposites"]),
      world("grade1-reading", "Reading Quest", "reading", ["Reading Words", "Reading Sentences", "Story Details"]),
      world("grade1-number-kingdom", "Number Kingdom", "math", ["Numbers 1-20", "Numbers 21-50", "Numbers 51-100"]),
      world("grade1-math-mountain", "Math Mountain", "math", ["Addition", "Subtraction", "Equal Sign"]),
    ]),
    grade("Grade 2", [
      world("grade2-vocabulary-village", "Vocabulary Village", "vocabulary", ["Synonyms", "Antonyms", "Multiple Meaning Words"]),
      world("grade2-place-value-city", "Place Value City", "math", ["Hundreds", "Tens", "Ones"]),
      world("grade2-problem-solver-city", "Problem Solver City", "math", ["Addition Stories", "Subtraction Stories", "Comparison Problems"]),
      world("grade2-measurement-harbor", "Measurement Harbor", "math", ["Length", "Weight", "Time"]),
      world("grade2-multiplication-workshop", "Multiplication Workshop", "math", ["Equal Groups", "Arrays", "Repeated Addition"]),
      world("grade2-story-quest", "Story Quest", "reading", ["Main Idea", "Story Details", "Sequence"]),
    ]),
    grade("Grade 3", [
      world("grade3-reading", "Reading Adventure", "reading", ["Main Idea", "Supporting Details", "Inference"]),
      world("grade3-context-clue-canyon", "Context Clue Canyon", "reading", ["Definition Clues", "Synonym Clues", "Antonym Clues"]),
      world("grade3-number-empire", "Number Empire", "math", ["Place Value", "Rounding", "Comparing Numbers"]),
      world("grade3-multiplication-empire", "Multiplication Empire", "math", ["Facts", "Arrays", "Word Problems"]),
      world("grade3-division-kingdom", "Division Kingdom", "math", ["Sharing", "Groups", "Remainders"]),
      world("grade3-fraction-fortress", "Fraction Fortress", "math", ["Halves", "Thirds", "Quarters"]),
      world("grade3-money-market", "Money Market", "math", ["Coins", "Bills", "Change"]),
      world("grade3-story-adventure", "Story Adventure", "reading", ["Characters", "Setting", "Plot", "Evidence"]),
    ]),
  ],
  requiredStages: ADMIN_REQUIRED_STAGES,
  version: "2026-07-admin-metadata-v1",
};

export function getCurriculumMetadata(): CurriculumMetadata {
  return ADMIN_CURRICULUM_METADATA;
}

export function getGradeMetadata(gradeLevel: GradeLevel): CurriculumGradeMetadata | null {
  return getCurriculumMetadata().gradeLevels.find((gradeItem) => gradeItem.gradeLevel === gradeLevel) ?? null;
}

export function getWorldMetadata(
  gradeLevel: GradeLevel,
  worldId: string
): CurriculumWorldMetadata | null {
  return getGradeMetadata(gradeLevel)?.worlds.find((worldItem) => worldItem.worldId === worldId) ?? null;
}

export async function getCurriculumMetadataForContentDraft(input: {
  gradeLevel: string;
  stageType: ContentDraftStageType;
  topicId: string;
  worldId: string;
}): Promise<CurriculumContentMetadata> {
  const normalizedGrade = normalizeGradeLevel(input.gradeLevel);
  const gradeMetadata = normalizedGrade ? getGradeMetadata(normalizedGrade) : null;
  const worldMetadata = normalizedGrade ? getWorldMetadata(normalizedGrade, input.worldId) : null;
  const topic = resolveTopicMetadata(worldMetadata, input.topicId);
  const stageMetadata = worldMetadata?.stageMetadata.find((stage) => stage.stageLabel === input.stageType);
  const stageIndex = Math.max(
    0,
    (worldMetadata?.requiredStages ?? ADMIN_REQUIRED_STAGES).findIndex((stage) => stage === input.stageType)
  );
  const existingAssetRefs = getExistingAssetRefsForMetadata({
    gradeLevel: input.gradeLevel,
    topicId: input.topicId,
    topicTitle: topic.title,
    worldId: input.worldId,
  });

  return {
    contentRules: {
      ageAppropriate: true,
      mustFitMobileLayout: true,
      mustMatchTopic: true,
      noPlaceholderText: true,
      oneObjectiveOnly: true,
      shortInstructionRequired: true,
      useExistingAssetsOnly: true,
    },
    currentContent: {
      feedbackCorrect: "Great!",
      feedbackIncorrect: "Try Again.",
      instruction: stageMetadata?.instructionGuidance ?? getDefaultInstruction(input.stageType, worldMetadata?.subjectArea ?? "mixed"),
      question: getDefaultQuestionForStage(input.stageType, topic.title),
      title: topic.title,
    },
    existingAssetRefs,
    gradeLevel: input.gradeLevel,
    gradeTitle: gradeMetadata?.gradeLevel ?? input.gradeLevel,
    learnerUiSchema: {
      allowedInteractionTypes:
        input.stageType === "PLAY"
          ? worldMetadata?.allowedPlayActivityTypes ?? SUBJECT_PLAY_TYPES.mixed
          : [stageMetadata?.activityType ?? getDefaultActivityType(input.stageType, worldMetadata?.subjectArea ?? "mixed")],
      contentMaxLength: getContentMaxLength(input.stageType, worldMetadata?.subjectArea ?? "mixed"),
      layout: "standardStage",
      maxInstructionLines: 2,
      requiredSections: ["header", "progress", "instruction", "content", "feedback", "button"],
      requiresChoices: input.stageType === "TRY" || input.stageType === "CHOOSE",
      requiresCorrectAnswer: input.stageType === "TRY" || input.stageType === "CHOOSE" || input.stageType === "PLAY",
      supportsAssets: input.stageType === "LOOK" || input.stageType === "TAP" || input.stageType === "CHOOSE" || input.stageType === "PLAY" || input.stageType === "REWARD",
      supportsAudio: input.gradeLevel === "Preschool" || input.gradeLevel === "Kindergarten",
      supportsSpeech: worldMetadata?.subjectArea === "reading" && (input.stageType === "TAP" || input.stageType === "PLAY"),
    },
    stageIndex: stageIndex + 1,
    stageType: input.stageType,
    topicDifficulty: getTopicDifficulty(input.gradeLevel),
    topicId: input.topicId,
    topicObjective: topic.objective,
    topicOrder: topic.order,
    topicTitle: topic.title,
    totalStages: (worldMetadata?.requiredStages ?? ADMIN_REQUIRED_STAGES).length,
    worldBackgroundRef: existingAssetRefs.backgrounds[0],
    worldDescription: worldMetadata?.contentRules.join(" "),
    worldIconRef: existingAssetRefs.icons[0] ?? existingAssetRefs.images[0],
    worldId: input.worldId,
    worldOrder: gradeMetadata?.worlds.findIndex((world) => world.worldId === input.worldId) ?? -1,
    worldTitle: worldMetadata?.title ?? input.worldId,
  };
}

export async function getStageTemplate(input: {
  gradeLevel: string;
  stageType: ContentDraftStageType;
  topicId: string;
  worldId: string;
}): Promise<StageTemplate> {
  const metadata = await getCurriculumMetadataForContentDraft(input);

  return buildStageTemplateFromMetadata(metadata);
}

export function buildStageTemplateFromMetadata(metadata: CurriculumContentMetadata): StageTemplate {
  const rules = getStageAuthoringRules(metadata);
  const sections = getTemplateSections(metadata.stageType);

  return {
    activityTypes: rules.allowedActivityTypes,
    buttonLabel: metadata.stageType === "PLAY" ? "Done" : metadata.stageType === "REWARD" ? "Reward" : "Next",
    choiceLayout: metadata.stageType === "TRY" || metadata.stageType === "CHOOSE" ? "auto" : "none",
    editableFields: getEditableFieldsForStage(metadata.stageType),
    emptyContent: {
      activityType: rules.allowedActivityTypes[0],
      assetRefs: {
        audio: [],
        backgrounds: [],
        icons: [],
        images: [],
      },
      choices: metadata.learnerUiSchema.requiresChoices ? [] : undefined,
      feedbackCorrect: "Great!",
      feedbackIncorrect: "Try Again.",
      instruction: "",
      stageType: metadata.stageType,
      title: metadata.topicTitle,
    },
    gradeLevel: metadata.gradeLevel,
    id: `${metadata.gradeLevel}:${metadata.worldId}:${metadata.topicId}:${metadata.stageType}`.toLowerCase(),
    layout: "standardStage",
    lockedSections: ["header", "progress", "feedback", "button"],
    previewStates: ["default", "correct", "wrong"],
    requiresAssets: metadata.learnerUiSchema.supportsAssets === true,
    requiresChoices: metadata.learnerUiSchema.requiresChoices === true,
    requiresCorrectAnswer: metadata.learnerUiSchema.requiresCorrectAnswer === true,
    requiresFeedback: true,
    requiresQuestion: metadata.stageType === "TRY" || metadata.stageType === "CHOOSE",
    sections,
    stageIndex: metadata.stageIndex,
    stageType: metadata.stageType,
    topicId: metadata.topicId,
    topicTitle: metadata.topicTitle,
    totalStages: metadata.totalStages,
    validationRules: [
      ...Object.entries(metadata.contentRules)
        .filter(([, enabled]) => enabled)
        .map(([rule]) => rule),
      ...rules.allowedActivityTypes.map((type) => `allowedActivity:${type}`),
    ],
    worldBackgroundRef: metadata.worldBackgroundRef,
    worldId: metadata.worldId,
    worldTitle: metadata.worldTitle,
  };
}

export function buildGeminiContentPrompt(
  metadata: CurriculumContentMetadata,
  request: AdminContentDraftRequest
): string {
  const rules = getStageAuthoringRules(metadata);
  const stageTemplate = buildStageTemplateFromMetadata(metadata);

  return [
    "You are generating an AI-assisted BatiBot content draft. Return JSON only.",
    "The resolved learner-side curriculum metadata below is the source of truth.",
    "BatiBot owns layout, stage shell, buttons, progress, spacing, and asset placement.",
    "Gemini must fill editable educational content only.",
    "Do not invent UI layout, colors, buttons, positions, assets, topics, stages, or unrelated activities.",
    "Keep all editable content mobile-safe, age-appropriate, and aligned to the selected stage.",
    "Draft status must remain review/draft only. An admin must approve and publish later.",
    "",
    "Resolved metadata:",
    JSON.stringify(metadata, null, 2),
    "",
    "Locked BatiBot stage template:",
    JSON.stringify(stageTemplate, null, 2),
    "",
    "Admin request:",
    JSON.stringify(request, null, 2),
    "",
    "Required JSON output shape:",
    JSON.stringify(
      {
        activityType: rules.allowedActivityTypes[0] ?? "concept",
        assetRefs: {
          audio: [],
          backgrounds: [],
          icons: [],
          images: [],
        },
        body: "short learner-facing content body",
        choices: [
          { id: "choice-1", isCorrect: true, label: "specific learner-facing answer" },
          { id: "choice-2", isCorrect: false, label: "specific learner-facing distractor" },
        ],
        correctAnswer: "choice-1",
        example: "short example if useful",
        feedbackCorrect: "Great!",
        feedbackIncorrect: "Try Again.",
        instruction: metadata.currentContent?.instruction ?? "short instruction",
        passage: "short passage only when the stage/topic requires it",
        question: metadata.currentContent?.question ?? "stage-aligned question",
        stageType: metadata.stageType,
        suggestedAssetTags: [],
        title: metadata.topicTitle,
      },
      null,
      2
    ),
    "Authoring rules:",
    JSON.stringify(rules, null, 2),
    "Only populate fields listed in stageTemplate.editableFields. Do not return layout sections.",
    request.adminPrompt ? `Admin prompt: ${request.adminPrompt}` : "Admin prompt: none",
  ].join("\n");
}

export function getStageAuthoringRules(
  metadataOrStage: CurriculumContentMetadata | { stageType: ContentDraftStageType }
): StageAuthoringRules {
  const stageType = metadataOrStage.stageType;
  const schema = "learnerUiSchema" in metadataOrStage ? metadataOrStage.learnerUiSchema : null;
  const allowedActivityTypes = schema?.allowedInteractionTypes ?? (
    stageType === "PLAY" ? ["matching", "sorting", "arrange"] : [getDefaultActivityType(stageType, "mixed")]
  );

  return {
    allowedActivityTypes,
    layoutSections: ["header", "progress", "instruction", "content", "feedback", "button"],
    maxChoiceCount: stageType === "TRY" ? 2 : stageType === "CHOOSE" ? 4 : undefined,
    maxInstructionLines: schema?.maxInstructionLines ?? 2,
    requiresChoices: schema?.requiresChoices ?? (stageType === "TRY" || stageType === "CHOOSE"),
    requiresCorrectAnswer:
      schema?.requiresCorrectAnswer ?? (stageType === "TRY" || stageType === "CHOOSE" || stageType === "PLAY"),
    requiresFeedback: true,
    requiresQuestion: stageType === "TRY" || stageType === "CHOOSE",
    stageType,
  };
}

function getTemplateSections(stageType: ContentDraftStageType): StageTemplateSection[] {
  if (stageType === "LOOK") {
    return ["header", "progress", "instruction", "topicTitle", "assetContainer", "contentCard", "feedback", "button"];
  }

  if (stageType === "TAP") {
    return ["header", "progress", "instruction", "topicTitle", "assetContainer", "contentCard", "feedback", "button"];
  }

  if (stageType === "TRY" || stageType === "CHOOSE") {
    return ["header", "progress", "instruction", "readingCard", "questionCard", "choiceGrid", "feedback", "button"];
  }

  if (stageType === "PLAY") {
    return ["header", "progress", "instruction", "contentCard", "interactiveArea", "feedback", "button"];
  }

  return ["header", "progress", "instruction", "rewardCard", "feedback", "button"];
}

function getEditableFieldsForStage(stageType: ContentDraftStageType): EditableStageField[] {
  if (stageType === "LOOK") {
    return ["instruction", "title", "body", "meaning", "example", "assetRefs", "feedbackCorrect", "feedbackIncorrect"];
  }

  if (stageType === "TAP") {
    return ["instruction", "title", "meaning", "example", "assetRefs", "feedbackCorrect", "feedbackIncorrect"];
  }

  if (stageType === "TRY" || stageType === "CHOOSE") {
    return [
      "instruction",
      "passage",
      "question",
      "choices",
      "correctAnswer",
      "feedbackCorrect",
      "feedbackIncorrect",
      "assetRefs",
    ];
  }

  if (stageType === "PLAY") {
    return [
      "instruction",
      "title",
      "body",
      "question",
      "activityType",
      "choices",
      "correctAnswer",
      "feedbackCorrect",
      "feedbackIncorrect",
      "timer",
      "assetRefs",
    ];
  }

  return ["instruction", "title", "body", "feedbackCorrect", "assetRefs"];
}

export function validateContentDraftAgainstMetadata(
  draft: unknown,
  metadata: CurriculumContentMetadata
): ContentDraftValidationResult {
  const record = asRecord(draft);
  const results: ValidationResult[] = [];
  const instruction = String(record.instruction ?? metadata.currentContent?.instruction ?? "").trim();
  const contentText = [
    record.title,
    record.content,
    record.example,
    record.passage,
    record.question,
  ]
    .map((value) => String(value ?? "").toLowerCase())
    .join(" ");
  const choices = Array.isArray(record.choices) ? record.choices.map(asRecord) : [];
  const assetKeys = collectAssetKeys(record);
  const feedbackCorrect = String(record.feedbackCorrect ?? "").trim();
  const feedbackIncorrect = String(record.feedbackIncorrect ?? "").trim();
  const hasGenericChoices = hasGenericChoiceLabels(choices);

  pushCheck(results, "metadata-grade", String(record.gradeLevel ?? metadata.gradeLevel) === metadata.gradeLevel, "Draft grade matches resolved metadata.", "gradeLevel");
  pushCheck(results, "metadata-world", String(record.worldId ?? metadata.worldId) === metadata.worldId, "Draft world matches resolved metadata.", "worldId");
  pushCheck(results, "metadata-topic", String(record.topicId ?? metadata.topicId) === metadata.topicId, "Draft topic matches resolved metadata.", "topicId");
  pushCheck(results, "metadata-stage", String(record.stageType ?? metadata.stageType) === metadata.stageType, "Draft stage matches resolved metadata.", "stageType");
  pushCheck(results, "instruction-present", instruction.length > 0, "Instruction exists.", "instruction");
  pushCheck(results, "instruction-short", instruction.length > 0 && instruction.length <= 90, "Instruction is short enough for the standard shell.", "instruction");
  pushCheck(results, "topic-match", contentText.includes(metadata.topicTitle.toLowerCase().split(" ")[0]) || Boolean(record.content ?? record.example ?? record.question), "Content is present and aligned to the selected topic.", "content");
  pushCheck(results, "no-placeholder-text", !hasPlaceholderText(record), "Draft does not contain placeholder text.", "content");
  pushCheck(results, "feedback-correct", feedbackCorrect.length > 0, "Correct feedback exists.", "feedbackCorrect");
  pushCheck(results, "feedback-incorrect", feedbackIncorrect.length > 0, "Wrong feedback exists.", "feedbackIncorrect");

  if (metadata.learnerUiSchema.requiresChoices) {
    pushCheck(results, "choices-present", choices.length >= 2, "Choices exist for this stage.", "choices");
    pushCheck(results, "choices-unique", new Set(choices.map((choice) => String(choice.label ?? "").trim().toLowerCase())).size === choices.length, "Choices are not duplicated.", "choices");
    pushCheck(results, "choices-not-generic", !hasGenericChoices, "Choices use real learner-facing labels, not placeholders.", "choices");
    pushCheck(
      results,
      "choices-mobile-safe",
      choices.every((choice) => String(choice.label ?? "").trim().length <= 90),
      "Choice labels are mobile-safe.",
      "choices"
    );
  }

  if (metadata.learnerUiSchema.requiresCorrectAnswer) {
    const correctChoices = choices.filter((choice) => choice.isCorrect === true || choice.correct === true);
    const hasDirectCorrectAnswer = Boolean(record.correctAnswer ?? record.correctAnswerId ?? record.answer);
    pushCheck(results, "correct-answer", hasDirectCorrectAnswer || correctChoices.length === 1, "Exactly one correct answer exists for single-answer stages.", "correctAnswer");
  }

  assetKeys.forEach((assetKey) => {
    const asset = batibotAssetRegistry[assetKey];
    const isRemoteOrLocalUri = /^(https?:|file:|blob:|data:image\/)/.test(assetKey);
    const allowed =
      isRemoteOrLocalUri ||
      Boolean(asset) &&
      (asset.grade === "shared" ||
        !asset.grade ||
        asset.grade === normalizeAssetGrade(metadata.gradeLevel) ||
        asset.world === metadata.worldId ||
        asset.topic === metadata.topicTitle);

    pushCheck(results, `asset-${assetKey}`, allowed, `Asset exists and is compatible: ${assetKey}.`, "assetRefs");
  });

  if (metadata.stageType === "PLAY") {
    const activityType = String(record.activityType ?? record.playType ?? "").trim();
    pushCheck(
      results,
      "play-interactive",
      !activityType || metadata.learnerUiSchema.allowedInteractionTypes?.includes(activityType) === true,
      "PLAY activity is supported by the learner UI schema.",
      "activityType"
    );
  }

  if (typeof record.passage === "string" && record.passage.trim()) {
    pushCheck(
      results,
      "passage-mobile-safe",
      record.passage.length <= (metadata.learnerUiSchema.contentMaxLength ?? 360),
      "Passage is short enough for the standard mobile preview.",
      "passage"
    );
  }

  return {
    passed: !hasBlockingValidationResults(results),
    results,
  };
}

export function getTopicBuildSpec(input: TopicBuildRequest): TopicBuildSpec {
  const gradeLevel = normalizeGradeLevel(input.gradeLevel);
  const gradeMetadata = gradeLevel ? getGradeMetadata(gradeLevel) : null;
  const worldMetadata = gradeLevel ? getWorldMetadata(gradeLevel, input.worldId) : null;
  const requestedExamples = Math.max(1, Math.floor(Number(input.exampleCount) || 1));
  const maxExamples = worldMetadata?.maxExamples ?? requestedExamples;

  return {
    adminPrompt: input.adminPrompt?.trim() ?? "",
    allowedActivityTypes: worldMetadata?.allowedPlayActivityTypes ?? [],
    contentRules: [
      ...(gradeMetadata?.gradeRules ?? []),
      ...(worldMetadata?.contentRules ?? []),
      ...(worldMetadata?.geminiPromptGuidance ?? []),
    ],
    exampleCount: Math.min(requestedExamples, maxExamples),
    grade: gradeMetadata,
    gradeLevel: input.gradeLevel,
    requiredStages: worldMetadata?.stageMetadata ?? getStageMetadata("mixed"),
    topicTitle: input.topicTitle.trim(),
    topicType: input.topicType,
    validationRules: worldMetadata?.validationRules ?? getBaseValidationRules("mixed"),
    world: worldMetadata,
    worldId: input.worldId,
  };
}

export function buildGeminiDraftPrompt(spec: TopicBuildSpec): string {
  return [
    "You are generating a BatiBot admin content draft. Output JSON only.",
    "The output is a draft for admin review. Never mark it published or approved.",
    `Grade level: ${spec.gradeLevel}`,
    `World: ${spec.world?.title ?? spec.worldId}`,
    `Subject area: ${spec.world?.subjectArea ?? "mixed"}`,
    `Topic title: ${spec.topicTitle}`,
    `Topic type: ${spec.topicType}`,
    `Number of examples: ${spec.exampleCount}`,
    `Required stages: ${spec.requiredStages.map((stage) => stage.stageLabel).join(", ")}`,
    `Allowed PLAY activity types: ${spec.allowedActivityTypes.join(", ") || "matching, sorting"}`,
    "Content rules:",
    ...spec.contentRules.map((rule) => `- ${rule}`),
    "Required JSON shape:",
    JSON.stringify(
      {
        examples: [
          {
            explanation: "short grade-appropriate explanation",
            label: "learner-facing label",
          },
        ],
        reward: {
          badge: `${spec.topicTitle} badge`,
          stars: 1,
          xp: 20,
        },
        stages: spec.requiredStages.map((stage) => ({
          activityType: stage.activityType,
          id: stage.stageLabel.toLowerCase(),
          instruction: stage.instructionGuidance,
          stageLabel: stage.stageLabel,
        })),
        topicTitle: spec.topicTitle,
        topicType: spec.topicType,
      },
      null,
      2
    ),
    spec.adminPrompt ? `Admin prompt: ${spec.adminPrompt}` : "Admin prompt: none",
  ].join("\n");
}

export function validateAdminDraft(draft: unknown, spec: TopicBuildSpec): ValidationResult[] {
  const results: ValidationResult[] = [];
  const content = asRecord(draft);
  const stages = Array.isArray(content.stages) ? content.stages.map(asRecord) : [];
  const examples = Array.isArray(content.examples) ? content.examples : [];
  const topicTitle = String(content.topicTitle ?? spec.topicTitle).trim();
  const topicType = String(content.topicType ?? spec.topicType).trim();
  const requiredStageLabels = spec.requiredStages.map((stage) => stage.stageLabel);

  pushCheck(results, "grade", Boolean(spec.grade), "Grade level exists in curriculum metadata.", "gradeLevel");
  pushCheck(results, "world", Boolean(spec.world), "World exists in curriculum metadata.", "worldId");
  pushCheck(results, "topic-title", topicTitle.length > 0, "Topic title is present.", "topicTitle");
  pushCheck(
    results,
    "topic-type",
    !spec.world || spec.world.allowedTopicTypes.includes(topicType),
    "Topic type is allowed for this world.",
    "topicType"
  );
  pushCheck(results, "content", Object.keys(content).length > 0, "Draft content is not empty.");

  requiredStageLabels.forEach((stageLabel) => {
    const stage = stages.find((item) => item.stageLabel === stageLabel);
    pushCheck(results, `stage-${stageLabel}`, Boolean(stage), `${stageLabel} stage metadata exists.`, "stages");
    pushCheck(
      results,
      `stage-${stageLabel}-instruction`,
      !stage || isBriefInstruction(stage.instruction),
      `${stageLabel} instruction is brief and clear.`,
      "stages"
    );
    pushCheck(
      results,
      `stage-${stageLabel}-activity`,
      !stage || Boolean(stage.activityType),
      `${stageLabel} activity type is present.`,
      "stages"
    );
  });

  pushCheck(
    results,
    "examples-max",
    examples.length <= spec.exampleCount,
    `Examples do not exceed ${spec.exampleCount}.`,
    "examples"
  );

  const tapStage = stages.find((stage) => stage.stageLabel === "TAP");
  pushCheck(
    results,
    "tap-meaning",
    Boolean(tapStage && (tapStage.meaning ?? tapStage.explanation ?? tapStage.examples ?? tapStage.cards)),
    "TAP has meaning, explanation, examples, or cards.",
    "stages"
  );

  const playStage = stages.find((stage) => stage.stageLabel === "PLAY");
  pushCheck(
    results,
    "play-activity",
    Boolean(playStage && spec.allowedActivityTypes.includes(String(playStage.activityType ?? ""))),
    "PLAY activity type is supported for this world.",
    "stages"
  );

  ["TRY", "CHOOSE"].forEach((stageLabel) => {
    const stage = stages.find((item) => item.stageLabel === stageLabel);
    pushCheck(
      results,
      `${stageLabel.toLowerCase()}-correct-answer`,
      !stage || hasCorrectAnswer(stage),
      `${stageLabel} has a visible correct answer mapping.`,
      "stages"
    );
  });

  pushCheck(
    results,
    "reward-progress-mastery",
    ["REWARD", "PROGRESS", "MASTERY"].every((stageLabel) =>
      stages.some((stage) => stage.stageLabel === stageLabel)
    ),
    "Reward, Progress, and Mastery metadata exists.",
    "stages"
  );

  const assetKeys = collectAssetKeys(content);
  assetKeys.forEach((assetKey) => {
    pushCheck(
      results,
      `asset-${assetKey}`,
      Boolean(batibotAssetRegistry[assetKey]),
      `Selected asset exists: ${assetKey}.`,
      "assets"
    );
  });
  pushVisualBalanceChecks(results, spec, stages, assetKeys);
  collectPrematureRevealFlags(content).forEach((flag) => {
    pushWarning(
      results,
      `premature-reveal-${flag}`,
      false,
      `Draft contains a possible premature answer reveal flag: ${flag}.`,
      "stages"
    );
  });

  const stageIds = stages.map((stage) => String(stage.id ?? "")).filter(Boolean);
  pushWarning(
    results,
    "stage-ids",
    new Set(stageIds).size === stageIds.length,
    "Stage IDs should be unique.",
    "stages"
  );

  return results;
}

export function getAdminCurriculumMetadata(): CurriculumGradeMetadata[] {
  return getCurriculumMetadata().gradeLevels;
}

export function getAdminGradeMetadata(gradeLevel: string) {
  const normalized = normalizeGradeLevel(gradeLevel);
  return normalized ? getGradeMetadata(normalized) : null;
}

export function getAdminWorldMetadata(gradeLevel: string, worldId: string) {
  const normalized = normalizeGradeLevel(gradeLevel);
  return normalized ? getWorldMetadata(normalized, worldId) : null;
}

function grade(gradeLevel: GradeLevel, worlds: CurriculumWorldMetadata[]): CurriculumGradeMetadata {
  return {
    gradeLevel,
    gradeRules: GRADE_RULES[gradeLevel],
    worlds,
  };
}

function world(
  worldId: string,
  title: string,
  subjectArea: CurriculumSubjectArea,
  topicTitles: string[]
): CurriculumWorldMetadata {
  const topicMetadata = TOPIC_TYPE_METADATA[subjectArea];

  return {
    allowedPlayActivityTypes: SUBJECT_PLAY_TYPES[subjectArea],
    allowedTopicTypes: topicMetadata.map((item) => item.topicType),
    contentRules: SUBJECT_RULES[subjectArea],
    geminiPromptGuidance: getGeminiGuidance(subjectArea),
    maxExamples: subjectArea === "reading" ? 5 : 4,
    requiredStages: ADMIN_REQUIRED_STAGES,
    stageMetadata: getStageMetadata(subjectArea),
    subjectArea,
    title,
    topicMetadata,
    topicTitles,
    validationRules: getBaseValidationRules(subjectArea),
    worldId,
  };
}

function topicType(
  topicTypeValue: string,
  description: string,
  allowedActivityTypes: string[]
): CurriculumTopicMetadata {
  return {
    allowedActivityTypes,
    defaultInstruction: getTopicDefaultInstruction(topicTypeValue),
    description,
    topicType: topicTypeValue,
  };
}

function getStageMetadata(subjectArea: CurriculumSubjectArea): StageMetadata[] {
  return ADMIN_REQUIRED_STAGES.map((stageLabel) => ({
    activityType: getDefaultActivityType(stageLabel, subjectArea),
    contentRequirements: getStageContentRequirements(stageLabel, subjectArea),
    instructionGuidance: getDefaultInstruction(stageLabel, subjectArea),
    stageLabel,
    validationRules: getStageValidationRules(stageLabel),
  }));
}

function getAllowedPlayHint(subjectArea: CurriculumSubjectArea) {
  return SUBJECT_PLAY_TYPES[subjectArea].slice(0, 4).join(", ");
}

function getBaseValidationRules(subjectArea: CurriculumSubjectArea) {
  return [
    "Grade level exists.",
    "World exists.",
    "Topic title exists.",
    "Required stages exist.",
    "Instructions are brief and clear.",
    "Examples do not exceed the world limit.",
    "TAP has meaning or explanation.",
    `PLAY uses a supported activity type: ${getAllowedPlayHint(subjectArea)}.`,
    "Reward, Progress, and Mastery metadata exists.",
    "Content is not empty.",
  ];
}

function getDefaultActivityType(stageLabel: LessonStageType, subjectArea: CurriculumSubjectArea) {
  if (stageLabel === "PLAY") {
    return subjectArea === "reading" ? "evidence-selection" : "matching";
  }

  const activityTypes: Record<LessonStageType, string> = {
    CHOOSE: "choice",
    LOOK: subjectArea === "reading" ? "passage-card" : "concept-card",
    MASTERY: "mastery-summary",
    PLAY: "matching",
    PROGRESS: "progress-summary",
    REWARD: "reward-summary",
    TAP: "tap-carousel",
    TRY: "guided-choice",
  };

  return activityTypes[stageLabel];
}

function getDefaultInstruction(stageLabel: LessonStageType, subjectArea: CurriculumSubjectArea) {
  const lookInstruction = subjectArea === "reading" ? "Read the passage." : "Look at the topic.";

  const copy: Record<LessonStageType, string> = {
    CHOOSE: "Choose the best answer.",
    LOOK: lookInstruction,
    MASTERY: "Lesson Complete!",
    PLAY: "Complete the activity, then tap Done.",
    PROGRESS: "Check progress.",
    REWARD: "Lesson Complete!",
    TAP: "Tap each card to learn.",
    TRY: "Try one with help.",
  };

  return copy[stageLabel];
}

function getGeminiGuidance(subjectArea: CurriculumSubjectArea) {
  const shared = [
    "Use only learner-facing text.",
    "Do not include developer placeholders.",
    "Do not publish directly.",
    "Return structured JSON only.",
  ];

  const bySubject: Record<CurriculumSubjectArea, string[]> = {
    math: ["Use equations, models, or measurable manipulatives instead of decorative images."],
    mixed: ["Keep the activity practical and grade-appropriate."],
    reading: ["Passage text must support every question and evidence choice."],
    vocabulary: ["Every word must have a clear meaning, example, or category."],
  };

  return [...shared, ...bySubject[subjectArea]];
}

function getStageContentRequirements(stageLabel: LessonStageType, subjectArea: CurriculumSubjectArea) {
  const contentByStage: Record<LessonStageType, string[]> = {
    CHOOSE: ["choices", "correctAnswer"],
    LOOK: [subjectArea === "reading" ? "passage" : "concept", "shortInstruction"],
    MASTERY: ["masteryMessage", "nextStep"],
    PLAY: ["activityType", "items", "correctAnswerMap"],
    PROGRESS: ["progressMessage"],
    REWARD: ["xp", "stars", "badge"],
    TAP: ["cards", "meaningOrExplanation"],
    TRY: ["prompt", "choices", "correctAnswer"],
  };

  return contentByStage[stageLabel];
}

function getStageValidationRules(stageLabel: LessonStageType) {
  const common = ["stageLabel, id, instruction, and activityType are present."];

  if (stageLabel === "PLAY") {
    return [...common, "wrong attempts must validate only after Done."];
  }

  if (stageLabel === "TAP") {
    return [...common, "each card has a meaning, explanation, or example."];
  }

  return common;
}

function getTopicDefaultInstruction(topicTypeValue: string) {
  if (topicTypeValue.includes("evidence")) return "Choose the correct evidence.";
  if (topicTypeValue.includes("matching")) return "Match the pairs.";
  if (topicTypeValue.includes("sorting") || topicTypeValue.includes("classification")) return "Sort the items.";
  if (topicTypeValue.includes("passage") || topicTypeValue.includes("comprehension")) return "Read the passage.";
  if (topicTypeValue.includes("equation")) return "Solve the equation.";
  return "Complete the activity.";
}

function isBriefInstruction(value: unknown) {
  const instruction = String(value ?? "").trim();
  return instruction.length > 0 && instruction.length <= 90;
}

function normalizeGradeLevel(value: string): GradeLevel | null {
  return getCurriculumMetadata().gradeLevels.some((gradeItem) => gradeItem.gradeLevel === value)
    ? (value as GradeLevel)
    : null;
}

function normalizeAssetGrade(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, "");

  if (normalized === "grade1") return "grade1";
  if (normalized === "grade2") return "grade2";
  if (normalized === "grade3") return "grade3";
  if (normalized === "kindergarten") return "kindergarten";
  if (normalized === "preschool") return "preschool";

  return "shared";
}

function resolveTopicMetadata(worldMetadata: CurriculumWorldMetadata | null, topicId: string) {
  const normalizedTopicId = toTopicId(topicId);
  const topicIndex =
    worldMetadata?.topicTitles.findIndex((title) => toTopicId(title) === normalizedTopicId) ?? -1;
  const title =
    topicIndex >= 0
      ? worldMetadata?.topicTitles[topicIndex] ?? topicId
      : topicId
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
          .trim();

  return {
    objective: `Create ${worldMetadata?.subjectArea ?? "mixed"} content that teaches ${title}.`,
    order: topicIndex >= 0 ? topicIndex + 1 : undefined,
    title,
  };
}

function toTopicId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getExistingAssetRefsForMetadata(input: {
  gradeLevel: string;
  topicId: string;
  topicTitle: string;
  worldId: string;
}) {
  const grade = normalizeAssetGrade(input.gradeLevel);
  const topicTokens = new Set([
    ...input.topicId.toLowerCase().split(/[-_\s]+/),
    ...input.topicTitle.toLowerCase().split(/\s+/),
  ].filter(Boolean));
  const images = Object.values(batibotAssetRegistry)
    .filter((asset) => {
      const tags = new Set([asset.world, asset.topic, ...(asset.tags ?? [])].filter(Boolean).map((item) => String(item).toLowerCase()));
      const exactContext = asset.world === input.worldId || asset.grade === grade || asset.grade === "shared";
      const topicMatch = [...topicTokens].some((token) => tags.has(token));

      return Boolean(asset.source) && (exactContext || topicMatch);
    })
    .map((asset) => asset.key)
    .slice(0, 12);

  const backgrounds = images.filter((key) => key.includes("background") || key.startsWith("world."));
  const icons = images.filter((key) => key.includes("icon") || key.includes("reward") || key.includes("badge"));

  return {
    audio: [],
    backgrounds,
    icons,
    images,
  };
}

function getTopicDifficulty(gradeLevel: string): "easy" | "medium" | "hard" {
  if (gradeLevel === "Preschool" || gradeLevel === "Kindergarten") return "easy";
  if (gradeLevel === "Grade 1" || gradeLevel === "Grade 2") return "medium";
  return "hard";
}

function getContentMaxLength(stageType: ContentDraftStageType, subjectArea: CurriculumSubjectArea) {
  if (stageType === "LOOK" && subjectArea === "reading") return 360;
  if (stageType === "TAP") return 220;
  if (stageType === "TRY" || stageType === "CHOOSE") return 180;
  if (stageType === "PLAY") return 260;
  return 120;
}

function getDefaultQuestionForStage(stageType: ContentDraftStageType, topicTitle: string) {
  if (stageType === "TRY") return `What did you learn about ${topicTitle}?`;
  if (stageType === "CHOOSE") return `Choose the answer about ${topicTitle}.`;
  if (stageType === "PLAY") return `Complete the ${topicTitle} activity.`;
  return undefined;
}

function hasPlaceholderText(value: unknown) {
  const text = JSON.stringify(value ?? "").toLowerCase();
  return ["placeholder", "missing asset", "undefined", "null", "lorem", "todo", "choice a", "choice b"].some((term) =>
    text.includes(term)
  );
}

function hasGenericChoiceLabels(choices: DraftRecord[]) {
  const labels = choices.map((choice) => String(choice.label ?? choice.text ?? "").trim().toLowerCase());

  return labels.some((label) =>
    /^choice\s+[a-d]$/.test(label) ||
    /^answer\s+[a-d]$/.test(label) ||
    /^option\s+[a-d]$/.test(label)
  );
}

function hasBlockingValidationResults(results: ValidationResult[]) {
  return results.some((result) => result.severity === "error");
}

function asRecord(value: unknown): DraftRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DraftRecord)
    : {};
}

function collectAssetKeys(value: unknown): string[] {
  const keys: string[] = [];

  function visit(item: unknown) {
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }

    if (!item || typeof item !== "object") {
      return;
    }

    const record = item as Record<string, unknown>;
    ["assetKey", "imageAssetKey", "badgeAssetKey"].forEach((field) => {
      if (typeof record[field] === "string" && record[field]) {
        keys.push(String(record[field]));
      }
    });
    const assetRefs = asRecord(record.assetRefs);
    ["images", "audio", "backgrounds", "icons"].forEach((field) => {
      const refs = assetRefs[field];
      if (Array.isArray(refs)) {
        refs.forEach((ref) => {
          if (typeof ref === "string" && ref) {
            keys.push(ref);
          }
        });
      }
    });
    Object.values(record).forEach(visit);
  }

  visit(value);
  return Array.from(new Set(keys));
}

function collectPrematureRevealFlags(value: unknown): string[] {
  const flags: string[] = [];
  const suspiciousKeys = new Set([
    "completed",
    "completedPairs",
    "correctIds",
    "isCorrect",
    "preselected",
    "revealed",
    "showAnswer",
    "showCorrect",
  ]);

  function visit(item: unknown, path: string) {
    if (Array.isArray(item)) {
      item.forEach((child, index) => visit(child, `${path}.${index}`));
      return;
    }

    if (!item || typeof item !== "object") {
      return;
    }

    Object.entries(item as Record<string, unknown>).forEach(([key, child]) => {
      if (suspiciousKeys.has(key) && Boolean(child)) {
        flags.push(`${path}.${key}`);
      }
      visit(child, `${path}.${key}`);
    });
  }

  visit(value, "draft");
  return flags.slice(0, 8);
}

function hasCorrectAnswer(stage: DraftRecord) {
  if (stage.correctAnswer || stage.correctAnswerId || stage.answer) {
    return true;
  }

  const choices = Array.isArray(stage.choices) ? stage.choices.map(asRecord) : [];
  return choices.some((choice) => choice.correct === true || choice.isCorrect === true);
}

function pushVisualBalanceChecks(
  results: ValidationResult[],
  spec: TopicBuildSpec,
  stages: DraftRecord[],
  assetKeys: string[]
) {
  const visualStageCount = stages.filter((stage) => Boolean(stage.assetKey ?? stage.imageAssetKey)).length;

  if (spec.gradeLevel === "Preschool" || spec.gradeLevel === "Kindergarten") {
    pushWarning(
      results,
      "early-visual-support",
      assetKeys.length > 0 || visualStageCount > 0,
      "Preschool and Kindergarten drafts should include visual support.",
      "assets"
    );
  }

  if (spec.gradeLevel === "Grade 2" || spec.gradeLevel === "Grade 3") {
    const playStage = stages.find((stage) => stage.stageLabel === "PLAY");
    const playHasAsset = Boolean(playStage?.assetKey ?? playStage?.imageAssetKey);

    pushWarning(
      results,
      "upper-grade-image-balance",
      (!playHasAsset || spec.world?.subjectArea !== "reading") && assetKeys.length <= 3,
      "Grade 2/3 drafts should stay text-first; images should be supportive only.",
      "assets"
    );
  }
}

function pushCheck(
  results: ValidationResult[],
  id: string,
  passed: boolean,
  message: string,
  field?: string
) {
  results.push({
    field,
    id,
    message,
    severity: passed ? "pass" : "error",
  });
}

function pushWarning(
  results: ValidationResult[],
  id: string,
  passed: boolean,
  message: string,
  field?: string
) {
  results.push({
    field,
    id,
    message,
    severity: passed ? "pass" : "warning",
  });
}
