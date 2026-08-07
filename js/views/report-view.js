import { summarizeActionPlanProgress } from "../core/progress.js";

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

function renderActionPlanSummary(actionPlan, results = {}) {
  const progress = summarizeActionPlanProgress(
    actionPlan,
    { results }
  );

  if (progress.totalItems === 0) {
    return "";
  }

  const recentlyCompletedCount =
    progress.recentlyCompleted.length;

  const overdueCount =
    progress.dates.overdue.length;

  const upcomingCount =
    progress.dates.upcoming.length;

  return `
    <section
      class="action-plan-summary"
      id="action-plan"
      aria-labelledby="progress-dashboard-heading"
    >
      <div class="action-plan-summary__header">
        <div>
          <p class="eyebrow">Progress Dashboard</p>
          <h3 id="progress-dashboard-heading">
            Your improvement progress
          </h3>
          <p>
            See what has been completed, what needs attention, and
            where your action plan stands today.
          </p>
        </div>

        <div
          class="action-plan-summary__percentage"
          data-action-plan-percentage
          aria-label="${progress.completionPercentage} percent complete"
        >
          ${progress.completionPercentage}%
        </div>
      </div>

      <progress
        class="action-plan-summary__progress"
        data-action-plan-progress
        value="${progress.completionPercentage}"
        max="100"
        aria-label="Action plan progress: ${progress.completionPercentage} percent"
      >
        ${progress.completionPercentage}%
      </progress>

      <div
        class="action-plan-summary__counts"
        aria-label="Action-plan status totals"
      >
        <p>
          <strong data-action-plan-count="complete">
            ${progress.statusTotals.complete}
          </strong>
          Complete
        </p>

        <p>
          <strong data-action-plan-count="in-progress">
            ${progress.statusTotals.inProgress}
          </strong>
          In progress
        </p>

        <p>
          <strong data-action-plan-count="not-started">
            ${progress.statusTotals.notStarted}
          </strong>
          Not started
        </p>
      </div>

      <div class="progress-dashboard__details">
        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            Immediate priorities remaining
          </p>
          <p class="progress-dashboard__value">
            ${progress.priorityRemaining.immediate}
          </p>
          <p class="progress-dashboard__context">
            Urgent recommendations that are not yet complete.
          </p>
        </article>

        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            High priorities remaining
          </p>
          <p class="progress-dashboard__value">
            ${progress.priorityRemaining.high}
          </p>
          <p class="progress-dashboard__context">
            Important improvements still requiring attention.
          </p>
        </article>

        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            Overdue target dates
          </p>
          <p class="progress-dashboard__value">
            ${overdueCount}
          </p>
          <p class="progress-dashboard__context">
            Incomplete items whose target dates have passed.
          </p>
        </article>

        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            Upcoming target dates
          </p>
          <p class="progress-dashboard__value">
            ${upcomingCount}
          </p>
          <p class="progress-dashboard__context">
            Incomplete items due within the next 30 days.
          </p>
        </article>

        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            Checklist progress
          </p>
          <p class="progress-dashboard__value">
            ${progress.checklist.completionPercentage}%
          </p>
          <p class="progress-dashboard__context">
            ${progress.checklist.completedItems} of
            ${progress.checklist.totalItems} checklist steps complete.
          </p>
        </article>

        <article class="progress-dashboard__metric">
          <p class="progress-dashboard__label">
            Recently completed
          </p>
          <p class="progress-dashboard__value">
            ${recentlyCompletedCount}
          </p>
          <p class="progress-dashboard__context">
            Improvements completed within the last 30 days.
          </p>
        </article>
      </div>
    </section>
  `;
}

