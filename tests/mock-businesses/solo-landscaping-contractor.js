export const soloLandscapingContractor = {
  id: "solo-landscaping-contractor",

  profile: {
    businessName: "GreenPath Landscaping",
    businessType: "solo-owner",
    industry: "Residential landscaping and lawn care",
    yearsOperating: "4-to-7",
    employeeCount: "1",
    productsServices:
      "Lawn maintenance, landscape cleanup, planting, mulch installation, and small outdoor improvement projects.",
    customerType:
      "Local homeowners and a small number of residential property managers.",
    currentPriority: "save-time",
    mainChallenge:
      "The owner handles scheduling, estimates, customer communication, purchasing, and field work alone. Important information is spread across text messages, paper notes, and memory."
  },

  answerOptionIds: {
    "operations-written-procedures": "missing",
    "operations-scheduling-process": "inconsistent",
    "operations-task-deadline-tracking": "inconsistent",
    "operations-estimate-proposal-consistency": "partial",
    "operations-inventory-supply-monitoring": "inconsistent",
    "operations-process-improvement-review": "missing",

    "customer-follow-up-process": "inconsistent",
    "customer-response-expectations": "missing",
    "customer-information-organization": "inconsistent",
    "customer-issue-handling": "partial",
    "customer-feedback-collection": "missing",
    "customer-retention-process": "missing",

    "sales-lead-tracking": "inconsistent",
    "sales-business-message-clarity": "partial",
    "sales-online-presence-accuracy": "partial",
    "sales-marketing-results-tracking": "missing",
    "sales-referral-process": "inconsistent",
    "sales-follow-up-responsibility": "strong",

    "technology-duplicate-data-entry": "inconsistent",
    "technology-file-organization": "inconsistent",
    "technology-tool-usefulness": "partial",
    "technology-mobile-information-access": "strong",
    "technology-repetitive-task-automation": "missing",
    "technology-disconnected-systems": "inconsistent",

    "team-owner-dependency": "missing",
    "team-responsibility-clarity": "not-applicable",
    "team-training-onboarding": "not-applicable",
    "team-information-access": "not-applicable",
    "team-routine-decision-authority": "not-applicable",
    "team-accountability-check-ins": "not-applicable",

    "accessibility-customer-contact-options": "strong",
    "accessibility-website-readability-usability": "partial",
    "accessibility-digital-content": "inconsistent",
    "accessibility-alternative-completion-methods": "strong",
    "accessibility-clear-customer-instructions": "partial",
    "accessibility-accommodation-request-process": "missing",

    "security-password-sharing": "strong",
    "security-data-backups": "missing",
    "security-multi-factor-authentication": "inconsistent",
    "security-access-removal": "not-applicable",
    "security-device-software-updates": "partial",
    "security-business-recovery-plan": "missing"
  },

  expected: {
    strengths: [
      "Sales follow-up has clear ownership",
      "Important information is available away from the desk",
      "Account access is handled responsibly",
      "Customers have practical ways to connect",
      "Customers have alternative ways to complete important actions"
    ],

    risks: [
      "Heavy dependence on the owner",
      "No reliable data backups",
      "No business recovery plan",
      "Scattered scheduling and task tracking",
      "Customer and job information stored inconsistently"
    ],

    recommendations: [
      "Establish reliable backups",
      "Create a basic business interruption and recovery plan",
      "Enable multi-factor authentication",
      "Reduce unnecessary dependence on the owner",
      "Document your most important recurring processes",
      "Organize customer information in one dependable place"
    ],

    incorrectOutputNotes: [
      "Employee-management recommendations should not appear for questions marked Not applicable.",
      "The solo owner should not be penalized for having no employees.",
      "Security and continuity risks should remain visible despite several strong accessibility and mobile-work practices."
    ]
  }
};
