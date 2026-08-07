import {
  deleteReassessmentPlan,
  getReassessmentPlanBySnapshotId,
  loadReassessmentCollection,
  saveReassessmentPlan
} from "../js/core/reassessment-storage.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const memory = new Map();

global.localStorage = {
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

const plan = {
  sourceSnapshotId: "snapshot-1",
  business: {
    name: "Harbor Street Market",
    normalizedName: "harbor street market"
  },
  intervalDays: 60,
  scheduledFor: "2026-10-06",
  createdAt: "2026-08-07T05:00:00.000Z",
  updatedAt: "2026-08-07T05:00:00.000Z"
};

assert(
  saveReassessmentPlan(plan) === true,
  "Valid reassessment plan was not saved."
);

const collection = loadReassessmentCollection();

assert(
  collection.plans.length === 1,
  "Saved reassessment plan was not loaded."
);

const restored = getReassessmentPlanBySnapshotId(
  "snapshot-1"
);

assert(
  restored?.scheduledFor === "2026-10-06",
  "Reassessment plan lookup by snapshot failed."
);

restored.intervalDays = 90;

assert(
  getReassessmentPlanBySnapshotId("snapshot-1")
    ?.intervalDays === 60,
  "Retrieved reassessment plan was not cloned."
);

const updatedPlan = {
  ...plan,
  intervalDays: 90,
  scheduledFor: "2026-11-05",
  updatedAt: "2026-08-08T05:00:00.000Z"
};

assert(
  saveReassessmentPlan(updatedPlan) === true,
  "Existing reassessment plan was not updated."
);

assert(
  loadReassessmentCollection().plans.length === 1 &&
    getReassessmentPlanBySnapshotId("snapshot-1")
      ?.intervalDays === 90,
  "Reassessment plan update created a duplicate."
);

assert(
  deleteReassessmentPlan("snapshot-1") === true,
  "Reassessment plan was not deleted."
);

assert(
  getReassessmentPlanBySnapshotId("snapshot-1") === null,
  "Deleted reassessment plan was still available."
);

console.log("REASSESSMENT STORAGE TESTS");
console.log("Save and load: pass");
console.log("Snapshot lookup: pass");
console.log("Clone protection: pass");
console.log("Update without duplication: pass");
console.log("Deletion: pass");
