import {
  getAllBatiBotTopicContent,
  validateBatiBotTopicContent,
  type BatiBotTopicContent,
  type FrameworkStageContent,
} from "@/src/data/curriculum/learning-path";
import {
  isAllowedChoiceCount,
  normalizeActivityConcept,
  validateActivityCorrectAnswer,
} from "@/src/domain/rules/activity-integrity-rules";
import { resolveAsset } from "@/src/services/assets/assetResolver";

export type PublishedCurriculumIssue = {
  code:
    | "answer-integrity"
    | "empty-activity"
    | "forbidden-learner-text"
    | "invalid-image-reference"
    | "missing-fallback";
  message: string;
  topic: string;
  stage?: string;
};

const FORBIDDEN_LEARNER_TEXT =
  /activity updating|image being added|coming soon|asset missing|placeholder|under construction|content unavailable|developer preview|draft content|awaiting asset|pending upload/i;

function getStageLearnerText(stage: FrameworkStageContent) {
  return [
    stage.content,
    stage.feedback,
    stage.instruction,
    stage.learnerAction,
    stage.purpose,
    stage.questionText,
    stage.teachingScript,
    stage.uiBehavior,
    ...(stage.visualContent ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function validatePublishedCurriculum(
  contents: BatiBotTopicContent[] = getAllBatiBotTopicContent()
) {
  const issues: PublishedCurriculumIssue[] = [];

  contents.forEach((content) => {
    validateBatiBotTopicContent(content)
      .filter((issue) => issue.severity === "critical")
      .forEach((issue) => {
        issues.push({
          code: "answer-integrity",
          message: issue.issue,
          stage: issue.stage,
          topic: content.topic,
        });
      });

    content.frameworkStages.forEach((stage) => {
      const learnerText = getStageLearnerText(stage);

      if (!stage.instruction?.trim() || !stage.content?.trim() || !stage.learnerAction?.trim()) {
        issues.push({
          code: "empty-activity",
          message: "Activity needs instruction, content, and one clear learner action.",
          stage: stage.stage,
          topic: content.topic,
        });
      }

      if (FORBIDDEN_LEARNER_TEXT.test(learnerText)) {
        issues.push({
          code: "forbidden-learner-text",
          message: "Learner copy contains an internal asset or development status.",
          stage: stage.stage,
          topic: content.topic,
        });
      }

      if (["TAP", "TRY", "CHOOSE"].includes(stage.stage) && stage.choices?.length) {
        const integrity = validateActivityCorrectAnswer({
          choices: stage.choices,
          correctAnswer: stage.correctAnswer,
          correctAssetConcept: stage.correctAssetConcept,
          targetConcept: stage.targetConcept ?? stage.correctAnswer,
        });

        integrity.issues.forEach((message) => {
          issues.push({
            code: "answer-integrity",
            message,
            stage: stage.stage,
            topic: content.topic,
          });
        });

        if (!isAllowedChoiceCount(stage.choices.length)) {
          issues.push({
            code: "answer-integrity",
            message: `${stage.stage} choices must render exactly 2 or 4 answers.`,
            stage: stage.stage,
            topic: content.topic,
          });
        }
      }

      if (
        stage.targetConcept &&
        stage.correctAssetConcept &&
        normalizeActivityConcept(stage.targetConcept) !==
          normalizeActivityConcept(stage.correctAssetConcept)
      ) {
        issues.push({
          code: "invalid-image-reference",
          message: "Activity visual does not match its target concept.",
          stage: stage.stage,
          topic: content.topic,
        });
      }

      const slotByStage: Partial<Record<FrameworkStageContent["stage"], string>> = {
        CHOOSE: content.chooseAssetSlot,
        LOOK: content.lookAssetSlot,
        PLAY: content.playAssetSlot,
        MASTERED: content.masteryAssetSlot,
        STAR: content.rewardAssetSlot,
        TAP: content.tapAssetSlot,
        TRY: content.tryAssetSlot,
      };
      const assetId = slotByStage[stage.stage] ?? content.topicAssetSlot;
      const resolvedAsset = resolveAsset(assetId);

      if (!resolvedAsset.iconName && !resolvedAsset.localSource) {
        issues.push({
          code: "missing-fallback",
          message: "Activity has no final visual, curriculum visual, or educational fallback.",
          stage: stage.stage,
          topic: content.topic,
        });
      }

      if (resolvedAsset.localSource && !resolvedAsset.altText.trim()) {
        issues.push({
          code: "invalid-image-reference",
          message: "Resolved image needs learner-safe alternative text.",
          stage: stage.stage,
          topic: content.topic,
        });
      }
    });
  });

  return {
    issueCount: issues.length,
    issues,
    valid: issues.length === 0,
  };
}
