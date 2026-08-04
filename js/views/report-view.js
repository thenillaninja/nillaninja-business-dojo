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

function formatLabel(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderRecommendations(recommendations = []) {
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
    .map(
      (recommendation, index) => `
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
        </article>
      `
    )
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
          ${renderRecommendations(results?.recommendations)}
        </div>
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
