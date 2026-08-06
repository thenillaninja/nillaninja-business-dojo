const SNAPSHOT_SCHEMA_VERSION = "0.2";

function createSnapshotId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `snapshot-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

export function normalizeBusinessName(name = "") {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function createSnapshotRecord(state) {
  if (!state || typeof state !== "object") {
    return null;
  }

  if (!Number.isFinite(state.results?.overallScore)) {
    return null;
  }

  const completedAt = new Date().toISOString();
  const businessName =
    state.businessProfile?.businessName?.trim() || "Your Business";

  return structuredClone({
    id: createSnapshotId(),

    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    appVersion: "0.2",
    assessmentVersion:
      state.metadata?.assessmentVersion || "0.1",

    createdAt: completedAt,
    completedAt,

    business: {
      name: businessName,
      normalizedName: normalizeBusinessName(businessName),
      priority:
        state.businessProfile?.currentPriority || ""
    },

    businessProfile: state.businessProfile || {},

    assessment: state.assessment || {
      answers: {},
      completedQuestionIds: [],
      completionPercentage: 0
    },

    results: state.results || {},

    report: {
      ...(state.report || {}),
      generatedAt:
        state.report?.generatedAt || completedAt
    }
  });
}

export { SNAPSHOT_SCHEMA_VERSION };
