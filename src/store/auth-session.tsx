import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { auth, db } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { getApiAccessToken, logoutApi, observeApiSession, restoreApiSession } from "@/src/infrastructure/api/session";
import {
  createFallbackUserProfile,
  mapUserProfile,
} from "@/src/data/repositories/user-profile-repository";
import {
  loadLearnerSession,
  saveLearnerSession,
} from "@/src/data/repositories/learner-session-repository";
import { logoutCurrentUser } from "@/src/data/repositories/auth-repository";
import type {
  AuthSessionUser,
  LearnerSessionInput,
} from "@/src/domain/entities/auth-session";
import type { UserProfile } from "@/src/types/user";

export type { AuthSessionUser, LearnerSessionInput };

export interface AuthSessionState {
  endSession: () => Promise<void>;
  loading: boolean;
  profile: UserProfile | null;
  startLearnerSession: (input: LearnerSessionInput) => Promise<void>;
  user: AuthSessionUser | null;
}

type InternalAuthSessionState = Omit<
  AuthSessionState,
  "endSession" | "startLearnerSession"
>;

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const sessionRevision = useRef(0);
  const [state, setState] = useState<InternalAuthSessionState>({
    loading: true,
    profile: null,
    user: null,
  });

  useEffect(() => {
    if (USE_NODE_BACKEND) {
      let active = true;
      const stop = observeApiSession((account) => {
        const currentRevision = ++sessionRevision.current;
        if (account) {
          const user: AuthSessionUser = { uid: account.id, email: account.email, displayName: account.displayName, photoURL: null, getIdToken: getApiAccessToken };
          setState({ loading: false, user, profile: { ...createFallbackUserProfile(user), role: account.role } });
        } else {
          void loadLearnerSession().then(session => {
            if (active && currentRevision === sessionRevision.current) setState({ loading: false, user: session?.user ?? null, profile: session?.profile ?? null });
          }).catch(() => { if (active && currentRevision === sessionRevision.current) setState({ loading: false, user: null, profile: null }); });
        }
      });
      void restoreApiSession().catch(() => undefined);
      return () => { active = false; stop(); };
    }
    let stopProfileListener: (() => void) | undefined;
    const authFallbackTimer = setTimeout(() => {
      setState((current) =>
        current.loading
          ? {
              loading: false,
              profile: current.profile,
              user: current.user,
            }
          : current
      );
    }, 8000);

    const stopAuthListener = onAuthStateChanged(auth, (user) => {
      clearTimeout(authFallbackTimer);
      stopProfileListener?.();
      stopProfileListener = undefined;

      if (!user || user.isAnonymous) {
        void loadLearnerSession()
          .then((session) => {
            setState({
              loading: false,
              profile: session?.profile ?? null,
              user: session?.user ?? null,
            });
          })
          .catch(() => {
            setState({
              loading: false,
              profile: null,
              user: null,
            });
          });
        return;
      }

      const fallbackProfile = createFallbackUserProfile(user);

      setState({
        loading: false,
        profile: fallbackProfile,
        user,
      });

      stopProfileListener = onSnapshot(
        doc(db, "users", user.uid),
        (snapshot) => {
          setState({
            loading: false,
            profile: snapshot.exists()
              ? mapUserProfile(user, snapshot.data())
              : fallbackProfile,
            user,
          });
        },
        () => {
          setState({
            loading: false,
            profile: fallbackProfile,
            user,
          });
        }
      );
    });

    return () => {
      clearTimeout(authFallbackTimer);
      stopAuthListener();
      stopProfileListener?.();
    };
  }, []);

  const value = useMemo<AuthSessionState>(
    () => ({
      ...state,
      endSession: async () => {
        await logoutCurrentUser();
        sessionRevision.current++;
        setState({
          loading: false,
          profile: null,
          user: null,
        });
      },
      startLearnerSession: async (input) => {
        if (USE_NODE_BACKEND) await logoutApi();
        sessionRevision.current++;
        const session = await saveLearnerSession(input);
        setState({
          loading: false,
          profile: session.profile,
          user: session.user,
        });
      },
    }),
    [state]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
