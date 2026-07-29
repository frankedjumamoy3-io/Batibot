import type { LearnerProgressState } from "@/src/domain/entities/learner-progress";

export function markNotificationReadUseCase(
  progress: LearnerProgressState,
  notificationId: string
): LearnerProgressState {
  return {
    ...progress,
    notifications: progress.notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ),
  };
}
