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
import { loginApi, logoutApi } from "@/src/infrastructure/api/session";
import { ensureUserProfile } from "@/src/data/repositories/user-profile-repository";
import type { LearnerGradeLevel } from "@/src/types/user";

interface EmailPasswordCredentials {
  email: string;
  password: string;
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
}: SignUpInput) {
  if (USE_NODE_BACKEND) throw new Error("Administrator accounts must be provisioned by the project owner.");
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

export async function requestPasswordReset(email: string) {
  if (USE_NODE_BACKEND) throw new Error("Please contact the project owner to reset this administrator account.");
  await sendPasswordResetEmail(auth, normalizeEmail(email));
}

export async function logoutCurrentUser() {
  await clearLearnerSession();
  if (USE_NODE_BACKEND) return logoutApi();
  await signOut(auth);
}
