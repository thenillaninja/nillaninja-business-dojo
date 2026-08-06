# NillaNinja Business Dojo — Version 0.2 Roadmap

## Version Theme

**From Business Snapshot to Business Improvement System**

Version 0.1 helps a business owner understand where the business currently stands.

Version 0.2 will help the owner turn recommendations into an actionable improvement plan, retain multiple assessments, and measure progress over time.

The application will continue using browser storage for Version 0.2. Accounts, cloud storage, subscriptions, and a production backend remain deferred until a later version.

---

## Primary Product Goal

Transform NillaNinja Business Dojo from a one-time assessment and report into a reusable, single-user SaaS prototype that business owners can return to as they improve their operations.

---

## Phase 1 — Snapshot Library — Complete

Allow users to retain multiple completed Business Snapshots rather than replacing the previous report.

Each saved snapshot should include:

- Unique snapshot ID
- Business name
- Assessment completion date
- Business profile
- Assessment answers
- Overall score
- Category scores
- Strengths
- Recommendations
- Business priority at the time of assessment

The Snapshot Library should allow users to:

- View saved snapshots
- Reopen a completed report
- Identify the most recent snapshot
- Start a new assessment
- Delete a snapshot with confirmation
- Handle an empty library clearly

---

## Phase 2 — Interactive Action Plan — Complete

Turn recommendations into trackable action items.

Each action item may include:

- Status:
  - Not started
  - In progress
  - Complete
- Target date
- Responsible person
- User notes
- First-action checklist
- Completion date

Action-plan updates should persist in browser storage without changing the original assessment answers or scores.

Completed functionality:

- Created a separate action-plan data model and browser-storage collection.
- Created one action plan for each completed snapshot.
- Added persistent Not started, In progress, and Complete statuses.
- Added automatic started and completed timestamps.
- Added target dates.
- Added responsible-person ownership.
- Added persistent notes.
- Added a progress percentage, progress bar, and status counts.
- Added a clickable Action Plan Index for returning users.
- Added direct navigation to individual recommendations.
- Added editable action checklists.
- Added checklist item creation, editing, completion, reopening, and deletion.
- Added live interface updates without full-page rerendering or scroll jumps.
- Preserved the original assessment snapshot as an immutable record.
- Added permanent automated tests for action-plan creation, storage, updates, and checklist behavior.

---

## Phase 3 — Quick Wins and Recommendation Filters — Complete

Help owners decide what to work on first.

Recommended filters and sorting controls:

- Status
- Business category
- Expected impact
- Implementation difficulty
- Highest priority
- Easiest to implement

Add a **Quick Wins** view for recommendations that combine meaningful impact with lower implementation difficulty.

Completed functionality:

- Added filtering by action-item status.
- Added filtering by business category.
- Added filtering by recommendation priority.
- Added filtering by implementation difficulty.
- Added sorting by highest priority.
- Added sorting by easiest implementation.
- Added a Quick Wins view for easy recommendations with Immediate or High priority.
- Added combined filtering and sorting.
- Added a live visible-recommendation count.
- Added Reset Filters behavior.
- Preserved report scroll position while changing filters.
- Kept filter state separate from saved snapshots and action-plan records.
- Added responsive desktop, tablet, and mobile filter layouts.
- Added permanent automated tests for Quick Wins, filtering, sorting, and combined behavior.
- Confirmed the complete assessment and action-plan regression suite still passes.

---

## Phase 4 — Progress Comparison — Complete

Allow users to compare two completed snapshots for the same business.

The comparison should show:

- Overall score change
- Category score changes
- Newly developed strengths
- Areas that improved
- Areas that declined
- Areas that remained unchanged
- Recommendations completed since the earlier snapshot
- Current unresolved priorities

The comparison should explain changes in plain English and avoid presenting normal score variation as guaranteed business improvement.

Completed functionality:

- Added compatibility validation for snapshots from the same business and assessment version.
- Added automatic chronological ordering of earlier and later snapshots.
- Added overall score comparison.
- Added category-by-category score changes.
- Added improved, declined, unchanged, and unavailable category states.
- Added newly developed, continuing, and no-longer-listed strength comparisons.
- Added resolved, continuing, and newly triggered recommendation comparisons.
- Added plain-English overall change summaries.
- Added interpretation guidance that avoids presenting score changes as guaranteed business outcomes.
- Added two-snapshot selection controls in the Snapshot Library.
- Added selected-card highlighting and comparison validation messages.
- Added a responsive Progress Comparison report.
- Added direct editing of saved business details.
- Added profile corrections without duplicating or changing historical assessment results.
- Added permanent automated tests for compatibility, ordering, scores, strengths, and recommendations.
- Confirmed the complete assessment, action-plan, filtering, and snapshot regression suite still passes.

---

## Phase 5 — Backup and Restore

Protect locally stored Business Dojo data and make it portable.

Users should be able to:

- Export all application data as JSON
- Import a valid Business Dojo backup
- Transfer data to another browser or computer
- Restore data after clearing browser storage
- Review a warning before imported data replaces existing data
- Receive clear validation messages for invalid backup files

The exported format should include a schema version so future releases can migrate older backups safely.

---

## Version 0.2 Storage Direction

Version 0.2 will continue to use local browser storage.

The data model should be designed so the storage implementation can later be replaced by a backend without rebuilding the product interface or business logic.

Separate concerns where practical:

- Application state
- Snapshot records
- Action-plan records
- Storage operations
- Report generation
- Comparison logic
- Import/export validation

---

## Version 0.2 Definition of Done

Version 0.2 is complete when:

- A user can save more than one completed assessment.
- Saved snapshots remain available after refreshing or closing the browser.
- A user can reopen a previous report.
- A user can delete a saved snapshot safely.
- Recommendations can be tracked as action items.
- Action-item status, dates, ownership, and notes persist.
- Recommendations can be filtered and sorted.
- Quick Wins are clearly identified.
- Two compatible snapshots can be compared.
- Score and category changes are explained clearly.
- All Business Dojo data can be exported as JSON.
- A valid backup can be restored.
- Invalid imports fail safely without damaging existing data.
- Existing Version 0.1 assessment and report functionality continues to work.
- The application remains accessible and usable on desktop and mobile.
- The application still works without a backend, account, framework, npm, or external API.

---

## Deferred Until After Version 0.2

- User accounts and authentication
- Cloud database storage
- Multiple users or team collaboration
- Email notifications
- Subscription billing
- Administrative dashboards
- Organization-level accounts
- Server-generated reports
- Cross-device automatic synchronization
- AI-generated recommendations
- Third-party business integrations

---

## Longer-Term Product Direction

### Version 0.1

Understand where the business stands.

### Version 0.2

Build an improvement plan and track progress.

### Version 0.3

Introduce accounts, cloud persistence, multiple businesses, collaboration, and production SaaS infrastructure.
