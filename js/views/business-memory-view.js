function formatLabel(value = "") {
  return String(value)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function hasMeaningfulMemory(record) {
  return Boolean(
    record?.change?.summary ||
      record?.outcome?.summary ||
      record?.ownerNotes ||
      record?.adoption?.operationalType !== "none" ||
      record?.recurringWork?.isRecurring ||
      (
        record?.automation?.readiness &&
        record.automation.readiness !== "not-reviewed"
      )
  );
}

function renderMemoryItem(record) {
  const changeSummary =
    record?.change?.summary || "No improvement summary recorded.";

  const outcomeSummary =
    record?.outcome?.summary || "";

  const ownerNotes =
    record?.ownerNotes || "";

  return `
    <article class="business-memory-card">
      <div class="business-memory-card__header">
        <div>
          <p class="eyebrow">Improvement memory</p>
          <h3>${changeSummary}</h3>
        </div>

        <span class="business-memory-card__status">
          ${formatLabel(record?.outcome?.status || "not-evaluated")}
        </span>
      </div>

      ${
        outcomeSummary
          ? `
            <div class="business-memory-card__section">
              <h4>What happened</h4>
              <p>${outcomeSummary}</p>
            </div>
          `
          : ""
      }

      ${
        record?.adoption?.operationalType &&
        record.adoption.operationalType !== "none"
          ? `
            <div class="business-memory-card__section">
              <h4>What this became</h4>
              <p>
                ${formatLabel(record.adoption.operationalType)}
                · ${formatLabel(record.adoption.status || "tested")}
              </p>
            </div>
          `
          : ""
      }

      ${
        record?.recurringWork?.isRecurring
          ? `
            <div class="business-memory-card__section">
              <h4>Recurring work</h4>
              <p>
                ${
                  record.recurringWork.frequency ||
                  "Frequency not recorded"
                }
              </p>

              ${
                record.recurringWork.trigger
                  ? `<p><strong>Trigger:</strong> ${record.recurringWork.trigger}</p>`
                  : ""
              }

              ${
                record.recurringWork.responsiblePerson
                  ? `<p><strong>Responsible:</strong> ${record.recurringWork.responsiblePerson}</p>`
                  : ""
              }

              ${
                record.recurringWork.expectedResult
                  ? `<p><strong>Expected result:</strong> ${record.recurringWork.expectedResult}</p>`
                  : ""
              }
            </div>
          `
          : ""
      }

      ${
        ownerNotes
          ? `
            <div class="business-memory-card__section">
              <h4>Lessons learned</h4>
              <p>${ownerNotes}</p>
            </div>
          `
          : ""
      }

      ${
        record?.automation?.readiness &&
        record.automation.readiness !== "not-reviewed"
          ? `
            <div class="business-memory-card__section">
              <h4>Future automation review</h4>
              <p>
                ${formatLabel(record.automation.readiness)}
              </p>

              ${
                record.automation.notes
                  ? `<p>${record.automation.notes}</p>`
                  : ""
              }
            </div>
          `
          : ""
      }
      ${
        record?.sourceRecommendationTitle
          ? `
            <div class="business-memory-card__source">
              <span>
                Source recommendation:
                ${record.sourceRecommendationTitle}
              </span>
            </div>
          `
          : ""
      }
    </article>
  `;
}

export function renderBusinessMemoryView({
  records = []
} = {}) {
  const meaningfulRecords = records.filter(
    hasMeaningfulMemory
  );

  return `
    <div class="business-memory-view">
      <header class="business-memory-view__header">
        <p class="eyebrow">Business Memory</p>

        <h1>What Business Dojo remembers about your business</h1>

        <p class="business-memory-view__intro">
          Business Memory brings together the improvements you made,
          what worked, the practices you adopted, recurring work you
          identified, lessons learned, and processes worth reviewing
          in the future.
        </p>

        <div class="business-memory-view__actions">
          <button
            class="button button--secondary"
            type="button"
            id="business-memory-back"
          >
            Back to Home
          </button>

          <button
            class="button button--secondary"
            type="button"
            id="business-memory-snapshots"
          >
            View Snapshot Library
          </button>
        </div>

    <div class="business-memory-view__export-actions">
      <button
        class="button button--secondary"
        type="button"
        id="business-memory-copy"
      >
        Copy Business Memory
      </button>

      <button
        class="button button--secondary"
        type="button"
        id="business-memory-download"
      >
        Download Business Memory
      </button>

      <button
        class="button button--secondary"
        type="button"
        id="business-memory-print"
      >
        Print Business Memory
      </button>
    </div>

    <p
      class="business-memory-view__export-status"
      id="business-memory-export-status"
      aria-live="polite"
    ></p>
      </header>

      ${
        meaningfulRecords.length === 0
          ? `
            <section
              class="business-memory-empty"
              aria-labelledby="business-memory-empty-heading"
            >
              <h2 id="business-memory-empty-heading">
                Business Memory is ready to learn
              </h2>

              <p>
                As you record improvement outcomes, recurring work,
                lessons learned, and future automation considerations,
                Business Dojo will collect that knowledge here.
              </p>
            </section>
          `
          : `
            <section
              class="business-memory-list"
              aria-labelledby="business-memory-list-heading"
            >
              <div class="business-memory-list__heading">
                <h2 id="business-memory-list-heading">
                  Learned business knowledge
                </h2>

                <p>
                  ${meaningfulRecords.length}
                  ${
                    meaningfulRecords.length === 1
                      ? "memory"
                      : "memories"
                  }
                  recorded
                </p>
              </div>

              <div class="business-memory-list__items">
                ${meaningfulRecords
                  .map(renderMemoryItem)
                  .join("")}
              </div>
            </section>
          `
      }
    </div>
  `;
}
