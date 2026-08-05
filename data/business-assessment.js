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
    id: "operations-task-deadline-tracking",
    category: "operations",
    title: "Task and deadline tracking",
    question: "Does your business track important tasks, responsibilities, and deadlines in one dependable place?",
    helpText: "This may include active jobs, follow-up tasks, ordering, paperwork, maintenance, employee responsibilities, or other work that must be completed on time.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "centralize-task-tracking"
    ],
    required: true
  },
  {
    id: "operations-estimate-proposal-consistency",
    category: "operations",
    title: "Estimate and proposal consistency",
    question: "Does your business use a consistent process and format for estimates, proposals, or quotes?",
    helpText: "Consider whether pricing, scope, timing, terms, customer details, and approval information are included reliably.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "standardize-estimates-and-proposals"
    ],
    required: true
  },
  {
    id: "operations-inventory-supply-monitoring",
    category: "operations",
    title: "Inventory and supply monitoring",
    question: "Does your business monitor important products, materials, tools, or supplies before shortages interrupt work or sales?",
    helpText: "This may involve reorder levels, regular stock checks, supply lists, purchasing reminders, or another method that prevents unexpected shortages.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "monitor-inventory-and-supplies"
    ],
    required: true
  },
  {
    id: "operations-process-improvement-review",
    category: "operations",
    title: "Process improvement review",
    question: "Does your business regularly review recurring problems, delays, mistakes, or unnecessary work?",
    helpText: "A review may be informal, but it should lead to a specific change, test, or decision instead of accepting the same problem repeatedly.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 1,
    recommendationKeys: [
      "review-and-improve-processes"
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
    id: "customer-response-expectations",
    category: "customer-experience",
    title: "Customer response expectations",
    question: "Does your business clearly tell customers when and how they should expect a response?",
    helpText: "This may include voicemail messages, email replies, website confirmations, text messages, or another method that gives customers a realistic timeframe.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "set-customer-response-expectations"
    ],
    required: true
  },
  {
    id: "customer-information-organization",
    category: "customer-experience",
    title: "Customer information organization",
    question: "Does your business keep important customer details, conversations, and next actions in one dependable place?",
    helpText: "Consider contact details, estimates, preferences, service history, notes, promises, and any follow-up that still needs to happen.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "organize-customer-information"
    ],
    required: true
  },
  {
    id: "customer-issue-handling",
    category: "customer-experience",
    title: "Customer issue handling",
    question: "Does your business use a consistent process to handle complaints, mistakes, refunds, or service problems?",
    helpText: "A consistent process should clarify who responds, how quickly the issue is addressed, what decisions can be made, and when the matter should be escalated.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "standardize-customer-issue-handling"
    ],
    required: true
  },
  {
    id: "customer-feedback-collection",
    category: "customer-experience",
    title: "Customer feedback collection",
    question: "Does your business consistently ask customers for useful feedback about their experience?",
    helpText: "This may be a short follow-up message, review request, survey, or direct conversation that helps identify what is working and what needs improvement.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 1,
    recommendationKeys: [
      "collect-customer-feedback"
    ],
    required: true
  },
  {
    id: "customer-retention-process",
    category: "customer-experience",
    title: "Customer retention process",
    question: "Does your business have a practical process for staying connected with customers who may need future service or repeat purchases?",
    helpText: "This may include reminders, maintenance follow-up, helpful updates, reordering prompts, or another relevant reason to reconnect.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "create-customer-retention-process"
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
    id: "sales-business-message-clarity",
    category: "sales-and-marketing",
    title: "Business message clarity",
    question: "Does your business use a clear and consistent message explaining what it offers, who it helps, and why customers should choose it?",
    helpText: "Consider whether the website, social profiles, advertisements, estimates, and customer conversations describe the business in a similar way.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "clarify-business-message"
    ],
    required: true
  },
  {
    id: "sales-online-presence-accuracy",
    category: "sales-and-marketing",
    title: "Online presence accuracy",
    question: "Is your business information accurate and consistent across its website, search listings, directories, and social profiles?",
    helpText: "Check the business name, phone number, address, hours, services, links, contact methods, and other details customers may rely on.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "update-online-business-information"
    ],
    required: true
  },
  {
    id: "sales-marketing-results-tracking",
    category: "sales-and-marketing",
    title: "Marketing results tracking",
    question: "Does your business track which marketing activities produce inquiries, customers, or sales?",
    helpText: "This may include referrals, search results, social media, advertisements, repeat customers, events, printed materials, or other lead sources.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "track-marketing-results"
    ],
    required: true
  },
  {
    id: "sales-referral-process",
    category: "sales-and-marketing",
    title: "Referral process",
    question: "Does your business have a simple process for asking satisfied customers or business contacts for referrals?",
    helpText: "A referral process may include choosing the right time to ask, explaining who the business can help, and making the next step easy.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 1,
    recommendationKeys: [
      "create-referral-process"
    ],
    required: true
  },
  {
    id: "sales-follow-up-responsibility",
    category: "sales-and-marketing",
    title: "Sales follow-up responsibility",
    question: "Is one person clearly responsible for each active sales opportunity and its next follow-up action?",
    helpText: "Consider whether every lead has an owner, a current status, and a specific next action or follow-up date.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "assign-sales-follow-up-responsibility"
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
    id: "technology-tool-usefulness",
    category: "technology-and-workflow",
    title: "Tool and software usefulness",
    question: "Do the tools, software, spreadsheets, and systems your business uses still fit the way the business operates?",
    helpText: "Consider whether current tools are easy enough to use, solve a clear problem, avoid unnecessary duplication, and support the work people actually perform.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "review-business-tools"
    ],
    required: true
  },
  {
    id: "technology-mobile-information-access",
    category: "technology-and-workflow",
    title: "Mobile information access",
    question: "Can people safely access the important schedules, files, instructions, and customer information they need while away from the main workplace?",
    helpText: "This may apply to field work, remote work, deliveries, customer visits, emergencies, or any situation where work happens away from one computer or location.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "improve-mobile-information-access"
    ],
    required: true
  },
  {
    id: "technology-repetitive-task-automation",
    category: "technology-and-workflow",
    title: "Repetitive task automation",
    question: "Has your business reduced or automated repetitive administrative tasks where doing so would save meaningful time?",
    helpText: "Examples may include appointment reminders, follow-up messages, recurring reports, form processing, document creation, or moving information between systems.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 1,
    recommendationKeys: [
      "automate-repetitive-tasks"
    ],
    required: true
  },
  {
    id: "technology-disconnected-systems",
    category: "technology-and-workflow",
    title: "Disconnected systems",
    question: "Does information move smoothly between the systems used for customers, scheduling, sales, payments, and operations?",
    helpText: "Consider whether information must be copied manually, becomes outdated in one place, or is difficult to follow as a customer or job moves through the business.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "connect-disconnected-systems"
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
    id: "team-responsibility-clarity",
    category: "team-and-responsibility",
    title: "Responsibility clarity",
    question: "Are important recurring responsibilities clearly assigned to specific employees, contractors, or partners?",
    helpText: "Consider customer follow-up, scheduling, ordering, approvals, paperwork, quality checks, and other work that could be missed when ownership is unclear.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "clarify-team-responsibilities"
    ],
    required: true
  },
  {
    id: "team-training-onboarding",
    category: "team-and-responsibility",
    title: "Training and onboarding",
    question: "Does your business use a repeatable process to train and onboard new employees or contractors?",
    helpText: "This may include role expectations, tools, procedures, communication methods, safety information, customer standards, and where to find help.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "standardize-training-and-onboarding"
    ],
    required: true
  },
  {
    id: "team-information-access",
    category: "team-and-responsibility",
    title: "Access to needed information",
    question: "Can employees, contractors, or partners reliably find the schedules, files, instructions, and customer information needed for their work?",
    helpText: "Consider whether people can access current information without repeatedly asking the owner or waiting for one specific person.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "improve-team-information-access"
    ],
    required: true
  },
  {
    id: "team-routine-decision-authority",
    category: "team-and-responsibility",
    title: "Routine decision authority",
    question: "Are people given clear authority to make routine decisions without waiting for the owner?",
    helpText: "This may include customer remedies, small purchases, scheduling changes, routine approvals, or other common situations with defined limits.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 3,
    recommendationKeys: [
      "define-routine-decision-authority"
    ],
    required: true
  },
  {
    id: "team-accountability-check-ins",
    category: "team-and-responsibility",
    title: "Accountability check-ins",
    question: "Does your business review priorities, unfinished work, obstacles, and results on a predictable schedule?",
    helpText: "This may be a short weekly meeting, dashboard review, task check, or another consistent method for identifying issues before they grow.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 2,
    recommendationKeys: [
      "create-accountability-check-ins"
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
  },
  {
    id: "security-data-backups",
    category: "security-and-continuity",
    title: "Data backups",
    question: "Does your business regularly back up important files and information?",
    helpText: "Important information may include customer records, estimates, invoices, financial documents, photos, procedures, and other files needed to continue operating.",
    responseType: "single-choice",
    options: standardAnswerOptions,
    weight: 4,
    recommendationKeys: [
      "establish-reliable-backups"
    ],
    required: true
  }
];
