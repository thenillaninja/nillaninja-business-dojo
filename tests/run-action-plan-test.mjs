import {
  createActionPlanRecord
} from "../js/core/action-plans.js";

import {
  saveActionPlan,
  getActionPlanBySnapshotId,
  loadActionPlanCollection,
  deleteActionPlanBySnapshotId
} from "../js/core/action-plan-storage.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const memory = new Map();

globalThis.localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  }
};

const snapshot = {
  id: "snapshot-test-001",
  business: {
    name: "Harbor Street Market",
    normalizedName: "harbor street market"
  },
  results: {
    recommendations: [
      {
        id: "enable-multi-factor-authentication",
        firstAction:
          "List every important account that does not use multi-factor authentication."
      },
      {
        id: "document-recurring-processes",
        firstAction:
          "Choose one recurring task and document its steps."
      }
    ]
  }
};

const originalSnapshot = structuredClone(snapshot);
const actionPlan = createActionPlanRecord(snapshot);

assert(Boolean(actionPlan?.id), "Action plan ID was not created.");
assert(
  actionPlan.snapshotId === snapshot.id,
  "Action plan was not linked to the snapshot."
);
assert(actionPlan.items.length === 2, "Incorrect action item count.");
assert(
  actionPlan.items.every((item) => item.status === "not-started"),
  "Action items did not start with the correct status."
);
assert(
  JSON.stringify(snapshot) === JSON.stringify(originalSnapshot),
  "The snapshot was modified."
);

assert(saveActionPlan(actionPlan), "Action plan did not save.");

const retrieved = getActionPlanBySnapshotId(snapshot.id);

assert(Boolean(retrieved), "Saved action plan was not found.");

retrieved.items[0].status = "in-progress";
retrieved.updatedAt = new Date().toISOString();

assert(saveActionPlan(retrieved), "Updated action plan did not save.");

const updatedCollection = loadActionPlanCollection();
const updatedPlan = getActionPlanBySnapshotId(snapshot.id);

assert(
  updatedCollection.actionPlans.length === 1,
  "Updating created a duplicate action plan."
);
assert(
  updatedPlan.items[0].status === "in-progress",
  "Updated status did not persist."
);

assert(
  deleteActionPlanBySnapshotId(snapshot.id),
  "Action plan was not deleted."
);
assert(
  loadActionPlanCollection().actionPlans.length === 0,
  "Action plan collection was not empty after deletion."
);

console.log("ACTION PLAN TESTS");
console.log("Creation: pass");
console.log("Storage and retrieval: pass");
console.log("Update without duplication: pass");
console.log("Deletion: pass");
console.log("Snapshot immutability: pass");
