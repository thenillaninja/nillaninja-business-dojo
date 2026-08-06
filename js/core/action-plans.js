import { normalizeBusinessName } from "./snapshots.js";

export const ACTION_PLAN_SCHEMA_VERSION = "0.2";

export const ACTION_PLAN_STATUSES = [
  "not-started",
  "in-progress",
  "complete"
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

function createChecklistItem(firstAction) {
  const text = String(firstAction || "").trim();

  if (!text) {
    return [];
  }

  return [
    {
      id: createRecordId("checklist-item"),
      text,
      completed: false,
      completedAt: null
    }
  ];
}

function createActionItem(recommendation, timestamp) {
  return {
    recommendationId: recommendation.id,
    status: "not-started",
    targetDate: null,
    responsiblePerson: "",
    notes: "",
    checklist: createChecklistItem(recommendation.firstAction),
    startedAt: null,
    completedAt: null,
    updatedAt: timestamp
  };
}

export function createActionPlanRecord(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  if (!snapshot.id) {
    return null;
  }

  const recommendations = snapshot.results?.recommendations;

  if (!Array.isArray(recommendations)) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const businessName =
    snapshot.business?.name ||
    snapshot.businessProfile?.businessName?.trim() ||
    "Your Business";

  return structuredClone({
    id: createRecordId("action-plan"),
    schemaVersion: ACTION_PLAN_SCHEMA_VERSION,
    appVersion: "0.2",

    snapshotId: snapshot.id,

    business: {
      name: businessName,
      normalizedName:
        snapshot.business?.normalizedName ||
        normalizeBusinessName(businessName)
    },

    createdAt: timestamp,
    updatedAt: timestamp,

    items: recommendations
      .filter((recommendation) => recommendation?.id)
      .map((recommendation) =>
        createActionItem(recommendation, timestamp)
      )
  });
}

export function updateActionItemStatus(
  actionPlan,
  recommendationId,
  nextStatus
) {
  if (
    !actionPlan ||
    typeof actionPlan !== "object" ||
    !recommendationId ||
    !ACTION_PLAN_STATUSES.includes(nextStatus) ||
    !Array.isArray(actionPlan.items)
  ) {
    return null;
  }

  const itemExists = actionPlan.items.some(
    (item) => item.recommendationId === recommendationId
  );

  if (!itemExists) {
    return null;
  }

  const timestamp = new Date().toISOString();

  const updatedItems = actionPlan.items.map((item) => {
    if (item.recommendationId !== recommendationId) {
      return structuredClone(item);
    }

    let startedAt = item.startedAt || null;
    let completedAt = item.completedAt || null;

    if (nextStatus === "not-started") {
      startedAt = null;
      completedAt = null;
    }

    if (nextStatus === "in-progress") {
      startedAt = startedAt || timestamp;
      completedAt = null;
    }

    if (nextStatus === "complete") {
      startedAt = startedAt || timestamp;
      completedAt = timestamp;
    }

    return {
      ...structuredClone(item),
      status: nextStatus,
      startedAt,
      completedAt,
      updatedAt: timestamp
    };
  });

  return structuredClone({
    ...actionPlan,
    updatedAt: timestamp,
    items: updatedItems
  });
}

