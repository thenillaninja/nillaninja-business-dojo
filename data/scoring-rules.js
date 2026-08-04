export const scoreRanges = [
  {
    min: 90,
    max: 100,
    label: "Highly Structured",
    description: "The business has strong, consistent systems across most assessed areas."
  },
  {
    min: 75,
    max: 89,
    label: "Strong Foundation",
    description: "The business is operating effectively, with a manageable number of improvement opportunities."
  },
  {
    min: 60,
    max: 74,
    label: "Functional but Inconsistent",
    description: "The business has working practices, but several rely on informal processes or inconsistent follow-through."
  },
  {
    min: 40,
    max: 59,
    label: "Developing Foundation",
    description: "Important parts of the business are operating without dependable systems or clear ownership."
  },
  {
    min: 0,
    max: 39,
    label: "Significant Gaps",
    description: "The business has several issues that may affect consistency, customer experience, security, or owner workload."
  }
];

export const findingTypes = {
  strength: {
    id: "strength",
    label: "Working Well"
  },
  opportunity: {
    id: "opportunity",
    label: "Opportunity"
  },
  needsAttention: {
    id: "needs-attention",
    label: "Needs Attention"
  },
  humanReview: {
    id: "human-review",
    label: "Human Review Recommended"
  }
};
