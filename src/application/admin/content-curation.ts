import type { UserProfile } from "@/src/types/user";
import type { CreateTopicDraftInput } from "@/src/domain/admin/topic-draft";
import { requireAdmin } from "@/src/services/adminAccessService";
import { createTopicDraft } from "@/src/services/admin/adminTopicDraftService";

export async function beginTopicCreation(
  input: CreateTopicDraftInput,
  profile: UserProfile | null | undefined
) {
  requireAdmin(profile);

  if (!input.gradeLevel.trim() || !input.worldId.trim() || !input.topicTitle.trim()) {
    throw new Error("Grade, world, and topic title are required.");
  }

  return createTopicDraft(input, profile);
}
