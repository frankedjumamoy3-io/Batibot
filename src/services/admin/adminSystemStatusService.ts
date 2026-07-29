import { getGeminiQuizDraftEndpoint } from "@/src/infrastructure/gemini/quiz-draft-client";

export type AdminSystemStatus = {
  geminiConfigured: boolean;
};

export function getAdminSystemStatus(): AdminSystemStatus {
  return {
    geminiConfigured: Boolean(getGeminiQuizDraftEndpoint()),
  };
}
