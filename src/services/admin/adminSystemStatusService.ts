import { getGeminiQuizDraftEndpoint } from "@/src/infrastructure/gemini/quiz-draft-client";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { authenticatedRequest } from "@/src/infrastructure/api/session";

export type AdminSystemStatus = {
  aiConfigured: boolean;
  provider: "openai" | "gemini";
  model?: string;
};

export async function getAdminSystemStatus(): Promise<AdminSystemStatus> {
  if (USE_NODE_BACKEND) {
    const status = await authenticatedRequest<{ configured: boolean; model: string }>("/admin/ai/status");
    return { aiConfigured: status.configured, model: status.model, provider: "openai" };
  }
  return {
    aiConfigured: Boolean(getGeminiQuizDraftEndpoint()), provider: "gemini",
  };
}
