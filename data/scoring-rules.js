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


export const assessmentCategories = [
  {
    id: "operations",
    label: "Operations",
    description: "How consistently recurring work is organized, scheduled, documented, and completed."
  },
  {
    id: "customer-experience",
    label: "Customer Experience",
    description: "How reliably the business communicates with customers and follows through."
  },
  {
    id: "sales-and-marketing",
    label: "Sales and Marketing",
    description: "How consistently potential customers and sales opportunities are tracked."
  },
  {
    id: "technology-and-workflow",
    label: "Technology and Workflow",
    description: "How effectively information, files, and tools support daily work."
  },
  {
    id: "team-and-responsibility",
    label: "Team and Responsibility",
    description: "How clearly work can continue without depending entirely on the owner."
  },
  {
    id: "accessibility-and-inclusion",
    label: "Accessibility and Inclusion",
    description: "How easily customers can contact and interact with the business."
  },
  {
    id: "security-and-continuity",
    label: "Security and Continuity",
    description: "How well the business protects access, information, and operational continuity."
  }
];


export const answerValueRules = {
  strong: 1,
  partial: 0.67,
  inconsistent: 0.33,
  missing: 0,
  notApplicable: null
};

export const findingThresholds = {
  strength: {
    min: 0.85,
    max: 1
  },
  opportunity: {
    min: 0.5,
    max: 0.8499
  },
  needsAttention: {
    min: 0,
    max: 0.4999
  }
};
