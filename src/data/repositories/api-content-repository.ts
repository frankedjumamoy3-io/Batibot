import { Timestamp } from "firebase/firestore";
import { authenticatedRequest } from "@/src/infrastructure/api/session";
import type { AdminContentDraft, PublishedContentRecord } from "@/src/services/admin/adminContentDraftService";

type Wire<T> = Omit<T, "createdAt" | "updatedAt" | "publishedAt"> & { createdAt?: string; updatedAt?: string; publishedAt?: string | null };
function timestamp(value?: string | null) { return value ? Timestamp.fromDate(new Date(value)) : null; }
function draftFromApi(value: Wire<AdminContentDraft>): AdminContentDraft {
  return { ...value, createdAt: timestamp(value.createdAt), updatedAt: timestamp(value.updatedAt), publishedAt: timestamp(value.publishedAt) };
}
function publishedFromApi(value: Wire<PublishedContentRecord>): PublishedContentRecord {
  return { ...value, publishedAt: timestamp(value.publishedAt) };
}
async function listAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let offset: number | null = 0;
  while (offset !== null) {
    const page: { items: T[]; nextOffset: number | null } = await authenticatedRequest(`${path}?limit=100&offset=${offset}`);
    items.push(...page.items);
    if (page.nextOffset !== null && page.nextOffset <= offset) throw new Error("Invalid draft pagination.");
    offset = page.nextOffset;
  }
  return items;
}
export async function getApiContentDraft(id: string) { return draftFromApi(await authenticatedRequest(`/admin/content-drafts/${encodeURIComponent(id)}`)); }
export async function listApiContentDrafts() { return (await listAll<Wire<AdminContentDraft>>("/admin/content-drafts")).map(draftFromApi); }
export async function saveApiContentDraft(draft: unknown, id?: string) {
  return draftFromApi(await authenticatedRequest(`/admin/content-drafts${id ? `/${encodeURIComponent(id)}` : ""}`, id ? "PATCH" : "POST", draft));
}
export async function publishApiContentDraft(id: string) {
  return publishedFromApi(await authenticatedRequest(`/admin/content-drafts/${encodeURIComponent(id)}/publish`, "POST"));
}
export async function listApiPublishedContent() { return (await listAll<Wire<PublishedContentRecord>>("/admin/published-content")).map(publishedFromApi); }
