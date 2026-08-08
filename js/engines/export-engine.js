import { businessProfileFields } from "../../data/business-profile.js";

function formatCategoryName(category = "") {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLabel(value = "") {
  return value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "";
}

function getScoreSummary(score) {
  if (!Number.isFinite(score)) {
    return "Assessment score unavailable.";
  }

  if (score >= 85) {
    return "The business shows a strong operational foundation with a few opportunities for refinement.";
  }

  if (score >= 70) {
    return "The business has several reliable systems in place, with clear opportunities to improve consistency.";
  }

  if (score >= 50) {
    return "The business has a functional foundation, but several systems may depend on informal or inconsistent processes.";
  }

  return "The business has important opportunities to strengthen consistency, reduce risk, and make daily operations easier.";
}

function getProfileFieldDisplayValue(field, value) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (!Array.isArray(field.options)) {
    return normalizedValue;
  }

  return (
    field.options.find((option) => option.value === normalizedValue)?.label ??
    normalizedValue
  );
}

function renderProfileSection(profile = {}) {
  const populatedFields = businessProfileFields
    .map((field) => [
      field.label,
      getProfileFieldDisplayValue(field, profile[field.name])
    ])
    .filter(([, value]) => value);

  if (populatedFields.length === 0) {
    return "";
  }

  return [
    "BUSINESS PROFILE",
    "----------------",
    ...populatedFields.map(
      ([label, value]) => `${label}: ${value}`
    )
  ].join("\n");
}

function renderCategorySection(categoryScores = {}) {
  const entries = Object.entries(categoryScores);

  if (entries.length === 0) {
    return "";
  }

  return [
    "CATEGORY SCORES",
    "---------------",
    ...entries.map(([category, result]) => {
      const score = Number.isFinite(result?.score) ? result.score : 0;
      return `${formatCategoryName(category)}: ${score}/100`;
    })
  ].join("\n");
}

function renderStrengthsSection(strengths = []) {
  if (!Array.isArray(strengths) || strengths.length === 0) {
    return [
      "BUSINESS STRENGTHS",
      "------------------",
      "No standout strengths were identified."
    ].join("\n");
  }

  return [
    "BUSINESS STRENGTHS",
    "------------------",
    ...strengths.flatMap((strength, index) => [
      `${index + 1}. ${strength.title}`,
      `   Category: ${formatCategoryName(strength.category)}`,
      `   ${strength.summary}`,
      ""
    ])
  ].join("\n").trimEnd();
}

function renderRecommendationsSection(recommendations = []) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return [
      "RECOMMENDED NEXT STEPS",
      "----------------------",
      "No priority recommendations were triggered."
    ].join("\n");
  }

  return [
    "RECOMMENDED NEXT STEPS",
    "----------------------",
    ...recommendations.flatMap((recommendation, index) => [
      `${index + 1}. ${recommendation.title}`,
      `   Priority: ${formatLabel(recommendation.priority)}`,
      `   Difficulty: ${formatLabel(recommendation.difficulty)}`,
      `   Estimated effort: ${recommendation.estimatedEffort}`,
      `   Summary: ${recommendation.summary}`,
      `   Why it matters: ${recommendation.whyItMatters}`,
      `   Expected impact: ${recommendation.expectedImpact}`,
      `   Start here: ${recommendation.firstAction}`,
      ""
    ])
  ].join("\n").trimEnd();
}

export function generateReportText({
  businessProfile = {},
  results = {}
} = {}) {
  const businessName =
    businessProfile.businessName?.trim() || "Your Business";

  const score = Number.isFinite(results.overallScore)
    ? results.overallScore
    : 0;

  const generatedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long"
  }).format(new Date());

  const sections = [
    "NILLANINJA BUSINESS DOJO",
    "BUSINESS SNAPSHOT REPORT",
    "========================",
    "",
    businessName,
    `Generated: ${generatedDate}`,
    `Overall score: ${score}/100`,
    "",
    "EXECUTIVE SUMMARY",
    "-----------------",
    getScoreSummary(score),
    "",
    renderProfileSection(businessProfile),
    "",
    renderCategorySection(results.categoryScores),
    "",
    renderStrengthsSection(results.strengths),
    "",
    renderRecommendationsSection(results.recommendations),
    "",
    "This report is an educational business-improvement snapshot based on the answers provided. It is not legal, financial, cybersecurity, or professional certification advice."
  ];

  return sections
    .filter((section, index, allSections) => {
      if (section !== "") {
        return true;
      }

      return index > 0 && allSections[index - 1] !== "";
    })
    .join("\n")
    .trim();
}

