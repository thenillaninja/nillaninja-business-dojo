# Changelog

## Version 0.2 — In Progress

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
