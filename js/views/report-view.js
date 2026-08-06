function formatCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getScoreSummary(score) {
  if (!Number.isFinite(score)) {
    return "Your assessment score is not available yet.";
  }

  if (score >= 85) {
    return "Your business shows a strong operational foundation with a few opportunities for refinement.";
  }

  if (score >= 70) {
    return "Your business has several reliable systems in place, with clear opportunities to improve consistency.";
  }

  if (score >= 50) {
    return "Your business has a functional foundation, but several systems may depend on informal or inconsistent processes.";
  }

  return "Your business has important opportunities to strengthen consistency, reduce risk, and make daily operations easier.";
}

function getHighestCategory(categoryScores = {}) {
  const scoredCategories = Object.entries(categoryScores)
    .filter(([, result]) => Number.isFinite(result?.score))
    .sort(([, a], [, b]) => b.score - a.score);

  if (scoredCategories.length === 0) {
    return null;
  }

  const [category, result] = scoredCategories[0];

  return {
    category,
    score: result.score
  };
}

function renderExecutiveSummary(results = {}) {
  const score = Number.isFinite(results.overallScore)
    ? results.overallScore
    : 0;

  const strongestCategory = getHighestCategory(results.categoryScores);
  const topRecommendation = Array.isArray(results.recommendations)
    ? results.recommendations[0]
    : null;

  const strengthsCount = Array.isArray(results.strengths)
    ? results.strengths.length
    : 0;

  const strongestAreaText = strongestCategory
    ? `Your strongest assessed area is ${formatCategoryName(
        strongestCategory.category
      )}, with a score of ${strongestCategory.score}/100.`
    : "Your strongest assessed area will appear as more results become available.";

  const priorityText = topRecommendation
    ? `The first priority is to ${topRecommendation.title.toLowerCase()}.`
    : "No major priority recommendation was triggered by your current answers.";

  const strengthsText =
    strengthsCount === 1
      ? "The assessment identified one standout business strength."
      : `The assessment identified ${strengthsCount} standout business strengths.`;

  return `
    <div class="executive-summary">
      <div class="report-section__heading">
        <p class="eyebrow">At a Glance</p>
        <h2>Executive summary</h2>
      </div>

      <p>
        Your Business Snapshot score is <strong>${score}/100</strong>.
        ${getScoreSummary(score)}
      </p>

      <p>${strongestAreaText} ${strengthsText}</p>

      <p>${priorityText}</p>
    </div>
  `;
}

function renderCategoryScores(categoryScores = {}) {
  const entries = Object.entries(categoryScores);

  if (entries.length === 0) {
    return `
      <p class="report-empty-state">
        Category scores will appear after the assessment is completed.
      </p>
    `;
  }

  return entries
    .map(([category, result]) => {
      const score = Number.isFinite(result.score) ? result.score : 0;

      return `
        <article class="category-score-card">
          <div class="category-score-card__header">
            <h3>${formatCategoryName(category)}</h3>
            <p class="category-score-card__score">${score}/100</p>
          </div>

          <progress
            class="category-score-card__progress"
            value="${score}"
            max="100"
            aria-label="${formatCategoryName(category)} score: ${score} out of 100"
          >
            ${score}%
          </progress>

          <p class="category-score-card__details">
            ${result.earnedPoints} of ${result.possiblePoints} weighted points
          </p>
        </article>
      `;
    })
    .join("");
}

function formatLabel(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderStrengths(strengths = []) {
  if (!Array.isArray(strengths) || strengths.length === 0) {
    return `
      <div class="report-empty-state">
        <h3>No standout strengths were identified</h3>
        <p>
          Fully established business practices will appear here as positive
          findings.
        </p>
      </div>
    `;
  }

  return strengths
    .map(
      (strength) => `
        <article class="strength-card">
          <p class="strength-card__category">
            ${formatCategoryName(strength.category)}
          </p>
          <h3>${strength.title}</h3>
          <p>${strength.summary}</p>
        </article>
      `
    )
    .join("");
}

function getActionPlanProgress(actionPlan) {
  const items = Array.isArray(actionPlan?.items)
    ? actionPlan.items
    : [];

  const total = items.length;
  const completed = items.filter(
    (item) => item.status === "complete"
  ).length;
  const inProgress = items.filter(
    (item) => item.status === "in-progress"
  ).length;
  const notStarted = items.filter(
    (item) => item.status === "not-started"
  ).length;

  const percentage =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    percentage
  };
}

