const {
  BUSINESS_MEMORY_SCHEMA_VERSION,
  BUSINESS_MEMORY_OUTCOME_STATUSES,
  BUSINESS_MEMORY_ADOPTION_STATUSES,
  BUSINESS_MEMORY_OPERATIONAL_TYPES,
  BUSINESS_MEMORY_AUTOMATION_READINESS,
  createBusinessMemoryRecord,
  updateBusinessMemoryOutcome,
  updateBusinessMemoryAdoption,
  updateBusinessMemoryRecurringWork,
  updateBusinessMemoryAutomation
} = await import("../js/core/business-memory.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeSnapshot() {
  return {
    id: "snapshot-1",
    appVersion: "0.4",
    business: {
      name: "Harbor Street Market",
      normalizedName: "harbor street market"
    },
    businessProfile: {
      businessName: "Harbor Street Market"
    },
    results: {
      recommendations: [
        {
          id: "standardize-customer-follow-up",
          title: "Standardize customer follow-up"
        }
      ]
    }
  };
}

function makeActionPlan() {
  return {
    id: "action-plan-1",
    snapshotId: "snapshot-1"
  };
}

console.log("BUSINESS MEMORY MODEL TESTS");

assert(
  BUSINESS_MEMORY_SCHEMA_VERSION === "0.4",
  "Schema version test failed."
);

console.log("Schema version: pass");

assert(
  BUSINESS_MEMORY_OUTCOME_STATUSES.includes("helped") &&
    BUSINESS_MEMORY_ADOPTION_STATUSES.includes("adopted") &&
    BUSINESS_MEMORY_OPERATIONAL_TYPES.includes("recurring-process") &&
    BUSINESS_MEMORY_AUTOMATION_READINESS.includes("strong-candidate"),
  "Allowed values test failed."
);

console.log("Allowed values: pass");

const snapshot = makeSnapshot();
const actionPlan = makeActionPlan();

