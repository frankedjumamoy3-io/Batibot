const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const copyListPath = path.join(rootDir, "docs", "vocabulary-word-copy-list.md");

const genericMeaningPatterns = [
  /^A creature learners can identify/u,
  /^A plant, food, or growing part learners can identify/u,
  /^A person, place, object, action, or daily idea/u,
  /^A sky, weather, land, water, or world idea/u,
  /^A counting term that tells/u,
  /^A geometry term for/u,
  /^A math operation term for/u,
  /^A comparison term for/u,
  /^A reading term used/u,
  /^A learning term with/u,
  /^A common reading term/u,
  /^A word used to show an action or idea\.$/u,
  /^A word used for an action or state that happened before now\.$/u,
  /^A word used to tell what someone or something is like\.$/u,
  /^A math term used when we count, compare, measure, or solve\.$/u,
  /^A living creature people can name, compare, and describe\.$/u,
  /^A food, plant, growing thing, or material people can notice\.$/u,
  /^An outdoor idea about weather, land, water, sky, or space\.$/u,
  /^An everyday term for a person, place, thing, action, or idea\.$/u,
];

const genericExamplePatterns = [
  /^The picture shows /u,
  /^I see (a |an )?/u,
  /^We use .+ in this lesson\.$/u,
  /^We talk about .+ today\.$/u,
  /^We noticed .+ in a story\.$/u,
  /^We describe .+ clearly\.$/u,
  /^The story uses .+ clearly\.$/u,
  /^We read .+ in the sentence\.$/u,
  /^We use .+ while reading\.$/u,
  /^.+ belongs in the sentence\.$/u,
  /^We use .+ in math\.$/u,
  /^We saw .+ in the picture\.$/u,
];

function parseRows(markdown) {
  return markdown
    .split(/\r?\n/u)
    .filter((line) => /^\| (linguistic|numeric) \|/u.test(line))
    .map((line) => {
      const [category, subcategory, word, meaning, example] = line
        .split(" | ")
        .map((part) => part.replace(/^\|\s*/u, "").replace(/\s*\|$/u, ""));

      return {
        category,
        example,
        meaning,
        subcategory,
        word,
      };
    });
}

function getGenericReason(row) {
  const meaningPattern = genericMeaningPatterns.find((pattern) =>
    pattern.test(row.meaning)
  );

  if (meaningPattern) {
    return "meaning";
  }

  const examplePattern = genericExamplePatterns.find((pattern) =>
    pattern.test(row.example)
  );

  return examplePattern ? "example" : null;
}

const rows = parseRows(fs.readFileSync(copyListPath, "utf8"));
const flaggedRows = rows
  .map((row) => ({
    ...row,
    reason: getGenericReason(row),
  }))
  .filter((row) => row.reason);
const countsBySubcategory = flaggedRows.reduce((counts, row) => {
  counts[row.subcategory] = (counts[row.subcategory] ?? 0) + 1;
  return counts;
}, {});

console.log(`Total generic-looking rows: ${flaggedRows.length}`);
Object.entries(countsBySubcategory)
  .sort(([left], [right]) => left.localeCompare(right))
  .forEach(([subcategory, count]) => {
    console.log(`${subcategory}: ${count}`);
  });

