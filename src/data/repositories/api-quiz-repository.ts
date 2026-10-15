import { apiRequest } from "@/src/infrastructure/api/client";
import { authenticatedRequest } from "@/src/infrastructure/api/session";
import type { CuratedQuiz, CuratedQuizDraft } from "@/src/types/quiz";
import type { AdminActivityLog } from "@/src/services/adminQuizService";

interface Page<T> { items: T[]; nextOffset: number | null }
export async function listApiQuizzes(admin: boolean, signal?: AbortSignal) {
  const quizzes: CuratedQuiz[] = [];
  let offset: number | null = 0;
  // Bounded pagination avoids unbounded startup work.
  for (let page = 0; page < 10 && offset !== null; page++) {
    const path = `${admin ? "/admin" : ""}/quizzes?limit=100&offset=${offset}`;
    const result: Page<CuratedQuiz> = admin ? await authenticatedRequest(path) : await apiRequest(path, { signal });
    if (!Array.isArray(result.items)) throw new Error("We could not load quizzes. Please try again.");
    quizzes.push(...result.items);
    offset = result.nextOffset;
  }
  return quizzes;
}
export const getApiQuiz = (id: string) => authenticatedRequest<CuratedQuiz>(`/admin/quizzes/${encodeURIComponent(id)}`);
export async function saveApiQuiz(draft: Partial<CuratedQuizDraft> & { status?: string }, id?: string) {
  return authenticatedRequest<CuratedQuiz>(`/admin/quizzes${id ? `/${encodeURIComponent(id)}` : ""}`, id ? "PATCH" : "POST", {
    ...draft,
    ...(draft.learnerLevel ? { gradeLevel: draft.gradeLevel ?? draft.learnerLevel } : {}),
  });
}
export const deleteApiQuiz = (id: string) => authenticatedRequest(`/admin/quizzes/${encodeURIComponent(id)}`, "DELETE");
export async function getApiActivity(maxCount: number) {
  return (await authenticatedRequest<Page<AdminActivityLog>>(`/admin/activity-logs?limit=${Math.max(1, Math.min(100, maxCount))}`)).items;
}
