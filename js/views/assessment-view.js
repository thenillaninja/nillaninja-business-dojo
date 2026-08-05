function formatCategoryName(category) {
  if (typeof category !== "string") {
    return "";
  }

  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderAnswerOption(question, option, selectedOptionId) {
  const inputId = `${question.id}-${option.id}`;
  const isChecked = option.id === selectedOptionId;

  return `
    <div class="choice-option">
      <input
        class="choice-option__input"
        type="radio"
        id="${inputId}"
        name="${question.id}"
        value="${option.id}"
        ${isChecked ? "checked" : ""}
      >

      <label class="choice-option__label" for="${inputId}">
        ${option.label}
      </label>
    </div>
  `;
}

export function renderAssessmentView({
  question,
  questionIndex,
  questionCount,
  selectedOptionId = "",
  completedQuestionCount = 0,
  completionPercentage = 0,
  errorMessage = ""
}) {
  if (!question) {
    return `
      <section class="assessment-panel" aria-labelledby="assessment-heading">
        <p class="eyebrow">Step 3 of 5</p>
        <h1 id="assessment-heading">Business Assessment</h1>

        <div class="information-box" role="status">
          <h2>Assessment unavailable</h2>
          <p>No assessment question could be loaded.</p>
        </div>
      </section>
    `;
  }

  const questionNumber = questionIndex + 1;
  const optionsMarkup = question.options
    .map((option) =>
      renderAnswerOption(question, option, selectedOptionId)
    )
    .join("");

  return `
    <section class="assessment-panel" aria-labelledby="assessment-heading">
      <p class="eyebrow">Step 3 of 5</p>

      <div class="assessment-progress">
        <div class="assessment-progress__text">
          <span>Question ${questionNumber} of ${questionCount}</span>
          <span>${completedQuestionCount} answered · ${completionPercentage}% complete</span>
        </div>

        <progress
          class="assessment-progress__bar"
          value="${completionPercentage}"
          max="100"
        >
          ${completionPercentage}%
        </progress>
      </div>

      <p class="assessment-panel__category">
        ${formatCategoryName(question.category)}
      </p>

      <form id="assessment-form" novalidate>
        <fieldset class="question-card">
          <legend class="question-card__legend--accessible">
            ${question.question}
          </legend>

          <h1 id="assessment-heading" class="question-card__heading">
            ${question.question}
          </h1>

          <p class="question-card__help" id="${question.id}-help">
            ${question.helpText}
          </p>

          ${
            errorMessage
              ? `
                <p
                  class="field-error"
                  id="assessment-error"
                  role="alert"
                >
                  ${errorMessage}
                </p>
              `
              : ""
          }

          <div
            class="choice-list"
            aria-describedby="${question.id}-help${
              errorMessage ? " assessment-error" : ""
            }"
          >
            ${optionsMarkup}
          </div>
        </fieldset>

        <div class="form-actions">
          <button
            class="button button--secondary"
            type="button"
            id="assessment-back"
          >
            Back
          </button>

          <button
            class="button button--primary"
            type="submit"
          >
            ${questionNumber === questionCount ? "Complete Assessment" : "Continue"}
          </button>
        </div>
      </form>
    </section>
  `;
}
