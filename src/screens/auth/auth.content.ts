import {
  LEARNER_GRADE_LEVELS,
  type LearnerGradeLevel,
} from "@/src/types/user";
import { AVATAR_OPTIONS } from "@/src/data/avatarOptions";

export const AUTH_ALLOWED_GRADE_LEVELS = LEARNER_GRADE_LEVELS;

export const AUTH_AVATAR_OPTIONS = AVATAR_OPTIONS;

export const AUTH_POLICY_DOCUMENTS = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How BatiBot protects local learner profile and progress data.",
    sections: [
      {
        title: "Information we save",
        body:
          "BatiBot saves a local learner profile such as generated profile ID, name, grade level, profile settings, quiz progress, badges, and rewards so learners can continue their activities on this device.",
      },
      {
        title: "How information is used",
        body:
          "Saved information is used to reopen the learner profile, keep progress accurate, unlock learning activities, and personalize grade-appropriate experiences.",
      },
      {
        title: "Safety and access",
        body:
          "Learner data is designed for personal app use on the learner's device. Admin tools are separate and remain behind app-owner role checks.",
      },
      {
        title: "Security",
        body:
          "Learner profiles do not require an email or password. App-owner admin access uses Firebase authentication and database rules for protected admin records.",
      },
      {
        title: "AI and content review",
        body:
          "Any future AI-assisted hints or quiz drafts should go through secure backend services and review workflows. Client screens must not expose private API keys or secrets.",
      },
    ],
  },
  policies: {
    title: "App Policies",
    subtitle: "Simple rules for using BatiBot safely and fairly.",
    sections: [
      {
        title: "Learning use",
        body:
          "BatiBot is for child-friendly personal learning in vocabulary, numeracy, quizzes, rewards, and progress tracking. Learners should use their own profile name and grade level.",
      },
      {
        title: "Grade eligibility",
        body:
          "New learner signup is currently available for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 only. Other grade levels cannot complete signup at this time.",
      },
      {
        title: "Account responsibility",
        body:
          "Learners can use BatiBot without an email account. Names are display labels only; each saved learner profile has its own local profile ID so same-name learners can keep separate progress.",
      },
      {
        title: "Progress and rewards",
        body:
          "Quiz scores, badges, rewards, and progress records are saved to support learning. Attempts to falsify progress, misuse admin tools, or bypass role checks are not allowed.",
      },
      {
        title: "Changes",
        body:
          "BatiBot policies may be updated as the learning system grows. Continued use means the user agrees to the current policies shown in the app.",
      },
    ],
  },
} as const;

export const AUTH_SCREEN_COPY = {
  accountType: {
    admin: "Admin",
    adminHint: "Admin access is limited to the approved BatiBot admin account.",
    learner: "Learner",
    title: "Account type",
  },
  forgotPassword: {
    badge: "Admin Password",
    backToLogin: "Back to login",
    button: "Send Reset Link",
    emailLabel: "Email",
    header: "Admin password help",
    resetFailedTitle: "Reset failed",
    shellSubtitle:
      "We'll email the app owner a secure link to choose a new password.",
    shellTitle: "Recover admin access",
    successBody:
      "A reset link has been sent. Check the admin inbox and spam folder, then come back to log in.",
    successTitle: "Email sent",
    supporting:
      "Enter the email connected to the BatiBot admin account.",
  },
  login: {
    badge: "Welcome Back",
    button: "Log In",
    emailLabel: "Email",
    forgotPassword: "Forgot password?",
    header: "Admin account",
    loginFailedTitle: "Login failed",
    passwordLabel: "Password",
    secondaryAction: "New player? Create a local profile",
    shellSubtitle: "Pick up where your learning journey left off.",
    shellTitle: "Sign in to BatiBot",
    supporting:
      "Learners can start with just a name and grade level. Email login is only for app-owner admin tools.",
  },
  signup: {
    badge: "Create Profile",
    button: "Start Play",
    confirmPasswordLabel: "Confirm password",
    emailLabel: "Email",
    gradeHelper: "Allowed: Preschool through Grade 3.",
    gradeLabel: "Grade level",
    header: "Create a local profile",
    loginAction: "Already have a profile? Log in",
    nameLabel: "Name",
    passwordLabel: "Password",
    shellSubtitle:
      "Set up a simple profile so lessons, quizzes, and rewards are saved on this device.",
    shellTitle: "Start your BatiBot journey",
    signupFailedTitle: "Signup failed",
    supporting:
      "No learner email account is required. Choose a name and grade level to begin.",
  },
} as const;

const GRADE_ALIASES: Record<string, LearnerGradeLevel> = {
  kinder: "Kindergarten",
  kindergarten: "Kindergarten",
  preschool: "Preschool",
  "pre school": "Preschool",
  prek: "Preschool",
  "pre k": "Preschool",
  "pre kindergarten": "Preschool",
};

export const AUTH_VALIDATION_MESSAGES = {
  invalidEmail: {
    message: "Please enter a valid email address.",
    title: "Invalid email",
  },
  invalidPassword: {
    message: "Password must be at least 6 characters.",
    title: "Invalid password",
  },
  missingName: {
    message: "Please enter the learner name.",
    title: "Missing name",
  },
  missingGrade: {
    message: "Please choose or enter the learner grade level.",
    title: "Missing grade level",
  },
  passwordMismatch: {
    message: "Please enter the same password twice.",
    title: "Passwords do not match",
  },
  restrictedAdminEmail: {
    message:
      "Only the approved BatiBot admin account can use the admin side. Use the learner option for regular accounts.",
    title: "Admin account restricted",
  },
  unsupportedGrade: {
    message:
      "BatiBot signup is currently open only for Preschool, Kindergarten, Grade 1, Grade 2, and Grade 3 learners.",
    title: "Grade level not supported",
  },
  resetFallbackError: "Unable to send the reset email.",
  signupFallbackError: "Unable to create the account.",
  weakPassword: {
    message: "Password must be at least 6 characters.",
    title: "Weak password",
  },
  loginFallbackError: "Unable to log in right now.",
} as const;

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function normalizeAuthGradeLevel(
  gradeLevel: string
): LearnerGradeLevel | null {
  const normalized = gradeLevel
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");

  if (!normalized) {
    return null;
  }

  if (GRADE_ALIASES[normalized]) {
    return GRADE_ALIASES[normalized];
  }

  const gradeMatch = normalized.match(/^(?:grade|g)?\s*([1-3])$/);

  if (gradeMatch) {
    return `Grade ${gradeMatch[1]}` as LearnerGradeLevel;
  }

  return null;
}
