import { useAuthSession } from "@/src/store/auth-session";
import type {
  AuthSessionState,
  AuthSessionUser,
} from "@/src/store/auth-session";
import type { UserProfile } from "@/src/types/user";

interface CurrentUserProfileState
  extends Pick<AuthSessionState, "endSession" | "startLearnerSession"> {
  loading: boolean;
  profile: UserProfile | null;
  user: AuthSessionUser | null;
}

export function useCurrentUserProfile(): CurrentUserProfileState {
  return useAuthSession();
}
