import type { CountingForestLesson, CountingForestMission } from "./types";

export function getCountingForestDistractor(
  lesson: CountingForestLesson,
  mission: CountingForestMission,
) {
  const requiredIds = new Set(mission.requiredObjects.map((item) => item.id));
  return (
    mission.objectPool.find((item) => !requiredIds.has(item.id)) ??
    lesson.objectPool.find((item) => !requiredIds.has(item.id))
  );
}
