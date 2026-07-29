export type LessonStageAction =
  | "Observe"
  | "Touch"
  | "Recognize"
  | "Recall"
  | "Apply"
  | "Celebrate"
  | "Review Progress"
  | "Confirm Mastery";

export const LESSON_STAGE_RULES = {
  Discover: {
    action: "Observe",
    purpose: "Observe one new concept clearly.",
    learnerAction: "Observe the concept, word, number, object, group, or pattern.",
    guidance: "Full visual, audio, and mascot support.",
    allowedContent: "Current topic content may be introduced here.",
  },
  Explore: {
    action: "Touch",
    purpose: "Touch known content with gentle support.",
    learnerAction: "Touch, tap, listen, or inspect the known concept.",
    guidance: "Gentle prompts and audio support.",
    allowedContent: "Current topic content from Discover.",
  },
  Interact: {
    action: "Recognize",
    purpose: "Recognize the known concept with support.",
    learnerAction: "Recognize the concept through guided choices or matching.",
    guidance: "High support.",
    allowedContent: "Current topic content already introduced.",
  },
  Practice: {
    action: "Recall",
    purpose: "Recall the known concept with simple support.",
    learnerAction: "Recall the answer from a prompt, target visual, number group, or pattern.",
    guidance: "Medium support.",
    allowedContent: "Current topic content already introduced.",
  },
  Challenge: {
    action: "Apply",
    purpose: "Apply understanding without adding new content.",
    learnerAction: "Apply the known skill to mixed examples with fewer hints and a timer.",
    guidance: "Less guided with limited retries.",
    allowedContent:
      "Only the current topic, previously learned topics, and content shown in Discover, Explore, Interact, or Practice.",
  },
  Reward: {
    action: "Celebrate",
    purpose: "Give XP and stars.",
    learnerAction: "Receive completion feedback.",
    guidance: "Celebratory feedback.",
    allowedContent: "No new learning content.",
  },
  Progress: {
    action: "Review Progress",
    purpose: "Save topic progress.",
    learnerAction: "See saved progress for the topic or world.",
    guidance: "Progress feedback.",
    allowedContent: "No new learning content.",
  },
  Mastery: {
    action: "Confirm Mastery",
    purpose: "Mark the topic mastered and unlock the next topic.",
    learnerAction: "See mastery status and next unlock.",
    guidance: "Mastery feedback.",
    allowedContent: "No new learning content.",
  },
} as const;