function renderActionPlanSummary(actionPlan) {
  const progress = getActionPlanProgress(actionPlan);

  if (progress.total === 0) {
    return "";
  }

  return `
    <div class="action-plan-summary" id="action-plan">
      <div class="action-plan-summary__header">
        <div>
          <p class="eyebrow">Interactive Action Plan</p>
          <h3>Your improvement progress</h3>
          <p>
            Track each recommendation as your business works through
            the improvement plan.
          </p>
        </div>

        <div
          class="action-plan-summary__percentage"
          aria-label="${progress.percentage} percent complete"
        >
          ${progress.percentage}%
        </div>
      </div>

      <progress
        class="action-plan-summary__progress"
        value="${progress.percentage}"
        max="100"
        aria-label="Action plan progress: ${progress.percentage} percent"
      >
        ${progress.percentage}%
      </progress>

      <div class="action-plan-summary__counts">
        <p>
          <strong>${progress.completed}</strong>
          Complete
        </p>

        <p>
          <strong>${progress.inProgress}</strong>
          In progress
        </p>

        <p>
          <strong>${progress.notStarted}</strong>
          Not started
        </p>
      </div>
    </div>
  `;
}

function renderActionPlanJump(actionPlan) {
  const progress = getActionPlanProgress(actionPlan);

  if (progress.total === 0) {
    return "";
  }

  const hasStarted =
    progress.inProgress > 0 ||
    progress.completed > 0;

  const label = hasStarted
    ? "Continue Action Plan"
    : "View Action Plan";

  return `
    <div class="report-action-plan-jump">
      <div class="report-action-plan-jump__content">
        <h3>Review the report first</h3>
        <p>
          The recommendations below explain what to improve and why it
          matters. This shortcut is for returning users who want to update
          their Action Plan without scrolling through the full report again.
        </p>
      </div>

      <button
        class="button button--secondary"
        id="report-action-plan-jump"
        type="button"
      >
        ${label}
      </button>
    </div>
  `;
}

function renderRecommendations(
  recommendations = [],
  actionPlan = null
) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return `
      <div class="report-empty-state">
        <h3>No priority recommendations were triggered</h3>
        <p>
          Your answers did not identify any major gaps within the current
          assessment.
        </p>
      </div>
    `;
  }

  return recommendations
    .map((recommendation, index) => {
      const actionItem = actionPlan?.items?.find(
        (item) =>
          item.recommendationId === recommendation.id
      );

      const status =
        actionItem?.status || "not-started";

      return `
        <article class="recommendation-card">
          <div class="recommendation-card__header">
            <div>
              <p class="recommendation-card__number">
                Recommendation ${index + 1}
              </p>
              <h3>${recommendation.title}</h3>
            </div>

            <span
              class="recommendation-card__priority recommendation-card__priority--${recommendation.priority}"
            >
              ${formatLabel(recommendation.priority)}
            </span>
          </div>

          <p class="recommendation-card__summary">
            ${recommendation.summary}
          </p>

          <div class="recommendation-card__meta">
            <p>
              <strong>Difficulty:</strong>
              ${formatLabel(recommendation.difficulty)}
            </p>
            <p>
              <strong>Estimated effort:</strong>
              ${recommendation.estimatedEffort}
            </p>
          </div>

          <div class="recommendation-card__details">
            <div>
              <h4>Why it matters</h4>
              <p>${recommendation.whyItMatters}</p>
            </div>

            <div>
              <h4>Expected impact</h4>
              <p>${recommendation.expectedImpact}</p>
            </div>
          </div>

          <div class="recommendation-card__first-action">
            <h4>Start here</h4>
            <p>${recommendation.firstAction}</p>
          </div>

          <div class="recommendation-card__action-status">
            <label for="action-status-${recommendation.id}">
              Action status
            </label>

            <select
              id="action-status-${recommendation.id}"
              data-action-status="${recommendation.id}"
            >
              <option
                value="not-started"
                ${status === "not-started" ? "selected" : ""}
              >
                Not started
              </option>

              <option
                value="in-progress"
                ${status === "in-progress" ? "selected" : ""}
              >
                In progress
              </option>

              <option
                value="complete"
                ${status === "complete" ? "selected" : ""}
              >
                Complete
              </option>
            </select>
          </div>
        </article>
      `;
    })
    .join("");
}

