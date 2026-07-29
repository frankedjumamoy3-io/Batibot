import type { ImageSourcePropType } from "react-native";

import {
  batibotAssetRegistry,
  type BatibotAssetGrade,
  type BatibotAssetMeta,
} from "@/src/assets/assetRegistry";
import { warnIfMissingAsset } from "@/src/utils/uiDiagnostics";

export type BatibotAssetResolution = {
  source: ImageSourcePropType | null;
  label: string;
  isFallback: boolean;
  matchedKey?: string;
};

type ResolveBatibotAssetParams = {
  key?: string;
  label: string;
  grade?: string;
  world?: string;
  topic?: string;
  tags?: string[];
};

const gradeAliases: Record<string, BatibotAssetGrade> = {
  "grade 1": "grade1",
  "grade 2": "grade2",
  "grade 3": "grade3",
  grade1: "grade1",
  grade2: "grade2",
  grade3: "grade3",
  kindergarten: "kindergarten",
  preschool: "preschool",
  shared: "shared",
};

const semanticKeyByToken: Record<string, string> = {
  "+": "math.plus",
  "-": "math.minus",
  "=": "math.equal",
  ">": "math.greaterThan",
  "<": "math.lessThan",
  "1 2": "math.fraction.half",
  "1 3": "math.fraction.third",
  "1 4": "math.fraction.quarter",
  "1 20": "number.range.1_20",
  "21 50": "number.range.21_50",
  "51 100": "number.range.51_100",
  addition: "math.plus",
  add: "math.plus",
  ball: "object.ball",
  bench: "story.bench",
  big: "adjective.big",
  bill: "money.bill",
  book: "object.book",
  boy: "person.boy",
  bright: "adjective.bright",
  cat: "animal.cat",
  coin: "money.coin",
  cold: "adjective.cold",
  divide: "math.divide",
  division: "math.divide",
  dog: "animal.dog",
  down: "direction.down",
  equal: "math.equal",
  fast: "adjective.fast",
  fish: "animal.fish",
  girl: "person.girl",
  glad: "emotion.happy",
  greater: "math.greaterThan",
  "greater than": "math.greaterThan",
  half: "math.fraction.half",
  happy: "emotion.happy",
  hot: "adjective.hot",
  jump: "action.jump",
  less: "math.lessThan",
  "less than": "math.lessThan",
  minus: "math.minus",
  multiply: "math.multiply",
  multiplication: "math.multiply",
  park: "story.park",
  playground: "story.playground",
  plus: "math.plus",
  puppy: "story.puppy",
  read: "action.read",
  run: "action.run",
  sad: "emotion.sad",
  school: "place.school",
  slow: "adjective.slow",
  small: "adjective.small",
  subtract: "math.minus",
  subtraction: "math.minus",
  third: "math.fraction.third",
  up: "direction.up",
  what: "question.what",
  when: "question.when",
  where: "question.where",
  who: "question.who",
  write: "action.write",
};

const decorativeAssetTokens = [
  "background",
  "badge",
  "decorative",
  "island",
  "map",
  "placeholder",
  "world",
];

