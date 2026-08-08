import {
  compareSnapshots,
  orderSnapshots,
  validateSnapshotComparison
} from "../js/core/snapshot-comparison.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function createSnapshot({
  id,
  businessName = "Harbor Street Market",
  normalizedName = "harbor street market",
  assessmentVersion = "0.1",
  completedAt,
  overallScore,
  categoryScores = {},
  strengths = [],
  recommendations = []
}) {
  return {
    id,
    assessmentVersion,
    completedAt,
    business: {
      name: businessName,
      normalizedName
    },
    results: {
      overallScore,
      categoryScores,
      strengths,
      recommendations
    }
  };
}

const earlierSnapshot = createSnapshot({
  id: "snapshot-earlier",
  completedAt: "2026-01-10T12:00:00.000Z",
  overallScore: 44,
  categoryScores: {
    operations: {
      score: 47
    },
    "customer-experience": {
      score: 58
    },
    "security-and-continuity": {
      score: 32
    }
  },
  strengths: [
    {
      id: "clear-message",
      title: "The business message is clear"
    },
    {
      id: "contact-options",
      title: "Customers have practical ways to connect"
    }
  ],
  recommendations: [
    {
      id: "shared-passwords",
      title: "Replace shared passwords"
    },
    {
      id: "document-processes",
      title: "Document recurring processes"
    },
    {
      id: "clarify-responsibility",
      title: "Clarify responsibility"
    }
  ]
});

const laterSnapshot = createSnapshot({
  id: "snapshot-later",
  completedAt: "2026-04-10T12:00:00.000Z",
  overallScore: 57,
  categoryScores: {
    operations: {
      score: 63
    },
    "customer-experience": {
      score: 58
    },
    "security-and-continuity": {
      score: 54
    }
  },
  strengths: [
    {
      id: "clear-message",
      title: "The business message is clear"
    },
    {
      id: "individual-access",
      title: "Account access is handled responsibly"
    }
  ],
  recommendations: [
    {
      id: "document-processes",
      title: "Document recurring processes"
    },
    {
      id: "backup-plan",
      title: "Create a backup plan"
    }
  ]
});

const validation = validateSnapshotComparison(
  earlierSnapshot,
  laterSnapshot
);

assert(
  validation.isValid === true,
  "Compatible snapshots were rejected."
);

const ordered = orderSnapshots(
  laterSnapshot,
  earlierSnapshot
);

assert(
  ordered.earlierSnapshot.id === "snapshot-earlier" &&
    ordered.laterSnapshot.id === "snapshot-later",
  "Snapshots were not ordered by completion date."
);

const earlierActionPlan = {
  id: "action-plan-earlier",
  snapshotId: earlierSnapshot.id,
  items: [
    {
      recommendationId: "shared-passwords",
      status: "complete",
      targetDate: null,
      checklist: [
        {
          id: "earlier-check-1",
          completed: true
        }
      ],
      completedAt: "2026-02-01T12:00:00.000Z"
    },
    {
      recommendationId: "document-processes",
      status: "in-progress",
      targetDate: null,
      checklist: [
        {
          id: "earlier-check-2",
          completed: true
        },
        {
          id: "earlier-check-3",
          completed: false
        }
      ],
      completedAt: null
    },
    {
      recommendationId: "clarify-responsibility",
      status: "not-started",
      targetDate: null,
      checklist: [],
      completedAt: null
    }
  ]
};

const laterActionPlan = {
  id: "action-plan-later",
  snapshotId: laterSnapshot.id,
  items: [
    {
      recommendationId: "document-processes",
      status: "complete",
      targetDate: null,
      checklist: [
        {
          id: "later-check-1",
          completed: true
        }
      ],
      completedAt: "2026-04-15T12:00:00.000Z"
    },
    {
      recommendationId: "backup-plan",
      status: "in-progress",
      targetDate: null,
      checklist: [
        {
          id: "later-check-2",
          completed: true
        },
        {
          id: "later-check-3",
          completed: true
        }
      ],
      completedAt: null
    }
  ]
};

const originalEarlierSnapshot =
  structuredClone(earlierSnapshot);

const originalLaterSnapshot =
  structuredClone(laterSnapshot);

const originalEarlierActionPlan =
  structuredClone(earlierActionPlan);

const originalLaterActionPlan =
  structuredClone(laterActionPlan);

