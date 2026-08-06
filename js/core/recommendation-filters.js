const PRIORITY_ORDER = {
  immediate: 0,
  high: 1,
  medium: 2,
  future: 3
};

const DIFFICULTY_ORDER = {
  easy: 0,
  moderate: 1,
  advanced: 2
};

export function isQuickWin(recommendation) {
  if (!recommendation || typeof recommendation !== "object") {
    return false;
  }

  return (
    recommendation.difficulty === "easy" &&
    ["immediate", "high"].includes(recommendation.priority)
  );
}

function getRecommendationStatus(
  recommendation,
  actionPlan
) {
  const actionItem = actionPlan?.items?.find(
    (item) =>
      item.recommendationId === recommendation.id
  );

  return actionItem?.status || "not-started";
}

export function filterRecommendations(
  recommendations = [],
  actionPlan = null,
  filters = {}
) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  return recommendations.filter((recommendation) => {
    if (
      filters.status &&
      filters.status !== "all" &&
      getRecommendationStatus(
        recommendation,
        actionPlan
      ) !== filters.status
    ) {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "all" &&
      !recommendation.relatedCategories?.includes(
        filters.category
      )
    ) {
      return false;
    }

    if (
      filters.priority &&
      filters.priority !== "all" &&
      recommendation.priority !== filters.priority
    ) {
      return false;
    }

    if (
      filters.difficulty &&
      filters.difficulty !== "all" &&
      recommendation.difficulty !== filters.difficulty
    ) {
      return false;
    }

    if (
      filters.quickWinsOnly === true &&
      !isQuickWin(recommendation)
    ) {
      return false;
    }

    return true;
  });
}

export function sortFilteredRecommendations(
  recommendations = [],
  sortBy = "original"
) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  const sorted = [...recommendations];

  if (sortBy === "priority") {
    return sorted.sort(
      (a, b) =>
        (PRIORITY_ORDER[a.priority] ?? 99) -
        (PRIORITY_ORDER[b.priority] ?? 99)
    );
  }

  if (sortBy === "difficulty") {
    return sorted.sort(
      (a, b) =>
        (DIFFICULTY_ORDER[a.difficulty] ?? 99) -
        (DIFFICULTY_ORDER[b.difficulty] ?? 99)
    );
  }

  return sorted;
}

export function getVisibleRecommendations(
  recommendations = [],
  actionPlan = null,
  filters = {}
) {
  return sortFilteredRecommendations(
    filterRecommendations(
      recommendations,
      actionPlan,
      filters
    ),
    filters.sortBy
  );
}
