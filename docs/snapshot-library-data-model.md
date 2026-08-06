# Snapshot Library Data Model

## Purpose

Version 0.2 will preserve completed Business Snapshot reports as immutable records while keeping the existing application state available for an assessment currently being completed.

This separation prevents a new assessment from overwriting previously completed reports and prepares the application for action plans, progress comparisons, and JSON backup and restore.

## Core Design Decision

The existing application state will remain the editable working state.

Completed assessments will be copied into separate immutable snapshot records. Reopening a snapshot will display its stored profile and results without changing the historical record.

## Storage Responsibilities

Version 0.2 should maintain separate browser-storage records for:

1. Current application state
2. Completed snapshot records
3. Action-plan records
4. Storage and backup schema metadata

The user interface and business logic should interact with browser storage through dedicated storage functions rather than accessing `localStorage` directly.

## Snapshot Record

Each completed assessment should be stored using the following structure:

```js
{
  id: "snapshot-uuid",

  schemaVersion: "0.2",
  appVersion: "0.2",
  assessmentVersion: "0.1",

  createdAt: "2026-08-06T00:00:00.000Z",
  completedAt: "2026-08-06T00:00:00.000Z",

  business: {
    name: "Example Business",
    normalizedName: "example business",
    priority: "improve-consistency"
  },

  businessProfile: {},

  assessment: {
    answers: {},
    completedQuestionIds: [],
    completionPercentage: 100
  },

  results: {
    overallScore: 0,
    categoryScores: {},
    earnedPoints: 0,
    possiblePoints: 0,
    scoredQuestionCount: 0,
    findings: [],
    strengths: [],
    recommendations: []
  },

  report: {
    generatedAt: null,
    executiveSummary: "",
    profileSummary: "",
    actionPlan: [],
    exportText: ""
  }
}

```
