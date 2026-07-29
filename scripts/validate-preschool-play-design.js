const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const curriculumPath = path.join(root, "src", "data", "curriculum", "learning-path.ts");
const rulesPath = path.join(root, "src", "domain", "rules", "preschool-play-rules.ts");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(root, request.slice(2)),
      parent,
      isMain,
      options
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTs(module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};

const {
  CURRICULUM,
  getAllBatiBotTopicContent,
  validateBatiBotFrameworkCompliance,
} = require(curriculumPath);
const {
  getPreschoolPlayType,
  validatePreschoolPlayDistribution,
} = require(rulesPath);

const preschoolGrade = CURRICULUM.find((grade) => grade.gradeLevel === "Preschool");
const topics = preschoolGrade.worlds.flatMap((world) =>
  world.topics.map((topic) => ({
    topicTitle: topic.title,
    worldId: world.id,
  }))
);
const distribution = validatePreschoolPlayDistribution(topics);
const preschoolContent = getAllBatiBotTopicContent().filter(
  (content) => content.level === "preschool"
);
const summary = validateBatiBotFrameworkCompliance(preschoolContent);
const enforcedIssues = summary.issues.filter((issue) =>
  /Preschool recognition PLAY|Preschool concept and challenge PLAY|Preschool PLAY|correct answer/i.test(
    issue.issue
  )
);

topics.forEach((topic) => {
  const type = getPreschoolPlayType(topic.worldId, topic.topicTitle);
  const isChallenge = /challenge/i.test(topic.topicTitle);

  if (isChallenge && type === "picture-choice") {
    enforcedIssues.push({
      issue: `${topic.worldId} / ${topic.topicTitle} incorrectly uses Picture Choice.`,
    });
  }
});

if (!distribution.valid) {
  enforcedIssues.push({
    issue: `Preschool PLAY distribution is outside the learner-safe range: ${distribution.pictureChoicePercentage}% Picture Choice.`,
  });
}

if (enforcedIssues.length) {
  console.error("Preschool PLAY design validation failed:");
  enforcedIssues.slice(0, 60).forEach((issue) => console.error(`- ${issue.issue}`));
  process.exit(1);
}

console.log(
  `Preschool PLAY design validation passed (${distribution.total} topics; ${distribution.pictureChoicePercentage}% Picture Choice).`
);
