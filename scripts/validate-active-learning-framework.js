const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const curriculumPath = path.join(
  rootDir,
  "src",
  "data",
  "curriculum",
  "learning-path.ts"
);
const source = fs.readFileSync(curriculumPath, "utf8");
const grade2CurriculumDir = path.join(rootDir, "src", "curriculum", "grade2");

function readTypeScriptFiles(directory) {
  if (!fs.existsSync(directory)) {
    return "";
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .map((entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return readTypeScriptFiles(entryPath);
      }

      return entry.name.endsWith(".ts")
        ? fs.readFileSync(entryPath, "utf8")
        : "";
    })
    .join("\n");
}

const validationSource = `${source}\n${readTypeScriptFiles(grade2CurriculumDir)}`;

const requiredSnippets = [
  "export type FrameworkStageContent",
  "content: string",
  "uiBehavior: string",
  "interaction: string",
  "feedback: string",
  "completionRule: string",
  "animationPurpose: string",
  "teachingScript?: string",
  "guidedQuestions?: FrameworkQuestion[]",
  "independentQuestions?: FrameworkQuestion[]",
  "applicationActivity?: ApplicationActivityContent",
  "export type CognitiveSkill",
  "export type DifficultyLevel",
  "export type TopicCompetencyBehavior",
  "cognitiveSkill: CognitiveSkill",
  "difficulty: DifficultyLevel",
  "requiredAction?:",
  "passage?: string",
  "questionText?: string",
  "evidenceSentences?: string[]",
  "manipulatives?: string[]",
  "timerSeconds?: number",
  "roundCount?: number",
  "revealSuccessAfterRound?: number",
  "requiredInteractionCount?: number",
  "correctAnswerRepresentation?:",
  "colorTarget?: string",
  "colorObjectLabels?: string[]",
  "shapeTarget?: string",
  "shapeObjectLabels?: string[]",
  "animalSound?: string",
  "animalHome?: string",
  "animalFoodOrActivity?: string",
  "fruitColor?: string",
  "fruitCharacteristic?: string",
  "fruitCollectionTarget?: string",
  "fruitChallengeItems?: string[]",
  "foodGroup?: string",
  "foodLearningFact?: string",
  "foodMissionType?: string",
  "foodMealTarget?: string",
  "foodChallengeItems?: string[]",
  "numberQuantity?: number",
  "numberCountingObject?: string",
  "numberMissionType?: string",
  "numberDestination?: string",
  "numberChallengeItems?: number[]",
  "countingSkill?: string",
  "countingRange?: string",
  "forestObjectAssetIds?: string[]",
  "forestObjectTypes?: string[]",
  "forestMissionType?: string",
  "forestChallengeSkills?: string[]",
  "quantityRange?: { max: number; min: number }",
  "sizeConcept?: string",
  "sizeMissionType?: string",
  "sizeObjectLabels?: string[]",
  "sizeChallengeConcepts?: string[]",
  "quantityConcept?: string",
  "quantityMissionType?: string",
  "quantityGroupCounts?: number[]",
  "quantityObjectTypes?: string[]",
  "quantityChallengeConcepts?: string[]",
  "worldChallengeTopics?: string[]",
  "export type BatiBotTopicContent",
  "topicAssetSlot: string",
  "lookAssetSlot: string",
  "tapAssetSlot: string",
  "tryAssetSlot: string",
  "chooseAssetSlot: string",
  "playAssetSlot: string",
  "rewardAssetSlot: string",
  "masteryAssetSlot: string",
  "id: string",
  "curriculumArea: string",
  "competency: string",
  "learningObjective: string",
  "knowledge: string",
  "successCriteria: string[]",
  "knowledgeUnits: TopicKnowledgeUnit[]",
  "examples: TopicExample[]",
  "nonExamples: TopicNonExample[]",
  "misconceptions: TopicMisconception[]",
  "vocabularyBank: TopicVocabularyEntry[]",
  "visualAssetRequirements: TopicAssetRequirements",
  "validationRules: TopicValidationRules",
  "masteryRules: TopicMasteryRules",
  "behaviorProfile: TopicBehaviorProfile",
  "difficultyLevel: DifficultyLevel",
  "recommendedRenderer: string",
  "rendererAliases: string[]",
  "competencyDemonstration: string",
  "evidenceRequired: string[]",
  "masteryDemonstration: string",
  "export type CurriculumQualityAuditIssue",
  "export type CurriculumQualityAuditSummary",
  "export function auditBatiBotCurriculumQuality",
  "buildFrameworkStages",
  "buildStageContract",
  "buildTopicContentDatabase",
  "buildTopicExamples",
  "buildTryQuestions",
  "buildChooseQuestions",
  "getGrade1TopicExamplePool",
  "getGrade1TopicNonExamplePool",
  "getGrade1TopicMisconceptions",
  "getGrade1KnowledgeUnits",
  "getGrade1BehaviorSimulationProfile",
  "getGrade1RecommendedRendererName",
  "getStageCognitiveSkill",
  "buildTopicBehaviorProfile",
  "getTopicCompetencyBehavior",
  "getBehaviorSimulationProfile",
  "getRecommendedRendererName",
  "getRendererAliases",
  "getTopicDifficultyLevel",
  "getStageDifficulty",
  "getStageAnimationPlan",
  "isWeakAnimationPurpose",
  "LOOK and TAP must require different cognitive behavior",
  "Preschool TAP and TRY must use different interactions",
  "Preschool TRY and CHOOSE must use different interactions",
  "Preschool stages must progress LOOK observe, TAP recognize, TRY recall, CHOOSE reason, and PLAY apply",
  "Consecutive Preschool stages must not teach the same cognitive skill",
  "Every Preschool instructional stage must declare its cognitive objective",
  "Every Preschool instructional stage must auto-narrate; speaker buttons are replay only",
  "Preschool feedback motion must stay within 200-350ms",
  "Preschool LOOK must be active visual observation with a 2-3 second delayed highlight",
  "Preschool TAP must use targeted identification with randomized object positions and distractors",
  "Preschool TRY must hide previous answers and train memory recall",
  "Preschool CHOOSE must train reasoning with randomized answer order",
  "Preschool PLAY must use drag, drop, sort, build, collect, arrange, trace, connect, count, or a mini mission; never another quiz",
  "Preschool PLAY must reveal success only after all three rounds",
  "Every Preschool learning stage must include audio support",
  "Preschool stage instructions must use no more than 10 words",
  "Preschool TAP must require at least two meaningful interactions",
  "Preschool CHOOSE must have exactly two or four choices",
  "Kindergarten TAP must require at least two meaningful interactions",
  "must contain exactly one explicit correct answer",
  "Generated question must contain exactly one correct answer",
  "group concepts must use a group-scene correct answer",
  "Home answers must use a place-scene card",
  "Scoped Family word TAP must require exactly one picture tap",
  "Scoped Family word TRY must render exactly two picture choices",
  "Scoped Family word CHOOSE must render exactly four picture reasoning choices",
  "Scoped Family word PLAY must use a build or move mission",
  "Scoped Family word PLAY must reveal success after its one mission",
  "Home PLAY must require Baby and Friend with Tree and Cow distractors",
  "Family PLAY must require Home, Mother, and Father with Tree as distractor",
  "My Family World must contain exactly Mother, Father, Brother, Sister, Baby, Friend, Home, and Family in order",
  "Scoped Body TAP must require exactly one picture tap",
  "Scoped Body TRY must render exactly two image choices",
  "Scoped Body CHOOSE must render exactly four picture reasoning choices",
  "Scoped Body PLAY must use one validated body-action mission",
  "Scoped Body PLAY config must match its body-action mission",
  "Scoped Body PLAY must reveal success after its one mission",
  "My Body World must contain exactly Head, Hair, Eyes, Ears, Nose, Mouth, Teeth, Hands, Feet, and Body in order",
  "Scoped Color TAP must require exactly one color tap",
  "Scoped Color TRY must render exactly two color choices",
  "Scoped Color CHOOSE must render exactly four picture reasoning choices",
  "Scoped Color PLAY config must match its color-action mission",
  "Scoped Color PLAY must reveal success after its one mission",
  "My Colorful World must contain exactly Red, Blue, Yellow, Green, Orange, Purple, White, and Black in order",
  "Scoped Shape TAP must require exactly one shape tap",
  "Scoped Shape TRY must render exactly two shape choices",
  "Scoped Shape CHOOSE must render exactly four picture reasoning choices",
  "Scoped Shape PLAY config must match its construction mission",
  "Scoped Shape PLAY must reveal success after its one mission",
  "Shape Kingdom must contain exactly Circle, Square, Triangle, Rectangle, and Star in order",
  "Scoped Animal TAP must require exactly one animal tap",
  "Scoped Animal TRY must render exactly two animal choices",
  "Scoped Animal CHOOSE must render exactly four picture reasoning choices",
  "Scoped Animal PLAY config must match its animal-action mission",
  "Scoped Animal PLAY must reveal success after its one mission",
  "Animal Adventure must contain exactly Dog, Cat, Bird, Fish, Cow, Horse, and Duck in order",
  "Scoped Fruit TAP must require exactly one fruit tap",
  "Scoped Fruit TRY must render exactly two fruit choices",
  "Scoped Fruit CHOOSE must render exactly four picture reasoning choices",
  "Scoped Fruit PLAY config must match its collection mission",
  "Scoped Fruit PLAY must reveal success after its one mission",
  "Fruit Garden must contain exactly Apple, Banana, Mango, Orange, Grapes, and Watermelon in order",
  "Scoped Food TAP must require exactly one food tap",
  "Scoped Food TRY must render exactly two food choices",
  "Scoped Food CHOOSE must render exactly four picture reasoning choices",
  "Scoped Food PLAY config must match its food-use mission",
  "Scoped Food PLAY must reveal success after its one mission",
  "Food Town must contain exactly Rice, Bread, Milk, Egg, Meat, Vegetables, and Juice in order",
  "Scoped Number TAP must require exactly one number tap",
  "Scoped Number TRY must render exactly two quantities with one correct answer",
  "Scoped Number CHOOSE must render exactly four valid quantity choices",
  "Scoped Number PLAY config must require exact quantity manipulation",
  "Scoped Number PLAY must reveal success after its one mission",
  "Number Village must contain exactly Number 1 through Number 10, then Number Challenge, in order",
  "Colorful World stages must define a target color and related objects",
  "Color topic contains an object that does not match its target color",
  "Shape Kingdom stages must define a target shape and related objects",
  "Shape topic contains an object that does not match its target shape",
  "Animal Adventure stages must include sound, home, and food or activity",
  "Fruit Garden stages must include color, characteristic, and collection target",
  "Food Town stages must include group, learning fact, mission type, and meal target",
  "Food Town topics must use serve, collect, or prepare PLAY interactions",
  "Preschool worlds must be sequenced Family, Body, Color, Shape, Animal, Fruit, Food, then Number",
  "Number Village stages must include quantity, counting object, mission type, and destination",
  "Number Challenge must combine exact counts 1 through 10",
  "Number Village must use apple as the counting object for every number",
  "Number Forest stages must include counting skill, range, forest objects, and mission type",
  "Number Forest PLAY must use a forest mission, not multiple choice only",
  "Number Challenge must combine Number 11 through Number 20",
  "Kindergarten Counting Forest must contain Number 11 through Number 20, then Number Challenge",
  "Kindergarten worlds must follow Alphabet Adventure, School World, Community Helpers, Counting Forest, Big & Small Village, More & Less Valley, then Pattern Playground",
  "Simulation-worthy competencies must use a real-life application simulation",
  "validateBatiBotTopicContent",
  "validateBatiBotFrameworkCompliance",
  "getAllBatiBotTopicContent",
  "Repeated ${kind} content",
  "Every topic must expose topic, LOOK, TAP, TRY, CHOOSE, PLAY, reward, and mastery asset slots",
  "Kindergarten PLAY must use manipulation or application, not multiple choice only",
  "Every Kindergarten world must end with a world challenge",
  "Kindergarten world challenge must synthesize every previous topic",
  "Grade 1 PLAY must require manipulation or application, not answer selection",
  "Grade 1 PLAY must define a completable application activity",
  "Word Kingdom PLAY must classify, match, sequence, or build words",
  "Reading Quest PLAY must build or match meaningful reading content",
  "Time Town PLAY must set or sequence time and routines",
  "Math Mountain PLAY must build, count, or manipulate number sentences",
  "Every Grade 1 world must end with a world master challenge",
  "Grade 1 world challenge must synthesize every previous topic",
  "Grade 2 TAP must investigate at least two meaningful model parts or clues",
  "Grade 2 PLAY must require evidence or model manipulation, not another multiple-choice quiz",
  "Grade 2 PLAY must define a multi-step applied reasoning mission",
  "Grade 2 reasoning must require both a model or manipulative and evidence, passage, or proof",
  "Place Value City PLAY must build base-ten models before comparing or explaining",
  "Measurement Harbor PLAY must use a measurement tool, not answer selection only",
  "Grade 2 arrays must be built with rows and columns",
  "Problem Solver City must provide a word-problem workspace with visible reasoning steps",
  "Main Idea PLAY must require supporting evidence from the passage",
  "Every Grade 2 world must end with a world master challenge",
  "Grade 2 world challenge must synthesize every previous topic",
  "GRADE2_RECONSTRUCTION_BLUEPRINTS",
  "challengeInstruction",
  "GRADE1_CONTENT_BIBLE_OVERRIDES",
  "GRADE1_TOPIC_BIBLE_SUMMARIES",
  "getGrade1ContentBibleOverride",
];

