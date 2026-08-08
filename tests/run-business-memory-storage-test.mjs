const storage = new Map();

global.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },
  setItem(key, value) {
    storage.set(key, String(value));
  },
  removeItem(key) {
    storage.delete(key);
  },
  clear() {
    storage.clear();
  }
};

const {
  BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION,
  BUSINESS_MEMORY_STORAGE_KEY,
  loadBusinessMemoryCollection,
  saveBusinessMemoryCollection,
  saveBusinessMemoryRecord,
  getBusinessMemoryRecord,
  deleteBusinessMemoryRecord
} = await import("../js/core/business-memory-storage.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeRecord(overrides = {}) {
  return {
    id: "memory-1",
    schemaVersion: "0.4",
    appVersion: "0.4",
    business: {
      name: "Harbor Street Market",
      normalizedName: "harbor street market"
    },
    source: {
      snapshotId: "snapshot-1",
      actionPlanId: "action-plan-1",
      recommendationId: "standardize-customer-follow-up"
    },
    change: {
      summary: "Created a follow-up process.",
      details: ""
    },
    createdAt: "2026-08-07T00:00:00.000Z",
    updatedAt: "2026-08-07T00:00:00.000Z",
    ...overrides
  };
}

console.log("BUSINESS MEMORY STORAGE TESTS");

localStorage.clear();

const emptyCollection = loadBusinessMemoryCollection();

assert(
  emptyCollection.schemaVersion ===
    BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION &&
    Array.isArray(emptyCollection.records) &&
    emptyCollection.records.length === 0,
  "Empty collection test failed."
);

console.log("Empty collection: pass");

const malformedKey = BUSINESS_MEMORY_STORAGE_KEY;

localStorage.setItem(
  malformedKey,
  JSON.stringify({
    schemaVersion: "0.4",
    records: "not-an-array"
  })
);

const malformedResult = loadBusinessMemoryCollection();

assert(
  Array.isArray(malformedResult.records) &&
    malformedResult.records.length === 0,
  "Malformed collection fallback test failed."
);

console.log("Malformed collection fallback: pass");

localStorage.clear();

const record = makeRecord();

assert(
  saveBusinessMemoryRecord(record) === true,
  "Record save test failed."
);

const savedRecord = getBusinessMemoryRecord(
  "snapshot-1",
  "standardize-customer-follow-up"
);

assert(
  savedRecord?.id === "memory-1",
  "Record retrieval test failed."
);

console.log("Save and retrieve record: pass");

record.change.summary = "Mutated outside storage";

const clonedRecord = getBusinessMemoryRecord(
  "snapshot-1",
  "standardize-customer-follow-up"
);

assert(
  clonedRecord.change.summary ===
    "Created a follow-up process.",
  "Stored record was mutated by caller."
);

console.log("Stored record immutability: pass");

const updatedRecord = {
  ...clonedRecord,
  id: "memory-2",
  change: {
    ...clonedRecord.change,
    summary: "Created a two-step follow-up process."
  }
};

assert(
  saveBusinessMemoryRecord(updatedRecord) === true,
  "Duplicate relationship update test failed."
);

const afterUpdate = loadBusinessMemoryCollection();

assert(
  afterUpdate.records.length === 1 &&
    afterUpdate.records[0].id === "memory-2" &&
    afterUpdate.records[0].change.summary ===
      "Created a two-step follow-up process.",
  "Duplicate relationship created an extra record."
);

console.log("Duplicate relationship update: pass");

assert(
  saveBusinessMemoryCollection({
    schemaVersion: "0.4",
    updatedAt: null,
    records: []
  }) === true,
  "Collection save test failed."
);

console.log("Collection save: pass");

saveBusinessMemoryRecord(makeRecord());

assert(
  deleteBusinessMemoryRecord(
    "snapshot-1",
    "standardize-customer-follow-up"
  ) === true,
  "Record deletion test failed."
);

assert(
  getBusinessMemoryRecord(
    "snapshot-1",
    "standardize-customer-follow-up"
  ) === null,
  "Deleted record could still be retrieved."
);

console.log("Delete record: pass");

assert(
  saveBusinessMemoryRecord({ id: "invalid" }) === false &&
    getBusinessMemoryRecord("", "") === null &&
    deleteBusinessMemoryRecord("", "") === false,
  "Invalid input handling test failed."
);

console.log("Invalid input handling: pass");

localStorage.setItem(
  BUSINESS_MEMORY_STORAGE_KEY,
  JSON.stringify({
    schemaVersion: "0.4",
    updatedAt: null,
    records: [
      {
        id: "broken-record",
        schemaVersion: "0.4",
        business: {
          name: "Broken Business",
          normalizedName: "broken business"
        },
        source: {
          snapshotId: "snapshot-1"
        },
        createdAt: "2026-08-07T12:00:00.000Z",
        updatedAt: "2026-08-07T12:00:00.000Z"
      }
    ]
  })
);

const malformedRecordCollection =
  loadBusinessMemoryCollection();

assert(
  malformedRecordCollection.records.length === 0 &&
    malformedRecordCollection.schemaVersion === "0.4",
  "Malformed record fallback failed."
);

console.log("Malformed record fallback: pass");

const invalidCollectionSave = saveBusinessMemoryCollection({
  schemaVersion: "0.4",
  records: [
    {
      id: "incomplete-record"
    }
  ]
});

assert(
  invalidCollectionSave === false,
  "Invalid collection record validation failed."
);

console.log("Invalid collection record validation: pass");
