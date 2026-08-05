export const independentAutoRepairShop = {
  id: "independent-auto-repair-shop",

  profile: {
    businessName: "Precision Auto Works",
    businessType: "owner-with-employees",
    industry: "Independent automotive repair and maintenance",
    yearsOperating: "8-to-15",
    employeeCount: "2-to-5",
    productsServices:
      "Vehicle diagnostics, preventive maintenance, brake service, engine repair, electrical repair, and general automotive service.",
    customerType:
      "Local vehicle owners, families, commuters, and a small number of local business fleet customers.",
    currentPriority: "reduce-owner-workload",
    mainChallenge:
      "The owner performs diagnostics, approves estimates, orders parts, answers customer questions, and checks nearly every completed repair. Job status, technician notes, and customer approvals are not always recorded consistently."
  },

  answerOptionIds: {
    "operations-written-procedures": "inconsistent",
    "operations-scheduling-process": "partial",
    "operations-task-deadline-tracking": "inconsistent",
    "operations-estimate-proposal-consistency": "inconsistent",
    "operations-inventory-supply-monitoring": "partial",
    "operations-process-improvement-review": "missing",

    "customer-follow-up-process": "partial",
    "customer-response-expectations": "inconsistent",
    "customer-information-organization": "inconsistent",
    "customer-issue-handling": "strong",
    "customer-feedback-collection": "missing",
    "customer-retention-process": "partial",

    "sales-lead-tracking": "partial",
    "sales-business-message-clarity": "strong",
    "sales-online-presence-accuracy": "partial",
    "sales-marketing-results-tracking": "missing",
    "sales-referral-process": "strong",
    "sales-follow-up-responsibility": "partial",

    "technology-duplicate-data-entry": "inconsistent",
    "technology-file-organization": "inconsistent",
    "technology-tool-usefulness": "partial",
    "technology-mobile-information-access": "partial",
    "technology-repetitive-task-automation": "missing",
    "technology-disconnected-systems": "inconsistent",

    "team-owner-dependency": "missing",
    "team-responsibility-clarity": "partial",
    "team-training-onboarding": "inconsistent",
    "team-information-access": "inconsistent",
    "team-routine-decision-authority": "missing",
    "team-accountability-check-ins": "partial",

    "accessibility-customer-contact-options": "strong",
    "accessibility-website-readability-usability": "partial",
    "accessibility-digital-content": "inconsistent",
    "accessibility-alternative-completion-methods": "strong",
    "accessibility-clear-customer-instructions": "inconsistent",
    "accessibility-accommodation-request-process": "partial",

    "security-password-sharing": "inconsistent",
    "security-data-backups": "partial",
    "security-multi-factor-authentication": "missing",
    "security-access-removal": "partial",
    "security-device-software-updates": "partial",
    "security-business-recovery-plan": "missing"
  },

  expected: {
    strengths: [
      "Customer issues are handled consistently",
      "The business message is clear",
      "Referrals are encouraged consistently",
      "Customers have practical ways to connect",
      "Customers have alternative ways to complete important actions"
    ],

    risks: [
      "The owner is required for too many routine decisions",
      "Estimates and customer approvals are recorded inconsistently",
      "Job status and technician information are difficult to track",
      "Important accounts lack multi-factor authentication",
      "The business has no recovery plan"
    ],

    recommendations: [
      "Enable multi-factor authentication",
      "Create a basic business interruption and recovery plan",
      "Reduce unnecessary dependence on the owner",
      "Standardize estimates and proposals",
      "Centralize task tracking",
      "Organize customer information in one dependable place"
    ],

    incorrectOutputNotes: [
      "Inventory should not dominate the report because parts monitoring is somewhat established.",
      "Owner dependency, job tracking, and estimate consistency should remain prominent.",
      "Retail-specific walk-in customer recommendations should not dominate the output."
    ]
  }
};
