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


function renderImplementationProgress(comparison) {
  const progress = comparison.implementationProgress;

  if (!progress?.isAvailable) {
    return `
      <section
        class="comparison-section"
        aria-labelledby="comparison-implementation-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Implementation Progress</p>
          <h2 id="comparison-implementation-heading">
            Action-plan movement
          </h2>
        </div>

        <div class="comparison-empty-state">
          <p>
            ${progress?.reason ||
              "Implementation progress is unavailable for these snapshots."}
          </p>
        </div>
      </section>
    `;
  }

  return `
    <section
      class="comparison-section"
      aria-labelledby="comparison-implementation-heading"
    >
      <div class="comparison-section__heading">
        <p class="eyebrow">Implementation Progress</p>
        <h2 id="comparison-implementation-heading">
          Action-plan movement
        </h2>
        <p class="comparison-section__description">
          These measures reflect progress recorded in the saved action plans.
          They are separate from assessment score movement.
        </p>
      </div>

      <div class="comparison-progress-grid">
        <article class="comparison-progress-card">
          <p>Earlier completion</p>
          <h3>${progress.earlier.completionPercentage}%</h3>
          <span>
            ${progress.earlier.statusTotals.complete}
            of ${progress.earlier.totalItems} complete
          </span>
        </article>

        <article class="comparison-progress-card">
          <p>Later completion</p>
          <h3>${progress.later.completionPercentage}%</h3>
          <span>
            ${progress.later.statusTotals.complete}
            of ${progress.later.totalItems} complete
          </span>
        </article>

        <article class="comparison-progress-card comparison-progress-card--change">
          <p>Completion movement</p>
          <h3>
            ${formatChange(progress.completionPercentageChange)}%
          </h3>
          <span>percentage points</span>
        </article>

        <article class="comparison-progress-card">
          <p>Checklist progress</p>
          <h3>
            ${progress.earlier.checklist.completionPercentage}%
            <span aria-hidden="true">→</span>
            ${progress.later.checklist.completionPercentage}%
          </h3>
          <span>
            ${formatChange(
              progress.checklistCompletionPercentageChange
            )}% movement
          </span>
        </article>

        <article class="comparison-progress-card">
          <p>Completed items</p>
          <h3>
            ${progress.earlier.statusTotals.complete}
            <span aria-hidden="true">→</span>
            ${progress.later.statusTotals.complete}
          </h3>
          <span>
            ${formatChange(progress.completedItemsChange)} change
          </span>
        </article>

        <article class="comparison-progress-card">
          <p>In progress</p>
          <h3>
            ${progress.earlier.statusTotals.inProgress}
            <span aria-hidden="true">→</span>
            ${progress.later.statusTotals.inProgress}
          </h3>
          <span>
            ${formatChange(progress.inProgressItemsChange)} change
          </span>
        </article>
      </div>
    </section>
  `;
}


function renderOperationalLearning(comparison) {
  const learning = comparison.operationalLearning;

  if (!learning?.isAvailable) {
    return `
      <section
        class="comparison-section"
        aria-labelledby="comparison-operational-learning-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Operational Learning</p>
          <h2 id="comparison-operational-learning-heading">
            What became part of the business
          </h2>
        </div>

        <div class="comparison-empty-state">
          <p>
            No Business Memory records are currently linked to these
            snapshots.
          </p>
        </div>
      </section>
    `;
  }

  const earlier = learning.earlier;
  const later = learning.later;

  return `
    <section
      class="comparison-section"
      aria-labelledby="comparison-operational-learning-heading"
    >
      <div class="comparison-section__heading">
        <p class="eyebrow">Operational Learning</p>
        <h2 id="comparison-operational-learning-heading">
          What became part of the business
        </h2>

        <p>
          Business Memory shows what was learned, adopted, or turned
          into an ongoing way of working. These are the current learned
          outcomes linked back to each snapshot; the historical snapshots
          themselves remain unchanged.
        </p>
      </div>

      <div class="comparison-progress-grid">
        <article class="comparison-progress-card">
          <span class="eyebrow">
            Positive outcomes
          </span>
          <strong >
            ${earlier.positiveOutcomeCount}
            →
            ${later.positiveOutcomeCount}
          </strong>
        </article>

        <article class="comparison-progress-card">
          <span class="eyebrow">
            Adopted improvements
          </span>
          <strong >
            ${earlier.adoptedImprovementCount}
            →
            ${later.adoptedImprovementCount}
          </strong>
        </article>

        <article class="comparison-progress-card">
          <span class="eyebrow">
            Practices now in place
          </span>
          <strong >
            ${earlier.operationalPracticeCount}
            →
            ${later.operationalPracticeCount}
          </strong>
        </article>

        <article class="comparison-progress-card">
          <span class="eyebrow">
            Recurring work identified
          </span>
          <strong >
            ${earlier.recurringWorkCount}
            →
            ${later.recurringWorkCount}
          </strong>
        </article>

        <article class="comparison-progress-card">
          <span class="eyebrow">
            Needs revision
          </span>
          <strong >
            ${earlier.adoption.needsRevision}
            →
            ${later.adoption.needsRevision}
          </strong>
        </article>

        <article class="comparison-progress-card">
          <span class="eyebrow">
            Future automation candidates
          </span>
          <strong >
            ${earlier.automationCandidateCount}
            →
            ${later.automationCandidateCount}
          </strong>
        </article>
      </div>

      <p class="comparison-section__description">
        ${learning.linkedRecordCount}
        Business Memory
        ${learning.linkedRecordCount === 1 ? "record is" : "records are"}
        linked to this comparison.
      </p>
    </section>
  `;
}


