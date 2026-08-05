export const smallRetailStore = {
  id: "small-retail-store",

  profile: {
    businessName: "Harbor Street Market",
    businessType: "owner-with-employees",
    industry: "Independent neighborhood retail store",
    yearsOperating: "4-to-7",
    employeeCount: "6-to-10",
    productsServices:
      "Groceries, household essentials, snacks, beverages, and locally produced specialty items.",
    customerType:
      "Neighborhood residents, commuters, families, and local workers making frequent small purchases.",
    currentPriority: "improve-consistency",
    mainChallenge:
      "Inventory counts, employee responsibilities, customer requests, and recurring store tasks are handled differently depending on who is working. The owner frequently steps in to correct missed work and resolve routine problems."
  },

  answerOptionIds: {
    "operations-written-procedures": "partial",
    "operations-scheduling-process": "partial",
    "operations-task-deadline-tracking": "inconsistent",
    "operations-estimate-proposal-consistency": "not-applicable",
    "operations-inventory-supply-monitoring": "inconsistent",
    "operations-process-improvement-review": "missing",

    "customer-follow-up-process": "not-applicable",
    "customer-response-expectations": "strong",
    "customer-information-organization": "partial",
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
    "technology-mobile-information-access": "inconsistent",
    "technology-repetitive-task-automation": "missing",
    "technology-disconnected-systems": "inconsistent",

    "team-owner-dependency": "inconsistent",
    "team-responsibility-clarity": "missing",
    "team-training-onboarding": "inconsistent",
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
      "Customers know when to expect a response",
      "The business message is clear",
      "Customers have practical ways to connect",
      "Customers have alternative ways to complete important actions"
    ],

    risks: [
      "Inventory and supply monitoring is inconsistent",
      "Employee responsibilities are unclear",
      "Routine decisions depend too heavily on the owner",
      "Important accounts lack multi-factor authentication",
      "The business has no recovery plan"
    ],

    recommendations: [
      "Enable multi-factor authentication",
      "Create a basic business interruption and recovery plan",
      "Clarify team responsibilities",
      "Define routine decision authority",
      "Monitor inventory and supplies",
      "Create accountability check-ins"
    ],

    incorrectOutputNotes: [
      "Estimate and proposal recommendations should not appear because that question is marked Not applicable.",
      "Lead-tracking and sales-follow-up recommendations should not dominate a walk-in retail business report.",
      "Team consistency and inventory control should be more prominent than customer contact options."
    ]
  }
};