const requiredRenderers = [
  "PreschoolRecognitionRenderer",
  "KindergartenFoundationalRenderer",
  "SentenceBuilderRenderer",
  "WordCategorySorterRenderer",
  "NumberLineRenderer",
  "AddTakeAwayCounterRenderer",
  "ShapePropertyRenderer",
  "TimeRenderer",
  "MiniStoryRenderer",
  "VocabularyRelationshipRenderer",
  "CompoundWordBuilderRenderer",
  "PassageEvidenceRenderer",
  "SequenceEventsRenderer",
  "CommunityScenarioMapRenderer",
  "BaseTenPlaceValueRenderer",
  "MeasurementToolRenderer",
  "EqualGroupMultiplicationRenderer",
  "EqualGroupsRenderer",
  "ArrayBuilderRenderer",
  "WordProblemWorkspaceRenderer",
  "MixedSkillMasteryRenderer",
  "MixedMissionRenderer",
  "VocabularyInContextRenderer",
  "ContextClueRenderer",
  "StoryMapRenderer",
  "FractionPartitionRenderer",
  "DivisionSharingRenderer",
  "MoneyComposerRenderer",
  "MultiStepWorkspaceRenderer",
  "MultiplicationArrayRenderer",
  "MasterMissionRenderer",
];

const requiredExamples = [
  'topic("Mother"',
  "KINDERGARTEN_ALPHABET_WORLD_CONFIG",
  "GRADE1_MATH_WORLD_CONFIG",
  'title: "Tens"',
  'title: "Characters"',
  "Nouns are naming words",
  "Addition means putting together",
  "Morning happens after waking up",
];

