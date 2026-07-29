export type PreschoolPlayType =
  | "picture-choice"
  | "drag-drop"
  | "matching"
  | "sorting"
  | "counting"
  | "build"
  | "mini-mission";

const RECOGNITION_TOPICS: Record<string, ReadonlySet<string>> = {
  "preschool-animal-adventure": new Set(["bird", "cat", "cow", "dog", "duck", "fish", "horse"]),
  "preschool-body-world": new Set(["hair", "head", "teeth"]),
  "preschool-colorful-world": new Set([
    "black",
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "white",
    "yellow",
  ]),
  "preschool-family-world": new Set(["baby", "brother", "family", "father", "friend", "mother", "sister"]),
  "preschool-food-town": new Set(["bread", "egg", "juice", "meat", "milk", "rice", "vegetables"]),
  "preschool-fruit-garden": new Set(["apple", "banana", "grapes", "mango", "orange", "watermelon"]),
  "preschool-shape-kingdom": new Set(["circle", "rectangle", "square", "star", "triangle"]),
};

const PLAY_TYPE_OVERRIDES: Record<string, PreschoolPlayType> = {
  "preschool-animal-adventure:bird": "drag-drop",
  "preschool-animal-adventure:cat": "mini-mission",
  "preschool-animal-adventure:cow": "mini-mission",
  "preschool-animal-adventure:dog": "mini-mission",
  "preschool-animal-adventure:duck": "drag-drop",
  "preschool-animal-adventure:fish": "drag-drop",
  "preschool-animal-adventure:horse": "mini-mission",
  "preschool-animal-adventure:animal-challenge": "drag-drop",
  "preschool-big-small:big": "sorting",
  "preschool-big-small:mixed-sizes": "sorting",
  "preschool-big-small:short": "matching",
  "preschool-big-small:small": "sorting",
  "preschool-big-small:tall": "matching",
  "preschool-big-small:big-small-animals": "sorting",
  "preschool-big-small:big-small-challenge": "sorting",
  "preschool-big-small:big-small-foods": "sorting",
  "preschool-big-small:big-small-fruits": "sorting",
  "preschool-big-small:big-small-shapes": "matching",
  "preschool-big-small:bigger": "matching",
  "preschool-big-small:size-challenge": "sorting",
  "preschool-big-small:size-matching": "matching",
  "preschool-big-small:smaller": "matching",
  "preschool-big-small:sort-by-size": "sorting",
  "preschool-body-world:body": "build",
  "preschool-body-world:head": "drag-drop",
  "preschool-body-world:ears": "matching",
  "preschool-body-world:eyes": "mini-mission",
  "preschool-body-world:feet": "mini-mission",
  "preschool-body-world:hair": "drag-drop",
  "preschool-body-world:hands": "mini-mission",
  "preschool-body-world:mouth": "mini-mission",
  "preschool-body-world:nose": "matching",
  "preschool-body-world:teeth": "drag-drop",
  "preschool-counting-forest:counting-animals": "counting",
  "preschool-counting-forest:counting-challenge": "counting",
  "preschool-counting-forest:counting-foods": "counting",
  "preschool-counting-forest:counting-fruits": "counting",
  "preschool-counting-forest:counting-shapes": "counting",
  "preschool-counting-forest:forest-counting-challenge": "counting",
  "preschool-colorful-world:black": "drag-drop",
  "preschool-colorful-world:blue": "drag-drop",
  "preschool-colorful-world:green": "drag-drop",
  "preschool-colorful-world:orange": "drag-drop",
  "preschool-colorful-world:purple": "drag-drop",
  "preschool-colorful-world:rainbow-color-challenge": "build",
  "preschool-colorful-world:red": "drag-drop",
  "preschool-colorful-world:white": "drag-drop",
  "preschool-colorful-world:yellow": "drag-drop",
  "preschool-family-world:family": "build",
  "preschool-family-world:baby": "mini-mission",
  "preschool-family-world:brother": "mini-mission",
  "preschool-family-world:father": "mini-mission",
  "preschool-family-world:friend": "mini-mission",
  "preschool-family-world:home": "drag-drop",
  "preschool-family-world:mother": "mini-mission",
  "preschool-family-world:sister": "mini-mission",
  "preschool-food-town:bread": "drag-drop",
  "preschool-food-town:egg": "drag-drop",
  "preschool-food-town:fish": "drag-drop",
  "preschool-food-town:food-challenge": "build",
  "preschool-food-town:juice": "drag-drop",
  "preschool-food-town:meat": "drag-drop",
  "preschool-food-town:milk": "mini-mission",
  "preschool-food-town:rice": "drag-drop",
  "preschool-food-town:vegetables": "drag-drop",
  "preschool-fruit-garden:apple": "drag-drop",
  "preschool-fruit-garden:banana": "mini-mission",
  "preschool-fruit-garden:grapes": "drag-drop",
  "preschool-fruit-garden:mango": "drag-drop",
  "preschool-fruit-garden:orange": "drag-drop",
  "preschool-fruit-garden:watermelon": "drag-drop",
  "preschool-fruit-garden:fruit-challenge": "mini-mission",
  "preschool-more-less:more-animals": "counting",
  "preschool-more-less:more-foods": "counting",
  "preschool-more-less:more-fruits": "counting",
  "preschool-more-less:more-less-challenge": "mini-mission",
  "preschool-more-less:more-shapes": "counting",
  "preschool-more-less:compare-groups": "matching",
  "preschool-more-less:less": "counting",
  "preschool-more-less:more": "counting",
  "preschool-more-less:quantity-sorting": "sorting",
  "preschool-more-less:valley-challenge": "mini-mission",
  "preschool-more-less:which-has-less": "matching",
  "preschool-more-less:which-has-more": "matching",
  "preschool-number-village:number-challenge": "counting",
  "preschool-number-village:number-1": "counting",
  "preschool-number-village:number-2": "counting",
  "preschool-number-village:number-3": "counting",
  "preschool-number-village:number-4": "counting",
  "preschool-number-village:number-5": "counting",
  "preschool-number-village:number-6": "counting",
  "preschool-number-village:number-7": "counting",
  "preschool-number-village:number-8": "counting",
  "preschool-number-village:number-9": "counting",
  "preschool-number-village:number-10": "counting",
  "preschool-pattern-playground:animal-patterns": "build",
  "preschool-pattern-playground:animal-pattern": "build",
  "preschool-pattern-playground:color-pattern": "build",
  "preschool-pattern-playground:finish-pattern": "build",
  "preschool-pattern-playground:food-patterns": "build",
  "preschool-pattern-playground:food-pattern": "build",
  "preschool-pattern-playground:fruit-patterns": "build",
  "preschool-pattern-playground:pattern-challenge": "mini-mission",
  "preschool-pattern-playground:shape-patterns": "build",
  "preschool-pattern-playground:shape-pattern": "build",
  "preschool-pattern-playground:toy-pattern": "build",
  "preschool-shape-kingdom:circle": "drag-drop",
  "preschool-shape-kingdom:rectangle": "drag-drop",
  "preschool-shape-kingdom:shape-challenge": "build",
  "preschool-shape-kingdom:square": "drag-drop",
  "preschool-shape-kingdom:star": "drag-drop",
  "preschool-shape-kingdom:triangle": "drag-drop",
};

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isPreschoolRecognitionTopic(worldId: string, topicTitle: string) {
  return RECOGNITION_TOPICS[worldId]?.has(slug(topicTitle)) ?? false;
}