function normalize(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9+<>=/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGrade(grade?: string) {
  return gradeAliases[normalize(grade)];
}

function getSearchPhrases(params: ResolveBatibotAssetParams) {
  return Array.from(
    new Set(
      [
        params.key,
        params.label,
        params.topic,
        ...(params.tags ?? []),
      ]
        .map(normalize)
        .filter(Boolean)
    )
  );
}

function getSearchTokens(params: ResolveBatibotAssetParams) {
  return Array.from(
    new Set(
      [
        params.key,
        params.label,
        params.topic,
        params.world,
        ...(params.tags ?? []),
      ]
        .flatMap((value) => normalize(value).split(" "))
        .filter(Boolean)
    )
  );
}

function getRequestedKeys(params: ResolveBatibotAssetParams) {
  const normalizedValues = [
    params.key,
    params.label,
    params.topic,
    ...(params.tags ?? []),
  ].map((value) => normalize(value));

  return Array.from(
    new Set(
      normalizedValues
        .flatMap((value) => [value, semanticKeyByToken[value]])
        .filter((value): value is string => Boolean(value))
    )
  );
}

function hasTagMatch(asset: BatibotAssetMeta, tokens: string[]) {
  const haystack = [
    asset.key,
    asset.label,
    asset.topic,
    ...(asset.tags ?? []),
  ]
    .map(normalize)
    .join(" ");

  return tokens.some((token) => haystack.includes(token));
}

function hasExactPhraseMatch(asset: BatibotAssetMeta, phrases: string[]) {
  const assetPhrases = [
    asset.key,
    asset.label,
    asset.topic,
    ...(asset.tags ?? []),
  ]
    .map(normalize)
    .filter(Boolean);

  return phrases.some((phrase) => assetPhrases.includes(phrase));
}

function isDecorativeAsset(asset: BatibotAssetMeta) {
  const haystack = [
    asset.key,
    asset.label,
    asset.topic,
    ...(asset.tags ?? []),
  ]
    .map(normalize)
    .join(" ");

  return (
    asset.key.startsWith("world.") ||
    asset.key.startsWith("placeholder.") ||
    asset.key.startsWith("reward.") ||
    decorativeAssetTokens.some((token) => haystack.includes(token))
  );
}

function isLearningAssetCandidate(asset: BatibotAssetMeta) {
  return !isDecorativeAsset(asset);
}

function chooseAsset(params: ResolveBatibotAssetParams) {
  const requestedGrade = normalizeGrade(params.grade);
  const requestedWorld = params.world;
  const phrases = getSearchPhrases(params);
  const tokens = getSearchTokens(params);
  const requestedKeys = getRequestedKeys(params);
  const assets = Object.values(batibotAssetRegistry);
  const learningAssets = assets.filter(isLearningAssetCandidate);

  for (const key of requestedKeys) {
    const exact = batibotAssetRegistry[key];
    if (exact && isLearningAssetCandidate(exact)) return exact;
  }

  if (requestedGrade) {
    const exactGradeMatch = learningAssets.find(
      (asset) =>
        asset.grade === requestedGrade &&
        hasExactPhraseMatch(asset, phrases)
    );
    if (exactGradeMatch) return exactGradeMatch;
  }

  if (requestedGrade && requestedWorld) {
    const gradeWorldMatch = learningAssets.find(
      (asset) =>
        asset.grade === requestedGrade &&
        asset.world === requestedWorld &&
        hasTagMatch(asset, tokens)
    );
    if (gradeWorldMatch) return gradeWorldMatch;
  }

  const sameWorldRelatedMatch = learningAssets.find(
    (asset) => asset.world === requestedWorld && hasTagMatch(asset, tokens)
  );
  if (sameWorldRelatedMatch) return sameWorldRelatedMatch;

  const otherGradeExactMatch = learningAssets.find(
    (asset) =>
      asset.grade !== requestedGrade &&
      asset.grade !== "shared" &&
      hasExactPhraseMatch(asset, phrases)
  );
  if (otherGradeExactMatch) return otherGradeExactMatch;

  const sharedExactMatch = learningAssets.find(
    (asset) => asset.grade === "shared" && hasExactPhraseMatch(asset, phrases)
  );
  if (sharedExactMatch) return sharedExactMatch;

  return undefined;
}

export function resolveBatibotAsset(
  params: ResolveBatibotAssetParams
): BatibotAssetResolution {
  const match = chooseAsset(params);

  if (match?.source) {
    return {
      source: match.source,
      label: match.label || params.label,
      isFallback: false,
      matchedKey: match.key,
    };
  }

  warnIfMissingAsset({
    worldId: params.world ?? "unknown-world",
    topicId: params.topic,
    assetLabel: params.label,
    requestedKey: params.key,
  });

  return {
    source: null,
    label: match?.label || params.label,
    isFallback: true,
    matchedKey: match?.key,
  };
}
