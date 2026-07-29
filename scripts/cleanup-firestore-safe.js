const fs = require("fs");
const Module = require("module");
const os = require("os");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const projectId =
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  "batibot-app-e3cc9";

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

const admin = require("../firebase/functions/node_modules/firebase-admin");
const { VOCABULARY_ITEMS } = require("../src/data/vocabulary");

const args = new Set(process.argv.slice(2));
const applyChanges = args.has("--apply");
const skipVocabulary = args.has("--skip-vocabulary");
const skipLogs = args.has("--skip-logs");
const deleteAllLogs = args.has("--delete-all-logs");
const daysArg = process.argv.find((arg) => arg.startsWith("--days="));
const retentionDays = Math.max(
  0,
  Number.parseInt(daysArg ? daysArg.split("=")[1] : "30", 10) || 30
);

const LOG_COLLECTIONS = ["adminActivityLogs", "quizAttempts"];
const PROTECTED_COLLECTIONS = new Set([
  "users",
  "curatedQuizzes",
  "vocabularyItems",
]);

function getFirebaseCliAccessToken() {
  const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("Firebase CLI credential file was not found. Run `npx firebase-tools login` first.");
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const accessToken = config.tokens?.access_token;

  if (!accessToken) {
    throw new Error("Firebase CLI access token was not found. Run `npx firebase-tools projects:list` first.");
  }

  return accessToken;
}

function fromFirestoreValue(value) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if ("nullValue" in value) {
    return null;
  }

  if ("stringValue" in value) {
    return value.stringValue;
  }

  if ("timestampValue" in value) {
    return value.timestampValue;
  }

  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return Number(value.doubleValue);
  }

  if ("booleanValue" in value) {
    return Boolean(value.booleanValue);
  }

  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }

  if ("mapValue" in value) {
    return fromFirestoreFields(value.mapValue.fields || {});
  }

  return undefined;
}

function fromFirestoreFields(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)])
  );
}

async function firestoreRestRequest(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firestore REST request failed (${response.status}): ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function listRestDocuments(collectionName, accessToken) {
  const documents = [];
  let pageToken = "";

  do {
    const endpoint = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`
    );

    endpoint.searchParams.set("pageSize", "1000");

    if (pageToken) {
      endpoint.searchParams.set("pageToken", pageToken);
    }

    const result = await firestoreRestRequest(endpoint.toString(), accessToken);

    (result.documents || []).forEach((document) => {
      const id = decodeURIComponent(document.name.split("/").pop() || "");

      documents.push({
        data: () => fromFirestoreFields(document.fields || {}),
        id,
        name: document.name,
      });
    });

    pageToken = result.nextPageToken || "";
  } while (pageToken);

  return documents;
}

function getTimestampMillis(data) {
  const candidates = [
    data.createdAt,
    data.updatedAt,
    data.completedAt,
    data.startedAt,
    data.timestamp,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (typeof candidate.toMillis === "function") {
      return candidate.toMillis();
    }

    if (typeof candidate === "string") {
      const parsed = Date.parse(candidate);

      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    if (typeof candidate === "number") {
      return candidate;
    }
  }

  return null;
}

async function deleteInBatches(db, docs, label) {
  if (!applyChanges || docs.length === 0) {
    return;
  }

  const chunkSize = 450;

  for (let index = 0; index < docs.length; index += chunkSize) {
    const batch = db.batch();
    const chunk = docs.slice(index, index + chunkSize);

    chunk.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
    console.log(
      `Deleted ${label} ${Math.min(index + chunk.length, docs.length)} / ${docs.length}`
    );
  }
}

async function deleteRestDocuments(docs, label, accessToken) {
  if (!applyChanges || docs.length === 0) {
    return;
  }

  for (let index = 0; index < docs.length; index += 1) {
    const document = docs[index];

    await firestoreRestRequest(
      `https://firestore.googleapis.com/v1/${document.name}`,
      accessToken,
      { method: "DELETE" }
    );

    if ((index + 1) % 25 === 0 || index + 1 === docs.length) {
      console.log(`Deleted ${label} ${index + 1} / ${docs.length}`);
    }
  }
}

async function cleanVocabulary(db) {
  const currentIds = new Set(VOCABULARY_ITEMS.map((item) => item.id));
  const snapshot = await db.collection("vocabularyItems").get();
  const staleDocs = snapshot.docs.filter((document) => !currentIds.has(document.id));

  console.log(
    `[vocabularyItems] current local ids: ${currentIds.size}; remote docs: ${snapshot.size}; stale docs: ${staleDocs.length}`
  );

  staleDocs.slice(0, 25).forEach((document) => {
    console.log(`  stale vocabulary: ${document.id}`);
  });

  if (staleDocs.length > 25) {
    console.log(`  ...and ${staleDocs.length - 25} more stale vocabulary docs`);
  }

  await deleteInBatches(db, staleDocs, "stale vocabulary docs");
}

