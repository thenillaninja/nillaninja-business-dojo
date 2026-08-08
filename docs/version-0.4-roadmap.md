# NillaNinja Business Dojo Version 0.4 Roadmap

## Version Theme

Business Memory and Improvement Outcomes

## Primary Goal

Expand Business Dojo from tracking what a business was advised to improve into remembering what the business actually changed, what happened afterward, and which improvements became part of normal operations.

Version 0.4 should strengthen the "Learn" stage of the product progression:

Understand → Improve → Learn → Systemize → Automate

The application should begin building structured operational knowledge about the business without exposing unnecessary technical complexity to the owner.

## Product Direction

Versions 0.1 through 0.3 established:

- Business assessment
- Scoring and recommendations
- Saved historical snapshots
- Interactive action plans
- Progress tracking
- Snapshot comparison
- Reassessment guidance
- Progress history

Version 0.4 should add the missing layer between implementation activity and future systemization:

- What did the business change?
- Did the change help?
- What did the owner learn?
- Did the improvement become a normal business practice?
- Is the work recurring?
- Who is responsible for it?
- Should the process be reviewed again?
- Could this eventually become a candidate for automation?

This information should remain simple for the user while being stored in structured form underneath.

## Architectural Principle

Version 0.4 should treat business knowledge as a separate persistent domain rather than adding unrelated fields directly to immutable snapshots.

Existing responsibilities should remain clear:

- Snapshot = what the business looked like at a point in time
- Recommendation = what Business Dojo suggested
- Action plan = what the business planned and worked on
- Reassessment = when the business planned to review itself again
- Business memory = what was learned, changed, adopted, or identified through improvement work

Historical snapshots must remain immutable except for the existing supported business-profile corrections.

## Future Automation Context

Version 0.4 is not an automation release.

However, structured business memory should avoid making later automation unnecessarily difficult.

Possible long-term progression:

- Business Dojo 0.x — Diagnose my business
- Business Dojo 1.x — Help me improve my business
- Business Dojo 2.x — Remember how my business works
- Business Dojo 3.x — Help me operate my business
- Business Dojo Agent — Handle appropriate parts of my business with me

Future automation should follow a trust progression such as:

Observe → Recommend → Draft → Ask Permission → Execute → Report

Version 0.4 should support only the Observe, Recommend, and Learn foundations.

## Phase 1 — Business Memory Data Model

Define a structured record for knowledge learned through improvement work.

Potential fields should support concepts such as:

- source snapshot
- source recommendation
- source action-plan item
- business identity
- change made
- outcome observed
- owner notes
- adoption status
- recurring-process status
- responsible person
- review date
- automation-candidate status
- created and updated timestamps

Completion requirement:

The data model is documented before implementation and preserves clear relationships with existing snapshot and action-plan records.

## Phase 2 — Business Memory Storage

**Status: Complete**

Create a dedicated browser-storage collection for business-memory records.

Requirements:

- Separate storage module
- Schema version
- Create, load, update, and delete operations
- Relationship validation
- Immutable inputs where appropriate
- Structured cloning
- Graceful handling of malformed stored data

Completion requirement:

Business-memory records persist independently without modifying saved snapshots or existing action plans.

## Phase 3 — Improvement Outcome Capture

**Status: Complete**

Allow the owner to record what happened after working on a recommendation.

The experience should remain lightweight and plain-English.

Potential prompts:

- What did you change?
- What happened afterward?
- Did this help?
- Is this now part of your normal process?
- Is there anything you learned that should be remembered?

Completion requirement:

A completed or active improvement can produce a structured memory record without forcing the owner to complete a long form.

## Phase 4 — Adoption and Standardization

**Status: Complete**

Allow improvements to be identified as:

- Tested
- Working
- Adopted
- Needs revision
- No longer used

Where appropriate, the user should also be able to identify whether an improvement became:

- A recurring process
- A checklist
- A responsibility
- A decision rule
- A business standard

Completion requirement:

Business Dojo can distinguish temporary implementation activity from practices that have become part of normal operations.

