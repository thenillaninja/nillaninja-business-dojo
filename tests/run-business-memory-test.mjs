const {
  BUSINESS_MEMORY_SCHEMA_VERSION,
  BUSINESS_MEMORY_OUTCOME_STATUSES,
  BUSINESS_MEMORY_ADOPTION_STATUSES,
  BUSINESS_MEMORY_OPERATIONAL_TYPES,
  BUSINESS_MEMORY_AUTOMATION_READINESS,
  createBusinessMemoryRecord
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