export function renderReportView({
  businessProfile,
  results,
  actionPlan
}) {
  const businessName =
    businessProfile?.businessName?.trim() || "Your Business";

  const score = Number.isFinite(results?.overallScore)
    ? results.overallScore
    : 0;

  return `
    <section class="report-panel" aria-labelledby="report-heading">
      <p class="eyebrow">Step 4 of 5</p>

      <div class="report-panel__header">
        <div>
          <h1 id="report-heading">Business Snapshot Report</h1>
          <p class="report-panel__business-name">${businessName}</p>
        </div>

        <div class="overall-score" aria-label="Overall score: ${score} out of 100">
          <span class="overall-score__value">${score}</span>
          <span class="overall-score__maximum">/100</span>
        </div>
      </div>

      ${renderExecutiveSummary(results)}

      ${renderActionPlanJump(actionPlan)}

      <section class="report-section" aria-labelledby="category-scores-heading">
        <div class="report-section__heading">
          <p class="eyebrow">Assessment Breakdown</p>
          <h2 id="category-scores-heading">Category scores</h2>
        </div>

        <div class="category-score-grid">
          ${renderCategoryScores(results?.categoryScores)}
        </div>
      </section>

      <section
        class="report-section"
        aria-labelledby="strengths-heading"
      >
        <div class="report-section__heading">
          <p class="eyebrow">What Is Working</p>
          <h2 id="strengths-heading">Business strengths</h2>
          <p class="report-section__intro">
            These are the strongest systems and practices reflected in your
            assessment answers.
          </p>
        </div>

        <div class="strength-grid">
          ${renderStrengths(results?.strengths)}
        </div>
      </section>

      <section
        class="report-section"
        aria-labelledby="recommendations-heading"
      >
        <div class="report-section__heading">
          <p class="eyebrow">Priority Action Plan</p>
          <h2 id="recommendations-heading">Recommended next steps</h2>
          <p class="report-section__intro">
            These recommendations are based on the areas where your answers
            showed the greatest opportunity or risk.
          </p>
        </div>

        <div class="recommendation-list">
          ${renderRecommendations(
            results?.recommendations,
            actionPlan
          )}
        </div>

        ${renderActionPlanSummary(actionPlan)}
      </section>

      <section
        class="report-section report-export"
        aria-labelledby="export-heading"
      >
        <div class="report-section__heading">
          <p class="eyebrow">Step 5 of 5</p>
          <h2 id="export-heading">Export your report</h2>
          <p class="report-section__intro">
            Copy the report, download it as a text file, or print it from your
            browser.
          </p>
        </div>

        <div class="report-export__actions">
          <button
            class="button button--primary"
            type="button"
            id="report-copy"
          >
            Copy Report
          </button>

          <button
            class="button button--secondary"
            type="button"
            id="report-download"
          >
            Download TXT
          </button>

          <button
            class="button button--secondary"
            type="button"
            id="report-print"
          >
            Print Report
          </button>
        </div>

        <p
          class="report-export__status"
          id="report-export-status"
          role="status"
          aria-live="polite"
        ></p>
      </section>

      <div class="form-actions">
        <button
          class="button button--secondary"
          type="button"
          id="report-back"
        >
          Back to Assessment
        </button>

        <button
          class="button button--secondary"
          type="button"
          id="report-new-assessment"
        >
          New Assessment
        </button>
      </div>
    </section>
  `;
}
