# Business Snapshot Recommendation Model

## Version

Recommendation Model: 0.1  
Status: Planning

## Purpose

The recommendation engine converts assessment findings into practical actions a small business owner can understand and implement.

The platform must not stop at identifying a problem.

Every recommendation should explain:

- What should change
- Why it matters
- What impact the change may have
- How difficult it is to implement
- How much effort it may require
- What the owner should do first

## Recommendation Principles

- Use plain English.
- Recommend realistic actions for businesses with 1–20 employees.
- Do not assume the business has a large budget.
- Do not recommend software when a reliable checklist or simple document would work.
- Do not recommend AI unless it solves a specific problem.
- Prioritize practical improvements over trendy tools.
- Keep recommendations constructive.
- Avoid overwhelming the owner with too many actions.
- Recognize existing strengths.
- Separate urgent risks from long-term improvements.

## Recommendation Structure

Each recommendation should contain the following fields.

### Identifier

A permanent descriptive ID.

Example:

document-recurring-processes

### Title

A direct action statement.

Example:

Document your most important recurring processes

### Summary

A short explanation of the recommendation.

### Why It Matters

Explain the business problem in practical terms.

Example:

When important tasks only exist in the owner’s memory, work can become inconsistent and difficult to delegate.

### Expected Impact

Explain the likely result.

Possible impact areas:

- Time savings
- Greater consistency
- Fewer mistakes
- Faster customer response
- Improved customer experience
- Reduced owner workload
- Easier training
- Better security
- Improved business continuity
- Increased accessibility

### Priority

Use one of four levels.

#### Immediate

A serious issue that should be addressed as soon as reasonably possible.

Examples:

- Shared passwords
- No backups
- No access recovery process
- Important customer information stored insecurely

#### High

A meaningful operational issue that affects daily work, customers, revenue, or owner workload.

#### Medium

A valuable improvement that should be addressed after higher-priority issues.

#### Future

A useful opportunity that is not currently urgent.

### Implementation Difficulty

Use one of three levels.

#### Easy

Can usually be started without technical help or major process changes.

#### Moderate

Requires planning, coordination, tool setup, or changes to established habits.

#### Advanced

May require specialist assistance, significant configuration, or a larger operational change.

### Estimated Effort

Use practical time ranges:

- Less than one hour
- A few hours
- One business day
- Several days
- Several weeks
- Ongoing improvement

These estimates are guidance, not guarantees.

### First Action

Give the owner one clear starting step.

Example:

Choose one recurring task that causes frequent confusion and write the steps in the order they should happen.

### Suggested Approach

Explain a simple way to carry out the recommendation.

### Possible Tools

Mention tools only when useful.

Possible recommendations may include:

- Printed checklist
- Shared document
- Spreadsheet
- Calendar
- Form template
- Password manager
- Cloud backup
- Existing business software
- Automation
- AI assistance

The recommendation should not imply that purchasing software is always necessary.

### Related Findings

List the question IDs or findings that triggered the recommendation.

### Impact Areas

Store the areas of the business that may improve.

Example:

- Consistency
- Training
- Delegation
- Owner dependency

## Recommendation Trigger Types

Version 0.1 should support several simple trigger types.

### Direct Answer Trigger

One answer triggers a recommendation.

Example:

If password-sharing is reported, recommend individual account access and a password manager.

### Threshold Trigger

A recommendation appears when a question score falls below a defined value.

### Combined Answer Trigger

Multiple answers together trigger a stronger recommendation.

Example:

If processes are undocumented and employees regularly ask the owner how to complete tasks, recommend process documentation with high priority.

### Category Score Trigger

A low category score may trigger a broader category recommendation.

### Business Profile Condition

The business profile may change whether a recommendation is relevant.

Example:

Employee training recommendations should not appear for a solo business.

## Recommendation Priority Rules

Priority should be determined using:

- Severity of the issue
- Question weight
- Number of related findings
- Effect on customers
- Effect on revenue
- Effect on daily operations
- Security or continuity risk
- Owner dependency
- Ease of improvement

A recommendation should not become urgent solely because the overall score is low.

## Recommendation Deduplication

Multiple findings may point to the same underlying problem.

The engine should combine related findings rather than displaying several nearly identical recommendations.

Example findings:

- No written opening checklist
- Employees perform closing tasks differently
- Training is mostly verbal

These may support one broader recommendation:

Create written procedures for recurring operational tasks.

## Recommendation Limits

The report should not display every possible recommendation with equal importance.

Recommended Version 0.1 limits:

- 3–5 priority opportunities
- Up to 3 immediate recommendations
- Up to 5 high-priority recommendations
- Additional medium and future recommendations grouped separately

The most important actions should appear first.

## Strength Recognition

Strong answers should generate positive findings.

Examples:

- Customer inquiries are answered consistently.
- Important files are organized and accessible.
- Backups are completed regularly.
- Employees understand their responsibilities.

Strengths should not trigger unnecessary recommendations.

A strong practice may still support an optional future improvement, but it should not be framed as a problem.

## Initial Test Recommendations

The 10-question development dataset should support these recommendation records.

### Document Recurring Processes

Trigger topics:

- Written procedures
- Owner dependency

Possible priority:

- High

Possible difficulty:

- Moderate

### Create a Reliable Scheduling Process

Trigger topics:

- Scheduling

Possible priority:

- Medium or High

Possible difficulty:

- Easy

### Standardize Customer Follow-Up

Trigger topics:

- Customer follow-up

Possible priority:

- High

Possible difficulty:

- Easy

### Track Leads in One Place

Trigger topics:

- Lead tracking

Possible priority:

- Medium

Possible difficulty:

- Easy

### Reduce Duplicate Data Entry

Trigger topics:

- Duplicate data entry

Possible priority:

- Medium

Possible difficulty:

- Moderate

### Organize Business Files

Trigger topics:

- File organization

Possible priority:

- Medium

Possible difficulty:

- Easy

### Reduce Owner Dependency

Trigger topics:

- Owner dependency
- Written procedures
- Role clarity

Possible priority:

- High

Possible difficulty:

- Moderate

### Improve Customer Contact Options

Trigger topics:

- Website contact options
- Accessibility

Possible priority:

- Medium

Possible difficulty:

- Easy

### Stop Sharing Passwords

Trigger topics:

- Password sharing

Possible priority:

- Immediate

Possible difficulty:

- Easy

### Establish Reliable Backups

Trigger topics:

- Data backups

Possible priority:

- Immediate

Possible difficulty:

- Moderate

## Recommendation Validation

Before accepting the engine, verify that:

- Strong businesses receive fewer recommendations.
- Critical security findings always remain visible.
- Solo businesses do not receive irrelevant employee recommendations.
- Similar findings are combined.
- Recommendations appear in priority order.
- Every recommendation contains a first action.
- Every recommendation explains why it matters.
- Every recommendation includes expected impact.
- Every recommendation includes difficulty.
- Recommendations remain practical for small budgets.
- AI is suggested only when it is genuinely useful.

## Future Capabilities

Later versions may support:

- Industry-specific recommendations
- Business-size variations
- Recommendation dependencies
- Completed-action tracking
- Progress plans
- Tool comparisons
- Templates generated from recommendations
- Consultant review
- AI-assisted personalization
- Recommendation history
- Monthly improvement plans
