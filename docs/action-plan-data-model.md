# Interactive Action Plan Data Model

## Purpose

The Interactive Action Plan turns recommendations from a completed Business Snapshot into trackable work.

Action-plan data must remain separate from the saved snapshot so that:

- original assessment answers remain unchanged
- original scores remain unchanged
- original recommendations remain unchanged
- progress can be updated over time
- a snapshot can always be reopened exactly as it was completed

---

## Storage Model

Action plans will be stored in a separate browser-storage collection.

Suggested storage key:

```text
nillaninja-business-dojo-v0.2-action-plans
```

Each completed snapshot may have one action plan.

---

## Action Plan Record

```js
{
  id: "action-plan-uuid",
  schemaVersion: "0.2",
  appVersion: "0.2",

  snapshotId: "snapshot-uuid",

  business: {
    name: "Harbor Street Market",
    normalizedName: "harbor street market"
  },

  createdAt: "2026-08-06T03:00:00.000Z",
  updatedAt: "2026-08-06T03:00:00.000Z",

  items: [
    {
      recommendationId: "enable-multi-factor-authentication",

      status: "not-started",

      targetDate: null,
      responsiblePerson: "",
      notes: "",

      checklist: [
        {
          id: "checklist-item-uuid",
          text: "Identify important accounts without multi-factor authentication",
          completed: false,
          completedAt: null
        }
      ],

      startedAt: null,
      completedAt: null,
      updatedAt: "2026-08-06T03:00:00.000Z"
    }
  ]
}
```

---

## Allowed Status Values

```js
[
  "not-started",
  "in-progress",
  "complete"
]
```

Status behavior:

- `not-started`
  - `startedAt` is null
  - `completedAt` is null

- `in-progress`
  - `startedAt` is set if it was previously null
  - `completedAt` is null

- `complete`
  - `startedAt` is set if it was previously null
  - `completedAt` is set

If an item moves from complete back to another status, `completedAt` should return to null.

---

## Recommendation Identity

Each action item is matched to the original saved recommendation using:

```js
snapshotId + recommendationId
```

The recommendation content remains in the immutable snapshot.

The action plan stores only editable progress data.

---

## Initial Checklist

When an action plan is first created, each recommendation receives one initial checklist item based on its original `firstAction`.

Example:

```js
{
  text: recommendation.firstAction,
  completed: false
}
```

Users may later add, edit, complete, or remove checklist items.

---

## Progress Calculation

Overall action-plan progress should be based on completed recommendation items.

```js
progressPercentage =
  completedItems / totalItems * 100
```

Checklist completion may be shown within each recommendation but should not replace the recommendation-level status.

---

## Persistence Rules

- Creating an action plan must not modify the snapshot.
- Updating an action item must update the action plan timestamp.
- Completing an item must record its completion date.
- Reopening a saved report must also load its action plan when one exists.
- Deleting a snapshot should also remove its associated action plan after confirmation.
- Duplicate action plans for the same snapshot should not be created.

---

## Phase 2 Implementation Order

1. Create action-plan record factory.
2. Create action-plan browser-storage module.
3. Add automated tests for creation, updates, and persistence.
4. Add action-plan controls to recommendation cards.
5. Add progress summary to the report.
6. Add editable status, target date, responsible person, notes, and checklist.
7. Test reopening, refreshing, deleting, and creating new assessments.
