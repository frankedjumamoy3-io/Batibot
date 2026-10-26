import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  clearLearnerSession,
  saveLearnerSession,
} from "@/src/data/repositories/learner-session-repository";
import { auth } from "@/src/config/firebase";
import { USE_NODE_BACKEND } from "@/src/config/backend";
import { loginApi, logoutApi, registerLearnerApi } from "@/src/infrastructure/api/session";
import { ensureUserProfile } from "@/src/data/repositories/user-profile-repository";
import type { LearnerGradeLevel } from "@/src/types/user";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import { getLearnerProgressStorageKey, loadLocalLearnerProgress, saveLocalLearnerProgress } from "./learner-progress-repository";
import { mergeLearnerProgress } from "@/src/domain/usecases/learner-progress/merge-progress";
import { getPersistableLearnerProgress } from "@/src/domain/usecases/learner-progress/progress-state";

interface EmailPasswordCredentials {
  localProgress?: LearnerProgressState;
  email: string;
  password: string;
}

function importDeviceProgress(progress?: LearnerProgressState) {
  return async (uid: string) => {
    if (progress && !progress.isTestAccount) {
      const key = getLearnerProgressStorageKey(uid);
      const existing = await loadLocalLearnerProgress(key);
      await saveLocalLearnerProgress(key, getPersistableLearnerProgress(mergeLearnerProgress(progress, existing)));
    }
    await clearLearnerSession();
  };
}

interface SignUpInput extends EmailPasswordCredentials {
  displayName: string;
  gradeLevel: LearnerGradeLevel;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loginWithEmail({
  email,
  password,
}: EmailPasswordCredentials) {
  if (USE_NODE_BACKEND) return { user: await loginApi(email, password) };
  const credentials = await signInWithEmailAndPassword(
    auth,
    normalizeEmail(email),
    password
  );

  await ensureUserProfile(credentials.user, { trackLogin: true });
  return credentials;
}

export async function loginWithLearnerProfile({
  displayName,
  gradeLevel,
}: {
  displayName: string;
  gradeLevel: LearnerGradeLevel;
}) {
  return saveLearnerSession({
    username: displayName,
    gradeLevel,
  });
}

export async function signupWithEmail({
  email,
  password,
  displayName,
  gradeLevel,
  localProgress,
}: SignUpInput) {
  if (USE_NODE_BACKEND) return { user: await registerLearnerApi({ email, password, displayName, gradeLevel }, importDeviceProgress(localProgress)) };
  const credentials = await createUserWithEmailAndPassword(
    auth,
    normalizeEmail(email),
    password
  );

  const trimmedDisplayName = displayName.trim();

  if (trimmedDisplayName) {
    await updateProfile(credentials.user, {
      displayName: trimmedDisplayName,
    });
  }

  await ensureUserProfile(
    {
      uid: credentials.user.uid,
      email: credentials.user.email,
      displayName: trimmedDisplayName || credentials.user.displayName,
    },
    { gradeLevel, trackLogin: true }
  );

  return credentials;
}

export async function loginLearnerOnline(input: EmailPasswordCredentials) {
  if (USE_NODE_BACKEND) return { user: await loginApi(input.email, input.password, "learner", importDeviceProgress(input.localProgress)) };
  return loginWithEmail(input);
}

export async function requestPasswordReset(email: string) {
  if (USE_NODE_BACKEND) throw new Error("Please contact the project owner to reset this administrator account.");
  await sendPasswordResetEmail(auth, normalizeEmail(email));
}

export async function logoutCurrentUser() {
  await clearLearnerSession();
  if (USE_NODE_BACKEND) return logoutApi();
  await signOut(auth);
}
