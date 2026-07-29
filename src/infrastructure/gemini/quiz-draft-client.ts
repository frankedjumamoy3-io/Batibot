const DEFAULT_GEMINI_QUIZ_ENDPOINT =
  "https://us-central1-batibot-app-e3cc9.cloudfunctions.net/generateQuizDraft";

export function getGeminiQuizDraftEndpoint() {
  return process.env.EXPO_PUBLIC_GEMINI_QUIZ_ENDPOINT || DEFAULT_GEMINI_QUIZ_ENDPOINT;
}

export async function requestGeminiQuizDraft({
  body,
  token,
}: {
  body: unknown;
  token: string | null;
}) {
  return fetch(getGeminiQuizDraftEndpoint(), {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
