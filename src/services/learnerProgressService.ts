import { collection, getDocs } from "firebase/firestore";

import { db } from "@/src/config/firebase";
import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";
import { sanitizeLearnerProgress } from "@/src/domain/usecases/learner-progress/progress-state";

type JsonRecord = Record<string, unknown>;

export interface LearnerProgressSummary {
  uid: string;
  email: string;
  displayName: string;
  progress: LearnerProgressState;
}

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export async function getLearnerProgressSummaries() {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs
    .map((userDoc): LearnerProgressSummary | null => {
      const data = userDoc.data() as JsonRecord;

      if (!data.learnerProgress) {
        return null;
      }

      return {
        uid: cleanString(data.uid, userDoc.id),
        email: cleanString(data.email),
        displayName: cleanString(data.displayName, cleanString(data.email, "Learner")),
        progress: sanitizeLearnerProgress(data.learnerProgress),
      };
    })
    .filter((summary): summary is LearnerProgressSummary => summary !== null);
}
