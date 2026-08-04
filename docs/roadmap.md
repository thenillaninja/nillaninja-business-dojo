# NillaNinja Business Dojo Roadmap

## Current Version

Version: 0.1  
Status: Foundation Planning

## Version 0.1 Goal

Create a completely browser-based MVP that guides a small business owner through a professional assessment and generates a practical Business Snapshot Report.

## Core Workflow

Welcome  
↓  
Business Profile  
↓  
Business Assessment  
↓  
Business Snapshot Report  
↓  
Export Report

## Phase 0 — Platform Foundation

Status: In Progress

Deliverables:

- Project folder and Git repository
- Core folder structure
- Project README
- Assessment model
- Scoring model
- Recommendation model
- Platform architecture
- Development roadmap
- Initial test assessment
- Mock-business testing plan

Completion requirement:

The platform rules, data models, and MVP boundaries are documented before application code begins.

## Phase 1 — Application Shell

Goal:

Create the visual and structural foundation of the platform without adding assessment logic.

Deliverables:

- index.html
- CSS foundation
- Design variables
- Typography system
- Application header
- Main content area
- Step progress indicator
- Footer
- Responsive layout
- Basic accessibility foundation

Milestone commit:

Build Version 0.1 application shell

## Phase 2 — Navigation and State

Goal:

Create the guided browser application flow.

Deliverables:

- Central application state
- View switching
- Continue and back controls
- Progress tracking
- localStorage support
- Resume previous assessment
- Restart assessment
- Clear saved data

Milestone commit:

Add application state and guided navigation

## Phase 3 — Business Profile

Goal:

Collect the context needed to personalize the assessment and report.

Initial fields:

- Business name
- Business type
- Industry
- Years operating
- Employee count
- Primary products or services
- Primary customer type
- Current business priorities
- Main operational challenge

Deliverables:

- Profile form
- Plain-English field guidance
- Validation
- Saved profile data
- Profile review
- Profile summary for the report

Milestone commit:

Complete Business Profile workflow

## Phase 4 — Test Assessment Engine

Goal:

Build a reusable engine using a small 10-question development dataset.

Deliverables:

- Structured question data
- Dynamic question rendering
- Response controls
- Answer validation
- Answer storage
- Section progress
- Previous and next question controls
- Assessment completion check

Initial test topics:

- Written procedures
- Scheduling
- Customer follow-up
- Lead tracking
- Duplicate data entry
- File organization
- Owner dependency
- Website contact options
- Password sharing
- Data backups

Milestone commit:

Build reusable assessment engine

## Phase 5 — Scoring Engine

Goal:

Convert assessment answers into meaningful category and overall scores.

Deliverables:

- Weighted question scoring
- Not Applicable handling
- Category score calculation
- Overall score calculation
- Constructive score descriptions
- Strength, opportunity, and needs-attention findings
- Critical finding protection

Milestone commit:

Add weighted Business Snapshot scoring

## Phase 6 — Recommendation Engine

Goal:

Generate practical and prioritized recommendations from assessment findings.

Deliverables:

- Recommendation data structure
- Direct answer triggers
- Threshold triggers
- Combined finding triggers
- Business profile conditions
- Priority calculation
- Difficulty levels
- Expected impact
- First actions
- Recommendation sorting
- Duplicate prevention

Milestone commit:

Build rule-based recommendation engine

## Phase 7 — Report Engine

Goal:

Generate a polished Business Snapshot Report.

Report sections:

- Report header
- Executive summary
- Business profile
- Overall score
- Category scores
- What is working well
- Most important opportunities
- Category findings
- Recommended action plan
- Suggested first 30 days
- Important context and disclaimer

Milestone commit:

Generate Business Snapshot Report

## Phase 8 — Export Engine

Goal:

Allow the business owner to use the report outside the platform.

Deliverables:

- Copy report
- Download text report
- Print-friendly layout
- Browser print support
- Export status messages

Future consideration:

- PDF export

Milestone commit:

Add report export and print support

## Phase 9 — Full Business Snapshot Content

Goal:

Expand the 10-question test dataset into the complete Version 0.1 assessment.

Target categories:

- Operations
- Customer Experience
- Sales and Marketing
- Technology and Workflow
- Team and Responsibility
- Accessibility and Inclusion
- Security and Continuity

Target size:

- Approximately 40–50 questions
- Approximately 10–15 minutes to complete

Milestone commit:

Complete Business Snapshot assessment content

## Phase 10 — Mock-Business Validation

Goal:

Confirm that different businesses receive meaningfully different findings and recommendations.

Initial mock businesses:

1. Solo landscaping contractor
2. Small retail store
3. Independent auto-repair shop
4. Local restaurant
5. Freelance creative business

Each mock business should include:

- Business profile
- Assessment answers
- Expected strengths
- Expected risks
- Expected recommendations
- Notes about incorrect output

Milestone commit:

Validate MVP with realistic mock businesses

## Phase 11 — Version 0.1 Refinement

Goal:

Prepare a stable MVP demonstration.

Review areas:

- Assessment clarity
- Assessment length
- Recommendation quality
- Scoring balance
- Report usefulness
- Mobile usability
- Keyboard navigation
- Screen-reader support
- Browser storage
- Error handling
- Empty states
- Restart behavior
- Export quality

Milestone commit:

Prepare NillaNinja Business Dojo Version 0.1 MVP

## Version 0.1 Definition of Done

Version 0.1 is complete when:

- A business owner can use the platform without assistance.
- The user can create a business profile.
- The user can complete the assessment.
- Progress survives a browser refresh.
- The platform calculates understandable scores.
- The platform identifies existing strengths.
- The platform generates prioritized recommendations.
- Every recommendation explains why it matters.
- Every recommendation explains its expected impact.
- Every recommendation includes implementation difficulty.
- Every recommendation contains a clear first action.
- Different mock businesses receive different reports.
- The report works on desktop and mobile.
- The report can be copied, downloaded, and printed.
- The application works without a backend, account, framework, npm, or external API.

## Deferred Until After Version 0.1

The following features are intentionally excluded from the MVP:

- User accounts
- Authentication
- Cloud storage
- Databases
- Payments
- Subscriptions
- Team access
- Multi-business dashboards
- AI API integrations
- Automated website scanning
- Consultant portals
- Historical report comparison
- Monthly progress tracking

## Future Snapshot Modules

After the Business Snapshot proves the core engine:

- Accessibility Snapshot
- Workflow Snapshot
- AI Snapshot
- Website Snapshot
- Marketing Snapshot
- Customer Experience Snapshot
- Security Snapshot
