import { USE_NODE_BACKEND } from "@/src/config/backend";
import { authenticatedRequest } from "@/src/infrastructure/api/session";

const DEFAULT_GEMINI_QUIZ_ENDPOINT =
  "https://us-central1-batibot-app-e3cc9.cloudfunctions.net/generateQuizDraft";

export function getGeminiQuizDraftEndpoint() {
  if (USE_NODE_BACKEND) return "";
  return process.env.EXPO_PUBLIC_GEMINI_QUIZ_ENDPOINT || DEFAULT_GEMINI_QUIZ_ENDPOINT;
}

export async function requestGeminiQuizDraft({
  body,
  token,
}: {
  body: unknown;
  token: string | null;
}): Promise<Pick<Response, "ok" | "json">> {
  if (USE_NODE_BACKEND) {
    const isContent = typeof body === "object" && body !== null && "mode" in body && body.mode === "admin-content-draft";
    const payload = await authenticatedRequest(`/admin/ai/${isContent ? "content" : "quizzes"}`, "POST", body, { timeoutMs: 100000 });
    return { ok: true, json: async () => payload };
  }
  return fetch(getGeminiQuizDraftEndpoint(), {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
