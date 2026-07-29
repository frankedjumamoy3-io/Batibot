import type { User } from "firebase/auth";

import {
  generateAIQuizDraft,
  validateQuizBeforePublish,
} from "@/src/services/adminQuizService";
import {
  buildBatiBotCurriculumDraftApiContract,
  buildCurriculumDraftApiPayload,
} from "@/src/services/curriculumDraftApi";
import {
  validateAdminPlayContentForPublish,
  type AdminPublishIssue,
} from "@/src/domain/rules/admin-publish-rules";
import type {
  CuratedQuiz,
  CuratedQuizDraft,
  GenerateQuizDraftInput,
} from "@/src/types/quiz";

export type PlayContentDraftResult = {
  apiContract: ReturnType<typeof buildBatiBotCurriculumDraftApiContract>;
  draft: CuratedQuizDraft;
  publishIssues: AdminPublishIssue[];
};

export async function generatePlayContentDraft(
  input: GenerateQuizDraftInput,
  user?: Pick<User, "getIdToken">
): Promise<PlayContentDraftResult> {
  const apiPayload = buildCurriculumDraftApiPayload(input);
  const draft = await generateAIQuizDraft(apiPayload, user);
  const publishIssues = validateAdminPlayContentForPublish({
    ...draft,
    mobilePreviewChecked: false,
  });

  return {
    apiContract: apiPayload.curriculumContract,
    draft,
    publishIssues,
  };
}

export function validatePlayContentDraftForPublish(draft: CuratedQuizDraft | CuratedQuiz) {
  return {
    playIssues: validateAdminPlayContentForPublish(draft),
    quizValidation: validateQuizBeforePublish(draft as CuratedQuiz),
  };
}
