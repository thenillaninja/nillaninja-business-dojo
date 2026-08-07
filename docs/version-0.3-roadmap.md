# NillaNinja Business Dojo Version 0.3 Roadmap

## Version Theme

Progress Dashboard and Guided Follow-Through

## Primary Goal

Transform Business Dojo from a one-time assessment and report tool into an ongoing improvement workspace that helps small-business owners understand what to work on next and track meaningful progress over time.

## Product Direction

Version 0.3 will build on the Version 0.2 Snapshot Library and Interactive Action Plan.

The platform should help the user answer:

- What should I work on next?
- How much progress have I made?
- What important work is overdue?
- What has improved since my previous assessment?
- When should I reassess the business?

Version 0.3 will remain completely browser-based and will not require accounts, authentication, a backend, a database, payments, subscriptions, or external APIs.

## Phase 1 — Progress Data Model

Create reusable calculations that summarize action-plan progress.

Planned metrics:

- Total action-plan items
- Not-started items
- In-progress items
- Completed items
- Completion percentage
- Immediate-priority items remaining
- High-priority items remaining
- Overdue target dates
- Upcoming target dates
- Recently completed items
- Checklist completion totals

Completion requirement:

Progress calculations are separate from interface rendering, immutable, and covered by automated tests.

## Phase 2 — Progress Dashboard

Create a central dashboard that summarizes the current improvement plan.

Planned sections:

- Progress overview
- Completion percentage
- Status totals
- Priority work remaining
- Overdue work
- Upcoming target dates
- Recently completed improvements
- Link to the full action plan

Completion requirement:

The user can understand the state of the improvement plan without reviewing every recommendation individually.

## Phase 3 — Next Best Actions

Create a focused view that recommends what the owner should work on next.

Selection considerations:

- Recommendation priority
- Current status
- Target date
- Implementation difficulty
- Quick-win eligibility
- Checklist progress

The system should explain why each item was selected.

Completion requirement:

The platform presents a small, practical set of next actions rather than overwhelming the user with the entire plan.

## Phase 4 — Progress Between Snapshots

Expand snapshot comparison to include implementation progress.

Planned comparisons:

- Overall score movement
- Category score movement
- Recommendations completed
- Recommendations newly added
- Recommendations still unresolved
- Action-plan completion movement
- Significant business improvements

Completion requirement:

The user can clearly distinguish assessment improvement from action-plan activity.

## Phase 5 — Reassessment Guidance

Help the owner understand when a new assessment may be useful.

Planned guidance:

- Display the age of the latest snapshot
- Identify whether meaningful action-plan work has been completed
- Recommend reassessment after substantial changes
- Explain that reassessment is guidance rather than a requirement
- Avoid intrusive alerts or pressure

Completion requirement:

The user receives understandable reassessment guidance without needing scheduled notifications or an external service.

## Phase 6 — Dashboard Empty and First-Time States

Create useful guidance for situations where:

- No snapshot exists
- A snapshot exists but no action-plan items exist
- No work has started
- All work is complete
- No target dates are assigned
- No comparison snapshot exists

Completion requirement:

Every dashboard state gives the owner a clear and constructive next step.

## Phase 7 — Responsive and Accessibility Validation

Validate:

- Desktop dashboard layout
- Tablet dashboard layout
- Phone report-only behavior
- Keyboard navigation
- Screen-reader labels
- Focus visibility
- Reduced-motion compatibility
- Text resizing
- Empty-state clarity

Completion requirement:

The dashboard remains understandable and usable across supported screen sizes and assistive technology patterns.

## Phase 8 — Backup Compatibility

Update JSON backup and restore support for any Version 0.3 data additions.

Requirements:

- Preserve Version 0.2 backup compatibility where practical
- Validate Version 0.3 data before restoration
- Maintain rollback protection
- Reject malformed progress data safely
- Document schema changes

Completion requirement:

Progress information can be backed up and restored without risking existing snapshots or action-plan data.

## Phase 9 — Mock-Business Validation

Validate Version 0.3 using the existing mock businesses:

1. Solo landscaping contractor
2. Small retail store
3. Independent auto-repair shop
4. Local restaurant
5. Freelance creative business

Validation should confirm that different action plans generate meaningfully different dashboard summaries and next-action suggestions.

## Version 0.3 Definition of Done

Version 0.3 is complete when:

- The user can view a useful progress dashboard.
- The dashboard summarizes action-plan status accurately.
- The platform identifies practical next actions.
- Overdue and upcoming work is understandable.
- Completed work is recognized constructively.
- Snapshot comparison includes meaningful progress context.
- Reassessment guidance is clear and nonintrusive.
- Empty states provide useful direction.
- Progress calculations are covered by automated tests.
- Backup and restore remain safe.
- The interface works across supported desktop, tablet, and phone layouts.
- The application remains browser-based with no backend, accounts, framework, npm, build tools, or external APIs.

## Deferred Beyond Version 0.3

- User accounts
- Authentication
- Cloud synchronization
- Team collaboration
- Multi-business dashboards
- Email or push reminders
- Calendar integrations
- Consultant portals
- Payments and subscriptions
- White-label administration
- AI API integrations
