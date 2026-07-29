import type {
  VocabularyCategory,
  VocabularyItem,
  VocabularySeed,
  VocabularySubcategory,
} from "@/src/data/vocabulary/types";
import { createVocabularyImageUri } from "@/src/data/vocabulary/media";
import { improveVocabularyCopy } from "@/src/data/vocabulary/simple-copy";

type BuildVocabularyOptions = {
  accentColor: string;
  category: VocabularyCategory;
  curriculumBand: string;
  learningGoal: string;
  seeds: VocabularySeed[];
  subcategory: VocabularySubcategory;
};

const PRONUNCIATION_OVERRIDES: Record<string, string> = {
  Acorn: "AY-korn",
  Alpaca: "al-PA-kuh",
  Alligator: "AL-uh-gay-ter",
  Avocado: "av-uh-KAH-doh",
  Banana: "buh-NA-nuh",
  Broccoli: "BRAH-kuh-lee",
  Cantaloupe: "KAN-tuh-lohp",
  Cauliflower: "KAW-li-flow-er",
  Chameleon: "kuh-MEEL-yun",
  Chicken: "CHIK-en",
  Chimpanzee: "chim-pan-ZEE",
  Cilantro: "sih-LAN-troh",
  Crocodile: "KRAH-kuh-dile",
  Dolphin: "DAHL-fin",
  "Dragon Fruit": "DRAG-un FROOT",
  Elephant: "EL-uh-funt",
  Flamingo: "fluh-MING-goh",
  Giraffe: "juh-RAF",
  Gorilla: "guh-RIL-uh",
  "Guinea Pig": "GIN-ee pig",
  Hummingbird: "HUM-ing-bird",
  Iguana: "ih-GWAH-nuh",
  Jaguar: "JAG-war",
  Jellyfish: "JEL-ee-fish",
  Kangaroo: "kan-guh-ROO",
  Koala: "koh-AH-luh",
  Leopard: "LEP-erd",
  Octopus: "AHK-tuh-pus",
  Orangutan: "oh-RANG-uh-tan",
  Papaya: "puh-PIE-yuh",
  Pineapple: "PIE-nap-ul",
  Pomegranate: "PAH-muh-gran-it",
  Refrigerator: "ri-FRIJ-uh-ray-ter",
  Rhinoceros: "ry-NAH-suh-rus",
  Seahorse: "SEE-horse",
  Strawberry: "STRAW-bair-ee",
  Television: "TEL-uh-vizh-un",
  "Thank You": "THANK yoo",
  Umbrella: "um-BREL-uh",
  Watermelon: "WAW-ter-mel-un",
  Xylophone: "ZIE-luh-fohn",
  Zucchini: "zoo-KEE-nee",
};
const WORD_PRONUNCIATIONS: Record<string, string> = {
  above: "uh-BUV",
  across: "uh-KRAWS",
  add: "ad",
  addend: "AD-end",
  after: "AF-ter",
  afternoon: "af-ter-NOON",
  airplane: "AIR-playn",
  alligator: "AL-uh-gay-ter",
  almost: "AWL-mohst",
  alpaca: "al-PA-kuh",
  altogether: "awl-tuh-GEH-ther",
  amount: "uh-MOWNT",
  animal: "AN-uh-mul",
  answer: "AN-ser",
  ant: "ant",
  apple: "AP-ul",
  arch: "arch",
  around: "uh-ROWND",
  arrange: "uh-RAYNJ",
  arrow: "AIR-oh",
  autumn: "AW-tum",
  avocado: "av-uh-KAH-doh",
  ball: "bawl",
  backward: "BAK-werd",
  balance: "BAL-uns",
  banana: "buh-NA-nuh",
  bamboo: "bam-BOO",
  basket: "BAS-kit",
  bat: "bat",
  beach: "beech",
  bead: "beed",
  bear: "bair",
  because: "bih-KAWZ",
  before: "bih-FOR",
  beginning: "bih-GIN-ing",
  below: "bih-LOH",
  between: "bih-TWEEN",
  bicycle: "BY-sih-kul",
  bigger: "BIG-er",
  bird: "berd",
  blizzard: "BLIZ-erd",
  blue: "bloo",
  broccoli: "BRAH-kuh-lee",
  building: "BIL-ding",
  bus: "bus",
  butterfly: "BUT-er-fly",
  calculator: "KAL-kyuh-lay-ter",
  camera: "KAM-er-uh",
  canary: "kuh-NAIR-ee",
  cantaloupe: "KAN-tuh-lohp",
  capacity: "kuh-PAS-uh-tee",
  caterpillar: "KAT-er-pil-er",
  cedar: "SEE-der",
  cauliflower: "KAW-li-flow-er",
  chameleon: "kuh-MEEL-yun",
  chicken: "CHIK-en",
  cheetah: "CHEE-tuh",
  chimpanzee: "chim-pan-ZEE",
  cilantro: "sih-LAN-troh",
  circle: "SER-kul",
  classify: "KLAS-uh-fy",
  coconut: "KOH-kuh-nut",
  collect: "kuh-LEKT",
  column: "KAH-lum",
  combine: "kum-BYN",
  compare: "kum-PAIR",
  completed: "kum-PLEE-ted",
  compost: "KAHM-pohst",
  cone: "kohn",
  constellation: "kahn-stuh-LAY-shun",
  correct: "kuh-REKT",
  cow: "kow",
  counting: "KOWN-ting",
  crayon: "KRAY-on",
  crocodile: "KRAH-kuh-dile",
  cucumber: "KYOO-kum-ber",
  curriculum: "kuh-RIK-yuh-lum",
  cylinder: "SIL-in-der",
  daisy: "DAY-zee",
  deer: "deer",
  different: "DIF-er-ent",
  digit: "DIJ-it",
  dolphin: "DAHL-fin",
  domino: "DAH-muh-noh",
  donkey: "DAHNG-kee",
  door: "dor",
  dragon: "DRAG-un",
  duck: "duk",
  eagle: "EE-gul",
  earth: "erth",
  echo: "EK-oh",
  eclipse: "ih-KLIPS",
  edge: "ej",
  eight: "ayt",
  eighteen: "ay-TEEN",
  eighty: "AY-tee",
  eleven: "ih-LEV-un",
  elephant: "EL-uh-funt",
  equal: "EE-kwul",
  equation: "ih-KWAY-zhun",
  estimate: "ES-tuh-mayt",
  exact: "ig-ZAKT",
  explain: "ik-SPLAYN",
  eye: "eye",
  family: "FAM-uh-lee",
  farthest: "FAR-thest",
  favorite: "FAY-vuh-rit",
  flamingo: "fluh-MING-goh",
  flashlight: "FLASH-lyt",
  five: "fyv",
  forward: "FOR-werd",
  fourteen: "for-TEEN",
  four: "for",
  fourth: "forth",
  fox: "fahks",
  giraffe: "juh-RAF",
  glue: "gloo",
  gorilla: "guh-RIL-uh",
  goodbye: "good-BYE",
  goose: "goos",
  grape: "grayp",
  grasshopper: "GRAS-hop-er",
  green: "green",
  greater: "GRAY-ter",
  guinea: "GIN-ee",
  guitar: "gih-TAR",
  hamburger: "HAM-bur-ger",
  headphones: "HED-fohnz",
  heart: "hart",
  hemisphere: "HEM-ih-sfeer",
  hibiscus: "hy-BIS-kus",
  hummingbird: "HUM-ing-bird",
  hyena: "hy-EE-nuh",
  iguana: "ih-GWAH-nuh",
  inside: "in-SYD",
  island: "EYE-lund",
  jaguar: "JAG-war",
  jasmine: "JAZ-min",
  jellyfish: "JEL-ee-fish",
  kangaroo: "kan-guh-ROO",
  keyboard: "KEE-bord",
  koala: "koh-AH-luh",
  language: "LANG-gwij",
  lavender: "LAV-en-der",
  leopard: "LEP-erd",
  lightning: "LYT-ning",
  lion: "LY-un",
  llama: "LAH-muh",
  machine: "muh-SHEEN",
  measure: "MEH-zher",
  measurement: "MEH-zher-ment",
  mirror: "MEER-er",
  money: "MUN-ee",
  morning: "MOR-ning",
  mountain: "MOWN-tin",
  mushroom: "MUSH-room",
  octagon: "AHK-tuh-gon",
  octopus: "AHK-tuh-pus",
  orangutan: "oh-RANG-uh-tan",
  outside: "owt-SYD",
  parallelogram: "pair-uh-LEL-uh-gram",
  parsley: "PARS-lee",
  pattern: "PAT-ern",
  penguin: "PEN-gwin",
  pentagon: "PEN-tuh-gon",
  peacock: "PEE-kahk",
  phone: "fohn",
  picture: "PIK-cher",
  pineapple: "PIE-nap-ul",
  position: "puh-ZISH-un",
  pronunciation: "proh-nun-see-AY-shun",
  pyramid: "PEER-uh-mid",
  quantity: "KWAHN-tuh-tee",
  question: "KWES-chun",
  rectangle: "REK-tang-gul",
  red: "red",
  refrigerator: "ri-FRIJ-uh-ray-ter",
  rhombus: "RAHM-bus",
  rhinoceros: "ry-NAH-suh-rus",
  scissors: "SIZ-erz",
  seahorse: "SEE-horse",
  sentence: "SEN-tens",
  shadow: "SHAD-oh",
  seven: "SEV-un",
  seventeen: "sev-un-TEEN",
  seventy: "SEV-un-tee",
  shape: "shayp",
  sheep: "sheep",
  six: "siks",
  sixteen: "siks-TEEN",
  sixty: "SIKS-tee",
  sky: "sky",
  sphere: "sfeer",
  square: "skwair",
  squirrel: "SKWIR-ul",
  strawberry: "STRAW-bair-ee",
  subtract: "sub-TRAKT",
  subtraction: "sub-TRAK-shun",
  sunflower: "SUN-flow-er",
  symmetry: "SIM-uh-tree",
  ten: "ten",
  television: "TEL-uh-vizh-un",
  temperature: "TEM-per-uh-cher",
  tessellation: "tes-uh-LAY-shun",
  together: "tuh-GEH-ther",
  tomorrow: "tuh-MAR-oh",
  tooth: "tooth",
  toothbrush: "TOOTH-brush",
  toothpaste: "TOOTH-payst",
  triangle: "TRY-ang-gul",
  twelve: "twelv",
  twenty: "TWEN-tee",
  two: "too",
  three: "three",
  thirteen: "ther-TEEN",
  thirty: "THER-tee",
  fifteen: "fif-TEEN",
  fifty: "FIF-tee",
  first: "ferst",
  second: "SEK-und",
  third: "therd",
  nine: "nyn",
  nineteen: "nyn-TEEN",
  ninety: "NYN-tee",
  one: "wun",
  aloe: "AL-oh",
  barley: "BAR-lee",
  basil: "BAY-zil",
  beet: "beet",
  bell: "bel",
  birch: "berch",
  blackberry: "BLAK-bair-ee",
  blueberry: "BLOO-bair-ee",
  branch: "branch",
  cabbage: "KAB-ij",
  carrot: "KAIR-ut",
  cherry: "CHAIR-ee",
  clover: "KLOH-ver",
  cornstalk: "KORN-stawk",
  dandelion: "DAN-duh-ly-un",
  eggplant: "EG-plant",
  flower: "FLOW-er",
  garlic: "GAR-lik",
  greenhouse: "GREEN-hows",
  guava: "GWAH-vuh",
  jackfruit: "JAK-froot",
  kelp: "kelp",
  kiwi: "KEE-wee",
  lemon: "LEM-un",
  lettuce: "LET-is",
  lily: "LIL-ee",
  lime: "lym",
  mango: "MANG-goh",
  marigold: "MAIR-ih-gohld",
  mint: "mint",
  okra: "OH-kruh",
  onion: "UN-yun",
  orange: "OR-inj",
  orchid: "OR-kid",
  peach: "peech",
  pear: "pair",
  pepper: "PEP-er",
  petal: "PET-ul",
  pinecone: "PYN-kohn",
  planter: "PLAN-ter",
  plum: "plum",
  potato: "puh-TAY-toh",
  pumpkin: "PUMP-kin",
  radish: "RAD-ish",
  raspberry: "RAZ-bair-ee",
  rosemary: "ROHZ-mair-ee",
  sage: "sayj",
  seedling: "SEED-ling",
  spinach: "SPIN-ich",
  sprout: "sprowt",
  succulent: "SUK-yuh-lent",
  sugarcane: "SHOO-ger-kayn",
  tomato: "tuh-MAY-toh",
  turnip: "TER-nip",
  vine: "vyn",
  wheat: "weet",
  more: "mor",
  less: "les",
  same: "saym",
  many: "MEN-ee",
  few: "fyoo",
  line: "lyn",
  pair: "pair",
  group: "groop",
  whole: "hohl",
  half: "haf",
  full: "ful",
  umbrella: "um-BREL-uh",
  vegetable: "VEJ-tuh-bul",
  yesterday: "YES-ter-day",
  xylophone: "ZIE-luh-fohn",
  zero: "ZEE-roh",
  zucchini: "zoo-KEE-nee",
};

