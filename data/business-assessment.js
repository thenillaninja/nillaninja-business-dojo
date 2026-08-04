export const standardAnswerOptions = [
  {
    id: "strong",
    label: "Yes, consistently",
    value: 1
  },
  {
    id: "partial",
    label: "Somewhat established",
    value: 0.67
  },
  {
    id: "inconsistent",
    label: "Informal or inconsistent",
    value: 0.33
  },
  {
    id: "missing",
    label: "Not currently in place",
    value: 0
  },
  {
    id: "not-applicable",
    label: "Not applicable",
    value: null
  },
  {
    id: "operations-scheduling-process",
    category: "operations",
    title: "Scheduling process",
    question: "Does your business use a reliable process to schedule work, appointments, shifts, or important deadlines?",
    helpText: "A reliable process could be a calendar, scheduling app, planner, spreadsheet, or another system that is updated consistently.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "create-reliable-scheduling-process"
    ],
    required: true
  }
];

export const businessAssessmentQuestions = [
  {
    id: "operations-written-procedures",
    category: "operations",
    title: "Written procedures",
    question: "Does your business have written instructions for important recurring tasks?",
    helpText: "This may include opening procedures, scheduling, customer follow-up, ordering, invoicing, or other work completed regularly.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "document-recurring-processes",
      "reduce-owner-dependency"
    ],
    required: true
  },
  {
    id: "operations-scheduling-process",
    category: "operations",
    title: "Scheduling process",
    question: "Does your business use a reliable process to schedule work, appointments, shifts, or important deadlines?",
    helpText: "A reliable process could be a calendar, scheduling app, planner, spreadsheet, or another system that is updated consistently.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "create-reliable-scheduling-process"
    ],
    required: true
  },
  {
    id: "customer-follow-up-process",
    category: "customer-experience",
    title: "Customer follow-up",
    question: "Does your business have a consistent process for following up with customers after an inquiry, estimate, purchase, or completed service?",
    helpText: "Follow-up may include checking on an unanswered estimate, confirming satisfaction, requesting feedback, or reminding a customer about the next step.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "standardize-customer-follow-up"
    ],
    required: true
  },
  {
    id: "sales-lead-tracking",
    category: "sales-and-marketing",
    title: "Lead tracking",
    question: "Does your business track potential customers and sales opportunities in one consistent place?",
    helpText: "This could be a notebook, spreadsheet, customer management system, or another dependable method that shows who needs follow-up and what should happen next.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "track-leads-in-one-place"
    ],
    required: true
  }
];
