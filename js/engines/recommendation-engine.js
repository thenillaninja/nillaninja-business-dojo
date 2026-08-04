import { getRecommendationById } from "../../data/business-recommendations.js";

const PRIORITY_ORDER = {
  immediate: 0,
  high: 1,
  medium: 2,
  future: 3
};

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

  return {
    ...recommendation,
    relatedFindings: uniqueQuestionIds,
    findingCount: uniqueQuestionIds.length,
    highestQuestionWeight
  };
}

export function sortRecommendations(recommendations) {
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

    if (b.findingCount !== a.findingCount) {
      return b.findingCount - a.findingCount;
    }

    return b.highestQuestionWeight - a.highestQuestionWeight;
  });
}

export function generateRecommendations(
  questions,
  answers,
  maximumRecommendations = 6
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

  const sortedRecommendations = sortRecommendations(recommendations);

  return Number.isInteger(maximumRecommendations) &&
    maximumRecommendations > 0
    ? sortedRecommendations.slice(0, maximumRecommendations)
    : sortedRecommendations;
}
