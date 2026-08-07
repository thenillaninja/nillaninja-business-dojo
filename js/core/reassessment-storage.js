const REASSESSMENT_STORAGE_KEY =
  "nillaninja-business-dojo-v0.3-reassessments";

const REASSESSMENT_COLLECTION_SCHEMA_VERSION = "0.3";

function createEmptyReassessmentCollection() {
  return {
    schemaVersion: REASSESSMENT_COLLECTION_SCHEMA_VERSION,
    updatedAt: null,
    plans: []
  };
}

function isValidReassessmentCollection(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    Array.isArray(value.plans)
  );
}

export function loadReassessmentCollection() {
  try {
    const savedCollection = localStorage.getItem(
      REASSESSMENT_STORAGE_KEY
    );

    if (!savedCollection) {
      return createEmptyReassessmentCollection();
    }

    const parsedCollection = JSON.parse(savedCollection);

    if (!isValidReassessmentCollection(parsedCollection)) {
      return createEmptyReassessmentCollection();
    }

    return structuredClone({
      schemaVersion:
        parsedCollection.schemaVersion ||
        REASSESSMENT_COLLECTION_SCHEMA_VERSION,
      updatedAt: parsedCollection.updatedAt || null,
      plans: parsedCollection.plans
    });
  } catch (error) {
    console.error(
      "Unable to restore reassessment plans.",
      error
    );

    return createEmptyReassessmentCollection();
  }
}

export function saveReassessmentCollection(collection) {
  if (!isValidReassessmentCollection(collection)) {
    return false;
  }

  try {
    const collectionToSave = {
      schemaVersion:
        REASSESSMENT_COLLECTION_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      plans: structuredClone(collection.plans)
    };

    localStorage.setItem(
      REASSESSMENT_STORAGE_KEY,
      JSON.stringify(collectionToSave)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save reassessment plans.",
      error
    );

    return false;
  }
}

export function saveReassessmentPlan(plan) {
  if (!plan?.sourceSnapshotId) {
    return false;
  }

  const collection = loadReassessmentCollection();

  const existingIndex = collection.plans.findIndex(
    (item) =>
      item.sourceSnapshotId === plan.sourceSnapshotId
  );

  const updatedPlans = [...collection.plans];

  if (existingIndex >= 0) {
    updatedPlans[existingIndex] =
      structuredClone(plan);
  } else {
    updatedPlans.push(structuredClone(plan));
  }

  return saveReassessmentCollection({
    ...collection,
    plans: updatedPlans
  });
}

export function getReassessmentPlanBySnapshotId(
  snapshotId
) {
  if (!snapshotId) {
    return null;
  }

  const plan = loadReassessmentCollection().plans.find(
    (item) => item.sourceSnapshotId === snapshotId
  );

  return plan ? structuredClone(plan) : null;
}

export function deleteReassessmentPlan(snapshotId) {
  if (!snapshotId) {
    return false;
  }

  const collection = loadReassessmentCollection();

  const remainingPlans = collection.plans.filter(
    (item) => item.sourceSnapshotId !== snapshotId
  );

  if (remainingPlans.length === collection.plans.length) {
    return false;
  }

  return saveReassessmentCollection({
    ...collection,
    plans: remainingPlans
  });
}

export {
  REASSESSMENT_COLLECTION_SCHEMA_VERSION,
  REASSESSMENT_STORAGE_KEY
};
