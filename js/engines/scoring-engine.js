function roundScore(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value);
}

export function calculateQuestionScore(question, answer) {
  if (!question || !answer) {
    return null;
  }

  if (answer.value === null || !Number.isFinite(answer.value)) {
    return null;
  }

  const weight = Number(question.weight);

  if (!Number.isFinite(weight) || weight <= 0) {
    return null;
  }

  return {
    questionId: question.id,
    category: question.category,
    answerValue: answer.value,
    weight,
    earnedPoints: weight * answer.value,
    possiblePoints: weight
  };
}

export function getScoredQuestions(questions, answers) {
  if (!Array.isArray(questions) || !answers || typeof answers !== "object") {
    return [];
  }

  return questions
    .map((question) =>
      calculateQuestionScore(question, answers[question.id])
    )
    .filter(Boolean);
}

export function calculateWeightedScore(scoredQuestions) {
  if (!Array.isArray(scoredQuestions) || scoredQuestions.length === 0) {
    return {
      score: null,
      earnedPoints: 0,
      possiblePoints: 0,
      scoredQuestionCount: 0
    };
  }

  const totals = scoredQuestions.reduce(
    (result, item) => {
      result.earnedPoints += item.earnedPoints;
      result.possiblePoints += item.possiblePoints;
      return result;
    },
    {
      earnedPoints: 0,
      possiblePoints: 0
    }
  );

  const score =
    totals.possiblePoints > 0
      ? roundScore(
          (totals.earnedPoints / totals.possiblePoints) * 100
        )
      : null;

  return {
    score,
    earnedPoints: Number(totals.earnedPoints.toFixed(2)),
    possiblePoints: Number(totals.possiblePoints.toFixed(2)),
    scoredQuestionCount: scoredQuestions.length
  };
}

export function calculateCategoryScores(scoredQuestions) {
  if (!Array.isArray(scoredQuestions)) {
    return {};
  }

  const groupedQuestions = scoredQuestions.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }

    groups[item.category].push(item);
    return groups;
  }, {});

  return Object.fromEntries(
    Object.entries(groupedQuestions).map(([category, items]) => [
      category,
      calculateWeightedScore(items)
    ])
  );
}

export function calculateAssessmentScores(questions, answers) {
  const scoredQuestions = getScoredQuestions(questions, answers);
  const overall = calculateWeightedScore(scoredQuestions);
  const categoryScores = calculateCategoryScores(scoredQuestions);

  return {
    overallScore: overall.score,
    earnedPoints: overall.earnedPoints,
    possiblePoints: overall.possiblePoints,
    scoredQuestionCount: overall.scoredQuestionCount,
    categoryScores
  };
}
