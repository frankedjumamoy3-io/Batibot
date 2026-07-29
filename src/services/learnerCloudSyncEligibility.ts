import { auth } from "@/src/config/firebase";
import type { AuthSessionUser } from "@/src/domain/entities/auth-session";
import type { UserProfile } from "@/src/types/user";

export function canSyncLearnerProgressToCloud({
  profile,
  user,
}: {
  profile?: UserProfile | null;
  user?: AuthSessionUser | null;
}) {
  if (!user || user.isLocalLearner === true) {
    return false;
  }

  if (
    user.isTestAccount === true ||
    profile?.isTestAccount === true ||
    user.excludeFromAnalytics === true ||
    profile?.excludeFromAnalytics === true
  ) {
    return false;
  }

  return auth.currentUser?.uid === user.uid;
}
