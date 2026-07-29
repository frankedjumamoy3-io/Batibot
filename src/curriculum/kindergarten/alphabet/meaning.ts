const LETTER_EXAMPLES: Record<string, string> = {
  a: "Apple",
  b: "Ball",
  c: "Cat",
  d: "Dog",
  e: "Egg",
  f: "Fish",
  g: "Grapes",
  h: "Hat",
  i: "Igloo",
  j: "Juice",
  k: "Kite",
  l: "Leaf",
  m: "Moon",
  n: "Notebook",
  o: "Orange",
  p: "Pencil",
  q: "Queen",
  r: "Rain",
  s: "Sun",
  t: "Tree",
  u: "Umbrella",
  v: "Van",
  w: "Water",
  x: "Box",
  y: "Yellow",
  z: "Zebra",
};

export function getKindergartenAlphabetMeaning(topicTitle: string): string {
  const letter = topicTitle.replace(/^letter\s+/i, "").trim().charAt(0).toLowerCase();
  const example = LETTER_EXAMPLES[letter];

  return example ? `${letter.toUpperCase()} is for ${example}.` : "Let's learn together.";
}