const businessMemoryRecords = [
  {
    id: "memory-earlier-1",
    source: {
      snapshotId: earlierSnapshot.id,
      recommendationId: "document-processes"
    },
    change: {
      summary: "Created a weekly process review."
    },
    outcome: {
      status: "helped"
    },
    adoption: {
      status: "working",
      operationalType: "recurring-process"
    },
    recurringWork: {
      isRecurring: true
    },
    automation: {
      readiness: "worth-reviewing"
    },
    ownerNotes: "The review reduced missed follow-ups.",
    updatedAt: "2026-03-01T12:00:00.000Z"
  },
  {
    id: "memory-later-1",
    source: {
      snapshotId: laterSnapshot.id,
      recommendationId: "backup-plan"
    },
    change: {
      summary: "Standardized the backup routine."
    },
    outcome: {
      status: "helped"
    },
    adoption: {
      status: "adopted",
      operationalType: "business-standard"
    },
    recurringWork: {
      isRecurring: true
    },
    automation: {
      readiness: "strong-candidate"
    },
    ownerNotes: "The routine is now part of normal operations.",
    updatedAt: "2026-05-01T12:00:00.000Z"
  }
];

const originalBusinessMemoryRecords =
  structuredClone(businessMemoryRecords);


const comparison = compareSnapshots(
  laterSnapshot,
  earlierSnapshot,
  laterActionPlan,
  earlierActionPlan,
  businessMemoryRecords
);

assert(
  comparison.isValid === true,
  "Valid snapshot comparison failed."
);

assert(
  comparison.operationalLearning?.isAvailable === true,
  "Operational learning should be available when Business Memory records exist."
);

assert(
  comparison.operationalLearning.earlier.totalRecords === 1 &&
    comparison.operationalLearning.later.totalRecords === 1,
  "Operational learning records were not grouped by snapshot correctly."
);

assert(
  comparison.operationalLearning.earlier.positiveOutcomeCount === 1 &&
    comparison.operationalLearning.later.positiveOutcomeCount === 1,
  "Operational learning outcome summaries were incorrect."
);

assert(
  comparison.operationalLearning.earlier.adoptedImprovementCount === 0 &&
    comparison.operationalLearning.later.adoptedImprovementCount === 1,
  "Operational learning adoption summaries were incorrect."
);

assert(
  comparison.operationalLearning.linkedRecordCount === 2,
  "Operational learning linked-record count was incorrect."
);


assert(
  comparison.overallScore.earlier === 44 &&
    comparison.overallScore.later === 57 &&
    comparison.overallScore.change === 13,
  "Overall score change was calculated incorrectly."
);

const operations = comparison.categoryScores.find(
  (category) => category.categoryId === "operations"
);

const customerExperience = comparison.categoryScores.find(
  (category) =>
    category.categoryId === "customer-experience"
);

assert(
  operations.change === 16 &&
    operations.direction === "improved",
  "Improved category was calculated incorrectly."
);

assert(
  customerExperience.change === 0 &&
    customerExperience.direction === "unchanged",
  "Unchanged category was calculated incorrectly."
);

assert(
  comparison.strengths.newlyDeveloped.length === 1 &&
    comparison.strengths.newlyDeveloped[0].id ===
      "individual-access",
  "Newly developed strengths were identified incorrectly."
);

assert(
  comparison.strengths.noLongerListed.length === 1 &&
    comparison.strengths.noLongerListed[0].id ===
      "contact-options",
  "No-longer-listed strengths were identified incorrectly."
);

assert(
  comparison.recommendations.resolved.length === 2 &&
    comparison.recommendations.resolved.some(
      (item) => item.id === "shared-passwords"
    ) &&
    comparison.recommendations.resolved.some(
      (item) => item.id === "clarify-responsibility"
    ),
  "Resolved recommendations were identified incorrectly."
);

assert(
  comparison.recommendations.continuing.length === 1 &&
    comparison.recommendations.continuing[0].id ===
      "document-processes",
  "Continuing recommendations were identified incorrectly."
);

assert(
  comparison.recommendations.newlyTriggered.length === 1 &&
    comparison.recommendations.newlyTriggered[0].id ===
      "backup-plan",
  "Newly triggered recommendations were identified incorrectly."
);


assert(
  comparison.implementationProgress?.isAvailable === true,
  "Action-plan implementation progress was not available."
);

assert(
  comparison.implementationProgress.earlier.completionPercentage === 33 &&
    comparison.implementationProgress.later.completionPercentage === 50 &&
    comparison.implementationProgress.completionPercentageChange === 17,
  "Action-plan completion movement was calculated incorrectly."
);

assert(
  comparison.implementationProgress.earlier.statusTotals.complete === 1 &&
    comparison.implementationProgress.later.statusTotals.complete === 1 &&
    comparison.implementationProgress.completedItemsChange === 0,
  "Completed action-item movement was calculated incorrectly."
);

assert(
  comparison.implementationProgress.earlier.statusTotals.inProgress === 1 &&
    comparison.implementationProgress.later.statusTotals.inProgress === 1 &&
    comparison.implementationProgress.inProgressItemsChange === 0,
  "In-progress action-item movement was calculated incorrectly."
);

