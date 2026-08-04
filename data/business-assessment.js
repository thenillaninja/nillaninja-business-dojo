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
  },
  {
    id: "technology-duplicate-data-entry",
    category: "technology-and-workflow",
    title: "Duplicate data entry",
    question: "Does your business regularly enter the same information into more than one system, document, or spreadsheet?",
    helpText: "Examples include copying customer details between forms, invoices, calendars, spreadsheets, or separate software tools.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "reduce-duplicate-data-entry"
    ],
    required: true
  },
  {
    id: "technology-file-organization",
    category: "technology-and-workflow",
    title: "Business file organization",
    question: "Can important business files and documents be found quickly when they are needed?",
    helpText: "This includes estimates, invoices, customer records, forms, photos, contracts, procedures, and other files used to operate the business.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "organize-business-files"
    ],
    required: true
  },
  {
    id: "team-owner-dependency",
    category: "team-and-responsibility",
    title: "Owner dependency",
    question: "Can the business continue operating smoothly when the owner is unavailable?",
    helpText: "Consider whether employees or partners can access needed information, make routine decisions, complete important tasks, and respond to customers without waiting for the owner.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "reduce-owner-dependency",
      "document-recurring-processes"
    ],
    required: true
  },
  {
    id: "accessibility-customer-contact-options",
    category: "accessibility-and-inclusion",
    title: "Customer contact options",
    question: "Does your business offer customers more than one practical way to get in touch or complete an important request?",
    helpText: "Examples may include phone, email, a website form, text messaging, in-person support, or another accessible option that fits the business.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "improve-customer-contact-options"
    ],
    required: true
  },
  {
    id: "security-password-sharing",
    category: "security-and-continuity",
    title: "Password sharing",
    question: "Do people in the business use separate account access instead of sharing the same passwords?",
    helpText: "Shared passwords make it harder to control access, remove former users, recover accounts, and understand who changed important information.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 4,
    recommendationKeys: [
      "stop-sharing-passwords"
    ],
    required: true
  }
];
