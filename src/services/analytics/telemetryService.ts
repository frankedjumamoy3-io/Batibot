import AsyncStorage from "@react-native-async-storage/async-storage";

export type TelemetryEventType =
  | "lesson_start"
  | "lesson_complete"
  | "stage_complete"
  | "stage_fail"
  | "quiz_attempt"
  | "quiz_complete"
  | "app_open"
  | "app_error";

export interface TelemetryEvent {
  data?: Record<string, unknown>;
  id: string;
  timestamp: string;
  type: TelemetryEventType;
}

export interface TelemetrySummary {
  averageScore: number;
  completedLessons: number;
  errorCount: number;
  lastActive: string | null;
  quizAttempts: number;
  totalEvents: number;
}

const STORAGE_KEY = "@batibot_telemetry_events_v1";
const MAX_EVENTS = 120;

export async function trackEvent(
  type: TelemetryEventType,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    const event: TelemetryEvent = {
      data,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
    };

    const existingJson = await AsyncStorage.getItem(STORAGE_KEY);
    const events: TelemetryEvent[] = existingJson ? JSON.parse(existingJson) : [];
    events.unshift(event);

    if (events.length > MAX_EVENTS) {
      events.length = MAX_EVENTS;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Non-blocking telemetry tracking
  }
}

export async function getRecentTelemetryEvents(limit = 40): Promise<TelemetryEvent[]> {
  try {
    const existingJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!existingJson) return [];
    const events: TelemetryEvent[] = JSON.parse(existingJson);
    return events.slice(0, limit);
  } catch {
    return [];
  }
}

export async function getTelemetrySummary(): Promise<TelemetrySummary> {
  try {
    const events = await getRecentTelemetryEvents(MAX_EVENTS);
    let completedLessons = 0;
    let quizAttempts = 0;
    let errorCount = 0;
    let totalScore = 0;
    let scoredQuizzes = 0;

    for (const event of events) {
      if (event.type === "lesson_complete") completedLessons++;
      if (event.type === "app_error" || event.type === "stage_fail") errorCount++;
      if (event.type === "quiz_attempt" || event.type === "quiz_complete") {
        quizAttempts++;
        if (typeof event.data?.percentage === "number") {
          totalScore += event.data.percentage;
          scoredQuizzes++;
        }
      }
    }

    return {
      averageScore: scoredQuizzes > 0 ? Math.round(totalScore / scoredQuizzes) : 100,
      completedLessons,
      errorCount,
      lastActive: events[0]?.timestamp ?? null,
      quizAttempts,
      totalEvents: events.length,
    };
  } catch {
    return {
      averageScore: 100,
      completedLessons: 0,
      errorCount: 0,
      lastActive: null,
      quizAttempts: 0,
      totalEvents: 0,
    };
  }
}

export async function clearTelemetryEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-blocking
  }
}
