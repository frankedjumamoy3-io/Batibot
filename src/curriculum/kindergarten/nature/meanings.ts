import { getKindergartenNatureTopicKey } from "./stages";

const KINDERGARTEN_NATURE_MEANINGS: Record<string, string> = {
  plants: "Plants grow with water, light, and care.",
  "animals-in-nature": "Animals are living parts of nature.",
  weather: "Weather can be sunny, cloudy, rainy, or windy.",
  trees: "Trees are large plants with trunks and branches.",
  flowers: "Flowers grow in many colors.",
  "nature-challenge": "Build and care for a nature scene.",
};

export function getKindergartenNatureMeaning(topicTitle: string) {
  return (
    KINDERGARTEN_NATURE_MEANINGS[
      getKindergartenNatureTopicKey(topicTitle)
    ] ?? `${topicTitle}.`
  );
}