export function getPreschoolPlayType(worldId: string, topicTitle: string): PreschoolPlayType {
  const topicKey = slug(topicTitle);
  const override = PLAY_TYPE_OVERRIDES[`${worldId}:${topicKey}`];

  if (override) {
    return override;
  }

  if (isPreschoolRecognitionTopic(worldId, topicTitle)) {
    return "picture-choice";
  }

  if (worldId === "preschool-number-village" || worldId === "preschool-counting-forest") {
    return "counting";
  }

  if (worldId === "preschool-pattern-playground") {
    return "build";
  }

  return "mini-mission";
}

export function getPreschoolPlayRendererName(worldId: string, topicTitle: string) {
  const rendererByType: Record<PreschoolPlayType, string> = {
    build: "PreschoolBuildRenderer",
    counting: worldId === "preschool-number-village"
      ? "PreschoolTenFrameBuilderRenderer"
      : "PreschoolTouchCountRenderer",
    "drag-drop": "PreschoolDragDropRenderer",
    matching: "PreschoolMatchingRenderer",
    "mini-mission": "PreschoolMiniMissionRenderer",
    "picture-choice": "PreschoolPictureChoiceRenderer",
    sorting: "PreschoolSortingRenderer",
  };

  return rendererByType[getPreschoolPlayType(worldId, topicTitle)];
}

export function validatePreschoolPlayDistribution(
  topics: { worldId: string; topicTitle: string }[]
) {
  const counts = topics.reduce<Record<PreschoolPlayType, number>>(
    (result, topic) => {
      result[getPreschoolPlayType(topic.worldId, topic.topicTitle)] += 1;
      return result;
    },
    {
      build: 0,
      counting: 0,
      "drag-drop": 0,
      matching: 0,
      "mini-mission": 0,
      "picture-choice": 0,
      sorting: 0,
    }
  );
  const total = topics.length;
  const pictureChoicePercentage = total ? Math.round((counts["picture-choice"] / total) * 100) : 0;
  const applicationCount = total - counts["picture-choice"];

  return {
    applicationCount,
    counts,
    pictureChoicePercentage,
    total,
    valid:
      total > 0 &&
      pictureChoicePercentage <= 55 &&
      applicationCount > counts["picture-choice"],
  };
}