const record = createBusinessMemoryRecord({
  snapshot,
  actionPlan,
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

assert(
  record &&
    record.schemaVersion === "0.4" &&
    record.appVersion === "0.4",
  "Record creation test failed."
);

console.log("Record creation: pass");

assert(
  record.source.snapshotId === "snapshot-1" &&
    record.source.actionPlanId === "action-plan-1" &&
    record.source.recommendationId ===
      "standardize-customer-follow-up",
  "Source relationship test failed."
);

console.log("Source relationships: pass");

assert(
  record.outcome.status === "not-evaluated" &&
    record.adoption.status === "tested" &&
    record.adoption.operationalType === "none" &&
    record.recurringWork.isRecurring === false &&
    record.automation.readiness === "not-reviewed",
  "Default state test failed."
);

console.log("Default state: pass");

assert(
  record.createdAt === "2026-08-07T12:00:00.000Z" &&
    record.updatedAt === "2026-08-07T12:00:00.000Z",
  "Timestamp test failed."
);

console.log("Timestamps: pass");

snapshot.business.name = "Mutated Business";
actionPlan.id = "mutated-action-plan";

assert(
  record.business.name === "Harbor Street Market" &&
    record.source.actionPlanId === "action-plan-1",
  "Input immutability test failed."
);

console.log("Input immutability: pass");

assert(
  createBusinessMemoryRecord({
    snapshot: makeSnapshot(),
    recommendationId: "missing-recommendation"
  }) === null,
  "Unknown recommendation validation failed."
);

assert(
  createBusinessMemoryRecord({
    snapshot: null,
    recommendationId: "standardize-customer-follow-up"
  }) === null,
  "Missing snapshot validation failed."
);

assert(
  createBusinessMemoryRecord({
    snapshot: makeSnapshot(),
    recommendationId: "standardize-customer-follow-up",
    createdAt: "not-a-date"
  }) === null,
  "Invalid timestamp validation failed."
);

console.log("Invalid input handling: pass");

const recordWithoutActionPlan = createBusinessMemoryRecord({
  snapshot: makeSnapshot(),
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

assert(
  recordWithoutActionPlan?.source?.actionPlanId === null,
  "Optional action plan test failed."
);

console.log("Optional action plan: pass");

const outcomeSource = createBusinessMemoryRecord({
  snapshot: makeSnapshot(),
  actionPlan: makeActionPlan(),
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

const outcomeUpdated = updateBusinessMemoryOutcome(
  outcomeSource,
  {
    changeSummary: "  Created a two-step follow-up process.  ",
    changeDetails: "  Added templates and a review step.  ",
    outcomeStatus: "helped",
    outcomeSummary: "  Fewer estimates are being forgotten.  ",
    updatedAt: "2026-08-08T12:00:00.000Z"
  }
);

assert(
  outcomeUpdated?.change?.summary ===
    "Created a two-step follow-up process." &&
    outcomeUpdated?.change?.details ===
      "Added templates and a review step." &&
    outcomeUpdated?.outcome?.status === "helped" &&
    outcomeUpdated?.outcome?.summary ===
      "Fewer estimates are being forgotten.",
  "Outcome update test failed."
);

console.log("Outcome update: pass");

assert(
  outcomeUpdated.createdAt ===
    "2026-08-07T12:00:00.000Z" &&
    outcomeUpdated.updatedAt ===
      "2026-08-08T12:00:00.000Z",
  "Outcome timestamp preservation test failed."
);

console.log("Outcome timestamp preservation: pass");

assert(
  outcomeSource.change.summary === "" &&
    outcomeSource.outcome.status === "not-evaluated",
  "Outcome update mutated the source record."
);

console.log("Outcome update immutability: pass");

assert(
  updateBusinessMemoryOutcome(
    outcomeSource,
    {
      outcomeStatus: "invalid-status"
    }
  ) === null,
  "Invalid outcome status validation failed."
);

assert(
  updateBusinessMemoryOutcome(
    outcomeSource,
    {
      outcomeStatus: "helped",
      updatedAt: "not-a-date"
    }
  ) === null,
  "Invalid outcome timestamp validation failed."
);

console.log("Outcome update validation: pass");

const adoptionSource = createBusinessMemoryRecord({
  snapshot: makeSnapshot(),
  actionPlan: makeActionPlan(),
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

const adoptionUpdated = updateBusinessMemoryAdoption(
  adoptionSource,
  {
    adoptionStatus: "adopted",
    operationalType: "business-standard",
    updatedAt: "2026-08-09T12:00:00.000Z"
  }
);

assert(
  adoptionUpdated?.adoption?.status === "adopted" &&
    adoptionUpdated?.adoption?.operationalType === "business-standard",
  "Adoption update test failed."
);

console.log("Adoption update: pass");

assert(
  adoptionUpdated.createdAt === "2026-08-07T12:00:00.000Z" &&
    adoptionUpdated.updatedAt === "2026-08-09T12:00:00.000Z",
  "Adoption timestamp preservation test failed."
);

console.log("Adoption timestamp preservation: pass");

assert(
  adoptionSource.adoption.status === "tested" &&
    adoptionSource.adoption.operationalType === "none",
  "Adoption update mutated the source record."
);

console.log("Adoption update immutability: pass");

assert(
  updateBusinessMemoryAdoption(
    adoptionSource,
    {
      adoptionStatus: "invalid-status",
      operationalType: "business-standard"
    }
  ) === null,
  "Invalid adoption status validation failed."
);

assert(
  updateBusinessMemoryAdoption(
    adoptionSource,
    {
      adoptionStatus: "adopted",
      operationalType: "invalid-type"
    }
  ) === null,
  "Invalid operational type validation failed."
);

assert(
  updateBusinessMemoryAdoption(
    adoptionSource,
    {
      adoptionStatus: "adopted",
      operationalType: "business-standard",
      updatedAt: "not-a-date"
    }
  ) === null,
  "Invalid adoption timestamp validation failed."
);

console.log("Adoption update validation: pass");

const recurringSource = createBusinessMemoryRecord({
  snapshot: makeSnapshot(),
  actionPlan: makeActionPlan(),
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

const recurringUpdated = updateBusinessMemoryRecurringWork(
  recurringSource,
  {
    isRecurring: true,
    frequency: "  Weekly  ",
    trigger: "  Every Friday afternoon  ",
    responsiblePerson: "  Store Manager  ",
    expectedResult: "  All open estimates reviewed  ",
    currentMethod: "  Review the follow-up list manually  ",
    updatedAt: "2026-08-10T12:00:00.000Z"
  }
);

assert(
  recurringUpdated?.recurringWork?.isRecurring === true &&
    recurringUpdated.recurringWork.frequency === "Weekly" &&
    recurringUpdated.recurringWork.trigger ===
      "Every Friday afternoon" &&
    recurringUpdated.recurringWork.responsiblePerson ===
      "Store Manager" &&
    recurringUpdated.recurringWork.expectedResult ===
      "All open estimates reviewed" &&
    recurringUpdated.recurringWork.currentMethod ===
      "Review the follow-up list manually",
  "Recurring work update test failed."
);

console.log("Recurring work update: pass");

assert(
  recurringUpdated.createdAt ===
    "2026-08-07T12:00:00.000Z" &&
    recurringUpdated.updatedAt ===
      "2026-08-10T12:00:00.000Z",
  "Recurring work timestamp preservation test failed."
);

console.log("Recurring work timestamp preservation: pass");

assert(
  recurringSource.recurringWork.isRecurring === false &&
    recurringSource.recurringWork.frequency === "",
  "Recurring work update mutated the source record."
);

console.log("Recurring work immutability: pass");

const recurringCleared = updateBusinessMemoryRecurringWork(
  recurringUpdated,
  {
    isRecurring: false,
    frequency: "Should be removed",
    trigger: "Should be removed",
    responsiblePerson: "Should be removed",
    expectedResult: "Should be removed",
    currentMethod: "Should be removed",
    updatedAt: "2026-08-11T12:00:00.000Z"
  }
);

assert(
  recurringCleared?.recurringWork?.isRecurring === false &&
    recurringCleared.recurringWork.frequency === "" &&
    recurringCleared.recurringWork.trigger === "" &&
    recurringCleared.recurringWork.responsiblePerson === "" &&
    recurringCleared.recurringWork.expectedResult === "" &&
    recurringCleared.recurringWork.currentMethod === "",
  "Recurring work clearing test failed."
);

console.log("Recurring work clearing: pass");

assert(
  updateBusinessMemoryRecurringWork(
    recurringSource,
    {
      isRecurring: "yes"
    }
  ) === null,
  "Recurring work boolean validation failed."
);

assert(
  updateBusinessMemoryRecurringWork(
    recurringSource,
    {
      isRecurring: true,
      updatedAt: "not-a-date"
    }
  ) === null,
  "Recurring work timestamp validation failed."
);

console.log("Recurring work validation: pass");

const automationSource = createBusinessMemoryRecord({
  snapshot: makeSnapshot(),
  actionPlan: makeActionPlan(),
  recommendationId: "standardize-customer-follow-up",
  createdAt: "2026-08-07T12:00:00.000Z"
});

const automationUpdated = updateBusinessMemoryAutomation(
  automationSource,
  {
    readiness: "worth-reviewing",
    notes: "  This process is consistent enough to evaluate later.  ",
    updatedAt: "2026-08-12T12:00:00.000Z"
  }
);

assert(
  automationUpdated?.automation?.readiness === "worth-reviewing" &&
    automationUpdated?.automation?.notes ===
      "This process is consistent enough to evaluate later.",
  "Automation readiness update test failed."
);

console.log("Automation readiness update: pass");

assert(
  automationUpdated.createdAt ===
    "2026-08-07T12:00:00.000Z" &&
    automationUpdated.updatedAt ===
      "2026-08-12T12:00:00.000Z",
  "Automation timestamp preservation test failed."
);

console.log("Automation timestamp preservation: pass");

assert(
  automationSource.automation.readiness === "not-reviewed" &&
    automationSource.automation.notes === "",
  "Automation update mutated the source record."
);

console.log("Automation update immutability: pass");

assert(
  updateBusinessMemoryAutomation(
    automationSource,
    {
      readiness: "ready-to-execute"
    }
  ) === null,
  "Invalid automation readiness validation failed."
);

assert(
  updateBusinessMemoryAutomation(
    automationSource,
    {
      readiness: "strong-candidate",
      updatedAt: "not-a-date"
    }
  ) === null,
  "Invalid automation timestamp validation failed."
);

console.log("Automation update validation: pass");
