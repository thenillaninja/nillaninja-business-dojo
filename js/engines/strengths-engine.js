const STRENGTH_CONTENT = {
  "operations-written-procedures": {
    title: "Important work is documented",
    summary:
      "Your business has written guidance for recurring tasks, creating a stronger foundation for consistency, training, and delegation."
  },

  "operations-scheduling-process": {
    title: "Scheduling is managed reliably",
    summary:
      "Your business uses a dependable scheduling process to keep work, appointments, shifts, or deadlines organized."
  },

  "customer-follow-up-process": {
    title: "Customer follow-up is consistent",
    summary:
      "Your business has a repeatable process for staying connected with customers after inquiries, estimates, purchases, or completed work."
  },

  "sales-lead-tracking": {
    title: "Sales opportunities are tracked",
    summary:
      "Potential customers and next actions are kept in one consistent place, reducing the chance that valuable opportunities are forgotten."
  },

  "technology-duplicate-data-entry": {
    title: "Repeated data entry is under control",
    summary:
      "Your current workflow avoids unnecessary duplication, helping reduce administrative work and inconsistent information."
  },

  "technology-file-organization": {
    title: "Business files are easy to find",
    summary:
      "Important documents are organized well enough to be located quickly when they are needed."
  },

  "team-owner-dependency": {
    title: "The business can operate without constant owner involvement",
    summary:
      "Routine work, information, and decisions can continue when the owner is unavailable, creating stronger continuity and delegation."
  },

  "accessibility-customer-contact-options": {
    title: "Customers have practical ways to connect",
    summary:
      "Your business offers more than one useful contact option, improving customer access, convenience, and inclusion."
  },

  "security-password-sharing": {
    title: "Account access is handled responsibly",
    summary:
      "People use separate account access instead of relying on shared passwords, improving control, accountability, and security."
  },

  "security-data-backups": {
    title: "Important business information is backed up",
    summary:
      "Your business has a regular backup practice that supports recovery and reduces the risk of permanent data loss."
  }
};

export function shouldCreateStrength(answer) {
  return Boolean(answer) && answer.value === 1;
}

export function createStrength(question, answer) {
  if (!question || !shouldCreateStrength(answer)) {
    return null;
  }

  const content = STRENGTH_CONTENT[question.id];

  if (!content) {
    return null;
  }

  return {
    id: `strength-${question.id}`,
    questionId: question.id,
    category: question.category,
    weight: Number(question.weight) || 0,
    title: content.title,
    summary: content.summary
  };
}

export function generateStrengths(
  questions,
  answers,
  maximumStrengths = 4
) {
  if (!Array.isArray(questions) || !answers || typeof answers !== "object") {
    return [];
  }

  const strengths = questions
    .map((question) =>
      createStrength(question, answers[question.id])
    )
    .filter(Boolean)
    .sort((a, b) => b.weight - a.weight);

  return Number.isInteger(maximumStrengths) && maximumStrengths > 0
    ? strengths.slice(0, maximumStrengths)
    : strengths;
}
