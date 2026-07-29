const KINDERGARTEN_SHAPE_OBJECT_MATCHES: Record<string, string> = {
  Circle: "Ball",
  Oval: "Egg",
  Rectangle: "Book",
  Square: "Block",
  Triangle: "Roof",
};

const KINDERGARTEN_SHAPE_MEANINGS: Record<string, string> = {
  circle: "This is a Circle.",
  oval: "This is an Oval.",
  square: "This is a Square.",
  rectangle: "This is a Rectangle.",
  triangle: "This is a Triangle.",
  "shape-challenge": "Build a town with all Kindergarten shapes.",
};

export function getKindergartenShapeObjectMatch(topicTitle: string) {
  return KINDERGARTEN_SHAPE_OBJECT_MATCHES[topicTitle];
}

export function getKindergartenShapeMeaning(topicTitle: string) {
  const topicKey = topicTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return (
    KINDERGARTEN_SHAPE_MEANINGS[topicKey] ?? `${topicTitle}.`
  );
}
