import type { LearnerProgressState, LearnerStageId } from "@/src/domain/entities/learner-progress";

export interface LessonCheckpoint {
  topicId: string;
  worldId: string;
  savedAt: string;
  stepIndex: number;
  interactNodeIndex: number;
  challengeNodeIndex: number;
  challengeCompletedNodes: boolean[];
  challengeCorrectNodes: boolean[];
  challengeSelectedAnswers: (string | null)[];
  exploreTapped: boolean;
  interactImageTapped: boolean;
  interactWordTapped: boolean;
  interactListenTapped: boolean;
  practiceAnswer: "correct" | "wrong" | null;
}

export const LESSON_STAGES: LearnerStageId[] = [
  "discover", "explore", "interact", "practice", "challenge", "reward", "progress", "mastery",
];

export function sanitizeLessonCheckpoints(raw: unknown): Record<string, LessonCheckpoint> {
  if (!raw || typeof raw !== "object") return {};
  const result: Record<string, LessonCheckpoint> = {};
  for (const [key, value] of Object.entries(raw)) {
    const item = value as Partial<LessonCheckpoint> | null;
    if (!item || item.topicId !== key || typeof item.worldId !== "string" ||
        typeof item.savedAt !== "string" || !Number.isFinite(Date.parse(item.savedAt)) ||
        !Number.isInteger(item.stepIndex) || item.stepIndex! < 0 || item.stepIndex! > 7) continue;
    const index = (n: unknown) => typeof n === "number" && Number.isInteger(n) ? Math.max(0, Math.min(99, n)) : 0;
    result[key] = {
      topicId: key, worldId: item.worldId, savedAt: item.savedAt, stepIndex: item.stepIndex!,
      interactNodeIndex: index(item.interactNodeIndex), challengeNodeIndex: index(item.challengeNodeIndex),
      challengeCompletedNodes: Array.isArray(item.challengeCompletedNodes) ? item.challengeCompletedNodes.slice(0, 100).map(v => v === true) : [],
      challengeCorrectNodes: Array.isArray(item.challengeCorrectNodes) ? item.challengeCorrectNodes.slice(0, 100).map(v => v === true) : [],
      challengeSelectedAnswers: Array.isArray(item.challengeSelectedAnswers) ? item.challengeSelectedAnswers.slice(0, 100).map(v => typeof v === "string" ? v : null) : [],
      exploreTapped: item.exploreTapped === true, interactImageTapped: item.interactImageTapped === true,
      interactWordTapped: item.interactWordTapped === true, interactListenTapped: item.interactListenTapped === true,
      practiceAnswer: item.practiceAnswer === "correct" || item.practiceAnswer === "wrong" ? item.practiceAnswer : null,
    };
  }
  return result;
}

export function getLessonResumeStep(progress: LearnerProgressState, topicId: string) {
  const checkpoint = progress.lessonCheckpoints[topicId];
  const completed = progress.completedStagesByTopic[topicId]?.completedStages ?? [];
  const next = LESSON_STAGES.findIndex(stage => !completed.includes(stage));
  if (checkpoint && !(progress.masteredTopics[topicId] && checkpoint.stepIndex === 7)) {
    // A stage completion may have reached disk just before its next checkpoint.
    if (!progress.masteredTopics[topicId] && completed.includes(LESSON_STAGES[checkpoint.stepIndex]) && next > checkpoint.stepIndex) return next;
    return checkpoint.stepIndex;
  }
  if (progress.masteredTopics[topicId]) return 0;
  return next < 0 ? 0 : next;
}
