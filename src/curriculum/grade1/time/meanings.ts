import type { Grade1TimeMeaning } from "./types";
import { getGrade1TimeTopicKey } from "./topics";

export const GRADE1_TIME_MEANINGS: Record<string, Grade1TimeMeaning> = {
  clock: {
    meaning: "A clock shows time.",
    pronunciation: "clock",
    examples: ["wall clock", "clock hands", "clock face"],
  },
  hour: {
    meaning: "An hour is a unit of time shown by the hour hand.",
    pronunciation: "hour",
    examples: ["one hour", "school hour", "hour hand"],
  },
  morning: {
    meaning: "Morning is the early part of the day.",
    pronunciation: "morning",
    examples: ["wake up", "eat breakfast", "go to school"],
  },
  afternoon: {
    meaning: "Afternoon is the part of the day after noon.",
    pronunciation: "afternoon",
    examples: ["play outside", "read a book", "go home"],
  },
  evening: {
    meaning: "Evening is the later part of the day.",
    pronunciation: "evening",
    examples: ["eat dinner", "take a bath", "get ready for bed"],
  },
  "time-challenge": {
    meaning: "Time challenge uses clocks and daily routine order.",
    pronunciation: "time challenge",
    examples: ["Set a clock.", "Put routines in order."],
  },
};

export function getGrade1TimeMeaning(topicTitle: string) {
  return GRADE1_TIME_MEANINGS[getGrade1TimeTopicKey(topicTitle)];
}
