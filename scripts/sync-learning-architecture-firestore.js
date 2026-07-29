const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const admin = require("../firebase/functions/node_modules/firebase-admin");

const COLLECTIONS = {
  activities: "activities",
  challenges: "challenges",
  curriculumLevels: "curriculumLevels",
  rewards: "rewards",
  stages: "stages",
  topics: "topics",
  worlds: "worlds",
};

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(rootDir, request.slice(2)),
      parent,
      isMain,
      options
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTs(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(transpiled.outputText, filename);
};

const {
  buildLearningArchitectureSnapshot,
  validateLearningArchitectureSnapshot,
} = require("../src/data/curriculum/firestore-architecture");

function parseArgs() {
  const args = new Set(process.argv.slice(2));

  return {
    dryRun: args.has("--dry-run"),
    exportJson: args.has("--export-json"),
  };
}

function countSnapshot(snapshot) {
  return Object.fromEntries(
    Object.entries(COLLECTIONS).map(([key]) => [key, snapshot[key].length])
  );
}

async function deleteStaleDocuments(db, collectionName, currentIds) {
  const snapshot = await db.collection(collectionName).get();
  const staleDocs = snapshot.docs.filter((doc) => !currentIds.has(doc.id));

  for (let index = 0; index < staleDocs.length; index += 400) {
    const batch = db.batch();
    staleDocs.slice(index, index + 400).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  return staleDocs.length;
}

async function writeCollection(db, collectionName, documents, timestamp) {
  let deletedCount = 0;

  deletedCount = await deleteStaleDocuments(
    db,
    collectionName,
    new Set(documents.map((document) => document.id))
  );

  for (let index = 0; index < documents.length; index += 400) {
    const batch = db.batch();

    documents.slice(index, index + 400).forEach((document) => {
      const { id, ...data } = document;
      batch.set(db.collection(collectionName).doc(id), {
        id,
        ...data,
        updatedAt: timestamp,
      });
    });

    await batch.commit();
  }

  return {
    deletedCount,
    writtenCount: documents.length,
  };
}

async function syncSnapshot(snapshot) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const results = {};

  for (const [snapshotKey, collectionName] of Object.entries(COLLECTIONS)) {
    results[collectionName] = await writeCollection(
      db,
      collectionName,
      snapshot[snapshotKey],
      timestamp
    );
  }

  return results;
}

async function main() {
  const options = parseArgs();
  const snapshot = buildLearningArchitectureSnapshot();
  const validation = validateLearningArchitectureSnapshot(snapshot);

  if (!validation.isValid) {
    console.error("Learning architecture validation failed:");
    validation.errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  const counts = countSnapshot(snapshot);

  if (options.exportJson) {
    const outputPath = path.join(rootDir, "logs", "learning-architecture-export.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2));
    console.log(`Exported learning architecture to ${outputPath}`);
  }

  if (options.dryRun) {
    console.log("Learning architecture validation passed.");
    console.log(JSON.stringify(counts, null, 2));
    return;
  }

  const results = await syncSnapshot(snapshot);
  console.log("Learning architecture Firestore sync complete.");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