function normalizeSeedWord(word?: string) {
  return word?.trim() || "Untitled Word";
}

function normalizeForCopyCheck(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyWord(word: string) {
  return normalizeSeedWord(word)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function containsOwnWord(copy: string, word: string) {
  const normalizedWord = normalizeForCopyCheck(word);
  const allowedSelfReferenceWords = new Set([
    "an",
    "her",
    "is",
    "out",
    "there",
    "was",
    "with",
  ]);

  if (normalizedWord.length <= 1 || allowedSelfReferenceWords.has(normalizedWord)) {
    return false;
  }

  const normalizedCopy = ` ${normalizeForCopyCheck(copy)} `;
  const wordPattern = normalizedWord.includes(" ")
    ? ` ${normalizedWord} `
    : new RegExp(`\\b${normalizedWord}\\b`, "u");

  return typeof wordPattern === "string"
    ? normalizedCopy.includes(wordPattern)
    : wordPattern.test(normalizedCopy);
}

function fallbackDefinition(category: VocabularyCategory, subcategory: VocabularySubcategory) {
  if (category === "numeric") {
    switch (subcategory) {
      case "counting":
        return "A math idea for numbers, amounts, sequence, or groups.";
      case "shapes":
        return "A math idea for lines, corners, curves, solids, or patterns.";
      case "adding":
        return "A math idea for joining, separating, or solving number stories.";
      case "comparing":
        return "A math idea for size, amount, position, time, or data.";
      default:
        return "A math idea used while counting, comparing, measuring, or solving.";
    }
  }

  switch (subcategory) {
    case "animals":
      return "A living creature with body parts, sounds, movement, and a home.";
    case "plants":
      return "A growing thing, food, flower, tree, or plant part people can notice.";
    case "things":
      return "An everyday idea, object, place, action, feeling, or routine.";
    case "nature":
      return "An outdoor idea about the world around us.";
    case "reading":
      return "A common reading item that helps a sentence make sense.";
    default:
      return "A simple term used to name, describe, or explain an idea.";
  }
}

function formatPronunciation(word: string) {
  const normalizedWord = normalizeSeedWord(word);

  return PRONUNCIATION_OVERRIDES[normalizedWord] ?? formatChildPronunciation(normalizedWord);
}

function formatChildPronunciation(word: string) {
  return word
    .split(/\s+/)
    .map((part) => {
      const normalizedPart = part.toLowerCase().replace(/[^a-z]/g, "");

      if (!normalizedPart) {
        return part;
      }

      return WORD_PRONUNCIATIONS[normalizedPart] ?? formatFallbackPronunciation(part);
    })
    .join(" ");
}

function formatFallbackPronunciation(word: string) {
  return normalizeSeedWord(word)
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .replace(/tion$/u, "shun")
    .replace(/sion$/u, "zhun")
    .replace(/ture$/u, "cher")
    .replace(/ph/u, "f")
    .replace(/ck/u, "k")
    .replace(/^c([eiy])/u, "s$1")
    .replace(/^g([eiy])/u, "j$1");
}

export function buildVocabularyItems({
  accentColor,
  category,
  curriculumBand,
  learningGoal,
  seeds,
  subcategory,
}: BuildVocabularyOptions): VocabularyItem[] {
  return seeds.map((seed) => {
    const word = normalizeSeedWord(seed.word);
    const improvedCopy = improveVocabularyCopy({
      category,
      definition: seed.meaning,
      example: seed.sample,
      subcategory,
      word,
    });
    const definition = containsOwnWord(improvedCopy.definition, word)
      ? fallbackDefinition(category, subcategory)
      : improvedCopy.definition;

    return {
      id: `${category}-${subcategory}-${slugifyWord(word)}`,
      legacyIds: [slugifyWord(word)],
      word,
      pronunciation: formatPronunciation(word),
      definition,
      example:
        improvedCopy.example ?? `We use ${word.toLowerCase()} in this lesson.`,
      imageUri: createVocabularyImageUri({
        accentColor,
        category,
        emoji: seed.emoji,
        subcategory,
        word,
      }),
      emoji: seed.emoji,
      accentColor,
      category,
      subcategory,
      curriculumBand,
      learningGoal,
      recognitionPrompt: seed.clue,
      searchTerms: [
        word.toLowerCase(),
        category,
        subcategory,
        ...(seed.searchTerms ?? []),
      ],
    };
  });
}
