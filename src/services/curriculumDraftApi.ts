import {
  CURRICULUM,
  type ActiveLearningPhase,
  type CurriculumTopic,
  type CurriculumWorld,
} from "@/src/data/curriculum/learning-path";
import {
  BATIBOT_ADMIN_PROMPT_MODULES,
  BATIBOT_ADMIN_PROMPT_PIPELINE,
  BATIBOT_CURRICULUM_API_VERSION,
  BATIBOT_PHASE_CONTRACTS,
  getChildActionForLayouts,
  getMobileUiContract,
  type BatiBotAdminPromptModule,
} from "@/src/domain/rules/gemini-draft-rules";
import {
  BATIBOT_API_FIRESTORE_COLLECTIONS,
  BATIBOT_API_MODULES,
  BATIBOT_CURRICULUM_INTELLIGENCE_PIPELINE,
  BATIBOT_CURRICULUM_INTELLIGENCE_SERVICES,
  BATIBOT_FIRESTORE_COLLECTIONS,
  BATIBOT_MINIMUM_API_DATA,
  BATIBOT_PRODUCTION_ARCHITECTURE,
  buildBatiBotCurriculumIntelligenceSnapshot,
  type BatiBotCurriculumIntelligenceSnapshot,
  type BatiBotCurriculumIntelligenceService,
} from "@/src/domain/rules/curriculum-intelligence-api";
import {
  getAdminWorldInterfaceContract,
  type AdminWorldInterfaceContract,
} from "@/src/domain/rules/admin-ecosystem";
import type {
  GenerateQuizDraftInput,
  LearnerLevel,
  QuizLayoutType,
} from "@/src/types/quiz";

