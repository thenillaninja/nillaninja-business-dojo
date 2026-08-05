import { getRecommendationById } from "../../data/business-recommendations.js";

const PRIORITY_ORDER = {
  immediate: 0,
  high: 1,
  medium: 2,
  future: 3
};

const BUSINESS_PRIORITY_CATEGORIES = {
  "save-time": [
    "technology-and-workflow",
    "operations"
  ],
  "improve-consistency": [
    "operations",
    "team-and-responsibility"
  ],
  "increase-sales": [
    "sales-and-marketing",
    "customer-experience"
  ],
  "improve-customer-experience": [
    "customer-experience",
    "accessibility-and-inclusion"
  ],
  "reduce-owner-workload": [
    "team-and-responsibility",
    "operations",
    "technology-and-workflow"
  ],
  "improve-security": [
    "security-and-continuity"
  ],
  "prepare-for-growth": [
    "operations",
    "team-and-responsibility",
    "technology-and-workflow"
  ]
};

export function getPreferredCategories(currentPriority) {
  return BUSINESS_PRIORITY_CATEGORIES[currentPriority] ?? [];
}

function isPreferredRecommendation(
  recommendation,
  preferredCategories
) {
  if (
    !Array.isArray(preferredCategories) ||
    preferredCategories.length === 0
  ) {
    return false;
  }

  return recommendation.relatedCategories?.some((category) =>
    preferredCategories.includes(category)
  ) ?? false;
}


export function shouldTriggerRecommendation(answer) {
  if (!answer || answer.value === null) {
    return false;
  }

  return Number.isFinite(answer.value) && answer.value < 0.67;
}

export function collectRecommendationTriggers(questions, answers) {
  if (!Array.isArray(questions) || !answers || typeof answers !== "object") {
    return [];
  }

  return questions.flatMap((question) => {
    const answer = answers[question.id];

    if (
      !shouldTriggerRecommendation(answer) ||
      !Array.isArray(question.recommendationKeys)
    ) {
      return [];
    }

    return question.recommendationKeys.map((recommendationId) => ({
      recommendationId,
      questionId: question.id,
      category: question.category,
      questionWeight: Number(question.weight) || 0,
      answerValue: answer.value
    }));
  });
}

export function groupRecommendationTriggers(triggers) {
  if (!Array.isArray(triggers)) {
    return {};
  }

  return triggers.reduce((groups, trigger) => {
    if (!groups[trigger.recommendationId]) {
      groups[trigger.recommendationId] = [];
    }

    groups[trigger.recommendationId].push(trigger);
    return groups;
  }, {});
}

export function createRecommendationResult(
  recommendationId,
  relatedTriggers
) {
  const recommendation = getRecommendationById(recommendationId);

  if (!recommendation) {
    return null;
  }

  const uniqueQuestionIds = [
    ...new Set(relatedTriggers.map((trigger) => trigger.questionId))
  ];

  const highestQuestionWeight = relatedTriggers.reduce(
    (highest, trigger) =>
      Math.max(highest, trigger.questionWeight),
    0
  );

  const relatedCategories = [
    ...new Set(
      relatedTriggers.map((trigger) => trigger.category)
    )
  ];

  const lowestAnswerValue = relatedTriggers.reduce(
    (lowest, trigger) =>
      Math.min(lowest, trigger.answerValue),
    1
  );

  return {
    ...recommendation,
    relatedFindings: uniqueQuestionIds,
    relatedCategories,
    findingCount: uniqueQuestionIds.length,
    highestQuestionWeight,
    lowestAnswerValue
  };
}

export function sortRecommendations(
  recommendations,
  preferredCategories = []
) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  return [...recommendations].sort((a, b) => {
    const priorityDifference =
      (PRIORITY_ORDER[a.priority] ?? 99) -
      (PRIORITY_ORDER[b.priority] ?? 99);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const preferredDifference =
      Number(
        isPreferredRecommendation(b, preferredCategories)
      ) -
      Number(
        isPreferredRecommendation(a, preferredCategories)
      );

    if (preferredDifference !== 0) {
      return preferredDifference;
    }

    if (b.findingCount !== a.findingCount) {
      return b.findingCount - a.findingCount;
    }

    return b.highestQuestionWeight - a.highestQuestionWeight;
  });
}

export function selectBalancedRecommendations(
  recommendations,
  maximumRecommendations = 6,
  maximumPerCategory = 3,
  preferredCategories = []
) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  if (
    !Number.isInteger(maximumRecommendations) ||
    maximumRecommendations <= 0
  ) {
    return [...recommendations];
  }

  const selected = [];
  const deferred = [];
  const categoryCounts = {};

  for (const recommendation of recommendations) {
    const primaryCategory =
      recommendation.relatedCategories?.[0] ?? "uncategorized";

    const categoryCount = categoryCounts[primaryCategory] ?? 0;

    if (categoryCount < maximumPerCategory) {
      selected.push(recommendation);
      categoryCounts[primaryCategory] = categoryCount + 1;
    } else {
      deferred.push(recommendation);
    }

    if (selected.length === maximumRecommendations) {
      break;
    }
  }

  const primaryPreferredCategory =
    preferredCategories[0] ?? null;

  const primaryCategoryIsRepresented =
    primaryPreferredCategory
      ? selected.some((recommendation) =>
          recommendation.relatedCategories?.includes(
            primaryPreferredCategory
          )
        )
      : true;

  const preferredCandidate =
    primaryPreferredCategory &&
    !primaryCategoryIsRepresented
      ? recommendations
          .filter(
            (recommendation) =>
              recommendation.priority !== "immediate" &&
              !selected.includes(recommendation) &&
              recommendation.relatedCategories?.includes(
                primaryPreferredCategory
              )
          )
          .sort((a, b) => {
            if (a.lowestAnswerValue !== b.lowestAnswerValue) {
              return a.lowestAnswerValue - b.lowestAnswerValue;
            }

            return (
              b.highestQuestionWeight -
              a.highestQuestionWeight
            );
          })[0]
      : null;

  if (
    preferredCandidate &&
    selected.length === maximumRecommendations
  ) {
    const replaceableIndex = [...selected]
      .reverse()
      .findIndex(
        (recommendation) =>
          recommendation.priority !== "immediate" &&
          !isPreferredRecommendation(
            recommendation,
            preferredCategories
          )
      );

    if (replaceableIndex !== -1) {
      const actualIndex =
        selected.length - 1 - replaceableIndex;

      selected[actualIndex] = preferredCandidate;
    }
  }

  if (selected.length === maximumRecommendations) {
    return selected;
  }

  for (const recommendation of deferred) {
    selected.push(recommendation);

    if (selected.length === maximumRecommendations) {
      break;
    }
  }

  return selected;
}

export function generateRecommendations(
  questions,
  answers,
  maximumRecommendations = 6,
  currentPriority = ""
) {
  const triggers = collectRecommendationTriggers(questions, answers);
  const groupedTriggers = groupRecommendationTriggers(triggers);

  const recommendations = Object.entries(groupedTriggers)
    .map(([recommendationId, relatedTriggers]) =>
      createRecommendationResult(
        recommendationId,
        relatedTriggers
      )
    )
    .filter(Boolean);

  const preferredCategories =
    getPreferredCategories(currentPriority);

  const sortedRecommendations = sortRecommendations(
    recommendations,
    preferredCategories
  );

  return selectBalancedRecommendations(
    sortedRecommendations,
    maximumRecommendations,
    3,
    preferredCategories
  );
}
