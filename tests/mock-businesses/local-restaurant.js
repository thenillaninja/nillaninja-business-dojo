export const localRestaurant = {
  id: "local-restaurant",

  profile: {
    businessName: "Oak & Ember Kitchen",
    businessType: "owner-with-employees",
    industry: "Independent local restaurant",
    yearsOperating: "8-to-15",
    employeeCount: "11-to-20",
    productsServices:
      "Dine-in meals, takeout orders, catering, beverages, and seasonal menu offerings.",
    customerType:
      "Local families, nearby workers, regular neighborhood customers, visitors, and small catering clients.",
    currentPriority: "improve-customer-experience",
    mainChallenge:
      "Service quality, shift handoffs, food preparation routines, customer issue handling, and closing tasks vary depending on who is working. The owner is frequently pulled into routine decisions and customer complaints."
  },

  answerOptionIds: {
    "operations-written-procedures": "inconsistent",
    "operations-scheduling-process": "partial",
    "operations-task-deadline-tracking": "inconsistent",
    "operations-estimate-proposal-consistency": "not-applicable",
    "operations-inventory-supply-monitoring": "partial",
    "operations-process-improvement-review": "missing",

    "customer-follow-up-process": "not-applicable",
    "customer-response-expectations": "partial",
    "customer-information-organization": "inconsistent",
    "customer-issue-handling": "inconsistent",
    "customer-feedback-collection": "missing",
    "customer-retention-process": "partial",

    "sales-lead-tracking": "not-applicable",
    "sales-business-message-clarity": "strong",
    "sales-online-presence-accuracy": "partial",
    "sales-marketing-results-tracking": "missing",
    "sales-referral-process": "inconsistent",
    "sales-follow-up-responsibility": "not-applicable",

    "technology-duplicate-data-entry": "inconsistent",
    "technology-file-organization": "partial",
    "technology-tool-usefulness": "partial",
    "technology-mobile-information-access": "partial",
    "technology-repetitive-task-automation": "missing",
    "technology-disconnected-systems": "inconsistent",

    "team-owner-dependency": "inconsistent",
    "team-responsibility-clarity": "inconsistent",
    "team-training-onboarding": "missing",
    "team-information-access": "partial",
    "team-routine-decision-authority": "missing",
    "team-accountability-check-ins": "inconsistent",

    "accessibility-customer-contact-options": "strong",
    "accessibility-website-readability-usability": "partial",
    "accessibility-digital-content": "inconsistent",
    "accessibility-alternative-completion-methods": "strong",
    "accessibility-clear-customer-instructions": "partial",
    "accessibility-accommodation-request-process": "inconsistent",

    "security-password-sharing": "inconsistent",
    "security-data-backups": "partial",
    "security-multi-factor-authentication": "missing",
    "security-access-removal": "inconsistent",
    "security-device-software-updates": "partial",
    "security-business-recovery-plan": "missing"
  },

  expected: {
    strengths: [
      "The business message is clear",
      "Customers have practical ways to connect",
      "Customers have alternative ways to complete important actions"
    ],

    risks: [
      "Training and onboarding are inconsistent",
      "Routine decisions depend too heavily on the owner",
      "Customer issues are handled differently by different employees",
      "Important accounts lack multi-factor authentication",
      "The business has no recovery plan"
    ],

    recommendations: [
      "Enable multi-factor authentication",
      "Create a basic business interruption and recovery plan",
      "Standardize training and onboarding",
      "Clarify team responsibilities",
      "Define routine decision authority",
      "Create a consistent customer issue process"
    ],

    incorrectOutputNotes: [
      "Estimate and proposal recommendations should not appear because that question is marked Not applicable.",
      "Lead-tracking and sales-follow-up recommendations should not dominate a restaurant report.",
      "Training, customer issue handling, and routine decision authority should be prominent."
    ]
  }
};
