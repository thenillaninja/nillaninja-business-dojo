import {
  createReassessmentPlan,
  getReassessmentStatus
} from "../js/core/reassessment.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const snapshot = {
  id: "snapshot-benchmark-001",
  completedAt: "2026-08-07T04:00:00.000Z",
  business: {
    name: "Harbor Street Market",
    normalizedName: "harbor street market"
  }
};

const originalSnapshot = structuredClone(snapshot);

const plan30 = createReassessmentPlan(
  snapshot,
  30,
  {
    createdAt: "2026-08-07T05:00:00.000Z"
  }
);

assert(
  plan30?.sourceSnapshotId === snapshot.id,
  "Reassessment plan was not linked to its source snapshot."
);

assert(
  plan30?.business?.normalizedName ===
    "harbor street market",
  "Business identity was not preserved."
);

assert(
  plan30?.intervalDays === 30,
  "30-day reassessment interval was not preserved."
);

assert(
  plan30?.scheduledFor === "2026-09-06",
  "30-day reassessment date was calculated incorrectly."
);

const plan60 = createReassessmentPlan(
  snapshot,
  60,
  {
    createdAt: "2026-08-07T05:00:00.000Z"
  }
);

assert(
  plan60?.scheduledFor === "2026-10-06",
  "60-day reassessment date was calculated incorrectly."
);

const plan90 = createReassessmentPlan(
  snapshot,
  90,
  {
    createdAt: "2026-08-07T05:00:00.000Z"
  }
);

assert(
  plan90?.scheduledFor === "2026-11-05",
  "90-day reassessment date was calculated incorrectly."
);

assert(
  createReassessmentPlan(snapshot, 45) === null,
  "Unsupported reassessment interval was accepted."
);

assert(
  createReassessmentPlan(null, 30) === null,
  "Missing snapshot was accepted."
);

assert(
  JSON.stringify(snapshot) ===
    JSON.stringify(originalSnapshot),
  "Reassessment planning mutated snapshot data."
);

const scheduledStatus = getReassessmentStatus(
  plan30,
  {
    today: "2026-08-20T12:00:00.000Z"
  }
);

assert(
  scheduledStatus.status === "scheduled" &&
    scheduledStatus.daysUntil === 17,
  "Scheduled reassessment status was incorrect."
);

const approachingStatus = getReassessmentStatus(
  plan30,
  {
    today: "2026-09-01T12:00:00.000Z",
    approachingDays: 7
  }
);

assert(
  approachingStatus.status === "approaching" &&
    approachingStatus.daysUntil === 5,
  "Approaching reassessment status was incorrect."
);

const dueStatus = getReassessmentStatus(
  plan30,
  {
    today: "2026-09-06T12:00:00.000Z"
  }
);

assert(
  dueStatus.status === "due" &&
    dueStatus.daysUntil === 0,
  "Due reassessment status was incorrect."
);

const overdueStatus = getReassessmentStatus(
  plan30,
  {
    today: "2026-09-10T12:00:00.000Z"
  }
);

assert(
  overdueStatus.status === "overdue" &&
    overdueStatus.daysOverdue === 4,
  "Overdue reassessment status was incorrect."
);

const unavailableStatus =
  getReassessmentStatus(null);

assert(
  unavailableStatus.status === "unavailable",
  "Missing legacy reassessment data was not handled safely."
);

console.log("REASSESSMENT TESTS");
console.log("30/60/90-day scheduling: pass");
console.log("Snapshot linkage: pass");
console.log("Interval validation: pass");
console.log("Scheduled status: pass");
console.log("Approaching status: pass");
console.log("Due status: pass");
console.log("Overdue status: pass");
console.log("Legacy missing-data handling: pass");
console.log("Snapshot immutability: pass");
