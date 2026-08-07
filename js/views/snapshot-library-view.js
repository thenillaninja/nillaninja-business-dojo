function formatSnapshotDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function renderSnapshotCards(
  snapshots = [],
  mostRecentSnapshotId = "",
  selectedSnapshotIds = []
) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) {
    return `
      <div class="snapshot-library__empty">
        <h2>No saved snapshots yet</h2>
        <p>
          Complete a Business Snapshot assessment and its report will appear
          here for future review.
        </p>
      </div>
    `;
  }

  return snapshots
    .map((snapshot) => {
      const isMostRecent = snapshot.id === mostRecentSnapshotId;
      const businessName =
        snapshot.business?.name ||
        snapshot.businessProfile?.businessName ||
        "Unnamed Business";
      const score = Number.isFinite(snapshot.results?.overallScore)
        ? snapshot.results.overallScore
        : 0;

      const isSelected = selectedSnapshotIds.includes(snapshot.id);

      return `
        <article
          class="snapshot-card ${isSelected ? "snapshot-card--selected" : ""}"
        >
          <div class="snapshot-card__header">
            <div>
              <p class="snapshot-card__date">
                ${formatSnapshotDate(snapshot.completedAt || snapshot.createdAt)}
              </p>
              <h2>${businessName}</h2>
            </div>

            ${
              isMostRecent
                ? '<span class="snapshot-card__badge">Most recent</span>'
                : ""
            }
          </div>

          <p class="snapshot-card__score">
            Overall score: <strong>${score}/100</strong>
          </p>

          <div class="snapshot-card__selection">
            <label>
              <input
                type="checkbox"
                value="${snapshot.id}"
                data-snapshot-compare-select
                ${isSelected ? "checked" : ""}
              />
              <span>Select for comparison</span>
            </label>
          </div>

          <div class="snapshot-card__actions">
            <button
              class="button button--primary"
              type="button"
              data-snapshot-open="${snapshot.id}"
            >
              Open Report
            </button>

            <button
              class="button button--secondary"
              type="button"
              data-snapshot-edit="${snapshot.id}"
            >
              Edit Business Details
            </button>

            <button
              class="button button--secondary"
              type="button"
              data-snapshot-delete="${snapshot.id}"
            >
              Delete
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}


function formatReassessmentDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function renderReassessmentReminder({
  plan = null,
  status = null
} = {}) {
  if (!plan || !status || status.status === "unavailable") {
    return "";
  }

  const scheduledDate = formatReassessmentDate(
    plan.scheduledFor
  );

  const content = {
    scheduled: {
      eyebrow: "Reassessment Planned",
      heading: "Keep working your current action plan",
      message: `Your next Business Snapshot is planned for ${scheduledDate}.`
    },
    approaching: {
      eyebrow: "Reassessment Coming Up",
      heading: "Your next Business Snapshot is approaching",
      message: `You planned to reassess in ${status.daysUntil} day${
        status.daysUntil === 1 ? "" : "s"
      }, on ${scheduledDate}.`
    },
    due: {
      eyebrow: "Reassessment Due",
      heading: "It’s time for your next Business Snapshot",
      message: `Your ${plan.intervalDays}-day reassessment is due today.`
    },
    overdue: {
      eyebrow: "Reassessment Due",
      heading: "Your planned reassessment date has passed",
      message: `Your reassessment was planned for ${scheduledDate}, ${
        status.daysOverdue
      } day${status.daysOverdue === 1 ? "" : "s"} ago.`
    }
  };

  const copy = content[status.status];

  if (!copy) {
    return "";
  }

  const showNewSnapshot =
    status.status === "due" ||
    status.status === "overdue";

  return `
    <section
      class="snapshot-reassessment snapshot-reassessment--${status.status}"
      aria-labelledby="snapshot-reassessment-heading"
    >
      <div>
        <p class="eyebrow">${copy.eyebrow}</p>
        <h2 id="snapshot-reassessment-heading">
          ${copy.heading}
        </h2>
        <p>${copy.message}</p>
      </div>

      <div class="snapshot-reassessment__actions">
        ${
          showNewSnapshot
            ? `
              <button
                class="button button--primary"
                type="button"
                id="snapshot-reassessment-new"
              >
                Run New Snapshot
              </button>
            `
            : ""
        }

        <button
          class="button ${
            showNewSnapshot
              ? "button--secondary"
              : "button--primary"
          }"
          type="button"
          id="snapshot-reassessment-continue"
          data-snapshot-id="${plan.sourceSnapshotId}"
        >
          Continue Action Plan
        </button>

        ${
          showNewSnapshot
            ? `
              <button
                class="button button--secondary"
                type="button"
                id="snapshot-reassessment-not-yet"
              >
                Not Yet
              </button>
            `
            : ""
        }
      </div>
    </section>
  `;
}

export function renderSnapshotLibraryView({
  snapshots = [],
  mostRecentSnapshotId = "",
  selectedSnapshotIds = [],
  comparisonMessage = "",
  backupMarkup = "",
  reassessmentPlan = null,
  reassessmentStatus = null
} = {}) {
  return `
    <section
      class="snapshot-library"
      aria-labelledby="snapshot-library-heading"
    >
      <p class="eyebrow">Saved Business Snapshots</p>

      <div class="snapshot-library__heading">
        <div>
          <h1 id="snapshot-library-heading">Snapshot Library</h1>
          <p>
            Reopen completed reports, review past results, or begin a new
            assessment.
          </p>
        </div>

        <button
          class="button button--primary"
          type="button"
          id="snapshot-library-new"
        >
          New Assessment
        </button>
      </div>

      ${renderReassessmentReminder({
        plan: reassessmentPlan,
        status: reassessmentStatus
      })}

      ${
        snapshots.length >= 2
          ? `
            <div class="snapshot-comparison-picker">
              <div>
                <h2>Compare saved snapshots</h2>
                <p>
                  Select two snapshots for the same business to review score,
                  strength, and recommendation changes.
                </p>
              </div>

              <div class="snapshot-comparison-picker__actions">
                <span
                  id="snapshot-comparison-selection-count"
                  aria-live="polite"
                >
                  ${selectedSnapshotIds.length} of 2 selected
                </span>

                <button
                  class="button button--primary"
                  type="button"
                  id="snapshot-comparison-open"
                  ${selectedSnapshotIds.length === 2 ? "" : "disabled"}
                >
                  Compare Snapshots
                </button>
              </div>

              <p
                class="snapshot-comparison-picker__message"
                id="snapshot-comparison-message"
                role="status"
                aria-live="polite"
              >
                ${comparisonMessage}
              </p>
            </div>
          `
          : ""
      }

      <div class="snapshot-library__list">
        ${renderSnapshotCards(
          snapshots,
          mostRecentSnapshotId,
          selectedSnapshotIds
        )}
      </div>

      ${backupMarkup}

      <div class="form-actions">
        <button
          class="button button--secondary"
          type="button"
          id="snapshot-library-back"
        >
          Back to Welcome
        </button>
      </div>
    </section>
  `;
}
