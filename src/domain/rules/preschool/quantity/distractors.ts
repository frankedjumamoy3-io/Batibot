import type { PreschoolQuantityMissionItem, PreschoolQuantityRole } from "./types";

export function getQuantityDistractorItems(
  items: PreschoolQuantityMissionItem[],
  targetRole: PreschoolQuantityRole
) {
  return items.filter((item) => item.role !== targetRole);
}