## Phase 5 — Recurring Work Identification

Allow structured identification of work that repeats.

Potential information:

- Task or process name
- Frequency
- Responsible person
- Trigger
- Expected result
- Related recommendation
- Current tool or method

This should remain descriptive only.

No automated scheduling, external calendar integration, or autonomous execution should be introduced in Version 0.4.

Completion requirement:

Business Dojo can remember recurring work in a structured form without attempting to perform it.

## Phase 6 — Automation Candidate Classification

Allow the platform to identify potential automation candidates without creating or running automation.

Potential classification considerations:

- Repetitive
- Rule-based
- Stable process
- Frequent
- Time-consuming
- Error-prone
- Requires human judgment
- Requires approval
- Contains sensitive information

Possible readiness states:

- Not suitable
- Needs process improvement first
- Worth reviewing
- Strong future candidate

Completion requirement:

The platform can explain why a process may or may not be suitable for future automation without attempting execution.

## Phase 7 — Business Memory View

Create a simple owner-facing view of what Business Dojo has learned.

Possible sections:

- Improvements made
- What worked
- Practices now in place
- Recurring work
- Lessons learned
- Processes worth reviewing
- Future automation candidates

Completion requirement:

The user can understand what the platform remembers about the business without seeing raw technical data.

## Phase 8 — Snapshot and Progress Integration

Connect business-memory records to existing progress and comparison experiences where useful.

Potential uses:

- Recognize adopted improvements
- Show learned outcomes alongside score movement
- Distinguish completed work from lasting operational change
- Surface relevant prior lessons during reassessment
- Preserve links back to the source recommendation and snapshot

Completion requirement:

Historical progress reflects both assessment change and meaningful operational learning without altering old snapshot records.

## Phase 9 — Backup and Restore Compatibility

Extend backup and restore to include business-memory data.

Requirements:

- Add business-memory collection to backups
- Validate relationships
- Preserve rollback protection
- Maintain compatibility with Version 0.2 and Version 0.3 backups where practical
- Safely create an empty business-memory collection when restoring older backups

Completion requirement:

Version 0.4 business-memory records can be exported and restored without risking existing data.

## Phase 10 — Empty States and Accessibility

Validate:

- No memory records yet
- Action plan exists but no outcomes recorded
- Completed recommendation without a memory record
- No recurring work identified
- No automation candidates
- Keyboard navigation
- Screen-reader labels
- Focus visibility
- Text resizing
- Reduced-motion compatibility
- Desktop, tablet, and supported phone behavior

Completion requirement:

Business Memory remains understandable and usable in every supported state.

## Phase 11 — Mock-Business Validation

Validate Version 0.4 using the existing mock businesses:

1. Solo landscaping contractor
2. Small retail store
3. Independent auto-repair shop
4. Local restaurant
5. Freelance creative business

Validation should confirm that different businesses produce meaningfully different operational memories, recurring-work records, learned outcomes, and automation-candidate classifications.

## Version 0.4 Definition of Done

Version 0.4 is complete when:

- The owner can record what changed after working on an improvement.
- The owner can record whether the change helped.
- Improvements can be identified as tested, adopted, revised, or no longer used.
- Recurring work can be stored in structured form.
- Business Dojo can remember learned outcomes separately from immutable snapshots.
- Business memory remains linked to the recommendation and action-plan history that produced it.
- Potential automation candidates can be identified without executing automation.
- Business-memory information can be backed up and restored safely.
- Older Version 0.2 and Version 0.3 data remains usable.
- The feature works with keyboard and assistive-technology patterns already supported by the application.
- Automated tests cover the new data model, storage, relationships, and backup behavior.
- The application remains browser-based with no backend, accounts, framework, npm, build tools, AI APIs, or external integrations.

## Deferred Beyond Version 0.4

- AI API integrations
- Autonomous agents
- Automatic task execution
- Email sending
- Calendar integrations
- External workflow integrations
- Cloud synchronization
- User accounts
- Authentication
- Team collaboration
- Multi-business dashboards
- Consultant portals
- Payments and subscriptions
- White-label administration
