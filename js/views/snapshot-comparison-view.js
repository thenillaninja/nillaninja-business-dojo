function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(date);
}

function formatLabel(value = "") {
  return String(value)
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatChange(value) {
  if (!Number.isFinite(value)) {
    return "Unavailable";
  }

  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function renderCategoryChanges(categories = []) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return `
      <div class="comparison-empty-state">
        <p>No compatible category scores were available.</p>
      </div>
    `;
  }

  return categories
    .map(
      (category) => `
        <article
          class="comparison-category comparison-category--${category.direction}"
        >
          <div class="comparison-category__heading">
            <h3>${formatLabel(category.categoryId)}</h3>

            <span class="comparison-category__change">
              ${formatChange(category.change)}
            </span>
          </div>

          <p>
            <strong>${category.earlierScore ?? "—"}</strong>
            <span aria-hidden="true">→</span>
            <strong>${category.laterScore ?? "—"}</strong>
          </p>

          <p class="comparison-category__direction">
            ${formatLabel(category.direction)}
          </p>
        </article>
      `
    )
    .join("");
}

function renderItemList(items = [], emptyMessage) {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <p class="comparison-list__empty">
        ${emptyMessage}
      </p>
    `;
  }

  return `
    <ul class="comparison-list">
      ${items
        .map(
          (item) => `
            <li>${item.title || item.id || "Untitled item"}</li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderOverallSummary(comparison) {
  const change = comparison.overallScore.change;

  if (change > 0) {
    return `
      The later snapshot score is ${change} points higher. Review the
      category details below to see where the reported practices changed.
    `;
  }

  if (change < 0) {
    return `
      The later snapshot score is ${Math.abs(change)} points lower. This may
      reflect changed operations, increased challenges, or more accurate
      answers rather than a simple decline in business quality.
    `;
  }

  return `
    The overall score is unchanged, though individual categories,
    strengths, and recommendations may still have shifted.
  `;
}

export function renderSnapshotComparisonView(comparison) {
  const earlierDate = formatDate(
    comparison.earlierSnapshot?.completedAt ||
      comparison.earlierSnapshot?.createdAt
  );

  const laterDate = formatDate(
    comparison.laterSnapshot?.completedAt ||
      comparison.laterSnapshot?.createdAt
  );

  return `
    <section
      class="snapshot-comparison"
      aria-labelledby="snapshot-comparison-heading"
    >
      <p class="eyebrow">Progress Comparison</p>

      <div class="snapshot-comparison__heading">
        <div>
          <h1 id="snapshot-comparison-heading">
            ${comparison.businessName}
          </h1>
          <p>
            Compare two completed Business Snapshots and review how the
            reported systems, strengths, and priorities changed.
          </p>
        </div>

        <button
          class="button button--secondary"
          type="button"
          id="snapshot-comparison-back"
        >
          Back to Snapshot Library
        </button>
      </div>

      <div class="comparison-score-grid">
        <article class="comparison-score-card">
          <p>Earlier snapshot</p>
          <h2>${comparison.overallScore.earlier}/100</h2>
          <span>${earlierDate}</span>
        </article>

        <article class="comparison-score-card">
          <p>Later snapshot</p>
          <h2>${comparison.overallScore.later}/100</h2>
          <span>${laterDate}</span>
        </article>

        <article class="comparison-score-card comparison-score-card--change">
          <p>Overall change</p>
          <h2>${formatChange(comparison.overallScore.change)}</h2>
          <span>points</span>
        </article>
      </div>

      <div class="comparison-summary">
        <h2>What changed overall</h2>
        <p>${renderOverallSummary(comparison)}</p>
      </div>

      <section
        class="comparison-section"
        aria-labelledby="comparison-categories-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Score Movement</p>
          <h2 id="comparison-categories-heading">
            Category comparison
          </h2>
        </div>

        <div class="comparison-category-grid">
          ${renderCategoryChanges(comparison.categoryScores)}
        </div>
      </section>

      <section
        class="comparison-section"
        aria-labelledby="comparison-strengths-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Business Strengths</p>
          <h2 id="comparison-strengths-heading">
            Strength changes
          </h2>
        </div>

        <div class="comparison-three-column">
          <article>
            <h3>Newly developed</h3>
            ${renderItemList(
              comparison.strengths.newlyDeveloped,
              "No new strengths appeared in the later snapshot."
            )}
          </article>

          <article>
            <h3>Still reflected</h3>
            ${renderItemList(
              comparison.strengths.continuing,
              "No strengths were listed in both snapshots."
            )}
          </article>

          <article>
            <h3>No longer listed</h3>
            ${renderItemList(
              comparison.strengths.noLongerListed,
              "No earlier strengths disappeared from the later snapshot."
            )}
          </article>
        </div>
      </section>

      <section
        class="comparison-section"
        aria-labelledby="comparison-recommendations-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Priority Changes</p>
          <h2 id="comparison-recommendations-heading">
            Recommendation changes
          </h2>
        </div>

        <div class="comparison-three-column">
          <article>
            <h3>Resolved or no longer triggered</h3>
            ${renderItemList(
              comparison.recommendations.resolved,
              "No earlier recommendations disappeared from the later snapshot."
            )}
          </article>

          <article>
            <h3>Still unresolved</h3>
            ${renderItemList(
              comparison.recommendations.continuing,
              "No recommendations continued across both snapshots."
            )}
          </article>

          <article>
            <h3>Newly triggered</h3>
            ${renderItemList(
              comparison.recommendations.newlyTriggered,
              "No new recommendations appeared in the later snapshot."
            )}
          </article>
        </div>
      </section>

      <div class="comparison-notice">
        <h2>How to interpret this comparison</h2>
        <p>
          Score changes reflect differences in the answers recorded in each
          assessment. They can help reveal patterns and reported progress,
          but they do not guarantee financial growth, operational success,
          legal compliance, or any specific business outcome.
        </p>
      </div>
    </section>
  `;
}
