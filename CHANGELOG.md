# Changelog

## Unreleased


## Version 0.3 — August 7, 2026

### Added
- Added progress tracking for action plans, including completion percentage, checklist progress, overdue items, upcoming dates, and recently completed work.
- Added Next Best Actions to surface the highest-value unfinished recommendations.
- Added snapshot comparison for overall scores, category scores, strengths, recommendations, and implementation progress.
- Added Significant Business Improvements summaries to distinguish assessment improvement from action-plan implementation progress.
- Added collapsible completed-snapshot navigation for easier report reading.
- Added reassessment planning with 30, 60, and 90 day intervals.
- Added scheduled, approaching, due, and overdue reassessment status handling.
- Added Snapshot Library reassessment reminders and return actions.
- Added lightweight Progress History showing chronological snapshot scores and overall movement.

### Improved
- Improved report print behavior and removed the skip-link from printed output.
- Refined Snapshot Library action alignment.
- Added Snapshot Library navigation to the report footer.
- Made Print Report the primary export action.
- Updated visible product labeling and current app metadata to Version 0.3.
- Preserved Version 0.2 storage and legacy snapshot compatibility.

### Validation
- Confirmed the complete regression suite passes after Version 0.3 development.
- Verified the Version 0.3 workflow in Safari and Chrome, including report printing and Snapshot Library behavior.

### Changed
- Added a phone report-only experience that keeps assessment results, recommendations, and export tools available while hiding action-plan editing controls on phone-sized screens.
- Preserved the full interactive action-plan experience on tablets, laptops, desktops, and narrow desktop windows.
- Validated the responsive behavior locally with ResponsivelyApp and reran the complete automated regression suite successfully.

## Version 0.2 — August 6, 2026

### Snapshot Library

- Added a Version 0.2 snapshot data model.
- Added immutable snapshot record creation.
- Added separate browser storage for completed snapshots.
- Added unique snapshot IDs and duplicate-save protection.
- Added a Snapshot Library interface.
- Added saved-report reopening.
- Added most-recent snapshot identification.
- Added snapshot deletion with confirmation.
- Added a clear empty-library state.
- Added New Assessment behavior that preserves saved snapshots.
- Updated visible interface language for Version 0.2.
- Confirmed existing scoring, strengths, and recommendation tests still pass.


### Interactive Action Plan

- Added a separate Version 0.2 action-plan data model.
- Added one persistent action plan for each saved snapshot.
- Added Not started, In progress, and Complete status tracking.
- Added automatic start and completion timestamps.
- Added target dates and responsible-person ownership.
- Added persistent notes for each recommendation.
- Added action-plan progress percentage, progress bar, and status counts.
- Added a Continue Action Plan shortcut for returning users.
- Added a clickable Action Plan Index with direct links to each recommendation.
- Added live progress updates without full-page rerendering or scroll movement.
- Added editable action checklists for each recommendation.
- Added checklist item creation, editing, completion, reopening, and deletion.
- Added checklist completion counts.
- Added polished checklist cards that match the Business Dojo interface.
- Preserved completed snapshots as immutable records.
- Added automated tests for action-plan creation, storage, status transitions, editable fields, checklist operations, deletion, and immutability.
- Confirmed the full assessment regression suite still passes.


### Quick Wins and Recommendation Filters

- Added recommendation filtering by action-plan status.
- Added recommendation filtering by business category.
- Added recommendation filtering by priority.
- Added recommendation filtering by implementation difficulty.
- Added sorting by highest priority.
- Added sorting by easiest implementation.
- Added a Quick Wins view for easy recommendations with Immediate or High priority.
- Added combined filtering and sorting.
- Added a live visible-recommendation count.
- Added Reset Filters behavior.
- Preserved report scroll position while filters change.
- Kept filter state temporary and separate from saved snapshot data.
- Added responsive filter controls for desktop, tablet, and mobile.
- Prevented duplicate checklist event listeners when reopening reports.
- Added automated tests for Quick Wins, filters, sorting, and combined behavior.
- Confirmed the full assessment and action-plan regression suite still passes.


### Progress Comparison

- Added comparison validation for snapshots from the same business and assessment version.
- Added automatic chronological ordering of earlier and later snapshots.
- Added overall score and category score comparisons.
- Added improved, declined, unchanged, and unavailable category states.
- Added newly developed, continuing, and no-longer-listed strength comparisons.
- Added resolved, continuing, and newly triggered recommendation comparisons.
- Added plain-English comparison summaries and interpretation guidance.
- Added two-snapshot selection controls to the Snapshot Library.
- Added selected snapshot highlighting and compatibility messages.
- Added a responsive Progress Comparison report.
- Added direct Edit Business Details controls to saved snapshot cards.
- Added saved profile corrections without changing scores, answers, recommendations, completion dates, or action plans.
- Added automated tests for snapshot compatibility, chronology, scores, strengths, and recommendations.
- Confirmed the full regression suite still passes.

### Backup and Restore

- Added a schema-versioned JSON backup format.
- Added export of the current application state, saved snapshots, and action plans.
- Added dated filenames for downloaded backups.
- Added validation for product identity, schema version, data collections, and snapshot relationships.
- Added clear handling for empty files, malformed JSON, unsupported backups, and invalid collections.
- Added orphaned action-plan detection.
- Added validated restore behavior with rollback protection if any storage write fails.
- Added a replacement confirmation before imported data changes current browser storage.
- Added success, cancellation, and validation messages.
- Added a responsive Backup and Restore interface to the Snapshot Library.
- Confirmed backup download and restore behavior through browser testing.
- Added automated tests for backup creation, parsing, validation, restoration, and rollback.
- Confirmed the complete Version 0.2 regression suite still passes.