async function cleanVocabularyRest(accessToken) {
  const currentIds = new Set(VOCABULARY_ITEMS.map((item) => item.id));
  const documents = await listRestDocuments("vocabularyItems", accessToken);
  const staleDocs = documents.filter((document) => !currentIds.has(document.id));

  console.log(
    `[vocabularyItems] current local ids: ${currentIds.size}; remote docs: ${documents.length}; stale docs: ${staleDocs.length}`
  );

  staleDocs.slice(0, 25).forEach((document) => {
    console.log(`  stale vocabulary: ${document.id}`);
  });

  if (staleDocs.length > 25) {
    console.log(`  ...and ${staleDocs.length - 25} more stale vocabulary docs`);
  }

  await deleteRestDocuments(staleDocs, "stale vocabulary docs", accessToken);
}

async function cleanLogs(db) {
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  for (const collectionName of LOG_COLLECTIONS) {
    if (PROTECTED_COLLECTIONS.has(collectionName)) {
      throw new Error(`Refusing to clean protected collection: ${collectionName}`);
    }

    const snapshot = await db.collection(collectionName).get();
    const oldDocs = snapshot.docs.filter((document) => {
      if (deleteAllLogs) {
        return true;
      }

      const timestampMillis = getTimestampMillis(document.data());

      return timestampMillis !== null && timestampMillis < cutoff;
    });

    const mode = deleteAllLogs
      ? "all log docs"
      : `log docs older than ${retentionDays} days`;

    console.log(
      `[${collectionName}] remote docs: ${snapshot.size}; cleanup candidates (${mode}): ${oldDocs.length}`
    );

    oldDocs.slice(0, 25).forEach((document) => {
      console.log(`  log candidate: ${collectionName}/${document.id}`);
    });

    if (oldDocs.length > 25) {
      console.log(`  ...and ${oldDocs.length - 25} more ${collectionName} docs`);
    }

    await deleteInBatches(db, oldDocs, `${collectionName} docs`);
  }
}

async function cleanLogsRest(accessToken) {
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

  for (const collectionName of LOG_COLLECTIONS) {
    if (PROTECTED_COLLECTIONS.has(collectionName)) {
      throw new Error(`Refusing to clean protected collection: ${collectionName}`);
    }

    const documents = await listRestDocuments(collectionName, accessToken);
    const oldDocs = documents.filter((document) => {
      if (deleteAllLogs) {
        return true;
      }

      const timestampMillis = getTimestampMillis(document.data());

      return timestampMillis !== null && timestampMillis < cutoff;
    });

    const mode = deleteAllLogs
      ? "all log docs"
      : `log docs older than ${retentionDays} days`;

    console.log(
      `[${collectionName}] remote docs: ${documents.length}; cleanup candidates (${mode}): ${oldDocs.length}`
    );

    oldDocs.slice(0, 25).forEach((document) => {
      console.log(`  log candidate: ${collectionName}/${document.id}`);
    });

    if (oldDocs.length > 25) {
      console.log(`  ...and ${oldDocs.length - 25} more ${collectionName} docs`);
    }

    await deleteRestDocuments(oldDocs, `${collectionName} docs`, accessToken);
  }
}

async function runCleanupWithAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }

  const db = admin.firestore();

  if (!skipVocabulary) {
    await cleanVocabulary(db);
  }

  if (!skipLogs) {
    await cleanLogs(db);
  }
}

async function runCleanupWithRest() {
  const accessToken = getFirebaseCliAccessToken();

  console.log("Using Firebase CLI credentials through Firestore REST fallback.");

  if (!skipVocabulary) {
    await cleanVocabularyRest(accessToken);
  }

  if (!skipLogs) {
    await cleanLogsRest(accessToken);
  }
}

async function main() {
  console.log(`Firestore safe cleanup for project ${projectId}`);
  console.log(applyChanges ? "Mode: APPLY deletes enabled" : "Mode: DRY RUN only");
  console.log(
    deleteAllLogs
      ? "Log retention: delete all configured log docs when --apply is used"
      : `Log retention: keep docs newer than ${retentionDays} days`
  );

  try {
    await runCleanupWithAdmin();
  } catch (error) {
    const message = String(error?.message || error);

    if (!message.includes("Could not load the default credentials")) {
      throw error;
    }

    console.log("Application default credentials unavailable; trying Firebase CLI token.");
    await runCleanupWithRest();
  }

  if (!applyChanges) {
    console.log("Dry run complete. Re-run with --apply to delete listed candidates.");
  } else {
    console.log("Firestore cleanup complete.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
