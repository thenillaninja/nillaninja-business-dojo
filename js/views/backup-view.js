export function renderBackupView({
  statusMessage = "",
  statusType = ""
} = {}) {
  return `
    <section
      class="backup-panel"
      aria-labelledby="backup-heading"
    >
      <div class="backup-panel__heading">
        <div>
          <p class="eyebrow">Protect Your Data</p>
          <h2 id="backup-heading">Backup and restore</h2>
          <p>
            Download all Business Dojo data as a JSON backup or restore a
            previously exported backup on this browser.
          </p>
        </div>
      </div>

      <div class="backup-panel__grid">
        <article class="backup-card">
          <h3>Download a backup</h3>
          <p>
            Export the current application state, saved snapshots, action
            plans, notes, dates, ownership, and checklists.
          </p>

          <button
            class="button button--primary"
            type="button"
            id="backup-download"
          >
            Download Backup
          </button>
        </article>

        <article class="backup-card backup-card--restore">
          <h3>Restore from a backup</h3>
          <p>
            Choose a Business Dojo JSON backup file. The file will be
            validated before any saved data is replaced.
          </p>

          <label class="backup-file-field" for="backup-file">
            <span>Backup file</span>
            <input
              id="backup-file"
              type="file"
              accept="application/json,.json"
            />
          </label>

          <div class="backup-warning">
            <strong>Important:</strong>
            Restoring a backup replaces the current application state,
            saved snapshots, and action plans stored in this browser.
          </div>

          <button
            class="button button--secondary"
            type="button"
            id="backup-restore"
          >
            Restore Backup
          </button>
        </article>
      </div>

      <p
        class="backup-panel__status ${
          statusType
            ? `backup-panel__status--${statusType}`
            : ""
        }"
        id="backup-status"
        role="status"
        aria-live="polite"
      >
        ${statusMessage}
      </p>
    </section>
  `;
}
