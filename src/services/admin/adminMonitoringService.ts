import { API_BASE_URL, USE_NODE_BACKEND } from "@/src/config/backend";
import { authenticatedRequest } from "@/src/infrastructure/api/session";

export interface BackendMonitoringData {
  database: {
    latencyMs: number;
    status: string;
  };
  environment: string;
  memory: {
    externalBytes: number;
    heapTotalBytes: number;
    heapUsedBytes: number;
    rssBytes: number;
  };
  nodeVersion: string;
  quizzes: {
    archivedQuizzes: number;
    draftQuizzes: number;
    publishedQuizzes: number;
    totalActivityLogs: number;
    totalAttempts: number;
    totalQuizzes: number;
  };
  status: string;
  timestamp: string;
  uptimeSeconds: number;
}

export interface ClientMonitoringHealth {
  apiConfigured: boolean;
  apiOrigin: string;
  backendLive: boolean;
  checkTimestamp: string;
  data: BackendMonitoringData | null;
  errorMessage: string | null;
  latencyMs: number;
}

export async function checkSystemMonitoringHealth(): Promise<ClientMonitoringHealth> {
  const origin = API_BASE_URL;
  const configured = Boolean(USE_NODE_BACKEND && origin);

  if (!configured) {
    return {
      apiConfigured: false,
      apiOrigin: origin || "None (Offline Local Mode)",
      backendLive: false,
      checkTimestamp: new Date().toISOString(),
      data: null,
      errorMessage: "Backend API is not configured. Running in offline bundle mode.",
      latencyMs: 0,
    };
  }

  const start = Date.now();
  try {
    const data = await authenticatedRequest<BackendMonitoringData>("/admin/monitoring");
    const latencyMs = Math.max(1, Date.now() - start);

    return {
      apiConfigured: true,
      apiOrigin: origin,
      backendLive: true,
      checkTimestamp: new Date().toISOString(),
      data,
      errorMessage: null,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - start;
    const message = error instanceof Error ? error.message : "Unable to reach server.";

    return {
      apiConfigured: true,
      apiOrigin: origin,
      backendLive: false,
      checkTimestamp: new Date().toISOString(),
      data: null,
      errorMessage: message,
      latencyMs,
    };
  }
}
