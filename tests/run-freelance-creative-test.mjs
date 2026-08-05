import {
  standardAnswerOptions,
  businessAssessmentQuestions
} from "../data/business-assessment.js?mock=2";

import {
  calculateAssessmentScores
} from "../js/engines/scoring-engine.js?mock=2";

import {
  generateRecommendations
} from "../js/engines/recommendation-engine.js?mock=5";

import {
  generateStrengths
} from "../js/engines/strengths-engine.js?mock=2";

import {
  freelanceCreativeBusiness
} from "./mock-businesses/freelance-creative-business.js?mock=7";

function createAnswers(questions, answerOptionIds) {
  const optionsById = Object.fromEntries(
    standardAnswerOptions.map((option) => [option.id, option])
  );

  return Object.fromEntries(
    questions.map((question) => {
      const optionId = answerOptionIds[question.id];
      const option = optionsById[optionId];

      if (!option) {
        throw new Error(
          `Invalid answer option "${optionId}" for "${question.id}".`
        );
      }

      return [
        question.id,
        {
          questionId: question.id,
          optionId: option.id,
          value: option.value,
          answeredAt: "2026-08-04T00:00:00.000Z"
        }
      ];
    })
  );
}

const answers = createAnswers(
  businessAssessmentQuestions,
  freelanceCreativeBusiness.answerOptionIds
);

const scores = calculateAssessmentScores(
  businessAssessmentQuestions,
  answers
);

const strengths = generateStrengths(
  businessAssessmentQuestions,
  answers
);

const recommendations = generateRecommendations(
  businessAssessmentQuestions,
  answers
);

console.log("MOCK BUSINESS");
console.log(freelanceCreativeBusiness.profile.businessName);
console.log();

console.log("OVERALL SCORE");
console.log(scores.overallScore);
console.log();

console.log("CATEGORY SCORES");
for (const [category, result] of Object.entries(scores.categoryScores)) {
  console.log(
    `${category}: ${result.score} ` +
      `(${result.scoredQuestionCount} applicable questions)`
  );
}
console.log();

console.log(`STRENGTHS (${strengths.length})`);
strengths.forEach((strength, index) => {
  console.log(`${index + 1}. ${strength.title}`);
});
console.log();

console.log(`RECOMMENDATIONS (${recommendations.length})`);
recommendations.forEach((recommendation, index) => {
  console.log(
    `${index + 1}. ${recommendation.title} ` +
      `[${recommendation.priority}]`
  );
});
