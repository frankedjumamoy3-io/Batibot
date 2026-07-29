import type { PreschoolSizeMissionItem, PreschoolSizeRole } from "./types";

export function getSizeDistractorItems(
  items: PreschoolSizeMissionItem[],
  targetSize: PreschoolSizeRole
) {
  return items.filter((item) => item.size !== targetSize);
}
