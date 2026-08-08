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
    considerations = record?.automation?.considerations || {},
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

  const considerationKeys = [
    "repetitive",
    "ruleBased",
    "stableProcess",
    "frequent",
    "timeConsuming",
    "errorProne",
    "requiresHumanJudgment",
    "requiresApproval",
    "containsSensitiveInformation"
  ];

  const normalizedConsiderations = {};

  for (const key of considerationKeys) {
    const value = considerations?.[key];

    if (value !== undefined && typeof value !== "boolean") {
      return null;
    }

    normalizedConsiderations[key] = Boolean(value);
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    automation: {
      readiness,
      considerations: normalizedConsiderations,
      notes: String(notes).trim()
    },
    updatedAt: timestamp.toISOString()
  });
}


export function explainBusinessMemoryAutomation(
  automation = {}
) {
  const readiness =
    BUSINESS_MEMORY_AUTOMATION_READINESS.includes(
      automation?.readiness
    )
      ? automation.readiness
      : "not-reviewed";

  const considerations =
    automation?.considerations || {};

  const supportingTraits = [
    ["repetitive", "repetitive"],
    ["ruleBased", "rule-based"],
    ["stableProcess", "stable"],
    ["frequent", "frequent"],
    ["timeConsuming", "time-consuming"],
    ["errorProne", "prone to errors"]
  ]
    .filter(([key]) => considerations[key] === true)
    .map(([, label]) => label);

  const cautionTraits = [
    [
      "requiresHumanJudgment",
      "requires human judgment"
    ],
    ["requiresApproval", "requires approval"],
    [
      "containsSensitiveInformation",
      "contains sensitive information"
    ]
  ]
    .filter(([key]) => considerations[key] === true)
    .map(([, label]) => label);

  const joinTraits = (traits) => {
    if (traits.length === 0) {
      return "";
    }

    if (traits.length === 1) {
      return traits[0];
    }

    if (traits.length === 2) {
      return `${traits[0]} and ${traits[1]}`;
    }

    return `${traits.slice(0, -1).join(", ")}, and ${traits.at(-1)}`;
  };

  const readinessMessages = {
    "not-reviewed":
      "Automation readiness has not been reviewed yet.",
    "not-suitable":
      "This process is currently marked as not suitable for automation.",
    "needs-process-improvement":
      "This process should be stabilized or improved before automation is considered.",
    "worth-reviewing":
      "This process has characteristics that make it worth reviewing for future automation.",
    "strong-candidate":
      "This process appears to be a strong candidate for future automation evaluation."
  };

  const parts = [readinessMessages[readiness]];

  if (supportingTraits.length > 0) {
    parts.push(
      `Traits supporting future review: ${joinTraits(
        supportingTraits
      )}.`
    );
  }

  if (cautionTraits.length > 0) {
    parts.push(
      `Important safeguards or limitations remain because the process ${joinTraits(
        cautionTraits
      )}.`
    );
  }

  if (
    supportingTraits.length === 0 &&
    cautionTraits.length === 0
  ) {
    parts.push(
      "No automation characteristics have been identified yet."
    );
  }

  return parts.join(" ");
}


export function updateBusinessMemoryOwnerNotes(
  record,
  {
    ownerNotes = "",
    updatedAt = new Date().toISOString()
  } = {}
) {
  if (
    !record ||
    typeof record !== "object"
  ) {
    return null;
  }

  const timestamp = new Date(updatedAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return structuredClone({
    ...record,
    ownerNotes: String(ownerNotes).trim(),
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

  if (
    actionPlan &&
    actionPlan.snapshotId !== snapshot.id
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
      considerations: {
        repetitive: false,
        ruleBased: false,
        stableProcess: false,
        frequent: false,
        timeConsuming: false,
        errorProne: false,
        requiresHumanJudgment: false,
        requiresApproval: false,
        containsSensitiveInformation: false
      },
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