const requiredStages = [
  '"LOOK"',
  '"TAP"',
  '"TRY"',
  '"CHOOSE"',
  '"PLAY"',
  '"STAR"',
  '"PROGRESS"',
  '"MASTERED"',
];

const missing = [
  ...requiredSnippets,
  ...requiredRenderers,
  ...requiredExamples,
  ...requiredStages,
].filter((snippet) => !validationSource.includes(snippet));

if (missing.length) {
  console.error("Active Learning Framework validation failed.");
  missing.forEach((snippet) => console.error(`Missing: ${snippet}`));
  process.exit(1);
}

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, request.slice(2)),
      parent,
      isMain,
      options
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTs(module, filename) {
  const typeScriptSource = fs.readFileSync(filename, "utf8");
  const transpiled = ts.transpileModule(typeScriptSource, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });

  module._compile(transpiled.outputText, filename);
};

const {
  getAllBatiBotTopicContent,
  validateBatiBotFrameworkCompliance,
} = require(curriculumPath);
const allTopicContent = getAllBatiBotTopicContent();
const frameworkSummary = validateBatiBotFrameworkCompliance(
  allTopicContent
);
const enforcedIntegrityIssuePatterns = [
  /correct answer/i,
  /correctAnswer/i,
  /exactly one explicit/i,
  /missing from choices/i,
  /duplicate or equivalent answers/i,
  /target concept/i,
  /target absent/i,
  /visual does not match/i,
  /group concepts must use/i,
  /Home answers must use/i,
];
const enforcedIntegrityIssues = frameworkSummary.issues.filter((issue) =>
  enforcedIntegrityIssuePatterns.some((pattern) => pattern.test(issue.issue))
);

if (enforcedIntegrityIssues.length) {
  console.error(
    `Active Learning Framework validation failed with ${enforcedIntegrityIssues.length} correct-answer integrity issue(s).`
  );
  enforcedIntegrityIssues.slice(0, 50).forEach((issue) => {
    console.error(
      `${issue.severity.toUpperCase()} ${issue.level} / ${issue.world} / ${issue.topic}${issue.stage ? ` / ${issue.stage}` : ""}: ${issue.issue}`
    );
  });
  process.exit(1);
}

console.log(
  `Active Learning Framework validation passed (${allTopicContent.length} Preschool-Grade 3 topics checked).`
);
