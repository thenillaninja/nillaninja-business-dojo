const BUSINESS_MEMORY_STORAGE_KEY =
  "nillaninja-business-dojo-v0.4-business-memory";

const BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION = "0.4";

function createEmptyBusinessMemoryCollection() {
  return {
    schemaVersion: BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION,
    updatedAt: null,
    records: []
  };
}

function isValidBusinessMemoryCollection(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    Array.isArray(value.records)
  );
}

export function loadBusinessMemoryCollection() {
  try {
    const savedCollection = localStorage.getItem(
      BUSINESS_MEMORY_STORAGE_KEY
    );

    if (!savedCollection) {
      return createEmptyBusinessMemoryCollection();
    }

    const parsedCollection = JSON.parse(savedCollection);

    if (!isValidBusinessMemoryCollection(parsedCollection)) {
      return createEmptyBusinessMemoryCollection();
    }

    return structuredClone({
      schemaVersion:
        parsedCollection.schemaVersion ||
        BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION,
      updatedAt: parsedCollection.updatedAt || null,
      records: parsedCollection.records
    });
  } catch (error) {
    console.error(
      "Unable to restore business memory.",
      error
    );

    return createEmptyBusinessMemoryCollection();
  }
}

export function saveBusinessMemoryCollection(collection) {
  if (!isValidBusinessMemoryCollection(collection)) {
    return false;
  }

  try {
    const collectionToSave = {
      schemaVersion:
        BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      records: structuredClone(collection.records)
    };

    localStorage.setItem(
      BUSINESS_MEMORY_STORAGE_KEY,
      JSON.stringify(collectionToSave)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save business memory.",
      error
    );

    return false;
  }
}


export function saveBusinessMemoryRecord(record) {
  if (
    !record?.id ||
    !record?.source?.snapshotId ||
    !record?.source?.recommendationId
  ) {
    return false;
  }

  const collection = loadBusinessMemoryCollection();

  const existingIndex = collection.records.findIndex(
    (item) =>
      item?.source?.snapshotId === record.source.snapshotId &&
      item?.source?.recommendationId ===
        record.source.recommendationId
  );

  const updatedRecords = [...collection.records];

  if (existingIndex >= 0) {
    updatedRecords[existingIndex] = structuredClone(record);
  } else {
    updatedRecords.push(structuredClone(record));
  }

  return saveBusinessMemoryCollection({
    ...collection,
    records: updatedRecords
  });
}


export function getBusinessMemoryRecord(
  snapshotId,
  recommendationId
) {
  if (!snapshotId || !recommendationId) {
    return null;
  }

  const record = loadBusinessMemoryCollection().records.find(
    (item) =>
      item?.source?.snapshotId === snapshotId &&
      item?.source?.recommendationId === recommendationId
  );

  return record ? structuredClone(record) : null;
}

export function deleteBusinessMemoryRecord(
  snapshotId,
  recommendationId
) {
  if (!snapshotId || !recommendationId) {
    return false;
  }

  const collection = loadBusinessMemoryCollection();

  const remainingRecords = collection.records.filter(
    (item) =>
      !(
        item?.source?.snapshotId === snapshotId &&
        item?.source?.recommendationId === recommendationId
      )
  );

  if (remainingRecords.length === collection.records.length) {
    return false;
  }

  return saveBusinessMemoryCollection({
    ...collection,
    records: remainingRecords
  });
}

export {
  BUSINESS_MEMORY_COLLECTION_SCHEMA_VERSION,
  BUSINESS_MEMORY_STORAGE_KEY
};
