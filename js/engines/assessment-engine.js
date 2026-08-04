export function getQuestionCount(questions) {
  return Array.isArray(questions) ? questions.length : 0;
}

export function getQuestionByIndex(questions, questionIndex) {
  if (!Array.isArray(questions)) {
    return null;
  }

  if (!Number.isInteger(questionIndex)) {
    return null;
  }

  return questions[questionIndex] ?? null;
}

export function getAnswerOption(question, optionId) {
  if (!question || !Array.isArray(question.options)) {
    return null;
  }

  return question.options.find((option) => option.id === optionId) ?? null;
}

export function createAssessmentAnswer(question, optionId) {
  const option = getAnswerOption(question, optionId);

  if (!question || !option) {
    return null;
  }

  return {
    questionId: question.id,
    optionId: option.id,
    value: option.value,
    answeredAt: new Date().toISOString()
  };
}

export function getCompletedQuestionIds(questions, answers) {
  if (!Array.isArray(questions) || !answers || typeof answers !== "object") {
    return [];
  }

  return questions
    .filter((question) => answers[question.id])
    .map((question) => question.id);
}

export function calculateCompletionPercentage(questions, answers) {
  const questionCount = getQuestionCount(questions);

  if (questionCount === 0) {
    return 0;
  }

  const completedCount = getCompletedQuestionIds(questions, answers).length;

  return Math.round((completedCount / questionCount) * 100);
}

export function updateAssessmentState(
  assessmentState,
  questions,
  questionId,
  optionId
) {
  const question = questions.find((item) => item.id === questionId);

  if (!question) {
    return assessmentState;
  }

  const answer = createAssessmentAnswer(question, optionId);

  if (!answer) {
    return assessmentState;
  }

  const answers = {
    ...assessmentState.answers,
    [questionId]: answer
  };

  return {
    ...assessmentState,
    answers,
    completedQuestionIds: getCompletedQuestionIds(questions, answers),
    completionPercentage: calculateCompletionPercentage(questions, answers)
  };
}
