const ACTION_PLAN_STORAGE_KEY =
  "nillaninja-business-dojo-v0.2-action-plans";

const ACTION_PLAN_COLLECTION_SCHEMA_VERSION = "0.2";

function createEmptyActionPlanCollection() {
  return {
    schemaVersion: ACTION_PLAN_COLLECTION_SCHEMA_VERSION,
    updatedAt: null,
    actionPlans: []
  };
}

function isValidActionPlanCollection(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    Array.isArray(value.actionPlans)
  );
}

export function loadActionPlanCollection() {
  try {
    const savedCollection = localStorage.getItem(
      ACTION_PLAN_STORAGE_KEY
    );

    if (!savedCollection) {
      return createEmptyActionPlanCollection();
    }

    const parsedCollection = JSON.parse(savedCollection);

    if (!isValidActionPlanCollection(parsedCollection)) {
      return createEmptyActionPlanCollection();
    }

    return {
      schemaVersion:
        parsedCollection.schemaVersion ||
        ACTION_PLAN_COLLECTION_SCHEMA_VERSION,
      updatedAt: parsedCollection.updatedAt || null,
      actionPlans: parsedCollection.actionPlans
    };
  } catch (error) {
    console.error("Unable to restore action plans.", error);
    return createEmptyActionPlanCollection();
  }
}

export function saveActionPlanCollection(collection) {
  if (!isValidActionPlanCollection(collection)) {
    return false;
  }

  try {
    const collectionToSave = {
      schemaVersion:
        ACTION_PLAN_COLLECTION_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      actionPlans: structuredClone(collection.actionPlans)
    };

    localStorage.setItem(
      ACTION_PLAN_STORAGE_KEY,
      JSON.stringify(collectionToSave)
    );

    return true;
  } catch (error) {
    console.error("Unable to save action plan collection.", error);
    return false;
  }
}

export function saveActionPlan(actionPlan) {
  if (!actionPlan?.id || !actionPlan?.snapshotId) {
    return false;
  }

  const collection = loadActionPlanCollection();
  const existingIndex = collection.actionPlans.findIndex(
    (item) => item.snapshotId === actionPlan.snapshotId
  );

  const updatedPlans = [...collection.actionPlans];

  if (existingIndex >= 0) {
    updatedPlans[existingIndex] = structuredClone(actionPlan);
  } else {
    updatedPlans.push(structuredClone(actionPlan));
  }

  return saveActionPlanCollection({
    ...collection,
    actionPlans: updatedPlans
  });
}

export function getActionPlanBySnapshotId(snapshotId) {
  if (!snapshotId) {
    return null;
  }

  const actionPlan = loadActionPlanCollection().actionPlans.find(
    (item) => item.snapshotId === snapshotId
  );

  return actionPlan ? structuredClone(actionPlan) : null;
}

export function deleteActionPlanBySnapshotId(snapshotId) {
  if (!snapshotId) {
    return false;
  }

  const collection = loadActionPlanCollection();
  const remainingPlans = collection.actionPlans.filter(
    (item) => item.snapshotId !== snapshotId
  );

  if (remainingPlans.length === collection.actionPlans.length) {
    return false;
  }

  return saveActionPlanCollection({
    ...collection,
    actionPlans: remainingPlans
  });
}

export {
  ACTION_PLAN_COLLECTION_SCHEMA_VERSION,
  ACTION_PLAN_STORAGE_KEY
};
