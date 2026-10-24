import { API_BASE_URL } from "@/src/config/backend";

export class ApiRequestError extends Error {
  constructor(public readonly status: number, public readonly code: string) {
    super(AI_ERROR_MESSAGES[code] ?? (status === 401 ? "Please sign in again." : status === 400 ? "Please check the draft details and try again." : status === 403 ? "An administrator account is required." : "We could not connect. Please try again."));
  }
}

const AI_ERROR_MESSAGES: Record<string, string> = {
  AI_NOT_CONFIGURED: "AI generation needs an OpenAI API key in the backend hosting secrets.",
  AI_CONFIGURATION_ERROR: "Check the backend OpenAI key and model access.",
  AI_QUOTA_EXCEEDED: "OpenAI quota is unavailable. Try later or check backend billing.",
  AI_RATE_LIMITED: "Please wait a minute before generating another draft.",
  AI_TIMEOUT: "Generation timed out. Try fewer questions.",
  AI_INVALID_OUTPUT: "The generated content failed validation. Adjust your instructions and retry.",
  AI_MEDIA_REQUIRED: "This format needs exact image assets. Choose a text or matching format.",
  AI_UNAVAILABLE: "OpenAI is unavailable. Please retry. No AI draft was created.",
  INVALID_TRANSITION: "Complete the draft review steps before approval or publishing.",
  REVIEW_REQUIRED: "Save the changes as a draft and review them again.",
  VALIDATION_REQUIRED: "Resolve validation errors before approval.",
  DRAFT_PUBLISHED: "Create a new draft to revise published content.",
  CORS_ORIGIN_DENIED: "Configure this admin website origin in the backend CORS settings.",
};

export async function apiRequest<T>(path: string, options: { method?: string; body?: unknown; token?: string; signal?: AbortSignal; timeoutMs?: number } = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiRequestError(0, "API_NOT_CONFIGURED");
  const url = new URL(API_BASE_URL);
  if (url.protocol !== "https:" && !(__DEV__ && ["localhost", "127.0.0.1", "10.0.2.2"].includes(url.hostname))) throw new ApiRequestError(0, "API_INVALID_ORIGIN");
  const method = options.method ?? "GET";
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    options.signal?.addEventListener("abort", abort);
    if (options.signal?.aborted) abort();
    const timer = setTimeout(abort, options.timeoutMs ?? 12000);
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, { method, signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}) },
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new ApiRequestError(response.status, String(payload?.error?.code ?? "REQUEST_FAILED"));
      if (!payload || !("data" in payload)) throw new ApiRequestError(0, "INVALID_RESPONSE");
      return payload.data as T;
    } catch (error) {
      if (method === "GET" && attempt === 0 && !options.signal?.aborted && (!(error instanceof ApiRequestError) || error.status >= 500)) continue;
      throw error instanceof ApiRequestError ? error : new ApiRequestError(0, "NETWORK_UNAVAILABLE");
    } finally { clearTimeout(timer); options.signal?.removeEventListener("abort", abort); }
  }
}
