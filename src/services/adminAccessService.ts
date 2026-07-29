import { isAllowedAdminEmail } from "@/src/config/admin";
import { isAdminProfile } from "@/src/data/repositories/user-profile-repository";
import type { UserProfile } from "@/src/types/user";

export function canAccessAdminRoute(profile: UserProfile | null | undefined) {
  if (!profile) {
    return false;
  }

  return isAdminProfile(profile) && isAllowedAdminEmail(profile.email);
}

export function requireAdmin(profile: UserProfile | null | undefined) {
  if (!canAccessAdminRoute(profile)) {
    throw new Error("Admin access is required for this action.");
  }
}
