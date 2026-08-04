# Business Snapshot Scoring Model

## Version

Scoring Model: 0.1  
Status: Planning

## Purpose

The scoring system converts assessment answers into understandable category results and an overall Business Snapshot score.

The score should help the business owner understand where the business is strong, where practices are inconsistent, and where attention is needed.

The score must never replace the recommendations.

## Scoring Principles

- Score business practices, not company size.
- Do not assume expensive software is better than a reliable manual process.
- Reward consistency, clarity, documentation, and follow-through.
- Give greater weight to issues that create meaningful operational or security risk.
- Allow partial credit.
- Support Not Applicable responses.
- Explain every score in plain English.
- Keep scoring rules separate from interface code.

## Score Range

The overall score uses a 0–100 scale.

### 90–100: Highly Structured

The business has strong, consistent systems across most assessed areas.

### 75–89: Strong Foundation

The business is operating effectively, with a manageable number of improvement opportunities.

### 60–74: Functional but Inconsistent

The business has working practices, but several rely on informal processes or inconsistent follow-through.

### 40–59: Developing Foundation

Important parts of the business are operating without dependable systems or clear ownership.

### 0–39: Significant Gaps

The business has several issues that may affect consistency, customer experience, security, or the owner’s workload.

## Constructive Language

Do not use labels such as:

- Bad business
- Failing
- Poorly managed
- Unprofessional
- Broken

Preferred language includes:

- Needs attention
- Important opportunity
- Developing process
- Working but inconsistent
- Strong foundation
- Review recommended

## Answer Values

Most test questions will use four scored responses:

- Strong practice: 100 percent of available points
- Partially established: 67 percent of available points
- Informal or inconsistent: 33 percent of available points
- Not currently in place: 0 percent of available points

Questions may also support:

- Not Applicable: removed from the possible score
- Human Review: does not automatically pass or fail

## Question Weights

Each question receives a numerical weight.

### Low Weight: 1

Useful improvement, but limited immediate impact.

### Moderate Weight: 2

Meaningful effect on consistency, time, or customer experience.

### High Weight: 3

Important effect on daily operations, revenue, owner workload, or continuity.

### Critical Weight: 4

Potentially serious security, data-loss, safety, or business-interruption concern.

## Weighted Score Formula

Each answer produces an earned value between 0 and 1.

Example:

Question weight: 3  
Answer value: 0.67  
Earned points: 3 × 0.67 = 2.01

Category score:

Total earned category points  
÷  
Total possible category points  
×  
100

Overall score:

Total earned points across all applicable questions  
÷  
Total possible points across all applicable questions  
×  
100

The final displayed score should be rounded to the nearest whole number.

## Category Scores

Version 0.1 may calculate scores for:

- Operations
- Customer Experience
- Sales and Marketing
- Technology and Workflow
- Team and Responsibility
- Accessibility and Inclusion
- Security and Continuity

The Business Foundation profile provides context but should not initially receive a score.

## Not Applicable Handling

When a response is Not Applicable:

- The question earns no points.
- The question contributes no possible points.
- The business is not penalized.
- The report may briefly explain why the item was excluded.

A solo business should not lose points for lacking employee training procedures when it has no employees.

## Priority and Score Separation

Recommendation priority must not be determined only by the overall score.

A business may have a high overall score while still having one critical issue, such as:

- Shared passwords
- No data backups
- One person holding all account access
- No process for urgent customer communication

Critical findings must remain visible regardless of the overall score.

## Finding Types

The scoring engine should support four result types:

### Strength

A dependable practice is in place.

### Opportunity

A practice exists but could be improved.

### Needs Attention

A meaningful process or control is missing.

### Human Review Recommended

The answer requires context that automated scoring cannot fully evaluate.

## Initial Test Weights

| Topic | Category | Weight |
|---|---|---:|
| Written procedures | Operations | 3 |
| Scheduling | Operations | 2 |
| Customer follow-up | Customer Experience | 3 |
| Lead tracking | Sales and Marketing | 2 |
| Duplicate data entry | Technology and Workflow | 2 |
| File organization | Technology and Workflow | 2 |
| Owner dependency | Team and Responsibility | 3 |
| Website contact options | Accessibility and Inclusion | 2 |
| Password sharing | Security and Continuity | 4 |
| Data backups | Security and Continuity | 4 |

## Score Validation Requirements

Test these scenarios before accepting the scoring engine:

### Strong Business

Mostly strong-practice answers.

Expected results:

- High overall score
- Several strengths
- Few recommendations
- No exaggerated warnings

### Informal but Functional Business

Mostly partially established or inconsistent answers.

Expected results:

- Mid-range score
- Constructive language
- Practical consistency recommendations
- No suggestion that the business is failing

### High-Risk Business

Weak password and backup practices with otherwise average answers.

Expected results:

- Security concerns remain highly visible
- Immediate recommendations appear
- Overall score does not hide critical findings

### Solo Business

Employee-related questions marked Not Applicable.

Expected results:

- No penalty for lacking employees
- Owner-dependency findings remain relevant
- Score uses only applicable questions

## Future Scoring Capabilities

Later versions may support:

- Industry-specific weights
- Business-size adjustments
- Conditional questions
- Module-specific scoring
- Historical score comparisons
- Confidence indicators
- Benchmarking
- Progress tracking over time
