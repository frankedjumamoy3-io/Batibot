type LessonLimitContext = {
  worldId?: string;
  topicId?: string;
};

export const NORMAL_LESSON_EXAMPLE_LIMIT = 4;

export function limitLessonExamples<T>(
  items: T[],
  max = NORMAL_LESSON_EXAMPLE_LIMIT,
  context: LessonLimitContext = {}
): T[] {
  if (__DEV__ && items.length > max) {
    console.warn("[BatiBot Content Limit] Topic has more than 4 examples. Consider splitting or paging.", {
      count: items.length,
      topicId: context.topicId,
      worldId: context.worldId,
    });
  }

  return items.slice(0, max);
}
