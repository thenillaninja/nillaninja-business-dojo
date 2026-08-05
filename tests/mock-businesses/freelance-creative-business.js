export const freelanceCreativeBusiness = {
  id: "freelance-creative-business",

  profile: {
    businessName: "Northstar Creative Studio",
    businessType: "solo-owner",
    industry: "Freelance design and website services",
    yearsOperating: "1-to-3",
    employeeCount: "1",
    productsServices:
      "Brand identity design, website design, landing pages, social graphics, content support, and small-business creative consulting.",
    customerType:
      "Small businesses, solo owners, nonprofits, local service providers, and occasional agency partners.",
    currentPriority: "increase-sales",
    mainChallenge:
      "Leads arrive through several channels, proposals are created manually, project files are spread across folders, and follow-up depends on memory. The owner needs a more consistent way to turn inquiries into paid work without adding more administrative burden."
  },

  answerOptionIds: {
    "operations-written-procedures": "inconsistent",
    "operations-scheduling-process": "partial",
    "operations-task-deadline-tracking": "inconsistent",
    "operations-estimate-proposal-consistency": "missing",
    "operations-inventory-supply-monitoring": "not-applicable",
    "operations-process-improvement-review": "missing",

    "customer-follow-up-process": "inconsistent",
    "customer-response-expectations": "partial",
    "customer-information-organization": "inconsistent",
    "customer-issue-handling": "strong",
    "customer-feedback-collection": "partial",
    "customer-retention-process": "inconsistent",

    "sales-lead-tracking": "missing",
    "sales-business-message-clarity": "strong",
    "sales-online-presence-accuracy": "strong",
    "sales-marketing-results-tracking": "missing",
    "sales-referral-process": "partial",
    "sales-follow-up-responsibility": "strong",

    "technology-duplicate-data-entry": "inconsistent",
    "technology-file-organization": "missing",
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
    "accessibility-website-readability-usability": "strong",
    "accessibility-digital-content": "partial",
    "accessibility-alternative-completion-methods": "strong",
    "accessibility-clear-customer-instructions": "partial",
    "accessibility-accommodation-request-process": "inconsistent",

    "security-password-sharing": "strong",
    "security-data-backups": "partial",
    "security-multi-factor-authentication": "strong",
    "security-access-removal": "not-applicable",
    "security-device-software-updates": "partial",
    "security-business-recovery-plan": "missing"
  },

  expected: {
    strengths: [
      "Customer issues are handled consistently",
      "The business message is clear",
      "Online business information is accurate",
      "Sales follow-up has clear ownership",
      "Important information is available away from the desk",
      "The website is readable and usable",
      "Important accounts use multi-factor authentication"
    ],

    risks: [
      "Leads are not tracked in one dependable place",
      "Proposals and quotes are created inconsistently",
      "Project files are difficult to organize",
      "Repetitive administrative work is not automated",
      "The business depends heavily on the owner"
    ],

    recommendations: [
      "Track sales opportunities in one place",
      "Standardize estimates and proposals",
      "Organize business files",
      "Automate repetitive tasks",
      "Standardize customer follow-up",
      "Reduce unnecessary dependence on the owner"
    ],

    incorrectOutputNotes: [
      "Inventory recommendations should not appear because that question is marked Not applicable.",
      "Employee-management recommendations should not appear for the solo owner.",
      "Lead tracking, proposals, file organization, and follow-up should be more prominent than general security recommendations."
    ]
  }
};