function renderActionPlanJump(actionPlan) {
  const progress = summarizeActionPlanProgress(
    actionPlan,
    null
  );

  if (progress.totalItems === 0) {
    return "";
  }

  const hasStarted =
    progress.statusTotals.inProgress > 0 ||
    progress.statusTotals.complete > 0;

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

function renderActionPlanIndex(
  recommendations = [],
  actionPlan = null
) {
  if (
    !Array.isArray(recommendations) ||
    recommendations.length === 0 ||
    !Array.isArray(actionPlan?.items)
  ) {
    return "";
  }

  const rows = recommendations
    .map((recommendation, index) => {
      const actionItem = actionPlan.items.find(
        (item) =>
          item.recommendationId === recommendation.id
      );

      const status = actionItem?.status || "not-started";
      const targetDate = actionItem?.targetDate || "No date set";
      const responsiblePerson =
        actionItem?.responsiblePerson || "Not assigned";

      return `
        <li class="action-plan-index__item">
          <div class="action-plan-index__number">
            ${index + 1}
          </div>

          <div class="action-plan-index__content">
            <h4>${recommendation.title}</h4>

            <div class="action-plan-index__meta">
              <span>
                <strong>Status:</strong>
                <span
                  data-action-plan-index-status="${recommendation.id}"
                >
                  ${formatLabel(status)}
                </span>
              </span>

              <span>
                <strong>Target:</strong>
                ${targetDate}
              </span>

              <span>
                <strong>Owner:</strong>
                ${responsiblePerson}
              </span>
            </div>
          </div>

          <button
            class="button button--secondary action-plan-index__button"
            type="button"
            data-action-plan-item-jump="${recommendation.id}"
          >
            Update Item
          </button>
        </li>
      `;
    })
    .join("");

  return `
    <section
      class="action-plan-index"
      aria-labelledby="action-plan-index-heading"
    >
      <div class="action-plan-index__header">
        <p class="eyebrow">Working Action Plan</p>
        <h2 id="action-plan-index-heading">
          Your action plan items
        </h2>
        <p>
          Return directly to any recommendation when you are ready to
          update its progress, ownership, target date, or notes.
        </p>
      </div>

      <ol class="action-plan-index__list">
        ${rows}
      </ol>
    </section>
  `;
}

export function renderActionChecklist(
  actionItem,
  recommendationId
) {
  const checklist = Array.isArray(actionItem?.checklist)
    ? actionItem.checklist
    : [];

  const itemsMarkup = checklist.length
    ? checklist
        .map(
          (item, index) => `
            <li
              class="action-checklist__item ${
                item.completed
                  ? "action-checklist__item--complete"
                  : ""
              }"
            >
              <div class="action-checklist__item-header">
                <h5>Action ${index + 1}</h5>

                <div class="action-checklist__item-actions">
                  <label
                    class="action-checklist__complete-control"
                    for="checklist-${item.id}"
                  >
                    <input
                      class="action-checklist__checkbox"
                      id="checklist-${item.id}"
                      type="checkbox"
                      ${item.completed ? "checked" : ""}
                      data-checklist-completion
                      data-recommendation-id="${recommendationId}"
                      data-checklist-item-id="${item.id}"
                    />

                    <span>Complete</span>
                  </label>

                  <button
                    class="action-checklist__remove"
                    type="button"
                    data-checklist-remove
                    data-recommendation-id="${recommendationId}"
                    data-checklist-item-id="${item.id}"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <label
                class="action-checklist__details-label"
                for="checklist-text-${item.id}"
              >
                Action ${index + 1} Details
              </label>

              <textarea
                class="action-checklist__text"
                id="checklist-text-${item.id}"
                rows="3"
                data-checklist-text
                data-recommendation-id="${recommendationId}"
                data-checklist-item-id="${item.id}"
              >${item.text}</textarea>
            </li>
          `
        )
        .join("")
    : `
        <li class="action-checklist__empty">
          No checklist items yet.
        </li>
      `;

  return `
    <div
      class="action-checklist"
      data-action-checklist="${recommendationId}"
    >
      <div class="action-checklist__header">
        <div>
          <h4>Action checklist</h4>
          <p>
            Break this recommendation into smaller, trackable steps.
          </p>
        </div>

        <span class="action-checklist__count">
          ${checklist.filter((item) => item.completed).length}
          of ${checklist.length} complete
        </span>
      </div>

      <ul class="action-checklist__list">
        ${itemsMarkup}
      </ul>

      <form
        class="action-checklist__add"
        data-checklist-add-form="${recommendationId}"
      >
        <input
          id="checklist-add-${recommendationId}"
          type="text"
          aria-label="Add another action step"
          placeholder="Add another action step"
          data-checklist-add-input
        />

        <button class="button button--secondary" type="submit">
          Add Action
        </button>
      </form>
    </div>
  `;
}

function renderRecommendationFilters(
  recommendations = [],
  visibleRecommendations = [],
  filters = {}
) {
  const categories = [
    ...new Set(
      recommendations.flatMap(
        (recommendation) =>
          recommendation.relatedCategories || []
      )
    )
  ].sort();

  const categoryOptions = categories
    .map(
      (category) => `
        <option
          value="${category}"
          ${filters.category === category ? "selected" : ""}
        >
          ${formatLabel(category)}
        </option>
      `
    )
    .join("");

  return `
    <div
      class="recommendation-filters"
      aria-labelledby="recommendation-filters-heading"
    >
      <div class="recommendation-filters__header">
        <div>
          <p class="eyebrow">Focus Your Plan</p>
          <h3 id="recommendation-filters-heading">
            Filter recommendations
          </h3>
          <p>
            Narrow the action plan by progress, category, priority, or
            implementation difficulty.
          </p>
        </div>

        <p
          class="recommendation-filters__count"
          id="recommendation-filter-count"
          aria-live="polite"
        >
          Showing ${visibleRecommendations.length} of
          ${recommendations.length}
        </p>
      </div>

      <div class="recommendation-filters__controls">
        <div class="recommendation-filters__field">
          <label for="recommendation-filter-status">Status</label>
          <select
            id="recommendation-filter-status"
            data-recommendation-filter="status"
          >
            <option value="all">All statuses</option>
            <option
              value="not-started"
              ${filters.status === "not-started" ? "selected" : ""}
            >
              Not started
            </option>
            <option
              value="in-progress"
              ${filters.status === "in-progress" ? "selected" : ""}
            >
              In progress
            </option>
            <option
              value="complete"
              ${filters.status === "complete" ? "selected" : ""}
            >
              Complete
            </option>
          </select>
        </div>

        <div class="recommendation-filters__field">
          <label for="recommendation-filter-category">Category</label>
          <select
            id="recommendation-filter-category"
            data-recommendation-filter="category"
          >
            <option value="all">All categories</option>
            ${categoryOptions}
          </select>
        </div>

        <div class="recommendation-filters__field">
          <label for="recommendation-filter-priority">Priority</label>
          <select
            id="recommendation-filter-priority"
            data-recommendation-filter="priority"
          >
            <option value="all">All priorities</option>
            <option
              value="immediate"
              ${filters.priority === "immediate" ? "selected" : ""}
            >
              Immediate
            </option>
            <option
              value="high"
              ${filters.priority === "high" ? "selected" : ""}
            >
              High
            </option>
            <option
              value="medium"
              ${filters.priority === "medium" ? "selected" : ""}
            >
              Medium
            </option>
            <option
              value="future"
              ${filters.priority === "future" ? "selected" : ""}
            >
              Future
            </option>
          </select>
        </div>

        <div class="recommendation-filters__field">
          <label for="recommendation-filter-difficulty">
            Difficulty
          </label>
          <select
            id="recommendation-filter-difficulty"
            data-recommendation-filter="difficulty"
          >
            <option value="all">All difficulties</option>
            <option
              value="easy"
              ${filters.difficulty === "easy" ? "selected" : ""}
            >
              Easy
            </option>
            <option
              value="moderate"
              ${filters.difficulty === "moderate" ? "selected" : ""}
            >
              Moderate
            </option>
            <option
              value="advanced"
              ${filters.difficulty === "advanced" ? "selected" : ""}
            >
              Advanced
            </option>
          </select>
        </div>

        <div class="recommendation-filters__field">
          <label for="recommendation-sort">Sort by</label>
          <select
            id="recommendation-sort"
            data-recommendation-filter="sortBy"
          >
            <option value="original">Recommended order</option>
            <option
              value="priority"
              ${filters.sortBy === "priority" ? "selected" : ""}
            >
              Highest priority
            </option>
            <option
              value="difficulty"
              ${filters.sortBy === "difficulty" ? "selected" : ""}
            >
              Easiest to implement
            </option>
          </select>
        </div>
      </div>

      <div class="recommendation-filters__actions">
        <label class="recommendation-filters__quick-win">
          <input
            type="checkbox"
            data-recommendation-quick-wins
            ${filters.quickWinsOnly ? "checked" : ""}
          />
          <span>
            <strong>Quick Wins Only</strong>
            Easy actions with immediate or high priority
          </span>
        </label>

        <button
          class="button button--secondary"
          type="button"
          id="recommendation-filters-reset"
        >
          Reset Filters
        </button>
      </div>
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
        <article
          class="recommendation-card"
          id="recommendation-${recommendation.id}"
        >
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

          <div class="recommendation-card__action-controls">
            <div class="recommendation-card__action-field">
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

            <div class="recommendation-card__action-field">
              <label for="action-target-date-${recommendation.id}">
                Target date
              </label>

              <input
                id="action-target-date-${recommendation.id}"
                type="date"
                value="${actionItem?.targetDate || ""}"
                data-action-field="targetDate"
                data-recommendation-id="${recommendation.id}"
              />
            </div>

            <div class="recommendation-card__action-field">
              <label for="action-responsible-person-${recommendation.id}">
                Responsible person
              </label>

              <input
                id="action-responsible-person-${recommendation.id}"
                type="text"
                value="${actionItem?.responsiblePerson || ""}"
                placeholder="Owner, manager, or team member"
                data-action-field="responsiblePerson"
                data-recommendation-id="${recommendation.id}"
              />
            </div>

            <div
              class="recommendation-card__action-field
                recommendation-card__action-field--notes"
            >
              <label for="action-notes-${recommendation.id}">
                Notes
              </label>

              <textarea
                id="action-notes-${recommendation.id}"
                rows="4"
                placeholder="Add context, decisions, or follow-up details"
                data-action-field="notes"
                data-recommendation-id="${recommendation.id}"
              >${actionItem?.notes || ""}</textarea>
            </div>

            ${renderActionChecklist(
              actionItem,
              recommendation.id
            )}
          </div>
        </article>
      `;
    })
    .join("");
}

export function renderReportView({
  businessProfile,
  results,
  actionPlan,
  visibleRecommendations = results?.recommendations || [],
  recommendationFilters = {}
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

        <aside
          class="action-plan-mobile-notice"
          aria-label="Phone report mode notice"
        >
          <h3>Full action-plan editing requires a larger screen</h3>
          <p>
            You can review your complete Business Dojo report and
            recommendations on this phone. Open the app on a tablet,
            laptop, or desktop to filter the plan or update progress,
            target dates, ownership, notes, and checklist steps.
          </p>
        </aside>

        ${renderRecommendationFilters(
          results?.recommendations || [],
          visibleRecommendations,
          recommendationFilters
        )}

        <div
          class="recommendation-list"
          id="recommendation-list"
        >
          ${renderRecommendations(
            visibleRecommendations,
            actionPlan
          )}
        </div>

        ${renderActionPlanSummary(actionPlan, results)}

        ${renderActionPlanIndex(
          results?.recommendations,
          actionPlan
        )}
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