function renderSignificantImprovements(comparison) {
  const improvements =
    comparison.significantImprovements || {};

  const assessment = Array.isArray(improvements.assessment)
    ? improvements.assessment
    : [];

  const implementation =
    Array.isArray(improvements.implementation)
      ? improvements.implementation
      : [];

  const operationalLearning =
    Array.isArray(improvements.operationalLearning)
      ? improvements.operationalLearning
      : [];

  const categoryImprovements = assessment.filter(
    (item) => item.type === "category-score"
  );

  const newStrengths = assessment.filter(
    (item) => item.type === "new-strength"
  );

  const resolvedRecommendations = assessment.filter(
    (item) => item.type === "resolved-recommendation"
  );

  if (
    assessment.length === 0 &&
    implementation.length === 0 &&
    operationalLearning.length === 0
  ) {
    return `
      <section
        class="comparison-section comparison-improvements"
        aria-labelledby="comparison-improvements-heading"
      >
        <div class="comparison-section__heading">
          <p class="eyebrow">Business Progress</p>
          <h2 id="comparison-improvements-heading">
            Significant improvements
          </h2>
        </div>

        <div class="comparison-empty-state">
          <p>
            No major improvements crossed the current comparison
            thresholds between these snapshots.
          </p>
        </div>
      </section>
    `;
  }

  const assessmentSummary = [
    ...categoryImprovements.map(
      (item) => `
        <li>
          <strong>${formatLabel(item.categoryId)}</strong>
          improved by ${item.change} points
          (${item.earlierScore} → ${item.laterScore}).
        </li>
      `
    ),
    newStrengths.length > 0
      ? `
        <li>
          <strong>${newStrengths.length}</strong>
          new ${newStrengths.length === 1 ? "strength" : "strengths"}
          appeared in the later assessment.
        </li>
      `
      : "",
    resolvedRecommendations.length > 0
      ? `
        <li>
          <strong>${resolvedRecommendations.length}</strong>
          earlier
          ${
            resolvedRecommendations.length === 1
              ? "recommendation is"
              : "recommendations are"
          }
          no longer triggered.
        </li>
      `
      : ""
  ]
    .filter(Boolean)
    .join("");

  const implementationSummary = implementation
    .map((item) => {
      if (item.type === "action-plan-completion") {
        return `
          <li>
            Action-plan completion increased by
            <strong>${item.change} percentage points</strong>.
          </li>
        `;
      }

      if (item.type === "checklist-completion") {
        return `
          <li>
            Checklist completion increased by
            <strong>${item.change} percentage points</strong>.
          </li>
        `;
      }

      return "";
    })
    .filter(Boolean)
    .join("");

  const operationalLearningSummary =
    operationalLearning
      .map((item) => {
        const summary =
          item.changeSummary ||
          "An improvement was recorded in Business Memory.";

        const details = [];

        if (item.outcomeStatus === "helped") {
          details.push("helped");
        }

        if (item.adoptionStatus === "adopted") {
          details.push("adopted");
        }

        if (
          item.operationalType &&
          item.operationalType !== "none"
        ) {
          details.push(formatLabel(item.operationalType));
        }

        if (item.isRecurring) {
          details.push("recurring work");
        }

        return `
          <li>
            <strong>${summary}</strong>
            ${
              details.length > 0
                ? ` — ${details.join(", ")}.`
                : ""
            }
          </li>
        `;
      })
      .join("");

  return `
    <section
      class="comparison-section comparison-improvements"
      aria-labelledby="comparison-improvements-heading"
    >
      <div class="comparison-section__heading">
        <p class="eyebrow">Business Progress</p>

        <h2 id="comparison-improvements-heading">
          Significant improvements
        </h2>

        <p>
          This summary separates improvements reflected in the assessment,
          progress recorded while implementing the action plan, and changes
          that became meaningful operational learning.
        </p>
      </div>

      <div class="comparison-improvement-grid">
        <article class="comparison-improvement-card">
          <p class="eyebrow">Assessment Improvement</p>
          <h3>What changed in the business snapshot</h3>

          ${
            assessmentSummary
              ? `
                <ul class="comparison-improvement-list">
                  ${assessmentSummary}
                </ul>
              `
              : `
                <p class="comparison-list__empty">
                  No major assessment improvements were identified.
                </p>
              `
          }
        </article>

        <article class="comparison-improvement-card">
          <p class="eyebrow">Implementation Progress</p>
          <h3>What moved forward in the action plan</h3>

          ${
            implementationSummary
              ? `
                <ul class="comparison-improvement-list">
                  ${implementationSummary}
                </ul>
              `
              : `
                <p class="comparison-list__empty">
                  No significant action-plan implementation movement
                  was recorded between these saved plans.
                </p>
              `
          }
        </article>

        <article class="comparison-improvement-card">
          <p class="eyebrow">Operational Learning</p>
          <h3>What became meaningful in normal operations</h3>

          ${
            operationalLearningSummary
              ? `
                <ul class="comparison-improvement-list">
                  ${operationalLearningSummary}
                </ul>
              `
              : `
                <p class="comparison-list__empty">
                  No significant operational learning is currently linked
                  to the later snapshot.
                </p>
              `
          }
        </article>
      </div>
    </section>
  `;
}


function formatReassessmentDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function renderMomentumPanel(comparison, reassessmentPlan = null) {
  const latestSnapshot = comparison.laterSnapshot;

  if (!latestSnapshot?.id) {
    return "";
  }

  const selectedInterval = reassessmentPlan?.intervalDays || "";

const reassessmentLessons =
  comparison.operationalLearning?.later?.learnedItems || [];

const relevantLessons = reassessmentLessons.filter(
  (item) =>
    item.outcomeStatus === "helped" ||
    item.outcomeStatus === "mixed" ||
    item.outcomeStatus === "did-not-help" ||
    item.adoptionStatus === "adopted" ||
    item.adoptionStatus === "needs-revision" ||
    (
      item.operationalType &&
      item.operationalType !== "none"
    ) ||
    item.isRecurring === true
);

const lessonMarkup = relevantLessons
  .map((item) => {
    const summary =
      item.changeSummary ||
      "A previous improvement was recorded in Business Memory.";

    const notes = item.ownerNotes
      ? `<span>${item.ownerNotes}</span>`
      : "";

    return `
      <li>
        <strong>${summary}</strong>
        ${notes}
      </li>
    `;
  })
  .join("");

  return `
    <section
      class="comparison-section comparison-momentum"
      aria-labelledby="comparison-momentum-heading"
    >
      <div class="comparison-section__heading">
        <p class="eyebrow">Keep the Momentum Going</p>
        <h2 id="comparison-momentum-heading">
          Make this snapshot your new benchmark
        </h2>
        <p class="comparison-section__description">
          Continue working the current action plan, then reassess after
          enough time has passed to see whether those changes are showing
          up in the business.
        </p>
      </div>

      <div class="comparison-momentum__actions">
        <button
          class="button button--primary"
          type="button"
          id="comparison-continue-action-plan"
          data-snapshot-id="${latestSnapshot.id}"
        >
          Continue Your Action Plan
        </button>

        <button
          class="button button--secondary"
          type="button"
          id="comparison-view-latest-snapshot"
          data-snapshot-id="${latestSnapshot.id}"
        >
          View Latest Snapshot
        </button>
      </div>

      <div class="comparison-momentum__reassessment">
        <h3>Plan your next reassessment</h3>
        <p>
          Choose a simple 30, 60, or 90 day check-in. This is guidance,
          not a requirement, and the reminder stays in this browser.
        </p>

        ${
      lessonMarkup
        ? `
          <div class="comparison-momentum__lessons">
            <p class="eyebrow">Business Memory Reminder</p>
            <h4>Remember what you learned</h4>
            <p>
              Review these learned outcomes when you reassess so you can
              decide whether the changes are still helping, need revision,
              or have become part of normal operations.
            </p>

            <ul class="comparison-improvement-list">
              ${lessonMarkup}
            </ul>
          </div>
        `
        : ""
    }

    <div class="comparison-momentum__intervals">
          ${[30, 60, 90]
            .map(
              (days) => `
                <button
                  class="button ${
                    Number(selectedInterval) === days
                      ? "button--primary"
                      : "button--secondary"
                  }"
                  type="button"
                  data-reassessment-interval="${days}"
                  data-snapshot-id="${latestSnapshot.id}"
                >
                  ${days} Days
                </button>
              `
            )
            .join("")}
        </div>

        ${
          reassessmentPlan
            ? `
              <p class="comparison-momentum__status">
                Next reassessment planned for
                <strong>${formatReassessmentDate(
                  reassessmentPlan.scheduledFor
                )}</strong>.
              </p>
            `
            : ""
        }
      </div>
    </section>
  `;
}

export function renderSnapshotComparisonView(
  comparison,
  reassessmentPlan = null
) {
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
            Compare two completed Business Snapshots and review both
            assessment changes and action-plan implementation progress.
          </p>
        </div>

        <button
          class="button button--primary"
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
        <p class="eyebrow">Assessment Progress</p>
        <h2>What changed in the assessment</h2>
        <p>${renderOverallSummary(comparison)}</p>
      </div>

      ${renderImplementationProgress(comparison)}

      ${renderOperationalLearning(comparison)}

      ${renderSignificantImprovements(comparison)}

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

      ${renderMomentumPanel(comparison, reassessmentPlan)}

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
