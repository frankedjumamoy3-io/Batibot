export const fallbackIconMap = {
  achievement: "mdi:trophy-award",
  apple: "mdi:food-apple",
  baby: "mdi:baby-face-outline",
  badge: "mdi:medal-outline",
  ball: "mdi:basketball",
  book: "mdi:book-open",
  brother: "mdi:account-child",
  cat: "mdi:cat",
  character: "mdi:account-child-circle",
  chicken: "mdi:food-drumstick-outline",
  clock: "mdi:clock-outline",
  coin: "mdi:circle-multiple-outline",
  counter: "mdi:counter",
  cow: "mdi:cow",
  curriculum: "mdi:book-education-outline",
  dog: "mdi:dog",
  duck: "mdi:duck",
  family: "mdi:account-group",
  father: "mdi:human-male",
  fish: "mdi:fish",
  flower: "mdi:flower",
  friend: "mdi:account-heart-outline",
  generic: "mdi:image-outline",
  home: "mdi:home",
  horse: "mdi:horse",
  house: "mdi:home",
  learner: "mdi:school-outline",
  mother: "mdi:human-female",
  mountain: "mdi:image-filter-hdr",
  nurse: "mdi:medical-bag",
  police: "mdi:police-badge-outline",
  progress: "mdi:chart-line",
  reward: "mdi:gift-outline",
  river: "mdi:waves",
  school: "mdi:school",
  scene: "mdi:image-area",
  sequence: "mdi:sort-clock-ascending-outline",
  shape: "mdi:shape-outline",
  sister: "mdi:account-child-outline",
  star: "mdi:star",
  stage: "mdi:map-marker-check-outline",
  story: "mdi:book-open-page-variant-outline",
  teacher: "mdi:human-male-board",
  topic: "mdi:image-frame",
  tree: "mdi:tree",
  world: "mdi:map-marker-radius-outline",
} as const;

export type FallbackIconKey = keyof typeof fallbackIconMap;

const KEYWORD_ICON_ENTRIES = Object.entries(fallbackIconMap).filter(
  ([key]) => key !== "generic"
);

export function getFallbackIconForLabel(label?: string | null) {
  const normalized = label?.toLowerCase() ?? "";
  const match = KEYWORD_ICON_ENTRIES.find(([key]) => normalized.includes(key));

  return match?.[1] ?? fallbackIconMap.generic;
}
