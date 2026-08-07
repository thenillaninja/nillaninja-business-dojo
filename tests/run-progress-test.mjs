import {
  summarizeActionPlanProgress
} from "../js/core/progress.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const snapshot = {
  id: "snapshot-progress-001",
  results: {
    recommendations: [
      {
        id: "urgent-security",
        title: "Enable multi-factor authentication",
        priority: "immediate"
      },
      {
        id: "document-processes",
        title: "Document recurring processes",
        priority: "high"
      },
      {
        id: "customer-follow-up",
        title: "Standardize customer follow-up",
        priority: "medium"
      },
      {
        id: "future-improvement",
        title: "Review long-term improvements",
        priority: "future"
      }
    ]
  }
};

const actionPlan = {
  id: "action-plan-progress-001",
  snapshotId: snapshot.id,
  items: [
    {
      recommendationId: "urgent-security",
      status: "not-started",
      targetDate: "2026-08-05",
      completedAt: null,
      checklist: [
        {
          id: "check-1",
          completed: true
        },
        {
          id: "check-2",
          completed: false
        }
      ]
    },
    {
      recommendationId: "document-processes",
      status: "in-progress",
      targetDate: "2026-08-20",
      completedAt: null,
      checklist: [
        {
          id: "check-3",
          completed: true
        }
      ]
    },
    {
      recommendationId: "customer-follow-up",
      status: "complete",
      targetDate: "2026-08-01",
      completedAt: "2026-08-04T12:00:00.000Z",
      checklist: []
    },
    {
      recommendationId: "future-improvement",
      status: "complete",
      targetDate: null,
      completedAt: "2026-05-01T12:00:00.000Z",
      checklist: [
        {
          id: "check-4",
          completed: false
        }
      ]
    }
  ]
};

const originalActionPlan = structuredClone(actionPlan);
const originalSnapshot = structuredClone(snapshot);

const summary = summarizeActionPlanProgress(
  actionPlan,
  snapshot,
  {
    today: "2026-08-06T12:00:00.000Z",
    upcomingDays: 30,
    recentDays: 30
  }
);

assert(summary.totalItems === 4, "Total item count was incorrect.");

assert(
  summary.statusTotals.notStarted === 1,
  "Not-started count was incorrect."
);

assert(
  summary.statusTotals.inProgress === 1,
  "In-progress count was incorrect."
);

assert(
  summary.statusTotals.complete === 2,
  "Complete count was incorrect."
);

assert(
  summary.completionPercentage === 50,
  "Completion percentage was incorrect."
);

assert(
  summary.priorityRemaining.immediate === 1,
  "Immediate-priority remaining count was incorrect."
);

assert(
  summary.priorityRemaining.high === 1,
  "High-priority remaining count was incorrect."
);

assert(
  summary.dates.overdue.length === 1 &&
    summary.dates.overdue[0].recommendationId ===
      "urgent-security",
  "Overdue target dates were calculated incorrectly."
);

assert(
  summary.dates.upcoming.length === 1 &&
    summary.dates.upcoming[0].recommendationId ===
      "document-processes",
  "Upcoming target dates were calculated incorrectly."
);

assert(
  summary.recentlyCompleted.length === 1 &&
    summary.recentlyCompleted[0].recommendationId ===
      "customer-follow-up",
  "Recently completed items were calculated incorrectly."
);

assert(
  summary.checklist.totalItems === 4,
  "Checklist total was incorrect."
);

assert(
  summary.checklist.completedItems === 2,
  "Completed checklist count was incorrect."
);

assert(
  summary.checklist.completionPercentage === 50,
  "Checklist completion percentage was incorrect."
);

assert(
  JSON.stringify(actionPlan) ===
    JSON.stringify(originalActionPlan),
  "Progress calculation mutated the action plan."
);

assert(
  JSON.stringify(snapshot) ===
    JSON.stringify(originalSnapshot),
  "Progress calculation mutated the snapshot."
);

const emptySummary =
  summarizeActionPlanProgress(null, null);

assert(
  emptySummary.totalItems === 0 &&
    emptySummary.completionPercentage === 0,
  "Empty progress summary was incorrect."
);

console.log("PROGRESS TESTS");
console.log("Status totals: pass");
console.log("Completion percentage: pass");
console.log("Priority remaining: pass");
console.log("Overdue and upcoming dates: pass");
console.log("Recently completed items: pass");
console.log("Checklist totals: pass");
console.log("Immutability: pass");
console.log("Empty-state summary: pass");
