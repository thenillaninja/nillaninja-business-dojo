# Business Memory Data Model

## Purpose

Version 0.4 introduces Business Memory as a separate persistent data domain.

Business Memory records what the business learned, changed, adopted, revised, or identified while working through recommendations and action plans.

The goal is to preserve structured operational knowledge without modifying immutable completed snapshots.

---

## Core Design Principle

Existing data responsibilities remain separate:

- Snapshot = what the business looked like at a point in time
- Recommendation = what Business Dojo suggested
- Action plan = what the business planned and worked on
- Reassessment = when the business planned to review itself again
- Business memory = what was learned or established through improvement work

Business Memory should reference historical records rather than copy or overwrite them unnecessarily.

---

## Storage Model

Business Memory should use its own browser-storage collection.

Suggested storage key:

`nillaninja-business-dojo-v0.4-business-memory`

Suggested collection shape:

```js
{
  schemaVersion: "0.4",
  updatedAt: null,
  records: []
}
```


---

## Business Memory Record

```js
{
  id: "business-memory-uuid",

  schemaVersion: "0.4",
  appVersion: "0.4",

  business: {
    name: "Harbor Street Market",
    normalizedName: "harbor street market"
  },

  source: {
    snapshotId: "snapshot-uuid",
    actionPlanId: "action-plan-uuid",
    recommendationId: "standardize-customer-follow-up"
  },

  change: {
    summary: "Created a two-step follow-up process for estimates.",
    details: ""
  },

  outcome: {
    status: "helped",
    summary: "Customers are responding faster and fewer estimates are being forgotten."
  },

  adoption: {
    status: "adopted",
    operationalType: "recurring-process"
  },

  recurringWork: {
    isRecurring: true,
    frequency: "weekly",
    trigger: "",
    responsiblePerson: "Office manager",
    expectedResult: "All open estimates receive follow-up.",
    currentMethod: "Shared estimate tracker and message template"
  },

  automation: {
    readiness: "worth-reviewing",
    notes: ""
  },

  review: {
    reviewDate: null,
    notes: ""
  },

  ownerNotes: "",

  createdAt: "2026-08-07T00:00:00.000Z",
  updatedAt: "2026-08-07T00:00:00.000Z"
}

```

---

## Source Relationships

A Business Memory record should normally connect to:

`snapshotId + recommendationId`

When an action plan exists, it should also store:

`actionPlanId`

This preserves traceability from:

Assessment finding  
→ Recommendation  
→ Action plan  
→ Improvement outcome  
→ Business memory

Business Memory must not modify the source snapshot or recommendation.

---

## Outcome Status

Suggested allowed values:

```js
[
  "not-evaluated",
  "helped",
  "mixed",
  "did-not-help",
  "unknown"
]
```

Meaning:

- `not-evaluated` — The change was made but the outcome has not been reviewed yet.
- `helped` — The owner observed a useful improvement.
- `mixed` — The change produced both useful and problematic results.
- `did-not-help` — The change did not produce the intended result.
- `unknown` — The owner cannot currently determine the result.

These values describe observed experience, not guaranteed business performance.

---

## Adoption Status

Suggested allowed values:

```js
[
  "tested",
  "working",
  "adopted",
  "needs-revision",
  "no-longer-used"
]
```

Meaning:

- `tested` — The business tried the change.
- `working` — The change appears useful but has not yet become a normal practice.
- `adopted` — The change is now part of normal operations.
- `needs-revision` — The approach requires adjustment before continued use.
- `no-longer-used` — The business stopped using the change.

---

## Operational Type

Suggested allowed values:

```js
[
  "none",
  "recurring-process",
  "checklist",
  "responsibility",
  "decision-rule",
  "business-standard"
]
```

This field describes what the improvement became inside the business.

It should not imply automation.

---

## Recurring Work

Recurring work should remain descriptive in Version 0.4.

Suggested fields:

```js
{
  isRecurring: false,
  frequency: "",
  trigger: "",
  responsiblePerson: "",
  expectedResult: "",
  currentMethod: ""
}
```

Possible frequency values may include plain-English entries such as:

- Daily
- Weekly
- Monthly
- Quarterly
- Annually
- Per customer
- Per job
- When triggered
- Other

The system should not schedule or execute recurring work in Version 0.4.

---

## Automation Readiness

Automation classification is informational only.

Suggested allowed values:

```js
[
  "not-reviewed",
  "not-suitable",
  "needs-process-improvement",
  "worth-reviewing",
  "strong-candidate"
]
```

Meaning:

- `not-reviewed` — No automation evaluation has been completed.
- `not-suitable` — The work currently depends too heavily on judgment, sensitivity, or irregular conditions.
- `needs-process-improvement` — The process should be stabilized or simplified before automation is considered.
- `worth-reviewing` — The process has characteristics that may justify future automation review.
- `strong-candidate` — The process appears repetitive, stable, rule-based, and suitable for later evaluation.

This classification must never trigger execution.

---

## Review Information

Optional review information should allow the owner to revisit a learned practice later.

Suggested shape:

```js
{
  reviewDate: null,
  notes: ""
}
```

Version 0.4 should not create external reminders or calendar events.

---

## Record Creation Rules

A Business Memory record should require:

- Unique record ID
- Business identity
- Source snapshot ID
- Source recommendation ID
- Created timestamp
- Updated timestamp

A source action-plan ID may be optional for legacy or unusual cases where no action plan exists.

The system should reject memory creation when the referenced snapshot does not exist.

---

## Immutability Rules

Creating or updating Business Memory must not modify:

- Completed snapshot answers
- Completed snapshot scores
- Completed snapshot recommendations
- Snapshot completion dates
- Historical report content
- Existing action-plan history

Business Memory itself is editable because it represents evolving operational knowledge.

---

## Duplicate Handling

Version 0.4 should initially support one active Business Memory record per:

`snapshotId + recommendationId`

Saving the same relationship again should update the existing memory record rather than silently creating duplicates.

Future versions may support richer event history if needed.

---

## Deletion Rules

Deleting a Business Memory record should not delete:

- Its source snapshot
- Its source recommendation
- Its source action plan

Deleting a snapshot should eventually require related Business Memory records to be handled deliberately so orphaned records are not left behind.

---

## Backup Requirements

Business Memory should be included in Version 0.4 JSON backups.

Backup validation should confirm:

- The Business Memory collection has the expected shape.
- Every record has a valid source snapshot.
- Recommendation IDs are present.
- Orphaned memory records are rejected or handled safely.
- Restoring Version 0.2 or Version 0.3 backups creates an empty Business Memory collection.

Rollback protection should remain consistent with the existing backup system.

---

## Future Compatibility

The data model should support later expansion toward:

- Process libraries
- Standard operating procedures
- Responsibility maps
- Decision rules
- Improvement history
- Recurring operational routines
- Automation evaluation
- AI-assisted retrieval
- Agentic workflows

Version 0.4 must not implement those future systems prematurely.

The purpose of this model is to preserve structured operational knowledge now so later versions do not need to reconstruct it from display text or free-form notes.
