import { isAllowedAdminEmail } from "@/src/config/admin";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { isAdminProfile } from "@/src/data/repositories/user-profile-repository";
import type { UserProfile } from "@/src/types/user";

export function canAccessAdminRoute(profile: UserProfile | null | undefined) {
  if (!profile) {
    return false;
  }

  return isAdminProfile(profile) && (USE_NODE_BACKEND || isAllowedAdminEmail(profile.email));
}

export function requireAdmin(profile: UserProfile | null | undefined) {
  if (!canAccessAdminRoute(profile)) {
    throw new Error("Admin access is required for this action.");
  }
}
