import { batibotAssetRegistry } from "@/src/assets/assetRegistry";
import { limitLessonExamples } from "@/src/utils/lessonContentLimits";

export type AdaptiveContentRequest = {
  grade: "grade1" | "grade2" | "grade3";
  worldId: string;
  topicId: string;
  subtopicId?: string;
  learningObjective: string;
  preferredAssetKeys?: string[];
  preferredTags?: string[];
  contentType:
    | "wordExample"
    | "sentenceExample"
    | "readingPassage"
    | "storyContext"
    | "mathContext"
    | "comprehensionContext";
};

export type AdaptiveContentResult = {
  title?: string;
  contextText: string;
  sentences: string[];
  assetKeys: string[];
  missingAssetLabels?: string[];
};

const commonAssetKeys = [
  "person.boy",
  "person.girl",
  "animal.dog",
  "animal.cat",
  "object.ball",
  "object.book",
  "place.school",
  "story.park",
  "nature.tree",
  "object.apple",
  "animal.fish",
  "animal.bird",
];

export function buildAdaptiveContent(
  request: AdaptiveContentRequest
): AdaptiveContentResult {
  const rankedKeys = limitLessonExamples(rankAssetKeys(request), 4, {
    topicId: request.topicId,
    worldId: request.worldId,
  });
  const labels = rankedKeys.map((key) => batibotAssetRegistry[key]?.label ?? key);
  const sentences = buildSentencesForRequest(request, labels);

  return {
    title: request.contentType.includes("Passage") ? "Ben and the Dog" : undefined,
    contextText: sentences.join(" "),
    sentences,
    assetKeys: rankedKeys,
    missingAssetLabels: rankedKeys.length ? undefined : [request.topicId],
  };
}

function rankAssetKeys(request: AdaptiveContentRequest) {
  const preferred = [...(request.preferredAssetKeys ?? []), ...commonAssetKeys];
  const tags = [
    request.topicId,
    request.subtopicId,
    request.learningObjective,
    ...(request.preferredTags ?? []),
  ]
    .filter((tag): tag is string => Boolean(tag))
    .map(normalize);

  return Array.from(
    new Set(
      preferred.filter((key) => {
        const asset = batibotAssetRegistry[key];

        if (!asset?.source) {
          return false;
        }

        const haystack = normalize(
          [asset.key, asset.label, asset.topic, asset.world, ...(asset.tags ?? [])].join(" ")
        );

        return tags.some((tag) => haystack.includes(tag)) || commonAssetKeys.includes(key);
      })
    )
  );
}

function buildSentencesForRequest(request: AdaptiveContentRequest, labels: string[]) {
  const gradeLength = request.grade === "grade1" ? 4 : request.grade === "grade2" ? 5 : 6;
  const hasDog = labels.some((label) => /dog|puppy/i.test(label));
  const hasBall = labels.some((label) => /ball/i.test(label));
  const setting = labels.find((label) => /park|school|home|house/i.test(label)) ?? "park";
  const child = labels.find((label) => /boy|girl/i.test(label)) ?? "Ben";
  const animal = hasDog ? "dog" : labels.find((label) => /cat|fish|bird/i.test(label))?.toLowerCase() ?? "dog";
  const object = hasBall ? "ball" : labels.find((label) => /book|apple|pencil/i.test(label))?.toLowerCase() ?? "book";

  if (request.contentType === "mathContext") {
    return ["Ben has 3 apples.", "Mia has 2 apples.", "They count 5 apples."].slice(0, gradeLength);
  }

  return [
    `${child} has a ${animal}.`,
    `The ${animal} runs in the ${setting.toLowerCase()}.`,
    `${child} throws a ${object}.`,
    `The ${animal} gets the ${object}.`,
    `${child} is happy.`,
    `The story shows friends playing together.`,
  ].slice(0, gradeLength);
}

function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}
