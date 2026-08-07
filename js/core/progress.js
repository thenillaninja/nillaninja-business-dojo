const VALID_STATUSES = new Set([
  "not-started",
  "in-progress",
  "complete"
]);

function createEmptySummary() {
  return {
    totalItems: 0,

    statusTotals: {
      notStarted: 0,
      inProgress: 0,
      complete: 0
    },

    completionPercentage: 0,

    priorityRemaining: {
      immediate: 0,
      high: 0
    },

    dates: {
      overdue: [],
      upcoming: []
    },

    recentlyCompleted: [],

    checklist: {
      totalItems: 0,
      completedItems: 0,
      completionPercentage: 0,
      byRecommendation: []
    }
  };
}

function parseDateOnly(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTimestamp(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeToday(today) {
  const parsed = today ? new Date(today) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    )
  );
}

function calculatePercentage(completed, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

function getRecommendationMap(snapshot) {
  const recommendations =
    snapshot?.results?.recommendations;

  if (!Array.isArray(recommendations)) {
    return new Map();
  }

  return new Map(
    recommendations
      .filter((recommendation) => recommendation?.id)
      .map((recommendation) => [
        recommendation.id,
        recommendation
      ])
  );
}

export function summarizeActionPlanProgress(
  actionPlan,
  snapshot,
  {
    today,
    upcomingDays = 30,
    recentDays = 30
  } = {}
) {
  if (
    !actionPlan ||
    typeof actionPlan !== "object" ||
    !Array.isArray(actionPlan.items)
  ) {
    return createEmptySummary();
  }

  const currentDate = normalizeToday(today);
  const currentDayEnd = new Date(currentDate);
  currentDayEnd.setUTCHours(23, 59, 59, 999);

  const upcomingLimit = new Date(currentDate);
  upcomingLimit.setUTCDate(
    upcomingLimit.getUTCDate() +
      Math.max(0, Number(upcomingDays) || 0)
  );

  const recentLimit = new Date(currentDate);
  recentLimit.setUTCDate(
    recentLimit.getUTCDate() -
      Math.max(0, Number(recentDays) || 0)
  );

  const recommendationMap =
    getRecommendationMap(snapshot);

  const summary = createEmptySummary();

  for (const originalItem of actionPlan.items) {
    const item = structuredClone(originalItem);
    const status = VALID_STATUSES.has(item.status)
      ? item.status
      : "not-started";

    const recommendation =
      recommendationMap.get(item.recommendationId) || null;

    summary.totalItems += 1;

    if (status === "not-started") {
      summary.statusTotals.notStarted += 1;
    }

    if (status === "in-progress") {
      summary.statusTotals.inProgress += 1;
    }

    if (status === "complete") {
      summary.statusTotals.complete += 1;
    }

    if (status !== "complete") {
      if (recommendation?.priority === "immediate") {
        summary.priorityRemaining.immediate += 1;
      }

      if (recommendation?.priority === "high") {
        summary.priorityRemaining.high += 1;
      }
    }

    const targetDate = parseDateOnly(item.targetDate);

    if (status !== "complete" && targetDate) {
      const datedItem = {
        recommendationId: item.recommendationId,
        targetDate: item.targetDate,
        status,
        title:
          recommendation?.title ||
          item.recommendationId
      };

      if (targetDate < currentDate) {
        summary.dates.overdue.push(datedItem);
      } else if (targetDate <= upcomingLimit) {
        summary.dates.upcoming.push(datedItem);
      }
    }

    const completedAt = parseTimestamp(item.completedAt);

    if (
      status === "complete" &&
      completedAt &&
      completedAt >= recentLimit &&
      completedAt <= currentDayEnd
    ) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const completedDay = normalizeToday(completedAt);
      const daysSinceCompleted = Math.max(
        0,
        Math.floor(
          (currentDate - completedDay) /
            millisecondsPerDay
        )
      );

      summary.recentlyCompleted.push({
        recommendationId: item.recommendationId,
        completedAt: item.completedAt,
        daysSinceCompleted,
        title:
          recommendation?.title ||
          item.recommendationId
      });
    }

    const checklist = Array.isArray(item.checklist)
      ? item.checklist
      : [];

    const completedChecklistItems =
      checklist.filter(
        (checklistItem) =>
          checklistItem?.completed === true
      ).length;

    summary.checklist.totalItems += checklist.length;
    summary.checklist.completedItems +=
      completedChecklistItems;

    summary.checklist.byRecommendation.push({
      recommendationId: item.recommendationId,
      title:
        recommendation?.title ||
        item.recommendationId,
      totalItems: checklist.length,
      completedItems: completedChecklistItems,
      completionPercentage: calculatePercentage(
        completedChecklistItems,
        checklist.length
      )
    });
  }

  summary.completionPercentage =
    calculatePercentage(
      summary.statusTotals.complete,
      summary.totalItems
    );

  summary.checklist.completionPercentage =
    calculatePercentage(
      summary.checklist.completedItems,
      summary.checklist.totalItems
    );

  summary.dates.overdue.sort(
    (a, b) =>
      a.targetDate.localeCompare(b.targetDate)
  );

  summary.dates.upcoming.sort(
    (a, b) =>
      a.targetDate.localeCompare(b.targetDate)
  );

  summary.recentlyCompleted.sort(
    (a, b) =>
      b.completedAt.localeCompare(a.completedAt)
  );

  summary.checklist.byRecommendation.sort(
    (a, b) =>
      a.title.localeCompare(b.title)
  );

  return structuredClone(summary);
}
