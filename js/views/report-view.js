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

export function renderReportView({
  businessProfile,
  results
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

      <div class="report-summary">
        <h2>What your score means</h2>
        <p>${getScoreSummary(score)}</p>
      </div>

      <section class="report-section" aria-labelledby="category-scores-heading">
        <div class="report-section__heading">
          <p class="eyebrow">Assessment Breakdown</p>
          <h2 id="category-scores-heading">Category scores</h2>
        </div>

        <div class="category-score-grid">
          ${renderCategoryScores(results?.categoryScores)}
        </div>
      </section>

      <section class="report-section report-section--placeholder">
        <div class="report-section__heading">
          <p class="eyebrow">Coming Next</p>
          <h2>Strengths and recommendations</h2>
        </div>

        <p>
          The next development step will turn your assessment answers into
          clear business strengths, priority opportunities, and practical
          first actions.
        </p>
      </section>

      <div class="form-actions">
        <button
          class="button button--secondary"
          type="button"
          id="report-back"
        >
          Back to Assessment
        </button>
      </div>
    </section>
  `;
}