export function createReportFilename(businessName = "") {
  const safeName = businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "business"}-snapshot-report.txt`;
}


export function generateBusinessMemoryText({
  businessName = "",
  records = []
} = {}) {
  const displayBusinessName =
    businessName.trim() || "Your Business";

  const generatedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long"
  }).format(new Date());

  const meaningfulRecords = Array.isArray(records)
    ? records.filter((record) =>
        Boolean(
          record?.change?.summary ||
          record?.outcome?.summary ||
          record?.ownerNotes ||
          record?.adoption?.operationalType !== "none" ||
          record?.recurringWork?.isRecurring ||
          (
            record?.automation?.readiness &&
            record.automation.readiness !== "not-reviewed"
          )
        )
      )
    : [];

  const memorySections = meaningfulRecords.flatMap(
    (record, index) => {
      const lines = [
        `${index + 1}. ${
          record?.change?.summary ||
          "Improvement memory"
        }`,
        `   Outcome: ${formatLabel(
          record?.outcome?.status || "not-evaluated"
        )}`
      ];

      if (record?.outcome?.summary) {
        lines.push(
          `   What happened: ${record.outcome.summary}`
        );
      }

      if (
        record?.adoption?.operationalType &&
        record.adoption.operationalType !== "none"
      ) {
        lines.push(
          `   What this became: ${formatLabel(
            record.adoption.operationalType
          )} · ${formatLabel(
            record.adoption.status || "tested"
          )}`
        );
      }

      if (record?.recurringWork?.isRecurring) {
        lines.push(
          `   Recurring work: ${
            record.recurringWork.frequency ||
            "Frequency not recorded"
          }`
        );

        if (record.recurringWork.trigger) {
          lines.push(
            `   Trigger: ${record.recurringWork.trigger}`
          );
        }

        if (record.recurringWork.responsiblePerson) {
          lines.push(
            `   Responsible: ${
              record.recurringWork.responsiblePerson
            }`
          );
        }

        if (record.recurringWork.expectedResult) {
          lines.push(
            `   Expected result: ${
              record.recurringWork.expectedResult
            }`
          );
        }
      }

      if (record?.ownerNotes) {
        lines.push(
          `   Lessons learned: ${record.ownerNotes}`
        );
      }

      if (
        record?.automation?.readiness &&
        record.automation.readiness !== "not-reviewed"
      ) {
        lines.push(
          `   Future automation readiness: ${formatLabel(
            record.automation.readiness
          )}`
        );

        if (record.automation.notes) {
          lines.push(
            `   Automation notes: ${
              record.automation.notes
            }`
          );
        }
      }

      if (record?.sourceRecommendationTitle) {
        lines.push(
          `   Source recommendation: ${
            record.sourceRecommendationTitle
          }`
        );
      }

      lines.push("");

      return lines;
    }
  );

  return [
    "NILLANINJA BUSINESS DOJO",
    "BUSINESS MEMORY",
    "===============",
    "",
    displayBusinessName,
    `Generated: ${generatedDate}`,
    `${meaningfulRecords.length} ${
      meaningfulRecords.length === 1
        ? "memory"
        : "memories"
    } recorded`,
    "",
    "LEARNED BUSINESS KNOWLEDGE",
    "--------------------------",
    meaningfulRecords.length > 0
      ? memorySections.join("\n").trimEnd()
      : "No Business Memory has been recorded yet."
  ]
    .join("\n")
    .trim();
}


export function createBusinessMemoryFilename(
  businessName = ""
) {
  const safeName = businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "business"}-business-memory.txt`;
}
