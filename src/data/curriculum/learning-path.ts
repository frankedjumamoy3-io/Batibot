import type {
  LearnerGradeLevel,
} from "@/src/types/user";
import type {
  VocabularyCategory,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";
import {
  LESSON_STAGE_RULES as DOMAIN_LESSON_STAGE_RULES,
  type LessonStageAction,
} from "@/src/domain/rules/lesson-stage-rules";
import {
  isAllowedChoiceCount,
  repairChoicesForTarget,
  validateActivityCorrectAnswer,
} from "@/src/domain/rules/activity-integrity-rules";
import {
  getPreschoolPlayRendererName,
  getPreschoolPlayType,
} from "@/src/domain/rules/preschool-play-rules";
import {
  getScopedFamilyPlayMissionConfig,
} from "@/src/domain/rules/preschool/family";
import {
  getScopedFamilyMeaning,
  isScopedFamilyWorldTopic,
} from "@/src/curriculum/preschool/family";
import {
  getAnimalCorrectWord,
  getAnimalMeaning,
  getAnimalPlayAction,
  isScopedAnimalWorldTopic,
  PRESCHOOL_ANIMAL_WORLD_CONFIG,
} from "@/src/curriculum/preschool/animal";
import {
  getColorCorrectWord,
  getColorMeaning,
  getColorPlayAction,
  isScopedColorWorldTopic,
  PRESCHOOL_COLOR_WORLD_CONFIG,
} from "@/src/curriculum/preschool/color";
import {
  getShapeCorrectWord,
  getShapeMeaning,
  getShapePlayAction,
  isScopedShapeWorldTopic,
  PRESCHOOL_SHAPE_WORLD_CONFIG,
} from "@/src/curriculum/preschool/shape";
import {
  getFoodCorrectWord,
  getFoodMeaning,
  getFoodPlayAction,
  getFoodTryTarget,
  isScopedFoodWorldTopic,
  PRESCHOOL_FOOD_WORLD_CONFIG,
} from "@/src/curriculum/preschool/food";
import {
  getFruitCorrectWord,
  getFruitMeaning,
  getFruitPlayAction,
  getFruitTryTarget,
  isScopedFruitWorldTopic,
  PRESCHOOL_FRUIT_WORLD_CONFIG,
} from "@/src/curriculum/preschool/fruit";
import {
  getBodyCorrectWord,
  getBodyMeaning,
  getBodyPlayAction,
  isScopedBodyWorldTopic,
  PRESCHOOL_BODY_WORLD_CONFIG,
} from "@/src/curriculum/preschool/body";
import {
  isScopedCountingWorldTopic,
} from "@/src/curriculum/preschool/counting";
import {
  getNumberWord,
  isNumberChallengeTopic,
  isScopedNumberWorldTopic,
  PRESCHOOL_NUMBER_WORLD_CONFIG,
} from "@/src/curriculum/preschool/number";
import {
  getPatternPlayInstruction,
  getPatternStageCopy,
  getPatternStageMetadata as getScopedPatternStageMetadata,
  isScopedPatternWorldTopic,
} from "@/src/curriculum/preschool/pattern";
import {
  getQuantityPlayInstruction,
  getQuantityStageCopy,
  getQuantityStageMetadata as getScopedQuantityStageMetadata,
  isScopedQuantityWorldTopic,
} from "@/src/curriculum/preschool/quantity";
import {
  getSizePlayInstruction,
  getSizeStageCopy,
  getSizeStageMetadata as getScopedSizeStageMetadata,
  isScopedSizeWorldTopic,
} from "@/src/curriculum/preschool/size";
import {
  buildBodyChooseActivity,
  buildBodyPlayMission,
  getBodyTryDistractor,
} from "@/src/domain/rules/preschool/body";
import {
  buildColorChooseActivity,
  buildColorPlayMission,
  getColorTryDistractor,
} from "@/src/domain/rules/preschool/color";
import {
  buildShapeChooseActivity,
  buildShapePlayMission,
  getShapeTryDistractor,
} from "@/src/domain/rules/preschool/shape";
import {
  buildAnimalChooseActivity,
  buildAnimalPlayMission,
  getAnimalTryDistractor,
} from "@/src/domain/rules/preschool/animal";
import {
  buildFruitChooseActivity,
  buildFruitPlayMission,
  getFruitTryDistractor,
} from "@/src/domain/rules/preschool/fruit";
import {
  buildFoodChooseActivity,
  buildFoodPlayMission,
  getFoodTryDistractor,
} from "@/src/domain/rules/preschool/food";
import {
  buildNumberChooseActivity,
  buildNumberPlayMission,
  getNumberTryChoices,
} from "@/src/domain/rules/preschool/number";
import {
  buildCountingForestLesson,
} from "@/src/domain/rules/preschool/counting";
import {
  getKindergartenAlphabetTopicSupport,
  KINDERGARTEN_ALPHABET_WORLD_CONFIG,
  KINDERGARTEN_ALPHABET_WORLD_ID,
} from "@/src/curriculum/kindergarten/alphabet";
import {
  getKindergartenSchoolTopicSupport,
  KINDERGARTEN_SCHOOL_WORLD_CONFIG,
  KINDERGARTEN_SCHOOL_WORLD_ID,
} from "@/src/curriculum/kindergarten/school";
import {
  getKindergartenCommunityTopicSupport,
  KINDERGARTEN_COMMUNITY_WORLD_CONFIG,
  KINDERGARTEN_COMMUNITY_WORLD_ID,
} from "@/src/curriculum/kindergarten/community";
import {
  getKindergartenNatureTopicSupport,
  KINDERGARTEN_NATURE_WORLD_CONFIG,
  KINDERGARTEN_NATURE_WORLD_ID,
} from "@/src/curriculum/kindergarten/nature";
import {
  getKindergartenShapeTopicSupport,
  KINDERGARTEN_SHAPE_WORLD_CONFIG,
  KINDERGARTEN_SHAPE_WORLD_ID,
} from "@/src/curriculum/kindergarten/shape";
import {
  getKindergartenReadingTopicSupport,
  KINDERGARTEN_READING_TOPIC_ORDER,
  KINDERGARTEN_READING_WORLD_CONFIG,
  KINDERGARTEN_READING_WORLD_ID,
} from "@/src/curriculum/kindergarten/reading";
import {
  getKindergartenNumberStageMetadata,
  getKindergartenNumberPlayInstruction,
  getKindergartenNumberTopicSupport,
  KINDERGARTEN_NUMBER_TOPIC_ORDER,
  KINDERGARTEN_NUMBER_WORLD_CONFIG,
  KINDERGARTEN_NUMBER_WORLD_ID,
} from "@/src/curriculum/kindergarten/number";
import {
  KINDERGARTEN_SIZE_WORLD_CONFIG,
  KINDERGARTEN_SIZE_WORLD_ID,
} from "@/src/curriculum/kindergarten/size";
import {
  KINDERGARTEN_QUANTITY_WORLD_CONFIG,
  KINDERGARTEN_QUANTITY_WORLD_ID,
} from "@/src/curriculum/kindergarten/quantity";
import {
  getKindergartenMathTopicSupport,
  KINDERGARTEN_MATH_WORLD_CONFIG,
  KINDERGARTEN_MATH_WORLD_ID,
} from "@/src/curriculum/kindergarten/math";
import {
  getKindergartenPatternStageMetadata,
  getKindergartenPatternTopicSupport,
  KINDERGARTEN_PATTERN_WORLD_CONFIG,
  KINDERGARTEN_PATTERN_WORLD_ID,
} from "@/src/curriculum/kindergarten/pattern";
import {
  getKindergartenSchoolFriendlyDistractors,
  getKindergartenSchoolPlayAction,
} from "@/src/domain/rules/kindergarten/school";
import {
  getKindergartenCommunityFriendlyDistractors,
  getKindergartenCommunityPlayAction,
} from "@/src/domain/rules/kindergarten/community";
import {
  getKindergartenNatureFriendlyDistractors,
  getKindergartenNaturePlayAction,
} from "@/src/domain/rules/kindergarten/nature";
import {
  getKindergartenShapeFriendlyDistractors,
  getKindergartenShapePlayAction,
} from "@/src/domain/rules/kindergarten/shape";
import {
  getKindergartenReadingFriendlyDistractors,
  getKindergartenReadingPlayAction,
} from "@/src/domain/rules/kindergarten/reading";
import {
  getKindergartenNumberFriendlyDistractors,
  getKindergartenNumberForestPlayAction,
} from "@/src/domain/rules/kindergarten/number";
import {
  getKindergartenMathFriendlyDistractors,
  getKindergartenMathPlayAction,
} from "@/src/domain/rules/kindergarten/math";
import {
  getKindergartenPatternFriendlyDistractors,
  getKindergartenPatternPlayAction,
} from "@/src/domain/rules/kindergarten/pattern";
import {
  getKindergartenAlphabetFriendlyDistractors,
  getKindergartenAlphabetPlayAction,
} from "@/src/domain/rules/kindergarten/alphabet";
import {
  GRADE1_FAMILY_STORY_WORLD_ID,
} from "@/src/curriculum/grade1/family-story";
import {
  GRADE1_READING_TOPIC_ORDER,
  GRADE1_READING_WORLD_CONFIG,
  GRADE1_READING_WORLD_ID,
} from "@/src/curriculum/grade1/reading";
import {
  GRADE1_NUMBER_WORLD_CONFIG,
  GRADE1_NUMBER_WORLD_ID,
} from "@/src/curriculum/grade1/number";
import {
  GRADE1_MATH_WORLD_CONFIG,
  GRADE1_MATH_WORLD_ID,
} from "@/src/curriculum/grade1/math";
import {
  GRADE1_SHAPE_WORLD_CONFIG,
  GRADE1_SHAPE_WORLD_ID,
} from "@/src/curriculum/grade1/shape";
import {
  GRADE1_NATURE_WORLD_CONFIG,
  GRADE1_NATURE_WORLD_ID,
} from "@/src/curriculum/grade1/nature";
import {
  GRADE1_TIME_WORLD_CONFIG,
  GRADE1_TIME_WORLD_ID,
} from "@/src/curriculum/grade1/time";
import {
  GRADE1_WORD_WORLD_CONFIG,
  GRADE1_WORD_WORLD_ID,
} from "@/src/curriculum/grade1/word";
import {
  GRADE2_MEASUREMENT_WORLD_CONFIG,
  GRADE2_MULTIPLICATION_WORLD_CONFIG,
  GRADE2_PLACE_VALUE_WORLD_CONFIG,
  GRADE2_PROBLEM_SOLVING_WORLD_CONFIG,
  GRADE2_STORY_WORLD_CONFIG,
  GRADE2_VOCABULARY_WORLD_CONFIG,
} from "@/src/curriculum/grade2";
import {
  GRADE3_READING_WORLD_CONFIG,
  GRADE3_CONTEXT_CLUE_WORLD_CONFIG,
  GRADE3_STORY_WORLD_CONFIG,
  GRADE3_NUMBER_WORLD_CONFIG,
  GRADE3_MULTIPLICATION_WORLD_CONFIG,
  GRADE3_DIVISION_WORLD_CONFIG,
  GRADE3_FRACTION_WORLD_CONFIG,
  GRADE3_MONEY_WORLD_CONFIG,
  GRADE3_CHALLENGE_WORLD_CONFIG,
  getGrade3LiteracyBlueprint,
} from "@/src/curriculum/grade3";
import {
  getGrade1FamilyStoryFriendlyDistractors,
  getGrade1FamilyStoryRenderer,
} from "@/src/domain/rules/grade1/family-story";
import {
  getGrade1ReadingFriendlyDistractors,
  getGrade1ReadingRenderer,
} from "@/src/domain/rules/grade1/reading";
import {
  getGrade1NumberFriendlyDistractors,
  getGrade1NumberRenderer,
} from "@/src/domain/rules/grade1/number";
import {
  getGrade1MathFriendlyDistractors,
  getGrade1MathRenderer,
} from "@/src/domain/rules/grade1/math";
import {
  getGrade1ShapeFriendlyDistractors,
  getGrade1ShapeRenderer,
} from "@/src/domain/rules/grade1/shape";
import {
  getGrade1NatureFriendlyDistractors,
  getGrade1NatureRenderer,
} from "@/src/domain/rules/grade1/nature";
import {
  getGrade1TimeFriendlyDistractors,
  getGrade1TimeRenderer,
} from "@/src/domain/rules/grade1/time";
import {
  getGrade1WordFriendlyDistractors,
  getGrade1WordRenderer,
} from "@/src/domain/rules/grade1/word";

export type ActiveLearningPhase =
  | "Discover"
  | "Explore"
  | "Interact"
  | "Practice"
  | "Challenge"
  | "Reward"
  | "Progress"
  | "Mastery";

export type FrameworkStageLabel =
  | "LOOK"
  | "TAP"
  | "TRY"
  | "CHOOSE"
  | "PLAY"
  | "STAR"
  | "PROGRESS"
  | "MASTERED";

export type BatiBotTopicLevel =
  | "preschool"
  | "kindergarten"
  | "grade1"
  | "grade2"
  | "grade3";

export type FrameworkQuestion = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  wrongAnswerExplanation: string;
  format: "choose" | "sentence" | "category" | "model" | "evidence" | "problem";
};

export type CognitiveSkill =
  | "observe"
  | "explore"
  | "recognize"
  | "recall"
  | "reason"
  | "classify"
  | "apply"
  | "celebrate"
  | "reflect"
  | "demonstrate";

export type DifficultyLevel = "guided" | "developing" | "independent" | "advanced";

export type TopicCompetencyBehavior =
  | "recognition"
  | "classification"
  | "sequencing"
  | "reading-comprehension"
  | "place-value"
  | "measurement"
  | "fractions"
  | "division"
  | "money"
  | "context-clues"
  | "multiplication"
  | "problem-solving"
  | "sentence-building"
  | "community-scenario"
  | "mixed-mission";

export type ApplicationActivityContent = {
  name: string;
  type: string;
  goal: string;
  competencyBehavior: TopicCompetencyBehavior;
  simulationType: string;
  realLifeContext: string;
  cognitiveSkill: CognitiveSkill;
  steps: string[];
  completionRule: string;
  masteryDemonstration: string;
};

export type FrameworkStageContent = {
  stage: FrameworkStageLabel;
  purpose: string;
  content: string;
  instruction: string;
  learnerAction: string;
  uiBehavior: string;
  interaction: string;
  feedback: string;
  completionRule: string;
  animationPurpose: string;
  cognitiveSkill: CognitiveSkill;
  difficulty: DifficultyLevel;
  learningGoal?: string;
  successCriteria?: string[];
  teachingScript?: string;
  visualContent?: string[];
  audioContent?: string[];
  discoveryContent?: string[];
  guidedQuestions?: FrameworkQuestion[];
  independentQuestions?: FrameworkQuestion[];
  applicationActivity?: ApplicationActivityContent;
  rewardLogic?: string;
  trackingLogic?: string;
  masteryConditions?: string[];
  audioText?: string;
  imagePrompt?: string;
  questionText?: string;
  passage?: string;
  evidenceSentences?: string[];
  choices?: string[];
  correctAnswer?: string;
  correctAssetConcept?: string;
  correctAnswerRepresentation?: "single-target" | "group-scene" | "place-scene";
  targetConcept?: string;
  colorTarget?: string;
  colorObjectLabels?: string[];
  shapeTarget?: string;
  shapeObjectLabels?: string[];
  animalSound?: string;
  animalHome?: string;
  animalFoodOrActivity?: string;
  fruitColor?: string;
  fruitCharacteristic?: string;
  fruitCollectionTarget?: string;
  fruitChallengeItems?: string[];
  foodGroup?: string;
  foodLearningFact?: string;
  foodMissionType?: string;
  foodMealTarget?: string;
  foodChallengeItems?: string[];
  numberQuantity?: number;
  numberCountingObject?: string;
  numberMissionType?: string;
  numberDestination?: string;
  numberChallengeItems?: number[];
  countingSkill?: string;
  countingRange?: string;
  forestObjectAssetIds?: string[];
  forestObjectTypes?: string[];
  forestMissionType?: string;
  forestChallengeSkills?: string[];
  quantityRange?: { max: number; min: number };
  sizeConcept?: string;
  sizeMissionType?: string;
  sizeObjectLabels?: string[];
  sizeChallengeConcepts?: string[];
  sizeScaleSet?: number[];
  patternType?: "AB" | "AAB" | "ABB" | "ABC";
  patternObjectTypes?: string[];
  patternChallengeTypes?: string[];
  quantityConcept?: string;
  quantityMissionType?: string;
  quantityGroupCounts?: number[];
  quantityObjectTypes?: string[];
  quantityChallengeConcepts?: string[];
  worldChallengeTopics?: string[];
  correctEvidence?: string;
  manipulatives?: string[];
  timerSeconds?: number;
  feedbackCorrect?: string;
  feedbackWrong?: string;
  cognitiveObjective?: string;
  answerVisibility?: "visible" | "delayed-highlight" | "hidden-until-response";
  autoNarration?: boolean;
  feedbackDurationMs?: number;
  randomization?: string[];
  revealDelayMs?: number;
  successFeedbackMotion?: string;
  wrongFeedbackMotion?: string;
  renderer: string;
  requiredAction?:
    | "look"
    | "tap"
    | "choose"
    | "guidedChoose"
    | "independentChoose"
    | "drag"
    | "sort"
    | "count"
    | "touchCount"
    | "match"
    | "build"
    | "move"
    | "collect"
    | "solve"
    | "highlightEvidence"
    | "compose"
    | "partition"
    | "sequence";
  roundCount?: number;
  revealSuccessAfterRound?: number;
  requiredInteractionCount?: number;
  playMode?:
    | "single-family-home"
    | "drag-family-home"
    | "build-home-family"
    | "drag-head-to-body"
    | "drag-eyes-to-face"
    | "drag-sound-to-ears"
    | "drag-flower-to-nose"
    | "drag-food-to-mouth"
    | "drag-toy-to-hands"
    | "drag-feet-to-footprints"
    | "build-body"
    | "drag-red-paint"
    | "drag-blue-object"
    | "drag-yellow-object"
    | "drag-green-object"
    | "drag-orange-object"
    | "drag-purple-object"
    | "drag-black-object"
    | "drag-white-object"
    | "build-rainbow"
    | "drag-circle-wheel"
    | "drag-square-window"
    | "drag-triangle-roof"
    | "drag-rectangle-door"
    | "drag-star-sky"
    | "build-house"
    | "give-dog-bone"
    | "give-cat-yarn"
    | "drag-bird-to-nest"
    | "drag-duck-to-pond"
    | "drag-fish-to-water"
    | "feed-cow-grass"
    | "feed-horse-hay"
    | "match-animals-to-homes"
    | "drag-fruit-to-basket"
    | "feed-monkey-fruit"
    | "drag-fruit-to-wagon"
    | "fruit-basket-challenge"
    | "serve-food-to-plate"
    | "give-drink-to-child"
    | "collect-food-to-basket"
    | "serve-drink-to-cup"
    | "make-meal"
    | "collect-all"
    | "multi-collect-all"
    | "drag-exact-quantity"
    | "multi-drag-exact-quantity"
    | "collect-quantity"
    | "multi-count";
  requiredDropItemIds?: string[];
  optionalDropItemIds?: string[];
  distractorItemIds?: string[];
  dropZoneId?: string;
  destinationId?: string;
  targetFruitId?: string;
  targetFoodId?: string;
  targetCount?: number;
  targetQuantity?: number;
  countingObject?: string;
  quantityMissions?: {
    availableCount: number;
    destinationId?: string;
    destinationLabel?: string;
    objectAssetTopicTitle?: string;
    objectAssetWorldId?: string;
    objectKind: string;
    prompt: string;
    targetCount: number;
  }[];
  successText?: string;
  animation?: string;
  xpReward?: number;
  starReward?: number;
  unlockTarget?: string;
};

export type TopicKnowledgeUnit = {
  id: string;
  title: string;
  teachingPoint: string;
};

export type TopicExample = {
  label: string;
  category: string;
  sentence: string;
};

export type TopicNonExample = {
  label: string;
  reason: string;
};

export type TopicMisconception = {
  misconception: string;
  correction: string;
};

export type TopicVocabularyEntry = {
  word: string;
  meaning: string;
};

export type TopicAssetRequirements = {
  images: string[];
  animations: string[];
  audio: string[];
};

export type TopicValidationRules = {
  minimumExamples: number;
  minimumNonExamples: number;
  minimumTryQuestions: number;
  minimumChooseQuestions: number;
  requiresMisconceptions: boolean;
  requiresVocabularyBank: boolean;
  rejectsGenericStages: boolean;
  rejectsReusedContent: boolean;
};

export type TopicMasteryRules = {
  requiredStages: FrameworkStageLabel[];
  minimumPlayAccuracy: number;
  conditions: string[];
  competencyDemonstration: string;
  evidenceRequired: string[];
};

export type TopicBehaviorProfile = {
  competencyBehavior: TopicCompetencyBehavior;
  progression: CognitiveSkill[];
  allowedPlayActivities: string[];
  requiresSimulation: boolean;
  simulationType: string;
  realLifeContext: string;
};

export type BatiBotTopicContent = {
  id: string;
  topicAssetSlot: string;
  lookAssetSlot: string;
  tapAssetSlot: string;
  tryAssetSlot: string;
  chooseAssetSlot: string;
  playAssetSlot: string;
  rewardAssetSlot: string;
  masteryAssetSlot: string;
  level: BatiBotTopicLevel;
  world: string;
  topic: string;
  curriculumArea: string;
  competency: string;
  learningObjective: string;
  knowledge: string;
  successCriteria: string[];
  knowledgeUnits: TopicKnowledgeUnit[];
  examples: TopicExample[];
  nonExamples: TopicNonExample[];
  misconceptions: TopicMisconception[];
  vocabularyBank: TopicVocabularyEntry[];
  visualAssetRequirements: TopicAssetRequirements;
  validationRules: TopicValidationRules;
  masteryRules: TopicMasteryRules;
  behaviorProfile: TopicBehaviorProfile;
  difficultyLevel: DifficultyLevel;
  fundamentalSkill: string;
  cognitiveFocus: string;
  activityType: string;
  requiredRenderer: string;
  recommendedRenderer: string;
  rendererAliases: string[];
  rewardRule: {
    xp: number;
    stars: number;
  };
  unlockRule: {
    unlocksNextTopic: boolean;
    nextTopic?: string;
  };
  frameworkStages: FrameworkStageContent[];
};

export type WorldContentIdentity = {
  teaches: string;
  knowledgeScope: string[];
  completionChallenge: string;
};

type FrameworkStageContentOverride = Partial<Omit<FrameworkStageContent, "stage">>;

type TopicContentBibleOverride = {
  activityType?: string;
  content?: Partial<Pick<
    BatiBotTopicContent,
    | "competency"
    | "examples"
    | "knowledge"
    | "knowledgeUnits"
    | "learningObjective"
    | "masteryRules"
    | "misconceptions"
    | "nonExamples"
    | "successCriteria"
    | "vocabularyBank"
  >>;
  cognitiveFocus?: string;
  fundamentalSkill?: string;
  requiredRenderer?: string;
  stageOverrides: Partial<Record<FrameworkStageLabel, FrameworkStageContentOverride>>;
};

export type InteractionType =
  | "Tap Activity"
  | "Drag and Drop Activity"
  | "Match Activity"
  | "Listening Activity"
  | "Counting Activity"
  | "Puzzle Activity"
  | "Sequence Activity"
  | "Story-Based Activity"
  | "Sentence Activity"
  | "Word Relationship Activity"
  | "Context Clue Activity"
  | "Passage Activity"
  | "Multi-Step Problem Activity"
  | "Timed Challenge"
  | "Mastery Challenge";

export interface CurriculumTopic {
  category: VocabularyCategory;
  challengeRule: CurriculumChallengeRule;
  competencyCode?: string;
  competencyFocus?: KindergartenCompetencyFocus[];
  competencyObjective?: string;
  competencySource?: "Early Childhood Kindergarten Readiness" | "MATATAG Foundational Literacy and Numeracy";
  activityType?: string;
  batibotContent?: BatiBotTopicContent;
  cognitiveFocus?: string;
  curriculumLevel?: LearnerGradeLevel;
  emoji: string;
  example: string;
  fundamentalSkill?: string;
  interactionTypes: InteractionType[];
  kindergartenSupport?: KindergartenTopicSupport;
  learningStages: ActiveLearningPhase[];
  frameworkStages?: FrameworkStageContent[];
  requiredRenderer?: string;
  rewardRule?: string;
  subcategory: VocabularySubcategory;
  title: string;
  unlockRule?: string;
  worldName?: string;
}

export type KindergartenCompetencyFocus =
  | "Letter Recognition"
  | "Phonological Awareness"
  | "Oral Language"
  | "Early Reading"
  | "Foundational Numeracy";

export interface KindergartenTopicSupport {
  audioPrompt?: string;
  beginningSound?: string;
  beforeAfter?: {
    after?: string;
    before?: string;
  };
  countingObjects?: number;
  lowercase?: string;
  moreLess?: boolean;
  objectMatch?: string;
  oralPrompt?: string;
  patternType?: "AB" | "AAB" | "ABB" | "ABC";
  pictureMatch?: string[];
  soundExamples?: string[];
  stagePrompts?: Partial<Record<ActiveLearningPhase, string>>;
  uppercase?: string;
  wordMatch?: string[];
}

export interface CurriculumWorld {
  accentColor: string;
  activities: string[];
  description: string;
  emoji: string;
  id: string;
  title: string;
  topics: CurriculumTopic[];
  worldIdentity?: WorldContentIdentity;
}

export interface GradeCurriculum {
  gradeLevel: LearnerGradeLevel;
  title: string;
  worlds: CurriculumWorld[];
}

export type WorldActivityTemplateId =
  | "family"
  | "body"
  | "color"
  | "shape"
  | "animal"
  | "fruit"
  | "food"
  | "number"
  | "counting"
  | "comparison"
  | "pattern"
  | "alphabet"
  | "object"
  | "community"
  | "nature"
  | "word-vocabulary"
  | "sight-reading"
  | "reading-comprehension"
  | "number-concept"
  | "arithmetic"
  | "geometry"
  | "time-concept"
  | "word-relationship"
  | "story-understanding"
  | "community-understanding"
  | "number-structure"
  | "problem-solving"
  | "measurement"
  | "mixed-skills"
  | "advanced-vocabulary"
  | "context-analysis"
  | "story-analysis"
  | "multi-step-math"
  | "multiplication-application"
  | "division"
  | "fractions"
  | "financial-literacy"
  | "mastery-assessment";

export type CognitiveLearningLevelId =
  | "recognition"
  | "symbol-recognition"
  | "word-recognition"
  | "understanding"
  | "application-analysis";

export type ActivitySkillMode =
  | "identify"
  | "count"
  | "compare-size"
  | "compare-quantity"
  | "predict-pattern"
  | "read"
  | "reason";

export interface GradeCognitiveTemplate {
  discover: string;
  explore: string;
  interact: string;
  learnerGoal: string[];
  learningStyle: string;
  level: CognitiveLearningLevelId;
  practice: string;
  challenge: string;
  reward: string;
  progress: string;
  mastery: string;
}

export interface WorldActivityTemplate {
  challenge: string;
  cognitiveLevel?: CognitiveLearningLevelId;
  designPrinciple: string;
  discover: string;
  explore: string;
  interact: string;
  label: string;
  learningType?: string;
  mastery: string;
  practice: string;
  progress: string;
  reward: string;
  skillMode?: ActivitySkillMode;
}

export const GRADE_COGNITIVE_TEMPLATES: Record<
  LearnerGradeLevel,
  GradeCognitiveTemplate
> = {
  Preschool: {
    level: "recognition",
    learnerGoal: ["See", "Hear", "Touch", "Match", "Count"],
    learningStyle: "Image-first, audio-first, minimal reading.",
    discover: "Introduce one concrete object, color, number, size, or pattern.",
    explore: "Let the learner tap, listen, and observe a playful response.",
    interact: "Guide recognition by matching the concept to its image or group.",
    practice: "Ask the learner to choose the known visual from a few choices.",
    challenge: "Turn recognition into a find, count, match, or hunt game.",
    reward: "Give immediate XP and star feedback.",
    progress: "Save the recognized topic.",
    mastery: "Unlock the next visual topic.",
  },
  Kindergarten: {
    level: "symbol-recognition",
    learnerGoal: [
      "Recognize symbols",
      "Recognize letters",
      "Associate words with objects",
      "Build early literacy",
    ],
    learningStyle: "Image plus symbol, with short spoken labels.",
    discover: "Introduce one symbol, letter, object, role, number, or pattern.",
    explore: "Let the learner tap symbols and images to hear their sounds.",
    interact: "Build associations such as letter to object or helper to place.",
    practice: "Ask the learner to remember and choose the known symbol or object.",
    challenge: "Ask for faster symbol or object recognition with fewer hints.",
    reward: "Give XP and star feedback.",
    progress: "Save the symbol or topic progress.",
    mastery: "Unlock the next symbol, object, or topic.",
  },
  "Grade 1": {
    level: "word-recognition",
    learnerGoal: ["Read words", "Understand meaning", "Read simple sentences"],
    learningStyle: "50% visual, 25% interaction, and 25% text: picture-supported words and one short sentence.",
    discover: "Show one word, picture, or model.",
    explore: "Tap the picture, word, or model.",
    interact: "Match the word to a picture or clue.",
    practice: "Choose the word that fits.",
    challenge: "Use the known word or model in a short game.",
    reward: "Give XP and star feedback.",
    progress: "Save the word or skill progress.",
    mastery: "Unlock the next word or sentence skill.",
  },
  "Grade 2": {
    level: "understanding",
    learnerGoal: [
      "Understand relationships",
      "Solve problems",
      "Interpret meaning",
    ],
    learningStyle: "35% visual, 25% interaction, and 40% text: read short clues with moderate visual support.",
    discover: "Introduce one model, short clue, relationship, strategy, or problem idea.",
    explore: "Show examples that compare meanings, numbers, situations, or evidence.",
    interact: "Match, compare, sort, build, or highlight the relationship with support.",
    practice: "Ask the learner to solve using the model, clue, or relationship.",
    challenge: "Use a short sentence, model, or problem and reduce hints.",
    reward: "Give XP and star feedback.",
    progress: "Save the understanding skill progress.",
    mastery: "Unlock the next reasoning skill.",
  },
  "Grade 3": {
    level: "application-analysis",
    learnerGoal: ["Analyze", "Infer", "Solve multi-step tasks"],
    learningStyle: "25% visual, 25% interaction, and 50% text: read evidence, reason, and solve problems.",
    discover: "Introduce one strategy, clue type, operation, or applied concept.",
    explore: "Read or inspect examples that show how the strategy works.",
    interact: "Identify clues, steps, evidence, or operation choices with support.",
    practice: "Apply the strategy to a sentence, passage, or problem.",
    challenge: "Answer from a passage or solve a multi-step task with fewer hints.",
    reward: "Give XP and star feedback.",
    progress: "Save the application skill progress.",
    mastery: "Confirm mastery and unlock the next advanced skill.",
  },
};

export const WORLD_ACTIVITY_TEMPLATES: Record<
  WorldActivityTemplateId,
  WorldActivityTemplate
> = {
  family: {
    label: "Family Template",
    designPrinciple: "Picture-first family recognition with one familiar action per phase.",
    discover: "Show one family member picture with short audio.",
    explore: "Tap the family member to hear the name.",
    interact: "Match the family member to the same picture.",
    practice: "Choose from the family meaning clue.",
    challenge: "Use the family meaning clue with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the family topic learned.",
    mastery: "Unlock the next family topic.",
  },
  body: {
    label: "Body Template",
    designPrinciple: "Use body-part assets as the task target, not decoration.",
    discover: "Show one body part with short audio.",
    explore: "Tap the body part to observe or animate it.",
    interact: "Place or match the body part with guidance.",
    practice: "Point to or choose the body part.",
    challenge: "Find the body part among known body choices.",
    reward: "Give XP and one star.",
    progress: "Mark the body topic learned.",
    mastery: "Unlock the next body topic.",
  },
  color: {
    label: "Color Template",
    designPrinciple: "Large color visuals first, short word labels second.",
    discover: "Show one large color object with audio.",
    explore: "Tap objects with the target color.",
    interact: "Match same-color objects.",
    practice: "Choose the target color.",
    challenge: "Find all target-color objects with less support.",
    reward: "Give XP and one star.",
    progress: "Mark the color topic learned.",
    mastery: "Unlock the next color.",
  },
  shape: {
    label: "Shape Template",
    designPrinciple: "Show the actual shape and matching real object together.",
    discover: "Show one large shape with audio.",
    explore: "Tap or rotate the shape.",
    interact: "Match the shape to a familiar object.",
    practice: "Choose the target shape.",
    challenge: "Hunt for the target shape among known shapes.",
    reward: "Give XP and one star.",
    progress: "Mark the shape topic learned.",
    mastery: "Unlock the next shape.",
  },
  animal: {
    label: "Animal Template",
    designPrinciple: "Animal image, sound, and choice tasks stay tied to one animal.",
    discover: "Show one animal with audio.",
    explore: "Tap the animal to hear or animate it.",
    interact: "Match the animal to its picture.",
    practice: "Choose the animal from picture choices.",
    challenge: "Find the animal among known animals.",
    reward: "Give XP and one star.",
    progress: "Mark the animal topic learned.",
    mastery: "Unlock the next animal.",
  },
  fruit: {
    label: "Fruit Template",
    designPrinciple: "Use fruit assets directly for recognition and sorting.",
    discover: "Show one fruit with audio.",
    explore: "Tap the fruit to hear the name.",
    interact: "Match the fruit to the same fruit picture.",
    practice: "Select the fruit from picture choices.",
    challenge: "Put the known fruit in the basket.",
    reward: "Give XP and one star.",
    progress: "Mark the fruit topic learned.",
    mastery: "Unlock the next fruit.",
  },
  food: {
    label: "Food Template",
    designPrinciple: "Food topics stay concrete, visual, and tap-friendly.",
    discover: "Show one food item with audio.",
    explore: "Tap the food item to hear the name.",
    interact: "Match the food item.",
    practice: "Choose the food from picture choices.",
    challenge: "Sort or find the known food item.",
    reward: "Give XP and one star.",
    progress: "Mark the food topic learned.",
    mastery: "Unlock the next food.",
  },
  number: {
    label: "Number Template",
    skillMode: "count",
    designPrinciple: "Teach number sense by pairing numeral, spoken number, and countable quantity.",
    discover: "Show the numeral with matching objects and audio.",
    explore: "Tap objects and count aloud.",
    interact: "Match the numeral to the correct group.",
    practice: "Ask how many objects are shown.",
    challenge: "Find the group with the target quantity among mixed known groups.",
    reward: "Give XP and one star.",
    progress: "Mark the number topic learned.",
    mastery: "Unlock the next number.",
  },
  counting: {
    label: "Counting Template",
    skillMode: "count",
    designPrinciple: "Counting uses visible groups and child-paced taps.",
    discover: "Show a small group to count.",
    explore: "Tap each object while counting.",
    interact: "Count together with guided feedback.",
    practice: "Answer how many are shown.",
    challenge: "Count only the requested objects in a mixed group.",
    reward: "Give XP and one star.",
    progress: "Mark the counting topic learned.",
    mastery: "Unlock the next counting activity.",
  },
  comparison: {
    label: "Comparison Template",
    skillMode: "reason",
    designPrinciple: "Comparison lessons must compare visible sizes or quantities, not just recognize words.",
    discover: "Show the comparison using clear visual pairs.",
    explore: "Tap each side and observe what changes.",
    interact: "Choose, match, or sort by the comparison rule.",
    practice: "Compare several known examples independently.",
    challenge: "Classify or compare mixed known examples with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the comparison topic learned.",
    mastery: "Unlock the next comparison.",
  },
  pattern: {
    label: "Pattern Template",
    skillMode: "predict-pattern",
    designPrinciple: "Rows make the repeat visible before asking what comes next.",
    discover: "Show a repeating row.",
    explore: "Tap each item in order.",
    interact: "Predict what comes next.",
    practice: "Tap the missing pattern item.",
    challenge: "Build or complete a changed pattern under light time pressure.",
    reward: "Give XP and one star.",
    progress: "Mark the pattern topic learned.",
    mastery: "Unlock the next pattern activity.",
  },
  alphabet: {
    label: "Alphabet Template",
    designPrinciple: "Letter, sound, and example picture stay together.",
    discover: "Show the letter and example picture with audio.",
    explore: "Tap the letter and example picture.",
    interact: "Match the letter to the example picture.",
    practice: "Find the target letter among letters.",
    challenge: "Catch or choose the target letter with less support.",
    reward: "Give XP and one star.",
    progress: "Mark the letter topic learned.",
    mastery: "Unlock the next letter.",
  },
  object: {
    label: "Object Template",
    designPrinciple: "Kindergarten object lessons add simple word-picture matching.",
    discover: "Show one object with short sentence audio.",
    explore: "Tap the object to hear pronunciation.",
    interact: "Match the word to the picture.",
    practice: "Choose the object from three pictures.",
    challenge: "Find the object in a known group.",
    reward: "Give XP and one star.",
    progress: "Mark the object topic learned.",
    mastery: "Unlock the next object.",
  },
  community: {
    label: "Community Template",
    designPrinciple: "Community helpers connect one helper to one familiar place or tool.",
    discover: "Show one helper with short sentence audio.",
    explore: "Tap related place or tool objects.",
    interact: "Match the helper to the place or tool.",
    practice: "Choose who helps with the known task.",
    challenge: "Match known helpers with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the helper topic learned.",
    mastery: "Unlock the next helper.",
  },
  nature: {
    label: "Nature Template",
    designPrinciple: "Nature lessons use simple cause, place, or time relationships.",
    discover: "Show one nature item with short sentence audio.",
    explore: "Tap the item to animate or listen.",
    interact: "Match the item to its known scene.",
    practice: "Select the nature item from choices.",
    challenge: "Sort known nature items with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the nature topic learned.",
    mastery: "Unlock the next nature topic.",
  },
  "word-vocabulary": {
    label: "Word Vocabulary Template",
    cognitiveLevel: "word-recognition",
    learningType: "Vocabulary",
    designPrinciple: "Grade 1 pairs readable words with pictures and one simple sentence.",
    discover: "Show one word with its picture and pronunciation.",
    explore: "Show the word in a short sentence.",
    interact: "Match the word to its picture or meaning.",
    practice: "Use the picture or sentence clue to match the word.",
    challenge: "Find the known word or word type among mixed words.",
    reward: "Give XP and one star.",
    progress: "Mark the word topic learned.",
    mastery: "Unlock the next word topic.",
  },
  "sight-reading": {
    label: "Sight Reading Template",
    cognitiveLevel: "word-recognition",
    learningType: "Sight Words",
    designPrinciple: "Sight-word lessons use fast recognition with short readable text.",
    discover: "Show the sight word with audio.",
    explore: "Read the word inside a simple sentence.",
    interact: "Match the sight word to the spoken word.",
    practice: "Choose the sight word from similar words.",
    challenge: "Find the sight word quickly in a word set.",
    reward: "Give XP and one star.",
    progress: "Mark the sight word learned.",
    mastery: "Unlock the next sight word.",
  },
  "reading-comprehension": {
    label: "Reading Comprehension Template",
    cognitiveLevel: "word-recognition",
    learningType: "Reading Comprehension",
    designPrinciple: "Use one short sentence or story idea before asking a question.",
    discover: "Show one story word, character, place, or idea.",
    explore: "Read a short sentence using the topic.",
    interact: "Match the word or idea to the picture.",
    practice: "Choose the answer from a simple sentence.",
    challenge: "Answer a known story question with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the reading topic learned.",
    mastery: "Unlock the next reading topic.",
  },
  "number-concept": {
    label: "Number Concept Template",
    cognitiveLevel: "word-recognition",
    learningType: "Number Concepts",
    designPrinciple: "Grade 1 number work connects numerals, words, and visual groups.",
    discover: "Show the number concept with objects or a picture.",
    explore: "Tap or inspect the number example.",
    interact: "Match the number, word, or group.",
    practice: "Use the model to match the number concept.",
    challenge: "Build or solve a familiar number task with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the number concept learned.",
    mastery: "Show number-model evidence before unlocking the next skill.",
  },
  arithmetic: {
    label: "Arithmetic Template",
    cognitiveLevel: "word-recognition",
    learningType: "Arithmetic",
    designPrinciple: "Arithmetic starts with visible groups before symbolic equations.",
    discover: "Show the operation with a visual example.",
    explore: "Tap the groups or steps.",
    interact: "Match the equation to the visual answer.",
    practice: "Use counters or an equation model to solve.",
    challenge: "Build and solve a familiar equation with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the arithmetic skill learned.",
    mastery: "Show counter or equation evidence before unlocking the next arithmetic skill.",
  },
  geometry: {
    label: "Geometry Template",
    cognitiveLevel: "word-recognition",
    learningType: "Geometry",
    designPrinciple: "Geometry connects shape words, visual properties, and real objects.",
    discover: "Show the shape or geometry idea with a picture.",
    explore: "Inspect sides, corners, curves, or examples.",
    interact: "Match the geometry word to its visual example.",
    practice: "Use sides, corners, or curves to match the property.",
    challenge: "Find, count, or classify the known geometry idea with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the geometry topic learned.",
    mastery: "Show property evidence before unlocking the next geometry topic.",
  },
  "time-concept": {
    label: "Time Concept Template",
    cognitiveLevel: "word-recognition",
    learningType: "Time Concepts",
    designPrinciple: "Time lessons connect clock visuals, words, and daily routines.",
    discover: "Show the time word or clock picture.",
    explore: "Inspect the clock or routine example.",
    interact: "Match the time to the clock or event.",
    practice: "Use the clock or routine model to match the time concept.",
    challenge: "Set the time or arrange the routine with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the time topic learned.",
    mastery: "Unlock the next time topic.",
  },
  "word-relationship": {
    label: "Word Relationship Template",
    cognitiveLevel: "understanding",
    learningType: "Word Relationships",
    designPrinciple: "Grade 2 vocabulary asks learners to compare meanings, not just read.",
    discover: "Introduce one relationship such as synonym, antonym, or category.",
    explore: "Show paired examples.",
    interact: "Match the related words.",
    practice: "Match the relationship using paired word clues.",
    challenge: "Use a sentence to prove the related word.",
    reward: "Give XP and one star.",
    progress: "Mark the relationship skill learned.",
    mastery: "Unlock the next relationship skill.",
  },
  "story-understanding": {
    label: "Story Understanding Template",
    cognitiveLevel: "understanding",
    learningType: "Comprehension",
    designPrinciple: "Grade 2 stories ask learners to connect details, meaning, and answer choices.",
    discover: "Introduce one story idea, detail, or comprehension skill.",
    explore: "Read a short example with the story idea.",
    interact: "Match the detail, character, setting, or event with support.",
    practice: "Use the story detail to support the answer.",
    challenge: "Tap evidence for a familiar comprehension question with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the comprehension skill learned.",
    mastery: "Unlock the next comprehension skill.",
  },
  "community-understanding": {
    label: "Community Understanding Template",
    cognitiveLevel: "understanding",
    learningType: "Community Understanding",
    designPrinciple: "Community lessons connect roles, places, tools, and reasons.",
    discover: "Introduce one community role, place, or responsibility.",
    explore: "Show examples of the role in action.",
    interact: "Match the role to its place, tool, or purpose.",
    practice: "Choose the best explanation.",
    challenge: "Solve a familiar community scenario with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the community skill learned.",
    mastery: "Unlock the next community topic.",
  },
  "number-structure": {
    label: "Number Structure Template",
    cognitiveLevel: "understanding",
    learningType: "Number Structure",
    designPrinciple: "Place-value work shows how numbers are built before asking for answers.",
    discover: "Show the number structure with tens, ones, or grouped objects.",
    explore: "Inspect the parts of the number.",
    interact: "Match the number to its structure.",
    practice: "Build the structure or value with place-value parts.",
    challenge: "Build and solve a known place-value task with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the number-structure skill learned.",
    mastery: "Unlock the next number-structure skill.",
  },
  "problem-solving": {
    label: "Problem Solving Template",
    cognitiveLevel: "understanding",
    learningType: "Problem Solving",
    designPrinciple: "Problems are broken into meaning, operation, and answer.",
    discover: "Introduce the problem idea or strategy.",
    explore: "Show the situation with numbers or visuals.",
    interact: "Choose the operation or step with guidance.",
    practice: "Solve a similar problem.",
    challenge: "Solve a familiar word problem with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the problem-solving skill learned.",
    mastery: "Unlock the next problem-solving skill.",
  },
  measurement: {
    label: "Measurement Template",
    cognitiveLevel: "understanding",
    learningType: "Measurement",
    designPrinciple: "Measurement compares visible length, weight, volume, or units.",
    discover: "Show the measurement concept.",
    explore: "Compare examples visually.",
    interact: "Match the object to the unit or comparison.",
    practice: "Use the measurement tool before matching the result.",
    challenge: "Measure or compare a familiar object with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the measurement skill learned.",
    mastery: "Unlock the next measurement skill.",
  },
  "mixed-skills": {
    label: "Mixed Skills Template",
    cognitiveLevel: "understanding",
    learningType: "Mixed Skills",
    designPrinciple: "Mixed review uses known skills only and asks learners to choose a strategy.",
    discover: "Introduce the review skill target.",
    explore: "Show examples from known topics.",
    interact: "Sort or match the known skill type.",
    practice: "Answer a supported mixed-skill item.",
    challenge: "Answer a mixed-skill task with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the mixed-skill progress.",
    mastery: "Confirm readiness for the next skill.",
  },
  "advanced-vocabulary": {
    label: "Grade 3 Reading Quest Template",
    cognitiveLevel: "application-analysis",
    learningType: "Reading Comprehension",
    designPrinciple: "Grade 3 reading uses short grade-level texts, evidence, and comprehension tasks with 25% visual support, 25% interaction, and 50% text.",
    discover: "Introduce one reading skill with a short text model.",
    explore: "Read and tap evidence in a sentence or paragraph.",
    interact: "Identify words, sentence meaning, details, or text relationships with support.",
    practice: "Answer a guided comprehension item using evidence.",
    challenge: "Use a short passage to answer with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the reading comprehension skill learned.",
    mastery: "Unlock the next Grade 3 reading skill.",
  },
  "context-analysis": {
    label: "Context Analysis Template",
    cognitiveLevel: "application-analysis",
    learningType: "Context Analysis",
    designPrinciple: "Grade 3 context work asks learners to use clues, not guess words.",
    discover: "Introduce one context clue type or strategy.",
    explore: "Read a sentence that models the clue.",
    interact: "Identify the clue with support.",
    practice: "Determine meaning from a sentence.",
    challenge: "Read a short passage and answer with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the context skill learned.",
    mastery: "Unlock the next context skill.",
  },
  "story-analysis": {
    label: "Story Analysis Template",
    cognitiveLevel: "application-analysis",
    learningType: "Story Analysis",
    designPrinciple: "Story analysis uses evidence from characters, setting, events, and theme.",
    discover: "Introduce one story element or analysis skill.",
    explore: "Read a short story example.",
    interact: "Identify the element or evidence with support.",
    practice: "Answer a story question using the example.",
    challenge: "Read a passage and answer multiple known-skill questions.",
    reward: "Give XP and one star.",
    progress: "Mark the story-analysis skill learned.",
    mastery: "Unlock the next story-analysis skill.",
  },
  "multi-step-math": {
    label: "Multi-Step Math Template",
    cognitiveLevel: "application-analysis",
    learningType: "Multi-Step Math",
    designPrinciple: "Multi-step tasks show plan, operation, and answer checking.",
    discover: "Introduce the multi-step strategy.",
    explore: "Inspect a worked example.",
    interact: "Choose the first step or operation with support.",
    practice: "Solve a guided multi-step problem.",
    challenge: "Solve a familiar multi-step problem with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the multi-step skill learned.",
    mastery: "Unlock the next multi-step skill.",
  },
  "multiplication-application": {
    label: "Multiplication Application Template",
    cognitiveLevel: "application-analysis",
    learningType: "Multiplication Application",
    designPrinciple: "Multiplication uses arrays, groups, and word problems before speed.",
    discover: "Show the multiplication concept or strategy.",
    explore: "Inspect groups, arrays, or repeated addition.",
    interact: "Match the model to the multiplication sentence.",
    practice: "Solve a multiplication problem.",
    challenge: "Apply multiplication in a familiar word problem.",
    reward: "Give XP and one star.",
    progress: "Mark the multiplication skill learned.",
    mastery: "Unlock the next multiplication skill.",
  },
  division: {
    label: "Division Template",
    cognitiveLevel: "application-analysis",
    learningType: "Division",
    designPrinciple: "Division starts as sharing and grouping before symbolic answers.",
    discover: "Show division as sharing or grouping.",
    explore: "Inspect the groups and leftovers.",
    interact: "Match the division model to the equation.",
    practice: "Solve a division problem.",
    challenge: "Apply division in a familiar word problem.",
    reward: "Give XP and one star.",
    progress: "Mark the division skill learned.",
    mastery: "Unlock the next division skill.",
  },
  fractions: {
    label: "Fractions Template",
    cognitiveLevel: "application-analysis",
    learningType: "Fractions",
    designPrinciple: "Fraction lessons show equal parts before symbols.",
    discover: "Show the fraction with equal parts.",
    explore: "Inspect the parts and whole.",
    interact: "Match the fraction to its model.",
    practice: "Use the equal-parts model to match the fraction.",
    challenge: "Partition or check a familiar fraction model with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the fraction skill learned.",
    mastery: "Unlock the next fraction skill.",
  },
  "financial-literacy": {
    label: "Financial Literacy Template",
    cognitiveLevel: "application-analysis",
    learningType: "Financial Literacy",
    designPrinciple: "Money tasks connect coins, bills, value, and real choices.",
    discover: "Introduce the money concept.",
    explore: "Inspect coins, bills, prices, or choices.",
    interact: "Match money to value or item.",
    practice: "Compose the coins or bills before matching the value.",
    challenge: "Build and solve a familiar money scenario with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Mark the money skill learned.",
    mastery: "Unlock the next money skill.",
  },
  "mastery-assessment": {
    label: "Mastery Assessment Template",
    cognitiveLevel: "application-analysis",
    learningType: "Mastery Assessment",
    designPrinciple: "Mastery checks mix known skills without introducing new content.",
    discover: "Introduce the review goal.",
    explore: "Preview the known skill types.",
    interact: "Sort or identify the skill type with support.",
    practice: "Answer a supported review item.",
    challenge: "Complete a mixed known-skill assessment with fewer hints.",
    reward: "Give XP and one star.",
    progress: "Save mastery assessment progress.",
    mastery: "Confirm grade-level mastery progress.",
  },
};

export const WORLD_ACTIVITY_TEMPLATE_BY_WORLD_ID: Record<
  string,
  WorldActivityTemplateId
> = {
  "preschool-family-world": "family",
  "preschool-body-world": "body",
  "preschool-colorful-world": "color",
  "preschool-shape-kingdom": "shape",
  "preschool-animal-adventure": "animal",
  "preschool-fruit-garden": "fruit",
  "preschool-food-town": "food",
  "preschool-number-village": "number",
  "preschool-counting-forest": "counting",
  "preschool-big-small": "comparison",
  "preschool-more-less": "comparison",
  "preschool-pattern-playground": "pattern",
  "kindergarten-alphabet": "alphabet",
  "kindergarten-school": "object",
  "kindergarten-community-village": "community",
  "kindergarten-nature": "nature",
  [KINDERGARTEN_NUMBER_WORLD_ID]: "number",
  [KINDERGARTEN_SIZE_WORLD_ID]: "comparison",
  [KINDERGARTEN_QUANTITY_WORLD_ID]: "comparison",
  "kindergarten-shapes": "shape",
  [KINDERGARTEN_PATTERN_WORLD_ID]: "pattern",
  [KINDERGARTEN_MATH_WORLD_ID]: "number",
  [KINDERGARTEN_READING_WORLD_ID]: "sight-reading",
  "kindergarten-problem-solving": "comparison",
  [GRADE1_WORD_WORLD_ID]: "word-vocabulary",
  [GRADE1_READING_WORLD_ID]: "sight-reading",
  [GRADE1_NUMBER_WORLD_ID]: "number-concept",
  [GRADE1_MATH_WORLD_ID]: "arithmetic",
  [GRADE1_FAMILY_STORY_WORLD_ID]: "reading-comprehension",
  [GRADE1_TIME_WORLD_ID]: "time-concept",
  [GRADE1_SHAPE_WORLD_ID]: "geometry",
  [GRADE1_NATURE_WORLD_ID]: "word-vocabulary",
  "grade2-vocabulary": "word-relationship",
  "grade2-community-explorer": "community-understanding",
  "grade2-place-value": "number-structure",
  "grade2-problems": "problem-solving",
  "grade2-measurement": "measurement",
  "grade2-multiplication": "multiplication-application",
  "grade2-challenge": "mixed-skills",
  "grade2-story": "story-understanding",
  "grade3-reading": "advanced-vocabulary",
  "grade3-context-clue-canyon": "context-analysis",
  "grade3-story-adventure": "story-analysis",
  "grade3-number": "multi-step-math",
  "grade3-multiplication": "multiplication-application",
  "grade3-division": "division",
  "grade3-fractions": "fractions",
  "grade3-money": "financial-literacy",
  "grade3-master": "mastery-assessment",
};

export function getWorldActivityTemplate(worldId: string) {
  const templateId = WORLD_ACTIVITY_TEMPLATE_BY_WORLD_ID[worldId];

  return templateId ? WORLD_ACTIVITY_TEMPLATES[templateId] : null;
}

export function getWorldActivitySkillMode(worldId: string): ActivitySkillMode {
  if (worldId === "preschool-big-small") {
    return "compare-size";
  }

  if (worldId === "preschool-more-less") {
    return "compare-quantity";
  }

  const template = getWorldActivityTemplate(worldId);

  return template?.skillMode ?? "identify";
}

export function getGradeCognitiveTemplate(
  gradeLevel?: LearnerGradeLevel | null
) {
  return gradeLevel ? GRADE_COGNITIVE_TEMPLATES[gradeLevel] : null;
}

export const ACTIVE_LEARNING_PHASES: ActiveLearningPhase[] = [
  "Discover",
  "Explore",
  "Interact",
  "Practice",
  "Challenge",
  "Reward",
  "Progress",
  "Mastery",
];

export interface LearningStageRule {
  action: LessonStageAction;
  allowedContent: string;
  guidance: string;
  learnerAction: string;
  purpose: string;
  stage: ActiveLearningPhase;
}

export interface CurriculumChallengeRule {
  allowedContentSources: string[];
  formula: string;
  guidance: "less-guided";
  introducesNewContent: false;
  retryPolicy: "limited";
  taskChanges: string[];
}

export const LEARNING_STAGE_RULES: Record<ActiveLearningPhase, LearningStageRule> = {
  Discover: { stage: "Discover", ...DOMAIN_LESSON_STAGE_RULES.Discover },
  Explore: { stage: "Explore", ...DOMAIN_LESSON_STAGE_RULES.Explore },
  Interact: { stage: "Interact", ...DOMAIN_LESSON_STAGE_RULES.Interact },
  Practice: { stage: "Practice", ...DOMAIN_LESSON_STAGE_RULES.Practice },
  Challenge: { stage: "Challenge", ...DOMAIN_LESSON_STAGE_RULES.Challenge },
  Reward: { stage: "Reward", ...DOMAIN_LESSON_STAGE_RULES.Reward },
  Progress: { stage: "Progress", ...DOMAIN_LESSON_STAGE_RULES.Progress },
  Mastery: { stage: "Mastery", ...DOMAIN_LESSON_STAGE_RULES.Mastery },
};

export const DEFAULT_CHALLENGE_RULE: CurriculumChallengeRule = {
  formula: "Known Content + New Question Style + Less Guidance",
  introducesNewContent: false,
  guidance: "less-guided",
  retryPolicy: "limited",
  allowedContentSources: [
    "current topic",
    "previously learned topics",
    "Discover",
    "Explore",
    "Interact",
    "Practice",
  ],
  taskChanges: [
    "remove hints",
    "mix examples",
    "add choices",
    "change task type",
    "require an independent answer",
    "limit retries",
  ],
};

export const XP_REWARDS = {
  viewLesson: 5,
  completeActivity: 10,
  perfectChallenge: 20,
  masterTopic: 50,
} as const;

export function getExplorerRank(level: number) {
  if (level >= 21) {
    return "Legend Explorer";
  }

  if (level >= 11) {
    return "Master Explorer";
  }

  if (level >= 6) {
    return "Junior Explorer";
  }

  return "Beginner Explorer";
}

function getDefaultTopicExample(title: string) {
  return `${title} is practiced with examples, non-examples, and one clear learner action.`;
}

function topic(
  title: string,
  emoji: string,
  category: VocabularyCategory,
  subcategory: VocabularySubcategory,
  interactionTypes: InteractionType[],
  example?: string
): CurriculumTopic {
  return {
    title,
    emoji,
    category,
    subcategory,
    interactionTypes,
    learningStages: ACTIVE_LEARNING_PHASES,
    challengeRule: DEFAULT_CHALLENGE_RULE,
    example: example ?? getDefaultTopicExample(title),
  };
}

type PreschoolWorldConfigSource = Pick<
  CurriculumWorld,
  "accentColor" | "activities" | "description" | "emoji" | "id" | "title"
> & {
  topics: {
    category: string;
    emoji: string;
    example?: string;
    interactionTypes: string[];
    subcategory: string;
    title: string;
  }[];
};

function preschoolWorldFromConfig(
  config: PreschoolWorldConfigSource
): CurriculumWorld {
  return {
    id: config.id,
    title: config.title,
    emoji: config.emoji,
    accentColor: config.accentColor,
    description: config.description,
    activities: [...config.activities],
    topics: config.topics.map((topicConfig) =>
      topic(
        topicConfig.title,
        topicConfig.emoji,
        topicConfig.category as VocabularyCategory,
        topicConfig.subcategory as VocabularySubcategory,
        [...topicConfig.interactionTypes] as InteractionType[],
        topicConfig.example
      )
    ),
  };
}

function kindergartenWorldFromConfig(
  config: PreschoolWorldConfigSource
): CurriculumWorld {
  return preschoolWorldFromConfig(config);
}

function grade1WorldFromConfig(config: PreschoolWorldConfigSource): CurriculumWorld {
  return preschoolWorldFromConfig(config);
}

function grade2WorldFromConfig(config: PreschoolWorldConfigSource): CurriculumWorld {
  return preschoolWorldFromConfig(config);
}

function grade3WorldFromConfig(config: PreschoolWorldConfigSource): CurriculumWorld {
  return preschoolWorldFromConfig(config);
}

const KINDERGARTEN_WORLD_UPDATES: Record<
  string,
  Pick<CurriculumWorld, "activities" | "description"> & Partial<Pick<CurriculumWorld, "title">>
> = {
  [KINDERGARTEN_ALPHABET_WORLD_ID]: {
    description: KINDERGARTEN_ALPHABET_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_ALPHABET_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_SCHOOL_WORLD_ID]: {
    description: KINDERGARTEN_SCHOOL_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_SCHOOL_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_COMMUNITY_WORLD_ID]: {
    description: KINDERGARTEN_COMMUNITY_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_COMMUNITY_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_NATURE_WORLD_ID]: {
    description: KINDERGARTEN_NATURE_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_NATURE_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_NUMBER_WORLD_ID]: {
    title: KINDERGARTEN_NUMBER_WORLD_CONFIG.title,
    description: KINDERGARTEN_NUMBER_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_NUMBER_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_SIZE_WORLD_ID]: {
    title: KINDERGARTEN_SIZE_WORLD_CONFIG.title,
    description: KINDERGARTEN_SIZE_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_SIZE_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_QUANTITY_WORLD_ID]: {
    title: KINDERGARTEN_QUANTITY_WORLD_CONFIG.title,
    description: KINDERGARTEN_QUANTITY_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_QUANTITY_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_SHAPE_WORLD_ID]: {
    description: KINDERGARTEN_SHAPE_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_SHAPE_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_PATTERN_WORLD_ID]: {
    description: KINDERGARTEN_PATTERN_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_PATTERN_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_MATH_WORLD_ID]: {
    title: KINDERGARTEN_MATH_WORLD_CONFIG.title,
    description: KINDERGARTEN_MATH_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_MATH_WORLD_CONFIG.activities],
  },
  [KINDERGARTEN_READING_WORLD_ID]: {
    title: KINDERGARTEN_READING_WORLD_CONFIG.title,
    description: KINDERGARTEN_READING_WORLD_CONFIG.description,
    activities: [...KINDERGARTEN_READING_WORLD_CONFIG.activities],
  },
  "kindergarten-problem-solving": {
    description:
      "Sort, classify, sequence, compare, and solve simple visual logic problems.",
    activities: [
      "Sort toys",
      "Classify objects",
      "Arrange routines",
      "Find what does not belong",
    ],
  },
};

const KINDERGARTEN_WORLD_SEQUENCE = [
  "kindergarten-alphabet",
  "kindergarten-school",
  "kindergarten-community-village",
  KINDERGARTEN_NUMBER_WORLD_ID,
  KINDERGARTEN_SIZE_WORLD_ID,
  KINDERGARTEN_QUANTITY_WORLD_ID,
  KINDERGARTEN_PATTERN_WORLD_ID,
];

function createKindergartenSupport({
  audioPrompt,
  competencyFocus,
  target,
  ...support
}: KindergartenTopicSupport & {
  competencyFocus: KindergartenCompetencyFocus[];
  target: string;
}): Pick<CurriculumTopic, "competencyFocus" | "kindergartenSupport"> {
  const oralPrompt = support.oralPrompt ?? `Say ${target}.`;

  return {
    competencyFocus,
    kindergartenSupport: {
      ...support,
      audioPrompt,
      oralPrompt,
      stagePrompts: {
        Discover: audioPrompt ?? `Listen to ${target}.`,
        Explore: `Tap ${target}. Listen.`,
        Interact: oralPrompt,
        Practice: support.stagePrompts?.Practice ?? `Tap ${target}.`,
        Challenge: support.stagePrompts?.Challenge ?? `Find ${target}.`,
        Reward: "Great work. You earned one star and ten XP.",
        Progress: `${target} progress saved.`,
        Mastery: "Unlock the next Kindergarten topic.",
        ...support.stagePrompts,
      },
    },
  };
}

function getChildTopicTitle(title: string) {
  return title
    .replace(/^What\s+(?:is|are)\s+/i, "")
    .replace(/\?$/, "")
    .trim();
}

function getKindergartenTopicUpdate(
  worldId: string,
  curriculumTopic: CurriculumTopic
): Partial<CurriculumTopic> {
  const childTitle = getChildTopicTitle(curriculumTopic.title);

  if (worldId === KINDERGARTEN_ALPHABET_WORLD_ID) {
    const alphabetSupport = getKindergartenAlphabetTopicSupport(
      curriculumTopic.title
    );

    if (!alphabetSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(alphabetSupport),
      example: alphabetSupport.example,
      interactionTypes: alphabetSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_SCHOOL_WORLD_ID) {
    const schoolSupport = getKindergartenSchoolTopicSupport(
      curriculumTopic.title
    );

    if (!schoolSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(schoolSupport),
      example: schoolSupport.example,
      interactionTypes: schoolSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_COMMUNITY_WORLD_ID) {
    const communitySupport = getKindergartenCommunityTopicSupport(
      curriculumTopic.title
    );

    if (!communitySupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(communitySupport),
      example: communitySupport.example,
      interactionTypes: communitySupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_NATURE_WORLD_ID) {
    const natureSupport = getKindergartenNatureTopicSupport(
      curriculumTopic.title
    );

    if (!natureSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(natureSupport),
      example: natureSupport.example,
      interactionTypes: natureSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_NUMBER_WORLD_ID) {
    const numberSupport = getKindergartenNumberTopicSupport(
      curriculumTopic.title
    );

    if (!numberSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(numberSupport),
      example: numberSupport.example,
      interactionTypes: numberSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_SIZE_WORLD_ID) {
    const isChallenge = childTitle === "Size Challenge";
    const prompt = isChallenge
      ? "Sort big, small, tall, and short."
      : `Choose ${childTitle}.`;

    return {
      ...createKindergartenSupport({
        audioPrompt: isChallenge
          ? "Compare sizes."
          : `${childTitle} tells size.`,
        competencyFocus: ["Foundational Numeracy", "Oral Language"],
        oralPrompt: prompt,
        pictureMatch: [childTitle],
        target: childTitle,
        wordMatch: [childTitle],
        stagePrompts: {
          Discover: `Look at ${childTitle}.`,
          Explore: `Tap ${childTitle}.`,
          Interact: prompt,
          Practice: prompt,
          Challenge: isChallenge ? "Finish the size mission." : `Find ${childTitle}.`,
        },
      }),
      example: curriculumTopic.example,
      interactionTypes: curriculumTopic.interactionTypes,
    };
  }

  if (worldId === KINDERGARTEN_QUANTITY_WORLD_ID) {
    const isChallenge = childTitle === "Comparison Challenge";
    const prompt = isChallenge
      ? "Compare every group."
      : "Count, then compare.";

    return {
      ...createKindergartenSupport({
        audioPrompt: isChallenge
          ? "Compare more and less."
          : `${childTitle}. Count each group.`,
        competencyFocus: ["Foundational Numeracy", "Oral Language"],
        oralPrompt: prompt,
        pictureMatch: [childTitle],
        target: childTitle,
        wordMatch: [childTitle],
        stagePrompts: {
          Discover: `Look at ${childTitle}.`,
          Explore: `Tap ${childTitle}.`,
          Interact: prompt,
          Practice: "Which group matches?",
          Challenge: isChallenge ? "Finish the comparing mission." : `Find ${childTitle}.`,
        },
      }),
      example: curriculumTopic.example,
      interactionTypes: curriculumTopic.interactionTypes,
    };
  }

  if (worldId === KINDERGARTEN_SHAPE_WORLD_ID) {
    const shapeSupport = getKindergartenShapeTopicSupport(
      curriculumTopic.title
    );

    if (!shapeSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(shapeSupport),
      example: shapeSupport.example,
      interactionTypes: shapeSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_PATTERN_WORLD_ID) {
    const patternSupport = getKindergartenPatternTopicSupport(
      curriculumTopic.title
    );

    if (!patternSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(patternSupport),
      example: patternSupport.example,
      interactionTypes: patternSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_READING_WORLD_ID) {
    const readingSupport = getKindergartenReadingTopicSupport(
      curriculumTopic.title
    );

    if (!readingSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(readingSupport),
      example: readingSupport.example,
      interactionTypes: readingSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === KINDERGARTEN_MATH_WORLD_ID) {
    const mathSupport = getKindergartenMathTopicSupport(curriculumTopic.title);

    if (!mathSupport) {
      return {};
    }

    return {
      ...createKindergartenSupport(mathSupport),
      example: mathSupport.example,
      interactionTypes: mathSupport.interactionTypes as InteractionType[],
    };
  }

  if (worldId === "kindergarten-problem-solving") {
    const problemPromptByTopic: Record<string, string> = {
      Classifying: "Which objects belong together?",
      Comparing: "Which one is different or bigger?",
      "Problem Solving Challenge": "Finish the thinking mission.",
      Sequencing: "What comes first, next, and last?",
      "Simple Logic": "Which one does not belong?",
      Sorting: "Sort by the rule.",
    };
    const prompt = problemPromptByTopic[childTitle] ?? `Solve ${childTitle}.`;

    return {
      ...createKindergartenSupport({
        audioPrompt: `Think about ${childTitle}.`,
        competencyFocus: ["Foundational Numeracy", "Oral Language"],
        oralPrompt: prompt,
        pictureMatch: ["thinking mission picture"],
        target: childTitle,
        wordMatch: [childTitle],
        stagePrompts: {
          Discover: `Look at ${childTitle}.`,
          Explore: `Tap ${childTitle}.`,
          Interact: prompt,
          Practice: prompt,
          Challenge: `Solve ${childTitle} on your own.`,
        },
      }),
      example: `${prompt} Use sorting, sequencing, comparing, or logic.`,
      interactionTypes: ["Puzzle Activity", "Match Activity", "Sequence Activity", "Drag and Drop Activity"],
    };
  }

  return {};
}

function getKindergartenCountingForestTopics() {
  return KINDERGARTEN_NUMBER_WORLD_CONFIG.topics.map((topicConfig) =>
    topic(
      topicConfig.title,
      topicConfig.emoji,
      topicConfig.category,
      topicConfig.subcategory,
      topicConfig.interactionTypes as InteractionType[],
      topicConfig.example
    )
  );
}

function addKindergartenSupportToGrade(grade: GradeCurriculum): GradeCurriculum {
  if (grade.gradeLevel !== "Kindergarten") {
    return grade;
  }

  return {
    ...grade,
    worlds: [...grade.worlds]
      .sort((left, right) => {
        const leftIndex = KINDERGARTEN_WORLD_SEQUENCE.indexOf(left.id);
        const rightIndex = KINDERGARTEN_WORLD_SEQUENCE.indexOf(right.id);

        return (
          (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
          (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
        );
      })
      .map((world) => {
        const worldUpdate = KINDERGARTEN_WORLD_UPDATES[world.id];

        return {
          ...world,
          ...(worldUpdate ?? {}),
          topics: (world.id === KINDERGARTEN_NUMBER_WORLD_ID
            ? getKindergartenCountingForestTopics()
            : world.topics
          ).map((topicItem) => ({
            ...topicItem,
            ...getKindergartenTopicUpdate(world.id, topicItem),
          })),
        };
      }),
  };
}

function slugifyCompetency(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBatiBotTopicLevel(gradeLevel: LearnerGradeLevel): BatiBotTopicLevel {
  if (gradeLevel === "Kindergarten") {
    return "kindergarten";
  }

  if (gradeLevel === "Grade 1") {
    return "grade1";
  }

  if (gradeLevel === "Grade 2") {
    return "grade2";
  }

  if (gradeLevel === "Grade 3") {
    return "grade3";
  }

  return "preschool";
}

function getTopicActivityType(topicItem: CurriculumTopic) {
  if (topicItem.interactionTypes.includes("Context Clue Activity")) {
    return "context-clue-reasoning";
  }

  if (topicItem.interactionTypes.includes("Passage Activity")) {
    return "passage-evidence";
  }

  if (topicItem.interactionTypes.includes("Multi-Step Problem Activity")) {
    return "multi-step-problem-solving";
  }

  if (topicItem.interactionTypes.includes("Word Relationship Activity")) {
    return "word-relationship";
  }

  if (topicItem.interactionTypes.includes("Sentence Activity")) {
    return "sentence-building";
  }

  if (topicItem.interactionTypes.includes("Counting Activity")) {
    return "counting-and-number-model";
  }

  if (topicItem.interactionTypes.includes("Sequence Activity")) {
    return "sequencing";
  }

  if (topicItem.interactionTypes.includes("Puzzle Activity")) {
    return "model-puzzle";
  }

  return topicItem.category === "numeric" ? "numeracy-recognition" : "literacy-recognition";
}

const GRADE1_CONTENT_BIBLE_OVERRIDES: Record<string, TopicContentBibleOverride> = {
  "grade1-word-kingdom:Nouns": {
    activityType: "word-classification",
    cognitiveFocus: "Classify naming words as people, places, animals, and things.",
    fundamentalSkill: "Recognize naming words.",
    requiredRenderer: "WordCategorySorterRenderer",
    stageOverrides: {
      LOOK: {
        purpose: "Introduce nouns visually through people, places, animals, and things.",
        instruction: "Look at Boy, School, Dog, and Ball.",
        learnerAction: "Watch the noun cards and listen to the category names.",
        audioText: "Nouns are naming words. They name people, places, animals, and things.",
        imagePrompt: "four child-friendly cards: boy, school, dog, and ball",
        manipulatives: ["Boy", "School", "Dog", "Ball"],
        questionText: "What can a noun name?",
      },
      TAP: {
        purpose: "Explore noun categories by tapping examples.",
        instruction: "Tap each noun card.",
        learnerAction: "Tap Boy, School, Dog, and Ball to reveal Person, Place, Animal, and Thing.",
        manipulatives: ["Boy -> Person", "School -> Place", "Dog -> Animal", "Ball -> Thing"],
        questionText: "Which category appears when you tap Dog?",
      },
      TRY: {
        purpose: "Recognize a noun with support.",
        instruction: "Which word is a noun?",
        learnerAction: "Choose Dog from two choices.",
        choices: ["Dog", "Run"],
        correctAnswer: "Dog",
        feedbackCorrect: "Great! Dog is a noun.",
        feedbackWrong: "Run is an action. Try Dog.",
      },
      CHOOSE: {
        purpose: "Identify a noun independently.",
        instruction: "Choose the noun.",
        learnerAction: "Choose School from four words.",
        choices: ["Jump", "School", "Fast", "Run"],
        correctAnswer: "School",
        feedbackCorrect: "Yes! School is a place noun.",
        feedbackWrong: "Look for a word that names a person, place, animal, or thing.",
      },
      PLAY: {
        purpose: "Apply noun knowledge by sorting examples.",
        instruction: "Sort each noun into People, Places, Animals, or Things.",
        learnerAction: "Sort Teacher, Dog, Park, and Book into the correct bins.",
        choices: ["Teacher", "Dog", "Park", "Book"],
        correctAnswer: "Teacher, Dog, Park, Book sorted correctly",
        manipulatives: ["People bin", "Places bin", "Animals bin", "Things bin", "Teacher", "Dog", "Park", "Book"],
        requiredAction: "sort",
        feedbackCorrect: "All nouns are sorted!",
        feedbackWrong: "Check what each noun names.",
      },
      STAR: {
        feedbackCorrect: "Word Explorer progress added. You learned Nouns!",
      },
      PROGRESS: {
        instruction: "Word Kingdom: 1 / 4 topics completed.",
        learnerAction: "View Word Kingdom topic progress.",
      },
      MASTERED: {
        instruction: "Nouns Mastered!",
        learnerAction: "Unlock Verbs.",
        unlockTarget: "Verbs",
      },
    },
  },
  "grade1-word-kingdom:Verbs": {
    activityType: "action-word-recognition",
    cognitiveFocus: "Recognize action words and match actions to words.",
    fundamentalSkill: "Recognize action words.",
    requiredRenderer: "WordCategorySorterRenderer",
    stageOverrides: {
      LOOK: {
        instruction: "Look at children running, reading, and swimming.",
        audioText: "Verbs are action words.",
        imagePrompt: "animated child running, girl reading, and child swimming",
        manipulatives: ["Run", "Jump", "Read", "Write", "Swim"],
        questionText: "Which words show actions?",
      },
      TAP: {
        instruction: "Tap each action animation.",
        learnerAction: "Tap Run, Jump, Read, Write, and Swim to hear each verb.",
        manipulatives: ["Run animation", "Jump animation", "Read animation", "Write animation", "Swim animation"],
      },
      TRY: {
        instruction: "Which word shows an action?",
        choices: ["Run", "School"],
        correctAnswer: "Run",
      },
      CHOOSE: {
        instruction: "Choose the verb.",
        choices: ["Dog", "Write", "Ball", "Tree"],
        correctAnswer: "Write",
      },
      PLAY: {
        instruction: "Match each action picture to its action word.",
        learnerAction: "Match run, jump, read, write, and swim pictures to the correct verbs.",
        manipulatives: ["action pictures", "verb word cards"],
        requiredAction: "sort",
      },
      MASTERED: {
        learnerAction: "Unlock Adjectives.",
        unlockTarget: "Adjectives",
      },
    },
  },
  "grade1-word-kingdom:Adjectives": {
    activityType: "describing-word-recognition",
    cognitiveFocus: "Recognize words that describe nouns.",
    fundamentalSkill: "Recognize describing words.",
    requiredRenderer: "WordCategorySorterRenderer",
    stageOverrides: {
      LOOK: {
        instruction: "Compare a big elephant, small mouse, tall tree, and short plant.",
        audioText: "Adjectives are describing words.",
        imagePrompt: "big elephant, small mouse, tall tree, and short plant comparison",
        manipulatives: ["Big", "Small", "Tall", "Short", "Happy"],
      },
      TAP: {
        instruction: "Tap each adjective to see what it means.",
        learnerAction: "Tap Big, Small, Tall, Short, and Happy.",
      },
      TRY: {
        instruction: "Choose the describing word.",
        choices: ["Big", "Run"],
        correctAnswer: "Big",
      },
      CHOOSE: {
        instruction: "Which word describes the tree?",
        choices: ["Tall", "Jump", "School"],
        correctAnswer: "Tall",
      },
      PLAY: {
        instruction: "Match each adjective to the picture it describes.",
        learnerAction: "Match big, small, tall, short, and happy to pictures.",
        manipulatives: ["adjective cards", "picture cards"],
        requiredAction: "sort",
      },
      MASTERED: {
        learnerAction: "Unlock Reading Quest.",
        unlockTarget: "Reading Quest",
      },
    },
  },
  "grade1-reading:I": {
    activityType: "sentence-builder",
    cognitiveFocus: "Use I to refer to oneself in a simple sentence.",
    fundamentalSkill: "Understand the pronoun I.",
    requiredRenderer: "SentenceBuilderRenderer",
    stageOverrides: {
      LOOK: {
        instruction: "Look at the child saying, I am happy.",
        passage: "I am happy.",
        questionText: "Who is speaking when the sentence says I?",
      },
      TAP: {
        instruction: "Tap I to hear the word.",
        learnerAction: "Tap the word I in the sentence.",
      },
      TRY: {
        instruction: "Who is I?",
        choices: ["Myself", "Teacher"],
        correctAnswer: "Myself",
      },
      CHOOSE: {
        instruction: "Complete the sentence: ___ play outside.",
        choices: ["I", "Dog"],
        correctAnswer: "I",
      },
      PLAY: {
        instruction: "Build the sentence: I read books.",
        learnerAction: "Put I, read, and books in order.",
        choices: ["I", "read", "books"],
        manipulatives: ["I", "read", "books"],
        requiredAction: "sequence",
      },
      MASTERED: {
        unlockTarget: "You",
      },
    },
  },
};

const GRADE1_TOPIC_BIBLE_SUMMARIES: Record<
  string,
  {
    apply: string;
    examples?: string[];
    knowledge: string;
    renderer: string;
    skill: string;
  }
> = {
  "grade1-word-kingdom:Naming Words": {
    apply: "Choose names of people, places, animals, and things.",
    examples: ["boy", "school", "dog", "book"],
    knowledge: "Naming words tell who or what something is.",
    renderer: "WordCategorySorterRenderer",
    skill: "Recognize naming words.",
  },
  "grade1-word-kingdom:Action Words": {
    apply: "Choose words that show actions.",
    examples: ["run", "jump", "read", "write"],
    knowledge: "Action words tell what someone or something does.",
    renderer: "WordCategorySorterRenderer",
    skill: "Recognize action words.",
  },
  "grade1-word-kingdom:Describing Words": {
    apply: "Choose words that describe people, places, animals, and things.",
    examples: ["big", "small", "tall", "happy"],
    knowledge: "Describing words tell what something is like.",
    renderer: "WordCategorySorterRenderer",
    skill: "Recognize describing words.",
  },
  "grade1-reading:You": {
    apply: "Build a sentence using You.",
    examples: ["You read.", "You play."],
    knowledge: "You talks to another person.",
    renderer: "SentenceBuilderRenderer",
    skill: "Understand the pronoun You.",
  },
  "grade1-reading:We": {
    apply: "Build a group activity sentence using We.",
    examples: ["We sing.", "We play."],
    knowledge: "We means I and others together.",
    renderer: "SentenceBuilderRenderer",
    skill: "Understand the pronoun We.",
  },
  "grade1-reading:See": {
    apply: "Match the sentence I see a bird to the picture.",
    examples: ["I see a bird.", "I see a tree."],
    knowledge: "See tells what the eyes notice.",
    renderer: "SentenceBuilderRenderer",
    skill: "Read and use the word See.",
  },
  "grade1-reading:Go": {
    apply: "Choose the destination in We go to school.",
    examples: ["We go to school.", "We go home."],
    knowledge: "Go means move to a place.",
    renderer: "SentenceBuilderRenderer",
    skill: "Read and use the word Go.",
  },
  "grade1-reading:Come": {
    apply: "Follow the instruction Come here.",
    examples: ["Come here.", "Come with me."],
    knowledge: "Come means move nearer.",
    renderer: "SentenceBuilderRenderer",
    skill: "Read and use the word Come.",
  },
  "grade1-reading:Look": {
    apply: "Find the object in Look at the dog.",
    examples: ["Look at the dog.", "Look at the flower."],
    knowledge: "Look means use your eyes to notice.",
    renderer: "SentenceBuilderRenderer",
    skill: "Read and use the word Look.",
  },
  "grade1-reading:Simple Sentences": {
    apply: "Arrange words into a complete sentence.",
    examples: ["I read books.", "We play outside."],
    knowledge: "A simple sentence tells one complete idea.",
    renderer: "SentenceBuilderRenderer",
    skill: "Build simple sentences.",
  },
  "grade1-reading:Sentence Completion": {
    apply: "Choose the missing word in a sentence.",
    examples: ["I see a ___.", "We go to ___."],
    knowledge: "A missing word can complete a sentence.",
    renderer: "SentenceBuilderRenderer",
    skill: "Complete simple sentences.",
  },
  "grade1-family-story-village:Family Stories": {
    apply: "Arrange the picture story sequence.",
    examples: ["Ana helps her mother cook dinner."],
    knowledge: "A family story tells who did what.",
    renderer: "MiniStoryRenderer",
    skill: "Understand simple family stories.",
  },
  "grade1-family-story-village:Family Sentences": {
    apply: "Arrange words into a family sentence.",
    examples: ["Mother cooks dinner.", "Father reads a book."],
    knowledge: "Family sentences tell about family actions.",
    renderer: "MiniStoryRenderer",
    skill: "Read family-related sentences.",
  },
  "grade1-family-story-village:Story Characters": {
    apply: "Choose the character and the evidence.",
    examples: ["Ana", "Mother", "Father"],
    knowledge: "A character is who the story is about.",
    renderer: "MiniStoryRenderer",
    skill: "Identify story characters.",
  },
  "grade1-family-story-village:Who Did It?": {
    apply: "Choose who performed the action.",
    examples: ["Ana helped.", "Mother cooked."],
    knowledge: "Who did it asks for the person in the story.",
    renderer: "MiniStoryRenderer",
    skill: "Identify who performed an action.",
  },
  "grade1-family-story-village:What Happened?": {
    apply: "Choose the event that happened.",
    examples: ["Ana helped cook.", "The family ate dinner."],
    knowledge: "What happened asks for the event.",
    renderer: "MiniStoryRenderer",
    skill: "Identify a story event.",
  },
  "grade1-number-kingdom:Numbers 1-100": {
    apply: "Identify numbers on a number line.",
    examples: ["24", "47", "83"],
    knowledge: "Numbers can show order and amount.",
    renderer: "NumberLineRenderer",
    skill: "Identify numbers from 1 to 100.",
  },
  "grade1-number-kingdom:Before and After Numbers": {
    apply: "Find before and after on a number line.",
    examples: ["14, 15, 16"],
    knowledge: "Before and after show number order.",
    renderer: "NumberLineRenderer",
    skill: "Find before and after numbers.",
  },
  "grade1-number-kingdom:Greater Than": {
    apply: "Play a number battle challenge.",
    examples: ["5 > 3"],
    knowledge: "Greater than means bigger value.",
    renderer: "NumberLineRenderer",
    skill: "Compare greater numbers.",
  },
  "grade1-number-kingdom:Less Than": {
    apply: "Choose the smaller value in a comparison.",
    examples: ["3 < 5"],
    knowledge: "Less than means smaller value.",
    renderer: "NumberLineRenderer",
    skill: "Compare lesser numbers.",
  },
  "grade1-number-kingdom:Equal To": {
    apply: "Match two values that are the same.",
    examples: ["4 = 4"],
    knowledge: "Equal to means the same value.",
    renderer: "NumberLineRenderer",
    skill: "Identify equal values.",
  },
  "grade1-number-kingdom:Number Order": {
    apply: "Arrange numbers from least to greatest.",
    examples: ["11, 12, 13"],
    knowledge: "Number order follows the counting sequence.",
    renderer: "NumberLineRenderer",
    skill: "Arrange numbers in order.",
  },
  "grade1-math:Addition Facts": {
    apply: "Build an addition tower.",
    examples: ["3 apples + 2 apples"],
    knowledge: "Addition means putting together.",
    renderer: "AddTakeAwayCounterRenderer",
    skill: "Add objects.",
  },
  "grade1-math:Subtraction Facts": {
    apply: "Remove counters and solve the subtraction challenge.",
    examples: ["5 counters - 2 counters"],
    knowledge: "Subtraction means taking away.",
    renderer: "AddTakeAwayCounterRenderer",
    skill: "Subtract objects.",
  },
  "grade1-math:Number Sentences": {
    apply: "Complete an equation.",
    examples: ["3 + 2 = 5"],
    knowledge: "A number sentence shows a math idea.",
    renderer: "AddTakeAwayCounterRenderer",
    skill: "Complete number sentences.",
  },
  "grade1-math:Add with Objects": {
    apply: "Use counters to add.",
    examples: ["4 counters + 1 counter"],
    knowledge: "Objects can help show addition.",
    renderer: "AddTakeAwayCounterRenderer",
    skill: "Add using counters.",
  },
  "grade1-math:Take Away with Objects": {
    apply: "Take counters away to solve.",
    examples: ["6 counters take away 2"],
    knowledge: "Taking away objects shows subtraction.",
    renderer: "AddTakeAwayCounterRenderer",
    skill: "Take away using counters.",
  },
  "grade1-shapes:Circle": {
    apply: "Hunt for circles.",
    examples: ["ball", "clock", "wheel"],
    knowledge: "A circle is round and has no corners.",
    renderer: "ShapePropertyRenderer",
    skill: "Recognize circles.",
  },
  "grade1-shapes:Square": {
    apply: "Find shapes with four equal sides.",
    examples: ["block", "tile"],
    knowledge: "A square has four equal sides.",
    renderer: "ShapePropertyRenderer",
    skill: "Recognize squares.",
  },
  "grade1-shapes:Triangle": {
    apply: "Find shapes with three sides.",
    examples: ["roof", "slice"],
    knowledge: "A triangle has three sides.",
    renderer: "ShapePropertyRenderer",
    skill: "Recognize triangles.",
  },
  "grade1-shapes:Rectangle": {
    apply: "Find long four-sided shapes.",
    examples: ["door", "book"],
    knowledge: "A rectangle has four sides with two long sides.",
    renderer: "ShapePropertyRenderer",
    skill: "Recognize rectangles.",
  },
  "grade1-shapes:Sides and Corners": {
    apply: "Count sides and corners.",
    examples: ["triangle has 3 sides", "square has 4 corners"],
    knowledge: "Shapes have sides and corners.",
    renderer: "ShapePropertyRenderer",
    skill: "Count sides and corners.",
  },
  "grade1-shapes:Real Object Shapes": {
    apply: "Match real objects to shapes.",
    examples: ["clock is circle", "door is rectangle"],
    knowledge: "Real objects can look like shapes.",
    renderer: "ShapePropertyRenderer",
    skill: "Match objects to shapes.",
  },
  "grade1-time-town:Clock": {
    apply: "Identify the clock.",
    examples: ["wall clock", "clock face"],
    knowledge: "A clock helps us know time.",
    renderer: "TimeRenderer",
    skill: "Recognize clocks.",
  },
  "grade1-time-town:Hour": {
    apply: "Read the hour on a clock.",
    examples: ["7 o'clock", "3 o'clock"],
    knowledge: "The hour tells the time.",
    renderer: "TimeRenderer",
    skill: "Read hour time.",
  },
  "grade1-time-town:Morning": {
    apply: "Arrange morning routine in order.",
    examples: ["wake up", "brush teeth", "eat breakfast"],
    knowledge: "Morning happens after waking up.",
    renderer: "TimeRenderer",
    skill: "Recognize morning activities.",
  },
  "grade1-time-town:Afternoon": {
    apply: "Choose afternoon activities.",
    examples: ["eat lunch", "play outside"],
    knowledge: "Afternoon comes after morning.",
    renderer: "TimeRenderer",
    skill: "Recognize afternoon activities.",
  },
  "grade1-time-town:Evening": {
    apply: "Choose evening activities.",
    examples: ["eat dinner", "get ready for bed"],
    knowledge: "Evening comes near night time.",
    renderer: "TimeRenderer",
    skill: "Recognize evening activities.",
  },
  "grade1-time-town:Daily Routine Order": {
    apply: "Sequence day activities.",
    examples: ["morning", "afternoon", "evening"],
    knowledge: "Daily routines happen in order.",
    renderer: "TimeRenderer",
    skill: "Order daily routines.",
  },
};

type Grade1TopicQualityBlueprint = {
  activityType: string;
  chooseAnswer: string;
  chooseChoices: string[];
  chooseHint: string;
  chooseInstruction: string;
  cognitiveFocus: string;
  fundamentalSkill: string;
  knowledge: string;
  lookExamples: string[];
  lookNonExamples: string[];
  playAction: string;
  playAnswer: string;
  playInstruction: string;
  playItems: string[];
  playRequiredAction: FrameworkStageContent["requiredAction"];
  renderer: string;
  tapFacts: string[];
  tryAnswer: string;
  tryChoices: string[];
  tryHint: string;
  tryInstruction: string;
};

function titleCaseGrade1Label(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part)
    .join(" ");
}

function getGrade1TapLabel(topicTitle: string, example: string, blueprint: Grade1TopicQualityBlueprint) {
  const cleanExample = example.replace(/[.!?]+$/g, "").trim();
  const skill = `${topicTitle} ${blueprint.fundamentalSkill}`.toLowerCase();

  if (topicTitle === "Clock") {
    return cleanExample === "wall clock" ? "Clock" : titleCaseGrade1Label(cleanExample);
  }

  if (topicTitle === "Hour") {
    return cleanExample.includes("o'clock") ? titleCaseGrade1Label(cleanExample) : "Hour";
  }

  if (skill.includes("verb") || skill.includes("action") || skill.includes("describing")) {
    return titleCaseGrade1Label(cleanExample.split(/\s+/)[0] ?? cleanExample);
  }

  return titleCaseGrade1Label(cleanExample);
}

function getGrade1TapExampleLine(label: string, example: string, blueprint: Grade1TopicQualityBlueprint) {
  const skill = blueprint.fundamentalSkill.toLowerCase();
  const lowerLabel = label.toLowerCase();
  const cleanExample = example.replace(/[.!?]+$/g, "").trim();

  if (blueprint.activityType === "mixed-word-classification") {
    if (lowerLabel === "dog") {
      return "Dog names an animal.";
    }

    if (lowerLabel === "runs") {
      return "Runs tells an action.";
    }

    if (lowerLabel === "happy") {
      return "Happy describes the dog.";
    }

    return "The sentence has a noun, a verb, and an adjective.";
  }

  if (skill.includes("verb") || skill.includes("action")) {
    return `You can ${lowerLabel}.`;
  }

  if (skill.includes("noun") || skill.includes("naming")) {
    if (lowerLabel === "dog") {
      return "A dog can bark.";
    }

    return `${label} is a real example.`;
  }

  if (skill.includes("describing")) {
    return `${label} describes ${cleanExample.split(/\s+/).slice(1).join(" ") || "something"}.`;
  }

  if (blueprint.renderer === "TimeRenderer" && label === "Clock") {
    return "The hour hand points to the hour.";
  }

  return `Example: ${cleanExample}.`;
}

function getGrade1TapUseLine(topicTitle: string, label: string, blueprint: Grade1TopicQualityBlueprint) {
  const skill = blueprint.fundamentalSkill.toLowerCase();
  const lowerLabel = label.toLowerCase();

  if (blueprint.activityType === "mixed-word-classification") {
    if (lowerLabel === "dog") {
      return "Use dog as the noun.";
    }

    if (lowerLabel === "runs") {
      return "Use runs as the verb.";
    }

    if (lowerLabel === "happy") {
      return "Use happy as the adjective.";
    }

    return "Use each word by checking its job.";
  }

  if (skill.includes("verb") || skill.includes("action")) {
    return `${label} is a verb.`;
  }

  if (skill.includes("noun") || skill.includes("naming")) {
    return `${label} is a noun.`;
  }

  if (skill.includes("describing")) {
    return `${label} is a describing word.`;
  }

  if (topicTitle === "Clock") {
    return "We use clocks every day.";
  }

  if (topicTitle === "Hour") {
    return "The hour hand shows the hour.";
  }

  if (blueprint.renderer === "ShapePropertyRenderer") {
    return `${label} helps name the shape.`;
  }

  if (blueprint.renderer === "NumberLineRenderer" || blueprint.renderer === "AddTakeAwayCounterRenderer") {
    return "Count to check it.";
  }

  return `${label} helps explain ${topicTitle}.`;
}

function buildGrade1TapReveal(topicTitle: string, example: string, fact: string, blueprint: Grade1TopicQualityBlueprint) {
  const label = getGrade1TapLabel(topicTitle, example, blueprint);

  return [
    `${label}|${fact}`,
    getGrade1TapExampleLine(label, example, blueprint),
    getGrade1TapUseLine(topicTitle, label, blueprint),
  ].join("\n");
}

function getGrade1Feedback(topicTitle: string, answer: string, blueprint: Grade1TopicQualityBlueprint) {
  return `${answer} fits because ${blueprint.knowledge}`;
}

const GRADE1_TOPIC_QUALITY_BLUEPRINTS: Record<string, Grade1TopicQualityBlueprint> = {
  "grade1-word-kingdom:Nouns": {
    activityType: "word-classification",
    chooseAnswer: "School",
    chooseChoices: ["School", "Run", "Fast", "Blue"],
    chooseHint: "A place name is a noun.",
    chooseInstruction: "Which word names a place?",
    cognitiveFocus: "Classify naming words by meaning.",
    fundamentalSkill: "Recognize nouns as naming words.",
    knowledge: "A noun names a person, place, animal, or thing.",
    lookExamples: ["boy", "school", "dog", "ball"],
    lookNonExamples: ["run", "fast"],
    playAction: "Sort person, place, animal, and thing nouns into bins.",
    playAnswer: "All noun cards are sorted by what they name.",
    playInstruction: "Sort the noun cards.",
    playItems: ["Teacher", "Park", "Dog", "Book"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Boy names a person.", "School names a place.", "Dog names an animal.", "Ball names a thing."],
    tryAnswer: "Dog",
    tryChoices: ["Dog", "Run"],
    tryHint: "Look for a word that names an animal.",
    tryInstruction: "Which word is a noun?",
  },
  "grade1-word-kingdom:Verbs": {
    activityType: "action-word-recognition",
    chooseAnswer: "Write",
    chooseChoices: ["Dog", "Write", "Ball", "Tree"],
    chooseHint: "An action word tells what someone does.",
    chooseInstruction: "Choose the action word.",
    cognitiveFocus: "Recognize verbs by the action they show.",
    fundamentalSkill: "Recognize verbs as action words.",
    knowledge: "A verb tells what a person, animal, or thing does.",
    lookExamples: ["run", "jump", "read", "write"],
    lookNonExamples: ["school", "blue"],
    playAction: "Match each action picture to its verb card.",
    playAnswer: "Each action picture is matched to the correct verb.",
    playInstruction: "Match actions to words.",
    playItems: ["Run", "Jump", "Read", "Write"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Run is an action.", "Jump is an action.", "Read is an action.", "Write is an action."],
    tryAnswer: "Run",
    tryChoices: ["Run", "School"],
    tryHint: "Look for the word you can act out.",
    tryInstruction: "Which word shows an action?",
  },
  "grade1-word-kingdom:Adjectives": {
    activityType: "describing-word-recognition",
    chooseAnswer: "Tall",
    chooseChoices: ["Tall", "Jump", "School", "Dog"],
    chooseHint: "A describing word tells what the tree is like.",
    chooseInstruction: "Which word describes the tree?",
    cognitiveFocus: "Recognize adjectives by the detail they add to nouns.",
    fundamentalSkill: "Recognize adjectives as describing words.",
    knowledge: "An adjective describes a noun by telling size, color, shape, or feeling.",
    lookExamples: ["big elephant", "small mouse", "tall tree", "happy child"],
    lookNonExamples: ["run", "teacher"],
    playAction: "Match each describing word to the picture it describes.",
    playAnswer: "Each adjective is matched to a picture property.",
    playInstruction: "Match describing words to pictures.",
    playItems: ["Big", "Small", "Tall", "Happy"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Big tells size.", "Small tells size.", "Tall tells height.", "Happy tells feeling."],
    tryAnswer: "Big",
    tryChoices: ["Big", "Run"],
    tryHint: "Look for the word that tells size.",
    tryInstruction: "Choose the describing word.",
  },
  "grade1-word-kingdom:Word Kingdom Mastery Challenge": {
    activityType: "mixed-word-classification",
    chooseAnswer: "Happy",
    chooseChoices: ["Happy", "Dog", "Runs", "School"],
    chooseHint: "An adjective describes a noun.",
    chooseInstruction: "In 'The happy dog runs,' which word is an adjective?",
    cognitiveFocus: "Classify noun, verb, and adjective jobs in one sentence.",
    fundamentalSkill: "Classify word jobs in a sentence.",
    knowledge: "A noun names something, a verb tells an action, and an adjective describes a noun.",
    lookExamples: ["dog", "runs", "happy", "The happy dog runs"],
    lookNonExamples: ["happy names an animal", "dog tells an action"],
    playAction: "Sort sentence words by job: noun, verb, or adjective.",
    playAnswer: "Dog is sorted as a noun, runs as a verb, and happy as an adjective.",
    playInstruction: "Sort the sentence words by job.",
    playItems: ["happy", "dog", "runs"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: [
      "Dog names an animal, so dog is a noun.",
      "Runs tells what the dog does, so runs is a verb.",
      "Happy describes the dog, so happy is an adjective.",
      "The happy dog runs uses all three word jobs.",
    ],
    tryAnswer: "Dog",
    tryChoices: ["Dog", "Runs"],
    tryHint: "Look for the word that names an animal.",
    tryInstruction: "In 'The happy dog runs,' which word is a noun?",
  },
  "grade1-word-kingdom:Naming Words": {
    activityType: "word-classification",
    chooseAnswer: "Book",
    chooseChoices: ["Book", "Jump", "Happy", "Quickly"],
    chooseHint: "A thing name is a naming word.",
    chooseInstruction: "Which word names a thing?",
    cognitiveFocus: "Identify words that name who or what.",
    fundamentalSkill: "Recognize naming words.",
    knowledge: "Naming words tell who or what something is.",
    lookExamples: ["child", "school", "bird", "chair"],
    lookNonExamples: ["jump", "bright"],
    playAction: "Sort naming words into person, place, animal, and thing groups.",
    playAnswer: "Naming words are sorted by who or what they name.",
    playInstruction: "Sort the naming words.",
    playItems: ["Child", "Garden", "Bird", "Chair"],
    playRequiredAction: "sort",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Child names a person.", "Garden names a place.", "Bird names an animal.", "Chair names a thing."],
    tryAnswer: "Teacher",
    tryChoices: ["Teacher", "Clap"],
    tryHint: "Look for a word that names a person.",
    tryInstruction: "Which word is a naming word?",
  },
  "grade1-word-kingdom:Action Words": {
    activityType: "action-word-recognition",
    chooseAnswer: "Sing",
    chooseChoices: ["Sing", "Flower", "Small", "Chair"],
    chooseHint: "Choose the word someone can do.",
    chooseInstruction: "Which word shows an action?",
    cognitiveFocus: "Connect action words to movements and jobs.",
    fundamentalSkill: "Recognize action words.",
    knowledge: "Action words tell what someone or something does.",
    lookExamples: ["run", "jump", "write", "read"],
    lookNonExamples: ["book", "green"],
    playAction: "Drag each action picture to its action word.",
    playAnswer: "Each movement is matched to its action word.",
    playInstruction: "Match the action pictures.",
    playItems: ["Run", "Jump", "Write", "Read"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Run is something legs can do.", "Jump is an action.", "Write is something hands can do.", "Read is something eyes and voice can do."],
    tryAnswer: "Jump",
    tryChoices: ["Jump", "Pencil"],
    tryHint: "Look for the word you can act out.",
    tryInstruction: "Choose the action word.",
  },
  "grade1-word-kingdom:Describing Words": {
    activityType: "describing-word-recognition",
    chooseAnswer: "Bright",
    chooseChoices: ["Bright", "Run", "Teacher", "River"],
    chooseHint: "Choose the word that tells what the flower is like.",
    chooseInstruction: "Which word describes the flower?",
    cognitiveFocus: "Use describing words to add meaning to nouns.",
    fundamentalSkill: "Recognize describing words.",
    knowledge: "Describing words tell what a person, place, animal, or thing is like.",
    lookExamples: ["bright flower", "long rope", "quiet room", "heavy bag"],
    lookNonExamples: ["jump", "market"],
    playAction: "Build short noun phrases with a describing word and a noun.",
    playAnswer: "Each noun phrase uses a describing word that fits the noun.",
    playInstruction: "Build describing phrases.",
    playItems: ["bright flower", "long rope", "quiet room", "heavy bag"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Bright tells how a flower looks.", "Long tells length.", "Quiet tells sound.", "Heavy tells weight."],
    tryAnswer: "Soft",
    tryChoices: ["Soft", "Swim"],
    tryHint: "Look for the word that tells how something feels.",
    tryInstruction: "Choose the describing word.",
  },
  "grade1-word-kingdom:Opposite Words": {
    activityType: "word-relationship",
    chooseAnswer: "Cold",
    chooseChoices: ["Cold", "Big", "Happy", "Fast"],
    chooseHint: "Hot and cold are opposites.",
    chooseInstruction: "Which word is the opposite of hot?",
    cognitiveFocus: "Recognize common opposite word pairs.",
    fundamentalSkill: "Understand opposite meanings.",
    knowledge: "Opposite words have different meanings.",
    lookExamples: ["big", "small", "hot", "cold"],
    lookNonExamples: ["large", "glad"],
    playAction: "Drag each picture to the word with the opposite meaning clue.",
    playAnswer: "Each opposite picture is matched to the correct word.",
    playInstruction: "Match opposite pictures to words.",
    playItems: ["Big", "Small", "Hot", "Cold"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Big and small are opposites.", "Hot and cold are opposites.", "Happy and sad are opposites.", "Open and close are opposites."],
    tryAnswer: "Small",
    tryChoices: ["Small", "Large"],
    tryHint: "Think of the word that means not big.",
    tryInstruction: "Which word is the opposite of big?",
  },
  "grade1-word-kingdom:Similar Words": {
    activityType: "word-relationship",
    chooseAnswer: "Large",
    chooseChoices: ["Large", "Small", "Cold", "Sad"],
    chooseHint: "Big and large mean almost the same thing.",
    chooseInstruction: "Which word is similar to big?",
    cognitiveFocus: "Recognize common Grade 1 similar meanings.",
    fundamentalSkill: "Understand similar word meanings.",
    knowledge: "Similar words mean almost the same thing.",
    lookExamples: ["big", "large", "happy", "glad"],
    lookNonExamples: ["cold", "sad"],
    playAction: "Drag each picture to a word with a similar meaning.",
    playAnswer: "Each picture is matched to a similar word.",
    playInstruction: "Match similar word pictures.",
    playItems: ["Large", "Glad", "Small", "Fast"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Big and large are similar.", "Happy and glad are similar.", "Tiny and small are similar.", "Quick and fast are similar."],
    tryAnswer: "Glad",
    tryChoices: ["Glad", "Sad"],
    tryHint: "Think of a word like happy.",
    tryInstruction: "Which word is similar to happy?",
  },
  "grade1-word-kingdom:Word Challenge": {
    activityType: "mixed-word-application",
    chooseAnswer: "Run",
    chooseChoices: ["Run", "Teacher", "Big", "Small"],
    chooseHint: "Run is an action word.",
    chooseInstruction: "Which word shows an action?",
    cognitiveFocus: "Apply known naming, action, describing, opposite, and similar words.",
    fundamentalSkill: "Use known Grade 1 word meanings.",
    knowledge: "Known words can name, show actions, describe, or relate by meaning.",
    lookExamples: ["teacher", "run", "big", "small"],
    lookNonExamples: ["unknown word", "random mark"],
    playAction: "Drag each mixed picture to the word it shows.",
    playAnswer: "Each mixed picture is matched to the correct known word.",
    playInstruction: "Match the mixed word pictures.",
    playItems: ["Teacher", "Run", "Big", "Small"],
    playRequiredAction: "drag",
    renderer: "WordCategorySorterRenderer",
    tapFacts: ["Teacher is a naming word.", "Run is an action word.", "Big describes size.", "Small is the opposite of big."],
    tryAnswer: "Market",
    tryChoices: ["Market", "Jump"],
    tryHint: "Look for a word that names a place.",
    tryInstruction: "Which word names a place?",
  },
  "grade1-reading:Picture Read": {
    activityType: "picture-label-reading",
    chooseAnswer: "Toy",
    chooseChoices: ["Boy", "Girl", "Toy", "Tree"],
    chooseHint: "Look at the picture first, then choose the matching label.",
    chooseInstruction: "The picture shows a toy. Which label matches it?",
    cognitiveFocus: "Read simple picture clues and connect each image to its label.",
    fundamentalSkill: "Use pictures to read familiar words.",
    knowledge: "Picture reading means using what you see in a picture to understand and read the matching word.",
    lookExamples: ["boy", "girl", "toy", "tree"],
    lookNonExamples: ["run", "blue"],
    playAction: "Drag each picture to its matching word label.",
    playAnswer: "Boy, Girl, Toy, and Tree are matched to their pictures.",
    playInstruction: "Match pictures to words.",
    playItems: ["Boy", "Girl", "Toy", "Tree"],
    playRequiredAction: "drag",
    renderer: "SentenceBuilderRenderer",
    tapFacts: [
      "Boy is a picture of a child.",
      "Girl is a picture of a child.",
      "Toy is something a child can play with.",
      "Tree is a tall plant with leaves.",
    ],
    tryAnswer: "Picture clue",
    tryChoices: ["Picture clue", "Topic name"],
    tryHint: "A picture clue helps you know the word.",
    tryInstruction: "What helps us read Boy, Girl, Toy, and Tree?",
  },
  "grade1-reading:Easy Word": {
    activityType: "easy-word-picture-match",
    chooseAnswer: "Dog",
    chooseChoices: ["Dog", "Jump", "Blue", "Fast"],
    chooseHint: "Read the simple word and check the picture.",
    chooseInstruction: "Which word matches the dog picture?",
    cognitiveFocus: "Read short familiar words with picture support.",
    fundamentalSkill: "Read easy words with picture clues.",
    knowledge: "Easy words are short familiar words that can be read with picture support.",
    lookExamples: ["dog", "cat", "sun", "book"],
    lookNonExamples: ["running fast", "the big animal"],
    playAction: "Drag each easy word to the picture it names.",
    playAnswer: "Dog, Cat, Sun, and Book are matched to their pictures.",
    playInstruction: "Match easy words to pictures.",
    playItems: ["Dog", "Cat", "Sun", "Book"],
    playRequiredAction: "drag",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Dog names an animal.", "Cat names an animal.", "Sun names what shines in the sky.", "Book names something we read."],
    tryAnswer: "Dog",
    tryChoices: ["Dog", "Run"],
    tryHint: "Look for the word that names the animal.",
    tryInstruction: "Which easy word names the animal?",
  },
  "grade1-reading:Sight Word": {
    activityType: "sight-word-recognition",
    chooseAnswer: "the",
    chooseChoices: ["I", "the", "dog", "jump"],
    chooseHint: "Sight words are common words we learn to read quickly.",
    chooseInstruction: "Choose the sight word in the sentence: The boy has a toy.",
    cognitiveFocus: "Recognize common sight words inside simple sentences.",
    fundamentalSkill: "Read common sight words.",
    knowledge: "Sight words are common words readers recognize quickly, such as I, a, the, is, and see.",
    lookExamples: ["I", "a", "the", "is", "see"],
    lookNonExamples: ["elephant", "playground"],
    playAction: "Find sight words inside short sentences.",
    playAnswer: "I, a, the, is, and see are found in simple sentences.",
    playInstruction: "Find the sight words.",
    playItems: ["I", "a", "the", "is", "see"],
    playRequiredAction: "tap",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["I names the speaker.", "A means one thing.", "The points to a certain thing.", "Is tells what something is.", "See tells what eyes notice."],
    tryAnswer: "the",
    tryChoices: ["the", "tree"],
    tryHint: "Choose the common little word.",
    tryInstruction: "Which word is a sight word?",
  },
  "grade1-reading:Sentence": {
    activityType: "simple-sentence-builder",
    chooseAnswer: "The boy has a toy.",
    chooseChoices: ["The boy has a toy.", "Toy the boy has", "Boy toy the", "Has the"],
    chooseHint: "A sentence has words in order and tells a complete idea.",
    chooseInstruction: "Which one is a complete sentence?",
    cognitiveFocus: "Build and read one complete idea from ordered words.",
    fundamentalSkill: "Read and build simple sentences.",
    knowledge: "A sentence puts words in order to tell a complete idea.",
    lookExamples: ["The boy has a toy.", "The girl sees a tree.", "I read a book.", "We play outside."],
    lookNonExamples: ["boy toy the", "tree sees girl"],
    playAction: "Arrange word cards to make a complete sentence.",
    playAnswer: "The boy has a toy.",
    playInstruction: "Build the sentence.",
    playItems: ["The", "boy", "has", "a", "toy"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["The boy has a toy tells who and what.", "The girl sees a tree tells one idea.", "Word order helps reading make sense.", "A sentence can be read aloud smoothly."],
    tryAnswer: "The boy has a toy.",
    tryChoices: ["The boy has a toy.", "Toy the boy has"],
    tryHint: "Read the words in speaking order.",
    tryInstruction: "Which words make a sentence?",
  },
  "grade1-reading:Story": {
    activityType: "picture-story-sequence",
    chooseAnswer: "home",
    chooseChoices: ["park", "school", "home", "forest"],
    chooseHint: "Use the story pictures in order.",
    chooseInstruction: "In the last picture, the boy goes ___.",
    cognitiveFocus: "Use picture and sentence clues to understand a short story.",
    fundamentalSkill: "Read a short picture-supported story.",
    knowledge: "A story has events that happen in order from beginning to ending.",
    lookExamples: ["Boy plays at the park.", "Boy sees a toy.", "Boy helps a friend.", "Boy goes home."],
    lookNonExamples: ["home goes boy", "tree is sentence only"],
    playAction: "Arrange four story cards in beginning, middle, and ending order.",
    playAnswer: "Boy plays, sees a toy, helps a friend, and goes home.",
    playInstruction: "Put the story cards in order.",
    playItems: ["Boy plays at the park.", "Boy sees a toy.", "Boy helps a friend.", "Boy goes home."],
    playRequiredAction: "sequence",
    renderer: "MiniStoryRenderer",
    tapFacts: ["The first card starts the story.", "The middle cards tell what happens next.", "The last card ends the story.", "Pictures and words help tell the story."],
    tryAnswer: "park",
    tryChoices: ["park", "school"],
    tryHint: "Look where the story begins.",
    tryInstruction: "Where does the story begin?",
  },
  "grade1-reading:I": {
    activityType: "sentence-builder",
    chooseAnswer: "I",
    chooseChoices: ["I", "Dog", "Blue", "Run"],
    chooseHint: "The speaker uses this word to talk about self.",
    chooseInstruction: "Complete the sentence: ___ play outside.",
    cognitiveFocus: "Use I to name the speaker in a sentence.",
    fundamentalSkill: "Understand the pronoun I.",
    knowledge: "I means the person who is speaking.",
    lookExamples: ["I read.", "I write.", "I play.", "I help."],
    lookNonExamples: ["You read.", "The dog runs."],
    playAction: "Put I, read, and books in order to make a sentence.",
    playAnswer: "I read books.",
    playInstruction: "Build the I sentence.",
    playItems: ["I", "read", "books"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["I names the speaker.", "I comes before an action in many simple sentences.", "I read tells what the speaker does.", "I help tells what the speaker does."],
    tryAnswer: "Myself",
    tryChoices: ["Myself", "Teacher"],
    tryHint: "Think about who is talking.",
    tryInstruction: "Who is I?",
  },
  "grade1-reading:You": {
    activityType: "sentence-builder",
    chooseAnswer: "You",
    chooseChoices: ["You", "Tree", "Happy", "Jump"],
    chooseHint: "This word talks to another person.",
    chooseInstruction: "Complete the sentence: ___ read a book.",
    cognitiveFocus: "Use You to speak to another person.",
    fundamentalSkill: "Understand the pronoun You.",
    knowledge: "You means the person being spoken to.",
    lookExamples: ["You read.", "You play.", "You help.", "You sing."],
    lookNonExamples: ["I read.", "The cat sleeps."],
    playAction: "Build a sentence that tells another person what they do.",
    playAnswer: "You read a book.",
    playInstruction: "Build the You sentence.",
    playItems: ["You", "read", "a book"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["You points to the listener.", "You read tells what the listener does.", "You can start a sentence.", "You is not a thing or action word."],
    tryAnswer: "The listener",
    tryChoices: ["The listener", "A table"],
    tryHint: "Think about the person being talked to.",
    tryInstruction: "Who does You mean?",
  },
  "grade1-reading:We": {
    activityType: "sentence-builder",
    chooseAnswer: "We",
    chooseChoices: ["We", "Book", "Tall", "Swim"],
    chooseHint: "This word means the speaker and others together.",
    chooseInstruction: "Complete the sentence: ___ play together.",
    cognitiveFocus: "Use We for a group that includes the speaker.",
    fundamentalSkill: "Understand the pronoun We.",
    knowledge: "We means I and one or more other people together.",
    lookExamples: ["We read.", "We play.", "We sing.", "We help."],
    lookNonExamples: ["I read.", "The ball rolls."],
    playAction: "Build a group sentence with We and an action.",
    playAnswer: "We play together.",
    playInstruction: "Build the We sentence.",
    playItems: ["We", "play", "together"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["We names a group.", "We includes the speaker.", "We play tells a group action.", "We is not used for one object."],
    tryAnswer: "I and others",
    tryChoices: ["I and others", "One chair"],
    tryHint: "Look for the group meaning.",
    tryInstruction: "What does We mean?",
  },
  "grade1-reading:See": {
    activityType: "picture-sentence-match",
    chooseAnswer: "bird",
    chooseChoices: ["bird", "sleep", "blue", "run"],
    chooseHint: "The sentence names what the eyes notice.",
    chooseInstruction: "In 'I see a bird,' what is seen?",
    cognitiveFocus: "Use See to connect a sentence to something noticed by eyes.",
    fundamentalSkill: "Read and use the word See.",
    knowledge: "See tells what the eyes notice.",
    lookExamples: ["I see a bird.", "I see a tree.", "We see a river.", "You see a dog."],
    lookNonExamples: ["I run fast.", "The book is red."],
    playAction: "Match each See sentence to the picture it names.",
    playAnswer: "Each sentence is matched to the seen object.",
    playInstruction: "Match See sentences to pictures.",
    playItems: ["I see a bird.", "I see a tree.", "We see a river."],
    playRequiredAction: "sort",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["See is about using eyes.", "The word after see can name the object.", "I see a bird means the bird is noticed.", "See helps match sentence to picture."],
    tryAnswer: "Eyes notice something",
    tryChoices: ["Eyes notice something", "Feet move away"],
    tryHint: "Think about what eyes do.",
    tryInstruction: "What does See tell?",
  },
  "grade1-reading:Go": {
    activityType: "direction-sentence-builder",
    chooseAnswer: "school",
    chooseChoices: ["school", "eat", "round", "pencil"],
    chooseHint: "Go points to a place or direction.",
    chooseInstruction: "In 'We go to school,' where do we go?",
    cognitiveFocus: "Use Go to tell movement toward a place.",
    fundamentalSkill: "Read and use the word Go.",
    knowledge: "Go means move from one place to another.",
    lookExamples: ["Go to school.", "Go home.", "Go outside.", "Go to the garden."],
    lookNonExamples: ["Sit here.", "The flower is yellow."],
    playAction: "Build Go sentences by matching people to destinations.",
    playAnswer: "Each Go sentence has a destination that fits.",
    playInstruction: "Build Go sentences.",
    playItems: ["Go", "to", "school", "home", "outside"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Go shows movement.", "Go to school names a destination.", "Go home tells where to move.", "Go is an action word in a sentence."],
    tryAnswer: "move to a place",
    tryChoices: ["move to a place", "name a color"],
    tryHint: "Look for movement.",
    tryInstruction: "What does Go mean?",
  },
  "grade1-reading:Come": {
    activityType: "command-sentence-builder",
    chooseAnswer: "nearer",
    chooseChoices: ["nearer", "smaller", "yellow", "sleepy"],
    chooseHint: "Come moves toward the speaker.",
    chooseInstruction: "Come here means move ____.",
    cognitiveFocus: "Use Come to understand movement toward someone.",
    fundamentalSkill: "Read and use the word Come.",
    knowledge: "Come means move nearer to the speaker or place.",
    lookExamples: ["Come here.", "Come with me.", "Come inside.", "Come to class."],
    lookNonExamples: ["Go away.", "The ball is round."],
    playAction: "Build Come command sentences in the right word order.",
    playAnswer: "Come here.",
    playInstruction: "Build Come commands.",
    playItems: ["Come", "here", "Come", "inside"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Come here means move closer.", "Come inside names a place to move into.", "Come with me gives a friendly command.", "Come is not a naming word."],
    tryAnswer: "Move closer",
    tryChoices: ["Move closer", "Name an animal"],
    tryHint: "Think about moving toward someone.",
    tryInstruction: "What does Come mean?",
  },
  "grade1-reading:Look": {
    activityType: "sentence-object-finder",
    chooseAnswer: "dog",
    chooseChoices: ["dog", "jump", "quiet", "school"],
    chooseHint: "Look at tells which object needs your eyes.",
    chooseInstruction: "In 'Look at the dog,' what should you look at?",
    cognitiveFocus: "Use Look to focus attention on a named object.",
    fundamentalSkill: "Read and use the word Look.",
    knowledge: "Look means use your eyes with attention.",
    lookExamples: ["Look at the dog.", "Look at the flower.", "Look at the clock.", "Look at the tree."],
    lookNonExamples: ["Close your eyes.", "The child runs."],
    playAction: "Read each Look sentence and tap the named object.",
    playAnswer: "Each Look sentence points to the correct object.",
    playInstruction: "Find what the sentence says to look at.",
    playItems: ["dog", "flower", "clock", "tree"],
    playRequiredAction: "tap",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Look asks the eyes to focus.", "Look at the dog points to dog.", "Look at the clock points to clock.", "Look is used before the thing to notice."],
    tryAnswer: "Use your eyes",
    tryChoices: ["Use your eyes", "Use your feet"],
    tryHint: "Think about the body part that looks.",
    tryInstruction: "What does Look ask you to do?",
  },
  "grade1-reading:Simple Sentences": {
    activityType: "sentence-builder",
    chooseAnswer: "The dog runs.",
    chooseChoices: ["The dog runs.", "Dog the runs", "The happy", "Runs"],
    chooseHint: "A sentence has words in order and tells a complete idea.",
    chooseInstruction: "Which one is a complete simple sentence?",
    cognitiveFocus: "Build sentences that tell one complete idea.",
    fundamentalSkill: "Build simple sentences.",
    knowledge: "A simple sentence tells one complete idea with a who or what and an action or description.",
    lookExamples: ["I read books.", "You play outside.", "The dog runs.", "The flower grows."],
    lookNonExamples: ["book table", "the happy"],
    playAction: "Put word cards in order to make a complete sentence.",
    playAnswer: "The dog runs.",
    playInstruction: "Build a simple sentence.",
    playItems: ["The", "dog", "runs"],
    playRequiredAction: "sequence",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["The dog runs tells who and what happens.", "I read books tells one complete idea.", "Word order helps a sentence make sense.", "A sentence can be read aloud smoothly."],
    tryAnswer: "I read.",
    tryChoices: ["I read.", "Read I"],
    tryHint: "Choose the words in speaking order.",
    tryInstruction: "Which words make a sentence?",
  },
  "grade1-reading:Sentence Completion": {
    activityType: "missing-word-builder",
    chooseAnswer: "book",
    chooseChoices: ["book", "run", "happy", "under"],
    chooseHint: "The missing word should name something that can be read.",
    chooseInstruction: "Complete the sentence: You read a ___.",
    cognitiveFocus: "Use meaning to choose a missing word.",
    fundamentalSkill: "Complete simple sentences.",
    knowledge: "A missing word must fit the sentence meaning and word order.",
    lookExamples: ["I see a ___.", "We go to ___.", "You read a ___.", "The dog can ___."],
    lookNonExamples: ["I see a run.", "You read a jump."],
    playAction: "Choose missing words that make each sentence make sense.",
    playAnswer: "Each sentence is completed with a word that fits its meaning.",
    playInstruction: "Complete the sentences.",
    playItems: ["I see a bird.", "We go to school.", "You read a book."],
    playRequiredAction: "choose",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["A missing noun can name the thing seen.", "A missing place can finish where someone goes.", "A missing action can tell what a dog can do.", "Read the whole sentence to check the word."],
    tryAnswer: "bird",
    tryChoices: ["bird", "sleep"],
    tryHint: "Choose a thing that can be seen.",
    tryInstruction: "Complete: I see a ___.",
  },
  "grade1-family-story-village:Family Stories": {
    activityType: "family-story-sequencer",
    chooseAnswer: "Ana helped Mother cook soup.",
    chooseChoices: ["Ana helped Mother cook soup.", "Ana flew to the moon.", "The chair sang loudly.", "The pencil ate lunch."],
    chooseHint: "Choose the event that belongs in the family story.",
    chooseInstruction: "What happened in the story?",
    cognitiveFocus: "Understand a short family story with characters and events.",
    fundamentalSkill: "Understand simple family stories.",
    knowledge: "A family story tells who is in the story, what they do, and what happens next.",
    lookExamples: ["Ana helped Mother cook soup.", "Mother stirred the pot.", "The family ate together.", "Ana smiled."],
    lookNonExamples: ["word pile", "random action"],
    playAction: "Put the family story events in first, next, and last order.",
    playAnswer: "Ana helped, Mother cooked, and the family ate.",
    playInstruction: "Sequence the family story.",
    playItems: ["Ana helped Mother.", "Mother cooked soup.", "The family ate together."],
    playRequiredAction: "sequence",
    renderer: "MiniStoryRenderer",
    tapFacts: ["Ana is a character.", "Helped tells what Ana did.", "Cooked soup is an event.", "Stories have events in order."],
    tryAnswer: "Ana helped Mother.",
    tryChoices: ["Ana helped Mother.", "The road sign jumped."],
    tryHint: "Find the family person and action.",
    tryInstruction: "Which event fits the family story?",
  },
  "grade1-family-story-village:Family Sentences": {
    activityType: "family-sentence-builder",
    chooseAnswer: "Mother cooks dinner.",
    chooseChoices: ["Mother cooks dinner.", "Dinner mother cooks", "Cooks", "The blue"],
    chooseHint: "A family sentence tells who and what action.",
    chooseInstruction: "Which sentence tells a complete family action?",
    cognitiveFocus: "Read family sentences for who and action.",
    fundamentalSkill: "Read family-related sentences.",
    knowledge: "A family sentence tells about a family person and an action.",
    lookExamples: ["Mother cooks rice.", "Father reads a book.", "Ate helps baby.", "Lola waters plants."],
    lookNonExamples: ["mother rice", "helps baby ate"],
    playAction: "Build family sentences in correct word order.",
    playAnswer: "Mother cooks dinner.",
    playInstruction: "Build family sentences.",
    playItems: ["Mother", "cooks", "dinner"],
    playRequiredAction: "sequence",
    renderer: "MiniStoryRenderer",
    tapFacts: ["Mother tells who.", "Cooks tells the action.", "Dinner tells what is cooked.", "Word order makes the sentence clear."],
    tryAnswer: "Father reads.",
    tryChoices: ["Father reads.", "Reads father"],
    tryHint: "Choose the sentence in speaking order.",
    tryInstruction: "Which family sentence makes sense?",
  },
  "grade1-family-story-village:Story Characters": {
    activityType: "character-detective",
    chooseAnswer: "Ana",
    chooseChoices: ["Ana", "cooked soup", "kitchen", "happy"],
    chooseHint: "A character is a who, not an action or place.",
    chooseInstruction: "Who is the character in the story?",
    cognitiveFocus: "Identify who a story is about.",
    fundamentalSkill: "Identify story characters.",
    knowledge: "A story character is a person, animal, or being who does something in the story.",
    lookExamples: ["Ana", "Mother", "Father", "Baby"],
    lookNonExamples: ["cooked soup", "in the kitchen"],
    playAction: "Tap the character card and match it to the action from the story.",
    playAnswer: "The character is matched to the action they did.",
    playInstruction: "Find the story character.",
    playItems: ["Ana", "Mother", "Father", "Baby"],
    playRequiredAction: "tap",
    renderer: "MiniStoryRenderer",
    tapFacts: ["Ana is a person in the story.", "Mother can be a character.", "A character can do an action.", "An action is not the character."],
    tryAnswer: "Mother",
    tryChoices: ["Mother", "washed cup"],
    tryHint: "Look for who did something.",
    tryInstruction: "Which choice names a character?",
  },
  "grade1-family-story-village:Who Did It?": {
    activityType: "who-did-it-detective",
    chooseAnswer: "Ben",
    chooseChoices: ["Ben", "shared bread", "table", "soft"],
    chooseHint: "Who asks for the person.",
    chooseInstruction: "Ben shared bread. Who did it?",
    cognitiveFocus: "Use story evidence to identify the doer of an action.",
    fundamentalSkill: "Identify who performed an action.",
    knowledge: "Who did it asks which character performed the action.",
    lookExamples: ["Ana helped Mother.", "Ben shared bread.", "Mia watered flowers.", "Rafa packed a bag."],
    lookNonExamples: ["shared bread", "after lunch"],
    playAction: "Match each action to the character who did it.",
    playAnswer: "Each character is matched to the action in the story.",
    playInstruction: "Match who did each action.",
    playItems: ["Ana helped", "Ben shared", "Mia watered", "Rafa packed"],
    playRequiredAction: "sort",
    renderer: "MiniStoryRenderer",
    tapFacts: ["Who asks for a person.", "Ben is the doer in Ben shared bread.", "Shared bread is the action.", "Use the sentence as evidence."],
    tryAnswer: "Ana",
    tryChoices: ["Ana", "helped Mother"],
    tryHint: "Choose the person, not the action.",
    tryInstruction: "Ana helped Mother. Who did it?",
  },
  "grade1-family-story-village:What Happened?": {
    activityType: "event-detective",
    chooseAnswer: "Mia watered flowers.",
    chooseChoices: ["Mia watered flowers.", "Mia", "garden", "green"],
    chooseHint: "What happened asks for the event or action.",
    chooseInstruction: "What happened in the story?",
    cognitiveFocus: "Use story evidence to identify the event.",
    fundamentalSkill: "Identify a story event.",
    knowledge: "What happened asks for the event or action in the story.",
    lookExamples: ["Ana cooked soup.", "Ben shared bread.", "Mia watered flowers.", "Tala fed the cat."],
    lookNonExamples: ["Ana", "in the kitchen"],
    playAction: "Choose event cards that match the story pictures.",
    playAnswer: "Each story picture is matched to the event that happened.",
    playInstruction: "Match events to story pictures.",
    playItems: ["cooked soup", "shared bread", "watered flowers", "fed the cat"],
    playRequiredAction: "sort",
    renderer: "MiniStoryRenderer",
    tapFacts: ["What happened asks for an action.", "Watered flowers is an event.", "A character alone is not the event.", "Use the story sentence as proof."],
    tryAnswer: "shared bread",
    tryChoices: ["shared bread", "Ben"],
    tryHint: "Choose the action, not only the person.",
    tryInstruction: "Ben shared bread. What happened?",
  },
  "grade1-number-kingdom:Numbers 1-100": {
    activityType: "hundred-chart-builder",
    chooseAnswer: "47",
    chooseChoices: ["47", "74", "40 + 70", "four"],
    chooseHint: "Use the tens digit and ones digit.",
    chooseInstruction: "Which numeral shows forty-seven?",
    cognitiveFocus: "Connect numerals from 1 to 100 with quantity and order.",
    fundamentalSkill: "Identify numbers from 1 to 100.",
    knowledge: "Numbers from 1 to 100 show how many and where a count sits in order.",
    lookExamples: ["10 sticks", "23 beads", "47 dots", "100 cubes"],
    lookNonExamples: ["uncounted pile", "letter B"],
    playAction: "Build numbers on a hundred chart by tens and ones.",
    playAnswer: "The target numbers are placed on the hundred chart.",
    playInstruction: "Build numbers on the hundred chart.",
    playItems: ["23", "47", "68", "100"],
    playRequiredAction: "sequence",
    renderer: "NumberLineRenderer",
    tapFacts: ["23 has 2 tens and 3 ones.", "47 comes after 46.", "100 is the last number on a hundred chart.", "Counting order helps find each number."],
    tryAnswer: "23",
    tryChoices: ["23", "32"],
    tryHint: "Look for 2 tens and 3 ones.",
    tryInstruction: "Which number shows twenty-three?",
  },
  "grade1-number-kingdom:Before and After Numbers": {
    activityType: "before-after-train",
    chooseAnswer: "16",
    chooseChoices: ["16", "14", "15", "51"],
    chooseHint: "After means the next number when counting forward.",
    chooseInstruction: "What number comes after 15?",
    cognitiveFocus: "Use counting order to find before and after.",
    fundamentalSkill: "Find before and after numbers.",
    knowledge: "Before is one less; after is one more in counting order.",
    lookExamples: ["14, 15, 16", "21, 22, 23", "48, 49, 50", "98, 99, 100"],
    lookNonExamples: ["15, 14, 16", "22, 22, 23"],
    playAction: "Place before, target, and after number cards on a train.",
    playAnswer: "The train shows before, target, and after in order.",
    playInstruction: "Build the before-after train.",
    playItems: ["14", "15", "16"],
    playRequiredAction: "sequence",
    renderer: "NumberLineRenderer",
    tapFacts: ["14 is before 15.", "16 is after 15.", "Before moves back one.", "After moves forward one."],
    tryAnswer: "14",
    tryChoices: ["14", "16"],
    tryHint: "Before means count back one.",
    tryInstruction: "What number comes before 15?",
  },
  "grade1-number-kingdom:Greater Than": {
    activityType: "number-battle",
    chooseAnswer: "28",
    chooseChoices: ["28", "19", "equal", "12"],
    chooseHint: "Greater means the larger quantity.",
    chooseInstruction: "Which number is greater than 19?",
    cognitiveFocus: "Compare numbers by quantity.",
    fundamentalSkill: "Compare greater numbers.",
    knowledge: "Greater than means a number has a bigger value or quantity.",
    lookExamples: ["9 is greater than 4", "15 is greater than 12", "28 is greater than 19", "100 is greater than 99"],
    lookNonExamples: ["3 is greater than 7", "12 equals 15"],
    playAction: "Compare two number groups and choose the greater value.",
    playAnswer: "The larger quantity wins each comparison.",
    playInstruction: "Choose the greater number.",
    playItems: ["9 vs 4", "28 vs 19", "100 vs 99"],
    playRequiredAction: "choose",
    renderer: "NumberLineRenderer",
    tapFacts: ["28 is greater than 19 because it is farther along the count.", "9 has more than 4.", "100 comes after 99.", "Greater means more."],
    tryAnswer: "9",
    tryChoices: ["9", "4"],
    tryHint: "Choose the number with more.",
    tryInstruction: "Which number is greater?",
  },
  "grade1-number-kingdom:Less Than": {
    activityType: "smaller-number-path",
    chooseAnswer: "24",
    chooseChoices: ["24", "29", "equal", "42"],
    chooseHint: "Less means the smaller quantity.",
    chooseInstruction: "Which number is less than 29?",
    cognitiveFocus: "Compare numbers by finding the smaller quantity.",
    fundamentalSkill: "Compare lesser numbers.",
    knowledge: "Less than means a number has a smaller value or quantity.",
    lookExamples: ["3 is less than 7", "24 is less than 29", "64 is less than 69", "97 is less than 100"],
    lookNonExamples: ["9 is less than 4", "15 equals 12"],
    playAction: "Compare two number groups and choose the lesser value.",
    playAnswer: "The smaller quantity is selected for each pair.",
    playInstruction: "Choose the lesser number.",
    playItems: ["3 vs 7", "24 vs 29", "97 vs 100"],
    playRequiredAction: "choose",
    renderer: "NumberLineRenderer",
    tapFacts: ["24 is less than 29 because it comes earlier.", "3 has fewer than 7.", "97 comes before 100.", "Less means fewer or smaller."],
    tryAnswer: "3",
    tryChoices: ["3", "7"],
    tryHint: "Choose the number with fewer.",
    tryInstruction: "Which number is less?",
  },
  "grade1-number-kingdom:Equal To": {
    activityType: "equal-balance-scale",
    chooseAnswer: "8 and 8",
    chooseChoices: ["8 and 8", "8 and 6", "7 and 9", "10 and 1"],
    chooseHint: "Equal means the same amount on both sides.",
    chooseInstruction: "Which pair is equal?",
    cognitiveFocus: "Recognize equal quantities.",
    fundamentalSkill: "Identify equal values.",
    knowledge: "Equal to means two values or groups are the same amount.",
    lookExamples: ["4 counters and 4 counters", "8 blocks and 8 blocks", "12 shells and 12 shells", "30 sticks and 30 sticks"],
    lookNonExamples: ["4 and 5", "8 and 6"],
    playAction: "Balance two groups by matching equal amounts.",
    playAnswer: "Both sides show the same quantity.",
    playInstruction: "Make the groups equal.",
    playItems: ["4 and 4", "8 and 8", "12 and 12"],
    playRequiredAction: "count",
    renderer: "NumberLineRenderer",
    tapFacts: ["4 and 4 are equal.", "8 and 6 are not equal.", "Equal groups have the same count.", "Counting both sides proves equality."],
    tryAnswer: "4 and 4",
    tryChoices: ["4 and 4", "4 and 5"],
    tryHint: "Count both groups and check if they match.",
    tryInstruction: "Which groups are equal?",
  },
  "grade1-number-kingdom:Number Order": {
    activityType: "number-order-train",
    chooseAnswer: "25, 26, 27",
    chooseChoices: ["25, 26, 27", "27, 25, 26", "25, 27, 26", "26, 25, 27"],
    chooseHint: "Count forward one number at a time.",
    chooseInstruction: "Which numbers are in order?",
    cognitiveFocus: "Arrange numbers by counting sequence.",
    fundamentalSkill: "Arrange numbers in order.",
    knowledge: "Number order follows the counting sequence from smaller to larger.",
    lookExamples: ["11, 12, 13", "18, 19, 20", "40, 41, 42", "98, 99, 100"],
    lookNonExamples: ["13, 11, 12", "20, 18, 19"],
    playAction: "Drag number cards into counting order.",
    playAnswer: "The numbers are ordered from least to greatest.",
    playInstruction: "Put numbers in order.",
    playItems: ["25", "26", "27"],
    playRequiredAction: "sequence",
    renderer: "NumberLineRenderer",
    tapFacts: ["25 comes before 26.", "26 comes before 27.", "Counting forward checks order.", "A number line can prove the order."],
    tryAnswer: "11, 12, 13",
    tryChoices: ["11, 12, 13", "13, 12, 11"],
    tryHint: "Choose the order you say when counting forward.",
    tryInstruction: "Which list is in counting order?",
  },
  "grade1-math:Addition Facts": {
    activityType: "addition-tower-builder",
    chooseAnswer: "5",
    chooseChoices: ["5", "1", "6", "2"],
    chooseHint: "Count all objects after the groups join.",
    chooseInstruction: "3 apples plus 2 apples equals ___.",
    cognitiveFocus: "Use objects to understand addition facts.",
    fundamentalSkill: "Add objects.",
    knowledge: "Addition means putting groups together and counting the total.",
    lookExamples: ["2 apples + 3 apples", "4 shells + 1 shell", "5 blocks + 2 blocks", "8 cups + 2 cups"],
    lookNonExamples: ["5 apples - 2 apples", "uncounted pile"],
    playAction: "Move two groups together, then count the total.",
    playAnswer: "The joined groups are counted to find the sum.",
    playInstruction: "Build the addition fact.",
    playItems: ["3 apples", "2 apples", "5 apples"],
    playRequiredAction: "count",
    renderer: "AddTakeAwayCounterRenderer",
    tapFacts: ["3 and 2 make 5.", "The plus sign means join.", "The answer is the total.", "Counting all objects proves the sum."],
    tryAnswer: "5",
    tryChoices: ["5", "3"],
    tryHint: "Count both groups together.",
    tryInstruction: "What is 3 + 2?",
  },
  "grade1-math:Subtraction Facts": {
    activityType: "take-away-counter-mat",
    chooseAnswer: "3",
    chooseChoices: ["3", "7", "2", "5"],
    chooseHint: "Count what remains after taking away.",
    chooseInstruction: "5 apples minus 2 apples equals ___.",
    cognitiveFocus: "Use objects to understand subtraction facts.",
    fundamentalSkill: "Subtract objects.",
    knowledge: "Subtraction means taking away from a group and counting what is left.",
    lookExamples: ["5 apples - 2 apples", "8 blocks - 3 blocks", "10 seeds - 2 seeds", "20 sticks - 10 sticks"],
    lookNonExamples: ["5 apples + 2 apples", "uncounted pile"],
    playAction: "Start with a group, remove some objects, then count what is left.",
    playAnswer: "The remaining objects are counted to find the difference.",
    playInstruction: "Solve the take-away fact.",
    playItems: ["5 apples", "take away 2", "3 left"],
    playRequiredAction: "count",
    renderer: "AddTakeAwayCounterRenderer",
    tapFacts: ["Minus means take away.", "5 take away 2 leaves 3.", "The answer is what is left.", "Objects help show subtraction."],
    tryAnswer: "3",
    tryChoices: ["3", "7"],
    tryHint: "Remove 2, then count the rest.",
    tryInstruction: "What is 5 - 2?",
  },
  "grade1-math:Number Sentences": {
    activityType: "equation-builder",
    chooseAnswer: "3 + 2 = 5",
    chooseChoices: ["3 + 2 = 5", "3 + 2 = 6", "3 - 2 = 5", "5 = 2"],
    chooseHint: "The equation must match the object action.",
    chooseInstruction: "Which number sentence matches 3 apples and 2 more apples?",
    cognitiveFocus: "Connect object actions to equations.",
    fundamentalSkill: "Complete number sentences.",
    knowledge: "A number sentence uses numbers and symbols to show a math idea.",
    lookExamples: ["3 + 2 = 5", "6 - 1 = 5", "4 + 4 = 8", "9 - 3 = 6"],
    lookNonExamples: ["3 + = 5", "3 + 2 = 8"],
    playAction: "Build an equation that matches the counters.",
    playAnswer: "The number sentence matches the model.",
    playInstruction: "Build the number sentence.",
    playItems: ["3", "+", "2", "=", "5"],
    playRequiredAction: "sequence",
    renderer: "AddTakeAwayCounterRenderer",
    tapFacts: ["3 + 2 = 5 shows joining groups.", "6 - 1 = 5 shows taking away.", "The equals sign means same value.", "A number sentence must match the objects."],
    tryAnswer: "3 + 2 = 5",
    tryChoices: ["3 + 2 = 5", "3 + 2 = 4"],
    tryHint: "Count the total after joining.",
    tryInstruction: "Which number sentence is true?",
  },
  "grade1-math:Add with Objects": {
    activityType: "object-addition-simulation",
    chooseAnswer: "5 mangoes",
    chooseChoices: ["5 mangoes", "1 mango", "6 mangoes", "3 mangoes"],
    chooseHint: "Join the groups, then count all mangoes.",
    chooseInstruction: "Put 3 mangoes with 2 mangoes. How many mangoes?",
    cognitiveFocus: "Model addition by joining objects.",
    fundamentalSkill: "Add using counters.",
    knowledge: "Objects can show addition because joined groups make a total.",
    lookExamples: ["put 3 mangoes with 2 mangoes", "join 4 toy cars and 3 toy cars", "combine 5 counters and 4 counters", "add 6 shells to 2 shells"],
    lookNonExamples: ["take 2 away from 5", "mixed uncounted objects"],
    playAction: "Drag objects into one group and count the total.",
    playAnswer: "The joined objects are counted correctly.",
    playInstruction: "Add with objects.",
    playItems: ["3 mangoes", "2 mangoes", "5 mangoes"],
    playRequiredAction: "count",
    renderer: "AddTakeAwayCounterRenderer",
    tapFacts: ["Joining 3 and 2 makes 5.", "Objects make the total visible.", "Addition answers how many in all.", "Count every object once."],
    tryAnswer: "5",
    tryChoices: ["5", "1"],
    tryHint: "Count all objects in the joined group.",
    tryInstruction: "How many are 3 and 2 together?",
  },
  "grade1-math:Take Away with Objects": {
    activityType: "object-subtraction-simulation",
    chooseAnswer: "3 mangoes",
    chooseChoices: ["3 mangoes", "7 mangoes", "2 mangoes", "5 mangoes"],
    chooseHint: "Take some away, then count what remains.",
    chooseInstruction: "Take 2 mangoes from 5 mangoes. How many are left?",
    cognitiveFocus: "Model subtraction by removing objects.",
    fundamentalSkill: "Take away using counters.",
    knowledge: "Taking away objects shows subtraction because the group gets smaller.",
    lookExamples: ["take 2 mangoes from 5 mangoes", "remove 4 counters from 9 counters", "take 1 shell from 6 shells", "give away 2 blocks from 10 blocks"],
    lookNonExamples: ["put 2 with 5", "uncounted objects"],
    playAction: "Remove objects from a group and count what remains.",
    playAnswer: "The remaining objects are counted correctly.",
    playInstruction: "Take away with objects.",
    playItems: ["5 mangoes", "take away 2", "3 left"],
    playRequiredAction: "count",
    renderer: "AddTakeAwayCounterRenderer",
    tapFacts: ["Taking away makes fewer objects.", "5 take away 2 leaves 3.", "Subtraction answers how many are left.", "Count after removing."],
    tryAnswer: "3",
    tryChoices: ["3", "7"],
    tryHint: "Remove the taken objects first.",
    tryInstruction: "How many are left after 5 take away 2?",
  },
  "grade1-shapes:Circle": {
    activityType: "circle-property-hunt",
    chooseAnswer: "wheel",
    chooseChoices: ["wheel", "door", "roof", "book"],
    chooseHint: "A circle is round and has no corners.",
    chooseInstruction: "Which object is shaped like a circle?",
    cognitiveFocus: "Recognize circles by curve and no corners.",
    fundamentalSkill: "Recognize circles.",
    knowledge: "A circle is round, has one curved edge, and has no corners.",
    lookExamples: ["clock face", "wheel", "coin", "plate"],
    lookNonExamples: ["door", "triangle roof"],
    playAction: "Tap objects that are round with no corners.",
    playAnswer: "All circle-shaped objects are selected.",
    playInstruction: "Hunt for circles.",
    playItems: ["clock face", "wheel", "coin", "plate"],
    playRequiredAction: "tap",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A wheel is round.", "A circle has no corners.", "A circle has a curved edge.", "A door is not a circle."],
    tryAnswer: "clock face",
    tryChoices: ["clock face", "book"],
    tryHint: "Look for round with no corners.",
    tryInstruction: "Which object shows a circle?",
  },
  "grade1-shapes:Square": {
    activityType: "square-property-hunt",
    chooseAnswer: "floor tile",
    chooseChoices: ["floor tile", "wheel", "door", "roof"],
    chooseHint: "A square has four equal sides and four corners.",
    chooseInstruction: "Which object can show a square?",
    cognitiveFocus: "Recognize squares by equal sides and corners.",
    fundamentalSkill: "Recognize squares.",
    knowledge: "A square has four equal sides and four corners.",
    lookExamples: ["floor tile", "block face", "window pane", "square cracker"],
    lookNonExamples: ["wheel", "long door"],
    playAction: "Find objects with four equal sides.",
    playAnswer: "Square objects are selected by their sides and corners.",
    playInstruction: "Hunt for squares.",
    playItems: ["floor tile", "block face", "window pane", "square cracker"],
    playRequiredAction: "tap",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A square has 4 sides.", "All square sides are equal.", "A square has 4 corners.", "A wheel has no corners."],
    tryAnswer: "4 equal sides",
    tryChoices: ["4 equal sides", "one curved edge"],
    tryHint: "Count sides and check if they match.",
    tryInstruction: "What property does a square have?",
  },
  "grade1-shapes:Triangle": {
    activityType: "triangle-property-hunt",
    chooseAnswer: "roof",
    chooseChoices: ["roof", "wheel", "door", "plate"],
    chooseHint: "A triangle has three sides and three corners.",
    chooseInstruction: "Which object can show a triangle?",
    cognitiveFocus: "Recognize triangles by three sides and corners.",
    fundamentalSkill: "Recognize triangles.",
    knowledge: "A triangle has three sides and three corners.",
    lookExamples: ["roof", "pizza slice", "flag", "triangle ruler"],
    lookNonExamples: ["wheel", "book"],
    playAction: "Build triangles by connecting three sides.",
    playAnswer: "The triangle has three sides and three corners.",
    playInstruction: "Build and find triangles.",
    playItems: ["roof", "pizza slice", "flag", "triangle ruler"],
    playRequiredAction: "sort",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A triangle has 3 sides.", "A triangle has 3 corners.", "A roof can look triangular.", "A circle is not a triangle."],
    tryAnswer: "3 sides",
    tryChoices: ["3 sides", "4 equal sides"],
    tryHint: "Count the sides.",
    tryInstruction: "What property does a triangle have?",
  },
  "grade1-shapes:Rectangle": {
    activityType: "rectangle-property-hunt",
    chooseAnswer: "door",
    chooseChoices: ["door", "wheel", "pizza slice", "coin"],
    chooseHint: "A rectangle has four sides and four corners, often with two longer sides.",
    chooseInstruction: "Which object can show a rectangle?",
    cognitiveFocus: "Recognize rectangles by four sides and corners.",
    fundamentalSkill: "Recognize rectangles.",
    knowledge: "A rectangle has four sides and four corners; opposite sides match.",
    lookExamples: ["door", "book", "phone", "notebook"],
    lookNonExamples: ["wheel", "triangle ruler"],
    playAction: "Match rectangle objects to the rectangle property card.",
    playAnswer: "Rectangle objects are matched by their four sides and corners.",
    playInstruction: "Hunt for rectangles.",
    playItems: ["door", "book", "phone", "notebook"],
    playRequiredAction: "sort",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A rectangle has 4 sides.", "A rectangle has 4 corners.", "Opposite sides match.", "A door can look like a rectangle."],
    tryAnswer: "4 sides and 4 corners",
    tryChoices: ["4 sides and 4 corners", "round with no corners"],
    tryHint: "Count sides and corners.",
    tryInstruction: "What property does a rectangle have?",
  },
  "grade1-shapes:Sides and Corners": {
    activityType: "shape-attribute-lab",
    chooseAnswer: "3 corners",
    chooseChoices: ["3 corners", "4 corners", "0 corners", "6 corners"],
    chooseHint: "Count the points where sides meet.",
    chooseInstruction: "How many corners does a triangle have?",
    cognitiveFocus: "Count sides and corners to identify shapes.",
    fundamentalSkill: "Count sides and corners.",
    knowledge: "Sides are shape edges; corners are points where sides meet.",
    lookExamples: ["triangle has 3 sides", "square has 4 corners", "rectangle has 4 sides", "circle has no corners"],
    lookNonExamples: ["red shape with wrong sides", "large shape with wrong corners"],
    playAction: "Tap each side and corner, then match the count to the shape.",
    playAnswer: "Each shape is matched to its side and corner counts.",
    playInstruction: "Count sides and corners.",
    playItems: ["triangle", "square", "rectangle", "circle"],
    playRequiredAction: "count",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A side is an edge.", "A corner is where sides meet.", "A triangle has 3 corners.", "A circle has no corners."],
    tryAnswer: "side",
    tryChoices: ["side", "color"],
    tryHint: "Look for the edge of the shape.",
    tryInstruction: "What do we call a shape edge?",
  },
  "grade1-shapes:Real Object Shapes": {
    activityType: "real-object-shape-match",
    chooseAnswer: "clock is circle",
    chooseChoices: ["clock is circle", "door is triangle", "wheel is square", "roof is circle"],
    chooseHint: "Match the object to its shape properties.",
    chooseInstruction: "Which object-shape match is correct?",
    cognitiveFocus: "Recognize shape properties in real objects.",
    fundamentalSkill: "Match objects to shapes.",
    knowledge: "Real objects can look like shapes when their sides, corners, or curves match.",
    lookExamples: ["clock is circle", "door is rectangle", "tile is square", "roof is triangle"],
    lookNonExamples: ["door is circle", "wheel is rectangle"],
    playAction: "Drag real objects to circle, square, triangle, or rectangle mats.",
    playAnswer: "Each object is matched to the shape it looks like.",
    playInstruction: "Match objects to shapes.",
    playItems: ["clock", "door", "tile", "roof"],
    playRequiredAction: "sort",
    renderer: "ShapePropertyRenderer",
    tapFacts: ["A clock face can be a circle.", "A door can be a rectangle.", "A tile can be a square.", "A roof can be a triangle."],
    tryAnswer: "door is rectangle",
    tryChoices: ["door is rectangle", "door is circle"],
    tryHint: "Check sides, corners, and curves.",
    tryInstruction: "Which match is correct?",
  },
  "grade1-time-town:Clock": {
    activityType: "clock-feature-explorer",
    chooseAnswer: "clock",
    chooseChoices: ["clock", "river", "flower", "book"],
    chooseHint: "A clock has hands or numbers that help tell time.",
    chooseInstruction: "Which object helps us know time?",
    cognitiveFocus: "Recognize clocks and their time-telling parts.",
    fundamentalSkill: "Recognize clocks.",
    knowledge: "A clock helps us know time by using numbers and hands.",
    lookExamples: ["wall clock", "clock face", "hour hand", "minute hand"],
    lookNonExamples: ["plate", "storybook"],
    playAction: "Tap clock parts and name what each part does.",
    playAnswer: "Clock parts are identified by their time-telling roles.",
    playInstruction: "Set the clock hour.",
    playItems: ["clock face", "hour hand", "minute hand", "numbers"],
    playRequiredAction: "tap",
    renderer: "TimeRenderer",
    tapFacts: ["The clock face shows numbers.", "The hour hand points to the hour.", "The minute hand helps show minutes.", "A clock helps plan routines."],
    tryAnswer: "hour hand",
    tryChoices: ["hour hand", "tree branch"],
    tryHint: "Look for the clock part that points to the hour.",
    tryInstruction: "Which part helps show the hour?",
  },
  "grade1-time-town:Hour": {
    activityType: "hour-hand-builder",
    chooseAnswer: "3 o'clock",
    chooseChoices: ["3 o'clock", "6 o'clock", "12 o'clock", "9 o'clock"],
    chooseHint: "Read the number where the hour hand points.",
    chooseInstruction: "The hour hand points to 3. What time is it?",
    cognitiveFocus: "Read whole hours on a clock.",
    fundamentalSkill: "Read hour time.",
    knowledge: "The hour tells the time when the hour hand points to a clock number.",
    lookExamples: ["1 o'clock", "3 o'clock", "7 o'clock", "10 o'clock"],
    lookNonExamples: ["morning", "after lunch"],
    playAction: "Set the hour hand to match the time card.",
    playAnswer: "The hour hand points to the requested hour.",
    playInstruction: "Set the clock hour.",
    playItems: ["1 o'clock", "3 o'clock", "7 o'clock"],
    playRequiredAction: "sequence",
    renderer: "TimeRenderer",
    tapFacts: ["3 o'clock means the hour hand points to 3.", "7 o'clock means the hour hand points to 7.", "The short hand often shows the hour.", "Hour times help routines stay in order."],
    tryAnswer: "7 o'clock",
    tryChoices: ["7 o'clock", "2 o'clock"],
    tryHint: "Check the number touched by the hour hand.",
    tryInstruction: "The hour hand points to 7. What time is it?",
  },
  "grade1-time-town:Morning": {
    activityType: "morning-routine-builder",
    chooseAnswer: "eat breakfast",
    chooseChoices: ["eat breakfast", "eat dinner", "sleep at night", "turn off light"],
    chooseHint: "Morning comes after waking up and before lunch.",
    chooseInstruction: "Which activity usually happens in the morning?",
    cognitiveFocus: "Recognize morning by routine sequence.",
    fundamentalSkill: "Recognize morning activities.",
    knowledge: "Morning is the early part of the day when people wake up and start routines.",
    lookExamples: ["wake up", "brush teeth", "eat breakfast", "go to school"],
    lookNonExamples: ["eat dinner", "sleep at night"],
    playAction: "Arrange morning routine cards from waking up to going to school.",
    playAnswer: "Morning activities are placed in routine order.",
    playInstruction: "Build the morning routine.",
    playItems: ["wake up", "brush teeth", "eat breakfast", "go to school"],
    playRequiredAction: "sequence",
    renderer: "TimeRenderer",
    tapFacts: ["Morning starts after waking up.", "Breakfast usually happens in the morning.", "Going to school can happen after breakfast.", "Morning comes before afternoon."],
    tryAnswer: "wake up",
    tryChoices: ["wake up", "eat dinner"],
    tryHint: "Think about the first part of the day.",
    tryInstruction: "Which activity starts a morning routine?",
  },
  "grade1-time-town:Afternoon": {
    activityType: "afternoon-schedule-builder",
    chooseAnswer: "eat lunch",
    chooseChoices: ["eat lunch", "wake up", "sleep at night", "brush teeth before breakfast"],
    chooseHint: "Afternoon comes after morning.",
    chooseInstruction: "Which activity can happen in the afternoon?",
    cognitiveFocus: "Recognize afternoon by sequence after morning.",
    fundamentalSkill: "Recognize afternoon activities.",
    knowledge: "Afternoon comes after morning and often includes lunch, play, homework, or rest.",
    lookExamples: ["eat lunch", "play outside", "do homework", "rest after class"],
    lookNonExamples: ["wake up", "eat dinner at night"],
    playAction: "Place afternoon activities after morning and before evening.",
    playAnswer: "Afternoon activities are placed in the day sequence.",
    playInstruction: "Build the afternoon schedule.",
    playItems: ["eat lunch", "play outside", "do homework", "rest"],
    playRequiredAction: "sequence",
    renderer: "TimeRenderer",
    tapFacts: ["Afternoon comes after morning.", "Lunch can happen in the afternoon.", "Homework can happen after class.", "Afternoon comes before evening."],
    tryAnswer: "play outside",
    tryChoices: ["play outside", "wake up"],
    tryHint: "Choose an activity after morning.",
    tryInstruction: "Which activity fits afternoon?",
  },
  "grade1-time-town:Evening": {
    activityType: "evening-routine-builder",
    chooseAnswer: "eat dinner",
    chooseChoices: ["eat dinner", "go to school in the morning", "eat breakfast", "start class"],
    chooseHint: "Evening comes after afternoon and near bedtime.",
    chooseInstruction: "Which activity usually happens in the evening?",
    cognitiveFocus: "Recognize evening by routine sequence near night.",
    fundamentalSkill: "Recognize evening activities.",
    knowledge: "Evening comes after afternoon and often includes dinner and getting ready for bed.",
    lookExamples: ["eat dinner", "take a bath", "read a story", "sleep"],
    lookNonExamples: ["eat breakfast", "start class"],
    playAction: "Arrange evening routine cards from dinner to bedtime.",
    playAnswer: "Evening activities are placed in routine order.",
    playInstruction: "Build the evening routine.",
    playItems: ["eat dinner", "take a bath", "read a story", "sleep"],
    playRequiredAction: "sequence",
    renderer: "TimeRenderer",
    tapFacts: ["Evening comes after afternoon.", "Dinner often happens in the evening.", "A bedtime story can happen before sleep.", "Evening routines prepare for night."],
    tryAnswer: "read a story",
    tryChoices: ["read a story", "eat breakfast"],
    tryHint: "Choose an activity near bedtime.",
    tryInstruction: "Which activity fits evening?",
  },
  "grade1-time-town:Daily Routine Order": {
    activityType: "daily-routine-builder",
    chooseAnswer: "wake up, eat lunch, eat dinner, sleep",
    chooseChoices: ["wake up, eat lunch, eat dinner, sleep", "sleep, eat lunch, wake up, eat dinner", "eat dinner, wake up, sleep, eat lunch", "eat lunch, sleep, wake up, eat dinner"],
    chooseHint: "Follow the day from morning to night.",
    chooseInstruction: "Which routine is in day order?",
    cognitiveFocus: "Sequence daily routines from morning to night.",
    fundamentalSkill: "Order daily routines.",
    knowledge: "Daily routines happen in time order from morning to afternoon to evening and night.",
    lookExamples: ["wake up", "eat breakfast", "go to school", "eat lunch", "eat dinner", "sleep"],
    lookNonExamples: ["sleep before waking up", "dinner before breakfast"],
    playAction: "Drag routine cards into the order they happen in a day.",
    playAnswer: "The routine follows morning, afternoon, evening, and night.",
    playInstruction: "Build the day routine.",
    playItems: ["wake up", "eat breakfast", "go to school", "eat lunch", "eat dinner", "sleep"],
    playRequiredAction: "sequence",
    renderer: "TimeRenderer",
    tapFacts: ["Wake up starts the day.", "Lunch happens after morning.", "Dinner happens later in the day.", "Sleep usually comes at night."],
    tryAnswer: "wake up first",
    tryChoices: ["wake up first", "sleep first"],
    tryHint: "Think about what begins the day.",
    tryInstruction: "Which comes first in a daily routine?",
  },
  "grade1-nature:River": {
    activityType: "river-feature-explorer",
    chooseAnswer: "flowing water",
    chooseChoices: ["flowing water", "dry mountain peak", "classroom desk", "road sign"],
    chooseHint: "A river is water that moves along a path.",
    chooseInstruction: "Which clue helps you recognize a river?",
    cognitiveFocus: "Use meaning and real-world clues to identify a river.",
    fundamentalSkill: "Understand river vocabulary.",
    knowledge: "A river is a long path of flowing water that can help plants, animals, and people.",
    lookExamples: ["flowing water", "riverbank", "small fish", "bridge"],
    lookNonExamples: ["plastic chair", "dry road"],
    playAction: "Tap river features and match each one to its use.",
    playAnswer: "River features are matched to water, banks, fish, and crossings.",
    playInstruction: "Explore river features.",
    playItems: ["flowing water", "riverbank", "fish", "bridge"],
    playRequiredAction: "tap",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["A river has flowing water.", "A riverbank is land beside a river.", "Fish can live in rivers.", "A bridge can help people cross a river."],
    tryAnswer: "flowing water",
    tryChoices: ["flowing water", "toy car"],
    tryHint: "Look for moving water.",
    tryInstruction: "Which clue fits a river?",
  },
  "grade1-nature:Mountain": {
    activityType: "mountain-feature-hunt",
    chooseAnswer: "rocky slope",
    chooseChoices: ["rocky slope", "flat classroom floor", "plastic chair", "market stall"],
    chooseHint: "A mountain rises high above nearby land.",
    chooseInstruction: "Which clue helps you recognize a mountain?",
    cognitiveFocus: "Use features and location clues to identify a mountain.",
    fundamentalSkill: "Understand mountain vocabulary.",
    knowledge: "A mountain is a high landform with slopes, rocks, trails, and a peak.",
    lookExamples: ["high mountain", "rocky slope", "mountain trail", "cloudy peak"],
    lookNonExamples: ["flat desk", "toy box"],
    playAction: "Match mountain feature cards to the mountain picture.",
    playAnswer: "Mountain features are placed on the mountain model.",
    playInstruction: "Find mountain features.",
    playItems: ["slope", "trail", "rocks", "peak"],
    playRequiredAction: "sort",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["A mountain is high land.", "A slope goes up or down.", "A peak is near the top.", "A trail can go across a mountain."],
    tryAnswer: "high land",
    tryChoices: ["high land", "flowing water"],
    tryHint: "Look for land that rises up.",
    tryInstruction: "Which clue fits a mountain?",
  },
  "grade1-nature:Forest": {
    activityType: "forest-habitat-map",
    chooseAnswer: "many trees",
    chooseChoices: ["many trees", "single clock", "toy bus", "kitchen sink"],
    chooseHint: "A forest has many trees and living things.",
    chooseInstruction: "Which clue helps you recognize a forest?",
    cognitiveFocus: "Use habitat clues to identify a forest.",
    fundamentalSkill: "Understand forest vocabulary.",
    knowledge: "A forest is a place with many trees, plants, shade, and animals.",
    lookExamples: ["many trees", "forest path", "bird nest", "fallen leaves"],
    lookNonExamples: ["empty road", "plastic chair"],
    playAction: "Place plants, animals, and path cards on a forest map.",
    playAnswer: "Forest parts are placed in the habitat map.",
    playInstruction: "Build the forest map.",
    playItems: ["trees", "bird nest", "path", "leaves"],
    playRequiredAction: "sort",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["A forest has many trees.", "Animals can live in a forest.", "Leaves and shade are forest clues.", "A forest is a natural place."],
    tryAnswer: "many trees",
    tryChoices: ["many trees", "road sign"],
    tryHint: "Look for a place with lots of trees.",
    tryInstruction: "Which clue fits a forest?",
  },
  "grade1-nature:Flower": {
    activityType: "flower-parts-explorer",
    chooseAnswer: "petal",
    chooseChoices: ["petal", "wheel", "door", "pencil"],
    chooseHint: "A flower often has petals and a stem.",
    chooseInstruction: "Which part can belong to a flower?",
    cognitiveFocus: "Use parts and uses to identify a flower.",
    fundamentalSkill: "Understand flower vocabulary.",
    knowledge: "A flower is a plant part that often has petals, a stem, and can make seeds or fruit.",
    lookExamples: ["rose", "gumamela", "yellow petal", "green stem"],
    lookNonExamples: ["toy car", "plastic cup"],
    playAction: "Tap flower parts and match each part to its name.",
    playAnswer: "Flower parts are matched to petals, stem, bud, and leaves.",
    playInstruction: "Explore flower parts.",
    playItems: ["petal", "stem", "bud", "leaf"],
    playRequiredAction: "tap",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Petals can be bright.", "A stem holds up the flower.", "A bud can open into a flower.", "Flowers grow on plants."],
    tryAnswer: "petal",
    tryChoices: ["petal", "wheel"],
    tryHint: "Look for a plant part.",
    tryInstruction: "Which part fits a flower?",
  },
  "grade1-nature:Tree": {
    activityType: "tree-parts-builder",
    chooseAnswer: "trunk",
    chooseChoices: ["trunk", "clock hand", "road sign", "toy wheel"],
    chooseHint: "A tree has roots, trunk, branches, and leaves.",
    chooseInstruction: "Which part can belong to a tree?",
    cognitiveFocus: "Use parts and uses to identify a tree.",
    fundamentalSkill: "Understand tree vocabulary.",
    knowledge: "A tree is a tall plant with roots, a trunk, branches, and leaves.",
    lookExamples: ["mango tree", "tree trunk", "green leaves", "tree roots"],
    lookNonExamples: ["plastic chair", "book page"],
    playAction: "Build a tree by placing roots, trunk, branches, and leaves.",
    playAnswer: "Tree parts are placed in the correct positions.",
    playInstruction: "Build the tree.",
    playItems: ["roots", "trunk", "branches", "leaves"],
    playRequiredAction: "sort",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Roots hold the tree in the ground.", "The trunk supports the tree.", "Branches hold leaves.", "Trees can give shade and fruit."],
    tryAnswer: "roots",
    tryChoices: ["roots", "clock numbers"],
    tryHint: "Look for the part that grows underground.",
    tryInstruction: "Which part fits a tree?",
  },
  "grade1-nature:Describing Nature": {
    activityType: "nature-description-builder",
    chooseAnswer: "wide river",
    chooseChoices: ["wide river", "river wide the", "quickly river", "teacher river"],
    chooseHint: "A describing word should tell what the nature object is like.",
    chooseInstruction: "Which phrase describes a river?",
    cognitiveFocus: "Use adjectives to describe nature objects.",
    fundamentalSkill: "Describe nature objects.",
    knowledge: "Nature descriptions use words that tell size, color, shape, sound, or feeling of natural things.",
    lookExamples: ["wide river", "tall mountain", "green forest", "bright flower"],
    lookNonExamples: ["river jump", "tree teacher"],
    playAction: "Build nature phrases by matching describing words to nature nouns.",
    playAnswer: "Each nature noun has a describing word that fits.",
    playInstruction: "Build nature descriptions.",
    playItems: ["wide river", "tall mountain", "green forest", "bright flower"],
    playRequiredAction: "sort",
    renderer: "SentenceBuilderRenderer",
    tapFacts: ["Wide can describe a river.", "Tall can describe a mountain.", "Green can describe a forest.", "Bright can describe a flower."],
    tryAnswer: "tall mountain",
    tryChoices: ["tall mountain", "mountain tall the"],
    tryHint: "Choose the phrase that tells what the nature object is like.",
    tryInstruction: "Which phrase describes nature?",
  },
};

function buildGrade1QualityOverride(
  key: string,
  topicTitle: string,
  blueprint: Grade1TopicQualityBlueprint
): TopicContentBibleOverride {
  const examplesText = blueprint.lookExamples.join(", ");
  const nonExamplesText = blueprint.lookNonExamples.join(", ");
  const toGrade1ExampleLabel = (value: string) => {
    const cleanValue = value.replace(/[.!?]+$/g, "").trim();

    return cleanValue.length > 24 || /\b(I|The|We|You)\b/.test(cleanValue)
      ? cleanValue
      : titleCaseGrade1Label(cleanValue);
  };
  const exampleSeedLabels = Array.from(
    new Set([
      ...blueprint.lookExamples,
      ...blueprint.playItems,
      blueprint.tryAnswer,
      blueprint.chooseAnswer,
    ].filter(Boolean))
  );
  const expandedExampleLabels = Array.from(
    new Set(
      exampleSeedLabels.flatMap((example) => {
        const label = toGrade1ExampleLabel(example);

        return [label, `${label} card`, `${label} model`];
      })
    )
  ).slice(0, 10);
  const concreteExamples = expandedExampleLabels.map((example, index) => {
    const fact = blueprint.tapFacts[index % blueprint.tapFacts.length] ?? blueprint.knowledge;

    return {
      category: topicTitle,
      label: example,
      sentence: fact,
    };
  });
  const expandedNonExampleLabels = Array.from(
    new Set(
      [
        ...blueprint.lookNonExamples.map(toGrade1ExampleLabel),
        ...blueprint.lookNonExamples.map((example) => `${toGrade1ExampleLabel(example)} card`),
        "Wrong order",
        "Unrelated action",
        "Random mark",
      ]
    )
  ).slice(0, 5);
  const concreteNonExamples = expandedNonExampleLabels.map((label) => ({
    label,
    reason: `${label} does not show ${topicTitle}.`,
  }));
  const concreteVocabulary = Array.from(
    new Set([
      ...blueprint.lookExamples,
      ...blueprint.playItems,
      blueprint.tryAnswer,
      blueprint.chooseAnswer,
      topicTitle,
      blueprint.fundamentalSkill,
      blueprint.activityType,
      blueprint.playInstruction,
      blueprint.tryInstruction,
      blueprint.chooseInstruction,
    ].filter(Boolean))
  ).flatMap((word) => {
    const label = toGrade1ExampleLabel(word);

    return [label, `${label} clue`];
  }).slice(0, 15).map((word) => ({
    meaning: `${toGrade1ExampleLabel(word)} helps practice ${topicTitle}.`,
    word: toGrade1ExampleLabel(word),
  }));
  const tapRevealContent = blueprint.lookExamples.slice(0, 5).map((example, index) => {
    const fact = blueprint.tapFacts[index % blueprint.tapFacts.length] ?? blueprint.knowledge;

    return buildGrade1TapReveal(topicTitle, example, fact, blueprint);
  });

  return {
    activityType: blueprint.activityType,
    cognitiveFocus: blueprint.cognitiveFocus,
    content: {
      competency: `Grade 1 learner can explain, recognize, and use ${topicTitle} through ${blueprint.fundamentalSkill.toLowerCase()}.`,
      examples: concreteExamples,
      knowledge: blueprint.knowledge,
      learningObjective: `Use ${topicTitle} to show ${blueprint.fundamentalSkill.toLowerCase()}.`,
      nonExamples: concreteNonExamples,
      successCriteria: [
        `Explain what ${topicTitle} is.`,
        `Recognize ${topicTitle} from examples and non-examples.`,
        `Use ${topicTitle} in the PLAY activity.`,
      ],
      vocabularyBank: concreteVocabulary,
    },
    fundamentalSkill: blueprint.fundamentalSkill,
    requiredRenderer: blueprint.renderer,
    stageOverrides: {
      LOOK: {
        audioContent: [blueprint.knowledge, ...blueprint.tapFacts.slice(0, 4)],
        audioText: `${topicTitle}.`,
        content: `${topicTitle}: ${examplesText}.`,
        imagePrompt: `Grade 1 ${topicTitle} teaching card with examples ${examplesText} and non-examples ${nonExamplesText}`,
        instruction: "Look at the cards.",
        learnerAction: "Look, listen, and read one card.",
        manipulatives: [...blueprint.lookExamples, ...blueprint.lookNonExamples],
        purpose: `Teach what ${topicTitle} is, how it works, how to recognize it, and how to use it.`,
        questionText: `Which cards show ${topicTitle}?`,
        teachingScript: `${topicTitle}. ${blueprint.lookExamples[0] ?? topicTitle}.`,
        visualContent: [...blueprint.lookExamples, ...blueprint.lookNonExamples],
      },
      TAP: {
        audioText: tapRevealContent.join(" "),
        content: tapRevealContent.join(" "),
        discoveryContent: tapRevealContent,
        instruction: "Tap each card.",
        learnerAction: "Tap and hear the clue.",
        manipulatives: tapRevealContent,
        purpose: `Explore ${topicTitle} facts, meanings, roles, properties, relationships, or uses.`,
        questionText: "Tap a card.",
      },
      TRY: {
        choices: blueprint.tryChoices,
        content: blueprint.tryHint,
        correctAnswer: blueprint.tryAnswer,
        feedbackCorrect: getGrade1Feedback(topicTitle, blueprint.tryAnswer, blueprint),
        feedbackWrong: "Use the clue.",
        instruction: blueprint.tryInstruction,
        learnerAction: "Use the clue.",
        purpose: `Guide ${topicTitle} practice without giving away the answer.`,
        questionText: blueprint.tryInstruction,
      },
      CHOOSE: {
        choices: blueprint.chooseChoices,
        content: `${blueprint.chooseInstruction} ${blueprint.chooseHint}`,
        correctAnswer: blueprint.chooseAnswer,
        feedbackCorrect: getGrade1Feedback(topicTitle, blueprint.chooseAnswer, blueprint),
        feedbackWrong: "Look again.",
        instruction: blueprint.chooseInstruction,
        learnerAction: "Choose the match.",
        purpose: `Check independent ${topicTitle} understanding with evidence from the model.`,
        questionText: blueprint.chooseInstruction,
      },
      PLAY: {
        applicationActivity: {
          completionRule: `Complete when the learner finishes ${blueprint.playInstruction.toLowerCase()} using only known ${topicTitle} content.`,
          cognitiveSkill: "apply",
          competencyBehavior: key.includes("time") || key.includes("number-order") || key.includes("before-after")
            ? "sequencing"
            : key.includes("story")
              ? "reading-comprehension"
              : key.includes("sentence") || key.includes("reading")
                ? "sentence-building"
                : key.includes("number") || key.includes("math")
                  ? "problem-solving"
                  : key.includes("shape") || key.includes("word")
                    ? "classification"
                    : "recognition",
          goal: blueprint.playAction,
          masteryDemonstration: blueprint.playAnswer,
          name: `${topicTitle} Competency Activity`,
          realLifeContext: blueprint.playAction,
          simulationType: `${blueprint.activityType}-simulation`,
          steps: [
            `Open the ${blueprint.renderer} workspace.`,
            blueprint.playAction,
            `Check the result against ${topicTitle} rules.`,
            `Submit after the competency action is complete.`,
          ],
          type: blueprint.activityType,
        },
        correctAnswer: blueprint.playAnswer,
        content: blueprint.playAction,
        feedbackCorrect: `You used ${topicTitle} in the activity.`,
        feedbackWrong: "Try again.",
        instruction: blueprint.playInstruction,
        learnerAction: blueprint.playAction,
        manipulatives: blueprint.playItems,
        purpose: `Apply ${topicTitle} through an interactive competency activity.`,
        questionText: blueprint.playAction,
        requiredAction: blueprint.playRequiredAction,
      },
      MASTERED: {
        masteryConditions: [
          `Identified ${topicTitle} examples and non-examples.`,
          blueprint.playAction,
          `Completed ${blueprint.playInstruction.toLowerCase()}.`,
          `Demonstrated ${blueprint.fundamentalSkill.toLowerCase()}.`,
        ],
      },
    },
  };
}

function getGrade1ContentBibleOverride(
  worldId: string,
  topicTitle: string
): TopicContentBibleOverride | null {
  const key = `${worldId}:${topicTitle}`;
  const qualityBlueprint = GRADE1_TOPIC_QUALITY_BLUEPRINTS[key];

  if (qualityBlueprint) {
    return buildGrade1QualityOverride(key, topicTitle, qualityBlueprint);
  }

  const explicitOverride = GRADE1_CONTENT_BIBLE_OVERRIDES[key];

  if (explicitOverride) {
    return explicitOverride;
  }

  const summary = GRADE1_TOPIC_BIBLE_SUMMARIES[key];

  if (!summary) {
    return null;
  }

  const examples = summary.examples ?? [topicTitle];
  const tryChoice = examples[0] ?? topicTitle;
  const distractor = topicTitle === "River" ? "Jump" : "Run";

  return {
    activityType: "grade1-content-bible-application",
    cognitiveFocus: summary.knowledge,
    fundamentalSkill: summary.skill,
    requiredRenderer: summary.renderer,
    stageOverrides: {
      LOOK: {
        purpose: `Introduce ${topicTitle} with meaning, examples, and non-examples.`,
        instruction: `Look at ${topicTitle}: ${summary.knowledge}`,
        learnerAction: `Observe ${examples.join(", ")}.`,
        audioText: `${topicTitle}. ${summary.knowledge}`,
        imagePrompt: `Grade 1 illustration for ${topicTitle}: ${examples.join(", ")}`,
        manipulatives: examples,
        questionText: `What do you notice about ${topicTitle}?`,
      },
      TAP: {
        purpose: `Explore examples for ${topicTitle}.`,
        instruction: `Tap the ${topicTitle} examples.`,
        learnerAction: `Tap ${examples.join(", ")} to hear and explore.`,
        manipulatives: examples,
        questionText: `Which example helps explain ${topicTitle}?`,
      },
      TRY: {
        purpose: `Practice ${topicTitle} with support.`,
        instruction: `Try ${topicTitle} with a hint.`,
        learnerAction: `Use the model, then choose.`,
        choices: [tryChoice, distractor],
        correctAnswer: tryChoice,
        feedbackCorrect: `Good! ${tryChoice} fits ${topicTitle}.`,
        feedbackWrong: `Try again. Check the ${topicTitle} meaning clue.`,
      },
      CHOOSE: {
        purpose: `Answer ${topicTitle} independently.`,
        instruction: `Choose the best answer for ${topicTitle}.`,
        learnerAction: `Choose the example that matches ${topicTitle}.`,
        choices: Array.from(new Set([tryChoice, ...examples, distractor])).slice(0, 4),
        correctAnswer: tryChoice,
        feedbackCorrect: `Yes! That matches ${topicTitle}.`,
        feedbackWrong: `Look again at the ${topicTitle} examples.`,
      },
      PLAY: {
        purpose: `Apply ${topicTitle} through a Grade 1 activity.`,
        instruction: summary.apply,
        learnerAction: summary.apply,
        choices: examples,
        correctAnswer: tryChoice,
        manipulatives: examples,
        questionText: `How can you apply ${topicTitle}?`,
        requiredAction:
          summary.renderer.includes("Sorter") || summary.renderer.includes("Shape")
            ? "sort"
            : summary.renderer.includes("NumberLine") || summary.renderer.includes("Time")
              ? "sequence"
              : summary.renderer.includes("Counter")
                ? "count"
                : "solve",
      },
      PROGRESS: {
        instruction: `${topicTitle} progress saved in Grade 1.`,
      },
    },
  };
}

type Grade2TopicBlueprint = {
  activity: string;
  chooseAnswer: string;
  chooseChoices: string[];
  knowledge: string;
  masteryEvidence: string;
  model: string[];
  playAction: string;
  playInstruction: string;
  renderer: string;
  skill: string;
  tapFacts: string[];
  tryAnswer: string;
  tryChoices: string[];
};

const GRADE2_TOPIC_BLUEPRINTS: Record<string, Grade2TopicBlueprint> = {
  "grade2-vocabulary:Synonyms": {
    activity: "Synonym Match Mission",
    chooseAnswer: "quick",
    chooseChoices: ["quick", "slow", "cold", "small"],
    knowledge: "Synonyms are words with the same or nearly the same meaning.",
    masteryEvidence: "matched synonym pairs and chose a synonym in context",
    model: ["happy - glad", "big - large", "fast - quick", "small - tiny"],
    playAction: "Match each word to a word with nearly the same meaning.",
    playInstruction: "Match synonym pairs.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "identify and match synonym pairs",
    tapFacts: ["happy and glad mean nearly the same", "big and large mean nearly the same", "fast and quick mean nearly the same"],
    tryAnswer: "glad",
    tryChoices: ["glad", "sad"],
  },
  "grade2-vocabulary:Antonyms": {
    activity: "Opposite Pair Sort",
    chooseAnswer: "short",
    chooseChoices: ["short", "high", "large", "quick"],
    knowledge: "Antonyms are words with opposite meanings.",
    masteryEvidence: "matched opposite word pairs",
    model: ["hot - cold", "tall - short", "open - closed", "day - night"],
    playAction: "Connect each word to its opposite.",
    playInstruction: "Match opposite pairs.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "identify opposite meanings",
    tapFacts: ["hot and cold are opposites", "tall and short are opposites", "open and closed are opposites"],
    tryAnswer: "cold",
    tryChoices: ["cold", "warm"],
  },
  "grade2-vocabulary:Compound Words": {
    activity: "Compound Word Builder",
    chooseAnswer: "football",
    chooseChoices: ["football", "rainbow", "sunflower", "bedroom"],
    knowledge: "A compound word joins two smaller words to make a new word.",
    masteryEvidence: "built compound words from two word parts",
    model: ["sun + flower = sunflower", "rain + bow = rainbow", "foot + ball = football"],
    playAction: "Build compound words by joining two word cards.",
    playInstruction: "Join two word parts to make compound words.",
    renderer: "CompoundWordBuilderRenderer",
    skill: "build compound words from two parts",
    tapFacts: ["sun and flower make sunflower", "rain and bow make rainbow", "foot and ball make football"],
    tryAnswer: "rain + bow",
    tryChoices: ["rain + bow", "rain + tree"],
  },
  "grade2-vocabulary:Same Meaning Words": {
    activity: "Same Meaning Sort",
    chooseAnswer: "large",
    chooseChoices: ["large", "tiny", "cold", "closed"],
    knowledge: "Same meaning words belong in the same meaning group.",
    masteryEvidence: "sorted words into same-meaning groups",
    model: ["big, large, huge", "small, tiny, little", "happy, glad, joyful"],
    playAction: "Sort words into groups with similar meanings.",
    playInstruction: "Group same-meaning words.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "sort words by shared meaning",
    tapFacts: ["big, large, and huge belong together", "small, tiny, and little belong together"],
    tryAnswer: "huge",
    tryChoices: ["huge", "short"],
  },
  "grade2-vocabulary:Opposite Meaning Words": {
    activity: "Opposite Bridge",
    chooseAnswer: "closed",
    chooseChoices: ["closed", "wide", "glad", "large"],
    knowledge: "Opposite meaning words show contrast.",
    masteryEvidence: "connected opposite word cards",
    model: ["open - closed", "near - far", "early - late", "light - heavy"],
    playAction: "Build bridges between opposite word cards.",
    playInstruction: "Connect each word to its opposite.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "connect words with opposite meanings",
    tapFacts: ["open and closed show contrast", "near and far show contrast", "early and late show contrast"],
    tryAnswer: "far",
    tryChoices: ["far", "near"],
  },
  "grade2-vocabulary:Vocabulary in Sentences": {
    activity: "Context Word Picker",
    chooseAnswer: "small",
    chooseChoices: ["small", "fast", "angry", "heavy"],
    knowledge: "Sentence clues help explain what a word means.",
    masteryEvidence: "used sentence context to choose word meaning",
    model: ["The tiny kitten slept in the basket.", "tiny means small", "clue: kitten"],
    playAction: "Read a sentence, tap the clue, then choose the word meaning.",
    playInstruction: "Use sentence clues to choose meaning.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "use context to understand vocabulary",
    tapFacts: ["tiny describes the kitten", "a kitten is small", "nearby words give meaning clues"],
    tryAnswer: "small",
    tryChoices: ["small", "loud"],
  },
  "grade2-story:Sentence Understanding": {
    activity: "Sentence Picture Match",
    chooseAnswer: "The girl waters plants.",
    chooseChoices: ["The girl waters plants.", "The boy rides a boat.", "The dog sleeps.", "The market is closed."],
    knowledge: "A sentence tells who did what.",
    masteryEvidence: "matched a sentence to the correct meaning",
    model: ["Mina waters the plants.", "who: Mina", "action: waters", "what: plants"],
    playAction: "Match each sentence to the picture meaning it shows.",
    playInstruction: "Read and match sentence meaning.",
    renderer: "PassageEvidenceRenderer",
    skill: "understand sentence meaning",
    tapFacts: ["Mina tells who", "waters tells the action", "plants tells what"],
    tryAnswer: "Mina waters plants.",
    tryChoices: ["Mina waters plants.", "Mina sells fish."],
  },
  "grade2-story:Story Meaning": {
    activity: "Story Meaning Check",
    chooseAnswer: "Rafa helped because the books fell.",
    chooseChoices: ["Rafa helped because the books fell.", "Rafa cooked lunch.", "Rafa went swimming.", "Rafa bought fruit."],
    knowledge: "Story meaning explains what happened and why.",
    masteryEvidence: "answered what happened and why using the story",
    model: ["Books fell.", "Rafa picked them up.", "He helped his classmate."],
    playAction: "Choose what happened, then choose why it happened.",
    playInstruction: "Answer what happened and why.",
    renderer: "PassageEvidenceRenderer",
    skill: "explain story meaning",
    tapFacts: ["Books fell first", "Rafa picked them up", "That action shows helping"],
    tryAnswer: "He helped.",
    tryChoices: ["He helped.", "He hid."],
  },
  "grade2-story:Vocabulary in Stories": {
    activity: "Story Word Meaning",
    chooseAnswer: "carefully",
    chooseChoices: ["carefully", "quickly", "angrily", "loudly"],
    knowledge: "Story context can reveal the meaning of a story word.",
    masteryEvidence: "used story context to choose a word meaning",
    model: ["Lina carried the glass carefully.", "The glass could break.", "carefully means with care"],
    playAction: "Read the story sentence, tap the clue, then choose the meaning.",
    playInstruction: "Use story clues to find word meaning.",
    renderer: "PassageEvidenceRenderer",
    skill: "use story context clues",
    tapFacts: ["glass could break", "carried carefully means with care", "the clue is in the sentence"],
    tryAnswer: "with care",
    tryChoices: ["with care", "with noise"],
  },
  "grade2-story:Main Idea": {
    activity: "Main Idea Detective",
    chooseAnswer: "Mila caring for her chicken",
    chooseChoices: ["Mila caring for her chicken", "Mila going swimming", "Mila buying a dress", "Mila riding a bus"],
    knowledge: "The main idea tells what a story is mostly about.",
    masteryEvidence: "identified the main idea and one supporting detail",
    model: ["Mila feeds her chicken.", "She gives water.", "She cleans its house."],
    playAction: "Choose the main idea, then tap a detail that supports it.",
    playInstruction: "Find the main idea and proof.",
    renderer: "PassageEvidenceRenderer",
    skill: "identify main idea and supporting detail",
    tapFacts: ["feeds chicken is an important detail", "gives water is an important detail", "cleans house is an important detail"],
    tryAnswer: "Mila caring for her chicken",
    tryChoices: ["Mila caring for her chicken", "Mila going swimming"],
  },
  "grade2-story:Story Details": {
    activity: "Evidence Hunt",
    chooseAnswer: "She gave water and grains.",
    chooseChoices: ["She gave water and grains.", "She flew a kite.", "She painted a wall.", "She lost a shoe."],
    knowledge: "Story details answer who, what, where, when, or why.",
    masteryEvidence: "tapped a detail that answered the question",
    model: ["Question: What did Mila give?", "Detail: water and grains", "Evidence answers the question"],
    playAction: "Read the question and tap the detail that proves the answer.",
    playInstruction: "Tap the detail that answers the question.",
    renderer: "PassageEvidenceRenderer",
    skill: "find story details as evidence",
    tapFacts: ["details answer questions", "water and grains answers what", "evidence comes from the passage"],
    tryAnswer: "water and grains",
    tryChoices: ["water and grains", "a red ball"],
  },
  "grade2-story:Sequence of Events": {
    activity: "Story Order Builder",
    chooseAnswer: "First, Next, Last",
    chooseChoices: ["First, Next, Last", "Last, First, Next", "Next, Last, First", "Last, Next, First"],
    knowledge: "Events in a story happen in order.",
    masteryEvidence: "arranged story events in order",
    model: ["First: feeds chicken", "Next: gives water", "Last: cleans house"],
    playAction: "Arrange event cards into First, Next, and Last.",
    playInstruction: "Put the story events in order.",
    renderer: "SequenceEventsRenderer",
    skill: "sequence story events",
    tapFacts: ["first starts the story", "next happens after first", "last finishes the story"],
    tryAnswer: "First",
    tryChoices: ["First", "Last"],
  },
  "grade2-community-explorer:Hospital": {
    activity: "Help the Patient",
    chooseAnswer: "hospital",
    chooseChoices: ["hospital", "school", "farm", "park"],
    knowledge: "A hospital is a place where sick or hurt people get help.",
    masteryEvidence: "matched a sick child to hospital and doctor or nurse",
    model: ["sick child", "hospital", "doctor", "nurse"],
    playAction: "Match the sick child to the hospital and helper.",
    playInstruction: "Help the patient get care.",
    renderer: "CommunityScenarioRenderer",
    skill: "choose a community place for care",
    tapFacts: ["doctor helps sick people", "nurse gives care", "medicine helps treatment"],
    tryAnswer: "hospital",
    tryChoices: ["hospital", "market"],
  },
  "grade2-community-explorer:School": {
    activity: "School Helper Mission",
    chooseAnswer: "school",
    chooseChoices: ["school", "hospital", "market", "beach"],
    knowledge: "A school is a place for learning with teachers, students, books, and classrooms.",
    masteryEvidence: "matched school people and objects to learning roles",
    model: ["student - classroom", "teacher - lesson", "book - reading"],
    playAction: "Match school roles and tools to what they do.",
    playInstruction: "Match school helpers and tools.",
    renderer: "CommunityScenarioRenderer",
    skill: "connect school roles to learning",
    tapFacts: ["teacher gives lessons", "students learn in classrooms", "books help reading"],
    tryAnswer: "teacher",
    tryChoices: ["teacher", "doctor"],
  },
  "grade2-community-explorer:Market": {
    activity: "Market Shopping Mission",
    chooseAnswer: "market",
    chooseChoices: ["market", "classroom", "clinic", "library"],
    knowledge: "A market is a community place where people buy and sell goods.",
    masteryEvidence: "selected items that belong in a market task",
    model: ["buyer", "seller", "vegetables", "price"],
    playAction: "Choose items to buy from the market list.",
    playInstruction: "Shop for market items.",
    renderer: "CommunityScenarioRenderer",
    skill: "identify market purpose and items",
    tapFacts: ["buyers pay for goods", "sellers sell goods", "vegetables can be bought at a market"],
    tryAnswer: "vegetables",
    tryChoices: ["vegetables", "hospital bed"],
  },
  "grade2-community-explorer:Barangay Hall": {
    activity: "Community Help Mission",
    chooseAnswer: "barangay hall",
    chooseChoices: ["barangay hall", "forest", "playground", "clinic"],
    knowledge: "A barangay hall helps with community concerns and services.",
    masteryEvidence: "chose barangay hall for a community concern",
    model: ["community concern", "barangay hall", "barangay helper"],
    playAction: "Choose where to go for a community concern.",
    playInstruction: "Find help for a community concern.",
    renderer: "CommunityScenarioRenderer",
    skill: "choose barangay hall for community help",
    tapFacts: ["community concerns go to barangay hall", "barangay helpers guide families", "reports can be made there"],
    tryAnswer: "barangay hall",
    tryChoices: ["barangay hall", "market"],
  },
  "grade2-community-explorer:Community Helpers": {
    activity: "Helper Role Match",
    chooseAnswer: "doctor helps sick people",
    chooseChoices: ["doctor helps sick people", "teacher sells fish", "vendor teaches class", "driver gives medicine"],
    knowledge: "Community helpers do roles that support people.",
    masteryEvidence: "matched helpers to their community roles",
    model: ["doctor - cares", "teacher - teaches", "vendor - sells", "driver - transports"],
    playAction: "Match each helper to the role they do.",
    playInstruction: "Match helpers to roles.",
    renderer: "CommunityScenarioRenderer",
    skill: "match community helpers to roles",
    tapFacts: ["doctors care for sick people", "teachers teach learners", "vendors sell goods"],
    tryAnswer: "doctor",
    tryChoices: ["doctor", "classroom"],
  },
  "grade2-community-explorer:Where Should We Go?": {
    activity: "Community Scenario Map",
    chooseAnswer: "hospital",
    chooseChoices: ["hospital", "school", "market", "barangay hall"],
    knowledge: "A community need points to the best place to go.",
    masteryEvidence: "solved community scenarios by choosing the correct place",
    model: ["Ana has a fever - hospital", "Ben needs to study - school", "Lola buys fish - market"],
    playAction: "Read each scenario and choose the community place.",
    playInstruction: "Choose where each person should go.",
    renderer: "CommunityScenarioRenderer",
    skill: "solve community place scenarios",
    tapFacts: ["fever needs care", "study needs school", "shopping needs market"],
    tryAnswer: "hospital",
    tryChoices: ["hospital", "park"],
  },
  "grade2-place-value:Ones": {
    activity: "Ones Builder",
    chooseAnswer: "7 ones",
    chooseChoices: ["7 ones", "7 tens", "70 ones", "1 hundred"],
    knowledge: "Ones are single units used to build numbers.",
    masteryEvidence: "counted loose ones correctly",
    model: ["1 cube", "2 cubes", "7 loose ones"],
    playAction: "Count loose base-ten cubes.",
    playInstruction: "Count the ones.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "count ones as single units",
    tapFacts: ["one cube is one", "loose cubes are ones", "ones build the smallest place"],
    tryAnswer: "1 one",
    tryChoices: ["1 one", "1 ten"],
  },
  "grade2-place-value:Tens": {
    activity: "Ten Bundle Builder",
    chooseAnswer: "1 ten",
    chooseChoices: ["1 ten", "1 one", "1 hundred", "3 ones"],
    knowledge: "Ten ones can be bundled to make one ten.",
    masteryEvidence: "bundled ten ones into one ten",
    model: ["10 ones", "bundle", "1 ten"],
    playAction: "Group 10 ones into a ten rod.",
    playInstruction: "Bundle ten ones.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "bundle ones into tens",
    tapFacts: ["ten single cubes can join", "the bundle is one ten", "one ten equals 10 ones"],
    tryAnswer: "10 ones bundled",
    tryChoices: ["10 ones bundled", "3 loose ones"],
  },
  "grade2-place-value:Hundreds": {
    activity: "Hundred Flat Builder",
    chooseAnswer: "1 hundred",
    chooseChoices: ["1 hundred", "1 ten", "10 ones", "5 ones"],
    knowledge: "Ten tens can make one hundred.",
    masteryEvidence: "built a hundred from tens",
    model: ["10 tens", "hundred flat", "100"],
    playAction: "Build 100 using ten rods.",
    playInstruction: "Build a hundred flat.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "compose hundreds from tens",
    tapFacts: ["ten tens make one hundred", "a hundred flat shows 100", "hundreds are larger than tens"],
    tryAnswer: "10 tens",
    tryChoices: ["10 tens", "10 ones"],
  },
  "grade2-place-value:Build a Number": {
    activity: "Base-Ten Number Builder",
    chooseAnswer: "245",
    chooseChoices: ["245", "254", "425", "205"],
    knowledge: "A number can be built with hundreds, tens, and ones.",
    masteryEvidence: "built a number with correct hundreds, tens, and ones",
    model: ["2 hundreds", "4 tens", "5 ones", "245"],
    playAction: "Build 245 using base-ten blocks.",
    playInstruction: "Build the number with blocks.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "build numbers using place value",
    tapFacts: ["2 hundreds show 200", "4 tens show 40", "5 ones show 5"],
    tryAnswer: "2 hundreds, 4 tens, 5 ones",
    tryChoices: ["2 hundreds, 4 tens, 5 ones", "2 tens, 4 hundreds, 5 ones"],
  },
  "grade2-place-value:Expanded Form": {
    activity: "Expanded Form Puzzle",
    chooseAnswer: "200 + 40 + 3",
    chooseChoices: ["200 + 40 + 3", "20 + 40 + 3", "200 + 4 + 30", "243 + 0"],
    knowledge: "Expanded form shows the value of each digit.",
    masteryEvidence: "split a number into hundreds, tens, and ones",
    model: ["243", "200", "40", "3"],
    playAction: "Break the number into expanded form.",
    playInstruction: "Build expanded form.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "write expanded form",
    tapFacts: ["2 in hundreds means 200", "4 in tens means 40", "3 in ones means 3"],
    tryAnswer: "200 + 40 + 3",
    tryChoices: ["200 + 40 + 3", "20 + 4 + 3"],
  },
  "grade2-place-value:Compare Place Values": {
    activity: "Place Value Compare",
    chooseAnswer: "352 is greater",
    chooseChoices: ["352 is greater", "325 is greater", "They are equal", "235 is greater"],
    knowledge: "Compare numbers by checking hundreds, then tens, then ones.",
    masteryEvidence: "compared two numbers using place value",
    model: ["352", "325", "hundreds same", "compare tens"],
    playAction: "Compare two numbers using place-value blocks.",
    playInstruction: "Compare by place value.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "compare numbers by place value",
    tapFacts: ["hundreds are checked first", "if hundreds match, compare tens", "5 tens is greater than 2 tens"],
    tryAnswer: "352",
    tryChoices: ["352", "325"],
  },
  "grade2-problems:One-Step Problems": {
    activity: "Problem Workspace",
    chooseAnswer: "13",
    chooseChoices: ["13", "8", "5", "3"],
    knowledge: "A one-step word problem needs one operation to solve.",
    masteryEvidence: "highlighted numbers, chose an operation, and solved one step",
    model: ["8 shells", "5 more", "8 + 5 = 13"],
    playAction: "Highlight the numbers, choose plus, then solve.",
    playInstruction: "Solve one story problem.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "solve one-step word problems",
    tapFacts: ["8 is a starting number", "5 more means add", "8 plus 5 equals 13"],
    tryAnswer: "add",
    tryChoices: ["add", "subtract"],
  },
  "grade2-problems:Two-Step Problems": {
    activity: "Two-Step Workspace",
    chooseAnswer: "10",
    chooseChoices: ["10", "14", "7", "4"],
    knowledge: "A two-step problem uses one answer to solve the next step.",
    masteryEvidence: "solved step 1 and used it in step 2",
    model: ["9 + 5 = 14", "14 - 4 = 10", "answer 10"],
    playAction: "Solve Step 1, then use that answer for Step 2.",
    playInstruction: "Solve the two-step workspace.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "solve two-step word problems",
    tapFacts: ["Step 1 makes a new total", "Step 2 uses that total", "the final answer comes last"],
    tryAnswer: "14",
    tryChoices: ["14", "5"],
  },
  "grade2-problems:Choose the Operation": {
    activity: "Operation Picker",
    chooseAnswer: "+",
    chooseChoices: ["+", "-", "x", "="],
    knowledge: "The story tells which operation is needed.",
    masteryEvidence: "chose the correct operation from the story clue",
    model: ["finds more means +", "gives away means -", "equal groups can mean x"],
    playAction: "Read story clues and choose the needed operation.",
    playInstruction: "Pick the operation.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "choose operation from a word problem",
    tapFacts: ["more can mean addition", "left can mean subtraction", "groups can mean multiplication"],
    tryAnswer: "+",
    tryChoices: ["+", "-"],
  },
  "grade2-problems:Addition Word Problems": {
    activity: "Addition Story Solver",
    chooseAnswer: "17",
    chooseChoices: ["17", "7", "10", "27"],
    knowledge: "Addition word problems combine amounts or add more.",
    masteryEvidence: "solved an addition story problem",
    model: ["10 mangoes", "7 more", "10 + 7 = 17"],
    playAction: "Build the addition story and solve the total.",
    playInstruction: "Solve an addition story.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "solve addition word problems",
    tapFacts: ["10 is the first amount", "7 more joins it", "addition finds the total"],
    tryAnswer: "add",
    tryChoices: ["add", "take away"],
  },
  "grade2-problems:Subtraction Word Problems": {
    activity: "Take-Away Story Solver",
    chooseAnswer: "9",
    chooseChoices: ["9", "15", "6", "21"],
    knowledge: "Subtraction word problems take away or find what is left.",
    masteryEvidence: "solved a subtraction story problem",
    model: ["15 bananas", "6 sold", "15 - 6 = 9"],
    playAction: "Build the take-away story and solve what is left.",
    playInstruction: "Solve a subtraction story.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "solve subtraction word problems",
    tapFacts: ["15 is the starting amount", "6 sold means take away", "subtraction finds what is left"],
    tryAnswer: "subtract",
    tryChoices: ["subtract", "add"],
  },
  "grade2-problems:Mixed Word Problems": {
    activity: "Problem Mission",
    chooseAnswer: "choose operation then solve",
    chooseChoices: ["choose operation then solve", "guess the bigger number", "copy the question", "skip the numbers"],
    knowledge: "Mixed word problems require reading the story before choosing the operation.",
    masteryEvidence: "selected operation and solved mixed problems",
    model: ["read", "highlight numbers", "choose operation", "solve"],
    playAction: "Complete mixed problem stations by selecting the operation and solving each model.",
    playInstruction: "Solve the problem mission.",
    renderer: "WordProblemWorkspaceRenderer",
    skill: "solve mixed word problems",
    tapFacts: ["read before solving", "numbers must match the story", "operation depends on the action"],
    tryAnswer: "read the story",
    tryChoices: ["read the story", "guess"],
  },
  "grade2-measurement:Length": {
    activity: "Virtual Ruler",
    chooseAnswer: "6 cm",
    chooseChoices: ["6 cm", "3 cm", "9 cm", "12 cm"],
    knowledge: "Length tells how long an object is.",
    masteryEvidence: "measured an object with a ruler",
    model: ["start at 0", "end at 6", "length is 6 cm"],
    playAction: "Line up the ruler and choose the length.",
    playInstruction: "Measure with the ruler.",
    renderer: "MeasurementToolRenderer",
    skill: "measure length",
    tapFacts: ["start measuring at zero", "read the end mark", "centimeters measure length"],
    tryAnswer: "ruler",
    tryChoices: ["ruler", "clock"],
  },
  "grade2-measurement:Height": {
    activity: "Height Compare",
    chooseAnswer: "tree is tallest",
    chooseChoices: ["tree is tallest", "cup is tallest", "pencil is tallest", "book is tallest"],
    knowledge: "Height tells how tall something is.",
    masteryEvidence: "compared objects by height",
    model: ["cup", "pencil", "tree", "shortest to tallest"],
    playAction: "Order objects from shortest to tallest.",
    playInstruction: "Compare heights.",
    renderer: "MeasurementToolRenderer",
    skill: "compare height",
    tapFacts: ["height goes up and down", "shorter objects are lower", "the tree is tallest"],
    tryAnswer: "tree",
    tryChoices: ["tree", "cup"],
  },
  "grade2-measurement:Weight": {
    activity: "Balance Scale",
    chooseAnswer: "rock",
    chooseChoices: ["rock", "feather", "paper", "leaf"],
    knowledge: "Weight tells how heavy or light something is.",
    masteryEvidence: "used a balance scale to compare weight",
    model: ["rock side down", "feather side up", "rock is heavier"],
    playAction: "Place objects on the scale and choose the heavier one.",
    playInstruction: "Use the balance scale.",
    renderer: "MeasurementToolRenderer",
    skill: "compare weight",
    tapFacts: ["heavier side goes down", "lighter side goes up", "rock is heavier than feather"],
    tryAnswer: "rock",
    tryChoices: ["rock", "feather"],
  },
  "grade2-measurement:Capacity": {
    activity: "Fill the Container",
    chooseAnswer: "bottle",
    chooseChoices: ["bottle", "cup", "spoon", "cap"],
    knowledge: "Capacity tells how much a container can hold.",
    masteryEvidence: "compared containers by capacity",
    model: ["small cup", "large bottle", "bottle holds more"],
    playAction: "Fill containers and choose which holds more.",
    playInstruction: "Compare capacity.",
    renderer: "MeasurementToolRenderer",
    skill: "compare capacity",
    tapFacts: ["containers can hold different amounts", "full level helps compare", "larger container can hold more"],
    tryAnswer: "bottle",
    tryChoices: ["bottle", "spoon"],
  },
  "grade2-measurement:Longer and Shorter": {
    activity: "Length Sort",
    chooseAnswer: "ribbon is longer",
    chooseChoices: ["ribbon is longer", "clip is longer", "both same", "height is heavier"],
    knowledge: "Longer and shorter compare length.",
    masteryEvidence: "sorted objects by longer and shorter",
    model: ["ribbon", "paper clip", "ribbon is longer"],
    playAction: "Sort objects into longer and shorter groups.",
    playInstruction: "Sort by length.",
    renderer: "MeasurementToolRenderer",
    skill: "compare longer and shorter",
    tapFacts: ["longer stretches farther", "shorter ends sooner", "compare endpoints"],
    tryAnswer: "longer",
    tryChoices: ["longer", "heavier"],
  },
  "grade2-measurement:Heavier and Lighter": {
    activity: "Weight Sort",
    chooseAnswer: "book is heavier",
    chooseChoices: ["book is heavier", "leaf is heavier", "both are empty", "cup is longer"],
    knowledge: "Heavier and lighter compare weight.",
    masteryEvidence: "sorted objects by heavier and lighter",
    model: ["book", "leaf", "book is heavier"],
    playAction: "Sort objects into heavier and lighter groups.",
    playInstruction: "Sort by weight.",
    renderer: "MeasurementToolRenderer",
    skill: "compare heavier and lighter",
    tapFacts: ["heavier has more weight", "lighter has less weight", "a scale helps compare"],
    tryAnswer: "heavier",
    tryChoices: ["heavier", "longer"],
  },
  "grade2-measurement:More Capacity and Less Capacity": {
    activity: "Capacity Compare",
    chooseAnswer: "jug has more capacity",
    chooseChoices: ["jug has more capacity", "cup has more capacity", "spoon has more capacity", "all hold the same"],
    knowledge: "More capacity and less capacity compare how much containers hold.",
    masteryEvidence: "compared containers by more and less capacity",
    model: ["jug", "cup", "jug holds more"],
    playAction: "Compare containers and choose more or less capacity.",
    playInstruction: "Compare container capacity.",
    renderer: "MeasurementToolRenderer",
    skill: "compare more and less capacity",
    tapFacts: ["more capacity holds more", "less capacity holds less", "fill level shows the comparison"],
    tryAnswer: "jug",
    tryChoices: ["jug", "cup"],
  },
  "grade2-multiplication:Equal Groups": {
    activity: "Equal Group Builder",
    chooseAnswer: "12",
    chooseChoices: ["12", "7", "9", "16"],
    knowledge: "Equal groups have the same number in each group.",
    masteryEvidence: "built equal groups and counted the total",
    model: ["3 groups", "4 in each group", "12 total"],
    playAction: "Create 3 equal groups of 4 objects.",
    playInstruction: "Build equal groups.",
    renderer: "EqualGroupsRenderer",
    skill: "model multiplication with equal groups",
    tapFacts: ["each group must have the same amount", "3 groups of 4 makes 12", "equal groups help multiply"],
    tryAnswer: "3 groups of 4",
    tryChoices: ["3 groups of 4", "3 groups of different sizes"],
  },
  "grade2-multiplication:Repeated Addition": {
    activity: "Repeated Addition Bridge",
    chooseAnswer: "4 + 4 + 4",
    chooseChoices: ["4 + 4 + 4", "4 + 3", "3 + 3 + 3 + 3", "4 - 3"],
    knowledge: "Repeated addition adds equal groups again and again.",
    masteryEvidence: "connected repeated addition to multiplication",
    model: ["4 + 4 + 4 = 12", "3 x 4 = 12"],
    playAction: "Connect repeated addition to the multiplication sentence.",
    playInstruction: "Bridge addition to multiplication.",
    renderer: "EqualGroupsRenderer",
    skill: "connect repeated addition and multiplication",
    tapFacts: ["4 appears three times", "three groups of four is 3 x 4", "the total is 12"],
    tryAnswer: "4 + 4 + 4",
    tryChoices: ["4 + 4 + 4", "4 + 3"],
  },
  "grade2-multiplication:Multiplication Facts": {
    activity: "Fact Practice Mission",
    chooseAnswer: "18",
    chooseChoices: ["18", "15", "21", "9"],
    knowledge: "Multiplication facts help find totals for equal groups quickly.",
    masteryEvidence: "solved multiplication fact stations",
    model: ["3 x 6", "6 + 6 + 6", "18"],
    playAction: "Solve fact stations using equal groups.",
    playInstruction: "Practice multiplication facts.",
    renderer: "EqualGroupsRenderer",
    skill: "solve multiplication facts",
    tapFacts: ["3 times 6 means three groups of 6", "repeated addition can help", "the product is 18"],
    tryAnswer: "18",
    tryChoices: ["18", "9"],
  },
  "grade2-multiplication:Arrays": {
    activity: "Array Builder",
    chooseAnswer: "3 rows of 4 make 12",
    chooseChoices: ["3 rows of 4 make 12", "3 rows of 3 make 12", "4 rows of 2 make 12", "3 loose objects make 12"],
    knowledge: "An array uses rows and columns to show multiplication.",
    masteryEvidence: "built an array with correct rows and columns",
    model: ["3 rows", "4 columns", "3 x 4 = 12"],
    playAction: "Build an array with rows and columns.",
    playInstruction: "Build the array.",
    renderer: "ArrayBuilderRenderer",
    skill: "model multiplication with arrays",
    tapFacts: ["rows go across", "columns go down", "rows times columns gives total"],
    tryAnswer: "3 rows of 4",
    tryChoices: ["3 rows of 4", "3 and 4 loose"],
  },
  "grade2-multiplication:Groups of Objects": {
    activity: "Group Count Challenge",
    chooseAnswer: "20",
    chooseChoices: ["20", "9", "15", "25"],
    knowledge: "Groups of objects can be counted with multiplication when groups are equal.",
    masteryEvidence: "counted groups of objects using multiplication",
    model: ["4 baskets", "5 fruits each", "20 fruits"],
    playAction: "Count equal groups of objects.",
    playInstruction: "Count by groups.",
    renderer: "EqualGroupsRenderer",
    skill: "count equal object groups",
    tapFacts: ["4 baskets are groups", "5 fruits are in each group", "4 groups of 5 equals 20"],
    tryAnswer: "20",
    tryChoices: ["20", "9"],
  },
  "grade2-multiplication:Multiplication Word Problems": {
    activity: "Multiplication Story Workspace",
    chooseAnswer: "24",
    chooseChoices: ["24", "10", "18", "30"],
    knowledge: "Multiplication word problems use equal groups in a story.",
    masteryEvidence: "solved a multiplication story problem",
    model: ["4 bags", "6 marbles each", "4 x 6 = 24"],
    playAction: "Read the story, build groups, and solve.",
    playInstruction: "Solve a multiplication story.",
    renderer: "EqualGroupsRenderer",
    skill: "solve multiplication word problems",
    tapFacts: ["bags are equal groups", "6 in each group", "4 groups of 6 equals 24"],
    tryAnswer: "multiply",
    tryChoices: ["multiply", "subtract"],
  },
  "grade2-challenge:Mixed Vocabulary": {
    activity: "Vocabulary Mission",
    chooseAnswer: "use word relationships and clues",
    chooseChoices: ["use word relationships and clues", "count blocks only", "measure length only", "skip the sentence"],
    knowledge: "Mixed vocabulary uses synonyms, antonyms, compound words, and context clues.",
    masteryEvidence: "completed vocabulary relationship stations",
    model: ["same meaning", "opposite meaning", "compound word", "context clue"],
    playAction: "Complete vocabulary stations.",
    playInstruction: "Solve mixed vocabulary tasks.",
    renderer: "MixedMissionRenderer",
    skill: "apply mixed vocabulary skills",
    tapFacts: ["same meaning uses synonyms", "opposite meaning uses antonyms", "context uses sentence clues"],
    tryAnswer: "synonym",
    tryChoices: ["synonym", "hundred"],
  },
  "grade2-challenge:Mixed Numeracy": {
    activity: "Numeracy Mission",
    chooseAnswer: "use models to solve",
    chooseChoices: ["use models to solve", "read only the title", "choose any answer", "ignore units"],
    knowledge: "Mixed numeracy combines place value, measurement, and multiplication models.",
    masteryEvidence: "completed mixed numeracy model stations",
    model: ["place value", "measurement", "multiplication"],
    playAction: "Complete numeracy stations using models.",
    playInstruction: "Solve mixed numeracy tasks.",
    renderer: "MixedMissionRenderer",
    skill: "apply mixed numeracy skills",
    tapFacts: ["blocks help place value", "tools help measurement", "groups help multiplication"],
    tryAnswer: "model",
    tryChoices: ["model", "guess"],
  },
  "grade2-challenge:Mixed Word Problems": {
    activity: "Problem Solving Mission",
    chooseAnswer: "read, choose operation, solve",
    chooseChoices: ["read, choose operation, solve", "guess, tap, finish", "copy the numbers", "choose the largest number"],
    knowledge: "Mixed word problems need operation selection and careful solving.",
    masteryEvidence: "completed operation and answer stations",
    model: ["read", "highlight numbers", "choose operation", "solve"],
    playAction: "Choose operations and solve final answers.",
    playInstruction: "Complete the problem-solving mission.",
    renderer: "MixedMissionRenderer",
    skill: "solve mixed word problems",
    tapFacts: ["story action tells operation", "numbers must be highlighted", "answer must fit the question"],
    tryAnswer: "choose operation",
    tryChoices: ["choose operation", "ignore story"],
  },
  "grade2-challenge:Place Value Challenge": {
    activity: "Build and Compare Challenge",
    chooseAnswer: "build and compare",
    chooseChoices: ["build and compare", "spell the word", "measure water", "read a story only"],
    knowledge: "Place value challenges use building and comparing numbers.",
    masteryEvidence: "built and compared place-value models",
    model: ["build 245", "compare 352 and 325", "explain hundreds, tens, ones"],
    playAction: "Build a number and compare another number.",
    playInstruction: "Complete place-value stations.",
    renderer: "MixedMissionRenderer",
    skill: "apply place-value reasoning",
    tapFacts: ["digits have place values", "blocks show value", "compare from the largest place"],
    tryAnswer: "hundreds",
    tryChoices: ["hundreds", "letters"],
  },
  "grade2-challenge:Measurement Challenge": {
    activity: "Measure and Compare Challenge",
    chooseAnswer: "measure and compare",
    chooseChoices: ["measure and compare", "sort synonyms", "build a word", "skip the tool"],
    knowledge: "Measurement challenges use tools and comparison words.",
    masteryEvidence: "measured and compared objects",
    model: ["ruler", "balance scale", "capacity containers"],
    playAction: "Use tools to measure and compare.",
    playInstruction: "Complete measurement stations.",
    renderer: "MixedMissionRenderer",
    skill: "apply measurement reasoning",
    tapFacts: ["rulers measure length", "scales compare weight", "containers compare capacity"],
    tryAnswer: "ruler",
    tryChoices: ["ruler", "synonym"],
  },
  "grade2-challenge:Multiplication Challenge": {
    activity: "Equal Groups and Arrays Challenge",
    chooseAnswer: "groups and arrays",
    chooseChoices: ["groups and arrays", "opposites only", "capacity only", "story title only"],
    knowledge: "Multiplication challenges use equal groups, repeated addition, and arrays.",
    masteryEvidence: "built equal groups and arrays",
    model: ["3 groups of 4", "4 + 4 + 4", "3 x 4 array"],
    playAction: "Build equal groups and an array.",
    playInstruction: "Complete multiplication stations.",
    renderer: "MixedMissionRenderer",
    skill: "apply multiplication models",
    tapFacts: ["equal groups show multiplication", "arrays show rows and columns", "repeated addition connects to facts"],
    tryAnswer: "equal groups",
    tryChoices: ["equal groups", "opposite words"],
  },
};

const GRADE2_TOPIC_BLUEPRINT_ALIASES: Record<string, string> = {
  "grade2-vocabulary:Context Vocabulary": "grade2-vocabulary:Vocabulary in Sentences",
  "grade2-vocabulary:Vocabulary Challenge": "grade2-challenge:Mixed Vocabulary",
  "grade2-story:Characters": "grade2-story:Character",
  "grade2-story:Details": "grade2-story:Story Details",
  "grade2-story:Sequence": "grade2-story:Sequence of Events",
  "grade2-story:Beginning": "grade2-story:Sequence of Events",
  "grade2-story:Middle": "grade2-story:Sequence of Events",
  "grade2-story:Ending": "grade2-story:Sequence of Events",
  "grade2-story:Story Sequence": "grade2-story:Sequence of Events",
  "grade2-community-explorer:Community Places": "grade2-community-explorer:Where Should We Go?",
  "grade2-place-value:Compare Numbers": "grade2-place-value:Compare Place Values",
  "grade2-problems:Addition Problems": "grade2-problems:Addition Word Problems",
  "grade2-problems:Subtraction Problems": "grade2-problems:Subtraction Word Problems",
  "grade2-problems:Multi-Step Problems": "grade2-problems:Two-Step Problems",
  "grade2-problems:Reasoning Challenge": "grade2-problems:Mixed Word Problems",
  "grade2-problems:Problem Solving Challenge": "grade2-challenge:Mixed Word Problems",
  "grade2-challenge:Mixed Literacy": "grade2-challenge:Mixed Vocabulary",
};

const GRADE2_RECONSTRUCTION_BLUEPRINTS: Record<string, Grade2TopicBlueprint> = {
  "grade2-vocabulary:Categories": {
    activity: "Category Sorting Station",
    chooseAnswer: "animals",
    chooseChoices: ["animals", "feelings", "directions", "temperatures"],
    knowledge: "A category is a group of words or objects that belong together.",
    masteryEvidence: "sorted words into animals, fruits, food, school objects, and transportation categories",
    model: ["dog - animal", "mango - fruit", "pencil - school object", "bus - transportation"],
    playAction: "Sort each word card into the correct category basket.",
    playInstruction: "Sort the words into categories.",
    renderer: "VocabularyRelationshipRenderer",
    skill: "classify words by category",
    tapFacts: ["animals are living things", "fruits are foods from plants", "school objects are used in class"],
    tryAnswer: "same group",
    tryChoices: ["same group", "opposite meaning"],
  },
  "grade2-measurement:Time": {
    activity: "Clock Match Harbor",
    chooseAnswer: "3:00",
    chooseChoices: ["3:00", "6:00", "9:30", "12:30"],
    knowledge: "Time tells when an activity happens.",
    masteryEvidence: "matched clock times to daily activities",
    model: ["clock face", "hour hand", "minute hand", "activity card"],
    playAction: "Set the clock and match it to the activity card.",
    playInstruction: "Match the clock to the activity.",
    renderer: "MeasurementToolRenderer",
    skill: "read simple clock times",
    tapFacts: ["the short hand shows the hour", "the long hand at 12 means o'clock", "3:00 can be after-school time"],
    tryAnswer: "hour hand",
    tryChoices: ["hour hand", "ruler mark"],
  },
  "grade2-story:Setting": {
    activity: "Setting Evidence Hunt",
    chooseAnswer: "The story happens in a classroom.",
    chooseChoices: ["The story happens in a classroom.", "The story happens under the sea.", "The story happens on the moon.", "The story happens in a market at night."],
    knowledge: "The setting tells where and when a story happens.",
    masteryEvidence: "used story clues to identify the setting",
    model: ["where clue: classroom", "when clue: morning", "setting: classroom in the morning"],
    playAction: "Tap where and when clues, then choose the setting.",
    playInstruction: "Find the setting clues.",
    renderer: "PassageEvidenceRenderer",
    skill: "identify story setting using evidence",
    tapFacts: ["where tells place", "when tells time", "setting uses both clues"],
    tryAnswer: "where and when",
    tryChoices: ["where and when", "only the title"],
  },
  "grade2-story:Beginning": {
    activity: "Beginning Event Finder",
    chooseAnswer: "First, Ana found a lost puppy.",
    chooseChoices: ["First, Ana found a lost puppy.", "Last, Ana waved goodbye.", "Next, Ana ate lunch.", "The story happened at night."],
    knowledge: "The beginning tells what happens first in a story.",
    masteryEvidence: "identified the first event and matched it to story evidence",
    model: ["first event", "opening sentence", "beginning card"],
    playAction: "Place the first event card at the beginning of the story path.",
    playInstruction: "Find what happened first.",
    renderer: "SequenceEventsRenderer",
    skill: "identify the beginning of a story",
    tapFacts: ["beginning means first", "the opening sentence gives a clue", "first events start the story"],
    tryAnswer: "first event",
    tryChoices: ["first event", "last event"],
  },
  "grade2-story:Middle": {
    activity: "Middle Event Finder",
    chooseAnswer: "Next, Ana asked her teacher for help.",
    chooseChoices: ["Next, Ana asked her teacher for help.", "First, Ana woke up.", "Last, the puppy went home.", "The story happened at a farm."],
    knowledge: "The middle tells what happens after the beginning and before the ending.",
    masteryEvidence: "identified the middle event and placed it in order",
    model: ["beginning", "middle event", "ending"],
    playAction: "Place the middle event between the first and last story cards.",
    playInstruction: "Find what happened next.",
    renderer: "SequenceEventsRenderer",
    skill: "identify the middle of a story",
    tapFacts: ["middle comes after beginning", "middle comes before ending", "middle shows the next important action"],
    tryAnswer: "middle event",
    tryChoices: ["middle event", "title only"],
  },
  "grade2-story:Ending": {
    activity: "Ending Event Finder",
    chooseAnswer: "Last, the puppy went back home.",
    chooseChoices: ["Last, the puppy went back home.", "First, Ana found a puppy.", "Next, Ana asked for help.", "The story happened in a classroom."],
    knowledge: "The ending tells how the story finishes.",
    masteryEvidence: "identified the final event and explained how the story ended",
    model: ["last event", "finish", "ending card"],
    playAction: "Place the final event card at the end of the story path.",
    playInstruction: "Find how the story ends.",
    renderer: "SequenceEventsRenderer",
    skill: "identify the ending of a story",
    tapFacts: ["ending means last", "the final event closes the story", "ending tells how it finishes"],
    tryAnswer: "last event",
    tryChoices: ["last event", "first event"],
  },
  "grade2-story:Story Sequence": {
    activity: "Beginning Middle Ending Board",
    chooseAnswer: "Beginning, Middle, Ending",
    chooseChoices: ["Beginning, Middle, Ending", "Ending, Middle, Beginning", "Middle, Ending, Beginning", "Beginning, Ending, Middle"],
    knowledge: "Story sequence puts events in the order they happen.",
    masteryEvidence: "ordered beginning, middle, and ending event cards correctly",
    model: ["Beginning: find puppy", "Middle: ask for help", "Ending: puppy goes home"],
    playAction: "Arrange the story event cards in beginning, middle, and ending order.",
    playInstruction: "Put the story in order.",
    renderer: "SequenceEventsRenderer",
    skill: "sequence beginning, middle, and ending",
    tapFacts: ["beginning starts", "middle comes next", "ending finishes"],
    tryAnswer: "beginning, middle, ending",
    tryChoices: ["beginning, middle, ending", "ending, middle, beginning"],
  },
  "grade2-story:Character": {
    activity: "Character Evidence Board",
    chooseAnswer: "Maria is kind because she shared her lunch.",
    chooseChoices: ["Maria is kind because she shared her lunch.", "Maria is mean because she shared.", "Maria is loud because lunch is food.", "Maria is tired because school ended."],
    knowledge: "A character trait is supported by what a character says, thinks, or does.",
    masteryEvidence: "selected a character trait and matched it to story evidence",
    model: ["Maria shared her lunch.", "trait: kind", "evidence: shared her lunch"],
    playAction: "Place the trait and its proof on the character evidence board.",
    playInstruction: "Build the character evidence board.",
    renderer: "PassageEvidenceRenderer",
    skill: "explain a character trait using story evidence",
    tapFacts: ["Maria shared", "sharing helps another person", "the action is evidence for kind"],
    tryAnswer: "kind",
    tryChoices: ["kind", "mean"],
  },
  "grade2-story:Story Challenge": {
    activity: "Story Quest Master Mission",
    chooseAnswer: "Use the main idea, details, sequence, and character evidence.",
    chooseChoices: ["Use the main idea, details, sequence, and character evidence.", "Choose a title without reading.", "Use only the first sentence.", "Guess from the picture."],
    knowledge: "Strong story reasoning combines the main idea, supporting details, event order, and character evidence.",
    masteryEvidence: "completed one passage mission using all Story Quest skills",
    model: ["main idea", "supporting details", "beginning-middle-end", "character evidence"],
    playAction: "Read one passage, organize its events, and attach evidence to each answer.",
    playInstruction: "Solve the full story mission.",
    renderer: "MixedMissionRenderer",
    skill: "combine story comprehension skills in one evidence mission",
    tapFacts: ["main idea tells mostly what", "details provide proof", "sequence shows order", "actions reveal character"],
    tryAnswer: "supporting detail",
    tryChoices: ["supporting detail", "unrelated sentence"],
  },
  "grade2-community-explorer:Community Services": {
    activity: "Community Service Mission",
    chooseAnswer: "Firefighters protect people during a fire.",
    chooseChoices: ["Firefighters protect people during a fire.", "Librarians put out fires.", "Farmers teach every class.", "Doctors deliver every letter."],
    knowledge: "Community services meet needs such as safety, health, learning, and transportation.",
    masteryEvidence: "matched a community need to the service that solves it",
    model: ["fire - fire service", "illness - health service", "learning - school service"],
    playAction: "Route each community need to the service that can help.",
    playInstruction: "Connect needs to services.",
    renderer: "CommunityScenarioRenderer",
    skill: "explain which community service meets a need",
    tapFacts: ["fire service handles fires", "health service gives care", "school service supports learning"],
    tryAnswer: "fire service",
    tryChoices: ["fire service", "market stall"],
  },
  "grade2-community-explorer:Jobs": {
    activity: "Worker and Workplace Board",
    chooseAnswer: "A librarian helps people find books at a library.",
    chooseChoices: ["A librarian helps people find books at a library.", "A farmer works in a hospital operating room.", "A nurse repairs every road.", "A teacher drives every fire truck."],
    knowledge: "A community job connects a worker, workplace, tools, and service.",
    masteryEvidence: "matched workers to workplaces and explained their service",
    model: ["librarian - library - books", "farmer - farm - food", "nurse - clinic - care"],
    playAction: "Build worker, workplace, tool, and service matches.",
    playInstruction: "Build each job match.",
    renderer: "CommunityScenarioRenderer",
    skill: "connect community jobs to workplaces and services",
    tapFacts: ["librarians work with books", "farmers grow food", "nurses care for patients"],
    tryAnswer: "librarian - library",
    tryChoices: ["librarian - library", "librarian - farm"],
  },
  "grade2-community-explorer:Community Challenge": {
    activity: "Community Explorer Master Mission",
    chooseAnswer: "Match the need, place, service, and worker.",
    chooseChoices: ["Match the need, place, service, and worker.", "Choose the nearest building only.", "Match every need to the market.", "Use the worker's uniform color."],
    knowledge: "Community decisions use evidence about a person's need, the right place, the service, and the worker.",
    masteryEvidence: "completed linked place, service, and job scenarios",
    model: ["need", "community place", "service", "worker", "reason"],
    playAction: "Guide people through linked community scenarios and give a reason for each route.",
    playInstruction: "Complete the community mission.",
    renderer: "MixedMissionRenderer",
    skill: "solve community scenarios with reasons",
    tapFacts: ["identify the need first", "choose the matching service", "connect the worker and workplace"],
    tryAnswer: "identify the need",
    tryChoices: ["identify the need", "guess the building"],
  },
  "grade2-place-value:Place Value Challenge": {
    activity: "Place Value City Master Build",
    chooseAnswer: "427 is greater than 389 because it has more hundreds.",
    chooseChoices: ["427 is greater than 389 because it has more hundreds.", "389 is greater because 9 is the largest digit.", "The numbers are equal.", "427 is greater because 7 is greater than 9."],
    knowledge: "Place-value reasoning builds numbers and compares hundreds, then tens, then ones.",
    masteryEvidence: "built two numbers, compared them, and explained the deciding place",
    model: ["427: 4 hundreds, 2 tens, 7 ones", "389: 3 hundreds, 8 tens, 9 ones", "compare hundreds first"],
    playAction: "Build 427 and 389, place the comparison sign, and show which place proves it.",
    playInstruction: "Build, compare, and prove.",
    renderer: "BaseTenPlaceValueRenderer",
    skill: "build and compare three-digit numbers with place-value evidence",
    tapFacts: ["4 hundreds is 400", "3 hundreds is 300", "hundreds decide this comparison"],
    tryAnswer: "427",
    tryChoices: ["427", "389"],
  },
  "grade2-measurement:Measurement Challenge": {
    activity: "Measurement Harbor Master Mission",
    chooseAnswer: "Use a ruler, balance scale, and containers.",
    chooseChoices: ["Use a ruler, balance scale, and containers.", "Use a clock for every measurement.", "Guess by color.", "Use only the object's name."],
    knowledge: "Measurement reasoning selects a tool, measures carefully, compares results, and explains the evidence.",
    masteryEvidence: "measured length, compared weight, and tested capacity with the correct tools",
    model: ["ruler - length", "balance scale - weight", "containers - capacity"],
    playAction: "Measure, compare, sort, and choose the best tool at each harbor station.",
    playInstruction: "Complete the measurement stations.",
    renderer: "MeasurementToolRenderer",
    skill: "select and use measurement tools with evidence",
    tapFacts: ["rulers start at zero", "the heavier scale side moves down", "capacity is tested by filling"],
    tryAnswer: "ruler - length",
    tryChoices: ["ruler - length", "ruler - weight"],
  },
  "grade2-multiplication:Multiplication Challenge": {
    activity: "Multiplication Workshop Master Build",
    chooseAnswer: "3 groups of 4, 4 + 4 + 4, and a 3 by 4 array all show 12.",
    chooseChoices: ["3 groups of 4, 4 + 4 + 4, and a 3 by 4 array all show 12.", "3 groups of different sizes show 12.", "3 + 4 always means 12.", "A 3 by 4 array has 7 objects."],
    knowledge: "Equal groups, repeated addition, and arrays are connected models for multiplication.",
    masteryEvidence: "built equal groups and an array, then connected both to repeated addition",
    model: ["3 groups of 4", "4 + 4 + 4", "3 x 4", "3 rows of 4"],
    playAction: "Build all three multiplication models and connect them to the same total.",
    playInstruction: "Build and connect the models.",
    renderer: "ArrayBuilderRenderer",
    skill: "explain multiplication using groups, addition, and arrays",
    tapFacts: ["groups must be equal", "repeated addition uses the same addend", "arrays organize equal rows"],
    tryAnswer: "equal groups and array match",
    tryChoices: ["equal groups and array match", "unequal groups and array match"],
  },
  "grade2-challenge:Mixed Challenge": {
    activity: "Cross-Domain Reasoning Mission",
    chooseAnswer: "Use text evidence and math models.",
    chooseChoices: ["Use text evidence and math models.", "Guess every answer quickly.", "Use only vocabulary clues.", "Use only number size."],
    knowledge: "Mixed reasoning selects the right literacy evidence or mathematical model for each problem.",
    masteryEvidence: "completed linked literacy and numeracy reasoning stations",
    model: ["word relationship", "passage evidence", "place-value blocks", "measurement tool", "array"],
    playAction: "Choose the right reasoning workspace, complete its model, and attach proof.",
    playInstruction: "Solve the mixed reasoning mission.",
    renderer: "MixedMissionRenderer",
    skill: "switch strategies across literacy and numeracy tasks",
    tapFacts: ["words need meaning clues", "stories need evidence", "math needs models and tools"],
    tryAnswer: "choose the right workspace",
    tryChoices: ["choose the right workspace", "use one strategy for all"],
  },
  "grade2-challenge:Arena Challenge": {
    activity: "Grade 2 Arena Master Mission",
    chooseAnswer: "Complete every mission with evidence or model work.",
    chooseChoices: ["Complete every mission with evidence or model work.", "Complete one vocabulary question.", "Complete one counting question.", "Choose the fastest answer each time."],
    knowledge: "Grade 2 mastery requires reasoning, model use, evidence, and explanation across domains.",
    masteryEvidence: "completed the full mixed-domain mission board with evidence at every station",
    model: ["literacy evidence", "community reasoning", "base-ten model", "problem workspace", "measurement tool", "multiplication array"],
    playAction: "Complete the mission board and submit evidence or model work at every station.",
    playInstruction: "Finish the Grade 2 arena.",
    renderer: "MixedMissionRenderer",
    skill: "demonstrate Grade 2 reasoning across all major domains",
    tapFacts: ["read the task", "choose a strategy", "build or highlight evidence", "check and explain"],
    tryAnswer: "build or highlight evidence",
    tryChoices: ["build or highlight evidence", "guess and continue"],
  },
};

function getGrade2ContentBibleOverride(
  worldId: string,
  topicTitle: string
): TopicContentBibleOverride | null {
  const key = `${worldId}:${topicTitle}`;
  const blueprintKey = GRADE2_TOPIC_BLUEPRINT_ALIASES[key] ?? key;
  const summary =
    GRADE2_RECONSTRUCTION_BLUEPRINTS[key] ??
    GRADE2_RECONSTRUCTION_BLUEPRINTS[blueprintKey] ??
    GRADE2_TOPIC_BLUEPRINTS[blueprintKey];

  if (!summary) {
    return null;
  }

  const model = uniqueValues(summary.model, 4).slice(0, 5);
  const tapFacts = uniqueValues(summary.tapFacts, 3).slice(0, 5);
  const masteryRules: TopicMasteryRules = {
    conditions: [
      `Use the ${topicTitle} model in LOOK and TAP.`,
      `Answer the guided TRY item for ${topicTitle}.`,
      `Answer the independent CHOOSE item for ${topicTitle}.`,
      summary.masteryEvidence,
    ],
    competencyDemonstration: `Learner can ${summary.skill} by completing ${summary.activity}.`,
    evidenceRequired: [
      summary.masteryEvidence,
      `Completed ${summary.activity}.`,
      `Saved PLAY, STAR, PROGRESS, and MASTERED state for ${topicTitle}.`,
    ],
    minimumPlayAccuracy: 1,
    requiredStages: ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY", "STAR", "PROGRESS", "MASTERED"],
  };

  return {
    activityType: summary.activity,
    cognitiveFocus: `understanding and structured reasoning: ${summary.skill}`,
    content: {
      knowledge: summary.knowledge,
      learningObjective: `Grade 2 learner can ${summary.skill}.`,
      masteryRules,
      successCriteria: [
        `Explain the ${topicTitle} model.`,
        `Use a guided clue to solve ${topicTitle}.`,
        `Complete ${summary.activity}.`,
      ],
    },
    fundamentalSkill: summary.skill,
    requiredRenderer: summary.renderer,
    stageOverrides: {
      LOOK: {
        purpose: `Introduce ${topicTitle} through a Grade 2 model, passage, situation, or manipulative.`,
        instruction: `Study the ${topicTitle} model.`,
        learnerAction: `Notice ${model.join(", ")}.`,
        audioText: `${topicTitle}. ${summary.knowledge}`,
        imagePrompt: `Grade 2 ${topicTitle} model showing ${model.join(", ")}`,
        manipulatives: model,
        questionText: `What does the ${topicTitle} model show?`,
        teachingScript: summary.knowledge,
        visualContent: model,
      },
      TAP: {
        purpose: `Explore ${topicTitle} by tapping model parts and revealing reasoning clues.`,
        instruction: `Tap the ${topicTitle} clues.`,
        learnerAction: `Tap each part to reveal how ${topicTitle} works.`,
        discoveryContent: tapFacts,
        manipulatives: tapFacts,
        questionText: `Which clue helps explain ${topicTitle}?`,
      },
      TRY: {
        purpose: `Practice ${topicTitle} with a scaffolded Grade 2 clue.`,
        instruction: `Use the model to solve ${topicTitle}.`,
        learnerAction: `Choose ${summary.tryAnswer} with support.`,
        choices: summary.tryChoices,
        correctAnswer: summary.tryAnswer,
        feedbackCorrect: `Yes. ${summary.tryAnswer} fits the ${topicTitle} clue.`,
        feedbackWrong: `Use the model clue and try ${topicTitle} again.`,
      },
      CHOOSE: {
        purpose: `Solve ${topicTitle} independently with fewer supports.`,
        instruction: `Solve ${topicTitle} on your own.`,
        learnerAction: `Use the model or evidence to prove ${topicTitle}.`,
        choices: summary.chooseChoices,
        correctAnswer: summary.chooseAnswer,
        feedbackCorrect: `Correct. You used ${topicTitle} reasoning.`,
        feedbackWrong: `Check the model, clue, or story evidence again.`,
      },
      PLAY: {
        purpose: `Apply ${topicTitle} through ${summary.activity}.`,
        instruction: summary.playInstruction,
        learnerAction: summary.playAction,
        feedbackCorrect: `You completed ${summary.activity}.`,
        feedbackWrong: `Try again. Check the ${topicTitle} model clue.`,
        manipulatives: model,
        requiredAction:
          summary.renderer.includes("Sequence")
            ? "sequence"
            : summary.renderer.includes("Passage")
              ? "highlightEvidence"
              : summary.renderer.includes("Measurement")
                ? "move"
                : summary.renderer.includes("PlaceValue") ||
                    summary.renderer.includes("EqualGroups") ||
                    summary.renderer.includes("Array")
                  ? "build"
                  : summary.renderer.includes("WordProblem") ||
                      summary.renderer.includes("Mixed")
                    ? "solve"
                    : summary.renderer.includes("Community")
                      ? "match"
                      : "sort",
      },
      STAR: {
        feedbackCorrect: `You earned a star for ${topicTitle} reasoning.`,
      },
      PROGRESS: {
        instruction: `${topicTitle} progress saved.`,
        learnerAction: `View completed, current, and locked ${topicTitle} topics.`,
      },
      MASTERED: {
        instruction: `${topicTitle} Mastered!`,
        learnerAction: summary.masteryEvidence,
        masteryConditions: masteryRules.conditions,
      },
    },
  };
}

function getGrade3ContentBibleOverride(
  worldId: string,
  topicTitle: string
): TopicContentBibleOverride | null {
  const summary = getGrade3LiteracyBlueprint(worldId, topicTitle);

  if (!summary) {
    return null;
  }

  const model = uniqueValues(summary.model, 4).slice(0, 5);
  const tapFacts = uniqueValues(summary.tapFacts, 4).slice(0, 5);
  const evidenceSentences = uniqueValues(summary.evidence, 2).slice(0, 4);
  const masteryRules: TopicMasteryRules = {
    conditions: [
      `Read the ${topicTitle} passage or sentence set.`,
      `Tap or highlight evidence for ${topicTitle}.`,
      `Answer TRY and CHOOSE using text evidence.`,
      `Complete the ${topicTitle} PLAY task with 50% text evidence focus.`,
    ],
    competencyDemonstration: `Learner can ${summary.skill}.`,
    evidenceRequired: [
      summary.competency,
      `Highlighted or manipulated text evidence for ${topicTitle}.`,
      `Completed ${summary.playInstruction}.`,
    ],
    minimumPlayAccuracy: 1,
    requiredStages: ["LOOK", "TAP", "TRY", "CHOOSE", "PLAY", "STAR", "PROGRESS", "MASTERED"],
  };

  return {
    activityType: `${topicTitle} text-evidence mission`,
    cognitiveFocus: `Grade 3 literacy balance: 25% visual anchor, 25% interaction, 50% text evidence for ${summary.skill}.`,
    content: {
      competency: summary.competency,
      knowledge: summary.knowledge,
      learningObjective: `Grade 3 learner can ${summary.skill} using passage evidence.`,
      masteryRules,
      successCriteria: [
        `Read the ${topicTitle} text accurately.`,
        `Use text evidence before answering.`,
        `Complete the ${summary.playInstruction.toLowerCase()}.`,
      ],
    },
    fundamentalSkill: summary.skill,
    requiredRenderer: summary.renderer,
    stageOverrides: {
      LOOK: {
        audioContent: [summary.knowledge],
        audioText: `${topicTitle}. ${summary.knowledge}`,
        content: `${summary.knowledge} Text: ${summary.passage}`,
        imagePrompt: `Grade 3 ${topicTitle} visual anchor with text evidence cards; visual support only 25 percent of the activity.`,
        instruction: `Read the ${topicTitle} model.`,
        learnerAction: `Study the text model: ${model.join(", ")}.`,
        manipulatives: model,
        passage: summary.passage,
        purpose: `Introduce ${topicTitle} with a brief visual anchor and a text-first model.`,
        questionText: `What does the text show about ${topicTitle}?`,
        teachingScript: `${summary.knowledge} Use the passage evidence, not guessing.`,
        visualContent: summary.visualAnchors,
      },
      TAP: {
        audioText: tapFacts.join(" "),
        content: tapFacts.join(" "),
        discoveryContent: tapFacts,
        evidenceSentences,
        instruction: `Tap the ${topicTitle} evidence clues.`,
        learnerAction: `Tap text clues and explain how they support ${topicTitle}.`,
        manipulatives: evidenceSentences,
        passage: summary.passage,
        purpose: `Explore ${topicTitle} through active evidence taps.`,
        questionText: `Which evidence helps with ${topicTitle}?`,
        requiredInteractionCount: Math.min(4, Math.max(2, evidenceSentences.length)),
      },
      TRY: {
        choices: summary.tryChoices,
        content: summary.tryQuestion,
        correctAnswer: summary.tryAnswer,
        evidenceSentences,
        feedbackCorrect: `Correct. The text evidence supports ${summary.tryAnswer}.`,
        feedbackWrong: `Reread and tap the evidence for ${topicTitle}.`,
        instruction: `Use the text clue to answer.`,
        learnerAction: `Choose ${summary.tryAnswer} with support from the passage.`,
        passage: summary.passage,
        purpose: `Practice ${topicTitle} with one scaffolded evidence clue.`,
        questionText: summary.tryQuestion,
      },
      CHOOSE: {
        choices: summary.chooseChoices,
        content: summary.chooseQuestion,
        correctAnswer: summary.chooseAnswer,
        evidenceSentences,
        feedbackCorrect: `Correct. You used Grade 3 text evidence for ${topicTitle}.`,
        feedbackWrong: `Check the passage evidence before choosing.`,
        instruction: `Answer using evidence from the text.`,
        learnerAction: `Choose the best answer and be ready to point to the evidence.`,
        passage: summary.passage,
        purpose: `Check independent ${topicTitle} comprehension with reduced support.`,
        questionText: summary.chooseQuestion,
      },
      PLAY: {
        applicationActivity: {
          completionRule: `Complete when the learner finishes the ${topicTitle} mission with highlighted evidence or correctly arranged text cards.`,
          cognitiveSkill: "apply",
          competencyBehavior: summary.behavior as TopicCompetencyBehavior,
          goal: summary.playAction,
          masteryDemonstration: summary.competency,
          name: `${topicTitle} Evidence Mission`,
          realLifeContext: `reading a Grade 3 text and proving ${topicTitle} with evidence`,
          simulationType: `${summary.renderer}-grade3-literacy-workspace`,
          steps: [
            "Read the text first.",
            "Tap or move the evidence cards.",
            summary.playAction,
            "Submit only after evidence supports the answer.",
          ],
          type: "grade3-literacy-evidence-workspace",
        },
        content: summary.playAction,
        correctAnswer: summary.chooseAnswer,
        correctEvidence: evidenceSentences[0],
        evidenceSentences,
        feedbackCorrect: `You completed the ${topicTitle} evidence mission.`,
        feedbackWrong: `Try again. Use text evidence before answering.`,
        instruction: summary.playInstruction,
        learnerAction: summary.playAction,
        manipulatives: [...model, ...evidenceSentences],
        passage: summary.passage,
        purpose: `Apply ${topicTitle} in a Grade 3 text-evidence workspace.`,
        questionText: summary.playAction,
        requiredAction: summary.requiredAction as FrameworkStageContent["requiredAction"],
      },
      STAR: {
        feedbackCorrect: `You earned a star for Grade 3 ${topicTitle} evidence work.`,
      },
      PROGRESS: {
        instruction: `${topicTitle} progress saved.`,
        learnerAction: `View ${topicTitle} evidence, PLAY completion, and next literacy goal.`,
      },
      MASTERED: {
        instruction: `${topicTitle} Mastered!`,
        learnerAction: summary.competency,
        masteryConditions: masteryRules.conditions,
      },
    },
  };
}

function getTopicContentBibleOverride(
  gradeLevel: LearnerGradeLevel,
  worldId: string,
  topicTitle: string
) {
  if (gradeLevel === "Grade 1") {
    return getGrade1ContentBibleOverride(worldId, topicTitle);
  }

  if (gradeLevel === "Grade 2") {
    return getGrade2ContentBibleOverride(worldId, topicTitle);
  }

  if (gradeLevel === "Grade 3") {
    return getGrade3ContentBibleOverride(worldId, topicTitle);
  }

  return null;
}

function applyFrameworkStageOverrides(
  stages: FrameworkStageContent[],
  override: TopicContentBibleOverride | null
) {
  if (!override) {
    return stages;
  }

  return stages.map((stage) => ({
    ...stage,
    ...(override.stageOverrides[stage.stage] ?? {}),
  }));
}

function isScopedFamilyWordTopic(worldId: string, topicTitle: string) {
  return isScopedFamilyWorldTopic(worldId, topicTitle);
}

function getScopedPreschoolRecallPrompt(_worldId: string, _target: string) {
  return "What did we learn?";
}

function getScopedAnimalSoundSentence(topicTitle: string) {
  const sounds: Record<string, string> = {
    Bird: "Tweet tweet!",
    Cat: "Meow!",
    Cow: "Moo!",
    Dog: "Woof woof!",
    Duck: "Quack quack!",
    Fish: "Blub blub!",
    Horse: "Neigh!",
  };

  return sounds[topicTitle] ?? "";
}

function getScopedPreschoolReasonPrompt(worldId: string, target: string) {
  if (worldId === "preschool-animal-adventure") return getAnimalMeaning(target);
  if (worldId === "preschool-body-world") return getBodyMeaning(target);
  if (worldId === "preschool-colorful-world") return getColorMeaning(target);
  if (worldId === "preschool-family-world") return getScopedFamilyMeaning(target);
  if (worldId === "preschool-food-town") return getFoodMeaning(target);
  if (worldId === "preschool-fruit-garden") return getFruitMeaning(target);
  if (worldId === "preschool-shape-kingdom" || worldId === "kindergarten-shapes") {
    return getShapeMeaning(target);
  }

  return "Which answer fits?";
}

function getScopedPreschoolLookAudio(worldId: string, target: string) {
  const animalSound = worldId === "preschool-animal-adventure"
    ? getScopedAnimalSoundSentence(target)
    : "";

  return animalSound ? `This is ${target}. ${animalSound}` : `This is ${target}.`;
}

function applyScopedFamilyWordStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedFamilyWordTopic(worldId, topicTitle)) {
    return stages;
  }

  const isFamilyTopic = topicTitle === "Family";
  const targetConcept = isFamilyTopic ? "Family" : topicTitle;
  const correctWord = isFamilyTopic ? "Family" : topicTitle;
  const distractors = topics
    .filter((topic) => topic.title !== topicTitle)
    .filter((topic) => topic.title !== "What is Family?")
    .filter((topic) => topic.title !== "Family")
    .map((topic) => topic.title);
  const tryChoices = toIntegrityChoiceLabels(
    repairChoicesForTarget({
      choiceLimit: 2,
      choices: [correctWord, ...distractors].slice(0, 2),
      correctAnswer: correctWord,
      correctAssetConcept: targetConcept,
      distractorPool: distractors,
      targetConcept,
    }).activity.choices
  );
  const chooseChoices = toIntegrityChoiceLabels(
    repairChoicesForTarget({
      choiceLimit: 4,
      choices: [correctWord, ...distractors].slice(0, 4),
      correctAnswer: correctWord,
      correctAssetConcept: targetConcept,
      distractorPool: distractors,
      targetConcept,
    }).activity.choices
  );
  const scopedFamilyPlayConfig = getScopedFamilyPlayMissionConfig(topicTitle);
  const playInstruction = scopedFamilyPlayConfig.prompt;
  const playAction: FrameworkStageContent["requiredAction"] = isFamilyTopic
    ? "build"
    : "move";

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: tryChoices,
        correctAnswer: correctWord,
        correctAssetConcept: targetConcept,
        audioText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        instruction: getScopedPreschoolRecallPrompt(worldId, correctWord),
        learnerAction: `Recall ${targetConcept} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        targetConcept,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseChoices,
        correctAnswer: correctWord,
        correctAssetConcept: targetConcept,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept,
      };
    }

    if (stage.stage === "PLAY") {
      const scopedPlayConfig =
        topicTitle === "Home"
          ? {
              distractorItemIds: ["tree", "cow"],
              dropZoneId: scopedFamilyPlayConfig.dropZoneId,
              playMode: scopedFamilyPlayConfig.playMode,
              requiredDropItemIds: scopedFamilyPlayConfig.requiredCardIds,
              successText: scopedFamilyPlayConfig.successText,
            }
          : isFamilyTopic
            ? {
                distractorItemIds: ["tree"],
                dropZoneId: scopedFamilyPlayConfig.dropZoneId,
                playMode: scopedFamilyPlayConfig.playMode,
                requiredDropItemIds: scopedFamilyPlayConfig.requiredCardIds,
                successText: scopedFamilyPlayConfig.successText,
              }
            : {
                distractorItemIds: [],
                dropZoneId: scopedFamilyPlayConfig.dropZoneId,
                playMode: scopedFamilyPlayConfig.playMode,
                requiredDropItemIds: scopedFamilyPlayConfig.requiredCardIds,
                successText: scopedFamilyPlayConfig.successText,
              };

      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playInstruction,
        instruction: playInstruction,
        learnerAction: `${playInstruction} Press Done.`,
        questionText: playInstruction,
        requiredAction: playAction,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        targetConcept,
        ...scopedPlayConfig,
      };
    }

    return stage;
  });
}

function applyScopedBodyStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedBodyWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getBodyCorrectWord(topicTitle);
  const tryDistractor = getBodyTryDistractor(topicTitle);
  const chooseActivity = buildBodyChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildBodyPlayMission(topicTitle);
  const bodyPlayAction: FrameworkStageContent["requiredAction"] =
    getBodyPlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [correctWord, tryDistractor],
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        audioText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        instruction: getScopedPreschoolRecallPrompt(worldId, correctWord),
        learnerAction: `Recall ${correctWord} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: bodyPlayAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
      };
    }

    return stage;
  });
}

function applyScopedColorStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedColorWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getColorCorrectWord(topicTitle);
  const tryDistractor = getColorTryDistractor(topicTitle);
  const chooseActivity = buildColorChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildColorPlayMission(topicTitle);
  const playAction: FrameworkStageContent["requiredAction"] =
    getColorPlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [correctWord, tryDistractor],
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        audioText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        instruction: getScopedPreschoolRecallPrompt(worldId, correctWord),
        learnerAction: `Recall ${correctWord} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: playAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
      };
    }

    return stage;
  });
}

function applyScopedShapeStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedShapeWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getShapeCorrectWord(topicTitle);
  const tryDistractor = getShapeTryDistractor(topicTitle);
  const chooseActivity = buildShapeChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildShapePlayMission(topicTitle);
  const playAction: FrameworkStageContent["requiredAction"] =
    getShapePlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [correctWord, tryDistractor],
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        audioText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        instruction: getScopedPreschoolRecallPrompt(worldId, correctWord),
        learnerAction: `Recall ${correctWord} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: playAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
      };
    }

    return stage;
  });
}

function applyScopedAnimalStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedAnimalWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getAnimalCorrectWord(topicTitle);
  const tryDistractor = getAnimalTryDistractor(topicTitle);
  const chooseActivity = buildAnimalChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildAnimalPlayMission(topicTitle);
  const playAction: FrameworkStageContent["requiredAction"] =
    getAnimalPlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [correctWord, tryDistractor],
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        audioText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        instruction: getScopedPreschoolRecallPrompt(worldId, correctWord),
        learnerAction: `Recall ${correctWord} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: playAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
      };
    }

    return stage;
  });
}

function applyScopedFruitStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedFruitWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getFruitCorrectWord(topicTitle);
  const tryTarget = getFruitTryTarget(topicTitle);
  const tryDistractor = getFruitTryDistractor(topicTitle);
  const chooseActivity = buildFruitChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildFruitPlayMission(topicTitle);
  const playAction: FrameworkStageContent["requiredAction"] =
    getFruitPlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [tryTarget, tryDistractor],
        correctAnswer: tryTarget,
        correctAssetConcept: tryTarget,
        audioText: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        instruction: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        learnerAction: `Recall ${tryTarget} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        targetConcept: tryTarget,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        destinationId: playMission.destinationId,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: playAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
        targetFruitId: playMission.targetFruitId,
      };
    }

    return stage;
  });
}

function applyScopedFoodStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string,
  topics: CurriculumTopic[]
) {
  if (!isScopedFoodWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const correctWord = getFoodCorrectWord(topicTitle);
  const tryTarget = getFoodTryTarget(topicTitle);
  const tryDistractor = getFoodTryDistractor(topicTitle);
  const chooseActivity = buildFoodChooseActivity(
    topicTitle,
    topics.map((topic) => topic.title)
  );
  const playMission = buildFoodPlayMission(topicTitle);
  const playAction: FrameworkStageContent["requiredAction"] =
    getFoodPlayAction(topicTitle);

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        audioText: getScopedPreschoolLookAudio(worldId, correctWord),
        instruction: "Look carefully.",
        learnerAction: `Observe ${correctWord} with related pictures.`,
        questionText: "What do you see?",
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        audioText: `Tap ${correctWord}.`,
        instruction: `Tap ${correctWord}.`,
        learnerAction: `Tap ${correctWord}.`,
        requiredInteractionCount: 1,
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: [tryTarget, tryDistractor],
        correctAnswer: tryTarget,
        correctAssetConcept: tryTarget,
        audioText: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        instruction: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        learnerAction: `Recall ${tryTarget} without the model.`,
        questionText: getScopedPreschoolRecallPrompt(worldId, tryTarget),
        targetConcept: tryTarget,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        audioText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        choices: chooseActivity.choices,
        correctAnswer: correctWord,
        correctAssetConcept: correctWord,
        instruction: getScopedPreschoolReasonPrompt(worldId, correctWord),
        learnerAction: `Choose ${correctWord} from the clue.`,
        questionText: getScopedPreschoolReasonPrompt(worldId, correctWord),
        targetConcept: correctWord,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        audioText: playMission.prompt,
        destinationId: playMission.destinationId,
        distractorItemIds: playMission.distractorItemIds,
        instruction: playMission.prompt,
        learnerAction: `${playMission.prompt} Press Done.`,
        optionalDropItemIds: playMission.optionalDropItemIds,
        playMode: playMission.playMode,
        questionText: playMission.prompt,
        requiredAction: playAction,
        requiredDropItemIds: playMission.requiredDropItemIds,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: correctWord,
        targetFoodId: playMission.targetFoodId,
      };
    }

    return stage;
  });
}

const COUNTING_FOREST_QUANTITY_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
];

function getCountingForestDotLabel(quantity: number, topicTitle: string) {
  const topicLabel = topicTitle
    .replace(/^Counting\s+/i, "")
    .replace(/\s+Challenge$/i, "forest things")
    .toLowerCase();

  return `${topicLabel} ${COUNTING_FOREST_QUANTITY_WORDS[quantity] ?? "many"} dots`;
}

function getCountingForestQuantityChoices(
  choices: ReturnType<typeof buildCountingForestLesson>["choose"]["choices"],
  topicTitle: string
) {
  const labels = choices.map((choice) => getCountingForestDotLabel(choice.quantity, topicTitle));
  const correct = choices.find((choice) => choice.correct);

  return {
    choices: labels,
    correctAnswer: correct ? getCountingForestDotLabel(correct.quantity, topicTitle) : labels[0],
  };
}

function applyScopedCountingForestStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string
) {
  if (!isScopedCountingWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const lesson = buildCountingForestLesson(topicTitle);
  const firstMission = lesson.missions[0];
  const tryQuantityChoices = getCountingForestQuantityChoices(lesson.tryChoices, topicTitle);
  const chooseQuantityChoices = getCountingForestQuantityChoices(lesson.choose.choices, topicTitle);
  const forestMetadata = {
    countingRange: "visible objects only",
    countingSkill: "one-to-one counting, stable order, cardinality, exact quantity",
    forestMissionType: lesson.playMode,
    forestObjectAssetIds: lesson.assetPool,
    forestObjectTypes: Array.from(new Set(lesson.objectPool.map((item) => item.label))),
    quantityRange: lesson.quantityRange,
  };

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        ...forestMetadata,
        audioText: `Look. ${topicTitle}.`,
        answerVisibility: "delayed-highlight" as const,
        choices: undefined,
        correctAnswer: undefined,
        instruction: topicTitle,
        learnerAction: "Look at five topic pictures before counting.",
        questionText: topicTitle,
        targetConcept: "object group",
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        ...forestMetadata,
        audioText: "Touch each one.",
        answerVisibility: "visible" as const,
        choices: undefined,
        correctAnswer: undefined,
        instruction: "Tap and count.",
        learnerAction: "Tap every object once.",
        questionText: "Tap and count.",
        requiredAction: "touchCount" as const,
        requiredInteractionCount: lesson.tapObjects.length,
        targetConcept: "one-to-one counting",
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        ...forestMetadata,
        audioText: lesson.tryPrompt,
        answerVisibility: "hidden-until-response" as const,
        choices: tryQuantityChoices.choices,
        correctAnswer: tryQuantityChoices.correctAnswer,
        correctAssetConcept: tryQuantityChoices.correctAnswer,
        instruction: lesson.tryPrompt,
        learnerAction: "Remember the counted group and choose the dot group.",
        questionText: lesson.tryPrompt,
        requiredAction: "guidedChoose" as const,
        requiredInteractionCount: lesson.tryObjects.length,
        targetConcept: "cardinality recall",
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        ...forestMetadata,
        answerVisibility: "hidden-until-response" as const,
        choices: chooseQuantityChoices.choices,
        correctAnswer: chooseQuantityChoices.correctAnswer,
        correctAssetConcept: chooseQuantityChoices.correctAnswer,
        instruction: "Match the circles.",
        learnerAction: "Choose the object group that matches the target dots.",
        questionText: "Match the circles.",
        requiredAction: "independentChoose" as const,
        targetConcept: "exact quantity recognition",
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        ...forestMetadata,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        destinationId: firstMission.destinationId,
        instruction: firstMission.prompt,
        learnerAction: "Count, drag, then press Done.",
        playMode: lesson.playMode,
        questionText: firstMission.prompt,
        requiredAction: "drag" as const,
        requiredDropItemIds: firstMission.requiredObjects.map(
          (item, index) => `${item.id}-${index}`
        ),
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: "Forest mission complete!",
        targetConcept: "drag exact quantity",
        targetQuantity: firstMission.targetQuantity,
      };
    }

    return stage;
  });
}

function applyScopedNumberStageContract(
  stages: FrameworkStageContent[],
  worldId: string,
  topicTitle: string
) {
  if (!isScopedNumberWorldTopic(worldId, topicTitle)) {
    return stages;
  }

  const isChallenge = isNumberChallengeTopic(topicTitle);
  const numberWord = isChallenge ? "Count" : getNumberWord(topicTitle);
  const tryActivity = getNumberTryChoices(topicTitle);
  const chooseActivity = buildNumberChooseActivity(topicTitle);
  const playMission = buildNumberPlayMission(topicTitle);
  const firstMission = playMission.missions[0];
  const playAction: FrameworkStageContent["requiredAction"] = "count";

  return stages.map((stage) => {
    if (stage.stage === "LOOK") {
      return {
        ...stage,
        instruction: isChallenge ? "Look and count." : `Look at ${numberWord}.`,
        learnerAction: `See and hear ${numberWord}.`,
        audioText: isChallenge ? "Count one to ten." : numberWord,
        numberQuantity: firstMission.targetCount,
        targetConcept: isChallenge ? "Counting" : topicTitle,
      };
    }

    if (stage.stage === "TAP") {
      return {
        ...stage,
        instruction: isChallenge ? "Tap and count." : `Tap Number ${numberWord}.`,
        learnerAction: "Tap the number and hear its amount.",
        audioText: isChallenge ? "Tap and count." : `${numberWord}. ${firstMission.prompt}`,
        numberQuantity: firstMission.targetCount,
        requiredInteractionCount: 1,
        targetConcept: isChallenge ? "Counting" : topicTitle,
      };
    }

    if (stage.stage === "TRY") {
      return {
        ...stage,
        choices: tryActivity.choices,
        correctAnswer: tryActivity.correctAnswer,
        correctAssetConcept: tryActivity.correctAnswer,
        instruction: isChallenge ? "Find 5 objects." : `Find ${topicTitle}.`,
        learnerAction: `Tap ${tryActivity.correctAnswer}.`,
        questionText: isChallenge ? "Find 5 objects." : `Find ${topicTitle}.`,
        targetConcept: tryActivity.correctAnswer,
      };
    }

    if (stage.stage === "CHOOSE") {
      return {
        ...stage,
        choices: chooseActivity.choices,
        correctAnswer: chooseActivity.correctAnswer,
        correctAssetConcept: isChallenge ? "Number 4" : topicTitle,
        instruction: chooseActivity.format === "number-to-quantity" ? "Choose the group." : "Choose the word.",
        learnerAction: `Choose ${chooseActivity.correctAnswer}.`,
        numberQuantity: chooseActivity.quantity,
        questionText: chooseActivity.format === "number-to-quantity" ? `Which group shows ${chooseActivity.quantity}?` : "How many?",
        targetConcept: chooseActivity.correctAnswer,
      };
    }

    if (stage.stage === "PLAY") {
      return {
        ...stage,
        choices: undefined,
        correctAnswer: undefined,
        correctAnswerRepresentation: undefined,
        countingObject: firstMission.objectKind,
        destinationId: playMission.destinationId,
        instruction: isChallenge ? firstMission.prompt : firstMission.prompt,
        learnerAction: "Count, drag, then press Done.",
        numberCountingObject: firstMission.objectKind,
        numberDestination: firstMission.destinationLabel,
        numberMissionType: playMission.playMode,
        numberQuantity: firstMission.targetCount,
        playMode: playMission.playMode,
        quantityMissions: playMission.missions.map((mission) => ({
          availableCount: mission.availableCount,
          destinationId: mission.destinationId,
          destinationLabel: mission.destinationLabel,
          objectAssetTopicTitle: mission.objectAssetTopicTitle,
          objectAssetWorldId: mission.objectAssetWorldId,
          objectKind: mission.objectKind,
          prompt: mission.prompt,
          targetCount: mission.targetCount,
        })),
        questionText: firstMission.prompt,
        requiredAction: playAction,
        roundCount: 1,
        revealSuccessAfterRound: 1,
        successText: playMission.successText,
        targetConcept: isChallenge ? "Exact counting" : topicTitle,
        targetCount: firstMission.targetCount,
      };
    }

    return stage;
  });
}

function usesSingleCorrectAnswer(stage: FrameworkStageContent) {
  return (
    stage.stage === "TRY" ||
    stage.stage === "CHOOSE" ||
    (stage.stage === "PLAY" &&
      ["choose", "guidedChoose", "independentChoose"].includes(
        stage.requiredAction ?? ""
      ))
  );
}

function toIntegrityChoiceLabels(
  choices: ReturnType<typeof repairChoicesForTarget>["activity"]["choices"]
) {
  return (choices ?? []).map((choice) =>
    typeof choice === "string"
      ? choice
      : choice.label ?? choice.text ?? choice.title ?? choice.concept ?? choice.id ?? ""
  );
}

function normalizeFrameworkStageAnswerIntegrity(
  stages: FrameworkStageContent[],
  topics: CurriculumTopic[]
) {
  const topicDistractors = topics.map((topic) =>
    getCanonicalAnswerLabel(topic.title)
  );
  const stageDistractors = stages.flatMap((stage) => stage.choices ?? []);
  const distractorPool = uniqueNormalizedValues([
    ...topicDistractors,
    ...stageDistractors,
  ]);

  return stages.map((stage) => {
    const repairQuestions = (questions?: FrameworkQuestion[]) =>
      questions?.map((question) => {
        const repaired = repairChoicesForTarget({
          choiceLimit: question.choices.length,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
          distractorPool,
          targetConcept: question.correctAnswer,
        });

        return {
          ...question,
          choices: toIntegrityChoiceLabels(repaired.activity.choices),
        };
      });
    const guidedQuestions = repairQuestions(stage.guidedQuestions);
    const independentQuestions = repairQuestions(stage.independentQuestions);

    if (stage.stage === "TAP" && stage.choices?.length) {
      const correctAnswer = stage.correctAnswer ?? getCanonicalAnswerLabel(stage.targetConcept ?? "");
      const repaired = repairChoicesForTarget({
        choiceLimit: stage.choices.length,
        choices: stage.choices,
        correctAnswer,
        correctAssetConcept: stage.correctAssetConcept,
        distractorPool,
        targetConcept: stage.targetConcept ?? correctAnswer,
      });

      return {
        ...stage,
        choices: toIntegrityChoiceLabels(repaired.activity.choices),
        ...(correctAnswer ? { correctAnswer } : {}),
        ...(guidedQuestions ? { guidedQuestions } : {}),
        ...(independentQuestions ? { independentQuestions } : {}),
      };
    }

    if (!usesSingleCorrectAnswer(stage) || !stage.choices?.length) {
      return {
        ...stage,
        ...(guidedQuestions ? { guidedQuestions } : {}),
        ...(independentQuestions ? { independentQuestions } : {}),
      };
    }

    const correctAnswer = stage.correctAnswer ?? "";
    const repaired = repairChoicesForTarget({
      choiceLimit: stage.choices.length,
      choices: stage.choices,
      correctAnswer,
      correctAssetConcept: correctAnswer,
      distractorPool,
      targetConcept: correctAnswer,
    });

    return {
      ...stage,
      choices: toIntegrityChoiceLabels(repaired.activity.choices),
      correctAssetConcept: correctAnswer,
      targetConcept: correctAnswer,
      ...(guidedQuestions ? { guidedQuestions } : {}),
      ...(independentQuestions ? { independentQuestions } : {}),
    };
  });
}

function getRequiredStageRenderer(gradeLevel: LearnerGradeLevel, worldId: string, fallback: string) {
  const rendererByWorldId: Record<string, string> = {
    [GRADE1_FAMILY_STORY_WORLD_ID]: getGrade1FamilyStoryRenderer(),
    [GRADE1_MATH_WORLD_ID]: getGrade1MathRenderer(),
    [GRADE1_NATURE_WORLD_ID]: getGrade1NatureRenderer(),
    [GRADE1_NUMBER_WORLD_ID]: getGrade1NumberRenderer(),
    [GRADE1_READING_WORLD_ID]: getGrade1ReadingRenderer(),
    [GRADE1_SHAPE_WORLD_ID]: getGrade1ShapeRenderer(),
    [GRADE1_TIME_WORLD_ID]: getGrade1TimeRenderer(),
    [GRADE1_WORD_WORLD_ID]: getGrade1WordRenderer(),
    "grade2-challenge": "MixedMissionRenderer",
    "grade2-community-explorer": "CommunityScenarioRenderer",
    "grade2-measurement": "MeasurementToolRenderer",
    "grade2-multiplication": "EqualGroupsRenderer",
    "grade2-place-value": "BaseTenPlaceValueRenderer",
    "grade2-problems": "WordProblemWorkspaceRenderer",
    "grade2-story": "PassageEvidenceRenderer",
    "grade2-vocabulary": "VocabularyRelationshipRenderer",
    "grade3-context-clue-canyon": "ContextClueRenderer",
    "grade3-division": "DivisionSharingRenderer",
    "grade3-fractions": "FractionPartitionRenderer",
    "grade3-master": "MasterMissionRenderer",
    "grade3-money": "MoneyComposerRenderer",
    "grade3-multiplication": "MultiplicationArrayRenderer",
    "grade3-number": "MultiStepWorkspaceRenderer",
    "grade3-reading": "PassageEvidenceRenderer",
    "grade3-story-adventure": "StoryMapRenderer",
  };

  if (rendererByWorldId[worldId]) {
    return rendererByWorldId[worldId];
  }

  if (gradeLevel === "Preschool") {
    return "PreschoolRecognitionRenderer";
  }

  if (gradeLevel === "Kindergarten") {
    return "KindergartenFoundationalRenderer";
  }

  return fallback.replace(/\s+/g, "");
}

function getTopicChoiceTitles(
  topicItem: CurriculumTopic,
  topics: CurriculumTopic[],
  count: number,
  gradeLevel?: LearnerGradeLevel,
  worldId?: string
) {
  const correctAnswer = getCanonicalAnswerLabel(topicItem.title);
  const distractorPool = topics
    .filter((candidate) => candidate.title !== topicItem.title)
    .filter((candidate) => !/^What\s+(is|are)\b/i.test(candidate.title))
    .map((candidate) => getCanonicalAnswerLabel(candidate.title));
  const visualDistractors =
    gradeLevel === "Kindergarten"
      ? getKindergartenFriendlyDistractors(worldId, topicItem.category)
      : gradeLevel === "Grade 1"
        ? getGrade1FriendlyDistractors(worldId, topicItem.category)
        : gradeLevel === "Grade 2"
          ? getGrade2ReasoningDistractors(worldId, topicItem.category)
          : gradeLevel === "Grade 3"
            ? getGrade3ReasoningDistractors(worldId, topicItem.category)
            : [];
  const fullDistractorPool = uniqueNormalizedValues([
    ...distractorPool,
    ...visualDistractors,
  ]).filter((choice) => normalizeAnswerLabel(choice) !== normalizeAnswerLabel(correctAnswer));
  const repaired = repairChoicesForTarget({
    choiceLimit: count,
    choices: [correctAnswer, ...fullDistractorPool],
    correctAnswer,
    distractorPool: fullDistractorPool,
    targetConcept: correctAnswer,
  });

  const repairedChoices = (repaired.activity.choices ?? []).map((choice) =>
    typeof choice === "string"
      ? choice
      : choice.label ?? choice.text ?? choice.title ?? choice.concept ?? choice.id ?? ""
  );

  return stableShuffleValues(
    repairedChoices,
    `${gradeLevel ?? "grade"}-${worldId ?? "world"}-${topicItem.title}-${count}`
  );
}

function getKindergartenFriendlyDistractors(worldId?: string, category?: VocabularyCategory) {
  if (category === "numeric") {
    if (worldId === KINDERGARTEN_SHAPE_WORLD_ID) {
      return getKindergartenShapeFriendlyDistractors(category);
    }

    if (worldId === KINDERGARTEN_NUMBER_WORLD_ID) {
      return getKindergartenNumberFriendlyDistractors();
    }

    if (worldId === KINDERGARTEN_MATH_WORLD_ID) {
      return getKindergartenMathFriendlyDistractors();
    }

    if (worldId === KINDERGARTEN_PATTERN_WORLD_ID) {
      return getKindergartenPatternFriendlyDistractors();
    }

    return ["1", "2", "3", "4", "5", "More", "Less"];
  }

  const byWorld: Record<string, string[]> = {
    [KINDERGARTEN_ALPHABET_WORLD_ID]: getKindergartenAlphabetFriendlyDistractors(),
    [KINDERGARTEN_COMMUNITY_WORLD_ID]: getKindergartenCommunityFriendlyDistractors(),
    [KINDERGARTEN_NATURE_WORLD_ID]: getKindergartenNatureFriendlyDistractors(),
    [KINDERGARTEN_READING_WORLD_ID]: getKindergartenReadingFriendlyDistractors(),
    [KINDERGARTEN_SCHOOL_WORLD_ID]: getKindergartenSchoolFriendlyDistractors(),
    [KINDERGARTEN_SHAPE_WORLD_ID]: getKindergartenShapeFriendlyDistractors(),
  };

  return byWorld[worldId ?? ""] ?? ["Cat", "Dog", "Ball", "Book"];
}

function getGrade1FriendlyDistractors(worldId?: string, category?: VocabularyCategory) {
  if (category === "numeric" || worldId?.includes("number") || worldId?.includes("math")) {
    if (worldId === GRADE1_NUMBER_WORLD_ID) {
      return getGrade1NumberFriendlyDistractors();
    }

    if (worldId === GRADE1_MATH_WORLD_ID) {
      return getGrade1MathFriendlyDistractors();
    }

    return ["1", "2", "3", "4", "5", "10", "More", "Less"];
  }

  const byWorld: Record<string, string[]> = {
    [GRADE1_FAMILY_STORY_WORLD_ID]: getGrade1FamilyStoryFriendlyDistractors(),
    [GRADE1_NATURE_WORLD_ID]: getGrade1NatureFriendlyDistractors(),
    [GRADE1_READING_WORLD_ID]: getGrade1ReadingFriendlyDistractors(),
    [GRADE1_SHAPE_WORLD_ID]: getGrade1ShapeFriendlyDistractors(),
    [GRADE1_TIME_WORLD_ID]: getGrade1TimeFriendlyDistractors(),
    [GRADE1_WORD_WORLD_ID]: getGrade1WordFriendlyDistractors(),
  };

  return byWorld[worldId ?? ""] ?? ["Boy", "Dog", "Run", "Big"];
}

function getGrade2ReasoningDistractors(worldId?: string, category?: VocabularyCategory) {
  if (
    category === "numeric" ||
    worldId?.includes("place-value") ||
    worldId?.includes("problems") ||
    worldId?.includes("measurement") ||
    worldId?.includes("multiplication")
  ) {
    const numericByWorld: Record<string, string[]> = {
      "grade2-measurement": ["length", "height", "weight", "capacity", "tool"],
      "grade2-multiplication": ["equal groups", "array", "repeated addition", "product", "total"],
      "grade2-place-value": ["ones", "tens", "hundreds", "expanded form", "compare"],
      "grade2-problems": ["add", "subtract", "operation", "first step", "answer"],
    };

    return numericByWorld[worldId ?? ""] ?? ["model", "clue", "step", "answer", "check"];
  }

  const byWorld: Record<string, string[]> = {
    "grade2-challenge": ["model", "evidence", "answer", "check", "proof"],
    "grade2-community-explorer": ["place", "helper", "need", "service", "role"],
    "grade2-story": ["main idea", "detail", "character", "event order", "evidence"],
    "grade2-vocabulary": ["same meaning", "opposite", "compound word", "sentence clue", "meaning"],
  };

  return byWorld[worldId ?? ""] ?? ["model", "clue", "evidence", "answer", "proof"];
}

function getGrade3ReasoningDistractors(worldId?: string, category?: VocabularyCategory) {
  if (
    category === "numeric" ||
    worldId?.includes("number") ||
    worldId?.includes("multiplication") ||
    worldId?.includes("division") ||
    worldId?.includes("fractions") ||
    worldId?.includes("money")
  ) {
    const numericByWorld: Record<string, string[]> = {
      "grade3-division": ["share equally", "groups", "quotient", "remainder", "check"],
      "grade3-fractions": ["whole", "equal parts", "numerator", "denominator", "model"],
      "grade3-money": ["price", "total", "change", "coins", "bills"],
      "grade3-multiplication": ["array", "factor", "product", "expression", "strategy"],
      "grade3-number": ["step one", "step two", "equation", "estimate", "check"],
    };

    return numericByWorld[worldId ?? ""] ?? ["strategy", "model", "equation", "answer", "check"];
  }

  const byWorld: Record<string, string[]> = {
    "grade3-context-clue-canyon": ["definition clue", "example clue", "synonym clue", "antonym clue", "sentence context"],
    "grade3-reading": ["main idea", "supporting detail", "sequence", "cause", "text evidence"],
    "grade3-story-adventure": ["character", "setting", "problem", "solution", "theme"],
  };

  return byWorld[worldId ?? ""] ?? ["text evidence", "inference", "main idea", "detail", "reason"];
}

function normalizeAnswerLabel(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ");
}

function getCanonicalAnswerLabel(value: string) {
  return value
    .trim()
    .replace(/^What\s+(?:is|are)\s+/i, "")
    .replace(/\?+$/, "")
    .replace(/^(?:a|an|the)\s+/i, "")
    .trim();
}

function uniqueNormalizedValues(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = normalizeAnswerLabel(value);

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function getAnswerRepresentation(
  worldId: string,
  topicTitle: string
): FrameworkStageContent["correctAnswerRepresentation"] {
  const answer = normalizeAnswerLabel(getCanonicalAnswerLabel(topicTitle));

  if (answer === "home") {
    return "place-scene";
  }

  if (
    answer === "family" ||
    answer === "community" ||
    answer === "classroom" ||
    answer === "friends" ||
    /challenge/.test(answer) ||
    /^what-is-(family|community|classroom|friends)$/.test(
      worldId.replace(/^(preschool|kindergarten)-/, "")
    )
  ) {
    return "group-scene";
  }

  return "single-target";
}

function getTopicImagePrompt(gradeLevel: LearnerGradeLevel, world: CurriculumWorld, topicTitle: string) {
  if (gradeLevel === "Preschool") {
    return `large child-friendly ${topicTitle} illustration for ${world.title}`;
  }

  if (gradeLevel === "Kindergarten") {
    return `bright ${topicTitle} learning card with sound and picture support`;
  }

  if (gradeLevel === "Grade 1") {
    return `simple ${topicTitle} model for sentence, number, shape, or time practice`;
  }

  if (gradeLevel === "Grade 2") {
    return `structured ${topicTitle} model with manipulatives and problem-solving cues`;
  }

  return `reasoning model for ${topicTitle} with evidence, steps, or visual math`;
}

function getLookInstruction(gradeLevel: LearnerGradeLevel, topicTitle: string) {
  if (gradeLevel === "Preschool") {
    return `Look at ${topicTitle}.`;
  }

  if (gradeLevel === "Kindergarten") {
    return `Look at ${topicTitle}.`;
  }

  if (gradeLevel === "Grade 1") {
    return `Look at the picture. Read ${topicTitle}.`;
  }

  if (gradeLevel === "Grade 2") {
    return `Look at the ${topicTitle} model and notice the important parts.`;
  }

  return `Look at ${topicTitle} in the passage, model, or problem.`;
}

function getTapInstruction(gradeLevel: LearnerGradeLevel, topicTitle: string) {
  if (gradeLevel === "Preschool") {
    return `Tap ${topicTitle}.`;
  }

  if (gradeLevel === "Kindergarten") {
    return `Tap ${topicTitle}.`;
  }

  if (gradeLevel === "Grade 1") {
    return `Tap the card.`;
  }

  if (gradeLevel === "Grade 2") {
    return `Tap the ${topicTitle} model parts to see how they work.`;
  }

  return `Tap the clue, evidence, part, money value, or operation for ${topicTitle}.`;
}

function getPreschoolTargetNoun(topicTitle: string) {
  return topicTitle
    .replace(/^Number\s+/i, "number ")
    .replace(/&/g, "and")
    .trim();
}

function getPreschoolWorldStageCopy(
  stage: "LOOK" | "TAP" | "TRY" | "CHOOSE",
  worldId: string,
  topicTitle: string
) {
  if (worldId === "preschool-big-small") {
    return getSizeStageCopy(stage);
  }

  if (worldId === "preschool-more-less") {
    return getQuantityStageCopy(stage);
  }

  if (worldId === "preschool-pattern-playground") {
    return getPatternStageCopy(stage);
  }

  const target = getPreschoolTargetNoun(topicTitle);
  const stageCopy: Record<
    string,
    Record<typeof stage, { audioText: string; instruction: string; questionText: string }>
  > = {
    "preschool-animal-adventure": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find the ${target}?`, instruction: `Find the ${target}.`, questionText: `Where is the ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-body-world": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find the ${target}?`, instruction: `Find the ${target}.`, questionText: `Where is the ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-colorful-world": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find something ${target}?`, instruction: `Look for ${target}.`, questionText: `Where is something ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-counting-forest": {
      CHOOSE: { audioText: "Find this many.", instruction: "Choose the matching group.", questionText: "Which group matches the dots?" },
      LOOK: { audioText: "Look at the objects.", instruction: "Watch the object group.", questionText: "What do you see?" },
      TAP: { audioText: "Touch each object once.", instruction: "Touch each object one time.", questionText: "Can you touch each object once?" },
      TRY: { audioText: "How many did we count?", instruction: "Remember the count.", questionText: "How many did we count?" },
    },
    "preschool-family-world": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find ${target}?`, instruction: `Find ${target}.`, questionText: `Where is ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-food-town": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find the ${target}?`, instruction: `Find the ${target}.`, questionText: `Where is the ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-fruit-garden": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find the ${target}?`, instruction: `Find the ${target}.`, questionText: `Where is the ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
    "preschool-number-village": {
      CHOOSE: { audioText: "Match the numeral and quantity.", instruction: "Choose the group that matches.", questionText: "Which group matches the numeral?" },
      LOOK: { audioText: `Look for the numeral ${target}.`, instruction: "Observe the numeral.", questionText: "What numeral do you see?" },
      TAP: { audioText: `Tap the numeral ${target}.`, instruction: "Tap the numeral.", questionText: "Can you tap the numeral?" },
      TRY: { audioText: "Remember the numeral.", instruction: "Remember the numeral.", questionText: "Which numeral did you see?" },
    },
    "preschool-shape-kingdom": {
      CHOOSE: { audioText: getScopedPreschoolReasonPrompt(worldId, topicTitle), instruction: getScopedPreschoolReasonPrompt(worldId, topicTitle), questionText: getScopedPreschoolReasonPrompt(worldId, topicTitle) },
      LOOK: { audioText: `Can you find the ${target}?`, instruction: `Find the ${target}.`, questionText: `Where is the ${target}?` },
      TAP: { audioText: `Tap ${target}.`, instruction: `Tap ${target}.`, questionText: `Tap ${target}.` },
      TRY: { audioText: "What did we learn?", instruction: "What did we learn?", questionText: "What did we learn?" },
    },
  };

  return stageCopy[worldId]?.[stage] ?? {
    audioText: stage === "TRY" ? "What did we learn?" : stage === "CHOOSE" ? `Think about ${target}.` : `Find ${target}.`,
    instruction: stage === "TRY" ? "What did we learn?" : stage === "CHOOSE" ? `Choose using the clue.` : `Find ${target}.`,
    questionText: stage === "TRY" ? "What did we learn?" : stage === "CHOOSE" ? `Which answer makes sense?` : `Where is ${target}?`,
  };
}

function getPreschoolStageSupport(
  stage: FrameworkStageLabel,
  worldId: string,
  topicTitle: string
): Partial<FrameworkStageContent> {
  if (stage !== "LOOK" && stage !== "TAP" && stage !== "TRY" && stage !== "CHOOSE" && stage !== "PLAY") {
    return {};
  }

  const objectiveByStage: Partial<Record<FrameworkStageLabel, string>> = {
    CHOOSE: "Reason from a clue, comparison, relation, or missing part.",
    LOOK: "Observe, listen, and search before the answer is highlighted.",
    PLAY: "Apply the idea by observing, thinking, moving, and checking.",
    TAP: "Identify the target and ignore distractors.",
    TRY: "Recall from memory after the model is hidden.",
  };
  const sharedFeedback = {
    autoNarration: true,
    feedbackDurationMs: 300,
    successFeedbackMotion: "tiny-bounce glow success-sound positive-narration",
    wrongFeedbackMotion: "small-shake retry-narration",
  };

  if (stage === "PLAY") {
    return {
      ...sharedFeedback,
      answerVisibility: "hidden-until-response",
      cognitiveObjective: objectiveByStage.PLAY,
      randomization: ["object order", "object position", "distractors", "group size"],
    };
  }

  const copy = getPreschoolWorldStageCopy(stage, worldId, topicTitle);

  if (stage === "LOOK") {
    return {
      ...sharedFeedback,
      answerVisibility: "delayed-highlight",
      audioText: copy.audioText,
      cognitiveObjective: objectiveByStage.LOOK,
      instruction: copy.instruction,
      questionText: copy.questionText,
      randomization: ["object position", "distractors"],
      revealDelayMs: 2300,
    };
  }

  if (stage === "TAP") {
    return {
      ...sharedFeedback,
      answerVisibility: "visible",
      audioText: copy.audioText,
      cognitiveObjective: objectiveByStage.TAP,
      instruction: copy.instruction,
      questionText: copy.questionText,
      randomization: ["object order", "object position", "distractors"],
    };
  }

  if (stage === "TRY") {
    return {
      ...sharedFeedback,
      answerVisibility: "hidden-until-response",
      audioText: copy.audioText,
      cognitiveObjective: objectiveByStage.TRY,
      instruction: copy.instruction,
      questionText: copy.questionText,
      randomization: ["answer order", "distractors"],
    };
  }

  return {
    ...sharedFeedback,
    answerVisibility: "hidden-until-response",
    audioText: copy.audioText,
    cognitiveObjective: objectiveByStage.CHOOSE,
    instruction: copy.instruction,
    questionText: copy.questionText,
    randomization: ["answer order", "distractors", "group size"],
  };
}

function getPlayInstruction(
  gradeLevel: LearnerGradeLevel,
  topicTitle: string,
  renderer: string,
  worldId?: string
) {
  if (gradeLevel === "Preschool") {
    return `Play with ${topicTitle}.`;
  }

  if (gradeLevel === "Kindergarten") {
    if (worldId === KINDERGARTEN_NUMBER_WORLD_ID) {
      return getKindergartenNumberPlayInstruction(topicTitle);
    }

    return `Play with ${topicTitle}.`;
  }

  if (gradeLevel === "Grade 1") {
    return `Use ${topicTitle}.`;
  }

  if (gradeLevel === "Grade 2") {
    return `Solve a ${topicTitle} challenge using ${renderer}.`;
  }

  return `Complete a ${topicTitle} reasoning mission using ${renderer}.`;
}

function getStageAction(
  stage: FrameworkStageLabel,
  gradeLevel: LearnerGradeLevel,
  renderer: string,
  worldId?: string
): FrameworkStageContent["requiredAction"] {
  if (stage === "LOOK") {
    return "look";
  }

  if (stage === "TAP") {
    return "tap";
  }

  if (stage === "TRY") {
    return gradeLevel === "Preschool" || gradeLevel === "Kindergarten"
      ? "guidedChoose"
      : "solve";
  }

  if (stage === "CHOOSE") {
    return gradeLevel === "Preschool" || gradeLevel === "Kindergarten"
      ? "independentChoose"
      : "solve";
  }

  if (stage === "STAR" || stage === "PROGRESS" || stage === "MASTERED") {
    return "tap";
  }

  if (gradeLevel === "Preschool") {
    if (renderer === "PreschoolPictureChoiceRenderer") {
      return "independentChoose";
    }

    if (renderer === "PreschoolDragDropRenderer") return "drag";
    if (renderer === "PreschoolMatchingRenderer") return "match";
    if (renderer === "PreschoolSortingRenderer") return "sort";
    if (renderer === "PreschoolTouchCountRenderer") return "touchCount";
    if (renderer === "PreschoolTenFrameBuilderRenderer" || renderer === "PreschoolBuildRenderer") return "build";
    if (renderer === "PreschoolMiniMissionRenderer") return "collect";

    const preschoolPlayActions: Record<string, FrameworkStageContent["requiredAction"]> = {
      "preschool-animal-adventure": "collect",
      "preschool-big-small": "sort",
      "preschool-body-world": "build",
      "preschool-colorful-world": "sort",
      "preschool-counting-forest": "touchCount",
      "preschool-family-world": "match",
      "preschool-food-town": "collect",
      "preschool-fruit-garden": "collect",
      "preschool-more-less": "move",
      "preschool-number-village": "build",
      "preschool-pattern-playground": "build",
      "preschool-shape-kingdom": "match",
    };

    return preschoolPlayActions[worldId ?? ""] ?? "match";
  }

  if (gradeLevel === "Kindergarten" && worldId === KINDERGARTEN_NUMBER_WORLD_ID) {
    return getKindergartenNumberForestPlayAction(renderer);
  }

  if (gradeLevel === "Kindergarten") {
    const kindergartenPlayActions: Record<
      string,
      FrameworkStageContent["requiredAction"]
    > = {
      [KINDERGARTEN_ALPHABET_WORLD_ID]: getKindergartenAlphabetPlayAction(),
      [KINDERGARTEN_COMMUNITY_WORLD_ID]: getKindergartenCommunityPlayAction(),
      [KINDERGARTEN_NATURE_WORLD_ID]: getKindergartenNaturePlayAction(),
      [KINDERGARTEN_MATH_WORLD_ID]: getKindergartenMathPlayAction(),
      [KINDERGARTEN_PATTERN_WORLD_ID]: getKindergartenPatternPlayAction(),
      "kindergarten-problem-solving": "sort",
      [KINDERGARTEN_READING_WORLD_ID]: getKindergartenReadingPlayAction(),
      [KINDERGARTEN_SCHOOL_WORLD_ID]: getKindergartenSchoolPlayAction(),
      [KINDERGARTEN_SHAPE_WORLD_ID]: getKindergartenShapePlayAction(),
    };

    return kindergartenPlayActions[worldId ?? ""] ?? "match";
  }

  if (gradeLevel === "Grade 1") {
    if (/WordCategorySorter|WordSorter/i.test(renderer)) {
      return "sort";
    }

    if (/SentenceBuilder|MiniStory|StoryCharacter|StorySequence/i.test(renderer)) {
      return "sequence";
    }

    if (/AddTakeAway|AdditionObject|SubtractionObject|ObjectCounter/i.test(renderer)) {
      return "count";
    }

    if (/NumberComparison|NumberLine|Time|Clock|RoutineBuilder/i.test(renderer)) {
      return "sequence";
    }

    if (/ShapeExplorer|ShapeProperty/i.test(renderer)) {
      return "build";
    }

    return "match";
  }

  if (renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("StoryMap") || renderer.includes("VocabularyInContext")) {
    return "highlightEvidence";
  }

  if (renderer.includes("Fraction")) {
    return "partition";
  }

  if (renderer.includes("Money")) {
    return "compose";
  }

  if (renderer.includes("PlaceValue") || renderer.includes("Counter") || renderer.includes("Multiplication") || renderer.includes("Division") || renderer.includes("EqualGroups") || renderer.includes("Array")) {
    return "count";
  }

  if (renderer.includes("Time") || renderer.includes("NumberLine")) {
    return "sequence";
  }

  if (renderer.includes("Sorter") || renderer.includes("Shape")) {
    return "sort";
  }

  return gradeLevel === "Grade 2" || gradeLevel === "Grade 3"
    ? "solve"
    : "independentChoose";
}

function getPreschoolPlayInstruction(worldId: string, topicTitle: string) {
  if (worldId === "preschool-family-world") {
    const familyInstructionByTopic: Record<string, string> = {
      Baby: "Help Baby.",
      Brother: "Share with Brother.",
      Family: "Help everyone on Family Day.",
      Father: "Bring Father the right tools.",
      Friend: "Play kindly with Friend.",
      Home: "Organize the house.",
      Mother: "Help Mother clean up.",
      Sister: "Pack Sister's school bag.",
      "What is Family?": "Help the family together.",
    };

    return familyInstructionByTopic[topicTitle] ?? `Help ${topicTitle}.`;
  }

  if (worldId === "preschool-body-world") {
    const bodyInstructionByTopic: Record<string, string> = {
      Body: "Help the child.",
      Ears: "Find the sound.",
      Eyes: "Find what you see.",
      Feet: "Walk to the goal.",
      Hair: "Find Hair.",
      Hands: "Pick up toys.",
      Head: "Build the child.",
      Mouth: "Feed the child.",
      Nose: "Find the nice smell.",
      Teeth: "Brush Teeth.",
    };

    return bodyInstructionByTopic[topicTitle] ?? `Use ${topicTitle}.`;
  }

  if (worldId === "preschool-colorful-world") {
    const colorInstructionByTopic: Record<string, string> = {
      Black: "Find black things.",
      Blue: "Catch blue things.",
      Green: "Grow green plants.",
      Orange: "Pick orange fruits.",
      Purple: "Sort purple things.",
      "Rainbow Color Challenge": "Build the rainbow.",
      Red: "Sort red things.",
      White: "Find white things.",
      Yellow: "Paint yellow.",
    };

    return colorInstructionByTopic[topicTitle] ?? `Use ${topicTitle}.`;
  }

  if (worldId === "preschool-shape-kingdom") {
    const shapeInstructionByTopic: Record<string, string> = {
      Circle: "Find all circles.",
      Rectangle: "Pack rectangles.",
      "Shape Challenge": "Build a house.",
      Square: "Sort squares.",
      Star: "Catch stars.",
      Triangle: "Build a roof.",
    };

    return shapeInstructionByTopic[topicTitle] ?? `Use ${topicTitle}.`;
  }

  if (worldId === "preschool-animal-adventure") {
    const animalInstructionByTopic: Record<string, string> = {
      "Animal Challenge": "Rescue the animals.",
      Bird: "Help Bird home.",
      Cat: "Find Cat's toy.",
      Cow: "Feed Cow.",
      Dog: "Feed Dog.",
      Duck: "Help Duck swim.",
      Fish: "Put Fish in water.",
      Horse: "Help Horse.",
    };

    return animalInstructionByTopic[topicTitle] ?? `Help ${topicTitle}.`;
  }

  if (worldId === "preschool-fruit-garden") {
    const fruitInstructionByTopic: Record<string, string> = {
      Apple: "Pick apples.",
      Banana: "Feed the monkey.",
      "Fruit Challenge": "Collect all fruits.",
      Grapes: "Pick grapes.",
      Mango: "Harvest mangoes.",
      Orange: "Collect oranges.",
      Watermelon: "Load watermelons.",
    };

    return fruitInstructionByTopic[topicTitle] ?? `Collect ${topicTitle}.`;
  }

  if (worldId === "preschool-food-town") {
    const foodInstructionByTopic: Record<string, string> = {
      Bread: "Build a sandwich.",
      Egg: "Collect eggs.",
      Fish: "Prepare fish.",
      "Food Challenge": "Make a meal.",
      Juice: "Serve drinks.",
      Meat: "Cook dinner.",
      Milk: "Give milk.",
      Rice: "Serve rice.",
      Vegetables: "Sort healthy foods.",
    };

    return foodInstructionByTopic[topicTitle] ?? `Prepare ${topicTitle}.`;
  }

  if (worldId === "preschool-number-village") {
    const quantity = Number(topicTitle.match(/\d+/)?.[0]);
    const instructionByQuantity: Record<number, string> = {
      1: "Feed one apple.",
      2: "Fill with two balloons.",
      3: "Feed three fish.",
      4: "Plant four flowers.",
      5: "Collect five stars.",
      6: "Pack six balls.",
      7: "Feed seven carrots.",
      8: "Gather eight fruits.",
      9: "Find nine birds.",
      10: "Fill the ten frame.",
    };

    return topicTitle === "Number Challenge"
      ? "Build numbers one to ten."
      : instructionByQuantity[quantity] ?? `Build ${topicTitle}.`;
  }

  if (worldId === "preschool-big-small") {
    return getSizePlayInstruction(topicTitle);
  }

  if (worldId === "preschool-more-less") {
    return getQuantityPlayInstruction(topicTitle);
  }

  if (worldId === "preschool-pattern-playground") {
    return getPatternPlayInstruction();
  }

  const instructionByWorld: Record<string, string> = {
    "preschool-big-small": "Sort the matching size.",
    "preschool-counting-forest": "Touch each object. Then count.",
    "preschool-food-town": `Feed ${topicTitle} to BatiBot.`,
    "preschool-fruit-garden": `Put ${topicTitle} in the basket.`,
    "preschool-more-less": "Move the matching group.",
    "preschool-number-village": `Build ${topicTitle} in the frame.`,
  };

  return instructionByWorld[worldId] ?? `Match ${topicTitle}.`;
}

function getPreschoolPlayRenderer(worldId: string, topicTitle: string) {
  return getPreschoolPlayRendererName(worldId, topicTitle);
}

function getColorStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-colorful-world") {
    return {};
  }

  const colorTarget = getCanonicalAnswerLabel(topicTitle);
  const colorObjectsByTarget: Record<string, string[]> = {
    Black: ["black cat", "black shoe", "black hat"],
    Blue: ["blue fish", "blue ball", "blue bird"],
    Green: ["green leaf", "green grass", "green tree"],
    Orange: ["orange fruit", "orange carrot", "orange pumpkin"],
    Purple: ["purple grapes", "purple flower", "purple balloon"],
    Red: ["red apple", "red balloon", "red flower"],
    "Rainbow Color Challenge": ["red", "orange", "yellow", "green", "blue", "purple"],
    White: ["white cloud", "white milk", "white flower"],
    Yellow: ["yellow star", "yellow sun", "yellow banana"],
  };

  return {
    colorObjectLabels: colorObjectsByTarget[colorTarget] ?? [],
    colorTarget,
  };
}

function getShapeStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-shape-kingdom") {
    return {};
  }

  const shapeTarget = getCanonicalAnswerLabel(topicTitle);
  const shapeObjectsByTarget: Record<string, string[]> = {
    Circle: ["circle ball", "circle clock", "circle wheel"],
    Rectangle: ["rectangle book", "rectangle door", "rectangle phone"],
    "Shape Challenge": ["circle", "square", "triangle", "rectangle", "star"],
    Square: ["square tile", "square window", "square box"],
    Star: ["star sky", "star badge", "star light"],
    Triangle: ["triangle roof", "triangle sign", "triangle flag"],
  };

  return {
    shapeObjectLabels: shapeObjectsByTarget[shapeTarget] ?? [],
    shapeTarget,
  };
}

function getAnimalStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-animal-adventure") {
    return {};
  }

  const metadataByAnimal: Record<
    string,
    {
      animalFoodOrActivity: string;
      animalHome: string;
      animalSound: string;
    }
  > = {
    "Animal Challenge": {
      animalFoodOrActivity: "animal care",
      animalHome: "animal homes",
      animalSound: "animal sounds",
    },
    Bird: {
      animalFoodOrActivity: "seed",
      animalHome: "nest",
      animalSound: "tweet",
    },
    Cat: {
      animalFoodOrActivity: "yarn ball",
      animalHome: "cat house",
      animalSound: "meow",
    },
    Cow: {
      animalFoodOrActivity: "grass",
      animalHome: "farm",
      animalSound: "moo",
    },
    Dog: {
      animalFoodOrActivity: "bone",
      animalHome: "dog house",
      animalSound: "woof",
    },
    Fish: {
      animalFoodOrActivity: "swims",
      animalHome: "water",
      animalSound: "splash",
    },
    Horse: {
      animalFoodOrActivity: "hay",
      animalHome: "stable",
      animalSound: "neigh",
    },
  };

  return metadataByAnimal[getCanonicalAnswerLabel(topicTitle)] ?? {};
}

function getFruitStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-fruit-garden") {
    return {};
  }

  const challengeItems = ["Apple", "Banana", "Mango", "Orange", "Grapes", "Watermelon"];
  const metadataByFruit: Record<
    string,
    {
      fruitColor: string;
      fruitCharacteristic: string;
      fruitCollectionTarget: string;
      fruitChallengeItems?: string[];
    }
  > = {
    Apple: {
      fruitColor: "red",
      fruitCharacteristic: "round",
      fruitCollectionTarget: "apple basket",
    },
    Banana: {
      fruitColor: "yellow",
      fruitCharacteristic: "long",
      fruitCollectionTarget: "monkey",
    },
    Mango: {
      fruitColor: "yellow-orange",
      fruitCharacteristic: "sweet",
      fruitCollectionTarget: "mango basket",
    },
    Orange: {
      fruitColor: "orange",
      fruitCharacteristic: "round",
      fruitCollectionTarget: "orange basket",
    },
    Grapes: {
      fruitColor: "purple",
      fruitCharacteristic: "grow in bunches",
      fruitCollectionTarget: "grape basket",
    },
    Watermelon: {
      fruitColor: "green",
      fruitCharacteristic: "big",
      fruitCollectionTarget: "wagon",
    },
    "Fruit Challenge": {
      fruitColor: "many colors",
      fruitCharacteristic: "six garden fruits",
      fruitCollectionTarget: "fruit baskets",
      fruitChallengeItems: challengeItems,
    },
  };

  return metadataByFruit[getCanonicalAnswerLabel(topicTitle)] ?? {};
}

function getFoodStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-food-town") {
    return {};
  }

  const challengeItems = ["Rice", "Bread", "Milk", "Egg", "Fish", "Vegetables", "Meat", "Juice"];
  const metadataByFood: Record<
    string,
    {
      foodChallengeItems?: string[];
      foodGroup: string;
      foodLearningFact: string;
      foodMealTarget: string;
      foodMissionType: string;
    }
  > = {
    Bread: {
      foodGroup: "food",
      foodLearningFact: "Food to eat.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Egg: {
      foodGroup: "food",
      foodLearningFact: "Food to eat.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Fish: {
      foodGroup: "healthy food",
      foodLearningFact: "Fish is healthy food.",
      foodMealTarget: "meal plate",
      foodMissionType: "prepare",
    },
    "Food Challenge": {
      foodChallengeItems: challengeItems,
      foodGroup: "foods and drinks",
      foodLearningFact: "Foods and drinks make a meal.",
      foodMealTarget: "feast table",
      foodMissionType: "feast",
    },
    Juice: {
      foodGroup: "drink",
      foodLearningFact: "Drink to enjoy.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Meat: {
      foodGroup: "food",
      foodLearningFact: "Food to eat.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Milk: {
      foodGroup: "drink",
      foodLearningFact: "Drink for strong body.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Rice: {
      foodGroup: "food",
      foodLearningFact: "Food to eat.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
    Vegetables: {
      foodGroup: "healthy food",
      foodLearningFact: "Food to eat.",
      foodMealTarget: "table",
      foodMissionType: "serve",
    },
  };

  return metadataByFood[getCanonicalAnswerLabel(topicTitle)] ?? {};
}

function getNumberStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== "preschool-number-village") {
    return {};
  }

  const quantity = Number(topicTitle.match(/\d+/)?.[0]);
  const metadataByQuantity: Record<
    number,
    {
      numberCountingObject: string;
      numberDestination: string;
      numberMissionType: string;
    }
  > = {
    1: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    2: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    3: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    4: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    5: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    6: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    7: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    8: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    9: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
    10: { numberCountingObject: "apple", numberDestination: "match area", numberMissionType: "count-and-match" },
  };

  if (getCanonicalAnswerLabel(topicTitle) === "Number Challenge") {
    return {
      numberChallengeItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      numberCountingObject: "apple",
      numberDestination: "match area",
      numberMissionType: "count-and-match",
      numberQuantity: 3,
    };
  }

  return Number.isFinite(quantity)
    ? { ...metadataByQuantity[quantity], numberQuantity: quantity }
    : {};
}

function getCountingForestStageMetadata(worldId: string, topicTitle: string) {
  if (worldId !== KINDERGARTEN_NUMBER_WORLD_ID) {
    return {};
  }

  return getKindergartenNumberStageMetadata(
    getCanonicalAnswerLabel(topicTitle)
  ) ?? {};
}

function getSizeStageMetadata(worldId: string, topicTitle: string) {
  if (!isScopedSizeWorldTopic(worldId, topicTitle)) {
    return {};
  }

  return getScopedSizeStageMetadata(getCanonicalAnswerLabel(topicTitle));
}

function getQuantityStageMetadata(worldId: string, topicTitle: string) {
  if (!isScopedQuantityWorldTopic(worldId, topicTitle)) {
    return {};
  }

  return getScopedQuantityStageMetadata(getCanonicalAnswerLabel(topicTitle));
}

function getPatternStageMetadata(worldId: string, topicTitle: string) {
  if (worldId === KINDERGARTEN_PATTERN_WORLD_ID) {
    return getKindergartenPatternStageMetadata(
      getCanonicalAnswerLabel(topicTitle)
    );
  }

  if (!isScopedPatternWorldTopic(worldId, topicTitle)) {
    return {};
  }

  return getScopedPatternStageMetadata(getCanonicalAnswerLabel(topicTitle));
}

function getRendererManipulatives(renderer: string, topicTitle: string) {
  if (renderer.includes("PlaceValue")) {
    return ["hundreds block", "tens rod", "ones cube", topicTitle];
  }

  if (renderer.includes("Measurement")) {
    return ["ruler", "balance pan", "capacity container", topicTitle];
  }

  if (renderer.includes("Multiplication") || renderer.includes("EqualGroups") || renderer.includes("Array")) {
    return ["array rows", "equal groups", "repeated addition cards", topicTitle];
  }

  if (renderer.includes("CommunityScenario")) {
    return ["scenario card", "community place cards", "helper cards", topicTitle];
  }

  if (renderer.includes("CompoundWord")) {
    return ["first word part", "second word part", "compound word card", topicTitle];
  }

  if (renderer.includes("MixedMission")) {
    return ["mission station", "model card", "evidence card", "answer tray", topicTitle];
  }

  if (renderer.includes("Division")) {
    return ["share counters", "friend groups", "fairness check", topicTitle];
  }

  if (renderer.includes("Fraction")) {
    return ["whole shape", "equal parts", "colored partition", topicTitle];
  }

  if (renderer.includes("Money")) {
    return ["coins", "bills", "price tag", "change tray", topicTitle];
  }

  if (renderer.includes("NumberLine")) {
    return ["number line", "before marker", "after marker", topicTitle];
  }

  if (renderer.includes("Counter")) {
    return ["add counters", "take-away counters", "number sentence", topicTitle];
  }

  if (renderer.includes("Time")) {
    return ["clock face", "hour hand", "routine cards", topicTitle];
  }

  if (renderer.includes("Sorter")) {
    return ["category bins", "word cards", topicTitle];
  }

  if (renderer.includes("Story") || renderer.includes("Evidence") || renderer.includes("Context") || renderer.includes("VocabularyInContext") || renderer.includes("SequenceEvents")) {
    return ["passage card", "evidence highlighter", "answer card", topicTitle];
  }

  return [topicTitle];
}

function getCurriculumHash(value: string) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 17);
}

function pickScenarioWord(seed: string, words: string[]) {
  return words[getCurriculumHash(seed) % words.length];
}

function getTopicQuestion(topicTitle: string, world: CurriculumWorld, renderer: string) {
  if (renderer.includes("Context") || renderer.includes("VocabularyInContext")) {
    return `Which clue explains ${topicTitle} in the ${world.title} passage?`;
  }

  if (renderer.includes("Story")) {
    return `Which story part proves ${topicTitle}?`;
  }

  if (renderer.includes("PlaceValue")) {
    return `How do the blocks show ${topicTitle}?`;
  }

  if (renderer.includes("Measurement")) {
    return `Which tool result shows ${topicTitle}?`;
  }

  if (renderer.includes("Multiplication") || renderer.includes("EqualGroups") || renderer.includes("Array")) {
    return `How many are shown in the ${topicTitle} groups or array?`;
  }

  if (renderer.includes("Division")) {
    return `How can the objects be shared for ${topicTitle}?`;
  }

  if (renderer.includes("Fraction")) {
    return `Which partition shows ${topicTitle}?`;
  }

  if (renderer.includes("Money")) {
    return `Which coins or bills solve ${topicTitle}?`;
  }

  return `What does ${topicTitle} show in ${world.title}?`;
}

function getTopicPassage(
  gradeLevel: LearnerGradeLevel,
  topicTitle: string,
  world: CurriculumWorld,
  renderer: string
) {
  const learner = pickScenarioWord(`${world.id}-${topicTitle}-learner`, [
    "Ana",
    "Ben",
    "Lito",
    "Mia",
    "Rafa",
    "Tala",
  ]);
  const place = pickScenarioWord(`${world.id}-${topicTitle}-place`, [
    "classroom",
    "garden",
    "market",
    "home",
    "library",
    "playground",
  ]);

  if (gradeLevel === "Grade 3" && renderer.includes("Story")) {
    return `${learner} visited the ${place} and noticed a problem about ${topicTitle}. The clue in the story shows what happened first and how it changed. Use the evidence to complete the story map.`;
  }

  if (gradeLevel === "Grade 3" && (renderer.includes("Context") || renderer.includes("VocabularyInContext"))) {
    return `${learner} read a sentence about ${topicTitle} during a ${world.title} mission. The nearby words give a clue, so the meaning can be inferred from evidence.`;
  }

  if (gradeLevel === "Grade 2" && (renderer.includes("Evidence") || renderer.includes("SequenceEvents"))) {
    return `${learner} read a short ${world.title} passage about ${topicTitle}. One sentence gives the answer and one sentence gives a detail. Tap the evidence before choosing.`;
  }

  if (gradeLevel === "Grade 2" || gradeLevel === "Grade 3") {
    return `${learner} uses the ${world.title} model for ${topicTitle}. Inspect the tool, workspace, or model before solving.`;
  }

  return `${topicTitle} belongs in ${world.title}. Watch, tap, and practice the topic.`;
}

function getEvidenceSentences(topicTitle: string, renderer: string, world: CurriculumWorld) {
  if (renderer.includes("Context")) {
    return [
      `${topicTitle} has clue words in the ${world.title} sentence.`,
      `The words around ${topicTitle} explain the meaning.`,
    ];
  }

  if (renderer.includes("Story") || renderer.includes("SequenceEvents")) {
    return [
      `${topicTitle} belongs in one part of the ${world.title} story map.`,
      `The story evidence points to ${topicTitle}.`,
    ];
  }

  if (renderer.includes("Evidence") || renderer.includes("VocabularyInContext")) {
    return [
      `${topicTitle} is supported by a sentence in ${world.title}.`,
      `Tap the sentence that proves ${topicTitle}.`,
    ];
  }

  return [`Use the ${topicTitle} model in ${world.title} to prove the answer.`];
}

function uniqueValues(values: string[], minimum = 0) {
  const unique = Array.from(new Set(values.filter(Boolean)));

  while (unique.length < minimum) {
    unique.push(`${unique[unique.length % Math.max(unique.length, 1)] ?? "practice"} ${unique.length + 1}`);
  }

  return unique;
}

function getStableShuffleScore(value: string, seed: string) {
  const text = `${seed}:${value}`;
  let score = 0;

  for (let index = 0; index < text.length; index += 1) {
    score = (score * 31 + text.charCodeAt(index)) % 1000003;
  }

  return score;
}

function stableShuffleValues(values: string[], seed: string) {
  return uniqueNormalizedValues(values)
    .map((value) => ({ score: getStableShuffleScore(value, seed), value }))
    .sort((left, right) => left.score - right.score)
    .map((item) => item.value);
}

function getGrade1TopicKey(world: CurriculumWorld, topicTitle: string) {
  return `${world.id}:${topicTitle}`;
}

function getGrade1TopicExamplePool(world: CurriculumWorld, topicTitle: string) {
  const key = getGrade1TopicKey(world, topicTitle);
  const pools: Record<string, string[]> = {
    "grade1-family-story-village:Family Sentences": [
      "Mother cooks rice.",
      "Father reads a book.",
      "Ate helps baby.",
      "Kuya sweeps the floor.",
      "Lola waters plants.",
      "Lolo fixes a chair.",
      "The family eats lunch.",
      "Ana hugs Mother.",
      "Ben folds clothes.",
      "Mia sets the table.",
    ],
    "grade1-family-story-village:Family Stories": [
      "Ana helped Mother cook soup.",
      "Ben shared bread with Lolo.",
      "Mia watered Lola's flowers.",
      "Rafa packed his school bag.",
      "Tala fed the family cat.",
      "Nico cleaned the table.",
      "Ella read to Baby.",
      "Lito carried vegetables.",
      "Sari washed her cup.",
      "Noel fixed a toy car.",
    ],
    "grade1-family-story-village:Story Characters": [
      "Ana",
      "Ben",
      "Mia",
      "Rafa",
      "Tala",
      "Nico",
      "Ella",
      "Lito",
      "Sari",
      "Noel",
    ],
    "grade1-family-story-village:What Happened?": [
      "Ana cooked soup.",
      "Ben shared bread.",
      "Mia watered flowers.",
      "Rafa packed a bag.",
      "Tala fed the cat.",
      "Nico cleaned the table.",
      "Ella read a story.",
      "Lito carried vegetables.",
      "Sari washed a cup.",
      "Noel fixed a toy.",
    ],
    "grade1-family-story-village:Who Did It?": [
      "Ana helped Mother.",
      "Ben gave bread.",
      "Mia watered plants.",
      "Rafa packed books.",
      "Tala fed the cat.",
      "Nico wiped the table.",
      "Ella read aloud.",
      "Lito carried food.",
      "Sari washed dishes.",
      "Noel fixed wheels.",
    ],
    "grade1-math:Addition Facts": [
      "2 apples + 3 apples",
      "4 shells + 1 shell",
      "5 blocks + 2 blocks",
      "6 beads + 3 beads",
      "7 seeds + 1 seed",
      "3 crayons + 4 crayons",
      "8 cups + 2 cups",
      "9 stars + 1 star",
      "10 buttons + 5 buttons",
      "12 sticks + 6 sticks",
    ],
    "grade1-math:Add with Objects": [
      "put 3 mangoes with 2 mangoes",
      "join 4 toy cars and 3 toy cars",
      "combine 5 counters and 4 counters",
      "add 6 shells to 2 shells",
      "collect 7 leaves and 1 leaf",
      "place 8 blocks with 2 blocks",
      "join 9 beads and 3 beads",
      "add 10 seeds to 4 seeds",
      "combine 11 buttons and 5 buttons",
      "put 12 stones with 6 stones",
    ],
    "grade1-math:Number Sentences": [
      "3 + 2 = 5",
      "6 - 1 = 5",
      "4 + 4 = 8",
      "9 - 3 = 6",
      "7 + 2 = 9",
      "10 - 5 = 5",
      "8 + 1 = 9",
      "12 - 2 = 10",
      "5 + 6 = 11",
      "14 - 4 = 10",
    ],
    "grade1-math:Subtraction Facts": [
      "5 apples - 2 apples",
      "6 shells - 1 shell",
      "8 blocks - 3 blocks",
      "9 beads - 4 beads",
      "10 seeds - 2 seeds",
      "7 crayons - 5 crayons",
      "12 cups - 6 cups",
      "15 stars - 5 stars",
      "18 buttons - 8 buttons",
      "20 sticks - 10 sticks",
    ],
    "grade1-math:Take Away with Objects": [
      "take 2 mangoes from 5 mangoes",
      "give away 3 toy cars from 7 toy cars",
      "remove 4 counters from 9 counters",
      "take 1 shell from 6 shells",
      "remove 5 leaves from 8 leaves",
      "give away 2 blocks from 10 blocks",
      "take 3 beads from 12 beads",
      "remove 4 seeds from 14 seeds",
      "give away 5 buttons from 15 buttons",
      "take 6 stones from 16 stones",
    ],
    "grade1-nature:Describing Nature": [
      "wide river",
      "tall mountain",
      "green forest",
      "bright flower",
      "strong tree",
      "clear water",
      "rocky path",
      "soft grass",
      "deep shade",
      "fresh air",
    ],
    "grade1-nature:Flower": [
      "sampaguita",
      "rose",
      "gumamela",
      "sunflower",
      "orchid",
      "daisy",
      "yellow petal",
      "green stem",
      "flower bud",
      "garden flower",
    ],
    "grade1-nature:Forest": [
      "many trees",
      "forest path",
      "bird nest",
      "cool shade",
      "wild plants",
      "fallen leaves",
      "tree roots",
      "forest animals",
      "mossy rock",
      "quiet trail",
    ],
    "grade1-nature:Mountain": [
      "high mountain",
      "rocky slope",
      "mountain trail",
      "cool air",
      "hilltop view",
      "big rocks",
      "steep path",
      "cloudy peak",
      "mountain plants",
      "far valley",
    ],
    "grade1-nature:River": [
      "flowing water",
      "riverbank",
      "small fish",
      "smooth stones",
      "bridge",
      "clear stream",
      "water path",
      "river plant",
      "wet sand",
      "boat",
    ],
    "grade1-nature:Tree": [
      "mango tree",
      "coconut tree",
      "narra tree",
      "tree trunk",
      "green leaves",
      "strong branches",
      "tree roots",
      "tree shade",
      "fruit tree",
      "young seedling",
    ],
    "grade1-number-kingdom:Before and After Numbers": [
      "14, 15, 16",
      "21, 22, 23",
      "34, 35, 36",
      "48, 49, 50",
      "59, 60, 61",
      "67, 68, 69",
      "72, 73, 74",
      "81, 82, 83",
      "90, 91, 92",
      "98, 99, 100",
    ],
    "grade1-number-kingdom:Equal To": [
      "4 counters and 4 counters",
      "8 blocks and 8 blocks",
      "12 shells and 12 shells",
      "15 beads and 15 beads",
      "20 seeds and 20 seeds",
      "25 stars and 25 stars",
      "30 sticks and 30 sticks",
      "40 buttons and 40 buttons",
      "50 dots and 50 dots",
      "60 cubes and 60 cubes",
    ],
    "grade1-number-kingdom:Greater Than": [
      "9 is greater than 4",
      "15 is greater than 12",
      "28 is greater than 19",
      "35 is greater than 30",
      "46 is greater than 41",
      "57 is greater than 49",
      "68 is greater than 60",
      "79 is greater than 70",
      "88 is greater than 81",
      "100 is greater than 99",
    ],
    "grade1-number-kingdom:Less Than": [
      "3 is less than 7",
      "11 is less than 16",
      "24 is less than 29",
      "31 is less than 40",
      "42 is less than 47",
      "53 is less than 58",
      "64 is less than 69",
      "75 is less than 80",
      "86 is less than 90",
      "97 is less than 100",
    ],
    "grade1-number-kingdom:Number Order": [
      "11, 12, 13",
      "18, 19, 20",
      "25, 26, 27",
      "32, 33, 34",
      "40, 41, 42",
      "51, 52, 53",
      "63, 64, 65",
      "76, 77, 78",
      "88, 89, 90",
      "98, 99, 100",
    ],
    "grade1-number-kingdom:Numbers 1-100": [
      "1 counter",
      "10 sticks",
      "15 shells",
      "23 beads",
      "34 blocks",
      "45 seeds",
      "56 stars",
      "67 buttons",
      "78 cubes",
      "100 dots",
    ],
    "grade1-reading:Come": [
      "Come here.",
      "Come with me.",
      "Come to class.",
      "Come and play.",
      "Come to the table.",
      "Come home early.",
      "Come inside.",
      "Come to Mother.",
      "Come and read.",
      "Come to school.",
    ],
    "grade1-reading:Go": [
      "Go to school.",
      "Go home.",
      "Go to the park.",
      "Go outside.",
      "Go to class.",
      "Go to the garden.",
      "Go with Father.",
      "Go to the market.",
      "Go and play.",
      "Go to the door.",
    ],
    "grade1-reading:I": [
      "I read.",
      "I write.",
      "I play.",
      "I eat.",
      "I see.",
      "I go.",
      "I come.",
      "I look.",
      "I help.",
      "I sing.",
    ],
    "grade1-reading:Look": [
      "Look at the dog.",
      "Look at the flower.",
      "Look at the book.",
      "Look at the clock.",
      "Look at the tree.",
      "Look at the bird.",
      "Look at the ball.",
      "Look at the river.",
      "Look at the shape.",
      "Look at the number.",
    ],
    "grade1-reading:See": [
      "I see a bird.",
      "I see a cat.",
      "I see a tree.",
      "I see a flower.",
      "I see a book.",
      "We see a river.",
      "You see a dog.",
      "I see a clock.",
      "We see a mountain.",
      "You see a ball.",
    ],
    "grade1-reading:Sentence Completion": [
      "I see a ___.",
      "We go to ___.",
      "You read a ___.",
      "I look at the ___.",
      "We come to ___.",
      "The dog can ___.",
      "The flower is ___.",
      "I have a ___.",
      "You can ___.",
      "We like the ___.",
    ],
    "grade1-reading:Simple Sentences": [
      "I read books.",
      "You play outside.",
      "We go to school.",
      "The dog runs.",
      "The cat sleeps.",
      "Mother cooks rice.",
      "Father fixes a chair.",
      "The bird flies.",
      "The child writes.",
      "The flower grows.",
    ],
    "grade1-reading:We": [
      "We read.",
      "We play.",
      "We sing.",
      "We write.",
      "We help.",
      "We eat.",
      "We go.",
      "We come.",
      "We look.",
      "We see.",
    ],
    "grade1-reading:You": [
      "You read.",
      "You play.",
      "You write.",
      "You help.",
      "You eat.",
      "You go.",
      "You come.",
      "You look.",
      "You see.",
      "You sing.",
    ],
    "grade1-shapes:Circle": [
      "clock face",
      "wheel",
      "coin",
      "ball",
      "plate",
      "button",
      "ring",
      "sun picture",
      "round cookie",
      "circle sign",
    ],
    "grade1-shapes:Real Object Shapes": [
      "clock is circle",
      "door is rectangle",
      "tile is square",
      "roof is triangle",
      "book is rectangle",
      "ball is circle",
      "window is square",
      "slice is triangle",
      "phone is rectangle",
      "button is circle",
    ],
    "grade1-shapes:Rectangle": [
      "door",
      "book",
      "phone",
      "window",
      "notebook",
      "tabletop",
      "paper",
      "whiteboard",
      "mat",
      "picture frame",
    ],
    "grade1-shapes:Sides and Corners": [
      "triangle has 3 sides",
      "square has 4 sides",
      "rectangle has 4 corners",
      "circle has no corners",
      "triangle has 3 corners",
      "square has 4 corners",
      "rectangle has 4 sides",
      "shape edge",
      "shape corner",
      "curved side",
    ],
    "grade1-shapes:Square": [
      "floor tile",
      "block face",
      "window pane",
      "chessboard square",
      "sticky note",
      "gift box side",
      "square cracker",
      "small frame",
      "pattern tile",
      "square sign",
    ],
    "grade1-shapes:Triangle": [
      "roof",
      "pizza slice",
      "flag",
      "mountain drawing",
      "triangle ruler",
      "sandwich half",
      "party hat",
      "warning sign",
      "kite part",
      "slice of watermelon",
    ],
    "grade1-time-town:Afternoon": [
      "eat lunch",
      "read after lunch",
      "play outside",
      "water plants",
      "do homework",
      "walk home",
      "clean the table",
      "help in the kitchen",
      "rest after class",
      "draw pictures",
    ],
    "grade1-time-town:Clock": [
      "wall clock",
      "clock face",
      "hour hand",
      "minute hand",
      "number 12",
      "number 3",
      "number 6",
      "number 9",
      "alarm clock",
      "classroom clock",
    ],
    "grade1-time-town:Daily Routine Order": [
      "wake up",
      "brush teeth",
      "eat breakfast",
      "go to school",
      "eat lunch",
      "play outside",
      "do homework",
      "eat dinner",
      "take a bath",
      "sleep",
    ],
    "grade1-time-town:Evening": [
      "eat dinner",
      "wash dishes",
      "take a bath",
      "read a story",
      "prepare clothes",
      "say good night",
      "turn off light",
      "sleep",
      "pack bag",
      "brush teeth at night",
    ],
    "grade1-time-town:Hour": [
      "1 o'clock",
      "2 o'clock",
      "3 o'clock",
      "4 o'clock",
      "5 o'clock",
      "6 o'clock",
      "7 o'clock",
      "8 o'clock",
      "9 o'clock",
      "10 o'clock",
    ],
    "grade1-time-town:Morning": [
      "wake up",
      "brush teeth",
      "wash face",
      "eat breakfast",
      "wear uniform",
      "pack bag",
      "go to school",
      "greet teacher",
      "read morning words",
      "start class",
    ],
    "grade1-word-kingdom:Action Words": [
      "run",
      "jump",
      "read",
      "write",
      "swim",
      "clap",
      "walk",
      "sing",
      "dance",
      "draw",
    ],
    "grade1-word-kingdom:Adjectives": [
      "big",
      "small",
      "tall",
      "short",
      "happy",
      "sad",
      "red",
      "soft",
      "round",
      "clean",
    ],
    "grade1-word-kingdom:Describing Words": [
      "bright",
      "dark",
      "long",
      "short",
      "sweet",
      "loud",
      "quiet",
      "heavy",
      "light",
      "smooth",
    ],
    "grade1-word-kingdom:Naming Words": [
      "teacher",
      "school",
      "dog",
      "book",
      "child",
      "garden",
      "bird",
      "chair",
      "market",
      "river",
    ],
    "grade1-word-kingdom:Nouns": [
      "boy",
      "girl",
      "teacher",
      "doctor",
      "school",
      "park",
      "dog",
      "cat",
      "book",
      "ball",
    ],
    "grade1-word-kingdom:Verbs": [
      "run",
      "jump",
      "read",
      "write",
      "swim",
      "eat",
      "walk",
      "sing",
      "dance",
      "draw",
    ],
    "grade1-word-kingdom:Word Kingdom Mastery Challenge": [
      "dog",
      "runs",
      "happy",
      "cat",
      "jumps",
      "small",
      "teacher",
      "reads",
      "kind",
      "book",
    ],
    "grade1-word-kingdom:Opposite Words": [
      "big",
      "small",
      "hot",
      "cold",
      "happy",
      "sad",
      "open",
      "close",
      "fast",
      "slow",
    ],
    "grade1-word-kingdom:Similar Words": [
      "big",
      "large",
      "happy",
      "glad",
      "tiny",
      "small",
      "quick",
      "fast",
      "little",
      "small",
    ],
    "grade1-word-kingdom:Word Challenge": [
      "teacher",
      "run",
      "big",
      "small",
      "school",
      "read",
      "happy",
      "glad",
      "dog",
      "write",
    ],
  };

  if (world.id.startsWith("grade1-")) {
    return pools[key] ?? [
      `${topicTitle} meaning card`,
      `${topicTitle} property card`,
      `${topicTitle} use card`,
      `${topicTitle} recognition clue`,
      `${topicTitle} sentence clue`,
      `${topicTitle} model clue`,
      `${topicTitle} category clue`,
      `${topicTitle} relationship clue`,
      `${topicTitle} routine clue`,
      `${topicTitle} application card`,
    ];
  }

  return null;
}

function getContentExamplePool(renderer: string, world: CurriculumWorld, topicTitle: string) {
  const grade1Examples = getGrade1TopicExamplePool(world, topicTitle);

  if (grade1Examples) {
    return grade1Examples;
  }

  if (renderer.includes("Sorter")) {
    return [
      "boy",
      "girl",
      "teacher",
      "school",
      "park",
      "market",
      "dog",
      "cat",
      "book",
      "ball",
      "chair",
      topicTitle,
    ];
  }

  if (renderer.includes("Sentence")) {
    return [
      "I read books.",
      "You play outside.",
      "We go to school.",
      "I see a bird.",
      "We come home.",
      "Look at the dog.",
      "The child reads.",
      "The family eats.",
      `${topicTitle} fits the sentence.`,
      `${world.title} has a sentence about ${topicTitle}.`,
    ];
  }

  if (renderer.includes("PlaceValue")) {
    return ["10 ones", "1 ten", "2 tens", "35", "47", "60", "100", "124", "three tens and five ones", topicTitle];
  }

  if (renderer.includes("Measurement")) {
    return ["short pencil", "long ribbon", "cup of water", "heavy bag", "light leaf", "centimeter", "meter", "kilogram", "liter", topicTitle];
  }

  if (renderer.includes("Multiplication")) {
    return ["2 groups of 3", "3 rows of 4", "4 + 4 + 4", "5 groups of 2", "array", "equal groups", "factor", "product", "repeated addition", topicTitle];
  }

  if (renderer.includes("Division")) {
    return ["12 shared by 3", "8 shared by 4", "equal shares", "groups of 2", "quotient", "leftover", "fair share", "divide", "sharing counters", topicTitle];
  }

  if (renderer.includes("Fraction")) {
    return ["one half", "one third", "one fourth", "two equal parts", "three equal parts", "numerator", "denominator", "whole", "partition", topicTitle];
  }

  if (renderer.includes("Money")) {
    return ["one peso coin", "five peso coin", "ten peso coin", "twenty peso bill", "price tag", "total cost", "change", "buy", "sell", topicTitle];
  }

  if (renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("VocabularyInContext") || renderer.includes("Story")) {
    return [
      "clue word",
      "sentence evidence",
      "character",
      "setting",
      "problem",
      "solution",
      "detail",
      "main idea",
      "meaning in sentence",
      topicTitle,
    ];
  }

  if (renderer.includes("Time")) {
    return ["clock", "hour hand", "minute hand", "7 o'clock", "morning", "afternoon", "evening", "routine", "first", topicTitle];
  }

  if (renderer.includes("Shape")) {
    return ["circle", "square", "triangle", "rectangle", "side", "corner", "curve", "clock", "door", topicTitle];
  }

  if (renderer.includes("NumberLine") || renderer.includes("Counter") || renderer.includes("MultiStep")) {
    return ["1", "5", "10", "before", "after", "greater than", "less than", "equal", "add", "take away", topicTitle];
  }

  return [
    topicTitle,
    world.title,
    "example card",
    "answer card",
    "model part",
    "practice item",
    "challenge item",
    "audio word",
    "visual clue",
    "mastery item",
  ];
}

function getGrade1TopicNonExamplePool(world: CurriculumWorld, topicTitle: string): [string, string][] | null {
  if (!world.id.startsWith("grade1-")) {
    return null;
  }

  if (world.id === "grade1-word-kingdom") {
    if (/noun|naming/i.test(topicTitle)) {
      return [
        ["run", "Run is an action, not a naming word."],
        ["fast", "Fast describes how something happens."],
        ["blue", "Blue describes color."],
        ["jump", "Jump tells what someone does."],
        ["happy", "Happy describes a feeling."],
      ];
    }

    if (/verb|action/i.test(topicTitle)) {
      return [
        ["school", "School names a place."],
        ["dog", "Dog names an animal."],
        ["blue", "Blue describes color."],
        ["big", "Big describes size."],
        ["chair", "Chair names a thing."],
      ];
    }

    if (/opposite/i.test(topicTitle)) {
      return [
        ["big and large", "Big and large are similar, not opposite."],
        ["happy and glad", "Happy and glad are similar, not opposite."],
        ["tiny and small", "Tiny and small are similar, not opposite."],
        ["quick and fast", "Quick and fast are similar, not opposite."],
        ["teacher and school", "These are naming words, not an opposite pair."],
      ];
    }

    if (/similar/i.test(topicTitle)) {
      return [
        ["big and small", "Big and small are opposites, not similar."],
        ["hot and cold", "Hot and cold are opposites, not similar."],
        ["happy and sad", "Happy and sad are opposites, not similar."],
        ["open and close", "Open and close are opposites, not similar."],
        ["run and teacher", "These words do different jobs."],
      ];
    }

    return [
      ["run", "Run is an action, not a describing word."],
      ["teacher", "Teacher names a person."],
      ["school", "School names a place."],
      ["dog", "Dog names an animal."],
      ["book", "Book names a thing."],
    ];
  }

  if (world.id === "grade1-reading" || world.id === "grade1-family-story-village") {
    return [
      ["word pile", "A pile of words is not a complete sentence or story answer."],
      ["missing who", "The answer must tell who the sentence or story is about."],
      ["missing action", "The sentence or event needs an action."],
      ["wrong order", "Words or events must be arranged in meaning order."],
      ["unrelated detail", "The detail must match the sentence or story."],
    ];
  }

  if (world.id === "grade1-number-kingdom" || world.id === "grade1-math") {
    return [
      ["uncounted total", "The total must be counted before answering."],
      ["uncounted objects", "Objects must be counted before answering."],
      ["wrong order", "Numbers must follow counting order."],
      ["wrong symbol", "The symbol must match greater, less, equal, add, or take away."],
      ["mixed groups", "Groups must match the number model."],
    ];
  }

  if (world.id === "grade1-shapes") {
    return [
      ["same color", "Color does not tell the shape name."],
      ["large shape with wrong corners", "Size does not tell sides or corners."],
      ["broken outline", "A shape needs a clear outline."],
      ["wrong corners", "The number of corners must match the shape."],
      ["wrong sides", "The number of sides must match the shape."],
    ];
  }

  if (world.id === "grade1-time-town") {
    return [
      ["dinner before waking up", "A routine must follow time order."],
      ["wrong hour", "The hour hand must point to the correct hour."],
      ["night activity", "Night activities do not belong in morning or afternoon."],
      ["missing clock", "A time answer needs a clock or routine clue."],
      ["same time for all", "Different activities happen at different times."],
    ];
  }

  if (world.id === "grade1-nature") {
    return [
      ["toy", "A toy is made by people, not a nature feature."],
      ["plastic chair", "A chair is an object, not a nature example."],
      ["road sign", "A sign is not a river, mountain, forest, flower, or tree."],
      ["cartoon guess", "The answer needs a real-world nature clue."],
      ["unrelated place", "The place must match the nature topic."],
    ];
  }

  return null;
}

function getContentNonExamplePool(renderer: string, world?: CurriculumWorld, topicTitle?: string) {
  if (world && topicTitle) {
    const grade1NonExamples = getGrade1TopicNonExamplePool(world, topicTitle);

    if (grade1NonExamples) {
      return grade1NonExamples;
    }
  }

  if (renderer.includes("Sorter")) {
    return [
      ["run", "Run is an action, not a naming word in this task."],
      ["jump", "Jump tells an action."],
      ["fast", "Fast describes how something moves."],
      ["blue", "Blue describes color."],
      ["slowly", "Slowly tells how an action happens."],
    ];
  }

  if (renderer.includes("Sentence")) {
    return [
      ["book table", "These words do not make a complete sentence."],
      ["runs", "One action word alone does not tell a complete idea."],
      ["the happy", "The idea is unfinished."],
      ["school go we", "The words need correct order."],
      ["I see", "The sentence needs the thing being seen."],
    ];
  }

  if (
    renderer.includes("PlaceValue") ||
    renderer.includes("Measurement") ||
    renderer.includes("Multiplication") ||
    renderer.includes("Division") ||
    renderer.includes("Fraction") ||
    renderer.includes("Money") ||
    renderer.includes("NumberLine") ||
    renderer.includes("Counter") ||
    renderer.includes("MultiStep")
  ) {
    return [
      ["unsupported answer", "The answer must be proved with the math model."],
      ["unequal groups", "Unequal groups do not show equal-group reasoning."],
      ["mixed units", "Different units cannot be compared without conversion."],
      ["wrong operation", "The operation must match the problem action."],
      ["uncounted objects", "Objects must be counted or modeled before answering."],
    ];
  }

  return [
    ["unsupported answer", "The answer needs evidence from the text or model."],
    ["random choice", "A random choice does not show understanding."],
    ["unrelated detail", "This detail does not answer the question."],
    ["missing clue", "The clue must be used before choosing."],
    ["copied word", "Copying a word without meaning does not prove comprehension."],
  ];
}

function buildTopicExamples(renderer: string, world: CurriculumWorld, topicTitle: string): TopicExample[] {
  return uniqueValues(getContentExamplePool(renderer, world, topicTitle), 10)
    .slice(0, 10)
    .map((label, index) => ({
      category: renderer.includes("Sorter")
        ? index < 2
          ? "person"
          : index < 4
            ? "place"
            : index < 6
              ? "animal"
              : "thing"
        : renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("Story")
          ? "reading evidence"
          : renderer.includes("Fraction") || renderer.includes("Money") || renderer.includes("Measurement") || renderer.includes("Multiplication") || renderer.includes("Division")
            ? "math model"
            : "learning example",
      label,
      sentence: getTopicExampleSentence(label, index, renderer, world, topicTitle),
    }));
}

function getTopicExampleSentence(
  label: string,
  index: number,
  renderer: string,
  world: CurriculumWorld,
  topicTitle: string
) {
  const grade1Blueprint = GRADE1_TOPIC_QUALITY_BLUEPRINTS[getGrade1TopicKey(world, topicTitle)];

  if (grade1Blueprint) {
    return grade1Blueprint.tapFacts[index % grade1Blueprint.tapFacts.length] ?? `${label} shows ${grade1Blueprint.knowledge}`;
  }

  if (renderer.includes("Sorter")) {
    return `${label} belongs in a word group because its meaning fits the category.`;
  }

  if (renderer.includes("Sentence")) {
    return `${label} can be read for who, action, and meaning.`;
  }

  if (renderer.includes("Shape")) {
    return `${label} can be checked by sides, corners, or curves.`;
  }

  if (renderer.includes("Time")) {
    return `${label} can be placed in a clock or routine sequence.`;
  }

  if (renderer.includes("NumberLine") || renderer.includes("Counter") || renderer.includes("MultiStep")) {
    return `${label} can be proven by counting, comparing, ordering, or modeling the quantity.`;
  }

  return `${label} is evidence that supports the ${topicTitle} task.`;
}

function buildTopicNonExamples(renderer: string, world: CurriculumWorld, topicTitle: string): TopicNonExample[] {
  return getContentNonExamplePool(renderer, world, topicTitle).slice(0, 5).map(([label, reason]) => ({
    label,
    reason,
  }));
}

function getGrade1TopicMisconceptions(world: CurriculumWorld, topicTitle: string): TopicMisconception[] | null {
  if (!world.id.startsWith("grade1-")) {
    return null;
  }

  if (world.id === "grade1-word-kingdom") {
    return [
      {
        misconception: `Learners may think every word in a sentence is ${topicTitle}.`,
        correction: `Check the job of the word before calling it ${topicTitle}.`,
      },
      {
        misconception: "Learners may use the picture only and ignore the word.",
        correction: "Use both the word and its meaning before sorting.",
      },
    ];
  }

  if (world.id === "grade1-reading") {
    return [
      {
        misconception: `Learners may read ${topicTitle} as a memorized sound only.`,
        correction: `Use ${topicTitle} in a meaningful sentence.`,
      },
      {
        misconception: "Learners may place the word in the wrong sentence slot.",
        correction: "Build the sentence in spoken order and reread it.",
      },
    ];
  }

  if (world.id === "grade1-family-story-village") {
    return [
      {
        misconception: "Learners may choose a character without story evidence.",
        correction: "Find the person and action in the story before answering.",
      },
      {
        misconception: "Learners may confuse who did it with what happened.",
        correction: "Who is a person; what happened is an event.",
      },
    ];
  }

  if (world.id === "grade1-number-kingdom") {
    return [
      {
        misconception: `Learners may compare ${topicTitle} by looking at digit shape instead of value.`,
        correction: "Use quantity, number order, or the number line.",
      },
      {
        misconception: "Learners may reverse before and after.",
        correction: "Move left for before and right for after on the number line.",
      },
    ];
  }

  if (world.id === "grade1-math") {
    return [
      {
        misconception: `Learners may solve ${topicTitle} without moving objects.`,
        correction: "Use counters to show putting together or taking away.",
      },
      {
        misconception: "Learners may mix addition and subtraction.",
        correction: "Addition joins groups; subtraction removes from a group.",
      },
    ];
  }

  if (world.id === "grade1-shapes") {
    return [
      {
        misconception: `Learners may name ${topicTitle} by color instead of shape attributes.`,
        correction: "Count sides and corners or look for curves.",
      },
      {
        misconception: "Learners may think a rotated shape is a different shape.",
        correction: "A shape keeps its name when it turns.",
      },
    ];
  }

  if (world.id === "grade1-time-town") {
    return [
      {
        misconception: `Learners may choose ${topicTitle} from a familiar activity without checking the time clue.`,
        correction: "Use the clock hand or routine order clue.",
      },
      {
        misconception: "Learners may place daily events in any order.",
        correction: "Routines follow morning, afternoon, evening, and night order.",
      },
    ];
  }

  if (world.id === "grade1-nature") {
    return [
      {
        misconception: `Learners may identify ${topicTitle} from one picture detail only.`,
        correction: "Use characteristics, uses, and real-world clues.",
      },
      {
        misconception: "Learners may confuse natural features with human-made objects.",
        correction: "Nature examples come from land, water, plants, or living things.",
      },
    ];
  }

  return null;
}

function buildTopicMisconceptions(topicTitle: string, renderer: string, world: CurriculumWorld): TopicMisconception[] {
  const grade1Misconceptions = getGrade1TopicMisconceptions(world, topicTitle);

  if (grade1Misconceptions) {
    return grade1Misconceptions;
  }

  if (renderer.includes("Fraction")) {
    return [
      {
        misconception: `Learners may think any pieces show ${topicTitle}.`,
        correction: "Fraction pieces must be equal parts of one whole.",
      },
      {
        misconception: "Learners may count shaded parts without checking the whole.",
        correction: "Check the whole and all equal parts before naming the fraction.",
      },
    ];
  }

  if (renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("Story") || renderer.includes("SequenceEvents")) {
    return [
      {
        misconception: `Learners may choose ${topicTitle} from memory only.`,
        correction: "Use sentence evidence or story clues before answering.",
      },
      {
        misconception: "Learners may tap any sentence as evidence.",
        correction: "Evidence must directly prove the answer.",
      },
    ];
  }

  if (
    renderer.includes("PlaceValue") ||
    renderer.includes("Measurement") ||
    renderer.includes("Multiplication") ||
    renderer.includes("EqualGroups") ||
    renderer.includes("Array") ||
    renderer.includes("WordProblem") ||
    renderer.includes("MixedMission") ||
    renderer.includes("CommunityScenario") ||
    renderer.includes("Division") ||
    renderer.includes("Money") ||
    renderer.includes("Counter") ||
    renderer.includes("NumberLine") ||
    renderer.includes("MultiStep")
  ) {
    return [
      {
        misconception: `Learners may answer ${topicTitle} by choosing the biggest visible number without modeling the story.`,
        correction: "Build or inspect the math model before choosing.",
      },
      {
        misconception: "Learners may use the wrong operation.",
        correction: "Match the operation to the story action or model.",
      },
    ];
  }

  return [
    {
      misconception: `Learners may confuse ${topicTitle} with a nearby topic.`,
      correction: `Compare examples and non-examples before choosing ${topicTitle}.`,
    },
    {
      misconception: "Learners may rely only on the picture.",
      correction: "Use the word, sound, category, or model feedback too.",
    },
  ];
}

function buildVocabularyBank(
  examples: TopicExample[],
  nonExamples: TopicNonExample[],
  topicTitle: string,
  world: CurriculumWorld,
  renderer: string
): TopicVocabularyEntry[] {
  const words = uniqueValues(
    [
      topicTitle,
      world.title,
      ...examples.map((example) => example.label),
      ...nonExamples.map((example) => example.label),
      "example",
      "non-example",
      "evidence",
      "model",
      "answer",
      "mastery",
      renderer.replace(/Renderer$/, ""),
    ],
    15
  ).slice(0, 15);

  return words.map((word) => ({
    meaning: getVocabularyMeaning(word, topicTitle, world, renderer, examples, nonExamples),
    word,
  }));
}

function getVocabularyMeaning(
  word: string,
  topicTitle: string,
  world: CurriculumWorld,
  renderer: string,
  examples: TopicExample[],
  nonExamples: TopicNonExample[]
) {
  const grade1Blueprint = GRADE1_TOPIC_QUALITY_BLUEPRINTS[getGrade1TopicKey(world, topicTitle)];

  if (grade1Blueprint) {
    const exampleIndex = examples.findIndex((example) => example.label === word);
    const nonExample = nonExamples.find((example) => example.label === word);

    if (word === topicTitle) {
      return grade1Blueprint.knowledge;
    }

    if (exampleIndex >= 0) {
      return grade1Blueprint.tapFacts[exampleIndex % grade1Blueprint.tapFacts.length] ?? `A useful example for ${topicTitle}.`;
    }

    if (nonExample) {
      return nonExample.reason;
    }

    if (word === world.title) {
      return `${world.title} groups related ${topicTitle} practice.`;
    }
  }

  if (word === "example") {
    return "A choice that fits the rule or meaning.";
  }

  if (word === "non-example") {
    return "A choice that does not fit the rule or meaning.";
  }

  if (word === "evidence") {
    return "A clue that proves an answer.";
  }

  if (word === "model") {
    return "A visual or object setup used to show thinking.";
  }

  if (word === "answer") {
    return "The choice or result that matches the task.";
  }

  if (word === "mastery") {
    return "Showing the skill correctly after practice.";
  }

  if (renderer.replace(/Renderer$/, "") === word) {
    return "The activity workspace used for this topic.";
  }

  return `${word} supports the ${topicTitle} skill.`;
}

function getGrade1KnowledgeUnits(
  world: CurriculumWorld,
  topicTitle: string,
  knowledge: string,
  examples: TopicExample[]
): TopicKnowledgeUnit[] | null {
  if (!world.id.startsWith("grade1-")) {
    return null;
  }

  if (topicTitle === "Nouns" || topicTitle === "Naming Words") {
    return [
      { id: "ku-1", title: "Person nouns", teachingPoint: "A noun can name a person, such as boy, girl, teacher, or doctor." },
      { id: "ku-2", title: "Place nouns", teachingPoint: "A noun can name a place, such as school, park, market, or home." },
      { id: "ku-3", title: "Animal nouns", teachingPoint: "A noun can name an animal, such as dog, cat, bird, or fish." },
      { id: "ku-4", title: "Thing nouns", teachingPoint: "A noun can name a thing, such as book, ball, bag, or chair." },
    ];
  }

  if (topicTitle === "Verbs" || topicTitle === "Action Words") {
    return [
      { id: "ku-1", title: "Action meaning", teachingPoint: "A verb or action word tells what someone or something does." },
      { id: "ku-2", title: "Body actions", teachingPoint: "Run, jump, walk, clap, and dance show actions a body can do." },
      { id: "ku-3", title: "School actions", teachingPoint: "Read, write, draw, and sing are actions learners can do in school." },
      { id: "ku-4", title: "Verb sorting", teachingPoint: "A verb is sorted by action, not by person, place, animal, or thing." },
    ];
  }

  if (topicTitle === "Adjectives" || topicTitle === "Describing Words") {
    return [
      { id: "ku-1", title: "Describe size", teachingPoint: "Describing words can tell size, such as big, small, tall, or short." },
      { id: "ku-2", title: "Describe color", teachingPoint: "Describing words can tell color, such as red, blue, green, or yellow." },
      { id: "ku-3", title: "Describe feeling", teachingPoint: "Describing words can tell feeling, such as happy, sad, quiet, or loud." },
      { id: "ku-4", title: "Describe nouns", teachingPoint: "A describing word tells more about a person, place, animal, or thing." },
    ];
  }

  if (topicTitle === "Opposite Words") {
    return [
      { id: "ku-1", title: "Different meaning", teachingPoint: "Opposite words have different meanings, such as big and small." },
      { id: "ku-2", title: "Common pairs", teachingPoint: "Hot and cold, happy and sad, and fast and slow are common opposite pairs." },
      { id: "ku-3", title: "Picture clues", teachingPoint: "A picture can help show which opposite word fits." },
      { id: "ku-4", title: "Use opposites", teachingPoint: "Opposite words help compare people, places, animals, and things." },
    ];
  }

  if (topicTitle === "Similar Words") {
    return [
      { id: "ku-1", title: "Almost same meaning", teachingPoint: "Similar words mean almost the same thing, such as big and large." },
      { id: "ku-2", title: "Common pairs", teachingPoint: "Happy and glad, tiny and small, and quick and fast are common similar word pairs." },
      { id: "ku-3", title: "Grade 1 words", teachingPoint: "Similar words should be common words learners can use when speaking and reading." },
      { id: "ku-4", title: "Use similar words", teachingPoint: "Similar words help learners choose another word that still makes sense." },
    ];
  }

  if (topicTitle === "Word Challenge") {
    return [
      { id: "ku-1", title: "Known words only", teachingPoint: "The challenge uses words already practiced in Word Kingdom." },
      { id: "ku-2", title: "Word jobs", teachingPoint: "Some words name, some show actions, and some describe." },
      { id: "ku-3", title: "Word relationships", teachingPoint: "Some words are opposites and some words have similar meanings." },
      { id: "ku-4", title: "Picture to word", teachingPoint: "The learner proves meaning by matching pictures to the correct words." },
    ];
  }

  if (world.id === "grade1-reading") {
    return [
      { id: "ku-1", title: `${topicTitle} meaning`, teachingPoint: `${topicTitle} has meaning in a simple Grade 1 sentence.` },
      { id: "ku-2", title: `${topicTitle} usage`, teachingPoint: `${topicTitle} must fit the speaker, action, or object in the sentence.` },
      { id: "ku-3", title: "Sentence examples", teachingPoint: `${examples.slice(0, 3).map((example) => example.label).join(" / ")} show ${topicTitle} in use.` },
      { id: "ku-4", title: "Common error", teachingPoint: `A sentence with ${topicTitle} must still make sense when read aloud.` },
    ];
  }

  if (world.id === "grade1-family-story-village") {
    return [
      { id: "ku-1", title: "Story people", teachingPoint: "A family story has people or characters who do actions." },
      { id: "ku-2", title: "Story action", teachingPoint: "The action tells what happened in the family story." },
      { id: "ku-3", title: "Story evidence", teachingPoint: "Evidence is the sentence or picture detail that proves the answer." },
      { id: "ku-4", title: `${topicTitle} task`, teachingPoint: `${topicTitle} is mastered by finding the correct person, sentence, action, or event.` },
    ];
  }

  if (world.id === "grade1-nature") {
    return [
      { id: "ku-1", title: "Characteristics", teachingPoint: `${topicTitle} has real-world features learners can observe.` },
      { id: "ku-2", title: "Uses", teachingPoint: `${topicTitle} can help people, animals, or plants in the environment.` },
      { id: "ku-3", title: "Identification", teachingPoint: `${topicTitle} can be identified by shape, place, parts, or clues.` },
      { id: "ku-4", title: "Real examples", teachingPoint: `${examples.slice(0, 4).map((example) => example.label).join(", ")} are concrete examples for ${topicTitle}.` },
    ];
  }

  if (world.id === "grade1-number-kingdom") {
    return [
      { id: "ku-1", title: "Quantity model", teachingPoint: `${topicTitle} can be shown with counters, dots, or objects.` },
      { id: "ku-2", title: "Number line", teachingPoint: "Numbers can be located and compared on a number line." },
      { id: "ku-3", title: "Compare or order", teachingPoint: `${topicTitle} uses before, after, greater, less, equal, or counting order.` },
      { id: "ku-4", title: "Visual proof", teachingPoint: "The learner proves the answer by moving or inspecting a number model." },
    ];
  }

  if (world.id === "grade1-math") {
    return [
      { id: "ku-1", title: "Object model", teachingPoint: `${topicTitle} is shown by moving real or virtual objects.` },
      { id: "ku-2", title: "Operation meaning", teachingPoint: "Addition puts together; subtraction takes away." },
      { id: "ku-3", title: "Number sentence", teachingPoint: "A number sentence records the object action with numbers and symbols." },
      { id: "ku-4", title: "Solve with counters", teachingPoint: "The learner must count the final group after objects move." },
    ];
  }

  if (world.id === "grade1-shapes") {
    return [
      { id: "ku-1", title: "Shape attributes", teachingPoint: `${topicTitle} is identified by sides, corners, curves, or equal sides.` },
      { id: "ku-2", title: "Real objects", teachingPoint: "Shapes can be found in classroom, home, and outdoor objects." },
      { id: "ku-3", title: "Explore shape", teachingPoint: "Tracing and tapping shape parts helps learners notice attributes." },
      { id: "ku-4", title: "Shape proof", teachingPoint: "The learner proves the shape by matching the object to its attributes." },
    ];
  }

  if (world.id === "grade1-time-town") {
    return [
      { id: "ku-1", title: "Time clue", teachingPoint: `${topicTitle} is understood through clocks, hours, or routine order.` },
      { id: "ku-2", title: "Routine sequence", teachingPoint: "Daily activities happen in morning, afternoon, evening, and night order." },
      { id: "ku-3", title: "Clock model", teachingPoint: "The hour hand helps show the hour on a clock." },
      { id: "ku-4", title: "Time simulation", teachingPoint: "The learner proves time understanding by setting a clock or building a routine." },
    ];
  }

  return null;
}

function buildKnowledgeUnits(
  topicTitle: string,
  knowledge: string,
  examples: TopicExample[],
  world: CurriculumWorld
): TopicKnowledgeUnit[] {
  const grade1KnowledgeUnits = getGrade1KnowledgeUnits(world, topicTitle, knowledge, examples);

  if (grade1KnowledgeUnits) {
    return grade1KnowledgeUnits;
  }

  return [
    {
      id: "ku-1",
      title: `${topicTitle} meaning`,
      teachingPoint: knowledge,
    },
    {
      id: "ku-2",
      title: `${topicTitle} examples`,
      teachingPoint: `${topicTitle} can be learned through examples such as ${examples.slice(0, 4).map((example) => example.label).join(", ")}.`,
    },
    {
      id: "ku-3",
      title: `${topicTitle} non-examples`,
      teachingPoint: `A non-example does not fit ${topicTitle} and should be explained before independent choice.`,
    },
    {
      id: "ku-4",
      title: `${topicTitle} application`,
      teachingPoint: `${topicTitle} is mastered when the learner applies it in the required renderer activity.`,
    },
  ];
}

function buildAssetRequirements(
  topicTitle: string,
  examples: TopicExample[],
  renderer: string
): TopicAssetRequirements {
  return {
    animations: [
      `attention reveal for ${topicTitle}`,
      `tap highlight for ${topicTitle}`,
      `${renderer} model action for ${topicTitle}`,
      `reward burst for ${topicTitle}`,
      `unlock path for ${topicTitle}`,
    ],
    audio: [
      `${topicTitle} pronunciation`,
      ...examples.slice(0, 5).map((example) => `${example.label} pronunciation`),
      `${topicTitle} correct feedback`,
      `${topicTitle} retry feedback`,
    ],
    images: [
      `${topicTitle} main card`,
      `${renderer} workspace background`,
      ...examples.slice(0, 8).map((example) => `${example.label} image`),
    ],
  };
}

function buildFrameworkQuestion(
  topicTitle: string,
  examples: TopicExample[],
  nonExamples: TopicNonExample[],
  index: number,
  format: FrameworkQuestion["format"]
): FrameworkQuestion {
  const correct = examples[index % examples.length];
  const wrong = nonExamples[index % nonExamples.length];
  const promptByFormat: Record<FrameworkQuestion["format"], string> = {
    category: `Which choice belongs with ${topicTitle}?`,
    choose: `Choose the example of ${topicTitle}.`,
    evidence: `Which evidence proves ${topicTitle}?`,
    model: `Which model shows ${topicTitle}?`,
    problem: `Solve the ${topicTitle} problem with the model.`,
    sentence: `Find ${topicTitle} in the sentence.`,
  };
  const wrongChoices = nonExamples
    .map((example) => example.label)
    .filter((label) => label !== correct.label);
  const repaired = repairChoicesForTarget({
    choiceLimit: 4,
    choices: Array.from(new Set([correct.label, ...wrongChoices])).slice(0, 4),
    correctAnswer: correct.label,
    distractorPool: wrongChoices,
    targetConcept: correct.label,
  });
  const choices = (repaired.activity.choices ?? []).map((choice) =>
    typeof choice === "string"
      ? choice
      : choice.label ?? choice.text ?? choice.title ?? choice.concept ?? choice.id ?? ""
  );

  return {
    choices,
    correctAnswer: correct.label,
    format,
    prompt: `${promptByFormat[format]} Item ${index + 1}.`,
    wrongAnswerExplanation: wrong.reason,
  };
}

function buildTryQuestions(
  topicTitle: string,
  examples: TopicExample[],
  nonExamples: TopicNonExample[]
): FrameworkQuestion[] {
  return Array.from({ length: 5 }, (_, index) =>
    buildFrameworkQuestion(topicTitle, examples, nonExamples, index, index % 2 === 0 ? "choose" : "category")
  );
}

function buildChooseQuestions(
  topicTitle: string,
  examples: TopicExample[],
  nonExamples: TopicNonExample[],
  renderer: string
): FrameworkQuestion[] {
  const formats: FrameworkQuestion["format"][] =
    renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("Story")
      ? ["choose", "sentence", "evidence", "category", "choose"]
      : renderer.includes("PlaceValue") ||
          renderer.includes("Measurement") ||
          renderer.includes("Multiplication") ||
          renderer.includes("Division") ||
          renderer.includes("Fraction") ||
          renderer.includes("Money") ||
          renderer.includes("Counter") ||
          renderer.includes("NumberLine") ||
          renderer.includes("MultiStep")
        ? ["choose", "model", "problem", "category", "model"]
        : ["choose", "sentence", "category", "choose", "sentence"];

  return Array.from({ length: 10 }, (_, index) =>
    buildFrameworkQuestion(topicTitle, examples, nonExamples, index, formats[index % formats.length])
  );
}

function getStageCognitiveSkill(stage: FrameworkStageLabel): CognitiveSkill {
  const skills: Record<FrameworkStageLabel, CognitiveSkill> = {
    CHOOSE: "reason",
    LOOK: "observe",
    MASTERED: "demonstrate",
    PLAY: "apply",
    PROGRESS: "reflect",
    STAR: "celebrate",
    TAP: "recognize",
    TRY: "recall",
  };

  return skills[stage];
}

function getStageDifficulty(stage: FrameworkStageLabel, gradeLevel: LearnerGradeLevel): DifficultyLevel {
  if (stage === "LOOK" || stage === "TAP" || stage === "STAR" || stage === "PROGRESS") {
    return "guided";
  }

  if (stage === "TRY") {
    return "developing";
  }

  if (stage === "CHOOSE") {
    return gradeLevel === "Grade 3" ? "advanced" : "independent";
  }

  return gradeLevel === "Grade 1" ? "independent" : "advanced";
}

function getTopicDifficultyLevel(gradeLevel: LearnerGradeLevel): DifficultyLevel {
  if (gradeLevel === "Grade 1") {
    return "developing";
  }

  if (gradeLevel === "Grade 2") {
    return "independent";
  }

  if (gradeLevel === "Grade 3") {
    return "advanced";
  }

  return "guided";
}

function getRecommendedRendererName(renderer: string) {
  const rendererAliases: Record<string, string> = {
    AddTakeAwayCounterRenderer: "ProblemSolverRenderer",
    ArrayBuilderRenderer: "ArrayBuilderRenderer",
    BaseTenPlaceValueRenderer: "PlaceValueRenderer",
    CommunityScenarioRenderer: "CommunityScenarioRenderer",
    CommunityScenarioMapRenderer: "CommunityScenarioRenderer",
    CompoundWordBuilderRenderer: "CompoundWordBuilderRenderer",
    ContextClueRenderer: "ContextClueRenderer",
    DivisionSharingRenderer: "DivisionRenderer",
    EqualGroupsRenderer: "EqualGroupsRenderer",
    EqualGroupMultiplicationRenderer: "MultiplicationRenderer",
    FractionPartitionRenderer: "FractionRenderer",
    MeasurementToolRenderer: "MeasurementRenderer",
    MoneyComposerRenderer: "MoneyRenderer",
    MixedMissionRenderer: "MixedMissionRenderer",
    MixedSkillMasteryRenderer: "MixedMissionRenderer",
    MultiStepWorkspaceRenderer: "MultiStepOperationRenderer",
    NumberLineRenderer: "ProblemSolverRenderer",
    PassageEvidenceRenderer: "PassageRenderer",
    SequenceEventsRenderer: "SequenceEventsRenderer",
    ShapePropertyRenderer: "ShapeExplorerRenderer",
    StoryMapRenderer: "EvidenceHighlighterRenderer",
    TimeRenderer: "RoutineBuilderRenderer",
    VocabularyInContextRenderer: "PassageRenderer",
    VocabularyRelationshipRenderer: "VocabularyRelationshipRenderer",
    WordCategorySorterRenderer: "WordSorterRenderer",
    WordProblemWorkspaceRenderer: "ProblemSolverRenderer",
  };

  return rendererAliases[renderer] ?? renderer;
}

function getGrade1RecommendedRendererName(
  renderer: string,
  world: CurriculumWorld,
  topicTitle: string
) {
  if (!world.id.startsWith("grade1-")) {
    if (world.id.startsWith("grade2-")) {
      return renderer;
    }

    return getRecommendedRendererName(renderer);
  }

  if (world.id === "grade1-family-story-village") {
    if (/character|who/i.test(topicTitle)) {
      return "StoryCharacterRenderer";
    }

    if (/story|what happened/i.test(topicTitle)) {
      return "StorySequenceRenderer";
    }
  }

  if (world.id === "grade1-number-kingdom") {
    return "NumberComparisonRenderer";
  }

  if (world.id === "grade1-math") {
    if (/subtraction|take away/i.test(topicTitle)) {
      return "SubtractionObjectRenderer";
    }

    if (/addition|add/i.test(topicTitle)) {
      return "AdditionObjectRenderer";
    }

    return "ObjectCounterRenderer";
  }

  if (world.id === "grade1-time-town") {
    return /clock|hour/i.test(topicTitle) ? "ClockRenderer" : "RoutineBuilderRenderer";
  }

  return getRecommendedRendererName(renderer);
}

function getRendererAliases(renderer: string, world?: CurriculumWorld, topicTitle?: string) {
  return Array.from(
    new Set([
      renderer,
      getRecommendedRendererName(renderer),
      ...(world && topicTitle ? [getGrade1RecommendedRendererName(renderer, world, topicTitle)] : []),
    ])
  );
}

function getTopicCompetencyBehavior(
  renderer: string,
  world: CurriculumWorld,
  topicTitle: string
): TopicCompetencyBehavior {
  const normalized = `${world.id} ${world.title} ${topicTitle} ${renderer}`.toLowerCase();

  if (normalized.includes("context") || normalized.includes("clue")) {
    return "context-clues";
  }

  if (normalized.includes("communityscenario")) {
    return "community-scenario";
  }

  if (normalized.includes("mixedmission")) {
    return "mixed-mission";
  }

  if (normalized.includes("story") || normalized.includes("passage") || normalized.includes("evidence") || normalized.includes("sequenceevents") || normalized.includes("main idea") || normalized.includes("character") || normalized.includes("setting")) {
    return "reading-comprehension";
  }

  if (normalized.includes("fraction")) {
    return "fractions";
  }

  if (normalized.includes("division") || normalized.includes("sharing")) {
    return "division";
  }

  if (normalized.includes("money") || normalized.includes("cash") || normalized.includes("change")) {
    return "money";
  }

  if (normalized.includes("placevalue") || normalized.includes("place value") || normalized.includes("ones") || normalized.includes("tens") || normalized.includes("hundreds")) {
    return "place-value";
  }

  if (normalized.includes("measurement") || normalized.includes("length") || normalized.includes("weight") || normalized.includes("capacity")) {
    return "measurement";
  }

  if (normalized.includes("multiplication") || normalized.includes("array") || normalized.includes("equal group") || normalized.includes("equalgroups")) {
    return "multiplication";
  }

  if (normalized.includes("routine") || normalized.includes("sequence") || normalized.includes("time") || normalized.includes("morning") || normalized.includes("afternoon") || normalized.includes("evening") || normalized.includes("numberline")) {
    return "sequencing";
  }

  if (normalized.includes("sentence")) {
    return "sentence-building";
  }

  if (normalized.includes("sorter") || normalized.includes("noun") || normalized.includes("verb") || normalized.includes("adjective") || normalized.includes("living") || normalized.includes("group")) {
    return "classification";
  }

  if (normalized.includes("problem") || normalized.includes("multistep") || normalized.includes("mixedmission") || normalized.includes("counter")) {
    return "problem-solving";
  }

  if (/grade[1-3]-/.test(world.id)) {
    if (normalized.includes("reading") || normalized.includes("sentence")) {
      return "sentence-building";
    }

    if (normalized.includes("vocabulary") || normalized.includes("word")) {
      return "classification";
    }

    if (normalized.includes("story")) {
      return "reading-comprehension";
    }

    if (normalized.includes("math") || normalized.includes("number") || normalized.includes("challenge")) {
      return "problem-solving";
    }

    if (normalized.includes("community")) {
      return "community-scenario";
    }

    return world.topics.some((topicItem) => topicItem.category === "numeric")
      ? "problem-solving"
      : "classification";
  }

  return "recognition";
}

function getBehaviorSimulationProfile(behavior: TopicCompetencyBehavior, topicTitle: string) {
  const grade2Activity = Object.entries(GRADE2_TOPIC_BLUEPRINTS).find(([key]) =>
    key.endsWith(`:${topicTitle}`)
  )?.[1].activity;
  const profiles: Record<
    TopicCompetencyBehavior,
    {
      allowedPlayActivities: string[];
      realLifeContext: string;
      requiresSimulation: boolean;
      simulationType: string;
    }
  > = {
    classification: {
      allowedPlayActivities: ["Sorting", "Categorization", "Group Builder"],
      realLifeContext: `organizing ${topicTitle} examples into meaningful groups`,
      requiresSimulation: true,
      simulationType: "category-sorting-simulation",
    },
    "community-scenario": {
      allowedPlayActivities: ["Community Scenario Map", "Helper Role Match", "Place Decision Mission"],
      realLifeContext: `choosing the community place, helper, or action for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "community-scenario-simulation",
    },
    "context-clues": {
      allowedPlayActivities: ["Evidence Highlighting", "Word Detective", "Clue Investigation"],
      realLifeContext: `using nearby words to infer ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "clue-investigation-simulation",
    },
    division: {
      allowedPlayActivities: ["Sharing Simulation", "Grouping Challenge"],
      realLifeContext: `sharing objects equally for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "equal-sharing-simulation",
    },
    fractions: {
      allowedPlayActivities: ["Fraction Builder", "Fraction Coloring", "Partition Objects"],
      realLifeContext: `partitioning a whole into equal parts for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "fraction-partition-simulation",
    },
    measurement: {
      allowedPlayActivities: ["Measure Objects", "Compare Objects", "Tool Manipulation"],
      realLifeContext: `using a tool to measure ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "measurement-tool-simulation",
    },
    money: {
      allowedPlayActivities: ["Virtual Store", "Shopping Challenge", "Cashier Challenge"],
      realLifeContext: `buying, paying, and making change for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "virtual-store-simulation",
    },
    multiplication: {
      allowedPlayActivities: ["Array Builder", "Equal Group Builder", "Repeated Addition Model"],
      realLifeContext: `building equal groups or arrays for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "array-builder-simulation",
    },
    "place-value": {
      allowedPlayActivities: ["Build Numbers", "Bundle Objects", "Place Value Builder"],
      realLifeContext: `bundling ones, tens, or hundreds for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "place-value-builder-simulation",
    },
    "problem-solving": {
      allowedPlayActivities: ["Workspace Solve", "Step Builder", "Problem Simulation"],
      realLifeContext: `solving a real situation involving ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "problem-workspace-simulation",
    },
    "reading-comprehension": {
      allowedPlayActivities: ["Evidence Hunt", "Story Investigation", "Highlight Clues"],
      realLifeContext: `reading a passage and proving ${topicTitle} with evidence`,
      requiresSimulation: true,
      simulationType: "evidence-hunt-simulation",
    },
    recognition: {
      allowedPlayActivities: ["Object Hunt", "Find the Correct Object", "Tap Challenge", "Matching Game"],
      realLifeContext: `finding ${topicTitle} in a familiar visual scene`,
      requiresSimulation: false,
      simulationType: "object-hunt",
    },
    "sentence-building": {
      allowedPlayActivities: ["Sentence Builder", "Word Order Builder", "Meaningful Sentence Creation"],
      realLifeContext: `building a sentence that uses ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "sentence-builder-simulation",
    },
    "mixed-mission": {
      allowedPlayActivities: ["Mixed Skill Mission", "Model Stations", "Mastery Challenge"],
      realLifeContext: `solving mixed Grade 2 tasks for ${topicTitle}`,
      requiresSimulation: true,
      simulationType: "mixed-skill-mission-simulation",
    },
    sequencing: {
      allowedPlayActivities: ["Drag to Order", "Timeline Builder", "Sequence Puzzle"],
      realLifeContext: `putting ${topicTitle} events or steps in order`,
      requiresSimulation: true,
      simulationType: "sequence-builder-simulation",
    },
  };

  const profile = profiles[behavior];

  if (!grade2Activity) {
    return profile;
  }

  return {
    ...profile,
    allowedPlayActivities: uniqueValues([grade2Activity, ...profile.allowedPlayActivities]),
  };
}

function getGrade1BehaviorSimulationProfile(
  world: CurriculumWorld,
  topicTitle: string,
  fallback: ReturnType<typeof getBehaviorSimulationProfile>
) {
  if (!world.id.startsWith("grade1-")) {
    return fallback;
  }

  const activityByKey: Record<string, string> = {
    "grade1-family-story-village:Family Sentences": "Family Sentence Builder",
    "grade1-family-story-village:Family Stories": "Family Story Sequencer",
    "grade1-family-story-village:Story Characters": "Character Detective",
    "grade1-family-story-village:What Happened?": "Event Detective",
    "grade1-family-story-village:Who Did It?": "Who Did It Detective",
    "grade1-math:Addition Facts": "Build Addition Tower",
    "grade1-math:Add with Objects": "Collect Objects Simulation",
    "grade1-math:Number Sentences": "Equation Builder",
    "grade1-math:Subtraction Facts": "Take-Away Counter Mat",
    "grade1-math:Take Away with Objects": "Give Away Objects Simulation",
    "grade1-nature:Describing Nature": "Nature Description Builder",
    "grade1-nature:Flower": "Flower Parts Explorer",
    "grade1-nature:Forest": "Forest Habitat Map",
    "grade1-nature:Mountain": "Mountain Feature Hunt",
    "grade1-nature:River": "River Feature Explorer",
    "grade1-nature:Tree": "Tree Parts Builder",
    "grade1-number-kingdom:Before and After Numbers": "Before After Train",
    "grade1-number-kingdom:Equal To": "Equal Balance Scale",
    "grade1-number-kingdom:Greater Than": "Number Battle",
    "grade1-number-kingdom:Less Than": "Smaller Number Path",
    "grade1-number-kingdom:Number Order": "Number Order Train",
    "grade1-number-kingdom:Numbers 1-100": "Hundred Chart Builder",
    "grade1-reading:Come": "Come Command Builder",
    "grade1-reading:Go": "Go Direction Builder",
    "grade1-reading:I": "I Sentence Builder",
    "grade1-reading:Look": "Look Sentence Finder",
    "grade1-reading:See": "See Picture Sentence Builder",
    "grade1-reading:Sentence Completion": "Missing Word Builder",
    "grade1-reading:Simple Sentences": "Simple Sentence Builder",
    "grade1-reading:We": "We Sentence Builder",
    "grade1-reading:You": "You Sentence Builder",
    "grade1-shapes:Circle": "Circle Object Hunt",
    "grade1-shapes:Real Object Shapes": "Real Object Shape Hunt",
    "grade1-shapes:Rectangle": "Rectangle Object Builder",
    "grade1-shapes:Sides and Corners": "Sides and Corners Lab",
    "grade1-shapes:Square": "Square Explorer",
    "grade1-shapes:Triangle": "Triangle Builder",
    "grade1-time-town:Afternoon": "Afternoon Schedule Builder",
    "grade1-time-town:Clock": "Set the Clock",
    "grade1-time-town:Daily Routine Order": "Daily Routine Builder",
    "grade1-time-town:Evening": "Evening Routine Builder",
    "grade1-time-town:Hour": "Hour Hand Builder",
    "grade1-time-town:Morning": "Morning Routine Builder",
    "grade1-word-kingdom:Action Words": "Action Picture Drag Match",
    "grade1-word-kingdom:Adjectives": "Description Builder",
    "grade1-word-kingdom:Describing Words": "Describing Picture Drag Match",
    "grade1-word-kingdom:Naming Words": "Naming Picture Drag Match",
    "grade1-word-kingdom:Nouns": "Noun Category Sort",
    "grade1-word-kingdom:Verbs": "Verb Action Match",
    "grade1-word-kingdom:Opposite Words": "Opposite Picture Drag Match",
    "grade1-word-kingdom:Similar Words": "Similar Picture Drag Match",
    "grade1-word-kingdom:Word Challenge": "Mixed Picture Word Drag Match",
    "grade1-word-kingdom:Word Kingdom Mastery Challenge": "Word Job Mastery Sort",
  };
  const activity = activityByKey[getGrade1TopicKey(world, topicTitle)];
  const qualityActivity = GRADE1_TOPIC_QUALITY_BLUEPRINTS[getGrade1TopicKey(world, topicTitle)]?.activityType;

  if (!activity) {
    return fallback;
  }

  return {
    ...fallback,
    allowedPlayActivities: uniqueValues([
      activity,
      ...(qualityActivity ? [qualityActivity] : []),
      ...fallback.allowedPlayActivities.filter((candidate) => candidate !== activity && candidate !== qualityActivity),
    ]),
    realLifeContext: `using ${activity} to apply ${topicTitle} in ${world.title}`,
    requiresSimulation: true,
    simulationType: `${activity.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-simulation`,
  };
}

function buildTopicBehaviorProfile(
  renderer: string,
  world: CurriculumWorld,
  topicTitle: string
): TopicBehaviorProfile {
  const competencyBehavior = getTopicCompetencyBehavior(renderer, world, topicTitle);
  const simulationProfile = getGrade1BehaviorSimulationProfile(
    world,
    topicTitle,
    getBehaviorSimulationProfile(competencyBehavior, topicTitle)
  );

  return {
    competencyBehavior,
    progression: ["observe", "explore", "recognize", "classify", "apply", "celebrate", "reflect", "demonstrate"],
    ...simulationProfile,
  };
}

function buildApplicationActivity(
  topicTitle: string,
  world: CurriculumWorld,
  renderer: string,
  requiredAction: FrameworkStageContent["requiredAction"],
  behaviorProfile: TopicBehaviorProfile
): ApplicationActivityContent {
  const preschoolPlayType = world.id.startsWith("preschool-")
    ? getPreschoolPlayType(world.id, topicTitle)
    : null;
  const activityName =
    preschoolPlayType ??
    behaviorProfile.allowedPlayActivities[0] ??
    renderer.replace(/Renderer$/, "");

  return {
    completionRule: `Complete after the learner performs ${requiredAction ?? "tap"} and solves the ${topicTitle} application without adding new content.`,
    cognitiveSkill: "apply",
    competencyBehavior: behaviorProfile.competencyBehavior,
    goal: `Prove competency for ${topicTitle} inside ${world.title}.`,
    masteryDemonstration: `Learner demonstrates ${topicTitle} by completing ${activityName} through ${behaviorProfile.simulationType}.`,
    name: `${topicTitle} ${activityName}`,
    realLifeContext: behaviorProfile.realLifeContext,
    simulationType: behaviorProfile.simulationType,
    steps: [
      `Open the ${renderer} workspace.`,
      `Simulate ${behaviorProfile.realLifeContext}.`,
      `Perform the required ${requiredAction ?? "tap"} action.`,
      `Submit the final ${topicTitle} answer.`,
    ],
    type: activityName,
  };
}

function buildTopicValidationRules(): TopicValidationRules {
  return {
    minimumChooseQuestions: 10,
    minimumExamples: 10,
    minimumNonExamples: 5,
    minimumTryQuestions: 5,
    rejectsGenericStages: true,
    rejectsReusedContent: true,
    requiresMisconceptions: true,
    requiresVocabularyBank: true,
  };
}

function getMasteryEvidenceForBehavior(
  topicTitle: string,
  behaviorProfile: TopicBehaviorProfile
) {
  const activity = behaviorProfile.allowedPlayActivities[0] ?? "application activity";
  const evidenceByBehavior: Record<TopicCompetencyBehavior, string[]> = {
    classification: [
      `Sorted ${topicTitle} examples into the correct groups.`,
      `Explained why at least one non-example does not fit ${topicTitle}.`,
    ],
    "community-scenario": [
      `Matched the ${topicTitle} need to the correct helper, place, or action.`,
      `Completed the community decision path for ${topicTitle}.`,
    ],
    "context-clues": [
      `Highlighted the clue words that explain ${topicTitle}.`,
      `Used the highlighted clue to infer the meaning of ${topicTitle}.`,
    ],
    division: [
      `Shared objects equally for ${topicTitle}.`,
      `Checked that each group has the same amount.`,
    ],
    fractions: [
      `Partitioned a whole into equal parts for ${topicTitle}.`,
      `Marked the requested fraction after checking equal shares.`,
    ],
    measurement: [
      `Used the correct measurement tool for ${topicTitle}.`,
      `Compared or measured objects before submitting the answer.`,
    ],
    money: [
      `Composed the needed coins or bills for ${topicTitle}.`,
      `Checked the price, total, or change in the store task.`,
    ],
    multiplication: [
      `Built equal groups or an array for ${topicTitle}.`,
      `Used the model to find the total product.`,
    ],
    "place-value": [
      `Built ${topicTitle} with hundreds, tens, or ones.`,
      `Explained the value of each place used in the model.`,
    ],
    "problem-solving": [
      `Modeled the ${topicTitle} problem in the workspace.`,
      `Solved the required step or steps before submitting the answer.`,
    ],
    "reading-comprehension": [
      `Read the ${topicTitle} passage or story card.`,
      `Tapped evidence that proves the answer.`,
    ],
    recognition: [
      `Matched ${topicTitle} to a real picture, object, or scene.`,
      `Found ${topicTitle} among non-matching distractors.`,
    ],
    "sentence-building": [
      `Built a meaningful sentence using ${topicTitle}.`,
      `Checked that the sentence order makes sense.`,
    ],
    "mixed-mission": [
      `Completed more than one ${topicTitle} mission station.`,
      `Used the correct model, evidence, or operation at each station.`,
    ],
    sequencing: [
      `Arranged ${topicTitle} cards in the correct order.`,
      `Checked the sequence from first to last.`,
    ],
  };

  return [
    ...evidenceByBehavior[behaviorProfile.competencyBehavior],
    `Completed ${activity} as the PLAY competency task.`,
  ];
}

function buildTopicMasteryRules(
  topicTitle: string,
  successCriteria: string[],
  behaviorProfile: TopicBehaviorProfile
): TopicMasteryRules {
  const behaviorEvidence = getMasteryEvidenceForBehavior(topicTitle, behaviorProfile);

  return {
    conditions: [
      ...successCriteria,
      ...behaviorEvidence,
      `Claim STAR and save PROGRESS before MASTERED is recorded for ${topicTitle}.`,
    ],
    competencyDemonstration: `Demonstrate ${topicTitle} by applying ${behaviorProfile.competencyBehavior} in ${behaviorProfile.simulationType}.`,
    evidenceRequired: [
      ...behaviorEvidence,
      `Independent CHOOSE response confirms readiness before PLAY for ${topicTitle}.`,
      `Saved PLAY, STAR, PROGRESS, and MASTERED state.`,
    ],
    minimumPlayAccuracy: 1,
    requiredStages: [
      "LOOK",
      "TAP",
      "TRY",
      "CHOOSE",
      "PLAY",
      "STAR",
      "PROGRESS",
      "MASTERED",
    ],
  };
}

function buildTopicContentDatabase({
  knowledge,
  renderer,
  successCriteria,
  topicTitle,
  world,
}: {
  knowledge: string;
  renderer: string;
  successCriteria: string[];
  topicTitle: string;
  world: CurriculumWorld;
}) {
  const examples = buildTopicExamples(renderer, world, topicTitle);
  const nonExamples = buildTopicNonExamples(renderer, world, topicTitle);
  const misconceptions = buildTopicMisconceptions(topicTitle, renderer, world);
  const vocabularyBank = buildVocabularyBank(examples, nonExamples, topicTitle, world, renderer);
  const behaviorProfile = buildTopicBehaviorProfile(renderer, world, topicTitle);

  return {
    behaviorProfile,
    examples,
    knowledgeUnits: buildKnowledgeUnits(topicTitle, knowledge, examples, world),
    masteryRules: buildTopicMasteryRules(topicTitle, successCriteria, behaviorProfile),
    misconceptions,
    nonExamples,
    validationRules: buildTopicValidationRules(),
    visualAssetRequirements: buildAssetRequirements(topicTitle, examples, renderer),
    vocabularyBank,
  };
}

function buildWorldContentIdentity(
  gradeLevel: LearnerGradeLevel,
  world: CurriculumWorld
): WorldContentIdentity {
  const topicTitles = world.topics.map((topicItem) => topicItem.title);
  const numericCount = world.topics.filter((topicItem) => topicItem.category === "numeric").length;
  const curriculumArea =
    numericCount > world.topics.length / 2
      ? "foundational numeracy"
      : "foundational literacy";

  return {
    completionChallenge: `Complete all ${topicTitles.length} ${world.title} topics, pass each PLAY application, claim rewards, and show mastery on ${topicTitles.slice(0, 4).join(", ")}${topicTitles.length > 4 ? ", and related topics" : ""}.`,
    knowledgeScope: uniqueValues(
      [
        ...topicTitles,
        ...world.activities,
        world.description,
      ],
      Math.min(8, Math.max(4, topicTitles.length))
    ).slice(0, Math.max(4, Math.min(8, topicTitles.length + 2))),
    teaches: `${world.title} teaches ${gradeLevel} ${curriculumArea} through ${world.description}`,
  };
}

function getTopicKnowledge(topicItem: CurriculumTopic, fundamentalSkill: string) {
  return topicItem.example && !/^This is\b/i.test(topicItem.example)
    ? topicItem.example
    : fundamentalSkill;
}

function getLearningObjective(
  gradeLevel: LearnerGradeLevel,
  topicTitle: string,
  fundamentalSkill: string
) {
  return `${gradeLevel} learner can use ${topicTitle} to show ${fundamentalSkill.toLowerCase()}.`;
}

function getSuccessCriteria(topicTitle: string, renderer: string) {
  const criteria = [
    `Identify ${topicTitle} in a supported model.`,
    `Use the ${topicTitle} model, clue, or evidence without the first hint.`,
  ];

  if (renderer.includes("Context") || renderer.includes("Evidence") || renderer.includes("Story")) {
    return [
      ...criteria,
      `Tap evidence that proves ${topicTitle}.`,
    ];
  }

  if (
    renderer.includes("PlaceValue") ||
    renderer.includes("Measurement") ||
    renderer.includes("Multiplication") ||
    renderer.includes("Division") ||
    renderer.includes("Fraction") ||
    renderer.includes("Money") ||
    renderer.includes("MultiStep")
  ) {
    return [
      ...criteria,
      `Use the ${renderer} workspace to solve ${topicTitle}.`,
    ];
  }

  return [
    ...criteria,
    `Complete the ${topicTitle} application activity.`,
  ];
}

function getStageContent(
  stage: FrameworkStageLabel,
  topicTitle: string,
  world: CurriculumWorld,
  knowledge: string
) {
  const stageContent: Record<FrameworkStageLabel, string> = {
    LOOK: `${topicTitle} appears in ${world.title}. ${knowledge}`,
    TAP: `${topicTitle} responds when the learner taps the model, word, object, or clue.`,
    TRY: `${topicTitle} is practiced with a hint and a small answer set.`,
    CHOOSE: `${topicTitle} is recalled independently with fewer supports.`,
    PLAY: `${topicTitle} is applied through a model, evidence task, builder, or workspace.`,
    STAR: `${topicTitle} completion is celebrated after the learner finishes PLAY.`,
    PROGRESS: `${topicTitle} progress is saved for ${world.title}.`,
    MASTERED: `${topicTitle} mastery unlocks the next learning target or completes the world.`,
  };

  return stageContent[stage];
}

function getStageUiBehavior(
  stage: FrameworkStageLabel,
  gradeLevel: LearnerGradeLevel,
  topicTitle: string,
  renderer: string
) {
  const supportStyle =
    gradeLevel === "Preschool" || gradeLevel === "Kindergarten"
      ? "large visual cards, audio button, and oversized touch targets"
      : "workspace controls, answer choices, and visible reasoning feedback";
  const stageUi: Record<FrameworkStageLabel, string> = {
    LOOK: `Show one focused ${topicTitle} model with ${supportStyle}.`,
    TAP: `Make each ${topicTitle} tap highlight the selected part and play feedback.`,
    TRY: `Show guided ${topicTitle} choices with a hint marker before selection.`,
    CHOOSE: `Show independent ${topicTitle} choices with no hint marker.`,
    PLAY: `Open ${renderer} for ${topicTitle} with the required model action before final answer selection.`,
    STAR: `Show reward controls, XP count-up, and one topic star for ${topicTitle}.`,
    PROGRESS: `Show ${topicTitle} completion inside the world progress path.`,
    MASTERED: `Show ${topicTitle} mastery state and next unlock path.`,
  };

  return stageUi[stage];
}

function getStageInteraction(
  stage: FrameworkStageLabel,
  topicTitle: string,
  requiredAction: FrameworkStageContent["requiredAction"]
) {
  const action = requiredAction ?? "tap";
  const stageInteraction: Record<FrameworkStageLabel, string> = {
    LOOK: `Learner observes ${topicTitle} and can replay the audio.`,
    TAP: `Learner taps ${topicTitle} to reveal meaning, sound, count, clue, or model part.`,
    TRY: `Learner uses support to ${action} ${topicTitle}.`,
    CHOOSE: `Learner independently chooses the answer that shows ${topicTitle}.`,
    PLAY: `Learner must ${action} in the ${topicTitle} activity before completing the challenge.`,
    STAR: `Learner taps to claim the ${topicTitle} reward.`,
    PROGRESS: `Learner views saved ${topicTitle} progress.`,
    MASTERED: `Learner confirms ${topicTitle} mastery and sees the next unlock.`,
  };

  return stageInteraction[stage];
}

function getStageFeedback(stage: FrameworkStageLabel, topicTitle: string) {
  const stageFeedback: Record<FrameworkStageLabel, string> = {
    LOOK: `${topicTitle} is named aloud and visually highlighted.`,
    TAP: `Each tap on ${topicTitle} gives immediate highlight, sound, or label feedback.`,
    TRY: `Correct ${topicTitle} choices are affirmed; wrong choices trigger a hint.`,
    CHOOSE: `Independent ${topicTitle} answers receive success or retry feedback.`,
    PLAY: `${topicTitle} application gives dynamic feedback after the required action.`,
    STAR: `${topicTitle} reward feedback confirms XP and star earned.`,
    PROGRESS: `${topicTitle} progress feedback shows saved growth.`,
    MASTERED: `${topicTitle} mastery feedback confirms unlock readiness.`,
  };

  return stageFeedback[stage];
}

function getStageCompletionRule(stage: FrameworkStageLabel, topicTitle: string) {
  const completionRules: Record<FrameworkStageLabel, string> = {
    LOOK: `Complete LOOK after the learner views ${topicTitle} and audio/visual support is available.`,
    TAP: `Complete TAP only after the learner finishes every required ${topicTitle} exploration interaction.`,
    TRY: `Complete TRY after the learner answers the guided ${topicTitle} item correctly.`,
    CHOOSE: `Complete CHOOSE after the learner answers the independent ${topicTitle} item correctly.`,
    PLAY: `Complete PLAY only after the learner performs the required ${topicTitle} model action and solves the challenge.`,
    STAR: `Complete STAR after XP and one ${topicTitle} star are claimed once.`,
    PROGRESS: `Complete PROGRESS after ${topicTitle} stage progress is written to learner progress.`,
    MASTERED: `Complete MASTERED after ${topicTitle} mastery is saved and the next unlock is shown.`,
  };

  return completionRules[stage];
}

function getStageAnimationPlan(
  stage: FrameworkStageLabel,
  gradeLevel: LearnerGradeLevel,
  topicTitle: string,
  requiredAction: FrameworkStageContent["requiredAction"]
) {
  const gradeMotion =
    gradeLevel === "Grade 3"
      ? "reasoning path"
      : gradeLevel === "Grade 2"
        ? "model transformation"
        : "clear object movement";
  const action = requiredAction ?? "tap";

  const plans: Record<FrameworkStageLabel, { animation: string; animationPurpose: string }> = {
    LOOK: {
      animation: `attentionReveal:${topicTitle}`,
      animationPurpose: `Guide attention to the key ${topicTitle} visual before interaction.`,
    },
    TAP: {
      animation: `tapHighlight:${topicTitle}`,
      animationPurpose: `Reinforce that tapping ${topicTitle} reveals meaning, sound, count, or evidence.`,
    },
    TRY: {
      animation: `guidedHint:${topicTitle}`,
      animationPurpose: `Guide the learner toward the supported ${topicTitle} answer without giving a decorative effect only.`,
    },
    CHOOSE: {
      animation: `selectionFeedback:${topicTitle}`,
      animationPurpose: `Reinforce independent recall of ${topicTitle} through immediate answer feedback.`,
    },
    PLAY: {
      animation: `${action}Model:${topicTitle}`,
      animationPurpose: `Teach ${topicTitle} through ${gradeMotion} before the learner completes the application challenge.`,
    },
    STAR: {
      animation: `rewardBurst:${topicTitle}`,
      animationPurpose: `Celebrate completed learning for ${topicTitle} after the instructional work is done.`,
    },
    PROGRESS: {
      animation: `progressFill:${topicTitle}`,
      animationPurpose: `Show that ${topicTitle} growth has been saved and contributes to world progress.`,
    },
    MASTERED: {
      animation: `unlockPath:${topicTitle}`,
      animationPurpose: `Show how mastering ${topicTitle} opens the next topic or world goal.`,
    },
  };

  return plans[stage];
}

function buildStageContract({
  gradeLevel,
  knowledge,
  renderer,
  stage,
  topicTitle,
  world,
}: {
  gradeLevel: LearnerGradeLevel;
  knowledge: string;
  renderer: string;
  stage: FrameworkStageLabel;
  topicTitle: string;
  world: CurriculumWorld;
}) {
  const requiredAction = getStageAction(stage, gradeLevel, renderer, world.id);
  const animationPlan = getStageAnimationPlan(stage, gradeLevel, topicTitle, requiredAction);

  return {
    animation: animationPlan.animation,
    animationPurpose: animationPlan.animationPurpose,
    completionRule: getStageCompletionRule(stage, topicTitle),
    content: getStageContent(stage, topicTitle, world, knowledge),
    cognitiveSkill: getStageCognitiveSkill(stage),
    difficulty: getStageDifficulty(stage, gradeLevel),
    feedback: getStageFeedback(stage, topicTitle),
    interaction: getStageInteraction(stage, topicTitle, requiredAction),
    requiredAction,
    uiBehavior: getStageUiBehavior(stage, gradeLevel, topicTitle, renderer),
  };
}

function buildTopicAssetSlots(worldId: string, topicTitle: string) {
  const topicKey = slugifyCompetency(topicTitle);
  const base = `asset-slot://${worldId}/${topicKey}`;

  return {
    chooseAssetSlot: `${base}/choose`,
    lookAssetSlot: `${base}/look`,
    playAssetSlot: `${base}/play`,
    masteryAssetSlot: `${base}/mastered`,
    rewardAssetSlot: `${base}/reward`,
    tapAssetSlot: `${base}/tap`,
    topicAssetSlot: `${base}/topic`,
    tryAssetSlot: `${base}/try`,
  };
}

function getUpperGradeStageBalance(gradeLevel: LearnerGradeLevel) {
  if (gradeLevel === "Grade 2") {
    return {
      chooseObjective: "Read the clue, use the moderate visual model, and choose the supported answer.",
      feedbackWrong: "Check the model, clue, or evidence again.",
      lookVisualLimit: 3,
      playVisualLimit: 2,
      tapInteractionCount: 3,
      tryObjective: "Use the model and short clue before choosing.",
    };
  }

  if (gradeLevel === "Grade 3") {
    return {
      chooseObjective: "Read the text, find evidence, and choose the best reasoned answer.",
      feedbackWrong: "Reread the evidence and check your reasoning.",
      lookVisualLimit: 2,
      playVisualLimit: 1,
      tapInteractionCount: 2,
      tryObjective: "Use text evidence before choosing.",
    };
  }

  return null;
}

function buildFrameworkStages({
  activityType,
  cognitiveFocus,
  fundamentalSkill,
  gradeLevel,
  nextTopic,
  renderer,
  topicItem,
  topics,
  world,
}: {
  activityType: string;
  cognitiveFocus: string;
  fundamentalSkill: string;
  gradeLevel: LearnerGradeLevel;
  nextTopic?: CurriculumTopic;
  renderer: string;
  topicItem: CurriculumTopic;
  topics: CurriculumTopic[];
  world: CurriculumWorld;
}): FrameworkStageContent[] {
  const topicTitle = topicItem.title;
  const correctAnswer = getCanonicalAnswerLabel(topicTitle);
  const correctAnswerRepresentation = getAnswerRepresentation(world.id, topicTitle);
  const tryChoices = getTopicChoiceTitles(
    topicItem,
    topics,
    gradeLevel === "Preschool" || gradeLevel === "Kindergarten" || gradeLevel === "Grade 1" ? 2 : 4,
    gradeLevel,
    world.id
  );
  const chooseChoiceLimit = 4;
  const chooseChoices = getTopicChoiceTitles(topicItem, topics, chooseChoiceLimit, gradeLevel, world.id);
  const unlockTarget = nextTopic?.title;
  const imagePrompt = getTopicImagePrompt(gradeLevel, world, topicTitle);
  const passage = getTopicPassage(gradeLevel, topicTitle, world, renderer);
  const evidenceSentences = getEvidenceSentences(topicTitle, renderer, world);
  const manipulatives = getRendererManipulatives(renderer, topicTitle);
  const questionText = getTopicQuestion(topicTitle, world, renderer);
  const knowledge = getTopicKnowledge(topicItem, fundamentalSkill);
  const successCriteria = getSuccessCriteria(topicTitle, renderer);
  const upperGradeBalance = getUpperGradeStageBalance(gradeLevel);
  const topicDatabase = buildTopicContentDatabase({
    knowledge,
    renderer,
    successCriteria,
    topicTitle,
    world,
  });
  const playChoiceLimit = 4;
  const playChoices = uniqueValues(
    [
      ...manipulatives,
      ...topicDatabase.examples.map((example) => example.label),
      `${topicTitle} hunt`,
      `${topicTitle} match`,
      `${topicTitle} game`,
    ],
    playChoiceLimit
  ).slice(0, playChoiceLimit);
  const tryQuestions = buildTryQuestions(topicTitle, topicDatabase.examples, topicDatabase.nonExamples);
  const chooseQuestions = buildChooseQuestions(
    topicTitle,
    topicDatabase.examples,
    topicDatabase.nonExamples,
    renderer
  );
  const stageContract = (
    stage: FrameworkStageLabel,
    stageRenderer = renderer
  ) =>
    buildStageContract({
      gradeLevel,
      knowledge,
      renderer: stageRenderer,
      stage,
      topicTitle,
      world,
    });
  const preschoolStageSupport = (stage: FrameworkStageLabel) =>
    gradeLevel === "Preschool"
      ? getPreschoolStageSupport(stage, world.id, topicTitle)
      : {};
  const playRenderer =
    gradeLevel === "Preschool" ? getPreschoolPlayRenderer(world.id, topicTitle) : renderer;
  const playAction = getStageAction("PLAY", gradeLevel, playRenderer, world.id);
  const playInstruction =
    gradeLevel === "Preschool"
      ? getPreschoolPlayInstruction(world.id, topicTitle)
      : getPlayInstruction(gradeLevel, topicTitle, playRenderer, world.id);
  const colorStageMetadata = getColorStageMetadata(world.id, topicTitle);
  const shapeStageMetadata = getShapeStageMetadata(world.id, topicTitle);
  const animalStageMetadata = getAnimalStageMetadata(world.id, topicTitle);
  const fruitStageMetadata = getFruitStageMetadata(world.id, topicTitle);
  const foodStageMetadata = getFoodStageMetadata(world.id, topicTitle);
  const numberStageMetadata = getNumberStageMetadata(world.id, topicTitle);
  const countingForestStageMetadata = getCountingForestStageMetadata(world.id, topicTitle);
  const sizeStageMetadata = getSizeStageMetadata(world.id, topicTitle);
  const quantityStageMetadata = getQuantityStageMetadata(world.id, topicTitle);
  const patternStageMetadata = getPatternStageMetadata(world.id, topicTitle);
  const worldChallengeMetadata =
    (gradeLevel === "Kindergarten" ||
      gradeLevel === "Grade 1" ||
      gradeLevel === "Grade 2") &&
    /challenge$/i.test(topicTitle)
      ? {
          worldChallengeTopics: topics
            .filter((item) => item.title !== topicTitle)
            .map((item) => item.title),
        }
      : {};
  const isKindergarten = gradeLevel === "Kindergarten";
  const isGrade1 = gradeLevel === "Grade 1";
  const earlyLookPrompt = isKindergarten
    ? `Look at ${correctAnswer}.`
    : isGrade1
      ? `Look. Read ${correctAnswer}.`
      : undefined;
  const earlyTapPrompt = isKindergarten
    ? `Tap ${correctAnswer}.`
    : isGrade1
      ? "Tap the card."
      : undefined;
  const earlyTryPrompt = isKindergarten
    ? `Find ${correctAnswer}.`
    : isGrade1
      ? "Use the clue."
      : undefined;
  const earlyChoosePrompt = isKindergarten
    ? `Choose ${correctAnswer}.`
    : isGrade1
      ? "Choose the match."
      : undefined;
  const earlyWrongFeedback = isKindergarten
    ? "Look again."
    : isGrade1
      ? "Use the clue."
      : undefined;

  return [
    {
      stage: "LOOK",
      purpose: `Introduce ${topicTitle} for ${fundamentalSkill}; cognitive focus is ${cognitiveFocus}.`,
      instruction: getLookInstruction(gradeLevel, topicTitle),
      learnerAction: isKindergarten ? "Look and listen." : isGrade1 ? "Look, listen, and read." : "Watch the model and listen.",
      audioText: `${topicTitle}. ${topicTitle}.`,
      correctAssetConcept: correctAnswer,
      imagePrompt,
      learningGoal: `Understand the key idea of ${topicTitle}.`,
      successCriteria: [`View the ${topicTitle} model.`, `Hear the ${topicTitle} teaching script.`],
      teachingScript: isKindergarten
        ? `${correctAnswer}.`
        : isGrade1
          ? `${correctAnswer}. ${topicDatabase.examples[0]?.sentence ?? knowledge}`
          : gradeLevel === "Grade 2"
            ? `${topicTitle}. ${knowledge} Use the model and short clue.`
            : gradeLevel === "Grade 3"
              ? `${topicTitle}. ${knowledge} Read the text evidence and explain your answer.`
          : `${topicTitle}. ${knowledge}`,
      visualContent: topicDatabase.visualAssetRequirements.images.slice(
        0,
        upperGradeBalance?.lookVisualLimit ?? 5
      ),
      audioContent: topicDatabase.visualAssetRequirements.audio.slice(0, 5),
      questionText: earlyLookPrompt ?? `What do you notice about ${topicTitle}?`,
      renderer: "LookStageRenderer",
      targetConcept: correctAnswer,
      ...colorStageMetadata,
      ...shapeStageMetadata,
      ...animalStageMetadata,
      ...fruitStageMetadata,
      ...foodStageMetadata,
      ...numberStageMetadata,
      ...countingForestStageMetadata,
      ...sizeStageMetadata,
      ...quantityStageMetadata,
      ...patternStageMetadata,
      ...worldChallengeMetadata,
      ...stageContract("LOOK"),
      ...preschoolStageSupport("LOOK"),
    },
    {
      stage: "TAP",
      purpose: `Let the learner explore ${topicTitle}.`,
      instruction: getTapInstruction(gradeLevel, topicTitle),
      learnerAction: earlyTapPrompt ?? `Tap the ${topicTitle} image, word, model, clue, or object.`,
      audioText: isKindergarten ? correctAnswer : isGrade1 ? `${correctAnswer}.` : `This is ${topicTitle}.`,
      correctAssetConcept: correctAnswer,
      imagePrompt,
      discoveryContent: topicDatabase.examples.slice(0, 5).map((example) =>
        isKindergarten
          ? example.label
          : isGrade1
            ? `${example.label}: ${example.sentence.split(".")[0]}.`
            : `${example.label}: ${example.sentence}`
      ),
      learningGoal: `Explore what ${topicTitle} means through taps.`,
      questionText: earlyTapPrompt ?? `What happens when you tap ${topicTitle}?`,
      renderer: "TapStageRenderer",
      targetConcept: correctAnswer,
      requiredInteractionCount:
        world.id === "preschool-number-village"
          ? Math.max(2, (numberStageMetadata.numberQuantity ?? 2) + 1)
          : gradeLevel === "Preschool" || gradeLevel === "Kindergarten"
            ? 3
            : gradeLevel === "Grade 2"
              ? 3
              : gradeLevel === "Grade 3"
                ? upperGradeBalance?.tapInteractionCount ?? 2
                : 1,
      ...colorStageMetadata,
      ...shapeStageMetadata,
      ...animalStageMetadata,
      ...fruitStageMetadata,
      ...foodStageMetadata,
      ...numberStageMetadata,
      ...countingForestStageMetadata,
      ...sizeStageMetadata,
      ...quantityStageMetadata,
      ...patternStageMetadata,
      ...worldChallengeMetadata,
      ...stageContract("TAP"),
      ...preschoolStageSupport("TAP"),
    },
    {
      stage: "TRY",
      purpose: `Guide recognition or first solving for ${topicTitle}.`,
      instruction:
        gradeLevel === "Preschool"
          ? `Find ${topicTitle}.`
          : earlyTryPrompt ?? `Try ${topicTitle} with help.`,
      learnerAction: isKindergarten ? `Find ${correctAnswer}.` : isGrade1 ? "Use the picture clue." : `Use the model to select or build ${topicTitle}.`,
      choices: tryChoices,
      correctAnswer,
      correctAssetConcept: correctAnswer,
      correctAnswerRepresentation,
      targetConcept: correctAnswer,
      guidedQuestions: tryQuestions,
      learningGoal: `Practice ${topicTitle} with guided support.`,
      questionText:
        gradeLevel === "Preschool"
          ? `Can you find ${topicTitle}?`
          : earlyTryPrompt ?? `Which guided hint helps with ${topicTitle}?`,
      feedbackCorrect: `Great! That is ${topicTitle}.`,
      feedbackWrong: earlyWrongFeedback ?? upperGradeBalance?.feedbackWrong ?? `Try again. Look for ${topicTitle}.`,
      renderer: gradeLevel === "Preschool" ? "TwoChoiceRecognitionRenderer" : renderer,
      audioText: `Find ${topicTitle}.`,
      ...(upperGradeBalance
        ? {
            answerVisibility: "hidden-until-response" as const,
            cognitiveObjective: upperGradeBalance.tryObjective,
            randomization: ["choice-order", "distractor-order"],
          }
        : {}),
      ...colorStageMetadata,
      ...shapeStageMetadata,
      ...animalStageMetadata,
      ...fruitStageMetadata,
      ...foodStageMetadata,
      ...numberStageMetadata,
      ...countingForestStageMetadata,
      ...sizeStageMetadata,
      ...quantityStageMetadata,
      ...patternStageMetadata,
      ...worldChallengeMetadata,
      ...stageContract("TRY"),
      ...preschoolStageSupport("TRY"),
      ...(gradeLevel === "Grade 2" || gradeLevel === "Grade 3" ? { manipulatives } : {}),
    },
    {
      stage: "CHOOSE",
      purpose: `Check independent recall for ${topicTitle}.`,
      instruction:
        earlyChoosePrompt ??
        (topicItem.category === "numeric"
          ? gradeLevel === "Grade 2"
            ? `Solve the ${topicTitle} model.`
            : `Choose the answer for ${topicTitle}.`
          : `Which one shows ${topicTitle}?`),
      learnerAction: isKindergarten ? `Choose ${correctAnswer}.` : isGrade1 ? "Choose the best match." : `Choose ${topicTitle} without the first hint.`,
      choices: chooseChoices,
      correctAnswer,
      correctAssetConcept: correctAnswer,
      correctAnswerRepresentation,
      targetConcept: correctAnswer,
      independentQuestions: chooseQuestions,
      learningGoal: `Recall and apply ${topicTitle} independently.`,
      questionText:
        earlyChoosePrompt ??
        (topicItem.category === "numeric"
          ? `Which answer matches ${topicTitle}?`
          : `Which choice best shows ${topicTitle}?`),
      feedbackCorrect: `Yes! You chose ${topicTitle}.`,
      feedbackWrong: earlyWrongFeedback ?? upperGradeBalance?.feedbackWrong ?? `Look again and choose ${topicTitle}.`,
      renderer: gradeLevel === "Preschool" ? "PictureChoiceRenderer" : renderer,
      audioText: `Which one shows ${topicTitle}?`,
      ...(upperGradeBalance
        ? {
            answerVisibility: "hidden-until-response" as const,
            cognitiveObjective: upperGradeBalance.chooseObjective,
            randomization: ["choice-order", "distractor-order"],
          }
        : {}),
      ...colorStageMetadata,
      ...shapeStageMetadata,
      ...animalStageMetadata,
      ...fruitStageMetadata,
      ...foodStageMetadata,
      ...numberStageMetadata,
      ...countingForestStageMetadata,
      ...sizeStageMetadata,
      ...quantityStageMetadata,
      ...patternStageMetadata,
      ...worldChallengeMetadata,
      ...stageContract("CHOOSE"),
      ...preschoolStageSupport("CHOOSE"),
      ...(gradeLevel === "Grade 2" || gradeLevel === "Grade 3" ? { evidenceSentences, manipulatives } : {}),
    },
    {
      stage: "PLAY",
      purpose: `Apply ${topicTitle} through ${activityType}.`,
      instruction: playInstruction,
      learnerAction:
        gradeLevel === "Preschool"
          ? `${playInstruction} Finish all three rounds.`
          : `Complete the ${topicTitle} activity in ${world.title}.`,
      audioText: playInstruction,
      choices:
        gradeLevel === "Preschool" ||
        gradeLevel === "Kindergarten" ||
        gradeLevel === "Grade 1" ||
        gradeLevel === "Grade 2"
          ? undefined
          : uniqueNormalizedValues([correctAnswer, ...playChoices]).slice(
              0,
              playChoiceLimit
            ),
      correctAnswer:
        gradeLevel === "Preschool" ||
        gradeLevel === "Kindergarten" ||
        gradeLevel === "Grade 1" ||
        gradeLevel === "Grade 2"
          ? undefined
          : correctAnswer,
      correctAnswerRepresentation:
        gradeLevel === "Preschool" ||
        gradeLevel === "Kindergarten" ||
        gradeLevel === "Grade 1" ||
        gradeLevel === "Grade 2"
          ? undefined
          : correctAnswerRepresentation,
      correctEvidence: evidenceSentences[0],
      evidenceSentences,
      questionText,
      feedbackCorrect: `You completed the ${topicTitle} challenge!`,
      feedbackWrong: `Try the ${topicTitle} challenge again.`,
      manipulatives,
      ...(upperGradeBalance
        ? {
            cognitiveObjective:
              gradeLevel === "Grade 3"
                ? "Apply reading evidence or multi-step reasoning before submitting."
                : "Apply the model, evidence, or manipulative before submitting.",
            visualContent: topicDatabase.visualAssetRequirements.images.slice(
              0,
              upperGradeBalance.playVisualLimit
            ),
          }
        : {}),
      renderer: playRenderer,
      applicationActivity: buildApplicationActivity(
        topicTitle,
        world,
        playRenderer,
        playAction,
        topicDatabase.behaviorProfile
      ),
      learningGoal: `Apply ${topicTitle} in a competency-aware activity.`,
      timerSeconds: gradeLevel === "Preschool" || gradeLevel === "Kindergarten" ? 20 : undefined,
      roundCount: gradeLevel === "Preschool" ? 3 : undefined,
      revealSuccessAfterRound: gradeLevel === "Preschool" ? 3 : undefined,
      ...colorStageMetadata,
      ...shapeStageMetadata,
      ...animalStageMetadata,
      ...fruitStageMetadata,
      ...foodStageMetadata,
      ...numberStageMetadata,
      ...countingForestStageMetadata,
      ...sizeStageMetadata,
      ...quantityStageMetadata,
      ...patternStageMetadata,
      ...worldChallengeMetadata,
      ...stageContract("PLAY", playRenderer),
      ...preschoolStageSupport("PLAY"),
      ...(gradeLevel === "Grade 2" || gradeLevel === "Grade 3" ? { passage } : {}),
    },
    {
      stage: "STAR",
      purpose: `Reward completion of ${topicTitle}.`,
      instruction: `Great job learning ${topicTitle}!`,
      learnerAction: "Claim reward.",
      feedbackCorrect: `You learned ${topicTitle}!`,
      renderer: "RewardRenderer",
      xpReward: 10,
      starReward: 1,
      rewardLogic: `Award 10 XP and one star for completing ${topicTitle} PLAY once.`,
      ...stageContract("STAR"),
    },
    {
      stage: "PROGRESS",
      purpose: `Save ${topicTitle} progress for ${world.title}.`,
      instruction: `${topicTitle} completed!`,
      learnerAction: `View ${world.title} progress.`,
      renderer: "ProgressRenderer",
      trackingLogic: `Persist current stage, topic mastery percent, XP, stars, and ${world.title} completion for ${topicTitle}.`,
      ...stageContract("PROGRESS"),
    },
    {
      stage: "MASTERED",
      purpose: `Mark ${topicTitle} mastered and unlock the next goal.`,
      instruction: `${topicTitle} Mastered!`,
      learnerAction: `Review the ${topicTitle} evidence checklist, confirm the PLAY competency task, and ${unlockTarget ? `unlock ${unlockTarget}` : `complete ${world.title}`}.`,
      renderer: "MasteryRenderer",
      unlockTarget,
      masteryConditions: topicDatabase.masteryRules.conditions,
      ...stageContract("MASTERED"),
    },
  ];
}

function addCompetencyTraceabilityToGrade(grade: GradeCurriculum): GradeCurriculum {
  const competencySource =
    grade.gradeLevel === "Preschool"
      ? "Early Childhood Kindergarten Readiness"
      : "MATATAG Foundational Literacy and Numeracy";
  const cognitiveTemplate = GRADE_COGNITIVE_TEMPLATES[grade.gradeLevel];

  return {
    ...grade,
    worlds: grade.worlds.map((world) => ({
      ...world,
      worldIdentity: world.worldIdentity ?? buildWorldContentIdentity(grade.gradeLevel, world),
      topics: world.topics.map((topicItem, index) => {
        const template = getWorldActivityTemplate(world.id);
        const contentBibleOverride = getTopicContentBibleOverride(
          grade.gradeLevel,
          world.id,
          topicItem.title
        );
        const activityType =
          topicItem.activityType ??
          contentBibleOverride?.activityType ??
          getTopicActivityType(topicItem);
        const cognitiveFocus =
          topicItem.cognitiveFocus ??
          contentBibleOverride?.cognitiveFocus ??
          `${cognitiveTemplate.level}: ${cognitiveTemplate.learnerGoal.join(", ")}`;
        const fundamentalSkill =
          topicItem.fundamentalSkill ??
          contentBibleOverride?.fundamentalSkill ??
          template?.learningType ??
          world.description;
        const overrideContent = contentBibleOverride?.content;
        const requiredRenderer =
          topicItem.requiredRenderer ??
          contentBibleOverride?.requiredRenderer ??
          getRequiredStageRenderer(
            grade.gradeLevel,
            world.id,
            template?.label ?? `${world.title} renderer`
          );
        const knowledge = overrideContent?.knowledge ?? getTopicKnowledge(topicItem, fundamentalSkill);
        const learningObjective = overrideContent?.learningObjective ?? getLearningObjective(
          grade.gradeLevel,
          topicItem.title,
          fundamentalSkill
        );
        const successCriteria = overrideContent?.successCriteria ?? getSuccessCriteria(topicItem.title, requiredRenderer);
        const topicDatabase = buildTopicContentDatabase({
          knowledge,
          renderer: requiredRenderer,
          successCriteria,
          topicTitle: topicItem.title,
          world,
        });
        const nextTopic = world.topics[index + 1];
        const baseFrameworkStages =
          topicItem.frameworkStages ??
          applyFrameworkStageOverrides(
            buildFrameworkStages({
              activityType,
              cognitiveFocus,
              fundamentalSkill,
              gradeLevel: grade.gradeLevel,
              nextTopic,
              renderer: requiredRenderer,
              topicItem,
              topics: world.topics,
              world,
            }),
            contentBibleOverride
          );
        const familyFrameworkStages = applyScopedFamilyWordStageContract(
          baseFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const bodyFrameworkStages = applyScopedBodyStageContract(
          familyFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const colorFrameworkStages = applyScopedColorStageContract(
          bodyFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const shapeFrameworkStages = applyScopedShapeStageContract(
          colorFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const animalFrameworkStages = applyScopedAnimalStageContract(
          shapeFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const fruitFrameworkStages = applyScopedFruitStageContract(
          animalFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const foodFrameworkStages = applyScopedFoodStageContract(
          fruitFrameworkStages,
          world.id,
          topicItem.title,
          world.topics
        );
        const countingForestFrameworkStages = applyScopedCountingForestStageContract(
          foodFrameworkStages,
          world.id,
          topicItem.title
        );
        const numberFrameworkStages = applyScopedNumberStageContract(
          countingForestFrameworkStages,
          world.id,
          topicItem.title
        );
        const frameworkStages = normalizeFrameworkStageAnswerIntegrity(
          numberFrameworkStages,
          world.topics
        );
        const topicContentId = `${world.id}:${topicItem.title}`;
        const topicAssetSlots = buildTopicAssetSlots(world.id, topicItem.title);
        const batibotContent: BatiBotTopicContent =
          topicItem.batibotContent ?? {
            ...topicAssetSlots,
            activityType,
            behaviorProfile: topicDatabase.behaviorProfile,
            competency: overrideContent?.competency ?? `${grade.gradeLevel} ${topicItem.category === "numeric" ? "numeracy" : "literacy"} competency for ${topicItem.title}.`,
            curriculumArea: topicItem.category === "numeric" ? "Foundational Numeracy" : "Foundational Literacy",
            cognitiveFocus,
            difficultyLevel: getTopicDifficultyLevel(grade.gradeLevel),
            examples: overrideContent?.examples ?? topicDatabase.examples,
            frameworkStages,
            fundamentalSkill,
            id: topicContentId,
            knowledge,
            knowledgeUnits: overrideContent?.knowledgeUnits ?? topicDatabase.knowledgeUnits,
            level: getBatiBotTopicLevel(grade.gradeLevel),
            learningObjective,
            masteryRules: overrideContent?.masteryRules ?? topicDatabase.masteryRules,
            misconceptions: overrideContent?.misconceptions ?? topicDatabase.misconceptions,
            nonExamples: overrideContent?.nonExamples ?? topicDatabase.nonExamples,
            recommendedRenderer: getGrade1RecommendedRendererName(
              requiredRenderer,
              world,
              topicItem.title
            ),
            requiredRenderer,
            rendererAliases: getRendererAliases(requiredRenderer, world, topicItem.title),
            rewardRule: {
              xp: 10,
              stars: 1,
            },
            successCriteria,
            topic: topicItem.title,
            unlockRule: {
              unlocksNextTopic: Boolean(nextTopic),
              ...(nextTopic ? { nextTopic: nextTopic.title } : {}),
            },
            validationRules: topicDatabase.validationRules,
            visualAssetRequirements: topicDatabase.visualAssetRequirements,
            vocabularyBank: overrideContent?.vocabularyBank ?? topicDatabase.vocabularyBank,
            world: world.title,
          };

        return {
          ...topicItem,
          activityType,
          batibotContent,
          cognitiveFocus:
            cognitiveFocus,
          competencyCode:
            topicItem.competencyCode ??
            `${slugifyCompetency(grade.gradeLevel)}-${slugifyCompetency(world.id)}-${String(index + 1).padStart(2, "0")}`,
          competencyObjective:
            topicItem.competencyObjective ??
            `${grade.gradeLevel} ${topicItem.category === "numeric" ? "numeracy" : "literacy"}: ${topicItem.example}`,
          competencySource,
          curriculumLevel: topicItem.curriculumLevel ?? grade.gradeLevel,
          frameworkStages,
          fundamentalSkill,
          requiredRenderer,
          rewardRule:
            topicItem.rewardRule ??
            "Complete STAR after PLAY to earn XP and one topic star once.",
          unlockRule:
            topicItem.unlockRule ??
            "Complete MASTERED after all eight stages to unlock the next topic or goal.",
          worldName: topicItem.worldName ?? world.title,
        };
      }),
    })),
  };
}

const BASE_CURRICULUM: GradeCurriculum[] = [
  {
    gradeLevel: "Preschool",
    title: "Preschool Curriculum",
    worlds: [
      {
        id: "preschool-family-world",
        title: "My Family World",
        emoji: "HOME",
        accentColor: "#6D28FF",
        description: "A purple family adventure about caring, helping, sharing, and home.",
        activities: [
          "Observe family roles",
          "Explore three helping actions",
          "Choose with a visible hint",
          "Choose independently",
          "Deliver, pack, share, help, and organize",
        ],
        topics: [
          topic("Mother", "M", "linguistic", "family", ["Tap Activity", "Match Activity", "Drag and Drop Activity"], "Mother helps and cares for the family."),
          topic("Father", "F", "linguistic", "family", ["Tap Activity", "Match Activity", "Drag and Drop Activity"], "Father helps and repairs things."),
          topic("Brother", "B", "linguistic", "family", ["Tap Activity", "Counting Activity", "Drag and Drop Activity"], "A brother can play and share fairly."),
          topic("Sister", "S", "linguistic", "family", ["Tap Activity", "Match Activity", "Drag and Drop Activity"], "A sister can learn, help, and share."),
          topic("Baby", "B", "linguistic", "family", ["Tap Activity", "Match Activity", "Drag and Drop Activity"], "A baby needs gentle care."),
          topic("Friend", "F", "linguistic", "family", ["Tap Activity", "Match Activity", "Story-Based Activity"], "A friend is someone we play and share with."),
          topic("Home", "H", "linguistic", "family", ["Tap Activity", "Match Activity", "Drag and Drop Activity"], "Home is where a family cares for one another."),
          topic("Family", "F", "linguistic", "family", ["Match Activity", "Drag and Drop Activity", "Mastery Challenge"], "Family helps and cares together."),
        ],
      },
      preschoolWorldFromConfig(PRESCHOOL_BODY_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_COLOR_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_SHAPE_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_ANIMAL_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_FRUIT_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_FOOD_WORLD_CONFIG),
      preschoolWorldFromConfig(PRESCHOOL_NUMBER_WORLD_CONFIG),
    ],
  },
  {
    gradeLevel: "Kindergarten",
    title: "Kindergarten Curriculum",
    worlds: [
      kindergartenWorldFromConfig(KINDERGARTEN_ALPHABET_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_SCHOOL_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_COMMUNITY_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_NUMBER_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_SIZE_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_QUANTITY_WORLD_CONFIG),
      kindergartenWorldFromConfig(KINDERGARTEN_PATTERN_WORLD_CONFIG),
    ],
  },
  {
    gradeLevel: "Grade 1",
    title: "Grade 1 Curriculum",
    worlds: [
      grade1WorldFromConfig(GRADE1_WORD_WORLD_CONFIG),
      grade1WorldFromConfig(GRADE1_READING_WORLD_CONFIG),
      grade1WorldFromConfig(GRADE1_NUMBER_WORLD_CONFIG),
      grade1WorldFromConfig(GRADE1_MATH_WORLD_CONFIG),
      // Family Story Village duplicates early Reading Quest goals, so it stays authored
      // but hidden from the foundational Grade 1 learner map for now.
      grade1WorldFromConfig(GRADE1_TIME_WORLD_CONFIG),
      grade1WorldFromConfig(GRADE1_SHAPE_WORLD_CONFIG),
      grade1WorldFromConfig(GRADE1_NATURE_WORLD_CONFIG),
    ],
  },
  {
    gradeLevel: "Grade 2",
    title: "Grade 2 Curriculum",
    worlds: [
      grade2WorldFromConfig(GRADE2_VOCABULARY_WORLD_CONFIG),
      grade2WorldFromConfig(GRADE2_PLACE_VALUE_WORLD_CONFIG),
      grade2WorldFromConfig(GRADE2_PROBLEM_SOLVING_WORLD_CONFIG),
      grade2WorldFromConfig(GRADE2_MEASUREMENT_WORLD_CONFIG),
      grade2WorldFromConfig(GRADE2_MULTIPLICATION_WORLD_CONFIG),
      grade2WorldFromConfig(GRADE2_STORY_WORLD_CONFIG),
    ],
  },
  {
    gradeLevel: "Grade 3",
    title: "Grade 3 Curriculum",
    worlds: [
      grade3WorldFromConfig(GRADE3_READING_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_CONTEXT_CLUE_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_STORY_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_NUMBER_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_MULTIPLICATION_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_DIVISION_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_FRACTION_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_MONEY_WORLD_CONFIG),
      grade3WorldFromConfig(GRADE3_CHALLENGE_WORLD_CONFIG),
    ],
  },
];

export const CURRICULUM: GradeCurriculum[] = BASE_CURRICULUM.map(
  addKindergartenSupportToGrade
).map(addCompetencyTraceabilityToGrade);

export function getCurriculumForGrade(gradeLevel?: LearnerGradeLevel | null) {
  return (
    CURRICULUM.find((curriculum) => curriculum.gradeLevel === gradeLevel) ??
    CURRICULUM[0]
  );
}

export function isCurriculumIntroTopic(topic: CurriculumTopic) {
  return /^What\s+(is|are)\b/i.test(topic.title);
}

export function getWorldLearningTopics(world: CurriculumWorld) {
  return world.topics.filter((topic) => !isCurriculumIntroTopic(topic));
}

export function getAllCurriculumWorlds() {
  return CURRICULUM.flatMap((curriculum) =>
    curriculum.worlds.map((world) => ({
      ...world,
      gradeLevel: curriculum.gradeLevel,
      curriculumTitle: curriculum.title,
    }))
  );
}

export function getAllCurriculumTopics() {
  return getAllCurriculumWorlds().flatMap((world) =>
    world.topics.map((topicItem) => ({
      ...topicItem,
      accentColor: world.accentColor,
      curriculumTitle: world.curriculumTitle,
      gradeLevel: world.gradeLevel,
      worldId: world.id,
      worldTitle: world.title,
    }))
  );
}

export function getAllBatiBotTopicContent(): BatiBotTopicContent[] {
  return getAllCurriculumTopics()
    .map((topicItem) => topicItem.batibotContent)
    .filter((content): content is BatiBotTopicContent => Boolean(content));
}

export type FrameworkValidationSeverity = "critical" | "warning";

export type FrameworkValidationIssue = {
  level: BatiBotTopicLevel;
  world: string;
  topic: string;
  stage?: FrameworkStageLabel;
  issue: string;
  severity: FrameworkValidationSeverity;
};

export type CurriculumQualitySeverity = "Minor" | "Major" | "Critical";

export type CurriculumQualityScoreKey =
  | "contentDepth"
  | "contentAppropriateness"
  | "curriculumAlignment"
  | "frameworkCompliance"
  | "frameworkEvolution"
  | "activeLearning"
  | "simulationQuality"
  | "topicUniqueness"
  | "worldIdentity"
  | "gradeDifferentiation"
  | "animationQuality"
  | "masteryQuality"
  | "overallLearningQuality";

export type CurriculumQualityScores = Record<CurriculumQualityScoreKey, number>;

export type CurriculumQualityAuditIssue = {
  issue: string;
  severity: CurriculumQualitySeverity;
  affectedGrade: BatiBotTopicLevel;
  affectedWorld: string;
  affectedTopic: string;
  affectedStage?: FrameworkStageLabel;
  whyItMatters: string;
  recommendedFix: string;
  exampleFix: string;
  expectedOutcome: string;
};

export type CurriculumQualityAuditSummary = {
  auditedGrades: BatiBotTopicLevel[];
  issueCount: number;
  issues: CurriculumQualityAuditIssue[];
  prioritizedFixList: string[];
  productionReady: boolean;
  readinessScore: number;
  scores: CurriculumQualityScores;
  topicCount: number;
  worldCount: number;
};

export type FrameworkValidationSummary = {
  issueCount: number;
  issues: FrameworkValidationIssue[];
  score: number;
  topicCount: number;
  validTopicCount: number;
};

const EXPECTED_FRAMEWORK_STAGE_ORDER: FrameworkStageLabel[] = [
  "LOOK",
  "TAP",
  "TRY",
  "CHOOSE",
  "PLAY",
  "STAR",
  "PROGRESS",
  "MASTERED",
];

function isGenericStageText(value?: string) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();

  return [
    "show topic",
    "tap topic",
    "choose topic",
    "play topic",
    "show the topic",
    "tap the topic",
    "choose the topic",
    "choose the answer",
    "read the story",
    "find the picture",
    "finish the challenge",
    "match the word",
  ].some((phrase) => normalized === phrase || normalized.includes(`${phrase}.`));
}

function isWeakAnimationPurpose(value?: string) {
  if (!value) {
    return true;
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized.includes("decorat") ||
    normalized.includes("just for fun") ||
    normalized.includes("visual effect only")
  ) {
    return true;
  }

  return !["teach", "guide", "reinforce", "celebrate", "show"].some((word) =>
    normalized.includes(word)
  );
}

function addValidationIssue(
  issues: FrameworkValidationIssue[],
  content: BatiBotTopicContent,
  issue: string,
  severity: FrameworkValidationSeverity,
  stage?: FrameworkStageLabel
) {
  issues.push({
    issue,
    level: content.level,
    severity,
    stage,
    topic: content.topic,
    world: content.world,
  });
}

function countCorrectAnswerMatches(
  choices: string[] | undefined,
  correctAnswer: string | undefined
) {
  if (!choices?.length || !correctAnswer) {
    return 0;
  }

  const normalizedCorrect = normalizeAnswerLabel(correctAnswer);

  return choices.filter(
    (choice) => normalizeAnswerLabel(choice) === normalizedCorrect
  ).length;
}

function isGroupConcept(value: string) {
  return ["family", "community", "classroom", "friends", "group", "school", "team"].includes(
    normalizeAnswerLabel(getCanonicalAnswerLabel(value))
  );
}

export function validateBatiBotTopicContent(
  content: BatiBotTopicContent
): FrameworkValidationIssue[] {
  const issues: FrameworkValidationIssue[] = [];
  const stages = content.frameworkStages;

  if (
    !content.competency ||
    !content.curriculumArea ||
    !content.learningObjective ||
    !content.knowledge ||
    !content.successCriteria?.length
  ) {
    addValidationIssue(
      issues,
      content,
      "Topic identity must include curriculum area, competency, learning objective, knowledge, and success criteria.",
      "critical"
    );
  }

  if (
    !content.topicAssetSlot ||
    !content.lookAssetSlot ||
    !content.tapAssetSlot ||
    !content.tryAssetSlot ||
    !content.chooseAssetSlot ||
    !content.playAssetSlot ||
    !content.rewardAssetSlot ||
    !content.masteryAssetSlot
  ) {
    addValidationIssue(
      issues,
      content,
      "Every topic must expose topic, LOOK, TAP, TRY, CHOOSE, PLAY, reward, and mastery asset slots.",
      "critical"
    );
  }

  if (stages.length !== EXPECTED_FRAMEWORK_STAGE_ORDER.length) {
    addValidationIssue(
      issues,
      content,
      "Topic must have exactly eight framework stages.",
      "critical"
    );
  }

  EXPECTED_FRAMEWORK_STAGE_ORDER.forEach((expectedStage, index) => {
    const stage = stages[index];

    if (!stage || stage.stage !== expectedStage) {
      addValidationIssue(
        issues,
        content,
        `Stage ${index + 1} must be ${expectedStage}.`,
        "critical",
        expectedStage
      );
      return;
    }

    if (
      isGenericStageText(stage.purpose) ||
      isGenericStageText(stage.instruction) ||
      isGenericStageText(stage.learnerAction) ||
      isGenericStageText(stage.questionText)
    ) {
      addValidationIssue(
        issues,
        content,
        "Stage content is missing topic-specific behavior.",
        "critical",
        expectedStage
      );
    }

    if (!stage.renderer || !stage.requiredAction) {
      addValidationIssue(
        issues,
        content,
        "Stage must define renderer and required learner action.",
        "critical",
        expectedStage
      );
    }

    if (!stage.cognitiveSkill) {
      addValidationIssue(
        issues,
        content,
        "Stage must define a cognitive skill.",
        "critical",
        expectedStage
      );
    }

    if (!stage.difficulty) {
      addValidationIssue(
        issues,
        content,
        "Stage must define difficulty.",
        "critical",
        expectedStage
      );
    }

    if (
      !stage.content ||
      !stage.uiBehavior ||
      !stage.interaction ||
      !stage.feedback ||
      !stage.completionRule
    ) {
      addValidationIssue(
        issues,
        content,
        "Stage must define content, UI behavior, interaction, feedback, and completion rule.",
        "critical",
        expectedStage
      );
    }

    if (!stage.animation || isWeakAnimationPurpose(stage.animationPurpose)) {
      addValidationIssue(
        issues,
        content,
        "Stage animation must serve a learning purpose.",
        "critical",
        expectedStage
      );
    }
  });

  const purposeCount = new Set(stages.map((stage) => stage.purpose)).size;

  if (purposeCount !== stages.length) {
    addValidationIssue(
      issues,
      content,
      "Each stage purpose must be unique.",
      "critical"
    );
  }

  const lookStage = stages.find((stage) => stage.stage === "LOOK");
  const tapStage = stages.find((stage) => stage.stage === "TAP");
  const tryStage = stages.find((stage) => stage.stage === "TRY");
  const chooseStage = stages.find((stage) => stage.stage === "CHOOSE");
  const playStage = stages.find((stage) => stage.stage === "PLAY");
  const starStage = stages.find((stage) => stage.stage === "STAR");
  const progressStage = stages.find((stage) => stage.stage === "PROGRESS");
  const masteryStage = stages.find((stage) => stage.stage === "MASTERED");
  const requiresContentDatabase =
    content.level === "grade1" ||
    content.level === "grade2" ||
    content.level === "grade3";
  const sameChoiceSet = (left?: string[], right?: string[]) => {
    if (!left?.length || !right?.length || left.length !== right.length) {
      return false;
    }

    const normalize = (choices: string[]) => choices.map((choice) => choice.toLowerCase()).sort().join("|");

    return normalize(left) === normalize(right);
  };
  const lookTeachingText = [
    lookStage?.instruction,
    lookStage?.audioText,
    lookStage?.teachingScript,
    ...(lookStage?.visualContent ?? []),
  ].filter(Boolean).join(" ").toLowerCase();
  const tapDiscoveryItems = tapStage?.discoveryContent ?? [];

  [tapStage, tryStage, chooseStage].forEach((stage) => {
    if (!stage?.choices?.length) {
      return;
    }

    if (!isAllowedChoiceCount(stage.choices.length)) {
      addValidationIssue(
        issues,
        content,
        `${stage.stage} choices must render exactly two or four answers.`,
        "critical",
        stage.stage
      );
    }
  });

  [tryStage, chooseStage, playStage].forEach((stage) => {
    if (!stage?.choices?.length || !usesSingleCorrectAnswer(stage)) {
      return;
    }

    const matchCount = countCorrectAnswerMatches(
      stage.choices,
      stage.correctAnswer
    );

    if (matchCount !== 1) {
      addValidationIssue(
        issues,
        content,
        `${stage.stage} must contain exactly one explicit correct answer; found ${matchCount}.`,
        "critical",
        stage.stage
      );
    }

    const integrity = validateActivityCorrectAnswer({
      choices: stage.choices,
      correctAnswer: stage.correctAnswer,
      correctAssetConcept: stage.correctAssetConcept,
      targetConcept: stage.targetConcept ?? stage.correctAnswer,
    });

    integrity.issues
      .filter((issue) => !issue.startsWith("Activity must contain exactly one correct answer"))
      .forEach((issue) => {
        addValidationIssue(
          issues,
          content,
          issue,
          "critical",
          stage.stage
        );
      });

    if (
      isGroupConcept(content.topic) &&
      stage.correctAnswerRepresentation !== "group-scene"
    ) {
      addValidationIssue(
        issues,
        content,
        `${stage.stage} group concepts must use a group-scene correct answer.`,
        "critical",
        stage.stage
      );
    }

    if (
      normalizeAnswerLabel(getCanonicalAnswerLabel(content.topic)) === "home" &&
      stage.correctAnswerRepresentation !== "place-scene"
    ) {
      addValidationIssue(
        issues,
        content,
        `${stage.stage} Home answers must use a place-scene card.`,
        "critical",
        stage.stage
      );
    }
  });

  [
    ...(tryStage?.guidedQuestions ?? []),
    ...(chooseStage?.independentQuestions ?? []),
  ].forEach((question) => {
    if (!isAllowedChoiceCount(question.choices.length)) {
      addValidationIssue(
        issues,
        content,
        "Generated question must contain exactly two or four choices.",
        "critical"
      );
    }

    const matchCount = countCorrectAnswerMatches(
      question.choices,
      question.correctAnswer
    );

    if (matchCount !== 1) {
      addValidationIssue(
        issues,
        content,
        `Generated question must contain exactly one correct answer; found ${matchCount}.`,
        "critical"
      );
    }
  });

  if (lookStage?.cognitiveSkill === tapStage?.cognitiveSkill) {
    addValidationIssue(
      issues,
      content,
      "LOOK and TAP must require different cognitive behavior.",
      "critical",
      "TAP"
    );
  }

  if (tryStage?.cognitiveSkill === chooseStage?.cognitiveSkill) {
    addValidationIssue(
      issues,
      content,
      "TRY and CHOOSE must require different cognitive behavior.",
      "critical",
      "CHOOSE"
    );
  }

  if (chooseStage?.cognitiveSkill === playStage?.cognitiveSkill) {
    addValidationIssue(
      issues,
      content,
      "CHOOSE and PLAY must require different cognitive behavior.",
      "critical",
      "PLAY"
    );
  }

  if (playStage?.cognitiveSkill !== "apply") {
    addValidationIssue(
      issues,
      content,
      "PLAY must require application, not repeated recognition.",
      "critical",
      "PLAY"
    );
  }

  if (
    chooseStage &&
    playStage &&
    sameChoiceSet(chooseStage.choices, playStage.choices) &&
    chooseStage.requiredAction === playStage.requiredAction
  ) {
    addValidationIssue(
      issues,
      content,
      "PLAY must not reuse exact CHOOSE activity.",
      "critical",
      "PLAY"
    );
  }

  if (requiresContentDatabase) {
    if ((content.knowledgeUnits?.length ?? 0) < 4) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must define knowledge units.",
        "critical"
      );
    }

    if ((content.examples?.length ?? 0) < 10) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must include at least 10 examples.",
        "critical"
      );
    }

    if ((content.nonExamples?.length ?? 0) < 5) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must include at least 5 non-examples.",
        "critical"
      );
    }

    if (!content.misconceptions?.length) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must include common misconceptions and corrections.",
        "critical"
      );
    }

    if ((content.vocabularyBank?.length ?? 0) < 15) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must include at least 15 vocabulary bank entries.",
        "critical"
      );
    }

    if (
      !content.visualAssetRequirements?.images.length ||
      !content.visualAssetRequirements.animations.length ||
      !content.visualAssetRequirements.audio.length
    ) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must define image, animation, and audio asset requirements.",
        "critical"
      );
    }

    if ((tryStage?.guidedQuestions?.length ?? 0) < 5) {
      addValidationIssue(
        issues,
        content,
        "TRY must include at least 5 guided questions.",
        "critical",
        "TRY"
      );
    }

    if ((chooseStage?.independentQuestions?.length ?? 0) < 10) {
      addValidationIssue(
        issues,
        content,
        "CHOOSE must include at least 10 independent questions.",
        "critical",
        "CHOOSE"
      );
    }

    if (!lookStage?.teachingScript || !lookStage.visualContent?.length || !lookStage.audioContent?.length) {
      addValidationIssue(
        issues,
        content,
        "LOOK must include teaching script, visual content, and audio content.",
        "critical",
        "LOOK"
      );
    }

    if (!tapStage?.discoveryContent?.length) {
      addValidationIssue(
        issues,
        content,
        "TAP must include discovery content.",
        "critical",
        "TAP"
      );
    }

    if (!playStage?.applicationActivity) {
      addValidationIssue(
        issues,
        content,
        "PLAY must define a competency-proving application activity.",
        "critical",
        "PLAY"
      );
    }

    if (!content.behaviorProfile?.competencyBehavior || !content.behaviorProfile.allowedPlayActivities?.length) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must define competency behavior and allowed PLAY activities.",
        "critical"
      );
    }

    if (!content.difficultyLevel || !content.recommendedRenderer || !content.rendererAliases?.length) {
      addValidationIssue(
        issues,
        content,
        "Grade 1-3 topics must define difficulty level, recommended renderer, and renderer aliases.",
        "critical"
      );
    }

    if (!content.masteryRules?.competencyDemonstration || !content.masteryRules.evidenceRequired?.length) {
      addValidationIssue(
        issues,
        content,
        "Mastery must require competency demonstration and evidence.",
        "critical",
        "MASTERED"
      );
    }

    if (
      playStage?.applicationActivity &&
      content.behaviorProfile?.allowedPlayActivities?.length &&
      !content.behaviorProfile.allowedPlayActivities.includes(playStage.applicationActivity.type)
    ) {
      addValidationIssue(
        issues,
        content,
        "PLAY activity must match the topic competency behavior.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.behaviorProfile?.requiresSimulation &&
      (!playStage?.applicationActivity?.simulationType ||
        /multiple choice|quiz|choice only/i.test(playStage.applicationActivity.simulationType) ||
        /choose answer|multiple choice|quiz/i.test(playStage.applicationActivity.type))
    ) {
      addValidationIssue(
        issues,
        content,
        "Simulation-worthy competencies must use a real-life application simulation, not multiple choice alone.",
        "critical",
        "PLAY"
      );
    }

    if (!starStage?.rewardLogic || !progressStage?.trackingLogic || !masteryStage?.masteryConditions?.length) {
      addValidationIssue(
        issues,
        content,
        "STAR, PROGRESS, and MASTERED must define reward, tracking, and mastery logic.",
        "critical"
      );
    }
  }

  if (lookStage?.instruction === tapStage?.instruction || tapStage?.requiredAction !== "tap") {
    addValidationIssue(
      issues,
      content,
      "TAP must be more interactive than LOOK.",
      "critical",
      "TAP"
    );
  }

  if (
    tapStage &&
    (!tapDiscoveryItems.length ||
      !tapDiscoveryItems.some((item) => !lookTeachingText.includes(item.toLowerCase())))
  ) {
    addValidationIssue(
      issues,
      content,
      "TAP must reveal new info not shown in LOOK.",
      "critical",
      "TAP"
    );
  }

  if (tryStage?.instruction === chooseStage?.instruction) {
    addValidationIssue(
      issues,
      content,
      "TRY must be guided and different from CHOOSE.",
      "critical",
      "TRY"
    );
  }

  if (!starStage?.xpReward || !starStage.starReward) {
    addValidationIssue(
      issues,
      content,
      "STAR must award XP and one star.",
      "critical",
      "STAR"
    );
  }

  if (!progressStage?.instruction.toLowerCase().includes("completed")) {
    addValidationIssue(
      issues,
      content,
      "PROGRESS must update topic or world progress.",
      "warning",
      "PROGRESS"
    );
  }

  if (!masteryStage?.unlockTarget && content.unlockRule.unlocksNextTopic) {
    addValidationIssue(
      issues,
      content,
      "MASTERED must unlock the next topic when one exists.",
      "critical",
      "MASTERED"
    );
  }

  if (content.level === "preschool") {
    const instructionalStages = [lookStage, tapStage, tryStage, chooseStage, playStage];
    const preschoolWorldId =
      CURRICULUM.find((grade) => grade.gradeLevel === "Preschool")
        ?.worlds.find((world) => world.title === content.world)?.id ?? "";
    const countWords = (value?: string) =>
      value?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    const preschoolProgression: [FrameworkStageLabel, CognitiveSkill][] = [
      ["LOOK", "observe"],
      ["TAP", "recognize"],
      ["TRY", "recall"],
      ["CHOOSE", "reason"],
      ["PLAY", "apply"],
    ];
    const stageByLabel: Partial<Record<FrameworkStageLabel, FrameworkStageContent | undefined>> = {
      CHOOSE: chooseStage,
      LOOK: lookStage,
      PLAY: playStage,
      TAP: tapStage,
      TRY: tryStage,
    };

    preschoolProgression.forEach(([stageLabel, expectedSkill], index) => {
      const stage = stageByLabel[stageLabel];
      const previousStage = index > 0 ? stageByLabel[preschoolProgression[index - 1][0]] : undefined;

      if (stage?.cognitiveSkill !== expectedSkill) {
        addValidationIssue(
          issues,
          content,
          "Preschool stages must progress LOOK observe, TAP recognize, TRY recall, CHOOSE reason, and PLAY apply.",
          "critical",
          stageLabel
        );
      }

      if (stage && previousStage?.cognitiveSkill === stage.cognitiveSkill) {
        addValidationIssue(
          issues,
          content,
          "Consecutive Preschool stages must not teach the same cognitive skill.",
          "critical",
          stageLabel
        );
      }

      if (!stage?.cognitiveObjective) {
        addValidationIssue(
          issues,
          content,
          "Every Preschool instructional stage must declare its cognitive objective.",
          "critical",
          stageLabel
        );
      }

      if (stage?.autoNarration !== true) {
        addValidationIssue(
          issues,
          content,
          "Every Preschool instructional stage must auto-narrate; speaker buttons are replay only.",
          "critical",
          stageLabel
        );
      }

      if (
        stage?.feedbackDurationMs &&
        (stage.feedbackDurationMs < 200 || stage.feedbackDurationMs > 350)
      ) {
        addValidationIssue(
          issues,
          content,
          "Preschool feedback motion must stay within 200-350ms.",
          "critical",
          stageLabel
        );
      }
    });

    if (!lookStage?.imagePrompt || !lookStage.audioText) {
      addValidationIssue(
        issues,
        content,
        "Preschool LOOK must include image and audio.",
        "critical",
        "LOOK"
      );
    }

    if (
      lookStage?.answerVisibility !== "delayed-highlight" ||
      !lookStage.revealDelayMs ||
      lookStage.revealDelayMs < 2000 ||
      lookStage.revealDelayMs > 3000 ||
      !/(find|where|look for|observe)/i.test(`${lookStage.instruction} ${lookStage.questionText}`)
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool LOOK must be active visual observation with a 2-3 second delayed highlight.",
        "critical",
        "LOOK"
      );
    }

    if (
      !tapStage?.randomization?.includes("object position") ||
      !tapStage.randomization.includes("distractors") ||
      !/(only|every|count each|tap the numeral|repeating unit)/i.test(tapStage.instruction)
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool TAP must use targeted identification with randomized object positions and distractors.",
        "critical",
        "TAP"
      );
    }

    if (
      tryStage?.answerVisibility !== "hidden-until-response" ||
      !tryStage.randomization?.includes("answer order") ||
      !/(remember|how many|which|what|who)/i.test(`${tryStage.instruction} ${tryStage.questionText}`)
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool TRY must hide previous answers and train memory recall.",
        "critical",
        "TRY"
      );
    }

    if (
      chooseStage?.answerVisibility !== "hidden-until-response" ||
      !chooseStage.randomization?.includes("answer order") ||
      !/(which|choose|compare|missing|matches|more|biggest|clue|belongs)/i.test(`${chooseStage.instruction} ${chooseStage.questionText}`)
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool CHOOSE must train reasoning with randomized answer order.",
        "critical",
        "CHOOSE"
      );
    }

    if (
      playStage?.requiredAction === "choose" ||
      playStage?.requiredAction === "guidedChoose" ||
      playStage?.requiredAction === "independentChoose" ||
      (playStage?.choices?.length ?? 0) > 0 ||
      playStage?.renderer === "PreschoolPictureChoiceRenderer"
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool PLAY must use drag, drop, sort, build, collect, arrange, trace, connect, count, or a mini mission; never another quiz.",
        "critical",
        "PLAY"
      );
    }

    if (
      (tapStage?.requiredInteractionCount ?? 0) < 2 &&
      !isScopedFamilyWordTopic(preschoolWorldId, content.topic) &&
      !isScopedBodyWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedColorWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedShapeWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedAnimalWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedFruitWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedFoodWorldTopic(preschoolWorldId, content.topic) &&
      !isScopedNumberWorldTopic(preschoolWorldId, content.topic)
    ) {
      addValidationIssue(
        issues,
        content,
        "Preschool TAP must require at least two meaningful interactions.",
        "critical",
        "TAP"
      );
    }

    if (
      isScopedFamilyWordTopic(preschoolWorldId, content.topic) &&
      tapStage?.requiredInteractionCount !== 1
    ) {
      addValidationIssue(
        issues,
        content,
        "Scoped Family word TAP must require exactly one picture tap.",
        "critical",
        "TAP"
      );
    }

    if (isScopedBodyWorldTopic(preschoolWorldId, content.topic)) {
      const expectedBodyMission = buildBodyPlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Body TAP must require exactly one picture tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Body TRY must render exactly two image choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Body CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["build", "drag"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        !playStage.playMode
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Body PLAY must use one validated body-action mission.",
          "critical",
          "PLAY"
        );
      }

      if (
        playStage?.playMode !== expectedBodyMission.playMode ||
        JSON.stringify(playStage?.requiredDropItemIds) !==
          JSON.stringify(expectedBodyMission.requiredDropItemIds) ||
        JSON.stringify(playStage?.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedBodyMission.optionalDropItemIds) ||
        JSON.stringify(playStage?.distractorItemIds) !==
          JSON.stringify(expectedBodyMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Body PLAY config must match its body-action mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedColorWorldTopic(preschoolWorldId, content.topic)) {
      const expectedColorMission = buildColorPlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Color TAP must require exactly one color tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Color TRY must render exactly two color choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Color CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["build", "drag"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        playStage.playMode !== expectedColorMission.playMode ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(expectedColorMission.requiredDropItemIds) ||
        JSON.stringify(playStage.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedColorMission.optionalDropItemIds) ||
        JSON.stringify(playStage.distractorItemIds) !==
          JSON.stringify(expectedColorMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Color PLAY config must match its color-action mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedShapeWorldTopic(preschoolWorldId, content.topic)) {
      const expectedShapeMission = buildShapePlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Shape TAP must require exactly one shape tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Shape TRY must render exactly two shape choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Shape CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["build", "drag"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        playStage.playMode !== expectedShapeMission.playMode ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(expectedShapeMission.requiredDropItemIds) ||
        JSON.stringify(playStage.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedShapeMission.optionalDropItemIds) ||
        JSON.stringify(playStage.distractorItemIds) !==
          JSON.stringify(expectedShapeMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Shape PLAY config must match its construction mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedAnimalWorldTopic(preschoolWorldId, content.topic)) {
      const expectedAnimalMission = buildAnimalPlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Animal TAP must require exactly one animal tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Animal TRY must render exactly two animal choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Animal CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["drag", "match"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        playStage.playMode !== expectedAnimalMission.playMode ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(expectedAnimalMission.requiredDropItemIds) ||
        JSON.stringify(playStage.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedAnimalMission.optionalDropItemIds) ||
        JSON.stringify(playStage.distractorItemIds) !==
          JSON.stringify(expectedAnimalMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Animal PLAY config must match its animal-action mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedFruitWorldTopic(preschoolWorldId, content.topic)) {
      const expectedFruitMission = buildFruitPlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Fruit TAP must require exactly one fruit tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Fruit TRY must render exactly two fruit choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Fruit CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["collect", "drag"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        playStage.playMode !== expectedFruitMission.playMode ||
        playStage.destinationId !== expectedFruitMission.destinationId ||
        playStage.targetFruitId !== expectedFruitMission.targetFruitId ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(expectedFruitMission.requiredDropItemIds) ||
        JSON.stringify(playStage.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedFruitMission.optionalDropItemIds) ||
        JSON.stringify(playStage.distractorItemIds) !==
          JSON.stringify(expectedFruitMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Fruit PLAY config must match its collection mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedFoodWorldTopic(preschoolWorldId, content.topic)) {
      const expectedFoodMission = buildFoodPlayMission(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Food TAP must require exactly one food tap.",
          "critical",
          "TAP"
        );
      }

      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Food TRY must render exactly two food choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Food CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["build", "drag"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1 ||
        !playStage?.requiredDropItemIds?.length ||
        playStage.playMode !== expectedFoodMission.playMode ||
        playStage.destinationId !== expectedFoodMission.destinationId ||
        playStage.targetFoodId !== expectedFoodMission.targetFoodId ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(expectedFoodMission.requiredDropItemIds) ||
        JSON.stringify(playStage.optionalDropItemIds ?? []) !==
          JSON.stringify(expectedFoodMission.optionalDropItemIds) ||
        JSON.stringify(playStage.distractorItemIds) !==
          JSON.stringify(expectedFoodMission.distractorItemIds)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Food PLAY config must match its food-use mission.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedCountingWorldTopic(preschoolWorldId, content.topic)) {
      const expectedCountingLesson = buildCountingForestLesson(content.topic);
      const expectedMission = expectedCountingLesson.missions[0];

      if (tapStage?.requiredInteractionCount !== expectedCountingLesson.tapObjects.length) {
        addValidationIssue(
          issues,
          content,
          "Scoped Counting Forest TAP must require touching every displayed object once.",
          "critical",
          "TAP"
        );
      }

      if (
        (tryStage?.choices?.length ?? 0) !== expectedCountingLesson.tryChoices.length ||
        tryStage?.requiredAction !== "guidedChoose" ||
        tryStage?.requiredInteractionCount !== expectedCountingLesson.tryObjects.length
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Counting Forest TRY must use hidden count recall with dot-group choices.",
          "critical",
          "TRY"
        );
      }

      if (
        (chooseStage?.choices?.length ?? 0) !== expectedCountingLesson.choose.choices.length ||
        !chooseStage?.correctAnswer ||
        chooseStage?.requiredAction !== "independentChoose" ||
        new Set(chooseStage.choices).size !== expectedCountingLesson.choose.choices.length
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Counting Forest CHOOSE must recognize an exact quantity with one clear answer.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        playStage?.requiredAction !== "drag" ||
        playStage?.roundCount !== 1 ||
        playStage.playMode !== expectedCountingLesson.playMode ||
        playStage.destinationId !== expectedMission.destinationId ||
        playStage.targetQuantity !== expectedMission.targetQuantity ||
        JSON.stringify(playStage.requiredDropItemIds) !==
          JSON.stringify(
            expectedMission.requiredObjects.map((item, index) => `${item.id}-${index}`)
          )
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Counting Forest PLAY must drag the exact target quantity.",
          "critical",
          "PLAY"
        );
      }

      const forbiddenCountingCopy = /\b(more|less|same|most|fewest|biggest|smallest|add|plus|subtract|minus|number|numeral)\b|[0-9]/i;
      const countingCopy = [
        lookStage?.instruction,
        lookStage?.questionText,
        tapStage?.instruction,
        tapStage?.questionText,
        tryStage?.instruction,
        tryStage?.questionText,
        chooseStage?.instruction,
        chooseStage?.questionText,
        playStage?.instruction,
        playStage?.questionText,
      ].filter(Boolean).join(" ");

      if (forbiddenCountingCopy.test(countingCopy)) {
        addValidationIssue(
          issues,
          content,
          "Scoped Counting Forest learner copy must avoid numerals, comparison words, and arithmetic.",
          "critical"
        );
      }
    }

    if (isScopedNumberWorldTopic(preschoolWorldId, content.topic)) {
      const expectedNumberMission = buildNumberPlayMission(content.topic);
      const expectedTry = getNumberTryChoices(content.topic);

      if (tapStage?.requiredInteractionCount !== 1) {
        addValidationIssue(
          issues,
          content,
          "Scoped Number TAP must require exactly one number tap.",
          "critical",
          "TAP"
        );
      }

      if (
        (tryStage?.choices?.length ?? 0) !== 2 ||
        tryStage?.correctAnswer !== expectedTry.correctAnswer
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Number TRY must render exactly two quantities with one correct answer.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Number CHOOSE must render exactly four valid quantity choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        playStage?.requiredAction !== "count" ||
        playStage?.roundCount !== 1 ||
        playStage.playMode !== expectedNumberMission.playMode ||
        playStage.destinationId !== expectedNumberMission.destinationId ||
        playStage.targetCount !== expectedNumberMission.missions[0].targetCount ||
        JSON.stringify(playStage.quantityMissions) !==
          JSON.stringify(
            expectedNumberMission.missions.map((mission) => ({
              availableCount: mission.availableCount,
              destinationId: mission.destinationId,
              destinationLabel: mission.destinationLabel,
              objectAssetTopicTitle: mission.objectAssetTopicTitle,
              objectAssetWorldId: mission.objectAssetWorldId,
              objectKind: mission.objectKind,
              prompt: mission.prompt,
              targetCount: mission.targetCount,
            }))
          )
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Number PLAY config must require exact quantity manipulation.",
          "critical",
          "PLAY"
        );
      }
    }

    if (isScopedFamilyWordTopic(preschoolWorldId, content.topic)) {
      if ((tryStage?.choices?.length ?? 0) !== 2) {
        addValidationIssue(
          issues,
          content,
          "Scoped Family word TRY must render exactly two picture choices.",
          "critical",
          "TRY"
        );
      }

      if ((chooseStage?.choices?.length ?? 0) !== 4) {
        addValidationIssue(
          issues,
          content,
          "Scoped Family word CHOOSE must render exactly four picture reasoning choices.",
          "critical",
          "CHOOSE"
        );
      }

      if (
        (playStage?.choices?.length ?? 0) > 0 ||
        !["build", "move"].includes(playStage?.requiredAction ?? "") ||
        playStage?.roundCount !== 1
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Family word PLAY must use a build or move mission, not multiple choice.",
          "critical",
          "PLAY"
        );
      }

      const expectedFamilyPlayConfig = getScopedFamilyPlayMissionConfig(content.topic);
      const expectedFamilyDistractors =
        content.topic === "Home"
          ? ["tree", "cow"]
          : content.topic === "Family"
            ? ["tree"]
            : [];

      if (
        playStage?.playMode !== expectedFamilyPlayConfig.playMode ||
        playStage?.dropZoneId !== expectedFamilyPlayConfig.dropZoneId ||
        playStage?.successText !== expectedFamilyPlayConfig.successText ||
        playStage?.instruction !== expectedFamilyPlayConfig.prompt ||
        playStage?.audioText !== expectedFamilyPlayConfig.prompt ||
        JSON.stringify(playStage?.requiredDropItemIds ?? []) !==
          JSON.stringify(expectedFamilyPlayConfig.requiredCardIds) ||
        JSON.stringify(playStage?.distractorItemIds ?? []) !==
          JSON.stringify(expectedFamilyDistractors)
      ) {
        addValidationIssue(
          issues,
          content,
          "Scoped Family PLAY prompt, destination, required drops, and success text must match the approved family mission config.",
          "critical",
          "PLAY"
        );
      }

      if (
        content.topic === "Home" &&
        (playStage?.playMode !== expectedFamilyPlayConfig.playMode ||
          playStage?.dropZoneId !== expectedFamilyPlayConfig.dropZoneId ||
          playStage?.successText !== expectedFamilyPlayConfig.successText ||
          JSON.stringify(playStage?.requiredDropItemIds ?? []) !==
            JSON.stringify(["baby", "friend"]) ||
          JSON.stringify(playStage?.distractorItemIds ?? []) !==
            JSON.stringify(["tree", "cow"]))
      ) {
        addValidationIssue(
          issues,
          content,
          "Home PLAY must require Baby and Friend with Tree and Cow distractors.",
          "critical",
          "PLAY"
        );
      }

      if (
        content.topic === "Family" &&
        (playStage?.playMode !== expectedFamilyPlayConfig.playMode ||
          playStage?.dropZoneId !== expectedFamilyPlayConfig.dropZoneId ||
          playStage?.successText !== expectedFamilyPlayConfig.successText ||
          JSON.stringify(playStage?.requiredDropItemIds ?? []) !==
            JSON.stringify(["home", "mother", "father"]) ||
          JSON.stringify(playStage?.distractorItemIds ?? []) !==
            JSON.stringify(["tree"]))
      ) {
        addValidationIssue(
          issues,
          content,
          "Family PLAY must require Home, Mother, and Father with Tree as distractor.",
          "critical",
          "PLAY"
        );
      }
    }

    if ((lookStage?.choices?.length ?? 0) > 0 || lookStage?.requiredAction === "choose") {
      addValidationIssue(
        issues,
        content,
        "Preschool LOOK must not use multiple-choice UI.",
        "critical",
        "LOOK"
      );
    }

    const tryCount = tryStage?.choices?.length ?? 0;

    if (tryCount > 0 && !isAllowedChoiceCount(tryCount)) {
      addValidationIssue(
        issues,
        content,
        "Preschool TRY must have exactly two or four choices.",
        "critical",
        "TRY"
      );
    }

    const chooseCount = chooseStage?.choices?.length ?? 0;

    if (![2, 4].includes(chooseCount)) {
      addValidationIssue(
        issues,
        content,
        "Preschool CHOOSE must have exactly two or four choices.",
        "critical",
        "CHOOSE"
      );
    }

    if (playStage?.passage) {
      addValidationIssue(
        issues,
        content,
        "Preschool PLAY must not use long passage behavior.",
        "critical",
        "PLAY"
      );
    }

    if (tapStage?.requiredAction === tryStage?.requiredAction) {
      addValidationIssue(
        issues,
        content,
        "Preschool TAP and TRY must use different interactions.",
        "critical",
        "TRY"
      );
    }

    if (tryStage?.requiredAction === chooseStage?.requiredAction) {
      addValidationIssue(
        issues,
        content,
        "Preschool TRY and CHOOSE must use different interactions.",
        "critical",
        "CHOOSE"
      );
    }

    const expectedPlayRoundCount = isScopedFamilyWordTopic(
      preschoolWorldId,
      content.topic
    )
      ? 1
      : isScopedBodyWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedColorWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedShapeWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedAnimalWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedFruitWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedFoodWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedNumberWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : isScopedCountingWorldTopic(preschoolWorldId, content.topic)
        ? 1
      : 3;

    if (
      playStage?.roundCount !== expectedPlayRoundCount ||
      playStage.revealSuccessAfterRound !== playStage.roundCount
    ) {
      addValidationIssue(
        issues,
        content,
        expectedPlayRoundCount === 1
          ? preschoolWorldId === "preschool-body-world"
            ? "Scoped Body PLAY must reveal success after its one mission."
            : preschoolWorldId === "preschool-colorful-world"
              ? "Scoped Color PLAY must reveal success after its one mission."
              : preschoolWorldId === "preschool-shape-kingdom"
                ? "Scoped Shape PLAY must reveal success after its one mission."
                : preschoolWorldId === "preschool-animal-adventure"
                  ? "Scoped Animal PLAY must reveal success after its one mission."
                  : preschoolWorldId === "preschool-fruit-garden"
                    ? "Scoped Fruit PLAY must reveal success after its one mission."
                    : preschoolWorldId === "preschool-food-town"
                      ? "Scoped Food PLAY must reveal success after its one mission."
                      : preschoolWorldId === "preschool-number-village"
                        ? "Scoped Number PLAY must reveal success after its one mission."
            : "Scoped Family word PLAY must reveal success after its one mission."
          : "Preschool PLAY must reveal success only after all three rounds.",
        "critical",
        "PLAY"
      );
    }

    instructionalStages.forEach((stage) => {
      if (!stage?.audioText) {
        addValidationIssue(
          issues,
          content,
          "Every Preschool learning stage must include audio support.",
          "critical",
          stage?.stage
        );
      }

      if (countWords(stage?.instruction) > 10) {
        addValidationIssue(
          issues,
          content,
          "Preschool stage instructions must use no more than 10 words.",
          "critical",
          stage?.stage
        );
      }
    });

    if (content.world === "My Colorful World") {
      instructionalStages.forEach((stage) => {
        if (!stage) {
          return;
        }

        if (!stage.colorTarget || !stage.colorObjectLabels?.length) {
          addValidationIssue(
            issues,
            content,
            "Colorful World stages must define a target color and related objects.",
            "critical",
            stage.stage
          );
          return;
        }

        const normalizedTarget = normalizeAnswerLabel(stage.colorTarget);
        const rainbowChallenge = normalizedTarget === "rainbow color challenge";
        const unrelatedObject = stage.colorObjectLabels.some((label) => {
          const normalizedLabel = normalizeAnswerLabel(label);

          return rainbowChallenge
            ? !["red", "orange", "yellow", "green", "blue", "purple"].includes(
                normalizedLabel
              )
            : !normalizedLabel.startsWith(`${normalizedTarget} `);
        });

        if (unrelatedObject) {
          addValidationIssue(
            issues,
            content,
            "Color topic contains an object that does not match its target color.",
            "critical",
            stage.stage
          );
        }
      });
    }

    if (content.world === "Shape Kingdom") {
      instructionalStages.forEach((stage) => {
        if (!stage?.shapeTarget || !stage.shapeObjectLabels?.length) {
          addValidationIssue(
            issues,
            content,
            "Shape Kingdom stages must define a target shape and related objects.",
            "critical",
            stage?.stage
          );
          return;
        }

        const normalizedTarget = normalizeAnswerLabel(stage.shapeTarget);
        const challenge = normalizedTarget === "shape builder challenge";
        const unrelatedObject = stage.shapeObjectLabels.some((label) => {
          const normalizedLabel = normalizeAnswerLabel(label);

          return challenge
            ? !["circle", "square", "triangle", "rectangle", "star"].includes(
                normalizedLabel
              )
            : !normalizedLabel.startsWith(`${normalizedTarget} `);
        });

        if (unrelatedObject) {
          addValidationIssue(
            issues,
            content,
            "Shape topic contains an object that does not match its target shape.",
            "critical",
            stage.stage
          );
        }

        if (
          challenge &&
          new Set(stage.shapeObjectLabels.map(normalizeAnswerLabel)).size !== 5
        ) {
          addValidationIssue(
            issues,
            content,
            "Shape challenge must combine circle, square, triangle, rectangle, and star.",
            "critical",
            stage.stage
          );
        }
      });
    }

    if (content.world === "Animal Adventure") {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.animalSound ||
          !stage.animalHome ||
          !stage.animalFoodOrActivity
        ) {
          addValidationIssue(
            issues,
            content,
            "Animal Adventure stages must include sound, home, and food or activity.",
            "critical",
            stage?.stage
          );
        }
      });
    }

    if (content.world === "Fruit Garden") {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.fruitColor ||
          !stage.fruitCharacteristic ||
          !stage.fruitCollectionTarget
        ) {
          addValidationIssue(
            issues,
            content,
            "Fruit Garden stages must include color, characteristic, and collection target.",
            "critical",
            stage?.stage
          );
        }
      });

      if (
        content.topic === "Fruit Challenge" &&
        new Set(
          instructionalStages
            .flatMap((stage) => stage?.fruitChallengeItems ?? [])
            .map(getCanonicalAnswerLabel)
        ).size !== 6
      ) {
        addValidationIssue(
          issues,
          content,
          "Fruit Challenge must combine apple, banana, mango, orange, grapes, and watermelon.",
          "critical",
          "PLAY"
        );
      }
    }

    if (content.world === "Food Town") {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.foodGroup ||
          !stage.foodLearningFact ||
          !stage.foodMissionType ||
          !stage.foodMealTarget
        ) {
          addValidationIssue(
            issues,
            content,
            "Food Town stages must include group, learning fact, mission type, and meal target.",
            "critical",
            stage?.stage
          );
        }
      });

      if (
        content.topic === "Food Challenge" &&
        new Set(
          instructionalStages
            .flatMap((stage) => stage?.foodChallengeItems ?? [])
            .map(getCanonicalAnswerLabel)
        ).size !== 8
      ) {
        addValidationIssue(
          issues,
          content,
          "Food Challenge must combine rice, bread, milk, egg, fish, vegetables, meat, and juice.",
          "critical",
          "PLAY"
        );
      }
    }

    if (content.world === "Number Village") {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.numberQuantity ||
          !stage.numberCountingObject ||
          !stage.numberMissionType ||
          !stage.numberDestination
        ) {
          addValidationIssue(
            issues,
            content,
            "Number Village stages must include quantity, counting object, mission type, and destination.",
            "critical",
            stage?.stage
          );
        }
      });

      if (
        content.topic === "Number Challenge" &&
        JSON.stringify(
          Array.from(
            new Set(
              instructionalStages.flatMap(
                (stage) => stage?.numberChallengeItems ?? []
              )
            )
          )
        ) !== JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      ) {
        addValidationIssue(
          issues,
          content,
          "Number Challenge must combine exact counts 1 through 10.",
          "critical",
          "PLAY"
        );
      }
    }

    if (content.world === KINDERGARTEN_SIZE_WORLD_CONFIG.title) {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.sizeConcept ||
          !stage.sizeMissionType ||
          !stage.sizeObjectLabels?.length ||
          JSON.stringify(stage.sizeScaleSet) !== JSON.stringify([0.6, 1, 1.45])
        ) {
          addValidationIssue(
            issues,
            content,
            "Big & Small Village stages must include physical size concept, same-object labels, mission type, and 0.60/1.00/1.45 scale set.",
            "critical",
            stage?.stage
          );
        }

        if (/quantity|count|more|less/i.test(stage?.sizeConcept ?? "")) {
          addValidationIssue(
            issues,
            content,
            "Big & Small Village must compare physical size only, not quantity.",
            "critical",
            stage?.stage
          );
        }
      });

      if (
        content.topic === "Size Challenge" &&
        new Set(
          instructionalStages
            .flatMap((stage) => stage?.sizeChallengeConcepts ?? [])
            .map(getCanonicalAnswerLabel)
        ).size !== 4
      ) {
        addValidationIssue(
          issues,
          content,
          "Size Challenge must combine big/small, tall/short, long/short, and heavy/light physical size concepts.",
          "critical",
          "PLAY"
        );
      }
    }

    if (content.world === "Pattern Playground") {
      const allowedPatternTypes = new Set(["AB", "AAB", "ABB", "ABC"]);

      instructionalStages.forEach((stage) => {
        if (
          !stage?.patternType ||
          !allowedPatternTypes.has(stage.patternType) ||
          !stage.patternObjectTypes?.length
        ) {
          addValidationIssue(
            issues,
            content,
            "Pattern Playground stages must use AB, AAB, ABB, or ABC picture patterns with object types.",
            "critical",
            stage?.stage
          );
          return;
        }

        if (/growing|skip|arithmetic|add|subtract/i.test(`${stage.instruction} ${stage.content} ${stage.patternType}`)) {
          addValidationIssue(
            issues,
            content,
            "Pattern Playground must not use arithmetic, growing, or skip-counting patterns.",
            "critical",
            stage.stage
          );
        }
      });

      if (
        content.topic === "Pattern Challenge" &&
        JSON.stringify(
          Array.from(
            new Set(
              instructionalStages.flatMap((stage) => stage?.patternChallengeTypes ?? [])
            )
          )
        ) !== JSON.stringify(["AB", "AAB", "ABB", "ABC"])
      ) {
        addValidationIssue(
          issues,
          content,
          "Pattern Challenge must combine AB, AAB, ABB, and ABC picture patterns.",
          "critical",
          "PLAY"
        );
      }
    }

    if (content.world === KINDERGARTEN_QUANTITY_WORLD_CONFIG.title) {
      instructionalStages.forEach((stage) => {
        if (
          !stage?.quantityConcept ||
          !stage.quantityMissionType ||
          !stage.quantityObjectTypes?.length ||
          !stage.quantityGroupCounts?.length
        ) {
          addValidationIssue(
            issues,
            content,
            "More & Less Valley stages must include quantity concept, counts, objects, and mission type.",
            "critical",
            stage?.stage
          );
          return;
        }

        if (new Set(stage.quantityGroupCounts).size < 2) {
          addValidationIssue(
            issues,
            content,
            "More and Less groups must differ by quantity, not color only.",
            "critical",
            stage.stage
          );
        }

        if (!/count/i.test(stage.quantityConcept)) {
          addValidationIssue(
            issues,
            content,
          "More & Less Valley must count groups before comparing more or less.",
            "critical",
            stage.stage
          );
        }
      });

      if (
        content.topic === "Comparison Challenge" &&
        new Set(
          instructionalStages
            .flatMap((stage) => stage?.quantityChallengeConcepts ?? [])
            .map(getCanonicalAnswerLabel)
        ).size < 3
      ) {
        addValidationIssue(
          issues,
          content,
          "Comparison Challenge must combine more, less, and equal quantity concepts.",
          "critical",
          "PLAY"
        );
      }
    }
  }

  if (content.level === "kindergarten") {
    const tryCount = tryStage?.choices?.length ?? 0;
    const chooseCount = chooseStage?.choices?.length ?? 0;

    if ((tapStage?.requiredInteractionCount ?? 0) < 2) {
      addValidationIssue(
        issues,
        content,
        "Kindergarten TAP must require at least two meaningful interactions.",
        "critical",
        "TAP"
      );
    }

    if (tryCount > 0 && !isAllowedChoiceCount(tryCount)) {
      addValidationIssue(
        issues,
        content,
        "Kindergarten TRY must have exactly two or four choices.",
        "critical",
        "TRY"
      );
    }

    if (chooseCount > 0 && !isAllowedChoiceCount(chooseCount)) {
      addValidationIssue(
        issues,
        content,
        "Kindergarten CHOOSE must have exactly two or four choices.",
        "critical",
        "CHOOSE"
      );
    }

    if (
      playStage?.requiredAction === "choose" ||
      playStage?.requiredAction === "guidedChoose" ||
      playStage?.requiredAction === "independentChoose" ||
      (playStage?.choices?.length ?? 0) > 0
    ) {
      addValidationIssue(
        issues,
        content,
        "Kindergarten PLAY must use manipulation or application, not multiple choice only.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Counting Forest" ||
      (content.level === "kindergarten" &&
        content.world === KINDERGARTEN_NUMBER_WORLD_CONFIG.title)
    ) {
      const instructionalStages = [lookStage, tapStage, tryStage, chooseStage, playStage];

      instructionalStages.forEach((stage) => {
        if (
          !stage?.countingSkill ||
          !stage.countingRange ||
          !stage.forestMissionType ||
          !stage.forestObjectTypes?.length
        ) {
          addValidationIssue(
            issues,
            content,
            "Number Forest stages must include counting skill, range, forest objects, and mission type.",
            "critical",
            stage?.stage
          );
        }
      });

      if (
        playStage?.requiredAction === "choose" ||
        playStage?.requiredAction === "guidedChoose" ||
        playStage?.requiredAction === "independentChoose"
      ) {
        addValidationIssue(
          issues,
          content,
          "Number Forest PLAY must use a forest mission, not multiple choice only.",
          "critical",
          "PLAY"
        );
      }

      if (
        content.topic === "Number Challenge" &&
        new Set(
          instructionalStages.flatMap(
            (stage) => stage?.forestChallengeSkills ?? []
          )
        ).size !== 10
      ) {
        addValidationIssue(
          issues,
          content,
          "Number Challenge must combine Number 11 through Number 20.",
          "critical",
          "PLAY"
        );
      }
    }
  }

  if (content.level === "grade1") {
    if (
      playStage?.requiredAction === "choose" ||
      playStage?.requiredAction === "guidedChoose" ||
      playStage?.requiredAction === "independentChoose" ||
      (playStage?.choices?.length ?? 0) > 0
    ) {
      addValidationIssue(
        issues,
        content,
        "Grade 1 PLAY must require manipulation or application, not answer selection.",
        "critical",
        "PLAY"
      );
    }

    if (!playStage?.applicationActivity?.steps?.length) {
      addValidationIssue(
        issues,
        content,
        "Grade 1 PLAY must define a completable application activity.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Word Kingdom" &&
      !/sort|match|sequence|build|drag/i.test(playStage?.requiredAction ?? "")
    ) {
      addValidationIssue(
        issues,
        content,
        "Word Kingdom PLAY must classify, match, sequence, or build words.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Reading Quest" &&
      !/match|sequence|build/i.test(playStage?.requiredAction ?? "")
    ) {
      addValidationIssue(
        issues,
        content,
        "Reading Quest PLAY must build or match meaningful reading content.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Time Town" &&
      playStage?.requiredAction !== "sequence"
    ) {
      addValidationIssue(
        issues,
        content,
        "Time Town PLAY must set or sequence time and routines.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Math Mountain" &&
      !["count", "sequence", "build"].includes(playStage?.requiredAction ?? "")
    ) {
      addValidationIssue(
        issues,
        content,
        "Math Mountain PLAY must build, count, or manipulate number sentences.",
        "critical",
        "PLAY"
      );
    }
  }

  if (content.level === "grade2") {
    const tryCount = tryStage?.choices?.length ?? 0;
    const chooseCount = chooseStage?.choices?.length ?? 0;

    if ((tapStage?.requiredInteractionCount ?? 0) < 2) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 TAP must investigate at least two meaningful model parts or clues.",
        "critical",
        "TAP"
      );
    }

    if (tryCount > 0 && !isAllowedChoiceCount(tryCount)) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 TRY must have exactly two or four guided reasoning choices.",
        "critical",
        "TRY"
      );
    }

    if (chooseCount > 0 && !isAllowedChoiceCount(chooseCount)) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 CHOOSE must have exactly two or four independent reasoning choices.",
        "critical",
        "CHOOSE"
      );
    }

    if (
      playStage?.requiredAction === "choose" ||
      playStage?.requiredAction === "guidedChoose" ||
      playStage?.requiredAction === "independentChoose" ||
      (playStage?.choices?.length ?? 0) > 0
    ) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 PLAY must require evidence or model manipulation, not another multiple-choice quiz.",
        "critical",
        "PLAY"
      );
    }

    if (!playStage?.applicationActivity?.steps?.length) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 PLAY must define a multi-step applied reasoning mission.",
        "critical",
        "PLAY"
      );
    }

    if (
      !playStage?.manipulatives?.length ||
      (!playStage?.evidenceSentences?.length &&
        !playStage?.correctEvidence &&
        !playStage?.passage)
    ) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 reasoning must require both a model or manipulative and evidence, passage, or proof.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Place Value City" &&
      (!/PlaceValue/i.test(playStage?.renderer ?? "") ||
        playStage?.requiredAction !== "build")
    ) {
      addValidationIssue(
        issues,
        content,
        "Place Value City PLAY must build base-ten models before comparing or explaining.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Measurement Harbor" &&
      (!/Measurement/i.test(playStage?.renderer ?? "") ||
        !["move", "build", "sort"].includes(playStage?.requiredAction ?? ""))
    ) {
      addValidationIssue(
        issues,
        content,
        "Measurement Harbor PLAY must use a measurement tool, not answer selection only.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Multiplication Workshop" &&
      content.topic === "Arrays" &&
      (!/Array/i.test(playStage?.renderer ?? "") ||
        playStage?.requiredAction !== "build")
    ) {
      addValidationIssue(
        issues,
        content,
        "Grade 2 arrays must be built with rows and columns.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Problem Solver City" &&
      (!/WordProblemWorkspace/i.test(playStage?.renderer ?? "") ||
        playStage?.requiredAction !== "solve")
    ) {
      addValidationIssue(
        issues,
        content,
        "Problem Solver City must provide a word-problem workspace with visible reasoning steps.",
        "critical",
        "PLAY"
      );
    }

    if (
      content.world === "Story Quest" &&
      content.topic === "Main Idea" &&
      !(playStage?.evidenceSentences?.length || playStage?.correctEvidence)
    ) {
      addValidationIssue(
        issues,
        content,
        "Main Idea PLAY must require supporting evidence from the passage.",
        "critical",
        "PLAY"
      );
    }
  }

  if (content.level === "kindergarten" && /^Letter\s+[A-Z]$/i.test(content.topic)) {
    if (!lookStage?.audioText?.includes(content.topic.replace(/^Letter\s+/i, ""))) {
      addValidationIssue(
        issues,
        content,
        "Kindergarten letter topics must include letter sound support.",
        "warning",
        "LOOK"
      );
    }
  }

  if (content.level === "grade2" || content.level === "grade3") {
    if (playStage?.requiredAction === "choose") {
      addValidationIssue(
        issues,
        content,
        "Upper-grade PLAY must not be simple answer selection only.",
        "critical",
        "PLAY"
      );
    }

    if (
      !playStage?.manipulatives?.length &&
      !playStage?.evidenceSentences?.length &&
      !playStage?.passage
    ) {
      addValidationIssue(
        issues,
        content,
        "Upper-grade PLAY must include evidence, manipulatives, passage, or workspace data.",
        "critical",
        "PLAY"
      );
    }
  }

  return issues;
}

export function validateBatiBotFrameworkCompliance(
  contents: BatiBotTopicContent[] = getAllBatiBotTopicContent()
): FrameworkValidationSummary {
  const issues = contents.flatMap(validateBatiBotTopicContent);
  const seenContent = new Map<string, BatiBotTopicContent>();
  const preschoolWorldOrder = Array.from(
    new Set(
      contents
        .filter((content) => content.level === "preschool")
        .map((content) => content.world)
    )
  );
  const expectedPreschoolWorldOrder = [
    "My Family World",
    "My Body World",
    "My Colorful World",
    "Shape Kingdom",
    "Animal Adventure",
    "Fruit Garden",
    "Food Town",
    "Number Village",
  ];

  if (
    preschoolWorldOrder.length &&
    (preschoolWorldOrder.length !== expectedPreschoolWorldOrder.length ||
      preschoolWorldOrder.some(
        (world, index) => world !== expectedPreschoolWorldOrder[index]
      ))
  ) {
    const firstPreschoolContent = contents.find((content) => content.level === "preschool");

    if (firstPreschoolContent) {
      addValidationIssue(
        issues,
        firstPreschoolContent,
        "Preschool worlds must be sequenced Family, Body, Color, Shape, Animal, Fruit, Food, then Number.",
        "critical"
      );
    }
  }
  const familyWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "My Family World"
  );
  const expectedFamilySequence = [
    "Mother",
    "Father",
    "Brother",
    "Sister",
    "Baby",
    "Friend",
    "Home",
    "Family",
  ];

  if (
    familyWorldTopics.length &&
    (familyWorldTopics.length !== expectedFamilySequence.length ||
      familyWorldTopics.some(
        (content, index) => content.topic !== expectedFamilySequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      familyWorldTopics[0],
      "My Family World must contain exactly Mother, Father, Brother, Sister, Baby, Friend, Home, and Family in order.",
      "critical"
    );
  }
  const bodyWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "My Body World"
  );
  const expectedBodySequence = [
    "Head",
    "Hair",
    "Eyes",
    "Ears",
    "Nose",
    "Mouth",
    "Teeth",
    "Hands",
    "Feet",
    "Body",
  ];

  if (
    bodyWorldTopics.length &&
    (bodyWorldTopics.length !== expectedBodySequence.length ||
      bodyWorldTopics.some(
        (content, index) => content.topic !== expectedBodySequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      bodyWorldTopics[0],
      "My Body World must contain exactly Head, Hair, Eyes, Ears, Nose, Mouth, Teeth, Hands, Feet, and Body in order.",
      "critical"
    );
  }
  const colorWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "My Colorful World"
  );
  const expectedColorSequence = [
    "Red",
    "Blue",
    "Yellow",
    "Green",
    "Orange",
    "Purple",
    "White",
    "Black",
  ];

  if (
    colorWorldTopics.length &&
    (colorWorldTopics.length !== expectedColorSequence.length ||
      colorWorldTopics.some(
        (content, index) => content.topic !== expectedColorSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      colorWorldTopics[0],
      "My Colorful World must contain exactly Red, Blue, Yellow, Green, Orange, Purple, White, and Black in order.",
      "critical"
    );
  }
  const shapeWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Shape Kingdom"
  );
  const expectedShapeSequence = [
    "Circle",
    "Square",
    "Triangle",
    "Rectangle",
    "Star",
  ];

  if (
    shapeWorldTopics.length &&
    (shapeWorldTopics.length !== expectedShapeSequence.length ||
      shapeWorldTopics.some(
        (content, index) => content.topic !== expectedShapeSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      shapeWorldTopics[0],
      "Shape Kingdom must contain exactly Circle, Square, Triangle, Rectangle, and Star in order.",
      "critical"
    );
  }
  const animalWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Animal Adventure"
  );
  const expectedAnimalSequence = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Cow",
    "Horse",
    "Duck",
  ];

  if (
    animalWorldTopics.length &&
    (animalWorldTopics.length !== expectedAnimalSequence.length ||
      animalWorldTopics.some(
        (content, index) => content.topic !== expectedAnimalSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      animalWorldTopics[0],
      "Animal Adventure must contain exactly Dog, Cat, Bird, Fish, Cow, Horse, and Duck in order.",
      "critical"
    );
  }
  const fruitWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Fruit Garden"
  );
  const expectedFruitSequence = [
    "Apple",
    "Banana",
    "Mango",
    "Orange",
    "Grapes",
    "Watermelon",
  ];

  if (
    fruitWorldTopics.length &&
    (fruitWorldTopics.length !== expectedFruitSequence.length ||
      fruitWorldTopics.some(
        (content, index) => content.topic !== expectedFruitSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      fruitWorldTopics[0],
      "Fruit Garden must contain exactly Apple, Banana, Mango, Orange, Grapes, and Watermelon in order.",
      "critical"
    );
  }
  const foodWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Food Town"
  );
  const expectedFoodSequence = [
    "Rice",
    "Bread",
    "Milk",
    "Egg",
    "Meat",
    "Vegetables",
    "Juice",
  ];

  if (
    foodWorldTopics.length &&
    (foodWorldTopics.length !== expectedFoodSequence.length ||
      foodWorldTopics.some(
        (content, index) => content.topic !== expectedFoodSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      foodWorldTopics[0],
      "Food Town must contain exactly Rice, Bread, Milk, Egg, Meat, Vegetables, and Juice in order.",
      "critical"
    );
  }
  const preschoolCountingForestTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Counting Forest"
  );
  const expectedPreschoolCountingForestSequence = [
    "Counting Animals",
    "Counting Fruits",
    "Counting Foods",
    "Counting Shapes",
    "Counting Challenge",
  ];

  if (
    preschoolCountingForestTopics.length &&
    (preschoolCountingForestTopics.length !== expectedPreschoolCountingForestSequence.length ||
      preschoolCountingForestTopics.some(
        (content, index) => content.topic !== expectedPreschoolCountingForestSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      preschoolCountingForestTopics[0],
      "Preschool Counting Forest must contain exactly Counting Animals, Counting Fruits, Counting Foods, Counting Shapes, and Counting Challenge in order.",
      "critical"
    );
  }
  const numberWorldTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Number Village"
  );
  const expectedNumberSequence = [
    "Number 1",
    "Number 2",
    "Number 3",
    "Number 4",
    "Number 5",
    "Number 6",
    "Number 7",
    "Number 8",
    "Number 9",
    "Number 10",
    "Number Challenge",
  ];

  if (
    numberWorldTopics.length &&
    (numberWorldTopics.length !== expectedNumberSequence.length ||
      numberWorldTopics.some(
        (content, index) => content.topic !== expectedNumberSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      numberWorldTopics[0],
      "Number Village must contain exactly Number 1 through Number 10, then Number Challenge, in order.",
      "critical"
    );
  }
  const sizeWorldTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === KINDERGARTEN_SIZE_WORLD_CONFIG.title
  );
  const expectedSizeSequence = [
    "Big & Small",
    "Tall & Short",
    "Long & Short",
    "Heavy & Light",
    "Size Challenge",
  ];

  if (
    sizeWorldTopics.length &&
    (sizeWorldTopics.length !== expectedSizeSequence.length ||
      sizeWorldTopics.some(
        (content, index) => content.topic !== expectedSizeSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      sizeWorldTopics[0],
      "Big & Small Village must contain exactly Big & Small, Tall & Short, Long & Short, Heavy & Light, and Size Challenge in order.",
      "critical"
    );
  }
  const patternWorldTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === "Pattern Playground"
  );
  const expectedPatternSequence = [
    "AB Pattern",
    "AAB Pattern",
    "ABB Pattern",
    "ABC Pattern",
    "Pattern Challenge",
  ];

  if (
    patternWorldTopics.length &&
    (patternWorldTopics.length !== expectedPatternSequence.length ||
      patternWorldTopics.some(
        (content, index) => content.topic !== expectedPatternSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      patternWorldTopics[0],
      "Pattern Playground must contain exactly AB Pattern, AAB Pattern, ABB Pattern, ABC Pattern, and Pattern Challenge in order.",
      "critical"
    );
  }
  const moreLessWorldTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === KINDERGARTEN_QUANTITY_WORLD_CONFIG.title
  );
  const expectedMoreLessSequence = [
    "More",
    "Less",
    "Equal",
    "Compare Groups",
    "Comparison Challenge",
  ];

  if (
    moreLessWorldTopics.length &&
    (moreLessWorldTopics.length !== expectedMoreLessSequence.length ||
      moreLessWorldTopics.some(
        (content, index) => content.topic !== expectedMoreLessSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      moreLessWorldTopics[0],
      "More & Less Valley must contain exactly More, Less, Equal, Compare Groups, and Comparison Challenge in order.",
      "critical"
    );
  }

  contents.forEach((content) => {
    const contentDuplicateCandidates = [
      content.examples?.length ? ["examples", content.examples.map((example) => example.sentence).join("|")] : null,
      content.behaviorProfile?.realLifeContext ? ["realLifeContext", content.behaviorProfile.realLifeContext] : null,
      content.masteryRules?.competencyDemonstration ? ["masteryDemonstration", content.masteryRules.competencyDemonstration] : null,
    ].filter((item): item is [string, string] => Array.isArray(item));

    contentDuplicateCandidates.forEach(([kind, value]) => {
      const key = `${content.level}:${content.world}:${kind}:${value.toLowerCase()}`;
      const previous = seenContent.get(key);

      if (previous && previous.topic !== content.topic) {
        addValidationIssue(
          issues,
          content,
          `Repeated ${kind} content also used by ${previous.topic}.`,
          "critical"
        );
        return;
      }

      seenContent.set(key, content);
    });

    content.frameworkStages.forEach((stage) => {
      const duplicateCandidates = [
        stage.passage ? ["passage", stage.passage] : null,
        stage.questionText ? ["question", stage.questionText] : null,
        stage.imagePrompt ? ["imagePrompt", stage.imagePrompt] : null,
        stage.correctAnswer ? ["correctAnswer", stage.correctAnswer] : null,
        stage.choices?.length ? ["choices", stage.choices.join("|")] : null,
        stage.applicationActivity?.name ? ["applicationActivity", stage.applicationActivity.name] : null,
        stage.stage === "PLAY" ? ["challengeInstruction", stage.instruction] : null,
      ].filter((item): item is [string, string] => Array.isArray(item));

      duplicateCandidates.forEach(([kind, value]) => {
        const key = `${content.level}:${content.world}:${kind}:${value.toLowerCase()}`;
        const previous = seenContent.get(key);

        if (previous && previous.topic !== content.topic) {
          addValidationIssue(
            issues,
            content,
            `Repeated ${kind} content also used by ${previous.topic}.`,
            kind === "correctAnswer" && previous.topic === content.topic
              ? "warning"
              : "critical",
            stage.stage
          );
          return;
        }

        seenContent.set(key, content);
      });
    });
  });

  const foodTownTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Food Town" &&
      content.topic !== "Food Challenge"
  );
  const unsupportedFoodMission = foodTownTopics.find((content) => {
    const missionType = content.frameworkStages.find((stage) => stage.stage === "PLAY")
      ?.foodMissionType;

    return !missionType || !["serve", "collect", "prepare"].includes(missionType);
  });

  if (unsupportedFoodMission) {
    addValidationIssue(
      issues,
      unsupportedFoodMission,
      "Food Town topics must use serve, collect, or prepare PLAY interactions.",
      "critical",
      "PLAY"
    );
  }

  const numberVillageTopics = contents.filter(
    (content) =>
      content.level === "preschool" &&
      content.world === "Number Village" &&
      content.topic !== "Number Challenge"
  );
  const numberCountingObjects = new Set(
    numberVillageTopics
      .map((content) =>
        content.frameworkStages.find((stage) => stage.stage === "PLAY")
          ?.numberCountingObject
      )
      .filter((value): value is string => Boolean(value))
  );

  if (
    numberVillageTopics.length &&
    (numberCountingObjects.size !== 1 || !numberCountingObjects.has("apple"))
  ) {
    addValidationIssue(
      issues,
      numberVillageTopics[0],
      "Number Village must use apple as the counting object for every number.",
      "critical",
      "PLAY"
    );
  }

  const sizeVillageTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === KINDERGARTEN_SIZE_WORLD_CONFIG.title &&
      content.topic !== "Size Challenge"
  );
  const sizeMissionTypes = new Set(
    sizeVillageTopics
      .map((content) =>
        content.frameworkStages.find((stage) => stage.stage === "PLAY")
          ?.sizeMissionType
      )
      .filter((value): value is string => Boolean(value))
  );
  const sizeConcepts = new Set(
    sizeVillageTopics
      .flatMap((content) =>
        content.frameworkStages.map((stage) => stage.sizeConcept)
      )
      .filter((value): value is string => Boolean(value))
  );

  if (
    sizeVillageTopics.length &&
    (sizeMissionTypes.size !== sizeVillageTopics.length ||
      !Array.from(sizeConcepts).every((concept) =>
        /^physical size/.test(concept)
      ))
  ) {
    addValidationIssue(
      issues,
      sizeVillageTopics[0],
      "Big & Small Village must use distinct physical size missions only.",
      "critical",
      "PLAY"
    );
  }

  const quantityValleyTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === KINDERGARTEN_QUANTITY_WORLD_CONFIG.title &&
      content.topic !== "Comparison Challenge"
  );
  const quantityMissionTypes = new Set(
    quantityValleyTopics
      .map((content) =>
        content.frameworkStages.find((stage) => stage.stage === "PLAY")
          ?.quantityMissionType
      )
      .filter((value): value is string => Boolean(value))
  );

  if (
    quantityValleyTopics.length &&
    (quantityMissionTypes.size !== quantityValleyTopics.length ||
      quantityValleyTopics.some(
        (content) =>
          !/count/i.test(
            content.frameworkStages.find((stage) => stage.stage === "PLAY")
              ?.quantityConcept ?? ""
          )
      ))
  ) {
    addValidationIssue(
      issues,
      quantityValleyTopics[0],
      "More & Less Valley topics must use varied count-before-compare quantity missions.",
      "critical",
      "PLAY"
    );
  }

  const countingForestTopics = contents.filter(
    (content) =>
      content.level === "kindergarten" &&
      content.world === KINDERGARTEN_NUMBER_WORLD_CONFIG.title
  );
  const expectedKindergartenCountingForestSequence =
    KINDERGARTEN_NUMBER_TOPIC_ORDER;

  if (
    countingForestTopics.length &&
    (countingForestTopics.length !== expectedKindergartenCountingForestSequence.length ||
      countingForestTopics.some(
        (content, index) => content.topic !== expectedKindergartenCountingForestSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      countingForestTopics[0],
      "Kindergarten Counting Forest must contain Number 11 through Number 20, then Number Challenge.",
      "critical",
      "PLAY"
    );
  }

  const kindergartenWorldSequence = Array.from(
    new Set(
      contents
        .filter((content) => content.level === "kindergarten")
        .map((content) => content.world)
    )
  );
  const expectedKindergartenWorldSequence = [
    KINDERGARTEN_ALPHABET_WORLD_CONFIG.title,
    "School World",
    KINDERGARTEN_COMMUNITY_WORLD_CONFIG.title,
    KINDERGARTEN_NUMBER_WORLD_CONFIG.title,
    KINDERGARTEN_SIZE_WORLD_CONFIG.title,
    KINDERGARTEN_QUANTITY_WORLD_CONFIG.title,
    KINDERGARTEN_PATTERN_WORLD_CONFIG.title,
  ];

  if (
    kindergartenWorldSequence.length &&
    (kindergartenWorldSequence.length !== expectedKindergartenWorldSequence.length ||
      kindergartenWorldSequence.some(
        (world, index) => world !== expectedKindergartenWorldSequence[index]
      ))
  ) {
    addValidationIssue(
      issues,
      contents.find((content) => content.level === "kindergarten") ?? contents[0],
      "Kindergarten worlds must follow Alphabet Adventure, School World, Community Helpers, Counting Forest, Big & Small Village, More & Less Valley, then Pattern Playground.",
      "critical"
    );
  }

  const kindergartenWorlds = new Map<string, BatiBotTopicContent[]>();

  contents
    .filter((content) => content.level === "kindergarten")
    .forEach((content) => {
      const worldTopics = kindergartenWorlds.get(content.world) ?? [];
      worldTopics.push(content);
      kindergartenWorlds.set(content.world, worldTopics);
    });

  kindergartenWorlds.forEach((worldTopics) => {
    if (worldTopics[0]?.world === KINDERGARTEN_ALPHABET_WORLD_CONFIG.title) {
      const expectedAlphabetTopics = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .map((letter) => `Letter ${letter}`);
      const actualAlphabetTopics = worldTopics.map((content) => content.topic);

      if (
        actualAlphabetTopics.length !== expectedAlphabetTopics.length ||
        actualAlphabetTopics.some((topic, index) => topic !== expectedAlphabetTopics[index])
      ) {
        addValidationIssue(
          issues,
          worldTopics[0],
          "Alphabet Adventure topics must be exactly Letter A through Letter Z.",
          "critical",
          "LOOK"
        );
      }

      return;
    }

    if (worldTopics[0]?.world === "School World") {
      const expectedSchoolTopics = [
        "Bag",
        "Book",
        "Paper",
        "Chair",
        "Crayon",
        "Desk",
        "Eraser",
        "Notebook",
        "Pencil",
      ];
      const actualSchoolTopics = worldTopics.map((content) => content.topic);

      if (
        actualSchoolTopics.length !== expectedSchoolTopics.length ||
        actualSchoolTopics.some((topic, index) => topic !== expectedSchoolTopics[index])
      ) {
        addValidationIssue(
          issues,
          worldTopics[0],
          "Kindergarten School World topics must be exactly Bag, Book, Paper, Chair, Crayon, Desk, Eraser, Notebook, and Pencil.",
          "critical",
          "LOOK"
        );
      }

      return;
    }

    if (worldTopics[0]?.world === KINDERGARTEN_READING_WORLD_CONFIG.title) {
      const expectedReadingTopics = KINDERGARTEN_READING_TOPIC_ORDER;
      const actualReadingTopics = worldTopics.map((content) => content.topic);

      if (
        actualReadingTopics.length !== expectedReadingTopics.length ||
        actualReadingTopics.some((topic, index) => topic !== expectedReadingTopics[index])
      ) {
        addValidationIssue(
          issues,
          worldTopics[0],
          "Kindergarten Reading World topics must be exactly Picture Reading, CVC Words, Sight Words, Simple Sentences, and Story Sequencing.",
          "critical",
          "LOOK"
        );
      }

      return;
    }

    const finalTopic = worldTopics.at(-1);
    const challengeTopic = worldTopics.find((content) =>
      /challenge$/i.test(content.topic)
    );

    if (!finalTopic || !/challenge$/i.test(finalTopic.topic)) {
      addValidationIssue(
        issues,
        worldTopics[0],
        "Every Kindergarten world must end with a world challenge.",
        "critical",
        "PLAY"
      );
      return;
    }

    const expectedTopics = worldTopics
      .filter((content) => content !== challengeTopic)
      .map((content) => getCanonicalAnswerLabel(content.topic));
    const synthesizedTopics = new Set(
      challengeTopic?.frameworkStages
        .find((stage) => stage.stage === "PLAY")
        ?.worldChallengeTopics?.map(getCanonicalAnswerLabel) ?? []
    );

    if (
      !challengeTopic ||
      synthesizedTopics.size !== expectedTopics.length ||
      expectedTopics.some((topic) => !synthesizedTopics.has(topic))
    ) {
      addValidationIssue(
        issues,
        finalTopic,
        "Kindergarten world challenge must synthesize every previous topic.",
        "critical",
        "PLAY"
      );
    }
  });

  const grade1Worlds = new Map<string, BatiBotTopicContent[]>();

  contents
    .filter((content) => content.level === "grade1")
    .forEach((content) => {
      const worldTopics = grade1Worlds.get(content.world) ?? [];
      worldTopics.push(content);
      grade1Worlds.set(content.world, worldTopics);
    });

  grade1Worlds.forEach((worldTopics) => {
    if (worldTopics[0]?.world === "Reading Quest") {
      const expectedReadingTopics = GRADE1_READING_TOPIC_ORDER;
      const actualReadingTopics = worldTopics.map((content) => content.topic);

      if (
        actualReadingTopics.length !== expectedReadingTopics.length ||
        actualReadingTopics.some((topic, index) => topic !== expectedReadingTopics[index])
      ) {
        addValidationIssue(
          issues,
          worldTopics[0],
          `Grade 1 Reading Quest topics must be exactly ${expectedReadingTopics.join(", ")}.`,
          "critical",
          "LOOK"
        );
      }

      return;
    }

    const finalTopic = worldTopics.at(-1);
    const challengeTopic = worldTopics.find((content) =>
      /challenge$/i.test(content.topic)
    );

    if (!finalTopic || !/challenge$/i.test(finalTopic.topic)) {
      addValidationIssue(
        issues,
        worldTopics[0],
        "Every Grade 1 world must end with a world master challenge.",
        "critical",
        "PLAY"
      );
      return;
    }

    const expectedTopics = worldTopics
      .filter((content) => content !== challengeTopic)
      .map((content) => getCanonicalAnswerLabel(content.topic));
    const synthesizedTopics = new Set(
      challengeTopic?.frameworkStages
        .find((stage) => stage.stage === "PLAY")
        ?.worldChallengeTopics?.map(getCanonicalAnswerLabel) ?? []
    );

    if (
      !challengeTopic ||
      synthesizedTopics.size !== expectedTopics.length ||
      expectedTopics.some((topic) => !synthesizedTopics.has(topic))
    ) {
      addValidationIssue(
        issues,
        finalTopic,
        "Grade 1 world challenge must synthesize every previous topic.",
        "critical",
        "PLAY"
      );
    }
  });

  const expectedGrade3LiteracyWorlds: Record<string, string[]> = {
    "Context Clue Canyon": [
      "Definition Clues",
      "Example Clues",
      "Synonym & Antonym Clues",
      "Context Challenge",
    ],
    "Reading Quest": [
      "Reading Words",
      "Reading Sentences",
      "Reading Passages",
      "Reading Comprehension",
    ],
    "Story Adventure": [
      "Characters & Setting",
      "Problem & Solution",
      "Beginning, Middle & Ending",
      "Theme & Moral Lesson",
    ],
  };

  Object.entries(expectedGrade3LiteracyWorlds).forEach(([world, expectedTopics]) => {
    const worldTopics = contents.filter(
      (content) => content.level === "grade3" && content.world === world
    );
    const actualTopics = worldTopics.map((content) => content.topic);

    if (
      worldTopics.length &&
      (actualTopics.length !== expectedTopics.length ||
        actualTopics.some((topic, index) => topic !== expectedTopics[index]))
    ) {
      addValidationIssue(
        issues,
        worldTopics[0],
        `Grade 3 ${world} topics must match the approved literacy structure.`,
        "critical",
        "LOOK"
      );
    }
  });

  const grade2Worlds = new Map<string, BatiBotTopicContent[]>();

  contents
    .filter((content) => content.level === "grade2")
    .forEach((content) => {
      const worldTopics = grade2Worlds.get(content.world) ?? [];
      worldTopics.push(content);
      grade2Worlds.set(content.world, worldTopics);
    });

  grade2Worlds.forEach((worldTopics) => {
    const finalTopic = worldTopics.at(-1);
    const challengeTopic =
      finalTopic && /challenge$/i.test(finalTopic.topic)
        ? finalTopic
        : undefined;

    if (!finalTopic || !/challenge$/i.test(finalTopic.topic)) {
      addValidationIssue(
        issues,
        worldTopics[0],
        "Every Grade 2 world must end with a world master challenge.",
        "critical",
        "PLAY"
      );
      return;
    }

    const expectedTopics = worldTopics
      .filter((content) => content !== challengeTopic)
      .map((content) => getCanonicalAnswerLabel(content.topic));
    const synthesizedTopics = new Set(
      challengeTopic?.frameworkStages
        .find((stage) => stage.stage === "PLAY")
        ?.worldChallengeTopics?.map(getCanonicalAnswerLabel) ?? []
    );

    if (
      !challengeTopic ||
      synthesizedTopics.size !== expectedTopics.length ||
      expectedTopics.some((topic) => !synthesizedTopics.has(topic))
    ) {
      addValidationIssue(
        issues,
        finalTopic,
        "Grade 2 world challenge must synthesize every previous topic.",
        "critical",
        "PLAY"
      );
    }
  });

  const invalidTopicIds = new Set(
    issues
      .filter((issue) => issue.severity === "critical")
      .map((issue) => `${issue.level}:${issue.world}:${issue.topic}`)
  );
  const validTopicCount = contents.length - invalidTopicIds.size;
  const score = contents.length
    ? Math.max(0, Math.round((validTopicCount / contents.length) * 100))
    : 0;

  return {
    issueCount: issues.length,
    issues,
    score,
    topicCount: contents.length,
    validTopicCount,
  };
}

function toCurriculumQualitySeverity(
  severity: FrameworkValidationSeverity
): CurriculumQualitySeverity {
  return severity === "critical" ? "Critical" : "Major";
}

function getAuditGuidance(issue: string) {
  if (/examples|non-examples|misconceptions|vocabulary|knowledge units/i.test(issue)) {
    return {
      exampleFix: "Add topic-specific knowledge units, 10 examples, 5 non-examples, misconception corrections, and a 15-word vocabulary bank.",
      expectedOutcome: "The lesson has enough instructional material for a teacher, renderer, or Gemini prompt to teach the competency without improvising.",
      recommendedFix: "Deepen the topic content database before the lesson is published.",
      whyItMatters: "Thin content produces generic lessons and prevents real mastery.",
    };
  }

  if (/PLAY|application|simulation|competency behavior|multiple choice/i.test(issue)) {
    return {
      exampleFix: "For Money, use a virtual store; for Fractions, partition a whole; for Story Character, highlight evidence in the passage.",
      expectedOutcome: "The learner applies the skill in a meaningful activity instead of only selecting an answer.",
      recommendedFix: "Map PLAY to the topic competency behavior and require the application action before completion.",
      whyItMatters: "PLAY is the proof-of-learning stage; if it behaves like another quiz, mastery is not credible.",
    };
  }

  if (/LOOK|TAP|TRY|CHOOSE|cognitive behavior|cognitive skill/i.test(issue)) {
    return {
      exampleFix: "LOOK observes, TAP reveals relationships, TRY identifies with hints, CHOOSE classifies independently, and PLAY applies.",
      expectedOutcome: "The learner experiences a clear progression from observe to demonstrate.",
      recommendedFix: "Separate the cognitive action of each framework stage.",
      whyItMatters: "Repeated cognitive behavior makes the framework feel like relabeled recognition instead of active learning.",
    };
  }

  if (/animation/i.test(issue)) {
    return {
      exampleFix: "Tap a fraction to highlight the numerator, or bundle ten ones into a tens rod.",
      expectedOutcome: "Motion teaches, guides, reinforces, or celebrates learning.",
      recommendedFix: "Replace decorative motion with learning-purpose animation.",
      whyItMatters: "Animation that does not support learning can distract young learners and waste attention.",
    };
  }

  if (/renderer|required learner action/i.test(issue)) {
    return {
      exampleFix: "Use FractionPartitionRenderer for fractions, MoneyComposerRenderer for money, and PassageEvidenceRenderer for comprehension.",
      expectedOutcome: "The UI interaction matches the competency and grade level.",
      recommendedFix: "Assign the correct specialized renderer and learner action.",
      whyItMatters: "Renderer mismatch can make a topic feel unrelated to its intended competency.",
    };
  }

  return {
    exampleFix: "Add the missing field or replace the repeated/generic lesson item with topic-specific content.",
    expectedOutcome: "The lesson becomes curriculum-aligned, measurable, and production-ready.",
    recommendedFix: "Update the curriculum content database and rerun the quality validator.",
    whyItMatters: "A production lesson must be specific, complete, age-appropriate, and measurable.",
  };
}

function toCurriculumQualityIssue(
  issue: FrameworkValidationIssue
): CurriculumQualityAuditIssue {
  const guidance = getAuditGuidance(issue.issue);

  return {
    affectedGrade: issue.level,
    affectedStage: issue.stage,
    affectedTopic: issue.topic,
    affectedWorld: issue.world,
    issue: issue.issue,
    severity: toCurriculumQualitySeverity(issue.severity),
    ...guidance,
  };
}

function getIssuePenalty(severity: CurriculumQualitySeverity) {
  if (severity === "Critical") {
    return 1.25;
  }

  if (severity === "Major") {
    return 0.75;
  }

  return 0.35;
}

function scoreFromIssues(
  issues: CurriculumQualityAuditIssue[],
  matcher: (issue: CurriculumQualityAuditIssue) => boolean
) {
  const penalty = issues
    .filter(matcher)
    .reduce((total, issue) => total + getIssuePenalty(issue.severity), 0);

  return Math.max(0, Math.round((10 - penalty) * 10) / 10);
}

function getGradeTopicContents(contents: BatiBotTopicContent[]) {
  return contents;
}

export function auditBatiBotCurriculumQuality(
  contents: BatiBotTopicContent[] = getAllBatiBotTopicContent()
): CurriculumQualityAuditSummary {
  const gradeContents = getGradeTopicContents(contents);
  const validationIssues = gradeContents.flatMap(validateBatiBotTopicContent);
  const worldIssues: CurriculumQualityAuditIssue[] = getAllCurriculumWorlds()
    .filter(
      (world) =>
        !world.worldIdentity?.teaches ||
        !world.worldIdentity.knowledgeScope.length ||
        !world.worldIdentity.completionChallenge
    )
    .map((world) => ({
      affectedGrade: getBatiBotTopicLevel(world.gradeLevel),
      affectedTopic: "All topics",
      affectedWorld: world.title,
      expectedOutcome: "The world has a distinct teaching purpose, knowledge scope, and mastery challenge.",
      issue: "World identity must define what the world teaches, its knowledge scope, and its completion challenge.",
      recommendedFix: "Add world identity metadata before publishing the world.",
      exampleFix: "Word Kingdom teaches vocabulary classification; Math Mountain teaches arithmetic modeling and problem solving.",
      severity: "Major",
      whyItMatters: "Worlds that feel interchangeable weaken navigation, motivation, and curriculum progression.",
    }));
  const issues = [...validationIssues.map(toCurriculumQualityIssue), ...worldIssues];
  const worlds = new Set(gradeContents.map((content) => `${content.level}:${content.world}`));

  const scores: CurriculumQualityScores = {
    activeLearning: scoreFromIssues(issues, (issue) =>
      /active|PLAY|application|multiple choice|learner action/i.test(issue.issue)
    ),
    animationQuality: scoreFromIssues(issues, (issue) => /animation/i.test(issue.issue)),
    contentAppropriateness: scoreFromIssues(issues, (issue) =>
      /competency|renderer|activity|behavior|topic-specific/i.test(issue.issue)
    ),
    contentDepth: scoreFromIssues(issues, (issue) =>
      /knowledge|examples|non-examples|misconceptions|vocabulary|content database/i.test(issue.issue)
    ),
    curriculumAlignment: scoreFromIssues(issues, (issue) =>
      /curriculum|competency|grade|renderer|alignment/i.test(issue.issue)
    ),
    frameworkCompliance: scoreFromIssues(issues, (issue) =>
      /stage|eight|order|missing|duplicate/i.test(issue.issue)
    ),
    frameworkEvolution: scoreFromIssues(issues, (issue) =>
      /cognitive|LOOK|TAP|TRY|CHOOSE|PLAY/i.test(issue.issue)
    ),
    gradeDifferentiation: scoreFromIssues(issues, (issue) =>
      /grade|upper-grade|Grade 1-3/i.test(issue.issue)
    ),
    masteryQuality: scoreFromIssues(issues, (issue) =>
      /mastery|MASTERED|STAR|PROGRESS|reward|tracking/i.test(issue.issue)
    ),
    simulationQuality: scoreFromIssues(issues, (issue) =>
      /simulation|real-life|multiple choice|PLAY/i.test(issue.issue)
    ),
    topicUniqueness: scoreFromIssues(issues, (issue) =>
      /repeated|reuse|generic|topic-specific/i.test(issue.issue)
    ),
    worldIdentity: scoreFromIssues(issues, (issue) => /world/i.test(issue.issue)),
    overallLearningQuality: 0,
  };
  const componentScores = Object.entries(scores)
    .filter(([key]) => key !== "overallLearningQuality")
    .map(([, value]) => value);
  const readinessScore = componentScores.length
    ? Math.round(
        (componentScores.reduce((total, score) => total + score, 0) /
          componentScores.length) *
          10
      ) / 10
    : 0;

  scores.overallLearningQuality = readinessScore;

  return {
    auditedGrades: ["preschool", "kindergarten", "grade1", "grade2", "grade3"],
    issueCount: issues.length,
    issues,
    prioritizedFixList: Array.from(
      new Set(
        issues
          .sort((left, right) => getIssuePenalty(right.severity) - getIssuePenalty(left.severity))
          .map((issue) => issue.recommendedFix)
      )
    ),
    productionReady: issues.every((issue) => issue.severity !== "Critical"),
    readinessScore,
    scores,
    topicCount: gradeContents.length,
    worldCount: worlds.size,
  };
}
