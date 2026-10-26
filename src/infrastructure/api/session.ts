import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { apiRequest, ApiRequestError } from "./client";
import type { LearnerGradeLevel } from "@/src/types/user";

interface BackendUser { id: string; email: string; displayName: string; gradeLevel?: LearnerGradeLevel | null; role: "admin" | "tester" | "learner" }
interface Session { accessToken: string; refreshToken: string; accessTokenExpiresInSeconds: number; user: BackendUser; expiresAt?: number }
const KEY = "batibot.api.admin.session";
let session: Session | null = null;
let restoring: Promise<void> | undefined;
let refreshing: Promise<Session> | undefined;
let generation = 0;
const listeners = new Set<(user: BackendUser | null) => void>();
const emit = () => listeners.forEach(listener => listener(session?.user ?? null));

async function persist(next: Session | null) {
  if (Platform.OS !== "web") {
    if (next) await SecureStore.setItemAsync(KEY, JSON.stringify(next));
    else await SecureStore.deleteItemAsync(KEY);
  } else if (typeof window !== "undefined") {
    if (next) window.sessionStorage.setItem(KEY, JSON.stringify(next));
    else window.sessionStorage.removeItem(KEY);
  }
  session = next;
  emit();
}
export function observeApiSession(listener: (user: BackendUser | null) => void) {
  listeners.add(listener);
  listener(session?.user ?? null);
  return () => { listeners.delete(listener); };
}
export async function restoreApiSession() {
  const startedGeneration = generation;
  restoring ??= (async () => {
    {
      const stored = Platform.OS !== "web" ? await SecureStore.getItemAsync(KEY)
        : typeof window !== "undefined" ? window.sessionStorage.getItem(KEY) : null;
      if (stored) {
        const value = JSON.parse(stored) as Session;
        if (startedGeneration === generation && typeof value.refreshToken === "string" && value.user?.id) session = value;
      }
    }
  })();
  await restoring;
  if (startedGeneration !== generation) return session?.user ?? null;
  if (!session) return null;
  if (session.user.role === "learner") emit();
  try {
    const token = await getApiAccessToken();
    const { user } = await apiRequest<{ user: BackendUser }>("/auth/me", { token });
    if (startedGeneration !== generation) return session?.user ?? null;
    session = { ...session!, user }; emit(); return user;
  } catch (error) {
    if (startedGeneration !== generation) return session?.user ?? null;
    if (error instanceof ApiRequestError && error.status === 401) { await persist(null); return null; }
    // Previously authenticated learners can keep learning offline. Privileged screens stay online-only.
    if (session?.user.role === "learner") { emit(); return session.user; }
    return null;
  }
}
export async function loginApi(email: string, password: string, requiredRole: "admin" | "learner" = "admin", beforePublish?: (id: string) => Promise<void>) {
  const next = await apiRequest<Session>("/auth/login", { method: "POST", body: { email: email.trim().toLowerCase(), password } });
  if (next.user.role !== requiredRole) {
    await apiRequest("/auth/logout", { method: "POST", body: { refreshToken: next.refreshToken } });
    throw new ApiRequestError(403, "FORBIDDEN");
  }
  generation++;
  await beforePublish?.(next.user.id);
  await persist({ ...next, expiresAt: Date.now() + next.accessTokenExpiresInSeconds * 1000 });
  return next.user;
}
export async function registerLearnerApi(input: { email: string; password: string; displayName: string; gradeLevel: LearnerGradeLevel }, beforePublish?: (id: string) => Promise<void>) {
  const next = await apiRequest<Session>("/auth/register", { method: "POST", body: { ...input, email: input.email.trim().toLowerCase() } });
  generation++;
  await beforePublish?.(next.user.id);
  await persist({ ...next, expiresAt: Date.now() + next.accessTokenExpiresInSeconds * 1000 });
  return next.user;
}
export async function getApiAccessToken(forceRefresh = false): Promise<string> {
  if (!session) throw new ApiRequestError(401, "AUTH_REQUIRED");
  if (!forceRefresh && (session.expiresAt ?? 0) > Date.now() + 30000) return session.accessToken;
  const capturedGeneration = generation;
  refreshing ??= apiRequest<Session>("/auth/refresh", { method: "POST", body: { refreshToken: session.refreshToken } }).then(async next => {
    if (capturedGeneration !== generation) throw new ApiRequestError(401, "AUTH_REQUIRED");
    await persist({ ...next, expiresAt: Date.now() + next.accessTokenExpiresInSeconds * 1000 });
    return next;
  }).catch(async error => {
    if (capturedGeneration === generation && error instanceof ApiRequestError && error.status === 401) await persist(null);
    throw error;
  }).finally(() => { refreshing = undefined; });
  return (await refreshing).accessToken;
}
export async function logoutApi() {
  const previous = session;
  generation++;
  await persist(null);
  if (previous) void apiRequest("/auth/logout", { method: "POST", body: { refreshToken: previous.refreshToken } }).catch(() => undefined);
}
export async function authenticatedRequest<T>(path: string, method = "GET", body?: unknown, options: { timeoutMs?: number; signal?: AbortSignal; expectedUserId?: string } = {}): Promise<T> {
  const requestGeneration = generation;
  if (options.expectedUserId && session?.user.id !== options.expectedUserId) throw new ApiRequestError(401, "AUTH_REQUIRED");
  const token = await getApiAccessToken();
  if (generation !== requestGeneration) throw new ApiRequestError(401, "AUTH_REQUIRED");
  try { return await apiRequest<T>(path, { ...options, method, body, token }); }
  catch (error) {
    if (!(error instanceof ApiRequestError) || error.status !== 401) throw error;
    if (generation !== requestGeneration) throw new ApiRequestError(401, "AUTH_REQUIRED");
    return apiRequest<T>(path, { ...options, method, body, token: await getApiAccessToken(true) });
  }
}
