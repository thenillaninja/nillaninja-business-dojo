export const businessProfileFields = [
  {
    id: "business-name",
    name: "businessName",
    label: "Business name",
    type: "text",
    autocomplete: "organization",
    placeholder: "Example: Evans Landscaping",
    helpText: "Enter the name customers know your business by.",
    required: true
  },
  {
    id: "business-type",
    name: "businessType",
    label: "Business type",
    type: "select",
    helpText: "Choose the option that best describes how the business operates.",
    required: true,
    options: [
      { value: "", label: "Select a business type" },
      { value: "solo-owner", label: "Solo owner-operated business" },
      { value: "owner-with-employees", label: "Owner-operated business with employees" },
      { value: "partnership", label: "Partnership" },
      { value: "family-business", label: "Family business" },
      { value: "other", label: "Other small business" }
    ]
  },
  {
    id: "industry",
    name: "industry",
    label: "Industry or line of business",
    type: "text",
    placeholder: "Example: Landscaping, retail, auto repair",
    helpText: "Use plain language. A broad description is fine.",
    required: true
  },
  {
    id: "years-operating",
    name: "yearsOperating",
    label: "How long has the business been operating?",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select a range" },
      { value: "less-than-1", label: "Less than 1 year" },
      { value: "1-to-3", label: "1–3 years" },
      { value: "4-to-7", label: "4–7 years" },
      { value: "8-to-15", label: "8–15 years" },
      { value: "16-plus", label: "16 years or more" }
    ]
  },
  {
    id: "employee-count",
    name: "employeeCount",
    label: "How many people work in the business?",
    type: "select",
    helpText: "Include the owner, regular employees, and active partners.",
    required: true,
    options: [
      { value: "", label: "Select a range" },
      { value: "1", label: "1 person" },
      { value: "2-to-5", label: "2–5 people" },
      { value: "6-to-10", label: "6–10 people" },
      { value: "11-to-20", label: "11–20 people" },
      { value: "21-plus", label: "More than 20 people" }
    ]
  },
  {
    id: "products-services",
    name: "productsServices",
    label: "What does the business sell or provide?",
    type: "textarea",
    placeholder: "Briefly describe the main products or services.",
    helpText: "A few sentences are enough.",
    required: true
  },
  {
    id: "customer-type",
    name: "customerType",
    label: "Who are the business’s main customers?",
    type: "textarea",
    placeholder: "Example: Local homeowners, contractors, retail shoppers",
    required: true
  },
  {
    id: "current-priority",
    name: "currentPriority",
    label: "What is the business’s most important priority right now?",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select a priority" },
      { value: "save-time", label: "Save time" },
      { value: "improve-consistency", label: "Improve consistency" },
      { value: "increase-sales", label: "Increase sales" },
      { value: "improve-customer-experience", label: "Improve customer experience" },
      { value: "reduce-owner-workload", label: "Reduce owner workload" },
      { value: "improve-security", label: "Improve security and continuity" },
      { value: "prepare-for-growth", label: "Prepare for growth" }
    ]
  },
  {
    id: "main-challenge",
    name: "mainChallenge",
    label: "What is the biggest challenge affecting the business today?",
    type: "textarea",
    placeholder: "Describe the problem in your own words.",
    helpText: "This helps give the final report useful context.",
    required: true
  }
];
