const SNAPSHOT_STORAGE_KEY =
  "nillaninja-business-dojo-v0.2-snapshots";

const SNAPSHOT_COLLECTION_SCHEMA_VERSION = "0.2";

function createEmptySnapshotCollection() {
  return {
    schemaVersion: SNAPSHOT_COLLECTION_SCHEMA_VERSION,
    updatedAt: null,
    snapshots: []
  };
}

function isValidSnapshotCollection(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    Array.isArray(value.snapshots)
  );
}

export function loadSnapshotCollection() {
  try {
    const savedCollection = localStorage.getItem(
      SNAPSHOT_STORAGE_KEY
    );

    if (!savedCollection) {
      return createEmptySnapshotCollection();
    }

    const parsedCollection = JSON.parse(savedCollection);

    if (!isValidSnapshotCollection(parsedCollection)) {
      return createEmptySnapshotCollection();
    }

    return {
      schemaVersion:
        parsedCollection.schemaVersion ||
        SNAPSHOT_COLLECTION_SCHEMA_VERSION,
      updatedAt: parsedCollection.updatedAt || null,
      snapshots: parsedCollection.snapshots
    };
  } catch (error) {
    console.error("Unable to restore saved snapshots.", error);
    return createEmptySnapshotCollection();
  }
}

export function saveSnapshotCollection(collection) {
  if (!isValidSnapshotCollection(collection)) {
    return false;
  }

  try {
    const collectionToSave = {
      schemaVersion: SNAPSHOT_COLLECTION_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      snapshots: structuredClone(collection.snapshots)
    };

    localStorage.setItem(
      SNAPSHOT_STORAGE_KEY,
      JSON.stringify(collectionToSave)
    );

    return true;
  } catch (error) {
    console.error("Unable to save snapshot collection.", error);
    return false;
  }
}

export function saveSnapshot(snapshot) {
  if (!snapshot?.id) {
    return false;
  }

  const collection = loadSnapshotCollection();
  const snapshotExists = collection.snapshots.some(
    (item) => item.id === snapshot.id
  );

  if (snapshotExists) {
    return true;
  }

  return saveSnapshotCollection({
    ...collection,
    snapshots: [
      ...collection.snapshots,
      structuredClone(snapshot)
    ]
  });
}

export function getSnapshotById(snapshotId) {
  if (!snapshotId) {
    return null;
  }

  const snapshot = loadSnapshotCollection().snapshots.find(
    (item) => item.id === snapshotId
  );

  return snapshot ? structuredClone(snapshot) : null;
}

export function getMostRecentSnapshot() {
  const snapshots = loadSnapshotCollection().snapshots;

  if (snapshots.length === 0) {
    return null;
  }

  const sortedSnapshots = [...snapshots].sort(
    (a, b) =>
      new Date(b.completedAt || b.createdAt || 0) -
      new Date(a.completedAt || a.createdAt || 0)
  );

  return structuredClone(sortedSnapshots[0]);
}

export function deleteSnapshot(snapshotId) {
  if (!snapshotId) {
    return false;
  }

  const collection = loadSnapshotCollection();
  const remainingSnapshots = collection.snapshots.filter(
    (item) => item.id !== snapshotId
  );

  if (remainingSnapshots.length === collection.snapshots.length) {
    return false;
  }

  return saveSnapshotCollection({
    ...collection,
    snapshots: remainingSnapshots
  });
}

export {
  SNAPSHOT_COLLECTION_SCHEMA_VERSION,
  SNAPSHOT_STORAGE_KEY
};