assert(
  comparison.implementationProgress.earlier.checklist.completionPercentage === 67 &&
    comparison.implementationProgress.later.checklist.completionPercentage === 100 &&
    comparison.implementationProgress.checklistCompletionPercentageChange === 33,
  "Checklist implementation movement was calculated incorrectly."
);

assert(
  JSON.stringify(earlierSnapshot) ===
    JSON.stringify(originalEarlierSnapshot) &&
    JSON.stringify(laterSnapshot) ===
      JSON.stringify(originalLaterSnapshot),
  "Snapshot comparison mutated snapshot data."
);

assert(
  JSON.stringify(businessMemoryRecords) ===
    JSON.stringify(originalBusinessMemoryRecords),
  "Snapshot comparison mutated Business Memory data."
);


assert(
  JSON.stringify(earlierActionPlan) ===
    JSON.stringify(originalEarlierActionPlan) &&
    JSON.stringify(laterActionPlan) ===
      JSON.stringify(originalLaterActionPlan),
  "Snapshot comparison mutated action-plan data."
);

const missingPlanComparison = compareSnapshots(
  earlierSnapshot,
  laterSnapshot,
  earlierActionPlan,
  null
);

assert(
  missingPlanComparison.isValid === true &&
    missingPlanComparison.implementationProgress?.isAvailable === false,
  "Missing action-plan data should not invalidate snapshot comparison."
);


assert(
  Array.isArray(comparison.significantImprovements?.assessment) &&
    comparison.significantImprovements.assessment.some(
      (improvement) =>
        improvement.type === "category-score" &&
        improvement.categoryId === "operations" &&
        improvement.change === 16
    ) &&
    comparison.significantImprovements.assessment.some(
      (improvement) =>
        improvement.type === "category-score" &&
        improvement.categoryId ===
          "security-and-continuity" &&
        improvement.change === 22
    ),
  "Significant category improvements were not identified."
);

assert(
  comparison.significantImprovements.assessment.some(
    (improvement) =>
      improvement.type === "new-strength" &&
      improvement.item?.id === "individual-access"
  ),
  "Newly developed strengths were not surfaced as significant improvements."
);

assert(
  comparison.significantImprovements.assessment.some(
    (improvement) =>
      improvement.type === "resolved-recommendation" &&
      improvement.item?.id === "shared-passwords"
  ),
  "Resolved recommendations were not surfaced as significant improvements."
);

assert(
  Array.isArray(
    comparison.significantImprovements?.implementation
  ) &&
    comparison.significantImprovements.implementation.some(
      (improvement) =>
        improvement.type === "action-plan-completion" &&
        improvement.change === 17
    ) &&
    comparison.significantImprovements.implementation.some(
      (improvement) =>
        improvement.type === "checklist-completion" &&
        improvement.change === 33
    ),
  "Significant implementation improvements were not identified."
);

assert(
  missingPlanComparison.significantImprovements
    ?.implementation?.length === 0,
  "Missing action-plan data should not create implementation improvements."
);

const differentBusiness = createSnapshot({
  id: "different-business",
  businessName: "Another Business",
  normalizedName: "another business",
  completedAt: "2026-05-10T12:00:00.000Z",
  overallScore: 60
});

assert(
  validateSnapshotComparison(
    earlierSnapshot,
    differentBusiness
  ).isValid === false,
  "Snapshots from different businesses were accepted."
);

const differentVersion = createSnapshot({
  id: "different-version",
  assessmentVersion: "0.2",
  completedAt: "2026-05-10T12:00:00.000Z",
  overallScore: 60
});

assert(
  validateSnapshotComparison(
    earlierSnapshot,
    differentVersion
  ).isValid === false,
  "Snapshots using different assessment versions were accepted."
);

assert(
  validateSnapshotComparison(
    earlierSnapshot,
    earlierSnapshot
  ).isValid === false,
  "The same snapshot was accepted twice."
);

console.log("SNAPSHOT COMPARISON TESTS");
console.log("Compatibility validation: pass");
console.log("Chronological ordering: pass");
console.log("Overall score comparison: pass");
console.log("Category score comparison: pass");
console.log("Strength comparison: pass");
console.log("Recommendation comparison: pass");
console.log("Implementation progress comparison: pass");
assert(
  Array.isArray(
    comparison.significantImprovements.operationalLearning
  ),
  "Operational learning significant improvements were not returned."
);

assert(
  comparison.significantImprovements.operationalLearning.length === 1,
  "Later-snapshot operational learning was not identified correctly."
);

assert(
  comparison.significantImprovements.operationalLearning[0]
    .recommendationId === "backup-plan",
  "Significant operational learning was linked to the wrong recommendation."
);


console.log("Significant business improvements: pass");
console.log("Missing action-plan compatibility: pass");
console.log("Comparison immutability: pass");
