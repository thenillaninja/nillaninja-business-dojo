const SUPPORTED_INTERVALS = new Set([
  30,
  60,
  90
]);

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function normalizeDay(value = new Date()) {
  const parsed = parseDate(value);

  if (!parsed) {
    return null;
  }

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    )
  );
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function getSnapshotDate(snapshot) {
  return parseDate(
    snapshot?.completedAt ||
    snapshot?.createdAt
  );
}

export function createReassessmentPlan(
  snapshot,
  intervalDays,
  {
    createdAt = new Date().toISOString()
  } = {}
) {
  if (
    !snapshot?.id ||
    !SUPPORTED_INTERVALS.has(intervalDays)
  ) {
    return null;
  }

  const snapshotDate = getSnapshotDate(snapshot);
  const createdDate = parseDate(createdAt);

  if (!snapshotDate || !createdDate) {
    return null;
  }

  const scheduledDate = normalizeDay(snapshotDate);

  scheduledDate.setUTCDate(
    scheduledDate.getUTCDate() + intervalDays
  );

  return structuredClone({
    sourceSnapshotId: snapshot.id,
    business: {
      name:
        snapshot.business?.name ||
        snapshot.businessProfile?.businessName ||
        "Your Business",
      normalizedName:
        snapshot.business?.normalizedName ||
        ""
    },
    intervalDays,
    scheduledFor: formatDateOnly(scheduledDate),
    createdAt: createdDate.toISOString(),
    updatedAt: createdDate.toISOString()
  });
}

export function getReassessmentStatus(
  plan,
  {
    today = new Date(),
    approachingDays = 7
  } = {}
) {
  if (
    !plan ||
    typeof plan !== "object" ||
    typeof plan.scheduledFor !== "string"
  ) {
    return {
      status: "unavailable",
      daysUntil: null,
      daysOverdue: null
    };
  }

  const scheduledDate = normalizeDay(
    `${plan.scheduledFor}T00:00:00.000Z`
  );

  const currentDate = normalizeDay(today);

  if (!scheduledDate || !currentDate) {
    return {
      status: "unavailable",
      daysUntil: null,
      daysOverdue: null
    };
  }

  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  const differenceDays = Math.round(
    (scheduledDate - currentDate) /
      millisecondsPerDay
  );

  if (differenceDays < 0) {
    return {
      status: "overdue",
      daysUntil: 0,
      daysOverdue: Math.abs(differenceDays)
    };
  }

  if (differenceDays === 0) {
    return {
      status: "due",
      daysUntil: 0,
      daysOverdue: 0
    };
  }

  if (
    differenceDays <=
    Math.max(0, Number(approachingDays) || 0)
  ) {
    return {
      status: "approaching",
      daysUntil: differenceDays,
      daysOverdue: 0
    };
  }

  return {
    status: "scheduled",
    daysUntil: differenceDays,
    daysOverdue: 0
  };
}

export {
  SUPPORTED_INTERVALS
};
