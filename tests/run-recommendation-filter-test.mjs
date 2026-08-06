import {
  filterRecommendations,
  getVisibleRecommendations,
  isQuickWin,
  sortFilteredRecommendations
} from "../js/core/recommendation-filters.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const recommendations = [
  {
    id: "shared-passwords",
    priority: "immediate",
    difficulty: "easy",
    relatedCategories: ["security-and-continuity"]
  },
  {
    id: "document-processes",
    priority: "high",
    difficulty: "moderate",
    relatedCategories: ["operations"]
  },
  {
    id: "customer-follow-up",
    priority: "high",
    difficulty: "easy",
    relatedCategories: [
      "customer-experience",
      "sales-and-marketing"
    ]
  },
  {
    id: "future-automation",
    priority: "future",
    difficulty: "advanced",
    relatedCategories: ["technology-and-workflow"]
  }
];

const actionPlan = {
  items: [
    {
      recommendationId: "shared-passwords",
      status: "complete"
    },
    {
      recommendationId: "document-processes",
      status: "in-progress"
    }
  ]
};

assert(
  isQuickWin(recommendations[0]) === true,
  "Immediate and easy recommendation was not identified as a Quick Win."
);

assert(
  isQuickWin(recommendations[1]) === false,
  "Moderate-difficulty recommendation was incorrectly identified as a Quick Win."
);

assert(
  isQuickWin(recommendations[2]) === true,
  "High-priority and easy recommendation was not identified as a Quick Win."
);

const quickWins = filterRecommendations(
  recommendations,
  actionPlan,
  {
    quickWinsOnly: true
  }
);

assert(
  quickWins.length === 2,
  "Quick Wins filter returned the wrong number of recommendations."
);

const completed = filterRecommendations(
  recommendations,
  actionPlan,
  {
    status: "complete"
  }
);

assert(
  completed.length === 1 &&
    completed[0].id === "shared-passwords",
  "Status filter did not return the completed recommendation."
);

const notStarted = filterRecommendations(
  recommendations,
  actionPlan,
  {
    status: "not-started"
  }
);

assert(
  notStarted.length === 2,
  "Recommendations without action items did not default to Not started."
);

const customerCategory = filterRecommendations(
  recommendations,
  actionPlan,
  {
    category: "customer-experience"
  }
);

assert(
  customerCategory.length === 1 &&
    customerCategory[0].id === "customer-follow-up",
  "Category filter did not inspect related categories."
);

const prioritySorted = sortFilteredRecommendations(
  recommendations,
  "priority"
);

assert(
  prioritySorted.map((item) => item.id).join(",") ===
    [
      "shared-passwords",
      "document-processes",
      "customer-follow-up",
      "future-automation"
    ].join(","),
  "Priority sorting returned the wrong order."
);

const difficultySorted = sortFilteredRecommendations(
  recommendations,
  "difficulty"
);

assert(
  difficultySorted.map((item) => item.id).join(",") ===
    [
      "shared-passwords",
      "customer-follow-up",
      "document-processes",
      "future-automation"
    ].join(","),
  "Difficulty sorting returned the wrong order."
);

const combined = getVisibleRecommendations(
  recommendations,
  actionPlan,
  {
    priority: "high",
    sortBy: "difficulty"
  }
);

assert(
  combined.map((item) => item.id).join(",") ===
    ["customer-follow-up", "document-processes"].join(","),
  "Combined filtering and sorting returned the wrong order."
);

console.log("RECOMMENDATION FILTER TESTS");
console.log("Quick Wins rule: pass");
console.log("Status filtering: pass");
console.log("Category filtering: pass");
console.log("Priority sorting: pass");
console.log("Difficulty sorting: pass");
console.log("Combined filtering and sorting: pass");
