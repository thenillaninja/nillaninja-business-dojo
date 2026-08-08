export const BUSINESS_MEMORY_SCHEMA_VERSION = "0.4";

export const BUSINESS_MEMORY_OUTCOME_STATUSES = [
  "not-evaluated",
  "helped",
  "mixed",
  "did-not-help",
  "unknown"
];

export const BUSINESS_MEMORY_ADOPTION_STATUSES = [
  "tested",
  "working",
  "adopted",
  "needs-revision",
  "no-longer-used"
];

export const BUSINESS_MEMORY_OPERATIONAL_TYPES = [
  "none",
  "recurring-process",
  "checklist",
  "responsibility",
  "decision-rule",
  "business-standard"
];

export const BUSINESS_MEMORY_AUTOMATION_READINESS = [
  "not-reviewed",
  "not-suitable",
  "needs-process-improvement",
  "worth-reviewing",
  "strong-candidate"
];

function createRecordId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


export function updateBusinessMemoryOutcome(
  record,
  {
    changeSummary,
    changeDetails,
    outcomeStatus,
    outcomeSummary,
    updatedAt = new Date().toISOString()
  } = {}
) {
  if (
    !record ||
    typeof record !== "object" ||
    !BUSINESS_MEMORY_OUTCOME_STATUSES.includes(outcomeStatus)
  ) {
    return null;
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    change: {
      summary:
        changeSummary !== undefined
          ? String(changeSummary).trim()
          : record.change?.summary || "",
      details:
        changeDetails !== undefined
          ? String(changeDetails).trim()
          : record.change?.details || ""
    },
    outcome: {
      status: outcomeStatus,
      summary:
        outcomeSummary !== undefined
          ? String(outcomeSummary).trim()
          : record.outcome?.summary || ""
    },
    updatedAt: timestamp.toISOString()
  });
}


export function updateBusinessMemoryAdoption(
  record,
  {
    adoptionStatus,
    operationalType,
    updatedAt = new Date().toISOString()
  } = {}
) {
  if (
    !record ||
    typeof record !== "object" ||
    !BUSINESS_MEMORY_ADOPTION_STATUSES.includes(adoptionStatus) ||
    !BUSINESS_MEMORY_OPERATIONAL_TYPES.includes(operationalType)
  ) {
    return null;
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    adoption: {
      status: adoptionStatus,
      operationalType
    },
    updatedAt: timestamp.toISOString()
  });
}


export function updateBusinessMemoryRecurringWork(
  record,
  {
    isRecurring,
    frequency = "",
    trigger = "",
    responsiblePerson = "",
    expectedResult = "",
    currentMethod = "",
    updatedAt = new Date().toISOString()
  } = {}
) {
  if (
    !record ||
    typeof record !== "object" ||
    typeof isRecurring !== "boolean"
  ) {
    return null;
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    recurringWork: {
      isRecurring,
      frequency: isRecurring ? String(frequency).trim() : "",
      trigger: isRecurring ? String(trigger).trim() : "",
      responsiblePerson:
        isRecurring ? String(responsiblePerson).trim() : "",
      expectedResult:
        isRecurring ? String(expectedResult).trim() : "",
      currentMethod:
        isRecurring ? String(currentMethod).trim() : ""
    },
    updatedAt: timestamp.toISOString()
  });
}


export function updateBusinessMemoryAutomation(
  record,
  {
    readiness,
    notes = "",
    updatedAt = new Date().toISOString()
  } = {}
) {
  if (
    !record ||
    typeof record !== "object" ||
    !BUSINESS_MEMORY_AUTOMATION_READINESS.includes(readiness)
  ) {
    return null;
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    automation: {
      readiness,
      notes: String(notes).trim()
    },
    updatedAt: timestamp.toISOString()
  });
}

export function createBusinessMemoryRecord({
  snapshot,
  actionPlan = null,
  recommendationId,
  createdAt = new Date().toISOString()
} = {}) {
  if (
    !snapshot?.id ||
    !recommendationId ||
    !Array.isArray(snapshot.results?.recommendations)
  ) {
    return null;
  }

  const recommendationExists =
    snapshot.results.recommendations.some(
      (recommendation) =>
        recommendation?.id === recommendationId
    );

  if (!recommendationExists) {
    return null;
  }

  const businessName =
    snapshot.business?.name ||
    snapshot.businessProfile?.businessName?.trim() ||
    "Your Business";

  const normalizedBusinessName =
    snapshot.business?.normalizedName ||
    businessName.trim().toLowerCase().replace(/\s+/g, " ");

  const timestamp = new Date(createdAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  const safeTimestamp = timestamp.toISOString();

  return structuredClone({
    id: createRecordId("business-memory"),

    schemaVersion: BUSINESS_MEMORY_SCHEMA_VERSION,
    appVersion: snapshot.appVersion || "0.4",

    business: {
      name: businessName,
      normalizedName: normalizedBusinessName
    },

    source: {
      snapshotId: snapshot.id,
      actionPlanId: actionPlan?.id || null,
      recommendationId
    },

    change: {
      summary: "",
      details: ""
    },

    outcome: {
      status: "not-evaluated",
      summary: ""
    },

    adoption: {
      status: "tested",
      operationalType: "none"
    },

    recurringWork: {
      isRecurring: false,
      frequency: "",
      trigger: "",
      responsiblePerson: "",
      expectedResult: "",
      currentMethod: ""
    },

    automation: {
      readiness: "not-reviewed",
      notes: ""
    },

    review: {
      reviewDate: null,
      notes: ""
    },

    ownerNotes: "",

    createdAt: safeTimestamp,
    updatedAt: safeTimestamp
  });
}
