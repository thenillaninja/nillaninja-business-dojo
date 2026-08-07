import {
  isQuickWin
} from "./recommendation-filters.js";

const PRIORITY_SCORES = {
  immediate: 400,
  high: 300,
  medium: 200,
  future: 100
};

const DIFFICULTY_SCORES = {
  easy: 25,
  moderate: 10,
  advanced: 0
};

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

function parseTargetDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
}

function getDaysUntilTarget(targetDate, today) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round(
    (targetDate - today) / millisecondsPerDay
  );
}

function getChecklistProgress(actionItem) {
  const checklist = Array.isArray(actionItem?.checklist)
    ? actionItem.checklist
    : [];

  const completedItems = checklist.filter(
    (item) => item?.completed === true
  ).length;

  return {
    totalItems: checklist.length,
    completedItems,
    hasPartialProgress:
      checklist.length > 0 &&
      completedItems > 0 &&
      completedItems < checklist.length
  };
}

function buildCandidate(
  recommendation,
  actionItem,
  index,
  today
) {
  const status =
    actionItem?.status || "not-started";

  if (status === "complete") {
    return null;
  }

  let score =
    PRIORITY_SCORES[recommendation.priority] ?? 0;

  const reasons = [];

  if (recommendation.priority === "immediate") {
    reasons.push("Immediate priority");
  } else if (recommendation.priority === "high") {
    reasons.push("High priority");
  }

  if (status === "in-progress") {
    score += 90;
    reasons.push("Already in progress");
  }

  const targetDate =
    parseTargetDate(actionItem?.targetDate);

  let daysUntilTarget = null;

  if (targetDate) {
    daysUntilTarget =
      getDaysUntilTarget(targetDate, today);

    if (daysUntilTarget < 0) {
      score += 180;
      reasons.push("Target date is overdue");
    } else if (daysUntilTarget <= 7) {
      score += 120;
      reasons.push("Target date is within 7 days");
    } else if (daysUntilTarget <= 30) {
      score += 70;
      reasons.push("Target date is within 30 days");
    }
  }

  const quickWin = isQuickWin(recommendation);

  if (quickWin) {
    score += 60;
    reasons.push("Quick win");
  }

  score +=
    DIFFICULTY_SCORES[recommendation.difficulty] ?? 0;

  const checklistProgress =
    getChecklistProgress(actionItem);

  if (checklistProgress.hasPartialProgress) {
    score += 35;
    reasons.push("Checklist work has already started");
  }

  if (reasons.length === 0) {
    reasons.push("Recommended improvement");
  }

  return {
    recommendationId: recommendation.id,
    title: recommendation.title,
    priority: recommendation.priority,
    difficulty: recommendation.difficulty,
    estimatedEffort:
      recommendation.estimatedEffort || "",
    status,
    targetDate:
      actionItem?.targetDate || null,
    daysUntilTarget,
    quickWin,
    checklist: {
      totalItems: checklistProgress.totalItems,
      completedItems:
        checklistProgress.completedItems
    },
    score,
    reasons,
    originalIndex: index
  };
}

export function selectNextBestActions(
  recommendations = [],
  actionPlan = null,
  {
    today,
    limit = 3
  } = {}
) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  const currentDate = normalizeToday(today);

  const actionItems = new Map(
    Array.isArray(actionPlan?.items)
      ? actionPlan.items.map((item) => [
          item.recommendationId,
          item
        ])
      : []
  );

  const maximum = Number.isInteger(limit)
    ? Math.max(0, limit)
    : 3;

  return recommendations
    .map((recommendation, index) =>
      buildCandidate(
        recommendation,
        actionItems.get(recommendation?.id),
        index,
        currentDate
      )
    )
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.originalIndex - b.originalIndex;
    })
    .slice(0, maximum)
    .map(({ originalIndex, ...candidate }) =>
      structuredClone(candidate)
    );
}
