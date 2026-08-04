# NillaNinja Business Dojo Architecture

## Version

Architecture Version: 0.1  
Status: Planning

## Goal

Version 0.1 is a browser-based application built with plain HTML, CSS, and Vanilla JavaScript. It must remain lightweight and understandable while creating a clean path toward a future SaaS product.

## Core Principle

Business knowledge, application logic, and interface rendering remain separate.

Assessment Data  
↓  
Assessment Engine  
↓  
Application State  
↓  
Scoring Engine  
↓  
Recommendation Engine  
↓  
Report Engine  
↓  
Export Engine

## Application Layers

### Data — `data/`

Contains business profile fields, assessment questions, answer options, scoring rules, recommendations, triggers, and mock-business data.

### Core — `js/core/`

- `state.js`
- `navigation.js`
- `storage.js`
- `validation.js`
- `utilities.js`

Manages central state, navigation, browser storage, validation, and shared helpers.

### Engines — `js/engines/`

- `assessment-engine.js`
- `scoring-engine.js`
- `recommendation-engine.js`
- `report-engine.js`
- `export-engine.js`

Each engine accepts data and returns data. Engines do not control page layout.

### Components — `js/components/`

Reusable interface elements such as question cards, progress indicators, score cards, recommendation cards, notices, buttons, and modals.

### Views — `js/views/`

- `welcome-view.js`
- `profile-view.js`
- `assessment-view.js`
- `report-view.js`
- `export-view.js`

Views render complete screens and connect components to application state.

### Presentation — `css/`

- `variables.css`
- `base.css`
- `layout.css`
- `components.css`
- `forms.css`
- `report.css`
- `responsive.css`
- `main.css`

## Entry Points

- `index.html`
- `js/app.js`

`app.js` initializes the application, restores saved state, chooses the starting view, and connects global events. It must not become a catch-all file.

## Central State

The state must be JSON-serializable and must never contain DOM elements.

- Metadata
- Navigation
- Business profile
- Assessment
- Results
- Report

The state stores versions and dates, the current view, profile answers, assessment answers by stable ID, progress, scores, findings, recommendations, and report data.

## State Rules

- Use stable descriptive IDs.
- Update state before rendering.
- Render views from state.
- Save a schema version.
- Handle invalid saved state safely.

## Browser Storage

Version 0.1 uses `localStorage`.

Storage key:

`nillaninja-business-dojo-v0.1-state`

The platform will save progress automatically, restore unfinished assessments, retain the latest report, and provide restart and clear-data controls.

Privacy message:

> Your assessment is stored only in this browser and is not uploaded or transmitted.

## Stable Identifiers

Use IDs such as:

- `operations-written-procedures`
- `customer-follow-up-process`
- `security-shared-passwords`
- `recommendation-establish-backups`

Do not use position-based IDs such as `question-1`.

## Reusable UI Rules

Components should accept clear data, return predictable semantic markup, use consistent CSS classes, avoid hidden business logic, support keyboard use and visible focus, and never store application state internally.

## Validation and Events

Attach events through JavaScript rather than inline HTML attributes. Validate required profile fields, assessment sections, and report readiness. Messages must be clear, visible, and available to assistive technology.

## Accessibility Foundation

The application must support semantic HTML, logical headings, keyboard navigation, visible focus, proper labels, fieldset and legend, status announcements, error summaries, reduced motion, sufficient contrast, large targets, and no meaning communicated by color alone.

## Privacy Boundaries

Version 0.1 will not request passwords, banking credentials, Social Security numbers, payment card details, sensitive customer records, or confidential employee records.

## Future Module Contract

Each Snapshot module should eventually provide:

- Module metadata
- Profile requirements
- Assessment sections
- Questions
- Scoring rules
- Recommendations
- Report configuration
- Export configuration

Compatible modules should work with the same core engines.

## Future SaaS Migration

A later version may replace `localStorage` with an authenticated API and database. The assessment, scoring, recommendation, report, and export engines should remain reusable when storage changes.

## Version 0.1 Boundaries

Included:

- One active business profile
- One Business Snapshot
- Local browser storage
- Rule-based recommendations
- Text and print export

Excluded:

- Authentication
- Remote databases
- Payments
- Subscriptions
- AI APIs
- Team collaboration
- Real-time synchronization
- Automated website scanning
- Multi-tenant account logic