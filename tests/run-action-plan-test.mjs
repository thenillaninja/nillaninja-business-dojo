import {
  createActionPlanRecord,
  updateActionItemFields,
  updateActionItemStatus
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

const originalActionPlan = structuredClone(actionPlan);

const fieldUpdatedPlan = updateActionItemFields(
  actionPlan,
  "enable-multi-factor-authentication",
  {
    targetDate: "2026-09-15",
    responsiblePerson: "Mark",
    notes: "Review the most important accounts first.",
    unsupportedField: "should not be saved"
  }
);

assert(Boolean(fieldUpdatedPlan), "Editable-field update failed.");
assert(
  fieldUpdatedPlan.items[0].targetDate === "2026-09-15",
  "Target date did not update."
);
assert(
  fieldUpdatedPlan.items[0].responsiblePerson === "Mark",
  "Responsible person did not update."
);
assert(
  fieldUpdatedPlan.items[0].notes ===
    "Review the most important accounts first.",
  "Notes did not update."
);
assert(
  !("unsupportedField" in fieldUpdatedPlan.items[0]),
  "Unsupported field was saved."
);
assert(
  JSON.stringify(actionPlan) === JSON.stringify(originalActionPlan),
  "Editable-field update mutated the original action plan."
);

const inProgressPlan = updateActionItemStatus(
  actionPlan,
  "enable-multi-factor-authentication",
  "in-progress"
);

assert(Boolean(inProgressPlan), "In-progress update failed.");
assert(
  inProgressPlan.items[0].status === "in-progress",
  "Status did not change to in-progress."
);
assert(
  Boolean(inProgressPlan.items[0].startedAt),
  "In-progress status did not record startedAt."
);
assert(
  inProgressPlan.items[0].completedAt === null,
  "In-progress status should not have completedAt."
);
assert(
  JSON.stringify(actionPlan) === JSON.stringify(originalActionPlan),
  "Status update mutated the original action plan."
);

const completePlan = updateActionItemStatus(
  inProgressPlan,
  "enable-multi-factor-authentication",
  "complete"
);

assert(
  completePlan.items[0].status === "complete",
  "Status did not change to complete."
);
assert(
  completePlan.items[0].startedAt ===
    inProgressPlan.items[0].startedAt,
  "Completing the item replaced its original startedAt."
);
assert(
  Boolean(completePlan.items[0].completedAt),
  "Complete status did not record completedAt."
);

const resetPlan = updateActionItemStatus(
  completePlan,
  "enable-multi-factor-authentication",
  "not-started"
);

assert(
  resetPlan.items[0].startedAt === null &&
    resetPlan.items[0].completedAt === null,
  "Resetting the item did not clear its timestamps."
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
console.log("Editable fields and immutability: pass");
console.log("Status transitions and timestamps: pass");
console.log("Status update immutability: pass");
console.log("Storage and retrieval: pass");
console.log("Update without duplication: pass");
console.log("Deletion: pass");
console.log("Snapshot immutability: pass");
