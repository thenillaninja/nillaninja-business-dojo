import {
  summarizeActionPlanProgress,
  summarizeBusinessMemoryProgress
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
  summary.recentlyCompleted[0].daysSinceCompleted === 2,
  "Days since completion was calculated incorrectly."
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
  summary.checklist.byRecommendation.length === 4,
  "Per-recommendation checklist summaries were incomplete."
);

const urgentChecklist =
  summary.checklist.byRecommendation.find(
    (item) =>
      item.recommendationId === "urgent-security"
  );

assert(
  urgentChecklist?.totalItems === 2 &&
    urgentChecklist.completedItems === 1 &&
    urgentChecklist.completionPercentage === 50,
  "Per-recommendation checklist progress was incorrect."
);

const emptyChecklist =
  summary.checklist.byRecommendation.find(
    (item) =>
      item.recommendationId === "customer-follow-up"
  );

assert(
  emptyChecklist?.totalItems === 0 &&
    emptyChecklist.completedItems === 0 &&
    emptyChecklist.completionPercentage === 0,
  "Empty checklist progress was incorrect."
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



const businessMemoryRecords = [
  {
    id: "memory-1",
    source: {
      snapshotId: "snapshot-progress-001",
      recommendationId: "document-processes"
    },
    change: {
      summary: "Created a weekly process review."
    },
    outcome: {
      status: "helped"
    },
    adoption: {
      status: "adopted",
      operationalType: "recurring-process"
    },
    recurringWork: {
      isRecurring: true
    },
    automation: {
      readiness: "worth-reviewing"
    },
    ownerNotes: "The weekly review reduced missed follow-ups.",
    updatedAt: "2026-08-05T12:00:00.000Z"
  },
  {
    id: "memory-2",
    source: {
      snapshotId: "snapshot-progress-001",
      recommendationId: "customer-follow-up"
    },
    change: {
      summary: "Tested a follow-up checklist."
    },
    outcome: {
      status: "mixed"
    },
    adoption: {
      status: "needs-revision",
      operationalType: "checklist"
    },
    recurringWork: {
      isRecurring: false
    },
    automation: {
      readiness: "needs-process-improvement"
    },
    ownerNotes: "The checklist helped, but the timing needs work.",
    updatedAt: "2026-08-06T12:00:00.000Z"
  },
  {
    id: "memory-3",
    source: {
      snapshotId: "snapshot-progress-001",
      recommendationId: "future-improvement"
    },
    change: {
      summary: "Retired an old review routine."
    },
    outcome: {
      status: "did-not-help"
    },
    adoption: {
      status: "no-longer-used",
      operationalType: "business-standard"
    },
    recurringWork: {
      isRecurring: true
    },
    automation: {
      readiness: "strong-candidate"
    },
    ownerNotes: "",
    updatedAt: "2026-08-07T12:00:00.000Z"
  }
];

const originalBusinessMemoryRecords =
  structuredClone(businessMemoryRecords);

const memoryProgress =
  summarizeBusinessMemoryProgress(
    businessMemoryRecords
  );

assert(
  memoryProgress.totalRecords === 3,
  "Business Memory total record count was incorrect."
);

assert(
  memoryProgress.positiveOutcomeCount === 1 &&
    memoryProgress.outcomes.helped === 1 &&
    memoryProgress.outcomes.mixed === 1 &&
    memoryProgress.outcomes.didNotHelp === 1,
  "Business Memory outcome totals were incorrect."
);

assert(
  memoryProgress.adoptedImprovementCount === 1 &&
    memoryProgress.adoption.adopted === 1 &&
    memoryProgress.adoption.needsRevision === 1 &&
    memoryProgress.adoption.noLongerUsed === 1,
  "Business Memory adoption totals were incorrect."
);

assert(
  memoryProgress.operationalPracticeCount === 2,
  "Operational-practice count was incorrect."
);

assert(
  memoryProgress.recurringWorkCount === 2,
  "Recurring-work count was incorrect."
);

assert(
  memoryProgress.automationCandidateCount === 2,
  "Automation-candidate count was incorrect."
);

assert(
  memoryProgress.learnedItems.length === 3 &&
    memoryProgress.learnedItems[0].recommendationId ===
      "document-processes",
  "Learned Business Memory items were incomplete."
);

assert(
  JSON.stringify(businessMemoryRecords) ===
    JSON.stringify(originalBusinessMemoryRecords),
  "Business Memory progress calculation mutated records."
);

const emptyMemoryProgress =
  summarizeBusinessMemoryProgress(null);

assert(
  emptyMemoryProgress.totalRecords === 0 &&
    emptyMemoryProgress.adoptedImprovementCount === 0 &&
    emptyMemoryProgress.operationalPracticeCount === 0,
  "Empty Business Memory progress summary was incorrect."
);

console.log("PROGRESS TESTS");
console.log("Status totals: pass");
console.log("Completion percentage: pass");
console.log("Priority remaining: pass");
console.log("Overdue and upcoming dates: pass");
console.log("Recently completed items and age: pass");
console.log("Checklist totals: pass");
console.log("Checklist progress by recommendation: pass");
console.log("Immutability: pass");
console.log("Empty-state summary: pass");
console.log("Business Memory outcome totals: pass");
console.log("Business Memory adoption totals: pass");
console.log("Business Memory operational learning: pass");
console.log("Business Memory immutability: pass");
console.log("Business Memory empty state: pass");