export interface BatiBotCurriculumDraftApiContract {
  activeLearningFramework: typeof BATIBOT_PHASE_CONTRACTS;
  apiVersion: string;
  adminPromptModules: BatiBotAdminPromptModule[];
  adminWorkflow: string;
  ecosystem: {
    firestoreCollections: typeof BATIBOT_FIRESTORE_COLLECTIONS;
    productionArchitecture: typeof BATIBOT_PRODUCTION_ARCHITECTURE;
    snapshot: BatiBotCurriculumIntelligenceSnapshot;
  };
  intelligenceApi: {
    apiModules: typeof BATIBOT_API_MODULES;
    minimumData: typeof BATIBOT_MINIMUM_API_DATA;
    pipeline: string;
    services: BatiBotCurriculumIntelligenceService[];
  };
  assetContract: {
    assetId: string;
    requiresApprovedAsset: boolean;
    topicAssetId: string;
    worldAssetId: string;
  };
  contentBoundaries: {
    allowedVocabulary: string[];
    forbidden: string[];
    mustUseKnownContentOnly: boolean;
  };
  geminiOutputRules: string[];
  mobileUiContract: ReturnType<typeof getMobileUiContract>;
  worldInterfaceContract: AdminWorldInterfaceContract;
  playTarget: {
    competencyCode: string;
    competencyObjective: string;
    competencySource: string;
    gradeLevel: LearnerLevel;
    kindergartenSupport: CurriculumTopic["kindergartenSupport"] | null;
    node: number;
    phase: ActiveLearningPhase;
    topicId: string;
    topicTitle: string;
    worldId: string;
    worldTitle: string;
  };
  rewardContract: {
    expectedXp: number;
    rewardMapping: string;
  };
  selectedPhaseContract: (typeof BATIBOT_PHASE_CONTRACTS)[ActiveLearningPhase];
  validationGates: string[];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTopicId(worldId: string, topicTitle: string) {
  return `${worldId}-${slugify(topicTitle)}`;
}

function getCurriculumGrade(gradeLevel: LearnerLevel) {
  return CURRICULUM.find((grade) => grade.gradeLevel === gradeLevel) ?? CURRICULUM[0];
}

function getWorld(worldId: string | undefined, gradeLevel: LearnerLevel): CurriculumWorld | null {
  const grade = getCurriculumGrade(gradeLevel);

  return (
    grade.worlds.find((world) => world.id === worldId) ??
    CURRICULUM.flatMap((gradeItem) => gradeItem.worlds).find((world) => world.id === worldId) ??
    null
  );
}

function getTopic(
  topicId: string | undefined,
  world: CurriculumWorld | null,
  topicTitle: string
): CurriculumTopic | null {
  if (!world) {
    return null;
  }

  return (
    world.topics.find((topic) => getTopicId(world.id, topic.title) === topicId) ??
    world.topics.find((topic) => topic.title.toLowerCase() === topicTitle.trim().toLowerCase()) ??
    world.topics[0] ??
    null
  );
}

function getPhase(input: GenerateQuizDraftInput): ActiveLearningPhase {
  if (input.phase) {
    return input.phase;
  }

  return input.questionTypes.includes("timed-challenge") ? "Challenge" : "Practice";
}

function hasImageLayout(layouts: QuizLayoutType[]) {
  return layouts.some((layout) =>
    [
      "counting-objects",
      "image-choice",
      "image-to-word",
      "picture-based",
      "word-to-image",
    ].includes(layout)
  );
}

export function buildBatiBotCurriculumDraftApiContract(
  input: GenerateQuizDraftInput
): BatiBotCurriculumDraftApiContract {
  const gradeLevel = input.gradeLevel ?? input.learnerLevel;
  const phase = getPhase(input);
  const world = getWorld(input.worldId, gradeLevel);
  const topic = getTopic(input.topicId, world, input.topic);
  const worldId = world?.id ?? input.worldId ?? "";
  const topicId = topic ? getTopicId(worldId, topic.title) : input.topicId ?? "";
  const allowedVocabulary =
    input.vocabularyContext?.map((item) => item.word).filter(Boolean) ?? [];
  const childAction = getChildActionForLayouts(phase, input.questionTypes);
  const selectedPhaseContract = {
    ...BATIBOT_PHASE_CONTRACTS[phase],
    childAction,
  };
  const ecosystemSnapshot = buildBatiBotCurriculumIntelligenceSnapshot(gradeLevel);
  const worldInterfaceContract = getAdminWorldInterfaceContract(worldId, gradeLevel);

  return {
    activeLearningFramework: BATIBOT_PHASE_CONTRACTS,
    adminPromptModules: BATIBOT_ADMIN_PROMPT_MODULES,
    adminWorkflow: BATIBOT_ADMIN_PROMPT_PIPELINE,
    apiVersion: BATIBOT_CURRICULUM_API_VERSION,
    ecosystem: {
      firestoreCollections: BATIBOT_FIRESTORE_COLLECTIONS,
      productionArchitecture: BATIBOT_PRODUCTION_ARCHITECTURE,
      snapshot: ecosystemSnapshot,
    },
    intelligenceApi: {
      apiModules: BATIBOT_API_MODULES,
      minimumData: BATIBOT_MINIMUM_API_DATA,
      pipeline: BATIBOT_CURRICULUM_INTELLIGENCE_PIPELINE,
      services: BATIBOT_CURRICULUM_INTELLIGENCE_SERVICES,
    },
    assetContract: {
      assetId: input.assetId ?? topicId,
      requiresApprovedAsset: hasImageLayout(input.questionTypes),
      topicAssetId: topicId,
      worldAssetId: worldId,
    },
    contentBoundaries: {
      allowedVocabulary,
      forbidden: [
        "unsafe, violent, mature, frightening, or off-curriculum content",
        "generic topic-label questions",
        "dense adult instructions",
        phase === "Challenge" ? "new vocabulary or new concepts" : "",
      ].filter(Boolean),
      mustUseKnownContentOnly: phase === "Practice" || phase === "Challenge",
    },
    geminiOutputRules: [
      "Return JSON only.",
      "Use BatiBot child-facing copy.",
      "Every prompt must start with or imply one clear child action.",
      "Every generated item must fit the selected phase contract.",
      "Follow the selected world interface contract. Do not invent a new learner UI, frame, stage flow, reward, or validation rule.",
      "Do not publish or mark content as safe; return a draft for admin review.",
      "Include sourceVocabularyWord, vocabularyUsed, targetSkill, reasoningType, and validation metadata for every question.",
    ],
    mobileUiContract: getMobileUiContract(phase, input.questionTypes),
    worldInterfaceContract,
    playTarget: {
      competencyCode: topic?.competencyCode ?? "",
      competencyObjective: topic?.competencyObjective ?? "",
      competencySource: topic?.competencySource ?? "",
      gradeLevel,
      kindergartenSupport: topic?.kindergartenSupport ?? null,
      node: input.node ?? 1,
      phase,
      topicId,
      topicTitle: topic?.title ?? input.topic,
      worldId,
      worldTitle: world?.title ?? "Needs Play mapping",
    },
    rewardContract: {
      expectedXp: input.rewardXp ?? 20,
      rewardMapping:
        input.unlockRewardMapping ??
        "Rank XP, Reward progress, star progress, and mastery state.",
    },
    selectedPhaseContract,
    validationGates: [
      "Grade, world, topic, phase, and node are required before publishing.",
      "Practice repeats known content with support.",
      "Challenge checks known content with less guidance and no new content.",
      "Image content must map to an approved BatiBot asset.",
      "Mobile preview must be checked before publishing.",
      "Reward and XP impact must be visible before publish.",
    ],
  };
}

export function buildBatiBotCurriculumPromptSection(
  contract: BatiBotCurriculumDraftApiContract
) {
  return [
    `BatiBot Curriculum Intelligence API version: ${contract.apiVersion}.`,
    `Admin workflow: ${contract.adminWorkflow}.`,
    `Curriculum Intelligence API pipeline: ${contract.intelligenceApi.pipeline}.`,
    `Curriculum Intelligence API modules: ${contract.intelligenceApi.services
      .map((service) => `${service.title}: ${service.responsibility}`)
      .join(" ")}`,
    `API endpoint modules: ${contract.intelligenceApi.apiModules
      .map((module) => `${module.id} -> ${module.endpoints.join(", ")}`)
      .join(" | ")}.`,
    `Minimum API data: ${contract.intelligenceApi.minimumData.join(", ")}.`,
    `Production architecture rule: ${contract.ecosystem.productionArchitecture.foundation}`,
    `Secure AI boundary: ${contract.ecosystem.productionArchitecture.secureAiBoundary}`,
    `Learner boundary: ${contract.ecosystem.productionArchitecture.learnerBoundary}`,
    `Grade curriculum metadata: focus=${contract.ecosystem.snapshot.level.focus.join(", ")}; learningGoals=${contract.ecosystem.snapshot.level.learningGoals.join(", ")}; blockedFormats=${contract.ecosystem.snapshot.level.blockedFormats.join(", ")}.`,
    `Grade UI/UX metadata: font=${contract.ecosystem.snapshot.uiUx.fontScale}; button=${contract.ecosystem.snapshot.uiUx.buttonSize}; audio=${contract.ecosystem.snapshot.uiUx.audioBehavior.join(", ")}; accessibility=${contract.ecosystem.snapshot.uiUx.accessibility.join(", ")}.`,
    `Play tab rule: ${contract.ecosystem.snapshot.playTab.rule}`,
    `Rank tab rule: ${contract.ecosystem.snapshot.rankTab.rule}; ${contract.ecosystem.snapshot.rankTab.safetyRule}`,
    `Reward tab rule: ${contract.ecosystem.snapshot.rewardTab.rule}`,
    `Gamification metadata: XP=${contract.ecosystem.snapshot.gamification.xp}; Stars=${contract.ecosystem.snapshot.gamification.stars}; Unlockables=${contract.ecosystem.snapshot.gamification.unlockables.join(", ")}.`,
    `Progression metadata: unlock=${contract.ecosystem.snapshot.progression.unlockRequirements.join(" ")} mastery=${contract.ecosystem.snapshot.progression.masteryRequirements.join(" ")}`,
    `AI curation workflow: ${contract.ecosystem.snapshot.aiCuration.workflow.join(" -> ")}.`,
    `Admin monitoring reports: ${contract.ecosystem.snapshot.adminMonitoring.reports.join(", ")}.`,
    `Firestore structures required: ${contract.ecosystem.firestoreCollections
      .map((collection) => `${collection.collection}(${collection.requiredFields.join(", ")})`)
      .join("; ")}.`,
    `Production API Firestore collections: ${BATIBOT_API_FIRESTORE_COLLECTIONS
      .map((collection) => `${collection.collection}(${collection.requiredFields.join(", ")})`)
      .join("; ")}.`,
    `Publishing rules: ${contract.ecosystem.snapshot.publishingRules.join(" ")}`,
    `Admin prompt modules: ${contract.adminPromptModules
      .map((module) => `${module.title}: ${module.prompt}`)
      .join(" ")}`,
    `Learner destination: Play > ${contract.playTarget.worldTitle} > ${contract.playTarget.topicTitle} > ${contract.playTarget.phase} > Node ${contract.playTarget.node}.`,
    `Grade: ${contract.playTarget.gradeLevel}.`,
    contract.playTarget.competencyCode
      ? `Competency trace: ${contract.playTarget.competencyCode}; ${contract.playTarget.competencySource}; ${contract.playTarget.competencyObjective}.`
      : "",
    `Required child action: ${contract.selectedPhaseContract.childAction}.`,
    contract.playTarget.kindergartenSupport
      ? `Kindergarten support: audioPrompt=${contract.playTarget.kindergartenSupport.audioPrompt ?? "none"}; oralPrompt=${contract.playTarget.kindergartenSupport.oralPrompt ?? "none"}; patternType=${contract.playTarget.kindergartenSupport.patternType ?? "none"}; countingObjects=${contract.playTarget.kindergartenSupport.countingObjects ?? "none"}; objectMatch=${contract.playTarget.kindergartenSupport.objectMatch ?? "none"}.`
      : "",
    `Phase purpose: ${contract.selectedPhaseContract.purpose}.`,
    `Phase allowed content: ${contract.selectedPhaseContract.allowedContent}.`,
    `Phase prompt rule: ${contract.selectedPhaseContract.promptRule}.`,
    `Phase must not: ${contract.selectedPhaseContract.mustNot.join("; ")}.`,
    `World interface contract: ${contract.worldInterfaceContract.id}; renderer=${contract.worldInterfaceContract.rendererFamily}; frame=${contract.worldInterfaceContract.stageFrame}`,
    `World visual ratio: ${contract.worldInterfaceContract.visualRatio}.`,
    `World format ownership: ${contract.worldInterfaceContract.contentOwner}. Gemini role: ${contract.worldInterfaceContract.geminiRole}`,
    `Selected stage format rule: ${contract.worldInterfaceContract.stageRules[contract.playTarget.phase]}.`,
    `Topic inheritance rule: ${contract.worldInterfaceContract.topicInheritanceRule}.`,
    `World validation rules: ${contract.worldInterfaceContract.validationRules.join("; ")}.`,
    `Known-content-only: ${contract.contentBoundaries.mustUseKnownContentOnly ? "yes" : "no"}.`,
    `Allowed vocabulary: ${contract.contentBoundaries.allowedVocabulary.join(", ") || "none provided"}.`,
    `Asset contract: assetId=${contract.assetContract.assetId || "missing"}; requiresApprovedAsset=${contract.assetContract.requiresApprovedAsset}.`,
    `Mobile UI contract: ${contract.mobileUiContract.primarySurface}; choices=${contract.mobileUiContract.choiceCount}; maxPromptWords=${contract.mobileUiContract.maxPromptWords}; controls=${contract.mobileUiContract.requiredControls.join(", ")}.`,
    `Reward contract: ${contract.rewardContract.expectedXp} XP; ${contract.rewardContract.rewardMapping}.`,
    `Validation gates: ${contract.validationGates.join(" ")}`,
    `Gemini output rules: ${contract.geminiOutputRules.join(" ")}`,
  ].filter(Boolean).join("\n");
}

export function buildCurriculumDraftApiPayload(input: GenerateQuizDraftInput) {
  const curriculumContract = buildBatiBotCurriculumDraftApiContract(input);

  return {
    ...input,
    curriculumContract,
  };
}
